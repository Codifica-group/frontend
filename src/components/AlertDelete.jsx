import "../styles/AlertErro.css";
import deleteIcon from "../assets/delete.png";
import fecharIcon from "../assets/close.png";

export default function AlertDelete({ item = "", onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal-erro">
                <img src={deleteIcon} alt="Deletar" className="erro-icon" />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span className="modal-erro__mensagem" style={{ fontSize: 20 }}>
                        Você tem certeza que deseja <b style={{ color: "#ef4444" }}>DELETAR</b> {item}?<br />
                    </span>
                    <span style={{ fontSize: 19 }}>
                        Após essa ação será impossível recuperar os dados.
                    </span>
                </div>
                <div className="alertDelete-container-button">
                    <button className="btn-cancelar-delete" onClick={onCancel}>Não</button>
                    <button className="btn-confirmar-delete" onClick={onConfirm}>Sim</button>
                </div>
            </div>
        </div>
    );
}