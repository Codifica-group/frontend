import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import "../styles/style-solicitacao.css";

const mockSolicitacoes = [
    { id: 1, status: 'Aprovado', dataHora: '16/09/2025 - 08:24h', servicos: 'Banho, Tosa e Hidratação', pet: 'Thor', raca: 'Pug', cliente: 'Mariana Sousa', celular: '(11) 90000-0002', etapa: 'Finalizado' },
    { id: 2, status: 'Recusado', dataHora: '16/09/2025 - 08:24h', servicos: 'Banho, Tosa e Hidratação', pet: 'Thor', raca: 'Pug', cliente: 'Mariana Sousa', celular: '(11) 90000-0002', etapa: 'Finalizado' },
    { id: 3, status: 'Aprovado', dataHora: '15/09/2025 - 10:30h', servicos: 'Banho e Tosa', pet: 'Loki', raca: 'Golden', cliente: 'Fernando Silva', celular: '(11) 91111-1111', etapa: 'Finalizado' },
    { id: 5, status: 'Aguardando Aprovação', dataHora: '17/09/2025 - 10:00h', servicos: 'Banho e Hidratação', pet: 'Mel', raca: 'Shih Tzu', cliente: 'Juliana Costa', celular: '(11) 94444-4444', etapa: 'Aguardando Aprovação' },
    { id: 6, status: 'Aguardando orçamento', dataHora: '18/09/2025 - 14:00h', servicos: 'Tosa Completa', pet: 'Fred', raca: 'Poodle', cliente: 'Roberto Almeida', celular: '(11) 95555-5555', etapa: 'Aguardando orçamento' },
    { id: 7, status: 'Aprovado', dataHora: '19/09/2025 - 09:15h', servicos: 'Banho e Tosa', pet: 'Bolt', raca: 'Labrador', cliente: 'Ana Paula', celular: '(11) 96666-6666', etapa: 'Finalizado' },
    { id: 8, status: 'Recusado', dataHora: '19/09/2025 - 11:45h', servicos: 'Hidratação', pet: 'Mia', raca: 'Schnauzer', cliente: 'Carlos Eduardo', celular: '(11) 97777-7777', etapa: 'Finalizado' },
    { id: 9, status: 'Aguardando Aprovação', dataHora: '20/09/2025 - 13:00h', servicos: 'Banho', pet: 'Thor', raca: 'Pug', cliente: 'Fernanda Lima', celular: '(11) 98888-8888', etapa: 'Aguardando Aprovação' },
    { id: 10, status: 'Aguardando orçamento', dataHora: '20/09/2025 - 15:30h', servicos: 'Tosa e Hidratação', pet: 'Luna', raca: 'Shih Tzu', cliente: 'Marcos Vinicius', celular: '(11) 99999-9999', etapa: 'Aguardando orçamento' },
    { id: 11, status: 'Aprovado', dataHora: '21/09/2025 - 10:20h', servicos: 'Banho e Hidratação', pet: 'Simba', raca: 'Golden', cliente: 'Patricia Gomes', celular: '(11) 91234-5678', etapa: 'Finalizado' },
    { id: 12, status: 'Recusado', dataHora: '21/09/2025 - 12:50h', servicos: 'Tosa Completa', pet: 'Nina', raca: 'Poodle', cliente: 'Roberta Silva', celular: '(11) 92345-6789', etapa: 'Finalizado' },
    { id: 13, status: 'Aguardando Aprovação', dataHora: '22/09/2025 - 09:00h', servicos: 'Banho', pet: 'Max', raca: 'Bulldog', cliente: 'Thiago Santos', celular: '(11) 93456-7890', etapa: 'Aguardando Aprovação' },
    { id: 14, status: 'Aguardando orçamento', dataHora: '22/09/2025 - 11:30h', servicos: 'Hidratação', pet: 'Lola', raca: 'Yorkshire', cliente: 'Juliana Rocha', celular: '(11) 94567-8901', etapa: 'Aguardando orçamento' },
    { id: 15, status: 'Aprovado', dataHora: '23/09/2025 - 08:45h', servicos: 'Banho e Tosa', pet: 'Rocky', raca: 'Beagle', cliente: 'Marcelo Fernandes', celular: '(11) 95678-9012', etapa: 'Finalizado' },
    { id: 16, status: 'Recusado', dataHora: '23/09/2025 - 14:10h', servicos: 'Tosa Completa', pet: 'Daisy', raca: 'Lhasa Apso', cliente: 'Camila Martins', celular: '(11) 96789-0123', etapa: 'Finalizado' },
    { id: 17, status: 'Aguardando orçamento', dataHora: '24/09/2025 - 16:00h', servicos: 'Banho, Tosa e Hidratação', pet: 'Zeca', raca: 'Maltês', cliente: 'Renata Souza', celular: '(11) 97890-1234', etapa: 'Aguardando orçamento' },
];

const AgendamentoModal = ({ solicitacao, onClose }) => {
    const [valores, setValores] = useState({
        banho: '35,00',
        tosa: '50,00',
        hidratacao: '15,00',
        deslocamento: '5,00',
    });
    const [mensagemPersonalizada, setMensagemPersonalizada] = useState(false);

    const calcularTotal = () => {
        return Object.values(valores).reduce((total, valor) => {
            const numero = parseFloat(valor.replace(',', '.')) || 0;
            return total + numero;
        }, 0);
    };

    return (
        <div className="solicitacao-modal-overlay">
            <div className="solicitacao-modal-content">
                <button className="solicitacao-modal-close-button" onClick={onClose}>&times;</button>
                <div className="solicitacao-modal-header">
                    <h2>Valor Agendamento</h2>
                    <p>{solicitacao.pet} - {solicitacao.servicos}</p>
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
                <div className="solicitacao-modal-footer">
                    <button className="btn-recusar">Recusar</button>
                    <button className="btn-enviar">Enviar oferta</button>
                </div>
            </div>
        </div>
    );
};

const ServiceCard = ({ solicitacao, onClick }) => {
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'aprovado': return 'status-aprovado';
            case 'recusado': return 'status-recusado';
            default: return 'status-pendente';
        }
    };
    const statusClassName = getStatusClass(solicitacao.status);

  return (
    <div className="service-card-new" onClick={onClick}>
      <div className={`status-bar ${statusClassName}`}></div>
      <div className="card-main-content">
        <div className="card-status-header">
            <h3 className={statusClassName}>STATUS - {solicitacao.status.toUpperCase()}</h3>
            <p>{solicitacao.dataHora}</p>
        </div>
        <div className="card-details-grid">
            <div className="detail-item"><strong>Cliente:</strong> {solicitacao.cliente}</div>
            <div className="detail-item"><strong>Celular:</strong> {solicitacao.celular}</div>
            <div className="detail-item full-span"><strong>Serviços:</strong> {solicitacao.servicos}</div>
            <div className="detail-item"><strong>Pet:</strong> {solicitacao.pet}</div>
            <div className="detail-item"><strong>Raça:</strong> {solicitacao.raca}</div>
        </div>
      </div>
    </div>
  );
};

export default function Solicitacao() {
    const [activeTab, setActiveTab] = useState('Todos');
    const [filteredSolicitacoes, setFilteredSolicitacoes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);

    const parseDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' - ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute] = timePart.replace('h', '').split(':');
        return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
    };

    useEffect(() => {
        document.title = "Solicitação de Serviços";

        let solicitacoes;

        if (activeTab === 'Todos') {
            solicitacoes = [...mockSolicitacoes].sort((a, b) => parseDate(b.dataHora) - parseDate(a.dataHora));
        } else if (activeTab === 'Aprovados') {
            solicitacoes = mockSolicitacoes.filter(s => s.status === 'Aprovado');
        } else if (activeTab === 'Recusados') {
            solicitacoes = mockSolicitacoes.filter(s => s.status === 'Recusado');
        } else {
            solicitacoes = mockSolicitacoes.filter(s => s.etapa === activeTab);
        }
        setFilteredSolicitacoes(solicitacoes);

    }, [activeTab]);

    const handleCardClick = (solicitacao) => {
        setSelectedSolicitacao(solicitacao);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSolicitacao(null);
    };

    return (
        <>
            
            <div className="solicitacao-container">
                <SideBar selecionado="solicitacao" />
                <main className="solicitacao-main">
                    <h1 className="page-title">SOLICITAÇÕES DE SERVIÇO</h1>
                    <div className="tabs-container">
                        <button className={`tab-button ${activeTab === 'Todos' ? 'active' : ''}`} onClick={() => setActiveTab('Todos')}>
                            Todos
                        </button>
                        <button className={`tab-button ${activeTab === 'Aguardando orçamento' ? 'active' : ''}`} onClick={() => setActiveTab('Aguardando orçamento')}>
                            Aguardando orçamento
                        </button>
                        <button className={`tab-button ${activeTab === 'Aguardando Aprovação' ? 'active' : ''}`} onClick={() => setActiveTab('Aguardando Aprovação')}>
                            Aguardando Aprovação
                        </button>
                        <button className={`tab-button ${activeTab === 'Aprovados' ? 'active' : ''}`} onClick={() => setActiveTab('Aprovados')}>
                            Aprovados
                        </button>
                         <button className={`tab-button ${activeTab === 'Recusados' ? 'active' : ''}`} onClick={() => setActiveTab('Recusados')}>
                            Recusados
                        </button>
                    </div>
                    <div className="content-wrapper">
                        <div className="cards-display-area">
                            {filteredSolicitacoes.length > 0 ? (
                                filteredSolicitacoes.map(solicitacao => (
                                    <ServiceCard key={solicitacao.id} solicitacao={solicitacao} onClick={() => handleCardClick(solicitacao)} />
                                ))
                            ) : (
                                <p className="no-data-message">Nenhuma solicitação encontrada para esta categoria.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            {isModalOpen && selectedSolicitacao && (
                <AgendamentoModal solicitacao={selectedSolicitacao} onClose={handleCloseModal} />
            )}
        </>
    );
}

