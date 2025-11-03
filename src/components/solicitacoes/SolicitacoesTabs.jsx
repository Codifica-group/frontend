import { useMemo } from "react";

const SolicitacoesTabs = ({ activeTab, setActiveTab, onTabChange }) => {

    const tabs = useMemo(() => [
        { key: 'Todos', label: 'Todos' },
        { key: 'Aguardando orçamento', label: 'Aguardando orçamento' },
        { key: 'Aguardando Aprovação', label: 'Aguardando Aprovação' },
        { key: 'Aprovados', label: 'Aprovados' },
        { key: 'Recusados', label: 'Recusados' },
    ], []);

    const handleTabClick = (tabKey) => {
        setActiveTab(tabKey);
        if (onTabChange) {
            onTabChange();
        }
    };

    return (
        <div className="tabs-container">
            {tabs.map(tab => (
                <button 
                    key={tab.key}
                    className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab.key)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default SolicitacoesTabs;