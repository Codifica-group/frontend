import { useEffect, useState, useCallback } from "react";
import SideBar from "../components/SideBar";
import SolicitacaoModal from "../components/solicitacoes/SolicitacaoModal";
import Pagination from "../components/common/Pagination";
import NotificationModal from "../components/NotificationModal";
import AlertSucesso from "../components/AlertSucesso";
import ModalLoading from "../components/ModalLoading";
import { calcularServico } from "../utils/agenda";
import "../styles/style-solicitacao.css";
import { usePagination } from "../hooks/usePagination";
import { useNotifications } from "../hooks/useNotifications";

import SolicitacoesTabs from "../components/solicitacoes/SolicitacoesTabs";
import { Todos, AguardandoOrcamento, AguardandoAprovacao, Aprovados, Recusados } from "../components/solicitacoes";

export default function Solicitacao() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando...");
    
    const [activeTab, setActiveTab] = useState('Todos');
    const [activeTotalPages, setActiveTotalPages] = useState(1);

    const {
        notificationModal,
        alertSucesso,
        showNotification,
        closeNotification,
        closeAlertSucesso
    } = useNotifications();

    const {
        currentPage,
        totalPages,
        paginate,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        setCurrentPage
    } = usePagination(activeTotalPages);

    const handleCardClick = useCallback(async (solicitacao) => {
        setLoadingMsg("Calculando serviço...");
        setLoading(true);
        let solicitacaoParaModal = solicitacao;

        if (solicitacao.status === 'Aguardando orçamento') {
            try {
                const petId = solicitacao.originalData?.pet?.id || solicitacao.pet?.id;
                const servicosBase = solicitacao.originalData?.servicos || [];
                const servicosIds = servicosBase.map(s => ({ id: s.id }));

                if (petId && servicosIds.length > 0) {
                    const resultado = await calcularServico({ petId, servicos: servicosIds });

                    const updatedOriginalData = {
                        ...solicitacao.originalData,
                        valorDeslocamento: resultado.deslocamento?.valor ?? 0,
                        valorTotal: resultado.valor ?? 0,
                        servicos: (resultado.servico || []).map(serv => ({
                            ...serv,
                            nome: serv.nome || servicosBase.find(s => s.id === serv.id)?.nome || '',
                            valor: serv.valor ?? 0
                        })),
                        deslocamento: resultado.deslocamento
                    };
                    solicitacaoParaModal = { ...solicitacao, originalData: updatedOriginalData };
                }
            } catch (error) {
                console.error("Erro ao calcular serviço:", error);
                showNotification('error', `Erro ao calcular valores: ${error.message}`);
            }
        }

        setSelectedSolicitacao(solicitacaoParaModal);
        setLoading(false);
        setIsModalOpen(true);
    }, [showNotification]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSolicitacao(null);
    };

    const handleStatusUpdate = () => {
        setRefreshTrigger(prev => prev + 1);
        handleCloseModal();
    };

    const handleTotalPagesChange = useCallback((totalPages) => {
        setActiveTotalPages(totalPages || 1);
    }, []);
    
    const handleTabChange = useCallback(() => {
        setCurrentPage(1);
    }, [setCurrentPage]);

    const renderActiveTabComponent = () => {
        const props = {
            onCardClick: handleCardClick,
            currentPage: currentPage,
            refreshTrigger: refreshTrigger,
            onTotalPagesChange: handleTotalPagesChange
        };
        
        switch (activeTab) {
            case 'Todos':
                return <Todos {...props} />;
            case 'Aguardando orçamento':
                return <AguardandoOrcamento {...props} />;
            case 'Aguardando Aprovação':
                return <AguardandoAprovacao {...props} />;
            case 'Aprovados':
                return <Aprovados {...props} />;
            case 'Recusados':
                return <Recusados {...props} />;
            default:
                return null;
        }
    };

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
                    
                    <SolicitacoesTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onTabChange={handleTabChange}
                    />
                    
                    <div className="content-wrapper">
                        {renderActiveTabComponent()}
                    </div>
                </main>
            </div>

            {isModalOpen && selectedSolicitacao && (
                <SolicitacaoModal
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