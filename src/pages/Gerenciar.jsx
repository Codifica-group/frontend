import "../styles/style-historico.css";
import "../styles/style-Gerenciar.css";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import TableHistorico from "../components/TableHistorico";
import { getClientes, getPets, getEndereco } from "../utils/get";
import ModalLoading from "../components/ModalLoading";
import AlertErro from "../components/AlertErro";
import { FaRegEdit } from "react-icons/fa";
import NoData from "../components/NoData";
import ModalGerenciarClientePet, { maskCelular, maskCep } from "../components/ModalGerenciarClientePet"; // Importe as máscaras
import ModalNovoClientePet from "../components/ModalNovoClientePet";
import ModalEditarClientePet from "../components/ModalEditarClientePet";

const Gerenciar = () => {
    const [tipo, setTipo] = useState("cliente");
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("Carregando Dados...");
    const [erro, setErro] = useState({ aberto: false, mensagem: "", detalhe: "" });
    const [colunas, setColunas] = useState([]);
    const [tamanhoColunas, setTamanhoColunas] = useState([]);
    const [modal, setModal] = useState({ aberto: false, tipo: null, dados: null });
    const [modalNovo, setModalNovo] = useState({ aberto: false, tipo: null });
    const [modalEditar, setModalEditar] = useState({ aberto: false, tipo: null, dados: null });

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
        setColunas(["Nome", "Celular", "CEP", "Rua", "Número", "Complemento", "Bairro", "Cidade"]);
        setTamanhoColunas(["15%", "7%", "3%", "8%", "1%", "5%", "4%", "4%"]);
        try {
        const clientes = await getClientes();
        // const clientesComEndereco = await Promise.all(
        //     (Array.isArray(clientes) ? clientes : []).map(async c => {
        //         let endereco = {};
        //         if (c.cep) {
        //             endereco = await getEndereco(c.cep);
        //         }
        //         return {
        //             ...c,
        //             logradouro: endereco?.logradouro || "",
        //             bairro: endereco?.bairro || "",
        //             localidade: endereco?.localidade || ""
        //         };
        //     })
        // );
        setDados(clientesComEndereco);
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
        setTamanhoColunas(["20%", "10%", "15%"]);
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
        setModalEditar({ aberto: true, tipo, dados: item });
        console.log(item);
        console.log(tipo);
    }

    function mapearDadosParaTabela() {
    if (tipo === "cliente") {
        return dados.map(c => ({
            id: c.id,
            Nome: c.nome,
            "Celular": maskCelular(c.numCelular || ""),
            CEP: maskCep(c.cep || ""),
            "Número": c.numEndereco,
            Complemento: c.complemento,
            Rua: c.logradouro || "",
            Bairro: c.bairro || "",
            Cidade: c.localidade || "",
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

    return (
        <div className="historico-root">
            <SideBar selecionado="Gerenciar" />

            <div className="content">
                <h1 className="titulo">
                    Gerenciar {tipo === "cliente" ? "Clientes" : "Pets"}
                </h1>
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
                    columnWidths={[...tamanhoColunas, "1%"]}
                    data={mapearDadosParaTabela()}
                    onEdit={handleEditar}
                    tipo={tipo}
                    rounded
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
                {modalEditar.aberto && (
                    <ModalGerenciarClientePet
                        tipo={modalEditar.tipo}
                        dados={modalEditar.dados}
                        onClose={() => setModalEditar({ aberto: false, tipo: null, dados: null })}
                        recarregar={tipo === "cliente" ? carregarClientes : carregarPets}
                        setErro={setErro}
                    />
                )}
                {loading && (
                    <ModalLoading mensagem={loadingMsg} />
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
