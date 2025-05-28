import { use, useEffect, useState } from "react";
import { getCategoriasPrdutos, getDespesas, getServicos } from "../utils/get";
import "../styles/style-dashboard.css";
import SideBar from "../components/SideBar";
import ContainerCategorias from "../components/ContainerCategorias";
import ChartComponent from "../components/ChartComponent";
import ModalGastos from "../components/ModalGastos";
import ModalComparar from "../components/ModalComparar";
import { getDataAtual } from "../utils/util";
import { postLucro, postVerificacao } from "../utils/post";
import { subDays, format } from "date-fns";
import saldoDisponivel from "../assets/saldo-disponivel.png";
import info from "../assets/info.png";
import lucroImage from "../assets/lucro.png";

export default function DashboardEleve() {
    const [dataSelecionada, setDataSelecionada] = useState(getDataAtual());
    const [categoriasProdutos, setCategoriasProdutos] = useState({});
    const [despesas, setDespesas] = useState([]);
    const [showModalSaida, setShowModalSaida] = useState(false);
    const [novaSaida, setNovaSaida] = useState({
        produto: "",
        categoria: "",
        valor: "",
        data: getDataAtual(),
    });
    const [lucro, setLucro] = useState();
    const [lucroMensal, setLucroMensal] = useState();
    const [servicos, setServicos] = useState([]);

    useEffect(() => {
        document.title = `Dashboard`;
        (async () => {
            try {
                setCategoriasProdutos(await getCategoriasPrdutos());
                setDespesas(await getDespesas());
                setLucro(await postLucro({"dataInicio": dataSelecionada, "dataFim": dataSelecionada}))
                setLucroMensal(await postLucro({"dataInicio": format(subDays(new Date(dataSelecionada), 29), "yyyy-MM-dd"), "dataFim": dataSelecionada}));
                setServicos(await getServicos());
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setLucro(await postLucro({"dataInicio": dataSelecionada, "dataFim": dataSelecionada}))
                setLucroMensal(await postLucro({"dataInicio": format(subDays(new Date(dataSelecionada), 29), "yyyy-MM-dd"), "dataFim": dataSelecionada}));
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        })();
    }, [despesas, dataSelecionada]);

    const [showModalComparar, setShowModalComparar] = useState(false);

    const handleSubmitComparar = (e) => {
        e.preventDefault();
        setShowModalComparar(false);
    };

    const [ativo, setAtivo] = useState(false);

    const toggleClasse = () => {
        setAtivo((prev) => !prev);
        setShowModalComparar(true);
    };

    return (
        <div className="dashboard">
            <SideBar selecionado="dashboard" />
            <div className="main">
                <header className="kpi-header-container">
                    <div className="kpi-date-display">
                        <input
                            type="date"
                            value={dataSelecionada}
                            onChange={e => setDataSelecionada(e.target.value)}
                        />
                    </div>
                    <div className="kpi-content-area">
                        <div className="kpi-cards-section">
                            <div className="kpi-card">
                                <div className="kpi-card-title">
                                    <img className="icon-info" src={info} alt="ⓘ" />
                                    <span>Saldo Disponível</span>
                                    <img className="icon-eye" src={saldoDisponivel} alt="$" />
                                    <div className="tooltip-container">
                                        <span className="tooltip-text">Saldo disponível no baseado na entrada menos a saída</span>
                                    </div>
                                </div>
                                <div className="kpi-card-value">
                                    {lucro?.total !== undefined
                                        ? `R$ ${Number(lucro.total).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : "Carregando..."}
                                </div>
                            </div>
                            <div className="kpi-actions-section">
                                <button className="kpi-action-button" onClick={toggleClasse}>
                                    <span role="img" aria-label="ícone balança" className="icon-balance">⚖️</span> Comparar
                                </button>

                                {showModalComparar && (
                                    <ModalComparar
                                        submit={handleSubmitComparar}
                                        showModal={setShowModalComparar}
                                    />
                                )}
                                <button
                                    className="kpi-action-button"
                                    onClick={() => setShowModalSaida(true)}
                                >
                                    Adicionar Saída
                                </button>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-card-title">
                                    <img className="icon-info" src={info} alt="ⓘ" />
                                    <span>Lucro dos últimos 30 dias</span>
                                    <img className="icon-chart" src={lucroImage} alt="📊" />
                                    <div className="tooltip-container">
                                        <span className="tooltip-text">Lucro que foi gerado nos últimos 30 dias</span>
                                    </div>
                                </div>
                                <div className="kpi-card-value">
                                    {lucroMensal?.total !== undefined
                                        ? `R$ ${Number(lucroMensal.total).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : "Carregando..."}
                                </div>
                            </div>
                        </div>

                    </div>
                </header>

                <div className="bloco-financas-e-graficos">
                    <div className="grafico-coluna">
                        <div className="grafico-container">

                            <div className="grafico-titulo saida">
                                {lucro?.saida !== undefined
                                    ? `Saída: R$ -${Number(lucro.saida).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : "Carregando..."}
                            </div>
                            <div className="grafico-pizza">
                                <ChartComponent
                                    id="graficoSaida"
                                    type="pie"
                                    data={{
                                        labels: Object.keys(categoriasProdutos),
                                        datasets: [
                                            {
                                                label: "Saídas",
                                                data: despesas.length === 0
                                                    ? []
                                                    : Object.keys(categoriasProdutos).map(categoriaNome => {
                                                        const idsProdutos = (categoriasProdutos[categoriaNome] || []).map(prod => prod.id);
                                                        return despesas
                                                            .filter(
                                                                despesa =>
                                                                    despesa.data === dataSelecionada &&
                                                                    idsProdutos.includes(despesa.produto?.id)
                                                            )
                                                            .reduce((soma, despesa) => soma + Number(despesa.valor), 0);
                                                    }),
                                                backgroundColor: ["#c26363", "#f97777", "#ffbcbc", "#ffdddd", "#b0c4de", "#ace58d"],
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

                    <div className="grafico-coluna">
                        <div className="grafico-container">

                            <div className="grafico-titulo entrada">
                                {lucro?.entrada !== undefined
                                    ? `Entrada: R$ ${Number(lucro.entrada).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : "Carregando..."}
                            </div>
                            <div className="grafico-pizza">
                                <ChartComponent
                                    id="graficoEntrada"
                                    type="pie"
                                    data={{
                                        labels: servicos.map(servico => servico.nome),
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
                            {/* <ContainerCategorias tipo="entrada" categorias={categoriasProdutos} dataSelecionada={dataSelecionada} /> */}
                            {/* Exemplo de como poderia ser, ajuste conforme sua necessidade */}
                        </div>
                        {/* {showModalEntrada && (
                            <ModalGastos 
                                tipo="entrada" 
                                submit={handleSubmitEntrada} // Definir handleSubmitEntrada
                                novoItem={novaEntrada} // Definir novaEntrada
                                showModal={setShowModalEntrada} // Passar setShowModalEntrada
                                change={handleInputChangeEntrada} // Definir handleInputChangeEntrada
                            />
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
}
