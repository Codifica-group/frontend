import { useState, useEffect } from "react";
import ModalLoading from "./ModalLoading";
import AlertErro from "./AlertErro";
import Select from "react-select";
import { putCliente, putPet } from "../utils/put";
import { deleteCliente, deletePet } from "../utils/delete";
import { getClientes, getRacas } from "../utils/get";

// Função para máscara de celular (formato: (99) 99999-9999)
export function maskCelular(value) {
    return value
        ? value
            .replace(/\D/g, "")
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1")
            .slice(0, 15)
        : "";
}

// Função para máscara de CEP (formato: 99999-999)
export function maskCep(value) {
    return value
        ? value
            .replace(/\D/g, "")
            .replace(/^(\d{5})(\d)/, "$1-$2")
            .slice(0, 9)
        : "";
}

export function unmaskNumber(str) {
    return (str || "").replace(/\D/g, "");
}

export default function ModalGerenciarClientePet({
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

    // Aplica as máscaras ao carregar os dados
    useEffect(() => {
        if (tipo === "cliente" && dados) {
            setForm({
                ...dados,
                numCelular: maskCelular(dados.numCelular || ""),
                cep: maskCep(dados.cep || "")
            });
        } else if (tipo === "pet" && dados) {
            setForm({
                ...dados,
                racaId: dados.racaId || dados.raca?.id || "",
                clienteId: dados.clienteId || dados.cliente?.id || ""
            });
        } else {
            setForm(dados || {});
        }
        if (tipo === "pet") {
            getClientes().then(setClientes);
            getRacas().then(setRacas);
        }
    }, [dados, tipo]);

    // Preenche selects ao abrir modal de pet
    useEffect(() => {
        if (tipo === "pet" && dados) {
            setForm(prev => ({
                ...prev,
                racaId: dados.racaId || dados.raca?.id || "",
                clienteId: dados.clienteId || dados.cliente?.id || ""
            }));
        }
    }, [tipo, dados]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field, option) => {
        setForm(prev => ({ ...prev, [field]: option ? option.value : null }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoadingMsg(`Atualizando ${tipo == "cliente" ? "Cliente" : "Pet"}...`);
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
            alert("Erro ao atualizar:\n" + (error?.message || String(error)));
            setErroLocal(error?.message || "Erro ao atualizar.");
            setErro && setErro({ aberto: true, mensagem: "Erro ao atualizar.", detalhe: error?.message || String(error) });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!window.confirm("Tem certeza que deseja deletar?")) return;
        setLoadingMsg(`Deletando ${tipo == "cliente" ? "Cliente" : "Pet"}...`);
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
            alert("Erro ao deletar:\n" + (error?.message || String(error)));
            setErroLocal(error?.message || "Erro ao deletar.");
            setErro && setErro({ aberto: true, mensagem: "Erro ao deletar.", detalhe: error?.message || String(error) });
        } finally {
            setLoading(false);
        }
    };

    // Options para selects
    const racaOptions = racas.map(r => ({ value: r.id, label: r.nome }));
    const clienteOptions = clientes.map(c => ({ value: c.id, label: c.nome }));

    return (
        <>
            {loading ? (
                <ModalLoading mensagem={loadingMsg} />
            ) : (
                <div className="modal-overlay">
                    <div className="modal-agenda">
                        <h2>Gerenciar {tipo === "cliente" ? "Cliente" : "Pet"}</h2>
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