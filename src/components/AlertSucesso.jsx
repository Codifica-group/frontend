import "../styles/AlertSucesso.css";
import fecharIcon from "../assets/close.png";

export default function AlertSucesso({ mensagem = "Operação realizada com sucesso", onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-sucesso">
                <button className="btn-fechar" onClick={onClose}>
                    <img src={fecharIcon} alt="Fechar" />
                </button>
                <div className="sucesso-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#4CAF50" stroke="#45a049" strokeWidth="2"/>
                        <path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span className="modal-sucesso__mensagem">{mensagem}</span>
            </div>
        </div>
    );
}
