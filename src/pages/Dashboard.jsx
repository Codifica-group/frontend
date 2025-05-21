import { useEffect, useState } from "react";
import { getCategoriasPrdutos, getDespesas } from "../utils/get";
import "../styles/style-dashboard.css";
import SideBar from "../components/SideBar";
import ContainerCategorias from "../components/ContainerCategorias";
import ChartComponent from "../components/ChartComponent";
import ModalGastos from "../components/ModalGastos";
import ModalComparar from "../components/ModalComparar";
import { getDataAtual } from "../utils/util";

export default function DashboardEleve() {

    const [dataSelecionada, setDataSelecionada] = useState(getDataAtual());
    const [categoriasProdutos, setCategoriasProdutos] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const [showModalSaida, setShowModalSaida] = useState(false);
    const [novaSaida, setNovaSaida] = useState({
        produto: "",
        categoria: "",
        valor: "",
        data: getDataAtual(),
    });
    
    useEffect(() => {
        document.title = `Dashboard`;
        (async () => {
            try {
                setCategoriasProdutos(await getCategoriasPrdutos());
                setDespesas(await getDespesas());
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        })();
    }, []);

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
                            <ContainerCategorias 
                                tipo="saida" 
                                categorias={categoriasProdutos} 
                                setCategorias={setCategoriasProdutos}
                                dataSelecionada={dataSelecionada}
                                despesas={despesas}
                                setDespesas={setDespesas}
                            />
                        </div>

                        {showModalSaida && (
                            <ModalGastos
                                tipo="saida"
                                novoItem={novaSaida}
                                setNovoItem={setNovaSaida}
                                showModal={setShowModalSaida}
                                despesas={despesas}
                                setDespesas={setDespesas}
                                categorias={categoriasProdutos}
                                setCategorias={setCategoriasProdutos}
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
