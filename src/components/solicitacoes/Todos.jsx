import { useState, useEffect } from "react";
import SolicitacoesBase from "./SolicitacoesBase";
import { getSolicitacoes } from "../../utils/get";
import { transformSolicitacaoData } from "../../utils/solicitacaoUtils";

const Todos = ({ onCardClick, currentPage, refreshTrigger }) => {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSolicitacoes = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getSolicitacoes(0, 1000); // Buscar todas as solicitações
                const transformedData = data.map(transformSolicitacaoData);
                setSolicitacoes(transformedData);
            } catch (err) {
                console.error("Erro ao carregar solicitações:", err);
                setError("Erro ao carregar solicitações. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitacoes();
    }, [refreshTrigger]);

    // Sempre chamar SolicitacoesBase para manter a ordem dos hooks
    const result = SolicitacoesBase({ 
        solicitacoes, 
        activeTab: "Todos", 
        onCardClick, 
        currentPage 
    });

    if (loading) {
        return {
            component: <div className="loading-message">Carregando solicitações...</div>,
            totalPages: 0
        };
    }

    if (error) {
        return {
            component: (
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
                        Nenhum dado encontrado. Tente novamente!
                    </div>
                </div>
            ),
            totalPages: 0
        };
    }
    
    return result;
};

export default Todos;