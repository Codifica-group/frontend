import { useState, useEffect } from "react";
import Todos from "./Todos";
import AguardandoOrcamento from "./AguardandoOrcamento";
import AguardandoAprovacao from "./AguardandoAprovacao";
import Aprovados from "./Aprovados";
import Recusados from "./Recusados";

const SolicitacoesTabs = ({ onCardClick, currentPage, setCurrentPage, refreshTrigger }) => {
    const [activeTab, setActiveTab] = useState('Todos');

    const tabs = [
        { key: 'Todos', label: 'Todos', component: Todos },
        { key: 'Aguardando orçamento', label: 'Aguardando orçamento', component: AguardandoOrcamento },
        { key: 'Aguardando Aprovação', label: 'Aguardando Aprovação', component: AguardandoAprovacao },
        { key: 'Aprovados', label: 'Aprovados', component: Aprovados },
        { key: 'Recusados', label: 'Recusados', component: Recusados },
    ];

    // Reset page to 1 when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, setCurrentPage]);

    const renderActiveComponent = () => {
        const activeTabData = tabs.find(tab => tab.key === activeTab);
        if (activeTabData) {
            const Component = activeTabData.component;
            const result = Component({ 
                onCardClick, 
                currentPage,
                refreshTrigger
            });
            return result;
        }
        return { component: null, totalPages: 0 };
    };

    const tabData = renderActiveComponent();

    return {
        activeTab,
        totalPages: tabData.totalPages || 0,
        component: (
            <>
                <div className="tabs-container">
                    {tabs.map(tab => (
                        <button 
                            key={tab.key}
                            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`} 
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="content-wrapper">
                    {tabData.component}
                </div>
            </>
        )
    };
};

export default SolicitacoesTabs;