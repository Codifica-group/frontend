import { useEffect, useState } from "react";
import { getCategoriasPrdutos } from "../utils/get";
import "../styles/style-dashboard.css";
import SideBar from "../components/SideBar";
import ContainerCategorias from "../components/ContainerCategorias";
import ChartComponent from "../components/ChartComponent";
import ModalGastos from "../components/ModalGastos";
import ModalComparar from "../components/ModalComparar";
import { getDataAtual } from "../utils/util";
import { postDespesa, postProduto } from "../utils/post";

export default function DashboardEleve() {

    const [dataSelecionada, setDataSelecionada] = useState(getDataAtual());

    const [categoriasProdutos, setCategoriasProdutos] = useState([]);
    useEffect(() => {
        document.title = `Dashboard`;
        (async () => {
            try {
                setCategoriasProdutos(await getCategoriasPrdutos());
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        })();
    }, []);

    const [showModalSaida, setShowModalSaida] = useState(false);
    const [novaSaida, setNovaSaida] = useState({
        produto: "",
        categoria: "",
        valor: "",
        data: getDataAtual(),
    });

    const [sugestoesSaida, setSugestoesSaida] = useState([]);

    const handleInputChangeSaida = (e) => {
        const { name, value } = e.target;

        setNovaSaida((prev) => ({ ...prev, [name]: value }));

        if (name === "produto" && value) {
            const todosProdutos = Object.values(categoriasProdutos).flatMap((categoria) =>
                categoria.map((item) => item.nome)
            );
            const filtrados = todosProdutos.filter((produto) =>
                produto.toLowerCase().includes(value.toLowerCase())
            );
            setSugestoesSaida(filtrados);
        } else if (name === "produto") {
            setSugestoesSaida([]);
        }
    };

    const handleSubmitSaida = async (e) => {
        e.preventDefault();

        const valorNumerico = parseFloat(
            novaSaida.valor.replace("R$ ", "").replace(".", "").replace(",", ".")
        );

        const novaSaidaFormatada = {
            ...novaSaida,
            valor: valorNumerico,
        };

        let produtoExistente = null;

        Object.entries(categoriasProdutos).forEach(([categoriaNome, itens]) => {
            const encontrado = itens.find(
                (item) => item.nome.toLowerCase() === novaSaidaFormatada.produto.toLowerCase()
            );
            if (encontrado) {
                produtoExistente = encontrado;
            }
        });

        if (produtoExistente) {
            const novaDespesa = [{
                produtoId: produtoExistente.id,
                valor: novaSaidaFormatada.valor,
                data: novaSaidaFormatada.data,
            }];

            try {
                const response = await postDespesa(novaDespesa);
                console.log("Despesa criada com sucesso:", response);
            } catch (error) {
                console.error("Erro ao criar despesa:", error);
            }
        } else {
            const novoProduto = [{
                categoriaId: parseInt(novaSaidaFormatada.categoria, 10),
                nome: novaSaidaFormatada.produto,
            }];

            console.log("Novo produto criado:", novoProduto);

            try {
                const responseProduto = await postProduto(novoProduto);
                console.log("Produto criado com sucesso:", responseProduto);

                const categoriasAtualizadas = await getCategoriasPrdutos();
                setCategoriasProdutos(categoriasAtualizadas);

                let novoProdutoCriado = null;

                Object.entries(categoriasAtualizadas).forEach(([categoriaNome, itens]) => {
                    const novoProdutoencontrado = itens.find(
                        (item) => item.nome.toLowerCase() === novaSaidaFormatada.produto.toLowerCase()
                    );
                    if (novoProdutoencontrado) {
                        novoProdutoCriado = novoProdutoencontrado;
                    }
                });

                console.log(novoProdutoCriado);

                if (novoProdutoCriado) {
                    const novaDespesa = [{
                        produtoId: novoProdutoCriado.id,
                        valor: novaSaidaFormatada.valor,
                        data: novaSaidaFormatada.data,
                    }];

                    try {
                        const responseDespesa = await postDespesa(novaDespesa);
                        console.log("Despesa criada com sucesso para o novo produto:", responseDespesa);
                    } catch (error) {
                        console.error("Erro ao criar despesa para o novo produto:", error);
                    }
                } else {
                    console.error("Erro: Novo produto não encontrado após atualização.");
                }
            } catch (error) {
                console.error("Erro ao criar produto:", error);
            }
        }

        console.log("Nova saída:", novaSaidaFormatada);

        // Resetar o estado e fechar o modal
        setShowModalSaida(false);
        setNovaSaida({
            produto: "",
            categoria: "",
            valor: "",
            data: getDataAtual(),
        });
    };

    const [showModalComparar, setShowModalComparar] = useState(false);

    const handleSubmitComparar = (e) => {
        e.preventDefault();
        setShowModalComparar(false);
    };

    const [ativo, setAtivo] = useState(false);

    const toggleClasse = () => {
        setAtivo((prev) => !prev);
        setShowModalComparar(true)
    };

    return (
        <div className="dashboard">
            <SideBar selecionado="dashboard" />
            <div className="main">
                <div className="saldo-topo">
                    Saldo Total:
                    <br />
                    R$ 1.000,00
                    <br />
                    <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} />
                </div>

                <div className="bloco-financas-e-graficos">
                    <div className="grafico-coluna">
                        <div className="grafico-container">
                            <button
                                title="Adicionar uma saída"
                                className="btnAddSaida"
                                onClick={() => setShowModalSaida(true)}
                            >
                                +
                            </button>

                            <div className="grafico-titulo saida">Saída: R$ -500,00</div>

                            <div className="grafico-pizza">
                                <ChartComponent
                                    id="graficoSaida"
                                    type="pie"
                                    data={{
                                        labels: ["Aluguel", "Transporte", "Outros"],
                                        datasets: [
                                            {
                                                label: "Saídas",
                                                data: [300, 125, 75],
                                                backgroundColor: ["#c26363", "#f97777", "#ffbcbc"],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="categorias-container">
                            <ContainerCategorias tipo="saida" categorias={categoriasProdutos} dataSelecionada={dataSelecionada} />
                        </div>

                        {showModalSaida && (
                            <ModalGastos
                                tipo="saida"
                                submit={handleSubmitSaida}
                                novoItem={novaSaida}
                                showModal={setShowModalSaida}
                                change={handleInputChangeSaida}
                                sugestoes={sugestoesSaida}
                                setSugestoes={setSugestoesSaida}
                            />
                        )}

                    </div>

                    <div className="grafico-central">
                        <button
                            id="btnBalanca"
                            className={ativo ? "ativo" : ""}
                            onClick={toggleClasse}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="80"
                                height="80"
                                viewBox="0 0 64 64"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Base */}
                                <line x1="10" y1="50" x2="54" y2="50" />

                                {/* Suporte central */}
                                <line x1="32" y1="10" x2="32" y2="50" />
                                <circle cx="32" cy="10" r="2" />

                                {/* Barra horizontal */}
                                <line x1="16" y1="20" x2="48" y2="20" />

                                {/* Cordas e prato esquerdo */}
                                <line x1="16" y1="20" x2="22" y2="35" />
                                <line x1="16" y1="20" x2="10" y2="35" />
                                <path d="M10 35 Q16 40 22 35" />

                                {/* Cordas e prato direito */}
                                <line x1="48" y1="20" x2="54" y2="35" />
                                <line x1="48" y1="20" x2="42" y2="35" />
                                <path d="M42 35 Q48 40 54 35" />
                            </svg>
                        </button>
                        {showModalComparar && (
                            <ModalComparar
                                submit={handleSubmitComparar}
                                showModal={setShowModalComparar}
                            />
                        )}
                    </div>

                    <div className="grafico-coluna">
                        <div className="grafico-container">
                            <button
                                title="Adicionar uma entrada"
                                className="btnAddEntrada"
                                onClick={() => setShowModalEntrada(true)}
                            >
                                +
                            </button>

                            <div className="grafico-titulo entrada">Entrada: R$ 1.500,00</div>

                            <div className="grafico-pizza">
                                <ChartComponent
                                    id="graficoEntrada"
                                    type="pie"
                                    data={{
                                        labels: ["Salário", "Caixinhas", "Outros"],
                                        datasets: [
                                            {
                                                label: "Entradas",
                                                data: [500, 800, 200],
                                                backgroundColor: ["#58873e", "#7dac63", "#ace58d"],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="categorias-container">
                            {/* <ContainerCategorias tipo="entrada" categorias={[4, 5, 6]} /> */}
                        </div>

                        {/* {showModalEntrada && (
                            <ModalGastos 
                            tipo = "entrada" 
                            submit = {handleSubmitEntrada}
                            novoItem = {novaEntrada}
                            showModal = {setShowModalEntrada}
                            change = {handleInputChangeEntrada}/>
                        )} */}

                    </div>
                </div>
            </div>
        </div>
    );
}
