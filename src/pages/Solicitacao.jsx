import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { SolicitacoesTabs } from "../components/solicitacoes";
import { putSolicitacao } from "../utils/put";
import { canPerformActions } from "../utils/solicitacaoUtils";
import NotificationModal from "../components/NotificationModal";
import "../styles/style-solicitacao.css";

const AgendamentoModal = ({ solicitacao, onClose, onStatusUpdate, showNotification }) => {
    const [valores] = useState({
        banho: '35,00',
        tosa: '50,00',
        hidratacao: '15,00',
        deslocamento: '5,00',
    });
    const [mensagemPersonalizada, setMensagemPersonalizada] = useState(false);
    const [loading, setLoading] = useState(false);

    const calcularTotal = () => {
        return Object.values(valores).reduce((total, valor) => {
            const numero = parseFloat(valor.replace(',', '.')) || 0;
            return total + numero;
        }, 0);
    };

    const prepareUpdateData = (originalData, newStatus, valorTotal = null) => {
        // Preparar dados minimos necessários para o PUT
        const updateData = {
            chatId: originalData.chatId,
            petId: originalData.petId || originalData.pet?.id,
            valorDeslocamento: originalData.valorDeslocamento || 0,
            dataHoraInicio: originalData.dataHoraInicio,
            dataHoraFim: originalData.dataHoraFim || null,
            dataHoraSolicitacao: originalData.dataHoraSolicitacao,
            status: newStatus
        };

        // Adicionar valorTotal se fornecido
        if (valorTotal !== null) {
            updateData.valorTotal = valorTotal;
        }

        // Simplificar servicos para apenas os dados essenciais
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
            
            // Debug: ver os dados originais
            console.log('Dados originais da solicitação:', solicitacao.originalData);
            
            // Preparar dados no formato correto
            const updateData = prepareUpdateData(solicitacao.originalData, novoStatus);
            
            console.log('Dados sendo enviados para recusar:', updateData);

            const response = await putSolicitacao(solicitacao.id, updateData);
            console.log('✅ PUT realizado com sucesso:', response);
            
            // Notificar o componente pai sobre a atualização
            if (onStatusUpdate) {
                onStatusUpdate();
            }
            
            showNotification('success', "Solicitação recusada com sucesso!");
            onClose();
        } catch (error) {
            console.error("Erro ao recusar solicitação:", error);
            console.error("Detalhes do erro:", error.response?.data);
            showNotification('error', "Erro ao recusar solicitação. Tente novamente.");
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
            
            // Determinar o próximo status baseado no status atual
            let novoStatus;
            let mensagemSucesso;
            
            if (solicitacao.status === 'Aguardando orçamento') {
                novoStatus = 'ACEITO_PELO_USUARIO';
                mensagemSucesso = "Oferta enviada com sucesso!";
            } else if (solicitacao.status === 'Aguardando Aprovação') {
                novoStatus = 'APROVADO';
                mensagemSucesso = "Solicitação aprovada com sucesso!";
            } else {
                showNotification('warning', "Status não permite esta ação.");
                return;
            }
            
            // Debug: ver os dados originais
            console.log('Dados originais da solicitação:', solicitacao.originalData);
            console.log('Status atual:', solicitacao.status);
            console.log('Novo status será:', novoStatus);
            
            // Preparar dados no formato correto incluindo o valor total
            const updateData = prepareUpdateData(solicitacao.originalData, novoStatus, calcularTotal());
            
            console.log('Dados sendo enviados para aceitar:', updateData);

            const response = await putSolicitacao(solicitacao.id, updateData);
            console.log('✅ PUT realizado com sucesso:', response);
            
            // Notificar o componente pai sobre a atualização
            if (onStatusUpdate) {
                onStatusUpdate();
            }
            
            showNotification('success', mensagemSucesso);
            onClose();
        } catch (error) {
            console.error("Erro ao enviar oferta:", error);
            console.error("Detalhes do erro:", error.response?.data);
            showNotification('error', "Erro ao enviar oferta. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const showActionButtons = canPerformActions(solicitacao.status);
    
    // Determinar o texto do botão baseado no status
    const getButtonText = () => {
        if (loading) return "Processando...";
        
        if (solicitacao.status === 'Aguardando orçamento') {
            return "Enviar oferta";
        } else if (solicitacao.status === 'Aguardando Aprovação') {
            return "Aprovar oferta";
        }
        return "Aceitar";
    };

    // Função para obter a classe CSS do status no modal
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
                    <h2>Valor Agendamento</h2>
                    <p>{solicitacao.pet} - {solicitacao.servicos}</p>
                    <p className={`modal-status ${getModalStatusClass(solicitacao.status)}`}>
                        <strong>Status atual:</strong> {solicitacao.status}
                    </p>
                </div>
                <div className="solicitacao-modal-body">
                    <div className="datetime-inputs">
                        <div className="form-group">
                            <label>Início do Atendimento</label>
                            <input type="datetime-local" defaultValue="2025-09-15T14:00" />
                        </div>
                        <div className="form-group">
                            <label>Fim do Atendimento</label>
                            <input type="datetime-local" defaultValue="2025-09-15T15:00" />
                        </div>
                    </div>
                    {Object.keys(valores).map(servico => (
                        <div className="form-group" key={servico}>
                            <label>Valor do {servico.charAt(0).toUpperCase() + servico.slice(1)}</label>
                            <input 
                                type="text" 
                                value={`R$ ${valores[servico]}`}
                                readOnly
                            />
                        </div>
                    ))}
                    <div className="total-display">
                        Total: R$ {calcularTotal().toFixed(2).replace('.', ',')}
                    </div>
                    <div className="checkbox-group">
                        <input 
                            type="checkbox" 
                            id="msg-personalizada" 
                            checked={mensagemPersonalizada}
                            onChange={() => setMensagemPersonalizada(!mensagemPersonalizada)}
                        />
                        <label htmlFor="msg-personalizada">Mensagem personalizada</label>
                    </div>
                    {mensagemPersonalizada && (
                        <textarea placeholder="..."></textarea>
                    )}
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
    
    // Estados para modal de notificação
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: 'info',
        message: ''
    });
    
    useEffect(() => {
        document.title = "Solicitação de Serviços";
    }, []);

    const handleCardClick = (solicitacao) => {
        setSelectedSolicitacao(solicitacao);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSolicitacao(null);
    };

    const handleStatusUpdate = () => {
        // Trigger refresh of all components
        setRefreshTrigger(prev => prev + 1);
        handleCloseModal();
    };

    // Funções para modal de notificação
    const showNotification = (type, message) => {
        setNotificationModal({
            isOpen: true,
            type,
            message
        });
    };

    const closeNotification = () => {
        setNotificationModal({
            isOpen: false,
            type: 'info',
            message: ''
        });
    };

    // Usar o componente de tabs
    const tabsData = SolicitacoesTabs({
        onCardClick: handleCardClick,
        currentPage,
        setCurrentPage,
        refreshTrigger
    });

    const totalPages = tabsData.totalPages;

    // Lógica de Paginação
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
                    <h1 className="page-title">SOLICITAÇÕES DE SERVIÇO</h1>
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
        </>
    );
}