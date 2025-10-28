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

                <div className="card-details-vertical">
                    <div className="detail-item"><strong>Cliente:</strong> {solicitacao.cliente || 'Não informado'}</div>
                    <div className="detail-item"><strong>Celular:</strong> {solicitacao.celular || 'Não informado'}</div>
                    <div className="detail-item"><strong>Serviços:</strong> {solicitacao.servicos || 'Não informado'}</div>
                    <div className="detail-item"><strong>Pet:</strong> {solicitacao.pet || 'Não informado'}</div>
                    <div className="detail-item"><strong>Raça:</strong> {solicitacao.raca || 'Não informado'}</div>
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