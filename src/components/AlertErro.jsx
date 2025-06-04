import "../styles/AlertErro.css";

export default function ModalErro({ mensagem = "Ocorreu um erro inesperado", erro = "", onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-erro">
                <button className="btn-fechar" onClick={onClose} aria-label="Fechar">
                    X
                </button>
                <img src="src\assets\erro.png" alt="Erro" className="erro-icon" />
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