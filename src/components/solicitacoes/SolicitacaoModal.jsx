import { useState } from "react";
import { putSolicitacao } from "../../utils/put";
import { canPerformActions } from "../../utils/solicitacaoUtils";
import ModalLoading from "../ModalLoading";
import { NumericFormat } from "react-number-format";
import fecharIcon from "../../assets/close.png";

const calcularDataHoraFim = (dataInicio) => {
    if (!dataInicio) return '';
    const [datePart, timePart] = dataInicio.split('T');
    const [hours, minutes] = timePart.split(':');
    let novaHora = parseInt(hours, 10) + 1;

    if (novaHora >= 24) {
        const data = new Date(datePart);
        data.setDate(data.getDate() + 1);
        novaHora = novaHora - 24;
        const novaData = data.toISOString().split('T')[0];
        return `${novaData}T${String(novaHora).padStart(2, '0')}:${minutes}`;
    }
    return `${datePart}T${String(novaHora).padStart(2, '0')}:${minutes}`;
};

const formatarDataParaInput = (dataISO) => {
    if (!dataISO) return '';
    if (dataISO.length === 16 && dataISO.includes('T')) {
        return dataISO;
    }
    return dataISO.replace('Z', '').slice(0, 16);
};

const SolicitacaoModal = ({ solicitacao, onClose, onStatusUpdate, showNotification }) => {
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando...");

    const dadosOriginais = solicitacao.originalData || {};
    const servicos = dadosOriginais.servicos || [];
    const valorDeslocamentoOriginal = dadosOriginais.valorDeslocamento ?? 0;
    const deslocamentoInfo = dadosOriginais.deslocamento || {};
    const dataHoraInicio = dadosOriginais.dataHoraInicio || '';
    const dataHoraFim = dadosOriginais.dataHoraFim || '';

    const [deslocamento, setDeslocamento] = useState(valorDeslocamentoOriginal);
    const [dataInicio, setDataInicio] = useState(formatarDataParaInput(dataHoraInicio));
    const [dataFim, setDataFim] = useState(() => 
        dataHoraFim ? formatarDataParaInput(dataHoraFim) : (dataHoraInicio ? calcularDataHoraFim(formatarDataParaInput(dataHoraInicio)) : '')
    );
    const [valoresServicos, setValoresServicos] = useState(
        servicos.map(s => ({ id: s.id, nome: s.nome, valor: s.valor ?? "" }))
    );

    const handleDataInicioChange = (e) => {
        const value = e.target.value;
        setDataInicio(value);
        setDataFim(value ? calcularDataHoraFim(value) : '');
    };

    const handleValorServicoChange = (index, value) => {
        const novosValores = [...valoresServicos];
        novosValores[index].valor = value.value === undefined ? "" : value.floatValue;
        setValoresServicos(novosValores);
    };

    const handleDeslocamentoChange = (value) => {
        setDeslocamento(value.value === undefined ? "" : value.floatValue);
    };

    const calcularTotal = () => {
        const totalServicos = valoresServicos.reduce((total, servico) => total + (servico.valor || 0), 0);
        return totalServicos + (deslocamento || 0);
    };

    const prepareUpdateData = (newStatus, valorTotal = null, novaDataInicio = null, novaDataFim = null) => {
        return {
            chatId: dadosOriginais.chatId,
            petId: dadosOriginais.petId || dadosOriginais.pet?.id,
            servicos: valoresServicos.map(s => ({
                id: s.id,
                valor: s.valor !== undefined ? s.valor : 0
            })),
            valorDeslocamento: deslocamento !== undefined ? deslocamento : 0,
            dataHoraInicio: novaDataInicio || dadosOriginais.dataHoraInicio,
            dataHoraFim: novaDataFim || dadosOriginais.dataHoraFim || null,
            dataHoraSolicitacao: dadosOriginais.dataHoraSolicitacao,
            status: newStatus,
            ...(valorTotal !== null && { valorTotal: valorTotal })
        };
    };

    const handleRecusar = async () => {
        if (!canPerformActions(solicitacao.status) || solicitacao.status === 'Aguardando Aprovação') {
            showNotification('warning', "Esta solicitação não pode ser recusada no status atual.");
            return;
        }

        try {
            setLoading(true);
            setLoadingMsg("Recusando solicitação...");
            const updateData = prepareUpdateData('RECUSADO_PELO_PETSHOP');
            await putSolicitacao(solicitacao.id, updateData);
            
            onStatusUpdate(); 
            showNotification('success', "Solicitação recusada com sucesso!");
            onClose();
        } catch (err) {
            showNotification('error', `Erro ao recusar solicitação: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEnviarOferta = async () => {
        if (!canPerformActions(solicitacao.status) || solicitacao.status === 'Aguardando Aprovação') {
            showNotification('warning', "Esta solicitação não pode ser processada no status atual.");
            return;
        }

        try {
            setLoading(true);
            setLoadingMsg("Enviando oferta...");

            let dataFimFinal = dataFim;
            if (!dataFimFinal && dataInicio) {
                dataFimFinal = calcularDataHoraFim(dataInicio);
                setDataFim(dataFimFinal);
            }

            const updateData = prepareUpdateData(
                'ACEITO_PELO_PETSHOP',
                calcularTotal(),
                dataInicio,
                dataFimFinal
            );

            await putSolicitacao(solicitacao.id, updateData);
            
            onStatusUpdate(); 
            showNotification('success', "Oferta enviada com sucesso!");
            onClose();
        } catch (error) {
            console.error("Erro ao enviar oferta:", error.response || error);
            showNotification('error', `Erro ao enviar oferta: ${error.response?.data?.message || error.message || 'Tente novamente.'}`);
        } finally {
            setLoading(false);
        }
    };

    const showActionButtons = canPerformActions(solicitacao.status) && solicitacao.status !== 'Aguardando Aprovação';
    const isAguardandoOrcamento = solicitacao.status === 'Aguardando orçamento';

    const getButtonText = () => (loading ? "Processando..." : "Enviar oferta");

    const getModalStatusClass = (status) => {
        const statusMap = {
            'Aguardando orçamento': 'modal-status-aguardando-orcamento',
            'Aguardando Aprovação': 'modal-status-aguardando-aprovacao',
            'Aprovado': 'modal-status-aprovado',
            'Recusado': 'modal-status-recusado',
            'Recusado pelo Cliente': 'modal-status-recusado'
        };
        return statusMap[status] || '';
    };

    return (
        <div className="solicitacao-modal-overlay">
            <div className="solicitacao-modal-content">
                {loading && <ModalLoading mensagem={loadingMsg} />}
                <button className="btn-fechar" onClick={onClose}><img src={fecharIcon} alt="Fechar" /></button>
                <div className="solicitacao-modal-header">
                    <h2>Gerenciar Agendamento</h2>
                    <h3>{dadosOriginais.cliente?.nome || solicitacao.cliente} - {dadosOriginais.pet?.nome || solicitacao.pet} - <span className={getModalStatusClass(solicitacao.status)}>{solicitacao.status}</span></h3>
                </div>
                <div className="solicitacao-modal-body">
                    <div className="datetime-inputs">
                        <div className="form-group">
                            <label>Início do Atendimento</label>
                            <input
                                type="datetime-local"
                                value={dataInicio}
                                onChange={handleDataInicioChange}
                                disabled={!isAguardandoOrcamento}
                            />
                        </div>
                        <div className="form-group">
                            <label>Fim do Atendimento</label>
                            <input
                                type="datetime-local"
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                                disabled={!isAguardandoOrcamento}
                            />
                        </div>
                    </div>

                    {valoresServicos.map((servico, index) => (
                        <div className="form-group" key={servico.id}>
                            <label>Valor do {servico.nome}</label>
                            <NumericFormat
                                value={servico.valor}
                                onValueChange={val => handleValorServicoChange(index, val)}
                                thousandSeparator="." decimalSeparator="," prefix="R$ "
                                allowNegative={false} decimalScale={2} fixedDecimalScale
                                className="form-control" placeholder="R$ 0,00"
                                disabled={!isAguardandoOrcamento}
                            />
                        </div>
                    ))}

                    <div className="form-group">
                        <label style={{ marginBottom: 0 }}>Valor do Deslocamento</label>
                        {Number(deslocamentoInfo?.distanciaKm) > 0 && Number(deslocamentoInfo?.tempo) > 0 && (
                            <span style={{ display: 'block', fontSize: '0.9em', color: '#555', marginBottom: '5px' }}>
                                Distancia: {Number(deslocamentoInfo.distanciaKm).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} KM | Tempo: {
                                    (() => {
                                        const tempo = Number(deslocamentoInfo.tempo) || 0;
                                        const minutos = Math.floor(tempo);
                                        const segundos = Math.round((tempo - minutos) * 60);
                                        return `${minutos}:${segundos.toString().padStart(2, "0")} ${minutos !== 1 ? "Minutos" : "Minuto"}`;
                                    })()
                                }
                            </span>
                        )}
                        <NumericFormat
                            value={deslocamento}
                            onValueChange={handleDeslocamentoChange}
                            thousandSeparator="." decimalSeparator="," prefix="R$ "
                            allowNegative={false} decimalScale={2} fixedDecimalScale
                            className="form-control" placeholder="R$ 0,00"
                            disabled={!isAguardandoOrcamento}
                        />
                    </div>

                    <div className="form-group">
                        <div className="total-value">
                            Total: R$ {Number(calcularTotal()).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>
                {showActionButtons && (
                    <div className="solicitacao-modal-footer">
                        <button className="btn-recusar" onClick={handleRecusar} disabled={loading}>
                            {loading ? "Processando..." : "Recusar"}
                        </button>
                        <button className="btn-enviar" onClick={handleEnviarOferta} disabled={loading}>
                            {getButtonText()}
                        </button>
                    </div>
                )}
                {!showActionButtons && (
                    <div className="solicitacao-modal-footer">
                        <p className="status-info">Esta solicitação não permite mais ações.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolicitacaoModal;