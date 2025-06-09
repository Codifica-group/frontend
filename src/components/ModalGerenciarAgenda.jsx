import { useState, useEffect } from "react";
import { deleteAgenda } from "../utils/delete";
import { putAgenda } from "../utils/put";
import { NumericFormat } from "react-number-format";
import { addHours, format } from "date-fns";
import ModalLoading from "./ModalLoading";
import fecharIcon from "../assets/close.png";
import AlertDelete from "./AlertDelete";

export default function ModalGerenciarAgenda({ event, onClose, recarregarAgendas, setErro }) {
    const [servicos, setServicos] = useState([]);
    const [total, setTotal] = useState("");
    const [form, setForm] = useState({
        dataInicio: "",
        dataFim: "",
    });
    const [deslocamento, setDeslocamento] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando...");
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    useEffect(() => {
        if (!event) return;
        const servicosApi = Array.isArray(event.servicos)
            ? event.servicos.map(s => ({
                ...s,
                valor: s.valor ?? ""
            }))
            : [];
        setServicos(servicosApi);

        setForm({
            dataInicio: event.dataHoraInicio ? event.dataHoraInicio.slice(0, 16) : "",
            dataFim: event.dataHoraFim ? event.dataHoraFim.slice(0, 16) : "",
        });

        setDeslocamento(event.valorDeslocamento ?? "");

        if (typeof event.valorTotal === "number") {
            setTotal(event.valorTotal);
        } else {
            const somaServicos = servicosApi.reduce((acc, s) => acc + (Number(s.valor) || 0), 0);
            setTotal(somaServicos + (Number(event.valorDeslocamento) || 0));
        }
    }, [event]);

    useEffect(() => {
        const somaServicos = servicos.reduce((acc, s) => acc + (Number(s.valor) || 0), 0);
        setTotal((Number(deslocamento) || 0) + somaServicos);
    }, [servicos, deslocamento]);

    const handleServicoChange = (idx, value) => {
        setServicos(prev =>
            prev.map((s, i) => i === idx ? { ...s, valor: value.value === undefined ? "" : value.floatValue } : s)
        );
    };

    const handleDeslocamentoChange = (value) => {
        setDeslocamento(value.value === undefined ? "" : value.floatValue);
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleDataInicioChange = (e) => {
        const value = e.target.value;
        setForm(prev => ({
            ...prev,
            dataInicio: value,
            dataFim: value ? format(addHours(new Date(value), 1), "yyyy-MM-dd'T'HH:mm") : "",
        }));
    };

    // Função para atualizar Agenda
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoadingMsg("Atualizando agenda...");
        setLoading(true);
        try {
            const body = {
                petId: event.pet?.id || event.petId,
                servicos: servicos.map(s => ({
                    id: s.id,
                    valor: s.valor
                })),
                valorDeslocamento: deslocamento,
                dataHoraInicio: form.dataInicio,
                dataHoraFim: form.dataFim
            };
            await putAgenda(event.id, body);
            if (typeof recarregarAgendas === "function") {
                await recarregarAgendas();
            }
            onClose();
        } catch (error) {
            setErro({
                aberto: true,
                mensagem: "Erro ao atualizar Agenda.",
                detalhe: error?.response?.data?.message || error?.message || String(error)
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        setShowDeleteAlert(true);
    };

    // Função para deletar Agenda
    const confirmDelete = async () => {
        setShowDeleteAlert(false);
        setLoadingMsg("Deletando agenda...");
        setLoading(true);
        try {
            await deleteAgenda(event.id);
            if (typeof recarregarAgendas === "function") {
                await recarregarAgendas();
            }
            onClose();
        } catch (error) {
            setErro({
                aberto: true,
                mensagem: "Erro ao deletar Agenda.",
                detalhe: error?.response?.data?.message || error?.message || String(error)
            });
        } finally {
            setLoading(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteAlert(false);
    };

    if (!event) return null;

    return (
        <>
            {loading ? (
                <ModalLoading mensagem={loadingMsg} />)
                : (
                    <div className="modal-overlay">
                        <div className="modal-agenda">
                            <h2>Gerenciar Agendamento</h2>
                            <h3>
                                {event.pet?.nome}
                                {Array.isArray(event.servicos) && event.servicos.length > 0
                                    ? " - " + event.servicos.map(s => s.nome).join(", ")
                                    : ""}
                            </h3>
                            <form>
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
                                {servicos.length > 0 && servicos.map((servico, idx) => (
                                    <div className="form-group" key={servico.id}>
                                        <label>
                                            Valor do {servico.nome}
                                        </label>
                                        <NumericFormat
                                            value={servico.valor}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="R$ "
                                            allowNegative={false}
                                            decimalScale={2}
                                            fixedDecimalScale
                                            onValueChange={val => handleServicoChange(idx, val)}
                                            className="form-control"
                                            placeholder="R$ 0,00"
                                        />
                                    </div>
                                ))}
                                <div className="form-group">
                                    <label style={{ marginBottom: 0 }}>Valor do Deslocamento</label>
                                    <NumericFormat
                                        value={deslocamento}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        prefix="R$ "
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale
                                        onValueChange={handleDeslocamentoChange}
                                        className="form-control"
                                        placeholder="R$ 0,00"
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="total-value">
                                        Total: R$ {Number(total).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div className="modal-buttons">
                                    <button type="button" className="btn-fechar" onClick={onClose}><img src={fecharIcon} alt="Fechar" /></button>
                                    <button type="button" className="btn-excluir" onClick={handleDelete} disabled={loading}>
                                        {loading ? "Deletando..." : "Deletar"}
                                    </button>
                                    <button type="button" className="btn-atualizar-agenda" onClick={handleUpdate}>Atualizar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            {showDeleteAlert && (
                <AlertDelete
                    item={
                        (Array.isArray(event.servicos) && event.servicos.length > 0
                            ? event.servicos.map(s => s.nome).join(", ") + " - "
                            : "") +
                        (event.pet?.nome || "agenda")
                    }
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </>
    );
}