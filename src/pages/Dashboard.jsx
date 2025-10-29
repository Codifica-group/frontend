import { useEffect, useState } from "react";
import { getDespesas, getServicos, getProdutos, getCategorias, getAgendas } from "../utils/get";
import "../styles/style-dashboard.css";
import SideBar from "../components/SideBar";
import ContainerCategorias from "../components/ContainerCategorias";
import ChartComponent from "../components/ChartComponent";
import ModalGastos from "../components/ModalGastos";
import ModalComparar from "../components/ModalComparar";
import { getDataAtual } from "../utils/util";
import { postLucro } from "../utils/post";
import { subDays, format, set } from "date-fns";
import saldoDisponivel from "../assets/saldo-disponivel.png";
import info from "../assets/info.png";
import lucroImage from "../assets/lucro.png";
import ModalLoading from "../components/ModalLoading";
import AlertErro from "../components/AlertErro";

export default function DashboardEleve() {
    const [dataSelecionada, setDataSelecionada] = useState(getDataAtual());
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
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
    const [agendas, setAgendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState({ aberto: false, mensagem: "", detalhe: "" });


    useEffect(() => {
        document.title = `Dashboard`;
        (async () => {
            try {
                setCategorias(await getCategorias());
                setProdutos(await getProdutos());
                const despesasRes = await getDespesas();
                setDespesas(despesasRes.dados);
                setLucro(await postLucro({ "dataInicio": dataSelecionada, "dataFim": dataSelecionada }))
                setLucroMensal(await postLucro({ "dataInicio": format(subDays(new Date(dataSelecionada), 29), "yyyy-MM-dd"), "dataFim": dataSelecionada }));
                setServicos(await getServicos());
                const agendasRes = await getAgendas();
                setAgendas(agendasRes.dados);
            } catch (error) {
                setErro({
                    aberto: true,
                    mensagem: "Erro ao carregar produtos.",
                    detalhe: error?.response?.data?.message || error?.message || String(error)
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                setLucro(await postLucro({ "dataInicio": dataSelecionada, "dataFim": dataSelecionada }))
                setLucroMensal(await postLucro({ "dataInicio": format(subDays(new Date(dataSelecionada), 29), "yyyy-MM-dd"), "dataFim": dataSelecionada }));
            } catch (error) {
                setErro({
                    aberto: true,
                    mensagem: "Erro ao carregar produtos.",
                    detalhe: error?.response?.data?.message || error?.message || String(error)
                });
            }
            finally {
                setLoading(false);
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
            {loading ? (<ModalLoading />) : null}
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
                                {/* <button className="kpi-action-button" onClick={toggleClasse}>
                                    <span role="img" aria-label="ícone balança" className="icon-balance">⚖️</span> Comparar
                                </button>

                                {showModalComparar && (
                                    <ModalComparar
                                        submit={handleSubmitComparar}
                                        showModal={setShowModalComparar}
                                        setErro={setErro}
                                    />
                                )} */}
                                <button
                                    className="btn-novo"
                                    onClick={() => setShowModalSaida(true)}
                                >
                                    + Nova Saída
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
                                    dados={despesas}
                                    data={{
                                        labels: categorias.map(c => c.nome),
                                        datasets: [
                                            {
                                                label: "Saídas",
                                                data: despesas.length === 0
                                                    ? []
                                                    : categorias.map(categoria => {
                                                        const produtosDaCategoria = produtos.filter(
                                                            p => p.categoria?.id === categoria.id
                                                        );
                                                        const idsProdutos = produtosDaCategoria.map(p => p.id);
                                                        return despesas
                                                            .filter(
                                                                d =>
                                                                    d.data === dataSelecionada &&
                                                                    idsProdutos.includes(d.produto?.id)
                                                            )
                                                            .reduce((soma, d) => soma + Number(d.valor), 0);
                                                    }),
                                                backgroundColor: ["#c26363", "#f97777", "#ffbcbc", "#ffdddd", "#b0c4de", "#ace58d"],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                    dataSelecionada={dataSelecionada}
                                />
                            </div>
                        </div>
                        <div className="categorias-container">
                            <ContainerCategorias
                                tipo="saida"
                                categorias={categorias}
                                dataSelecionada={dataSelecionada}
                                despesas={despesas}
                                produtos={produtos}
                                setDespesas={setDespesas}
                                setProdutos={setProdutos}
                            />
                        </div>
                        {showModalSaida && (
                            <ModalGastos
                                tipo="saida"
                                novoItem={novaSaida}
                                setNovoItem={setNovaSaida}
                                showModal={setShowModalSaida}
                                despesas={despesas}
                                categorias={categorias}
                                produtos={produtos}
                                setDespesas={setDespesas}
                                setProdutos={setProdutos}
                                setErro={setErro}
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
                                    dados={agendas}
                                    data={{
                                        labels: servicos.map(servico => servico.nome),
                                        datasets: [
                                            {
                                                label: "Entradas",
                                                data: servicos.map(servico =>
                                                    agendas.filter(agenda => agenda.dataHoraInicio.startsWith(dataSelecionada))
                                                        .reduce((soma, agenda) => (
                                                            soma +
                                                            agenda.servicos
                                                                .filter(s => s.id === servico.id)
                                                                .reduce((acc, s) => acc + Number(s.valor), 0)
                                                        ), 0)
                                                ),
                                                backgroundColor: ["#58873e", "#7dac63", "#ace58d"],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                    dataSelecionada={dataSelecionada}
                                />
                            </div>
                        </div>
                        <div className="categorias-container">
                            <ContainerCategorias
                                tipo="entrada"
                                categorias={servicos}
                                dataSelecionada={dataSelecionada}
                                despesas={agendas}
                                produtos={produtos}
                                setDespesas={setAgendas}
                                setProdutos={setServicos}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {erro.aberto && (
                <AlertErro
                    mensagem={erro.mensagem}
                    erro={erro.detalhe}
                    onClose={() => setErro({ aberto: false, mensagem: "", detalhe: "" })}
                />
            )}
        </div>
    );
}
