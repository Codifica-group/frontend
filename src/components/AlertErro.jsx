import "../styles/AlertErro.css";
import erroIcon from "../assets/erro.png";
import fecharIcon from "../assets/close.png";

export default function AlertErro({ mensagem = "Ocorreu um erro inesperado", erro = "", onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-erro">
                <button className="btn-fechar" onClick={onClose}><img src={fecharIcon} alt="Fechar" /></button>
                <img src={erroIcon} alt="Erro" className="erro-icon" />
                <span className="modal-erro__mensagem">{mensagem}</span>
                {erro && (
                    <pre className="modal-erro__detalhe">
                        {erro}
                    </pre>
                )}
            </div>
        </div>
    );
}