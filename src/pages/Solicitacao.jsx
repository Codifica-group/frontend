import { useEffect, useState, useMemo } from "react";
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
    { id: 18, status: 'Aprovado', dataHora: '24/09/2025 - 17:30h', servicos: 'Banho e Tosa', pet: 'Bidu', raca: 'Pinscher', cliente: 'Lucas Almeida', celular: '(11) 90011-2233', etapa: 'Finalizado' },
    { id: 19, status: 'Aguardando Aprovação', dataHora: '25/09/2025 - 09:10h', servicos: 'Banho', pet: 'Mel', raca: 'Shih Tzu', cliente: 'Carla Oliveira', celular: '(11) 91122-3344', etapa: 'Aguardando Aprovação' },
    { id: 20, status: 'Aguardando orçamento', dataHora: '25/09/2025 - 11:45h', servicos: 'Tosa Completa', pet: 'Rex', raca: 'Pastor Alemão', cliente: 'Eduardo Ramos', celular: '(11) 92233-4455', etapa: 'Aguardando orçamento' },
    { id: 21, status: 'Recusado', dataHora: '25/09/2025 - 14:30h', servicos: 'Hidratação', pet: 'Fifi', raca: 'Poodle', cliente: 'Sonia Barros', celular: '(11) 93344-5566', etapa: 'Finalizado' },
    { id: 22, status: 'Aprovado', dataHora: '25/09/2025 - 16:00h', servicos: 'Banho', pet: 'Scooby', raca: 'Dogue Alemão', cliente: 'Bruno Costa', celular: '(11) 94455-6677', etapa: 'Finalizado' },
    { id: 23, status: 'Aguardando orçamento', dataHora: '26/09/2025 - 09:40h', servicos: 'Banho e Tosa', pet: 'Pandora', raca: 'Border Collie', cliente: 'Helena Duarte', celular: '(11) 95566-7788', etapa: 'Aguardando orçamento' },
    { id: 24, status: 'Recusado', dataHora: '26/09/2025 - 13:15h', servicos: 'Tosa', pet: 'Toby', raca: 'Labrador', cliente: 'Felipe Santos', celular: '(11) 96677-8899', etapa: 'Finalizado' },
    { id: 25, status: 'Aguardando Aprovação', dataHora: '26/09/2025 - 15:25h', servicos: 'Banho', pet: 'Luna', raca: 'Husky Siberiano', cliente: 'Amanda Nunes', celular: '(11) 97788-9900', etapa: 'Aguardando Aprovação' },
    { id: 26, status: 'Aprovado', dataHora: '27/09/2025 - 10:00h', servicos: 'Tosa Completa', pet: 'Spike', raca: 'Boxer', cliente: 'Rafael Silva', celular: '(11) 98899-0011', etapa: 'Finalizado' },
    { id: 27, status: 'Aguardando orçamento', dataHora: '27/09/2025 - 13:40h', servicos: 'Banho e Hidratação', pet: 'Maggie', raca: 'Cocker Spaniel', cliente: 'Beatriz Lopes', celular: '(11) 99900-1122', etapa: 'Aguardando orçamento' },
    { id: 28, status: 'Recusado', dataHora: '27/09/2025 - 15:55h', servicos: 'Banho e Tosa', pet: 'Ziggy', raca: 'Dálmata', cliente: 'Fernando Costa', celular: '(11) 90022-3344', etapa: 'Finalizado' },
    { id: 29, status: 'Aguardando Aprovação', dataHora: '28/09/2025 - 09:20h', servicos: 'Banho', pet: 'Lili', raca: 'Yorkshire', cliente: 'Paula Rocha', celular: '(11) 91133-4455', etapa: 'Aguardando Aprovação' },
    { id: 30, status: 'Aprovado', dataHora: '28/09/2025 - 11:30h', servicos: 'Tosa e Hidratação', pet: 'Thor', raca: 'Bulldog Francês', cliente: 'André Souza', celular: '(11) 92244-5566', etapa: 'Finalizado' },
    { id: 31, status: 'Recusado', dataHora: '28/09/2025 - 13:10h', servicos: 'Banho', pet: 'Mel', raca: 'Poodle Toy', cliente: 'Isabela Torres', celular: '(11) 93355-6677', etapa: 'Finalizado' },
    { id: 32, status: 'Aprovado', dataHora: '29/09/2025 - 10:25h', servicos: 'Banho e Tosa', pet: 'Bob', raca: 'Vira-lata', cliente: 'Renato Dias', celular: '(11) 94466-7788', etapa: 'Finalizado' },
    { id: 33, status: 'Aguardando orçamento', dataHora: '29/09/2025 - 11:50h', servicos: 'Hidratação', pet: 'Chico', raca: 'Pug', cliente: 'Vanessa Moraes', celular: '(11) 95577-8899', etapa: 'Aguardando orçamento' },
    { id: 34, status: 'Aguardando Aprovação', dataHora: '29/09/2025 - 14:00h', servicos: 'Tosa Completa', pet: 'Luna', raca: 'Golden', cliente: 'Diego Castro', celular: '(11) 96688-9900', etapa: 'Aguardando Aprovação' },
    { id: 35, status: 'Aprovado', dataHora: '30/09/2025 - 09:40h', servicos: 'Banho', pet: 'Teca', raca: 'Pinscher', cliente: 'Mariana Prado', celular: '(11) 97799-0011', etapa: 'Finalizado' },
    { id: 36, status: 'Recusado', dataHora: '30/09/2025 - 12:15h', servicos: 'Tosa', pet: 'Milo', raca: 'Beagle', cliente: 'João Meireles', celular: '(11) 98800-1122', etapa: 'Finalizado' },
    { id: 37, status: 'Aguardando orçamento', dataHora: '30/09/2025 - 15:10h', servicos: 'Banho e Tosa', pet: 'Laila', raca: 'Shih Tzu', cliente: 'Clara Figueiredo', celular: '(11) 99911-2233', etapa: 'Aguardando orçamento' },
    { id: 38, status: 'Aprovado', dataHora: '01/10/2025 - 09:00h', servicos: 'Banho e Hidratação', pet: 'Pingo', raca: 'Maltês', cliente: 'Eduarda Nogueira', celular: '(11) 90022-3344', etapa: 'Finalizado' },
    { id: 39, status: 'Recusado', dataHora: '01/10/2025 - 11:20h', servicos: 'Tosa Completa', pet: 'Max', raca: 'Pastor Alemão', cliente: 'Rogério Tavares', celular: '(11) 91133-4455', etapa: 'Finalizado' },
    { id: 40, status: 'Aguardando orçamento', dataHora: '01/10/2025 - 14:10h', servicos: 'Hidratação', pet: 'Nala', raca: 'Husky Siberiano', cliente: 'Cristina Luz', celular: '(11) 92244-5566', etapa: 'Aguardando orçamento' },
    { id: 41, status: 'Aguardando Aprovação', dataHora: '02/10/2025 - 10:25h', servicos: 'Banho', pet: 'Rex', raca: 'Labrador', cliente: 'Gabriel Vieira', celular: '(11) 93355-6677', etapa: 'Aguardando Aprovação' },
    { id: 42, status: 'Aprovado', dataHora: '02/10/2025 - 12:45h', servicos: 'Banho e Tosa', pet: 'Nina', raca: 'Golden', cliente: 'Helena Freitas', celular: '(11) 94466-7788', etapa: 'Finalizado' },
    { id: 43, status: 'Recusado', dataHora: '02/10/2025 - 16:00h', servicos: 'Tosa Completa', pet: 'Zuzu', raca: 'Yorkshire', cliente: 'Tatiana Pires', celular: '(11) 95577-8899', etapa: 'Finalizado' },
    { id: 44, status: 'Aprovado', dataHora: '03/10/2025 - 09:50h', servicos: 'Banho e Hidratação', pet: 'Rony', raca: 'Poodle', cliente: 'Bruno Ribeiro', celular: '(11) 96688-9900', etapa: 'Finalizado' },
    { id: 45, status: 'Aguardando orçamento', dataHora: '03/10/2025 - 13:30h', servicos: 'Tosa Completa', pet: 'Sasha', raca: 'Beagle', cliente: 'Gustavo Lima', celular: '(11) 97799-0011', etapa: 'Aguardando orçamento' },
    { id: 46, status: 'Recusado', dataHora: '03/10/2025 - 15:15h', servicos: 'Banho', pet: 'Kira', raca: 'Lhasa Apso', cliente: 'Rafaela Santos', celular: '(11) 98800-1122', etapa: 'Finalizado' },
    { id: 47, status: 'Aprovado', dataHora: '04/10/2025 - 09:10h', servicos: 'Banho e Tosa', pet: 'Billy', raca: 'Golden', cliente: 'Danilo Araújo', celular: '(11) 99911-2233', etapa: 'Finalizado' },
    { id: 48, status: 'Aguardando Aprovação', dataHora: '04/10/2025 - 11:35h', servicos: 'Hidratação', pet: 'Tico', raca: 'Poodle', cliente: 'Juliana Ramos', celular: '(11) 90022-3344', etapa: 'Aguardando Aprovação' },
    { id: 49, status: 'Aguardando orçamento', dataHora: '04/10/2025 - 14:20h', servicos: 'Banho e Hidratação', pet: 'Amora', raca: 'Shih Tzu', cliente: 'Tatiane Silva', celular: '(11) 91133-4455', etapa: 'Aguardando orçamento' },
    { id: 50, status: 'Recusado', dataHora: '04/10/2025 - 16:00h', servicos: 'Tosa', pet: 'Fred', raca: 'Bulldog', cliente: 'Renato Alves', celular: '(11) 92244-5566', etapa: 'Finalizado' },
    { id: 51, status: 'Aprovado', dataHora: '05/10/2025 - 10:30h', servicos: 'Banho e Hidratação', pet: 'Maggie', raca: 'Cocker Spaniel', cliente: 'Rodrigo Moura', celular: '(11) 93322-4455', etapa: 'Finalizado' },
    { id: 52, status: 'Aguardando orçamento', dataHora: '05/10/2025 - 13:20h', servicos: 'Tosa Completa', pet: 'Nico', raca: 'Labrador', cliente: 'Patrícia Barros', celular: '(11) 94433-5566', etapa: 'Aguardando orçamento' },
    { id: 53, status: 'Recusado', dataHora: '05/10/2025 - 15:10h', servicos: 'Banho', pet: 'Maya', raca: 'Husky Siberiano', cliente: 'Caio Teixeira', celular: '(11) 95544-6677', etapa: 'Finalizado' },
    { id: 54, status: 'Aprovado', dataHora: '06/10/2025 - 09:40h', servicos: 'Banho e Tosa', pet: 'Zeca', raca: 'Vira-lata', cliente: 'Camila Lopes', celular: '(11) 96655-7788', etapa: 'Finalizado' },
    { id: 55, status: 'Aguardando Aprovação', dataHora: '06/10/2025 - 11:00h', servicos: 'Hidratação', pet: 'Toby', raca: 'Beagle', cliente: 'Rafael Lima', celular: '(11) 97766-8899', etapa: 'Aguardando Aprovação' },
    { id: 56, status: 'Aguardando orçamento', dataHora: '06/10/2025 - 13:50h', servicos: 'Banho e Hidratação', pet: 'Bela', raca: 'Yorkshire', cliente: 'Natália Duarte', celular: '(11) 98877-9900', etapa: 'Aguardando orçamento' },
    { id: 57, status: 'Recusado', dataHora: '06/10/2025 - 15:30h', servicos: 'Tosa Completa', pet: 'Lulu', raca: 'Poodle', cliente: 'José Henrique', celular: '(11) 99988-0011', etapa: 'Finalizado' },
    { id: 58, status: 'Aguardando Aprovação', dataHora: '07/10/2025 - 09:15h', servicos: 'Banho', pet: 'Fred', raca: 'Golden Retriever', cliente: 'Clara Ribeiro', celular: '(11) 90011-2233', etapa: 'Aguardando Aprovação' },
    { id: 59, status: 'Aprovado', dataHora: '07/10/2025 - 11:40h', servicos: 'Banho e Tosa', pet: 'Layla', raca: 'Maltês', cliente: 'Pedro Henrique', celular: '(11) 91122-3344', etapa: 'Finalizado' },
    { id: 60, status: 'Aguardando orçamento', dataHora: '07/10/2025 - 14:10h', servicos: 'Tosa Completa', pet: 'Teca', raca: 'Lhasa Apso', cliente: 'Juliana Almeida', celular: '(11) 92233-4455', etapa: 'Aguardando orçamento' },
    { id: 61, status: 'Recusado', dataHora: '07/10/2025 - 16:30h', servicos: 'Banho e Hidratação', pet: 'Thor', raca: 'Boxer', cliente: 'Felipe Costa', celular: '(11) 93344-5566', etapa: 'Finalizado' },
    { id: 62, status: 'Aprovado', dataHora: '08/10/2025 - 09:00h', servicos: 'Banho', pet: 'Luna', raca: 'Pug', cliente: 'Fernanda Dias', celular: '(11) 94455-6677', etapa: 'Finalizado' },
    { id: 63, status: 'Aguardando orçamento', dataHora: '08/10/2025 - 11:25h', servicos: 'Banho e Tosa', pet: 'Milo', raca: 'Cocker', cliente: 'Tatiane Costa', celular: '(11) 95566-7788', etapa: 'Aguardando orçamento' },
    { id: 64, status: 'Recusado', dataHora: '08/10/2025 - 13:40h', servicos: 'Tosa Completa', pet: 'Duda', raca: 'Pinscher', cliente: 'Renata Gomes', celular: '(11) 96677-8899', etapa: 'Finalizado' },
    { id: 65, status: 'Aprovado', dataHora: '08/10/2025 - 16:10h', servicos: 'Banho e Hidratação', pet: 'Simba', raca: 'Golden', cliente: 'Marcos Tavares', celular: '(11) 97788-9900', etapa: 'Finalizado' },
    { id: 66, status: 'Aguardando Aprovação', dataHora: '09/10/2025 - 09:50h', servicos: 'Banho e Tosa', pet: 'Lili', raca: 'Poodle', cliente: 'Aline Castro', celular: '(11) 98899-0011', etapa: 'Aguardando Aprovação' },
    { id: 67, status: 'Recusado', dataHora: '09/10/2025 - 11:30h', servicos: 'Banho', pet: 'Rex', raca: 'Beagle', cliente: 'Vinícius Souza', celular: '(11) 99900-1122', etapa: 'Finalizado' },
    { id: 68, status: 'Aguardando orçamento', dataHora: '09/10/2025 - 14:20h', servicos: 'Hidratação', pet: 'Nina', raca: 'Lhasa Apso', cliente: 'Gabriela Lopes', celular: '(11) 90011-2233', etapa: 'Aguardando orçamento' },
    { id: 69, status: 'Aprovado', dataHora: '09/10/2025 - 16:45h', servicos: 'Banho e Tosa', pet: 'Teco', raca: 'Bulldog Francês', cliente: 'Henrique Silva', celular: '(11) 91122-3344', etapa: 'Finalizado' },
    { id: 70, status: 'Aguardando Aprovação', dataHora: '10/10/2025 - 10:10h', servicos: 'Banho e Hidratação', pet: 'Lola', raca: 'Yorkshire', cliente: 'Beatriz Moura', celular: '(11) 92233-4455', etapa: 'Aguardando Aprovação' }
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
    const [activeTab, setActiveTab] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const parseDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' - ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute] = timePart.replace('h', '').split(':');
        return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
    };

    const filteredSolicitacoes = useMemo(() => {
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
        return solicitacoes;
    }, [activeTab]);
    
    useEffect(() => {
        document.title = "Solicitação de Serviços";
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);


    const handleCardClick = (solicitacao) => {
        setSelectedSolicitacao(solicitacao);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSolicitacao(null);
    };


    // Lógica de Paginação
      const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSolicitacoes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSolicitacoes.length / itemsPerPage);

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
                            {currentItems.length > 0 ? (
                                currentItems.map(solicitacao => (
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