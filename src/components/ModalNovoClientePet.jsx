import { useState, useEffect } from "react";
import ModalLoading from "./ModalLoading";
import AlertErro from "./AlertErro";
import Select from "react-select";
import { postCliente, postPet } from "../utils/post";
import { getClientes, getRacas } from "../utils/get";
import { maskCelular, maskCep, unmaskNumber } from "./ModalGerenciarClientePet";

export default function ModalNovoClientePet({ tipo, onClose, recarregar, setErro }) {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Salvando...");
    const [clientes, setClientes] = useState([]);
    const [racas, setRacas] = useState([]);
    const [erroLocal, setErroLocal] = useState(null);

    useEffect(() => {
        if (tipo === "pet") {
            getClientes().then(setClientes);
            getRacas().then(setRacas);
        }
        setForm({});
    }, [tipo]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field, option) => {
        setForm(prev => ({ ...prev, [field]: option ? option.value : null }));
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        setLoadingMsg(`Salvando ${tipo === "cliente" ? "Cliente" : "Pet"}...`);
        setLoading(true);
        try {
            if (tipo === "cliente") {
                await postCliente({
                    nome: form.nome,
                    numCelular: unmaskNumber(form.numCelular),
                    cep: unmaskNumber(form.cep),
                    numEndereco: form.numEndereco,
                    complemento: form.complemento
                });
            } else {
                await postPet({
                    nome: form.nome,
                    racaId: form.racaId,
                    clienteId: form.clienteId
                });
            }
            if (recarregar) await recarregar();
            onClose();
        } catch (error) {
            alert("Erro ao cadastrar:\n" + (error?.message || String(error)));
            setErroLocal(error?.message || "Erro ao cadastrar.");
            setErro && setErro({ aberto: true, mensagem: "Erro ao cadastrar.", detalhe: error?.message || String(error) });
        } finally {
            setLoading(false);
        }
    };

    const racaOptions = racas.map(r => ({ value: r.id, label: r.nome }));
    const clienteOptions = clientes.map(c => ({ value: c.id, label: c.nome }));

    return (
        <>
            {loading ? (
                <ModalLoading mensagem={loadingMsg} />
            ) : (
                <div className="modal-overlay">
                    <div className="modal-agenda">
                        <h2>Novo {tipo === "cliente" ? "Cliente" : "Pet"}</h2>
                        <form onSubmit={handleSalvar}>
                            {tipo === "cliente" ? (
                                <>
                                    <div className="form-group">
                                        <label>Nome</label>
                                        <input
                                            type="text"
                                            value={form.nome || ""}
                                            onChange={e => handleChange("nome", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Número Celular</label>
                                        <input
                                            type="text"
                                            value={form.numCelular || ""}
                                            onChange={e => handleChange("numCelular", maskCelular(e.target.value))}
                                            required
                                            maxLength={15}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>CEP</label>
                                        <input
                                            type="text"
                                            value={form.cep || ""}
                                            onChange={e => handleChange("cep", maskCep(e.target.value))}
                                            required
                                            maxLength={9}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Número Endereço</label>
                                        <input
                                            type="number"
                                            value={form.numEndereco || ""}
                                            onChange={e => handleChange("numEndereco", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Complemento</label>
                                        <input
                                            type="text"
                                            value={form.complemento || ""}
                                            onChange={e => handleChange("complemento", e.target.value)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>Nome</label>
                                        <input
                                            type="text"
                                            value={form.nome || ""}
                                            onChange={e => handleChange("nome", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Raça</label>
                                        <Select
                                            options={racaOptions}
                                            value={racaOptions.find(opt => opt.value === form.racaId) || null}
                                            onChange={opt => handleSelectChange("racaId", opt)}
                                            placeholder="Selecione a raça"
                                            isClearable
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Cliente</label>
                                        <Select
                                            options={clienteOptions}
                                            value={clienteOptions.find(opt => opt.value === form.clienteId) || null}
                                            onChange={opt => handleSelectChange("clienteId", opt)}
                                            placeholder="Selecione o cliente"
                                            isClearable
                                        />
                                    </div>
                                </>
                            )}
                            <div className="modal-buttons">
                                <button type="submit" className="btn-atualizar-agenda">Salvar</button>
                                <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
                            </div>
                            {erroLocal && <AlertErro mensagem={erroLocal} erro={erroLocal} onClose={() => setErroLocal(null)} />}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}