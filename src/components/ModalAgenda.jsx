import { useEffect, useState } from "react";
import Select from "react-select";
import { getPets, getServicos } from "../utils/get";
import { exibirAgendas, calcularServico } from "../utils/agenda";
import { addMinutes, addHours, format, parseISO, max, set } from "date-fns";
import ModalValorAgenda from "./ModalValorAgenda";
import { postAgenda } from "../utils/post";
import ModalLoading from "./ModalLoading";
import AlertErro from "./AlertErro";
import "../styles/style-agenda.css";

export default function ModalAgenda(props) {
    const [pets, setPets] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [form, setForm] = useState({
        cliente: null,
        pet: null,
        servicos: [],
        raca: "",
        dataInicio: "",
        dataFim: "",
        observacao: "",
    });
    const [modalValor, setModalValor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando...");

    // Preenche horários iniciais ao abrir o modal
    useEffect(() => {
        async function preencherHorariosIniciais() {
            const agendas = await exibirAgendas();
            const hoje = new Date();
            const hojeStr = format(hoje, "yyyy-MM-dd");
            const eventosHoje = agendas.filter(ev =>
                format(parseISO(ev.start), "yyyy-MM-dd") === hojeStr
            );
            let inicio;
            if (eventosHoje.length > 0) {
                const maiorFim = max(eventosHoje.map(ev => parseISO(ev.end)));
                inicio = addMinutes(maiorFim, 1);
            } else {
                inicio = hoje;
            }
            const inicioStr = format(inicio, "yyyy-MM-dd'T'HH:mm");
            const fimStr = format(addHours(inicio, 1), "yyyy-MM-dd'T'HH:mm");
            setForm(prev => ({
                ...prev,
                dataInicio: inicioStr,
                dataFim: fimStr,
            }));
        }
        getPets().then(res => setPets(res));
        getServicos().then(res => setServicos(res));
        preencherHorariosIniciais();
    }, []);

    // Gera lista de clientes únicos a partir dos pets
    const clienteMap = {};
    pets.forEach(pet => {
        if (pet.cliente && !clienteMap[pet.cliente.id]) {
            clienteMap[pet.cliente.id] = { value: pet.cliente.id, label: pet.cliente.nome };
        }
    });
    const clienteOptions = Object.values(clienteMap);

    // Filtra pets conforme cliente selecionado
    const petOptions = pets
        .filter(pet => !form.cliente || pet.cliente?.id === form.cliente.value)
        .map(pet => ({ value: pet.id, label: pet.nome, cliente: pet.cliente }));

    const servicoOptions = servicos.map(s => ({ value: s.id, label: s.nome }));

    // Ao selecionar cliente, filtra pet
    const handleClienteChange = (option) => {
        setForm(prev => {
            let pet = prev.pet;
            if (pet && pets.find(p => p.id === pet.value)?.cliente?.id !== option?.value) {
                pet = null;
            }
            return { ...prev, cliente: option, pet };
        });
    };

    // Ao selecionar pet, preenche cliente automaticamente
    const handlePetChange = (option) => {
        const petObj = pets.find(p => p.id === option?.value);
        const cliente = petObj?.cliente
            ? { value: petObj.cliente.id, label: petObj.cliente.nome }
            : null;
        setForm(prev => ({
            ...prev,
            pet: option,
            cliente: cliente || prev.cliente,
        }));
    };

    // Ao alterar o começo do atendimento, preenche fim automaticamente (+1h)
    const handleDataInicioChange = (e) => {
        const value = e.target.value;
        setForm(prev => ({
            ...prev,
            dataInicio: value,
            dataFim: value ? format(addHours(new Date(value), 1), "yyyy-MM-dd'T'HH:mm") : "",
        }));
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    //Envia request para calcular serviço
    const handleSubmit = async (e) => {
        e.preventDefault();
        const petId = form.pet?.value;
        const servicos = Array.isArray(form.servicos)
            ? form.servicos.map(s => ({ id: s.value }))
            : [];

        if (!petId) {
            props.setErro({
                aberto: true,
                mensagem: "Selecione um pet.",
                detalhe: ""
            });
            return;
        }

        if (servicos.length === 0) {
            props.setErro({
                aberto: true,
                mensagem: "Selecione pelo menos um serviço.",
                detalhe: ""
            });
            return;
        }

        setLoadingMsg("Calculando serviço...");
        setLoading(true);
        try {
            const resultado = await calcularServico({ petId, servicos });
            setModalValor({
                servicos: resultado.servico || [],
                deslocamento: resultado.deslocamento || { valor: 0 },
                valor: resultado.valor || 0
            });
        } catch (error) {
            alert("Erro ao calcular serviço:\n" + (error?.message || String(error)));
            props.setErro({
                aberto: true,
                mensagem: "Erro ao calcular serviço.",
                detalhe: error?.message || String(error)
            });
            console.error("Erro ao calcular serviço:", error);
        } finally {
            setLoading(false);
        }
    };

    // Função para salvar o agenda após confirmação no modal de valores
    const handleSalvarAgendamento = async (dados) => {
        if (!dados) return;

        const body = {
            petId: form.pet?.value,
            servicos: dados.servicos.map(s => ({
                id: s.id,
                valor: s.valor
            })),
            dataHoraInicio: form.dataInicio,
            dataHoraFim: form.dataFim
        };

        setLoadingMsg("Salvando agenda...");
        setLoading(true);
        try {
            setModalValor(null);
            await postAgenda(body);
            props.showModal(false);
            if (props.recarregarAgendas) {
                props.recarregarAgendas();
            }
        } catch (error) {
            alert("Erro ao salvar agendamento:\n" + (error?.message || String(error)));
            props.setErro({
                aberto: true,
                mensagem: "Erro ao salvar agendamento!",
                detalhe: error?.message || String(error)
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (modalValor) {
        return (
            <ModalValorAgenda
                valores={modalValor}
                onClose={() => setModalValor(null)}
                onSalvar={handleSalvarAgendamento}
            />
        );
    }

    return (
        <>
            {loading ? (
                <ModalLoading mensagem={loadingMsg} />)
                : (
                    <div className="modal-overlay">
                        <div className="modal-agenda">
                            <h2>Novo Agendamento</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-agenda-inputs">
                                    <div className="campos-agenda">
                                        <label>Cliente</label>
                                        <Select
                                            options={clienteOptions}
                                            value={form.cliente}
                                            onChange={handleClienteChange}
                                            placeholder="Selecione o cliente"
                                            isClearable
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                                <div className="form-agenda-inputs">
                                    <div className="campos-agenda">
                                        <label>Pet</label>
                                        <Select
                                            options={petOptions}
                                            value={form.pet}
                                            onChange={handlePetChange}
                                            placeholder="Selecione o pet"
                                            isClearable
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                                <div className="form-agenda-inputs">
                                    <div className="campos-agenda">
                                        <label>Serviços</label>
                                        <Select
                                            options={servicoOptions}
                                            value={form.servicos}
                                            onChange={options => handleChange("servicos", options)}
                                            placeholder="Selecione os serviços"
                                            isMulti
                                            isClearable
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                                <div className="form-inputs">
                                    <div className="form-group">
                                        <label>Início do Atendimento</label>
                                        <input
                                            type="datetime-local"
                                            value={form.dataInicio}
                                            onChange={handleDataInicioChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Fim do Atendimento</label>
                                        <input
                                            type="datetime-local"
                                            value={form.dataFim}
                                            onChange={e => handleChange("dataFim", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Falta add campo obs no backend */}
                                {/* <div className="form-agenda-inputs">
                        <div className="campos-agenda">
                            <label>Observação</label>
                            <input
                                type="text"
                                placeholder="Detalhes do atendimento do pet"
                                value={form.observacao}
                                onChange={e => handleChange("observacao", e.target.value)}
                            />
                        </div>
                    </div> */}
                                <div className="modal-buttons">
                                    <button type="button" onClick={() => props.showModal(false)} className="btn-cancelar">Cancelar</button>
                                    <button type="submit" className="btn-atualizar-agenda">Calcular Serviço</button>
                                </div>
                            </form>
                        </div >
                    </div >
                )
            }
        </>
    );
}