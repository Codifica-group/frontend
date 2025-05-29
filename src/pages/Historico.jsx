import "../styles/style-historico.css";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import TableHistorico from "../components/TableHistorico";
import { getHistorico, getPets, getClientes, getRacas } from "../utils/get";
import { deleteAgenda } from "../utils/delete"; // <-- importe aqui
import { putAgenda } from "../utils/put";       // <-- importe aqui
import Select from "react-select";

const Historico = () => {
    useEffect(() => {
        document.title = `Histórico`;
        // Exemplo: últimos 30 dias
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

    // Função para buscar histórico com todos os filtros
    async function buscarHistorico(filtro) {
        // Monta o array de IDs dos serviços selecionados
        const servicoId = filtro.servico && filtro.servico.length > 0
            ? filtro.servico.map(s => Number(s.value))
            : null; // ou [] se sua API preferir array vazio

        const resultado = await getHistorico({
            dataInicio: filtro.dataInicio,
            dataFim: filtro.dataFim,
            clienteId: filtro.clienteId || null,
            petId: filtro.petId || null,
            racaId: filtro.racaId || null,
            servicoId: servicoId,
        });

        // Ajuste aqui conforme o formato do seu backend:
        const lista = Array.isArray(resultado)
            ? resultado
            : resultado.content || resultado.data || []; // tente acessar o array correto

        console.log("Resultado da API:", lista);

        const filtrado = lista.filter(item => {
            const clienteOk = !filtros.cliente || item.cliente?.nome?.toLowerCase().includes(filtros.cliente.toLowerCase());
            const petOk = !filtros.pet || item.pet?.nome?.toLowerCase().includes(filtros.pet.toLowerCase());
            const racaOk = !filtros.raca || item.pet?.raca?.nome?.toLowerCase().includes(filtros.raca.toLowerCase());
            return clienteOk && petOk && racaOk;
        });

        setDados(mapearDadosParaTabela(filtrado));
    }

    function mapearDadosParaTabela(dados) {
        if (!Array.isArray(dados)) {
            console.error("O backend não retornou um array:", dados);
            return [];
        }
        return dados.map(item => ({
            id: item.id, // Adicione o id aqui!
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
            Valor: item.valor ? `R$${item.valor},00` : "",
        }));
    }

    const servicosOptions = [
        { value: "1", label: "Banho" },
        { value: "2", label: "Tosa" },
        { value: "3", label: "Hidratação" },
    ];

    const [filtros, setFiltros] = useState({
        dataInicio: "",
        dataFim: "",
        clienteId: null,
        petId: null,
        racaId: null,
        servico: [],
    });
    const [dados, setDados] = useState([]);
    const [modalEditar, setModalEditar] = useState({ aberto: false, agenda: null });
    const [modalApagar, setModalApagar] = useState({ aberto: false, id: null });
    const [pets, setPets] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [racas, setRacas] = useState([]);

    // Buscar clientes e raças ao montar o componente
    useEffect(() => {
        getPets().then(setPets);
        getClientes().then(setClientes);
        getRacas().then(res => {
            // Se vier agrupado por porte, transforma em array único
            if (Array.isArray(res)) setRacas(res);
            else if (res && typeof res === "object") {
                // Junta todos os arrays dos portes em um só
                const todasRacas = Object.values(res).flat();
                setRacas(todasRacas);
            } else if (Array.isArray(res?.data)) setRacas(res.data);
            else if (Array.isArray(res?.content)) setRacas(res.content);
            else setRacas([]);
        });
    }, []);

    // Para o Select de pets
    const petOptions = pets.map(pet => ({
        value: pet.id,
        label: pet.nome
    }));

    const clienteOptions = clientes.map(c => ({ value: c.id, label: c.nome }));
    const racaOptions = racas.map(r => ({ value: r.id, label: r.nome }));

    const columns = ["Data", "Hora", "Cliente", "Pet", "Raça", "Serviço", "Valor"];

    const handleEdit = (id) => {
        const agenda = dados.find(d => d.id === id);
        setModalEditar({ aberto: true, agenda });
    };

    const handleDelete = (id) => {
        setModalApagar({ aberto: true, id });
    };

    async function salvarEdicao() {
        if (!modalEditar.agenda) return;
        // Monte o body conforme o esperado pelo backend
        const body = {
            petId: modalEditar.agenda.petId,
            servicosId: modalEditar.agenda.servicosId,
            dataHoraInicio: modalEditar.agenda.dataHoraInicio,
            dataHoraFim: modalEditar.agenda.dataHoraFim,
            valor: modalEditar.agenda.valor,
        };
        await putAgenda(modalEditar.agenda.id, body);
        setModalEditar({ aberto: false, agenda: null });
        buscarHistorico(filtros);
    }

    async function confirmarApagar() {
        if (!modalApagar.id) return;
        await deleteAgenda(modalApagar.id);
        setModalApagar({ aberto: false, id: null });
        // Use sempre os filtros atuais
        buscarHistorico({
            dataInicio: filtros.dataInicio,
            dataFim: filtros.dataFim,
            clienteId: filtros.clienteId || null,
            petId: filtros.petId || null,
            racaId: filtros.racaId || null,
            servico: filtros.servico,
        });
    }

    return (
        <div>
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
                        />

                        <Select
                            options={petOptions}
                            placeholder="Nome Pet"
                            value={petOptions.find(opt => opt.value === filtros.petId) || null}
                            onChange={selected => setFiltros({ ...filtros, petId: selected ? selected.value : null })}
                        />

                        <Select
                            options={racaOptions}
                            placeholder="Raça"
                            value={racaOptions.find(opt => opt.value === filtros.racaId) || null}
                            onChange={selected => setFiltros({ ...filtros, racaId: selected ? selected.value : null })}
                        />

                        <Select
                            isMulti
                            options={servicosOptions}
                            placeholder="Serviço"
                            value={filtros.servico}
                            onChange={selected => setFiltros({
                                ...filtros,
                                servico: selected || []
                            })}
                            classNamePrefix="custom-select"

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
                    columns={[...columns, "Editar", "Apagar"]}
                    data={dados}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {dados.length === 0 && (
                    <div className="flex flex-col items-center justify-center" style={{ marginTop: "5%" }}>
                        {/* Animação SVG */}
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mb-4"
                        >
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
                    <div className="historico-modal-overlay">
                        <div className="historico-modal-box">
                            <h2>Editar Agenda</h2>
                            <label>Pet:</label>
                            <Select
                                options={petOptions}
                                value={petOptions.find(opt => opt.value === modalEditar.agenda.petId) || null}
                                onChange={selected =>
                                    setModalEditar({
                                        ...modalEditar,
                                        agenda: { ...modalEditar.agenda, petId: selected ? selected.value : null }
                                    })
                                }
                                placeholder="Selecione o pet"
                                classNamePrefix="custom-select"
                            />
                            <label>Serviços ID (separados por vírgula):</label>
                            <input
                                type="text"
                                value={Array.isArray(modalEditar.agenda.servicosId) ? modalEditar.agenda.servicosId.join(",") : ""}
                                onChange={e =>
                                    setModalEditar({
                                        ...modalEditar,
                                        agenda: {
                                            ...modalEditar.agenda,
                                            servicosId: e.target.value.split(",").map(Number)
                                        }
                                    })
                                }
                            />
                            <label>Data/Hora Início:</label>
                            <input
                                type="datetime-local"
                                value={modalEditar.agenda.dataHoraInicio?.slice(0, 16)}
                                onChange={e =>
                                    setModalEditar({
                                        ...modalEditar,
                                        agenda: { ...modalEditar.agenda, dataHoraInicio: e.target.value }
                                    })
                                }
                            />
                            <label>Data/Hora Fim:</label>
                            <input
                                type="datetime-local"
                                value={modalEditar.agenda.dataHoraFim?.slice(0, 16)}
                                onChange={e =>
                                    setModalEditar({
                                        ...modalEditar,
                                        agenda: { ...modalEditar.agenda, dataHoraFim: e.target.value }
                                    })
                                }
                            />
                            <label>Valor:</label>
                            <input
                                type="number"
                                value={modalEditar.agenda.valor}
                                onChange={e =>
                                    setModalEditar({
                                        ...modalEditar,
                                        agenda: { ...modalEditar.agenda, valor: Number(e.target.value) }
                                    })
                                }
                            />
                            <div className="historico-modal-buttons">
                                <button className="historico-btn-cancelar" onClick={() => setModalEditar({ aberto: false, agenda: null })}>Cancelar</button>
                                <button className="historico-btn-confirmar-entrada" onClick={salvarEdicao}>Salvar</button>
                            </div>
                        </div>
                    </div>
                )}

                {modalApagar.aberto && (
                    <div className="historico-modal-overlay">
                        <div className="historico-modal-box">
                            <h2>Apagar Agenda</h2>
                            <p>Tem certeza que deseja apagar?</p>
                            <div className="historico-modal-buttons">
                                <button
                                    className="historico-btn-cancelar"
                                    onClick={() => setModalApagar({ aberto: false, id: null })}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="historico-btn-excluir"
                                    onClick={confirmarApagar}
                                >
                                    Apagar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Historico;
