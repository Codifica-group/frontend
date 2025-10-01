import { useState, useEffect } from "react";
import ModalLoading from "./ModalLoading";
import ModalRaca from "./ModalRaca";
import Select from "react-select";
import { postCliente, postPet } from "../utils/post";
import { getClientes, getRacas, getEndereco } from "../utils/get";
import { maskCelular, maskCep, unmaskNumber } from "./ModalGerenciarClientePet";

export default function ModalNovoClientePet({ tipo, onClose, recarregar, setErro }) {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Salvando...");
    const [clientes, setClientes] = useState([]);
    const [racas, setRacas] = useState([]);
    const [showModalRaca, setShowModalRaca] = useState(false);

    useEffect(() => {
        if (tipo === "pet") {
            getClientes().then(setClientes);
            getRacas().then(setRacas);
        }
        setForm({});
    }, [tipo]);

    // Utiliza API BuscaCEP para preencher endereço ao digitar CEP
    useEffect(() => {
        if (tipo !== "cliente") return;
        const cepLimpo = (form.cep || "").replace(/\D/g, "");
        if (cepLimpo.length === 8) {
            const buscarEndereco = async () => {
                console.log("Buscando endereço pelo CEP:", cepLimpo);
                setLoadingMsg("Buscando endereço pelo CEP...");
                setLoading(true);
                try {
                    const res = await getEndereco(cepLimpo);
                    if (res && res.logradouro) {
                        setForm(prev => ({
                            ...prev,
                            rua: res.logradouro || "",
                            bairro: res.bairro || "",
                            cidade: res.localidade || "",
                            numEndereco: ""
                        }));
                    }
                } catch (error) {
                    setErro({
                        aberto: true,
                        mensagem: "Erro ao buscar endereço.",
                        detalhe: error?.response?.data?.message || error?.message || String(error)
                    });
                } finally {
                    setLoading(false);
                }
            };
            buscarEndereco();
        }
    }, [form.cep, tipo]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field, option) => {
        setForm(prev => ({ ...prev, [field]: option ? option.value : null }));
    };

    const handleSalvar = async (e) => {
        e.preventDefault();

        // Validação dos campos para cliente
        if (tipo === "cliente") {
            if (!form.nome || !form.numCelular || !form.cep || !form.rua || !form.bairro || !form.cidade || !form.numEndereco) {
                setErro({
                    aberto: true,
                    mensagem: "Preencha todos os campos obrigatórios do cliente.",
                    detalhe: ""
                });
                return;
            }
            if (
                isNaN(Number(unmaskNumber(form.numCelular))) ||
                Number(unmaskNumber(form.numCelular)) <= 0 ||
                unmaskNumber(form.numCelular).length < 11
            ) {
                setErro({
                    aberto: true,
                    mensagem: "Preencha corretamente o número de celular (11 dígitos).",
                    detalhe: ""
                });
                return;
            }
            if (
                isNaN(Number(unmaskNumber(form.cep))) ||
                Number(unmaskNumber(form.cep)) <= 0 ||
                unmaskNumber(form.cep).length < 8
            ) {
                setErro({
                    aberto: true,
                    mensagem: "Preencha corretamente o CEP (8 dígitos).",
                    detalhe: ""
                });
                return;
            }
            if (isNaN(Number(form.numEndereco)) || Number(form.numEndereco) < 0) {
                setErro({
                    aberto: true,
                    mensagem: "Preencha corretamente o número do endereço.",
                    detalhe: ""
                });
                return;
            }
        }

        // Validação dos campos para pet
        if (tipo === "pet") {
            if (!form.nome) {
                setErro({
                    aberto: true,
                    mensagem: "Preencha o nome do pet.",
                    detalhe: ""
                });
                return;
            }
            if (!form.racaId) {
                setErro({
                    aberto: true,
                    mensagem: "Selecione uma raça.",
                    detalhe: ""
                });
                return;
            }
            if (!form.clienteId) {
                setErro({
                    aberto: true,
                    mensagem: "Selecione um cliente.",
                    detalhe: ""
                });
                return;
            }
        }

        setLoadingMsg(`Salvando ${tipo === "cliente" ? "Cliente" : "Pet"}...`);
        setLoading(true);
        try {
            if (tipo === "cliente") {
                await postCliente({
                    nome: form.nome,
                    telefone: unmaskNumber(form.numCelular),
                    cep: unmaskNumber(form.cep),
                    rua: form.rua,
                    bairro: form.bairro,
                    cidade: form.cidade,
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
            setErro({
                aberto: true,
                mensagem: `Erro ao cadastrar ${tipo === "cliente" ? 'cliente' : 'pet'}.`,
                detalhe: error?.response?.data?.message || error?.message || String(error)
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSalvarRaca = async (novaRaca) => {
        const novasRacas = await getRacas();
        setRacas(novasRacas);
        setForm(prev => ({ ...prev, racaId: novaRaca.id }));
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
                                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ flex: 1 }}>
                                            <label>Raça</label>
                                            <Select
                                                options={racaOptions}
                                                value={racaOptions.find(opt => opt.value === form.racaId) || null}
                                                onChange={opt => handleSelectChange("racaId", opt)}
                                                placeholder="Selecione a raça"
                                                isClearable
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-nova-raca"
                                            onClick={() => setShowModalRaca(true)}
                                            title="Adicionar nova raça"
                                        >
                                            + Nova Raça
                                        </button>
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
                                <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
                                <button type="submit" className="btn-atualizar-agenda">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showModalRaca && (
                <ModalRaca
                    onClose={() => setShowModalRaca(false)}
                    onSalvar={handleSalvarRaca}
                    setErro={setErro}
                />
            )}
        </>
    );
}