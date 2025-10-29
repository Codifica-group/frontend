import "../styles/style-historico.css";
import "../styles/style-Gerenciar.css";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import TableHistorico from "../components/TableHistorico";
import { getClientes, getPets } from "../utils/get";
import ModalLoading from "../components/ModalLoading";
import AlertErro from "../components/AlertErro";
import NoData from "../components/NoData";
import ModalGerenciarClientePet, { maskCelular, maskCep } from "../components/ModalGerenciarClientePet";
import ModalNovoClientePet from "../components/ModalNovoClientePet";

const Gerenciar = () => {
    const [tipo, setTipo] = useState("cliente");
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState({ aberto: false, mensagem: "", detalhe: "" });
    const [colunas, setColunas] = useState([]);
    const [tamanhoColunas, setTamanhoColunas] = useState([]);
    const [modal, setModal] = useState({ aberto: false, tipo: null, dados: null });
    const [modalNovo, setModalNovo] = useState({ aberto: false, tipo: null });
    const [modalEditar, setModalEditar] = useState({ aberto: false, tipo: null, dados: null });

    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [paginaInput, setPaginaInput] = useState("");
    const itensPorPagina = 10;

    useEffect(() => {
        if (tipo === "cliente") {
            carregarClientes(1);
        } else if (tipo === "pet") {
            carregarPets(1);
        }
    }, [tipo]);

    useEffect(() => {
        if (tipo === "cliente") {
            carregarClientes(paginaAtual);
        } else if (tipo === "pet") {
            carregarPets(paginaAtual);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginaAtual]);

    async function carregarClientes(pagina = 1) {
        setLoading(true);
        setErro({ aberto: false, mensagem: "", detalhe: "" });
        setColunas(["Nome", "Celular", "CEP", "Rua", "Número", "Complemento", "Bairro", "Cidade"]);
        setTamanhoColunas(["14.5%", "7.1%", "3.1%", "7%", "1%", "5%", "4%", "2%"]);
        try {
            const offset = pagina - 1;
            const res = await getClientes(offset, itensPorPagina);
            setDados(Array.isArray(res.dados) ? res.dados : []);
            setTotalPaginas(res.totalPaginas || 1);
            setPaginaAtual(pagina);
        } catch (error) {
            setErro({
                aberto: true,
                mensagem: "Erro ao buscar dados.",
                detalhe: error?.response?.data?.message || error?.message || String(error)
            });
        } finally {
            setLoading(false);
        }
    }

    async function carregarPets(pagina = 1) {
        setLoading(true);
        setErro({ aberto: false, mensagem: "", detalhe: "" });
        setColunas(["Nome", "Raça", "Cliente"]);
        setTamanhoColunas(["20%", "10%", "15%"]);
        try {
            const offset = pagina - 1;
            const res = await getPets(offset, itensPorPagina);
            const petsCompletos = (Array.isArray(res.dados) ? res.dados : []).map(pet => ({
                ...pet,
                racaNome: pet.raca?.nome || "",
                clienteNome: pet.cliente?.nome || "",
            }));
            setDados(petsCompletos);
            setTotalPaginas(res.totalPaginas || 1);
            setPaginaAtual(pagina);
        } catch (error) {
            setErro({
                aberto: true,
                mensagem: "Erro ao buscar dados.",
                detalhe: error?.response?.data?.message || error?.message || String(error)
            });
        } finally {
            setLoading(false);
        }
    }

    function handleEditar(item, tipo) {
        setModalEditar({ aberto: true, tipo, dados: item });
    }

    function mapearDadosParaTabela() {
        if (tipo === "cliente") {
            return dados.map(c => ({
                id: c.id,
                Nome: c.nome,
                Celular: maskCelular(c.telefone || ""),
                CEP: maskCep(c.cep || ""),
                Número: c.numEndereco,
                Complemento: c.complemento,
                Rua: c.rua || "",
                Bairro: c.bairro || "",
                Cidade: c.cidade || "",
                _original: c
            }));
        } else {
            return dados.map(p => ({
                id: p.id,
                Nome: p.nome,
                Raça: p.racaNome,
                Cliente: p.clienteNome,
                _original: p
            }));
        }
    }

    // Dados da página - agora já vem paginados do backend
    const dadosPagina = mapearDadosParaTabela();

    const irParaPagina = () => {
        const numero = parseInt(paginaInput);
        if (!isNaN(numero) && numero >= 1 && numero <= totalPaginas) {
            setPaginaAtual(numero);
            setPaginaInput("");
        } else {
            alert(`Digite um número entre 1 e ${totalPaginas}`);
        }
    };

    return (
        <div className="historico-root">
            <SideBar selecionado="gerenciar" />

            <div className="content">
                <h1 className="titulo">Gerenciar {tipo === "cliente" ? "Clientes" : "Pets"}</h1>

                <div className="button-container">
                    <div className="tab-container">
                        <button
                            className={tipo === "cliente" ? "button-table-ativo" : "button-table"}
                            onClick={() => setTipo("cliente")}
                        >
                            Cliente
                        </button>
                        <button
                            className={tipo === "pet" ? "button-table-ativo" : "button-table"}
                            onClick={() => setTipo("pet")}
                        >
                            Pet
                        </button>
                    </div>

                    <div className="button-group">
                        <button
                            className="btn-novo"
                            onClick={() => setModalNovo({ aberto: true, tipo })}
                        >
                            + Novo {tipo === "cliente" ? "Cliente" : "Pet"}
                        </button>
                    </div>
                </div>

                <TableHistorico
                    columns={[...colunas, "Editar"]}
                    columnWidths={tamanhoColunas}
                    data={dadosPagina}
                    onEdit={handleEditar}
                    tipo={tipo}
                    rounded
                />

                {/* PAGINAÇÃO */}
                {dados.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "8px", alignItems: "center" }}>
                        <button
                            onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                            disabled={paginaAtual === 1}
                            style={{
                                background: "#307E95",
                                color: "#fff",
                                border: "none",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                cursor: paginaAtual === 1 ? "not-allowed" : "pointer"
                            }}
                        >
                            {"<"}
                        </button>

                        <span style={{ fontWeight: "600" }}>Página {paginaAtual} de {totalPaginas}</span>

                        <button
                            onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                            disabled={paginaAtual === totalPaginas}
                            style={{
                                background: "#307E95",
                                color: "#fff",
                                border: "none",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer"
                            }}
                        >
                            {">"}
                        </button>

                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "10px" }}>
                            <label style={{ fontWeight: "600" }}>Ir para:</label>
                            <input
                                type="number"
                                min="1"
                                max={totalPaginas}
                                value={paginaInput}
                                onChange={(e) => setPaginaInput(e.target.value)}
                                style={{
                                    width: "60px",
                                    padding: "4px",
                                    textAlign: "center",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc"
                                }}
                            />
                            <button
                                onClick={irParaPagina}
                                style={{
                                    background: "#307E95",
                                    color: "#fff",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                Ir
                            </button>
                        </div>
                    </div>
                )}

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

                {modalEditar.aberto && (
                    <ModalGerenciarClientePet
                        tipo={modalEditar.tipo}
                        dados={modalEditar.dados}
                        onClose={() => setModalEditar({ aberto: false, tipo: null, dados: null })}
                        recarregar={tipo === "cliente" ? carregarClientes : carregarPets}
                        setErro={setErro}
                    />
                )}

                {loading && <ModalLoading mensagem="Carregando Dados..." />}
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
