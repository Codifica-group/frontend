import { useState, useEffect } from "react";
import fecharIcon from "../assets/close.png";
import ModalLoading from "./ModalLoading";
import AlertErro from "./AlertErro";
import Select from "react-select";
import { putCliente, putPet } from "../utils/put";
import { deleteCliente, deletePet } from "../utils/delete";
import { getClientes, getRacas, getEndereco } from "../utils/get";

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
    const [lastCepBuscado, setLastCepBuscado] = useState("");

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

        //chama API BuscaCEP se o usuário alterar o campo CEP e for válido
        if (field === "cep") {
            const cepLimpo = value.replace(/\D/g, "");
            if (cepLimpo.length === 8 && cepLimpo !== lastCepBuscado) {
                console.log("Buscando endereço pelo CEP:", cepLimpo);
                setLoadingMsg("Buscando endereço pelo CEP...");
                setLoading(true);
                getEndereco(cepLimpo)
                    .then(res => {
                        if (res && res.logradouro) {
                            setForm(prev => ({
                                ...prev,
                                rua: res.logradouro || "",
                                bairro: res.bairro || "",
                                cidade: res.localidade || "",
                                numEndereco: ""
                            }));
                        }
                        setLastCepBuscado(cepLimpo);
                    })
                    .catch(error => {
                        setErro({
                            aberto: true,
                            mensagem: "Erro ao buscar endereço pelo CEP.",
                            detalhe: error?.response?.data?.message || error?.message || String(error)
                        });
                    })
                    .finally(() => setLoading(false));
            }
        }
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
                    rua: form.rua,
                    numEndereco: form.numEndereco,
                    bairro: form.bairro,
                    cidade: form.cidade,
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
            setErro({
                aberto: true,
                mensagem: `Erro ao atualizar ${tipo === "cliente" ? 'cliente' : 'pet'}.`,
                detalhe: error?.response?.data?.message || error?.message || String(error)
            });
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
            setErro({
                aberto: true,
                mensagem: `Erro ao deletar ${tipo === "cliente" ? 'cliente' : 'pet'}.`,
                detalhe: error?.response?.data?.message || error?.message || String(error)
            });
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
                                    {/* Linha com Rua e N° Endereço */}
                                    <div className="form-group" style={{ display: "flex", gap: "10px" }}>
                                        <div style={{ flex: "3 1 75%" }}>
                                            <label>Rua</label>
                                            <input
                                                type="text"
                                                value={form.rua || ""}
                                                onChange={e => handleChange("rua", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div style={{ flex: "1 1 15%" }}>
                                            <label>Número</label>
                                            <input
                                                type="number"
                                                value={form.numEndereco || ""}
                                                onChange={e => handleChange("numEndereco", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Linha com Bairro e Cidade */}
                                    <div className="form-group" style={{ display: "flex", gap: "10px" }}>
                                        <div style={{ flex: "1 1 50%" }}>
                                            <label>Bairro</label>
                                            <input
                                                type="text"
                                                value={form.bairro || ""}
                                                onChange={e => handleChange("bairro", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div style={{ flex: "1 1 50%" }}>
                                            <label>Cidade</label>
                                            <input
                                                type="text"
                                                value={form.cidade || ""}
                                                onChange={e => handleChange("cidade", e.target.value)}
                                                required
                                            />
                                        </div>
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
                                <button type="button" className="btn-fechar" onClick={onClose}><img src={fecharIcon} alt="Fechar" /></button>
                                <button type="button" className="btn-excluir" onClick={handleDelete} disabled={loading}>
                                    {loading ? "Deletando..." : "Deletar"}
                                </button>
                                <button type="button" className="btn-atualizar-agenda" onClick={handleUpdate}>Atualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}