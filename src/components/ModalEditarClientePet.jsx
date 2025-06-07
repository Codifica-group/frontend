import { useState, useEffect } from "react";
import ModalLoading from "./ModalLoading";
import AlertErro from "./AlertErro";
import Select from "react-select";
import { putCliente, putPet } from "../utils/put";
import { deleteCliente, deletePet } from "../utils/delete";
import { getClientes, getRacas } from "../utils/get";
import { maskCelular, maskCep, unmaskNumber } from "./ModalGerenciarClientePet";

export default function ModalEditarClientePet({
    tipo, // "cliente" ou "pet"
    dados,
    onClose,
    recarregar,
    setErro
}) {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando...");
    const [clientes, setClientes] = useState([]);
    const [racas, setRacas] = useState([]);
    const [erroLocal, setErroLocal] = useState(null);

    useEffect(() => {
        if (tipo === "cliente" && dados) {
            setForm({
                id: dados.id,
                nome: dados.nome || "",
                numCelular: maskCelular(dados.numCelular || ""),
                cep: maskCep(dados.cep || ""),
                numEndereco: dados.numEndereco || "",
                complemento: dados.complemento || ""
            });
        } else if (tipo === "pet" && dados) {
            setForm({
                id: dados.id,
                nome: dados.nome || "",
                racaId: dados.racaId || dados.raca?.id || "",
                clienteId: dados.clienteId || dados.cliente?.id || ""
            });
        } else {
            setForm({});
        }
        if (tipo === "pet") {
            getClientes().then(setClientes);
            getRacas().then(setRacas);
        }
    }, [dados, tipo]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field, option) => {
        setForm(prev => ({ ...prev, [field]: option ? option.value : null }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoadingMsg(`Atualizando ${tipo === "cliente" ? "Cliente" : "Pet"}...`);
        try {
            if (tipo === "cliente") {
                await putCliente(form.id, {
                    nome: form.nome,
                    numCelular: unmaskNumber(form.numCelular),
                    cep: unmaskNumber(form.cep),
                    numEndereco: form.numEndereco,
                    complemento: form.complemento
                });
            } else {
                await putPet(form.id, {
                    nome: form.nome,
                    racaId: form.racaId,
                    clienteId: form.clienteId
                });
            }
            if (recarregar) await recarregar();
            onClose();
        } catch (error) {
            setErroLocal(error?.message || "Erro ao atualizar.");
            setErro && setErro({ aberto: true, mensagem: "Erro ao atualizar.", detalhe: error?.message || String(error) });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!window.confirm("Tem certeza que deseja deletar?")) return;
        setLoadingMsg(`Deletando ${tipo === "cliente" ? "Cliente" : "Pet"}...`);
        setLoading(true);
        try {
            if (tipo === "cliente") {
                await deleteCliente(form.id);
            } else {
                await deletePet(form.id);
            }
            if (recarregar) await recarregar();
            onClose();
        } catch (error) {
            setErroLocal(error?.message || "Erro ao deletar.");
            setErro && setErro({ aberto: true, mensagem: "Erro ao deletar.", detalhe: error?.message || String(error) });
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
                        <button
                            type="button"
                            className="btn-fechar"
                            style={{ position: "absolute", left: 10, top: 10, fontSize: 22, background: "none", border: "none", cursor: "pointer" }}
                            onClick={onClose}
                            title="Fechar"
                        >&#10005;</button>
                        <h2 style={{ marginLeft: 32 }}>Editar {tipo === "cliente" ? "Cliente" : "Pet"}</h2>
                        <form onSubmit={handleUpdate}>
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
                                <button type="submit" className="btn-atualizar-agenda">Atualizar</button>
                                <button type="button" className="btn-excluir" onClick={handleDelete}>Deletar</button>
                            </div>
                            {erroLocal && <AlertErro mensagem={erroLocal} erro={erroLocal} onClose={() => setErroLocal(null)} />}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}