import "../styles/style-historico.css";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import TableHistorico from "../components/TableHistorico";
import { getClientes, getPets } from "../utils/get";
import ModalLoading from "../components/ModalLoading";
import AlertErro from "../components/AlertErro";
import { FaRegEdit } from "react-icons/fa";
import NoData from "../components/NoData";
import ModalGerenciarClientePet, { maskCelular, maskCep } from "../components/ModalGerenciarClientePet"; // Importe as máscaras
import ModalNovoClientePet from "../components/ModalNovoClientePet";

const Gerenciar = () => {
    const [tipo, setTipo] = useState("cliente");
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando Dados...");
    const [erro, setErro] = useState({ aberto: false, mensagem: "", detalhe: "" });
    const [colunas, setColunas] = useState([]);
    const [modal, setModal] = useState({ aberto: false, tipo: null, dados: null });
    const [modalNovo, setModalNovo] = useState({ aberto: false, tipo: null });

    useEffect(() => {
        if (tipo === "cliente") {
            carregarClientes();
        } if (tipo === "pet") {
            carregarPets();
        }
    }, [tipo]);

    async function carregarClientes() {
        setLoading(true);
        setErro({ aberto: false, mensagem: "", detalhe: "" });
        setColunas(["Nome", "Número Celular", "CEP", "Número Endereço", "Complemento"]);
        try {
            const clientes = await getClientes();
            setDados(Array.isArray(clientes) ? clientes : []);
        } catch (error) {
            alert("Erro ao buscar dados:\n" + (error?.message || String(error)));
            setErro({
                aberto: true,
                mensagem: "Erro ao buscar dados.",
                detalhe: error?.message || String(error)
            });
        } finally {
            setLoading(false);
        }
    }

    async function carregarPets() {
        setLoading(true);
        setErro({ aberto: false, mensagem: "", detalhe: "" });
        setColunas(["Nome", "Raça", "Cliente"]);
        try {
            const pets = await getPets();
            const petsCompletos = (Array.isArray(pets) ? pets : []).map(pet => ({
                ...pet,
                racaNome: pet.raca?.nome || "",
                clienteNome: pet.cliente?.nome || "",
            }));
            setDados(petsCompletos);
        } catch (error) {
            alert("Erro ao buscar dados:\n" + (error?.message || String(error)));
            setErro({
                aberto: true,
                mensagem: "Erro ao buscar dados.",
                detalhe: error?.message || String(error)
            });
        } finally {
            setLoading(false);
        }
    }

    function handleEditar(item, tipo) {
        setModal({ aberto: true, tipo, dados: item });
    }

    function mapearDadosParaTabela() {
        if (tipo === "cliente") {
            return dados.map(c => ({
                id: c.id,
                Nome: c.nome,
                "Número Celular": maskCelular(c.numCelular || ""),
                CEP: maskCep(c.cep || ""),
                "Número Endereço": c.numEndereco,
                Complemento: c.complemento,
                Ações: (
                    <button
                        className="btn-acao"
                        title="Editar"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        onClick={() => handleEditar(c, "cliente")}
                    >
                        <FaRegEdit size={18} />
                    </button>
                )
            }));
        } else {
            return dados.map(p => ({
                id: p.id,
                Nome: p.nome,
                Raça: p.racaNome,
                Cliente: p.clienteNome,
                Ações: (
                    <button
                        className="btn-acao"
                        title="Editar"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        onClick={() => handleEditar(p, "pet")}
                    >
                        <FaRegEdit size={18} />
                    </button>
                )
            }));
        }
    }

    return (
        <div className="historico-root">
            <SideBar selecionado="Gerenciar" />

            <div className="content">
                <h1 className="titulo">
                    Gerenciar {tipo === "cliente" ? "Clientes" : "Pets"}
                </h1>
                <div className="filter-container" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <button
                        className={tipo === "cliente" ? "btn-ativo" : ""}
                        onClick={() => setTipo("cliente")}
                        style={{ backgroundColor:'#307e95', borderRadius:'20px' , color:'#fff', padding: "8px 16px" }}
                    >
                        Cliente
                    </button>
                    <button
                        className={tipo === "pet" ? "btn-ativo" : ""}
                        onClick={() => setTipo("pet")}
                        style={{ backgroundColor:'#307e95', borderRadius:'20px' , color:'#fff', padding: "8px 16px" }}
                    >
                        Pet
                    </button>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                        <button
                            className="btn-novo"
                            style={{ padding: "8px 16px", fontWeight: "bold" }}
                            onClick={() => setModalNovo({ aberto: true, tipo })}
                        >
                            + Novo {tipo === "cliente" ? "Cliente" : "Pet"}
                        </button>
                    </div>
                </div>

                <TableHistorico
                    columns={[...colunas, "Ações"]}
                    data={mapearDadosParaTabela()}
                />

                {dados.length === 0 && !loading && <NoData />}
                {modalNovo.aberto && (
    <ModalNovoClientePet
        tipo={modalNovo.tipo}
        onClose={() => setModalNovo({ aberto: false, tipo: null })}
        recarregar={tipo === "cliente" ? carregarClientes : carregarPets}
        setErro={setErro}
    />
)}
                {modal.aberto && (
                    <ModalGerenciarClientePet
                        tipo={modal.tipo}
                        dados={modal.dados}
                        onClose={() => setModal({ aberto: false, tipo: null, dados: null })}
                        recarregar={tipo === "cliente" ? carregarClientes : carregarPets}
                        setErro={setErro}
                    />
                )}
                {erro.aberto && (
                    <AlertErro
                        mensagem={erro.mensagem}
                        erro={erro.detalhe}
                        onClose={() => setErro({ aberto: false, mensagem: "", detalhe: "" })}
                    />
                )}
            </div>
        </div>
    );
};

export default Gerenciar;
