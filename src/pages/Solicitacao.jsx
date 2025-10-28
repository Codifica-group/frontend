import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { SolicitacoesTabs } from "../components/solicitacoes";
import { putSolicitacao } from "../utils/put";
import { canPerformActions } from "../utils/solicitacaoUtils";
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
    const valorDeslocamento = dadosOriginais.valorDeslocamento || 0;
    const [deslocamento, setDeslocamento] = useState(solicitacao.originalData?.valorDeslocamento || 0);
    const deslocamentoInfo = solicitacao.originalData?.deslocamento || {};
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
        servicos.map(s => ({ id: s.id, nome: s.nome, valor: s.valor }))
    );
    
    const valoresOriginais = {
        dataInicio: formatarDataParaInput(dataHoraInicio),
        dataFim: dataHoraFim ? formatarDataParaInput(dataHoraFim) : calcularDataHoraFim(formatarDataParaInput(dataHoraInicio)),
        servicos: servicos.map(s => ({ id: s.id, valor: s.valor })),
        deslocamento: valorDeslocamento
    };

    const [foiAlterado, setFoiAlterado] = useState(false);

    useEffect(() => {
        let alterado = false;
        
        if (dataInicio !== valoresOriginais.dataInicio) alterado = true;
        if (dataFim !== valoresOriginais.dataFim) alterado = true;
        
        if (deslocamento !== valoresOriginais.deslocamento) alterado = true;
        
        for (let i = 0; i < valoresServicos.length; i++) {
            if (valoresServicos[i].valor !== valoresOriginais.servicos[i]?.valor) {
                alterado = true;
                break;
            }
        }
        
        setFoiAlterado(alterado);
    }, [dataInicio, dataFim, valoresServicos, deslocamento, valoresOriginais.dataInicio, valoresOriginais.dataFim, valoresOriginais.deslocamento, valoresOriginais.servicos]);

    const handleDataInicioChange = (e) => {
        const value = e.target.value;
        setDataInicio(value);
        setDataFim(value ? calcularDataHoraFim(value) : '');
    };

    const handleValorServicoChange = (index, value) => {
        const novosValores = [...valoresServicos];
        novosValores[index].valor = value.value === undefined ? "" : value.floatValue;
        setValoresServicos(novosValores);
        setFoiAlterado(true);
    };

    const handleDeslocamentoChange = (value) => {
        setDeslocamento(value.value === undefined ? "" : value.floatValue);
        setFoiAlterado(true);
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
            valorDeslocamento: originalData.valorDeslocamento || 0,
            dataHoraInicio: novaDataInicio || originalData.dataHoraInicio,
            dataHoraFim: novaDataFim || originalData.dataHoraFim || null,
            dataHoraSolicitacao: originalData.dataHoraSolicitacao,
            status: newStatus
        };

        if (valorTotal !== null) {
            updateData.valorTotal = valorTotal;
        }

        if (originalData.servicos && Array.isArray(originalData.servicos)) {
            updateData.servicos = originalData.servicos.map(servico => {
                if (typeof servico === 'object' && servico.id) {
                    return {
                        id: servico.id,
                        valor: servico.valor || 0
                    };
                }
                return servico;
            });
        }

        return updateData;
    };

    const handleRecusar = async () => {
        if (!canPerformActions(solicitacao.status)) {
            showNotification('warning', "Esta solicitação não pode ser recusada no status atual.");
            return;
        }

        try {
            setLoading(true);
            const novoStatus = 'RECUSADO_PELO_USUARIO';
            
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

    const handleAtualizarValores = async () => {
        try {
            setLoading(true);
            
            const dataInicioISO = dataInicio ? new Date(dataInicio).toISOString() : null;
            const dataFimISO = dataFim ? new Date(dataFim).toISOString() : null;
            
            const updateData = {
                chatId: dadosOriginais.chatId,
                petId: dadosOriginais.petId || dadosOriginais.pet?.id,
                servicos: valoresServicos.map(s => ({
                    id: s.id,
                    valor: s.valor
                })),
                valorDeslocamento: deslocamento,
                dataHoraInicio: dataInicioISO,
                dataHoraFim: dataFimISO,
                dataHoraSolicitacao: dadosOriginais.dataHoraSolicitacao,
                status: dadosOriginais.status
            };

            await putSolicitacao(solicitacao.id, updateData);
            
            showNotification('success', "Valores atualizados com sucesso!");
            
            setFoiAlterado(false);
            
            if (onStatusUpdate) {
                onStatusUpdate();
            }
            onClose();
        } catch {
            showNotification('error', "Erro ao atualizar valores. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleEnviarOferta = async () => {
        if (!canPerformActions(solicitacao.status)) {
            showNotification('warning', "Esta solicitação não pode ser aceita no status atual.");
            return;
        }

        try {
            setLoading(true);
            
            let novoStatus;
            let mensagemSucesso;
            
            if (solicitacao.status === 'Aguardando orçamento') {
                novoStatus = 'ACEITO_PELO_PETSHOP';
                mensagemSucesso = "Oferta enviada com sucesso!";
            } else if (solicitacao.status === 'Aguardando Aprovação') {
                novoStatus = 'ACEITO_PELO_CLIENTE';
                mensagemSucesso = "Solicitação aprovada com sucesso!";
            } else {
                showNotification('warning', "Status não permite esta ação.");
                return;
            }
            
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

            await putSolicitacao(solicitacao.id, updateData);
            
            if (onStatusUpdate) {
                onStatusUpdate();
            }
            
            showNotification('success', mensagemSucesso);
            onClose();
        } catch {
            showNotification('error', "Erro ao enviar oferta. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const showActionButtons = canPerformActions(solicitacao.status);
    
    const getButtonText = () => {
        if (loading) return "Processando...";
        
        if (foiAlterado) {
            return "Atualizar";
        }
        
        if (solicitacao.status === 'Aguardando orçamento') {
            return "Enviar oferta";
        } else if (solicitacao.status === 'Aguardando Aprovação') {
            return "Aprovar oferta";
        }
        return "Aceitar";
    };

    const handleBotaoPrincipal = () => {
        if (foiAlterado) {
            handleAtualizarValores();
        } else {
            handleEnviarOferta();
        }
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
                                onChange={(e) => {
                                    handleDataInicioChange(e);
                                    setFoiAlterado(true);
                                }}
                                disabled={!canPerformActions(solicitacao.status)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Fim do Atendimento</label>
                            <input 
                                type="datetime-local" 
                                value={dataFim}
                                onChange={(e) => {
                                    setDataFim(e.target.value);
                                    setFoiAlterado(true);
                                }}
                                disabled={!canPerformActions(solicitacao.status)}
                            />
                        </div>
                    </div>
                    
                    {/* Exibir serviços reais da solicitação com valores editáveis */}
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
                                disabled={!canPerformActions(solicitacao.status)}
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
                                disabled={!canPerformActions(solicitacao.status)}
                                style={{ marginTop: '1vh' }}
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
                            onClick={handleBotaoPrincipal}
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
                // Chama calcularServico para preencher os campos de valores
                const petId = solicitacao.pet?.id || solicitacao.originalData?.pet?.id;
                const servicos = (solicitacao.originalData?.servicos || solicitacao.servicos || []).map(s => ({ id: s.id }));
                if (petId && servicos.length > 0) {
                    const { calcularServico } = await import("../utils/agenda");
                    const resultado = await calcularServico({ petId, servicos });
                    // Preenche os campos do modal com os valores recebidos
                    setSelectedSolicitacao({
                        ...solicitacao,
                        valorDeslocamento: resultado.deslocamento?.valor ?? 0,
                        valorTotal: resultado.valor ?? 0,
                        servicos: resultado.servico || [],
                        originalData: {
                            ...solicitacao.originalData,
                            valorDeslocamento: resultado.deslocamento?.valor ?? 0,
                            valorTotal: resultado.valor ?? 0,
                            servicos: resultado.servico || [],
                        }
                    });
                } else {
                    setSelectedSolicitacao(solicitacao);
                }
            } catch (error) {
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
        setNotificationModal({
            isOpen: false,
            type: 'info',
            message: ''
        });
    };

    const closeAlertSucesso = () => {
        setAlertSucesso({
            isOpen: false,
            mensagem: ''
        });
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
            {loading && <ModalLoading mensagem={loadingMsg} />}
        </>
    );
}