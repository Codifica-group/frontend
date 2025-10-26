import { getStatusClass } from '../utils/solicitacaoUtils';

const ServiceCard = ({ solicitacao, onClick }) => {
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
                {solicitacao.dataSolicitacao && (
                    <div className="card-footer-date">
                        <p>Solicitado em: {solicitacao.dataSolicitacao}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceCard;