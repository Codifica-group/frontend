import { useMemo } from "react";
import ServiceCard from "../ServiceCard";

const SolicitacoesBase = ({ solicitacoes, activeTab, onCardClick, currentPage, itemsPerPage = 10 }) => {
    const parseDate = (dateString) => {
        if (dateString instanceof Date) return dateString;
        if (typeof dateString === 'string' && dateString.includes('T')) {
            return new Date(dateString);
        }

        const parts = dateString?.split(' - ');
        if (!parts || parts.length < 2) return new Date(0);
        const [datePart, timePart] = parts;
        const dateParts = datePart?.split('/');
        const timeParts = timePart?.replace('h', '')?.split(':');
        if (!dateParts || dateParts.length < 3 || !timeParts || timeParts.length < 2) return new Date(0);

        const [day, month, year] = dateParts;
        const [hour, minute] = timeParts;
        return new Date(year, month - 1, day, hour, minute);
    };


    const filteredSolicitacoes = useMemo(() => {
        let filtered;

        switch (activeTab) {
            case 'Todos':
                filtered = [...solicitacoes];
                break;
            case 'Aprovados':
                filtered = solicitacoes.filter(s => s.status === 'Aprovado');
                break;
            case 'Recusados':
                filtered = solicitacoes.filter(s => s.status === 'Recusado' || s.status === 'Recusado pelo Cliente');
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

        const statusPriority = {
            'Aguardando orçamento': 1,
            'Aguardando Aprovação': 2,
            'Aprovado': 3,
            'Recusado': 4,
            'Recusado pelo Cliente': 4
        };

        return filtered.sort((a, b) => {
            const dateA = parseDate(a.dataHora || a.dataSolicitacao || '');
            const dateB = parseDate(b.dataHora || b.dataSolicitacao || '');

            if (activeTab === 'Todos') {
                const priorityA = statusPriority[a.status] || 5;
                const priorityB = statusPriority[b.status] || 5;

                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }
            }
            
            return dateB - dateA;
        });

    }, [solicitacoes, activeTab]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSolicitacoes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSolicitacoes.length / itemsPerPage);

     const cardsAreaStyle = currentItems.length > 0
        ? {}
        : { display: 'flex', flexDirection: 'column', flexGrow: 1 };

    return {
        currentItems,
        totalPages,
        totalItems: filteredSolicitacoes.length,
        component: (
            <div className="cards-display-area" style={cardsAreaStyle}>
                {currentItems.length > 0 ? (
                    currentItems.map(solicitacao => (
                        <ServiceCard
                            key={solicitacao.id}
                            solicitacao={solicitacao}
                            onClick={() => onCardClick(solicitacao)}
                        />
                    ))
                ) : (
                     <div className="no-data-container">
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 24 24"
                            fill="none"
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