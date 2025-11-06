import { useEffect, useState, useCallback } from "react";
import SideBar from "../components/SideBar";
import SolicitacaoModal from "../components/solicitacoes/SolicitacaoModal";
import NotificationModal from "../components/NotificationModal";
import AlertSucesso from "../components/AlertSucesso";
import ModalLoading from "../components/ModalLoading";
import { calcularServico } from "../utils/agenda";
import "../styles/style-solicitacao.css";
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

    // Paginação (igual à da tela Gerenciar)
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [paginaInput, setPaginaInput] = useState("");

    const {
        notificationModal,
        alertSucesso,
        showNotification,
        closeNotification,
        closeAlertSucesso
    } = useNotifications();

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

    const handleTotalPagesChange = useCallback((total) => {
        setActiveTotalPages(total || 1);
        setTotalPaginas(total || 1);
    }, []);

    const handleTabChange = useCallback(() => {
        setPaginaAtual(1);
    }, []);

    const renderActiveTabComponent = () => {
        const props = {
            onCardClick: handleCardClick,
            currentPage: paginaAtual,
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
        <>
            <div className="solicitacao-container">
                <SideBar selecionado="solicitacao" />
                <main className="solicitacao-main">
                    <h1 className="page-title">SOLICITAÇÕES DE SERVIÇOS</h1>

                    <SolicitacoesTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onTabChange={handleTabChange}
                    />

                    <div className="content-wrapper">
                        {renderActiveTabComponent()}
                    </div>

          
                    {activeTotalPages > 1 && (
                        <div className="pagination-container">
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

                            <span style={{ fontWeight: "600" }}>Página {paginaAtual} de {totalPaginas}</span>

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
