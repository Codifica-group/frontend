import { useState, useEffect } from "react";
import ModalLoading from "./ModalLoading";
import Select from "react-select";
import { postRaca } from "../utils/post";

// Novo ModalRaca
export default function ModalRaca({ onClose, onSalvar, setErro }) {
    const [nome, setNome] = useState("");
    const [porte, setPorte] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando...");

    const porteOptions = [
        { value: 1, label: "Pequeno" },
        { value: 2, label: "Médio" },
        { value: 3, label: "Grande" },
    ];

    const handleSalvar = async (e) => {
    e.preventDefault();

    // Validação dos campos
    if (!nome) {
        setErro({
            aberto: true,
            mensagem: "Preencha o nome da raça.",
            detalhe: ""
        });
        return;
    }
    if (!porte) {
        setErro({
            aberto: true,
            mensagem: "Selecione o porte da raça.",
            detalhe: ""
        });
        return;
    }

    setLoadingMsg("Salvando raça...");
    setLoading(true);
    try {
        const novaRaca = await postRaca({ nome, porteId: porte.value });
        if (onSalvar) onSalvar(novaRaca);
        onClose();
    } catch (error) {
        setErro({
            aberto: true,
            mensagem: "Erro ao criar raça.",
            detalhe: error?.response?.data?.message || error?.message || String(error)
        });
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="modal-overlay">
            <div className="modal-agenda">
                <h2>Nova Raça</h2>
                <form onSubmit={handleSalvar}>
                    <div className="form-group">
                        <label>Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Porte</label>
                        <Select
                            options={porteOptions}
                            value={porte}
                            onChange={setPorte}
                            placeholder="Selecione o porte"
                            isClearable
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-atualizar-agenda">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
