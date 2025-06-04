import "../styles/ModalLoading.css";

export default function ModalLoading({ mensagem = "Carregando..." }) {
    return (
        <div className="modal-overlay">
            <div className="modal-loading">
                <div className="spinner" />
                <span>{mensagem}</span>
            </div>
        </div>
    );
}