import { useMemo } from "react";
import ServiceCard from "../ServiceCard";

const SolicitacoesBase = ({ solicitacoes, activeTab, onCardClick, currentPage, itemsPerPage = 10 }) => {
    const parseDate = (dateString) => {
        // Se já é um objeto Date ou timestamp, usar diretamente
        if (dateString instanceof Date) return dateString;
        if (typeof dateString === 'string' && dateString.includes('T')) {
            return new Date(dateString);
        }
        
        // Formato antigo para compatibilidade
        const [datePart, timePart] = dateString.split(' - ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute] = timePart.replace('h', '').split(':');
        return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
    };

    const filteredSolicitacoes = useMemo(() => {
        let filtered;

        switch (activeTab) {
            case 'Todos':
                filtered = [...solicitacoes].sort((a, b) => {
                    const dateA = parseDate(a.dataHora || a.dataHoraSolicitacao);
                    const dateB = parseDate(b.dataHora || b.dataHoraSolicitacao);
                    return dateB - dateA;
                });
                break;
            case 'Aprovados':
                filtered = solicitacoes.filter(s => s.status === 'Aprovado');
                break;
            case 'Recusados':
                filtered = solicitacoes.filter(s => s.status === 'Recusado');
                break;
            case 'Aguardando orçamento':
                filtered = solicitacoes.filter(s => s.status === 'Aguardando orçamento');
                break;
            case 'Aguardando Aprovação':
                filtered = solicitacoes.filter(s => s.status === 'Aguardando Aprovação');
                break;
            default:
                filtered = solicitacoes;
        }
        
        return filtered;
    }, [solicitacoes, activeTab]);

    // Aplicar paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSolicitacoes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSolicitacoes.length / itemsPerPage);

    return {
        currentItems,
        totalPages,
        totalItems: filteredSolicitacoes.length,
        component: (
            <div className="cards-display-area">
                {currentItems.length > 0 ? (
                    currentItems.map(solicitacao => (
                        <ServiceCard 
                            key={solicitacao.id} 
                            solicitacao={solicitacao} 
                            onClick={() => onCardClick(solicitacao)} 
                        />
                    ))
                ) : (
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
            </div>
        )
    };
};

export default SolicitacoesBase;