import "../styles/style-historico.css";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import TableHistorico from "../components/TableHistorico";
import { getHistorico, getPets, getClientes, getRacas } from "../utils/get";
import Select from "react-select";
import ModalLoading from "../components/ModalLoading";
import ModalGerenciarAgenda from "../components/ModalGerenciarAgenda";
import AlertErro from "../components/AlertErro";

const Historico = () => {
    useEffect(() => {
        document.title = `Histórico`;
        const hoje = new Date();
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(hoje.getDate() - 30);

        const dataInicio = trintaDiasAtras.toISOString().slice(0, 10);
        const dataFim = hoje.toISOString().slice(0, 10);

        setFiltros(f => ({ ...f, dataInicio, dataFim }));

        buscarHistorico({
            dataInicio,
            dataFim,
            clienteId: null,
            petId: null,
            racaId: null,
            servicoId: [],
        });
    }, []);

    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando...");
    const [erro, setErro] = useState({ aberto: false, mensagem: "", detalhe: "" });

    const [filtros, setFiltros] = useState({
        dataInicio: "",
        dataFim: "",
        clienteId: null,
        petId: null,
        racaId: null,
        servico: [],
    });

    const [dados, setDados] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [paginaInput, setPaginaInput] = useState(""); // Input da página
    const itensPorPagina = 10;

    const [modalEditar, setModalEditar] = useState({ aberto: false, agenda: null });
    const [pets, setPets] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [racas, setRacas] = useState([]);

    async function buscarHistorico(filtro) {
        setLoadingMsg("Buscando histórico...");
        setLoading(true);
        try {
            const servicoId = filtro.servico && filtro.servico.length > 0
                ? filtro.servico.map(s => Number(s.value))
                : null;

            const resultado = await getHistorico({
                dataInicio: filtro.dataInicio,
                dataFim: filtro.dataFim,
                clienteId: filtro.clienteId || null,
                petId: filtro.petId || null,
                racaId: filtro.racaId || null,
                servicoId: servicoId,
            });

            const lista = Array.isArray(resultado)
                ? resultado
                : resultado.content || resultado.data || [];

            const filtrado = lista.filter(item => {
                const clienteOk = !filtros.cliente || item.cliente?.nome?.toLowerCase().includes(filtros.cliente?.toLowerCase() || "");
                const petOk = !filtros.pet || item.pet?.nome?.toLowerCase().includes(filtros.pet?.toLowerCase() || "");
                const racaOk = !filtros.raca || item.pet?.raca?.nome?.toLowerCase().includes(filtros.raca?.toLowerCase() || "");
                return clienteOk && petOk && racaOk;
            });

            setDados(mapearDadosParaTabela(filtrado));
            setPaginaAtual(1);
        } catch (error) {
            setErro({
                aberto: true,
                mensagem: "Erro ao buscar histórico",
                detalhe: error?.response?.data?.message || error?.message || String(error)
            });
        } finally {
            setLoading(false);
        }
    }

    function mapearDadosParaTabela(dados) {
        if (!Array.isArray(dados)) return [];
        const ordenado = [...dados].sort((a, b) => new Date(a.dataHoraInicio) - new Date(b.dataHoraInicio));
        return ordenado.map(item => ({
            id: item.id,
            Data: item.dataHoraInicio ? item.dataHoraInicio.slice(0, 10).split('-').reverse().join('/') : "",
            Hora: item.dataHoraInicio && item.dataHoraFim
                ? `${item.dataHoraInicio.slice(11, 16)} - ${item.dataHoraFim.slice(11, 16)}`
                : "",
            Cliente: item.cliente?.nome || "",
            Pet: item.pet?.nome || "",
            Raça: item.pet?.raca?.nome || "",
            Serviço: Array.isArray(item.servicos)
                ? item.servicos.map(s => s.nome).join(", ")
                : (item.servicos?.nome || ""),
            Valor: item.valorTotal !== undefined && item.valorTotal !== null
                ? `R$ ${Number(item.valorTotal).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "",
            _original: item
        }));
    }

    const servicosOptions = [
        { value: "1", label: "Banho" },
        { value: "2", label: "Tosa" },
        { value: "3", label: "Hidratação" },
    ];

    useEffect(() => {
        setLoadingMsg("Carregando dados...");
        setLoading(true);
        try {
            getPets().then(setPets);
            getClientes().then(setClientes);
            getRacas().then(res => {
                if (Array.isArray(res)) setRacas(res);
                else if (res && typeof res === "object") {
                    const todasRacas = Object.values(res).flat();
                    setRacas(todasRacas);
                } else if (Array.isArray(res?.data)) setRacas(res.data);
                else if (Array.isArray(res?.content)) setRacas(res.content);
                else setRacas([]);
            });
        } catch (error) {
            setErro({
                aberto: true,
                mensagem: "Erro ao carregar dados",
                detalhe: error?.message || String(error)
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const petOptions = pets.map(pet => ({ value: pet.id, label: pet.nome }));
    const clienteOptions = clientes.map(c => ({ value: c.id, label: c.nome }));
    const racaOptions = racas.map(r => ({ value: r.id, label: r.nome }));

    const columns = ["Data", "Hora", "Cliente", "Pet", "Raça", "Serviço", "Valor"];
    const tamanhoColunas = ["0.1%", "7.4%", "17%", "15%", "10%", "11%", "6%"];

    const handleEdit = (item) => {
        setModalEditar({ aberto: true, agenda: item });
    };

    // Paginação
    const totalPaginas = Math.ceil(dados.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const dadosPagina = dados.slice(inicio, inicio + itensPorPagina);

    const irParaPagina = () => {
        const numero = parseInt(paginaInput);
        if (!isNaN(numero) && numero >= 1 && numero <= totalPaginas) {
            setPaginaAtual(numero);
            setPaginaInput("");
        } else {
            alert(`Digite um número entre 1 e ${totalPaginas}`);
        }
    };

    return (
        <div className="historico-root">
            {loading && <ModalLoading mensagem={loadingMsg} />}
            <SideBar selecionado="historico" />

            <div className="content">
                <h1 className="titulo">Histórico</h1>
                <div className="filter-container">
                    <div className="filter-section">
                        <label htmlFor="start-date">Data Início:</label>
                        <input
                            type="date"
                            id="start-date"
                            value={filtros.dataInicio}
                            onChange={e => setFiltros({ ...filtros, dataInicio: e.target.value })}
                        />

                        <label htmlFor="end-date">Data Fim:</label>
                        <input
                            type="date"
                            id="end-date"
                            value={filtros.dataFim}
                            onChange={e => setFiltros({ ...filtros, dataFim: e.target.value })}
                        />
                    </div>

                    <div className="filter-section">
                        <Select
                            options={clienteOptions}
                            placeholder="Nome Cliente"
                            value={clienteOptions.find(opt => opt.value === filtros.clienteId) || null}
                            onChange={selected => setFiltros({ ...filtros, clienteId: selected ? selected.value : null })}
                            isClearable
                        />

                        <Select
                            options={petOptions}
                            placeholder="Nome Pet"
                            value={petOptions.find(opt => opt.value === filtros.petId) || null}
                            onChange={selected => setFiltros({ ...filtros, petId: selected ? selected.value : null })}
                            isClearable
                        />

                        <Select
                            options={racaOptions}
                            placeholder="Raça"
                            value={racaOptions.find(opt => opt.value === filtros.racaId) || null}
                            onChange={selected => setFiltros({ ...filtros, racaId: selected ? selected.value : null })}
                            isClearable
                        />

                        <Select
                            isMulti
                            options={servicosOptions}
                            placeholder="Serviço"
                            value={filtros.servico}
                            onChange={selected => setFiltros({ ...filtros, servico: selected || [] })}
                            classNamePrefix="custom-select"
                            isClearable
                        />

                        <button
                            disabled={!filtros.dataInicio || !filtros.dataFim}
                            onClick={() => {
                                buscarHistorico({
                                    dataInicio: filtros.dataInicio,
                                    dataFim: filtros.dataFim,
                                    clienteId: filtros.clienteId || null,
                                    petId: filtros.petId || null,
                                    racaId: filtros.racaId || null,
                                    servico: filtros.servico,
                                });
                            }}
                        >
                            Filtrar
                        </button>
                    </div>
                </div>

                <TableHistorico
                    columns={[...columns, "Editar"]}
                    columnWidths={tamanhoColunas}
                    data={dadosPagina}
                    onEdit={row => handleEdit(row._original || row)}
                />

                {dados.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "8px" }}>
                        <button
                            onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                            disabled={paginaAtual === 1}
                            style={{
                                background: "#307E95",
                                color: "#fff",
                                border: "none",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                cursor: paginaAtual === 1 ? "not-allowed" : "pointer"
                            }}
                        >
                            {"<"}
                        </button>

                        <span style={{ alignSelf: "center", fontWeight: "600" }}>
                            Página {paginaAtual} de {totalPaginas}
                        </span>

                        <button
                            onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                            disabled={paginaAtual === totalPaginas}
                            style={{
                                background: "#307E95",
                                color: "#fff",
                                border: "none",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer"
                            }}
                        >
                            {">"}
                        </button>

                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "10px" }}>
                            <label style={{ fontWeight: "600" }}>Ir para:</label>
                            <input
                                type="number"
                                min="1"
                                max={totalPaginas}
                                value={paginaInput}
                                onChange={(e) => setPaginaInput(e.target.value)}
                                style={{
                                    width: "60px",
                                    padding: "4px",
                                    textAlign: "center",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc"
                                }}
                            />
                            <button
                                onClick={irParaPagina}
                                style={{
                                    background: "#307E95",
                                    color: "#fff",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                Ir
                            </button>
                        </div>
                    </div>
                )}

                {dados.length === 0 && (
                    <div className="flex flex-col items-center justify-center" style={{ marginTop: "5%" }}>
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="mb-4">
                            <g>
                                <ellipse cx="12" cy="19" rx="7" ry="2" fill="#e0e0e0">
                                    <animate attributeName="rx" values="7;9;7" dur="1.2s" repeatCount="indefinite" />
                                </ellipse>
                                <path d="M12 3a7 7 0 0 1 7 7c0 3.87-3.13 7-7 7s-7-3.13-7-7a7 7 0 0 1 7-7z" fill="#f5f5f5" />
                                <circle cx="9" cy="10" r="1" fill="#bdbdbd" />
                                <circle cx="15" cy="10" r="1" fill="#bdbdbd" />
                                <path d="M9 14c1.333 1 4.667 1 6 0" stroke="#bdbdbd" strokeWidth="1" strokeLinecap="round" fill="none" />
                            </g>
                        </svg>
                        <div className="text-lg text-gray-500 mt-2 font-medium tracking-wide text-center">
                            Nenhum dado encontrado para os filtros selecionados.
                        </div>
                    </div>
                )}

                {modalEditar.aberto && modalEditar.agenda && (
                    <ModalGerenciarAgenda
                        event={modalEditar.agenda}
                        onClose={() => setModalEditar({ aberto: false, agenda: null })}
                        recarregarAgendas={() => buscarHistorico(filtros)}
                        setErro={setErro}
                    />
                )}

                {erro.aberto && (
                    <AlertErro
                        mensagem={erro.mensagem}
                        erro={erro.detalhe}
                        onClose={() => setErro({ aberto: false, mensagem: "", detalhe: "" })}
                    />
                )}
            </div>
        </div>
    );
};

export default Historico;
