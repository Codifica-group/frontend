import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { SolicitacoesTabs } from "../components/solicitacoes";
import { putSolicitacao } from "../utils/put";
import { canPerformActions, formatServices } from "../utils/solicitacaoUtils";
import NotificationModal from "../components/NotificationModal";
import AlertSucesso from "../components/AlertSucesso";
import ModalLoading from "../components/ModalLoading";
import { NumericFormat } from "react-number-format";
import "../styles/style-solicitacao.css";


const AgendamentoModal = ({ solicitacao, onClose, onStatusUpdate, showNotification }) => {
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando...");

    const dadosOriginais = solicitacao.originalData || {};
    const servicos = dadosOriginais.servicos || [];
    const valorDeslocamentoOriginal = dadosOriginais.valorDeslocamento ?? 0;

    const [deslocamento, setDeslocamento] = useState(valorDeslocamentoOriginal);
    const deslocamentoInfo = dadosOriginais.deslocamento || {};
    const dataHoraInicio = dadosOriginais.dataHoraInicio || '';
    const dataHoraFim = dadosOriginais.dataHoraFim || '';

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

    const [dataInicio, setDataInicio] = useState(
        formatarDataParaInput(dataHoraInicio)
    );
    const [dataFim, setDataFim] = useState(() => {
        if (dataHoraFim) {
            return formatarDataParaInput(dataHoraFim);
        }
        if (dataHoraInicio) {
            return calcularDataHoraFim(formatarDataParaInput(dataHoraInicio));
        }
        return '';
    });

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
        const totalServicos = valoresServicos.reduce((total, servico) => {
            return total + (servico.valor || 0);
        }, 0);
        return totalServicos + (deslocamento || 0);
    };

    const prepareUpdateData = (originalData, newStatus, valorTotal = null, novaDataInicio = null, novaDataFim = null) => {
        const updateData = {
            chatId: originalData.chatId,
            petId: originalData.petId || originalData.pet?.id,
            servicos: valoresServicos.map(s => ({
                id: s.id,
                valor: s.valor !== undefined ? s.valor : 0
            })),
            valorDeslocamento: deslocamento !== undefined ? deslocamento : 0,
            dataHoraInicio: novaDataInicio || originalData.dataHoraInicio,
            dataHoraFim: novaDataFim || originalData.dataHoraFim || null,
            dataHoraSolicitacao: originalData.dataHoraSolicitacao,
            status: newStatus
        };

        if (valorTotal !== null) {
            updateData.valorTotal = valorTotal;
        }

        return updateData;
    };


    const handleRecusar = async () => {
        if (!canPerformActions(solicitacao.status) || solicitacao.status === 'Aguardando Aprovação') {
            showNotification('warning', "Esta solicitação não pode ser recusada no status atual.");
            return;
        }

        try {
            setLoading(true);
            const novoStatus = 'RECUSADO_PELO_PETSHOP';

            const updateData = prepareUpdateData(solicitacao.originalData, novoStatus);

            await putSolicitacao(solicitacao.id, updateData);

            if (onStatusUpdate) {
                onStatusUpdate();
            }

            showNotification('success', "Solicitação recusada com sucesso!");
            onClose();
        } catch {
            showNotification('error', "Erro ao recusar solicitação. Tente novamente.");
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

            const novoStatus = 'ACEITO_PELO_PETSHOP';
            const mensagemSucesso = "Oferta enviada com sucesso!";

            let dataFimFinal = dataFim;
            if (!dataFimFinal && dataInicio) {
                dataFimFinal = calcularDataHoraFim(dataInicio);
                setDataFim(dataFimFinal);
            }

            const dataInicioISO = dataInicio ? new Date(dataInicio).toISOString() : null;
            const dataFimISO = dataFimFinal ? new Date(dataFimFinal).toISOString() : null;

            const updateData = prepareUpdateData(
                solicitacao.originalData,
                novoStatus,
                calcularTotal(),
                dataInicioISO,
                dataFimISO
            );

            console.log("Dados enviados para putSolicitacao:", updateData);

            await putSolicitacao(solicitacao.id, updateData);

            if (onStatusUpdate) {
                onStatusUpdate();
            }

            showNotification('success', mensagemSucesso);
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

    const getButtonText = () => {
        if (loading) return "Processando...";
        return "Enviar oferta";
    };

    const getModalStatusClass = (status) => {
        const statusMap = {
            'Aguardando orçamento': 'modal-status-aguardando-orcamento',
            'Aguardando Aprovação': 'modal-status-aguardando-aprovacao',
            'Aprovado': 'modal-status-aprovado',
            'Recusado': 'modal-status-recusado'
        };
        return statusMap[status] || '';
    };

     return (
        <div className="solicitacao-modal-overlay">
            <div className="solicitacao-modal-content">
                <button className="solicitacao-modal-close-button" onClick={onClose}>&times;</button>
                <div className="solicitacao-modal-header">
                    <h2>Gerenciar Agendamento</h2>
                    <p>
                        <strong>Cliente:</strong> {dadosOriginais.cliente?.nome || solicitacao.cliente || 'Não informado'}
                    </p>
                    <p>
                        <strong>Pet:</strong> {dadosOriginais.pet?.nome || solicitacao.pet || 'Não informado'}
                        {dadosOriginais.pet?.raca?.nome && ` - ${dadosOriginais.pet.raca.nome}`}
                    </p>
                    <p className="modal-status">
                        <strong>Status atual:</strong> <span className={getModalStatusClass(solicitacao.status)}>{solicitacao.status}</span>
                    </p>
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
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="R$ "
                                allowNegative={false}
                                decimalScale={2}
                                fixedDecimalScale
                                onValueChange={val => handleValorServicoChange(index, val)}
                                className="form-control"
                                placeholder="R$ 0,00"
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
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            allowNegative={false}
                            decimalScale={2}
                            fixedDecimalScale
                            onValueChange={handleDeslocamentoChange}
                            className="form-control"
                            placeholder="R$ 0,00"
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
                        <button
                            className="btn-recusar"
                            onClick={handleRecusar}
                            disabled={loading}
                        >
                            {loading ? "Processando..." : "Recusar"}
                        </button>
                        <button
                            className="btn-enviar"
                            onClick={handleEnviarOferta}
                            disabled={loading}
                        >
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
             {loading && <ModalLoading mensagem={loadingMsg} />}
        </div>
    );
};


const Pagination = ({ totalPages, currentPage, paginate, nextPage, prevPage, firstPage, lastPage }) => {
    const [inputValue, setInputValue] = useState(currentPage);

    useEffect(() => {
        setInputValue(currentPage);
    }, [currentPage]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const goToPage = () => {
        const pageNumber = parseInt(inputValue, 10);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            paginate(pageNumber);
        } else {
            setInputValue(currentPage);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            goToPage();
        }
    };

    const pageNumbers = [];
    let startPage, endPage;
    if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 1 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination-container">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button onClick={firstPage} className="page-link" disabled={currentPage === 1}>
                        &lt;&lt;
                    </button>
                </li>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button onClick={prevPage} className="page-link" disabled={currentPage === 1}>
                        &lt;
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button onClick={nextPage} className="page-link" disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </li>
                 <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button onClick={lastPage} className="page-link" disabled={currentPage === totalPages}>
                        &gt;&gt;
                    </button>
                </li>
            </ul>
             <div className="pagination-input-container">
                <input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    min="1"
                    max={totalPages}
                />
                <span>de {totalPages}</span>
                <button onClick={goToPage} className="pagination-go-button">Ir</button>
            </div>
        </div>
    );
};


export default function Solicitacao() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando...");


    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: 'info',
        message: ''
    });

    const [alertSucesso, setAlertSucesso] = useState({
        isOpen: false,
        mensagem: ''
    });

    useEffect(() => {
        document.title = "Solicitação de Serviços";
    }, []);

    const handleCardClick = (solicitacao) => {
        (async () => {
            if (solicitacao.status === 'Aguardando orçamento') {
                setLoadingMsg("Calculando serviço...");
                setLoading(true);
                try {
                    const petId = solicitacao.originalData?.pet?.id || solicitacao.pet?.id;
                    const servicosBase = solicitacao.originalData?.servicos || [];
                    const servicosIds = servicosBase.map(s => ({ id: s.id }));

                    if (petId && servicosIds.length > 0) {
                        const { calcularServico } = await import("../utils/agenda");
                        const resultado = await calcularServico({ petId, servicos: servicosIds });

                        const updatedOriginalData = {
                            ...solicitacao.originalData,
                            valorDeslocamento: resultado.deslocamento?.valor ?? 0,
                            valorTotal: resultado.valor ?? 0,
                            servicos: (resultado.servico || []).map(serv => ({
                                id: serv.id,
                                nome: serv.nome || servicosBase.find(s => s.id === serv.id)?.nome || '',
                                valor: serv.valor ?? 0
                            })),
                            deslocamento: resultado.deslocamento
                        };

                        setSelectedSolicitacao({
                            ...solicitacao,
                            originalData: updatedOriginalData
                        });

                    } else {
                        setSelectedSolicitacao(solicitacao);
                    }
                } catch (error) {
                    console.error("Erro ao calcular serviço:", error);
                    showNotification('error', `Erro ao calcular valores: ${error.message}`);
                    setSelectedSolicitacao(solicitacao);
                } finally {
                    setLoading(false);
                }
            } else {
                setSelectedSolicitacao(solicitacao);
            }
            setIsModalOpen(true);
        })();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSolicitacao(null);
    };

    const handleStatusUpdate = () => {
        setRefreshTrigger(prev => prev + 1);
        handleCloseModal();
    };

     const showNotification = (type, message) => {
        if (type === 'success') {
            setAlertSucesso({
                isOpen: true,
                mensagem: message
            });
        } else {
            setNotificationModal({
                isOpen: true,
                type,
                message
            });
        }
    };


    const closeNotification = () => {
        setNotificationModal({ isOpen: false, type: 'info', message: '' });
    };

    const closeAlertSucesso = () => {
        setAlertSucesso({ isOpen: false, mensagem: '' });
    };

     const tabsData = SolicitacoesTabs({
        onCardClick: handleCardClick,
        currentPage,
        setCurrentPage,
        refreshTrigger
    });

    const totalPages = tabsData.totalPages;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    const firstPage = () => setCurrentPage(1);
    const lastPage = () => setCurrentPage(totalPages);


    return (
        <>
            <div className="solicitacao-container">
                <SideBar selecionado="solicitacao" />
                <main className="solicitacao-main">
                    <h1 className="page-title">SOLICITAÇÕES DE SERVIÇOS</h1>
                      {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            paginate={paginate}
                            nextPage={nextPage}
                            prevPage={prevPage}
                            firstPage={firstPage}
                            lastPage={lastPage}
                        />
                    )}
                    {tabsData.component}
                </main>
            </div>
            {isModalOpen && selectedSolicitacao && (
                <AgendamentoModal
                    solicitacao={selectedSolicitacao}
                    onClose={handleCloseModal}
                    onStatusUpdate={handleStatusUpdate}
                    showNotification={showNotification}
                />
            )}
            {loading && <ModalLoading mensagem={loadingMsg} />}
             <NotificationModal
                isOpen={notificationModal.isOpen}
                type={notificationModal.type}
                message={notificationModal.message}
                onClose={closeNotification}
            />
            {alertSucesso.isOpen && (
                <AlertSucesso
                    mensagem={alertSucesso.mensagem}
                    onClose={closeAlertSucesso}
                />
            )}
        </>
    );
}