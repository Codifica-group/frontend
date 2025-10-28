import { useState } from 'react';
import { getDespesas } from '../utils/get';
import ModalGastos from './ModalGastos';
import { deleteDespesa } from '../utils/delete';
import AlertDelete from './AlertDelete';
import AlertErro from './AlertErro';

export default function ContainerCategorias(props) {
    const [showModalSaida, setShowModalSaida] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [erro, setErro] = useState({ aberto: false, mensagem: "", detalhe: "" });
    const [saida, setSaida] = useState();
    const [idDespesa, setIdDespesa] = useState();

    const exibirModalSaida = (produto, despesa) => {
        setSaida({
            produto: produto.nome,
            categoria: produto.categoria?.id,
            valor: despesa.valor.toString(),
            data: despesa.data,
        });

        setIdDespesa(despesa.id);
        setShowModalSaida(true);
    }

    const excluirDespesa = () => {
        setShowDeleteAlert(true);
    };

    const confirmDelete = async () => {
        setShowDeleteAlert(false);
        try {
            await deleteDespesa(idDespesa);
            const despesasAtualizadas = await getDespesas();
            props.setDespesas(despesasAtualizadas.dados);
            setShowModalSaida(false);
            console.log("Despesas atualizadas:", despesasAtualizadas);
        } catch (error) {
            console.error("Erro ao excluir despesa:", error);
            setErro({
                aberto: true,
                mensagem: `Erro ao deletar despesa.`,
                detalhe: error?.response?.data?.message || error?.message || String(error)
            });
        }
    };

    const cancelDelete = () => {
        setShowDeleteAlert(false);
    };

    return (
        <div className="categoria-wrapper">
            <div className="categoria-container">
                {props.tipo === "saida" ? (
                    props.categorias.map((categoria) => (
                        <details className="categoria" key={categoria.id}>
                            <summary>{categoria.nome}</summary>
                            <div className="categoria-info">
                                <ul>
                                    {props.produtos
                                        .filter((produto) => produto.categoria?.id === categoria.id)
                                        .map((produto) => {
                                            const despesasProduto = (props.despesas || []).filter(
                                                (despesa) =>
                                                    despesa.produto.id === produto.id &&
                                                    despesa.data === props.dataSelecionada
                                            );
                                            return despesasProduto.length <= 0 ? null
                                                : despesasProduto.map((despesaFiltrada) => (
                                                    <li key={despesaFiltrada.id}>
                                                        <div onClick={() => exibirModalSaida(produto, despesaFiltrada)}>
                                                            <span>{produto.nome}</span>
                                                            <span>R$ -{despesaFiltrada.valor}</span>
                                                        </div>
                                                    </li>
                                                ))
                                        })
                                    }
                                </ul>
                            </div>
                        </details>
                    ))
                ) : (
                    props.categorias.map((servico) => (
                        <details className="categoria" key={servico.id}>
                            <summary>{servico.nome}</summary>
                            <div className="categoria-info">
                                <ul>
                                    {(props.despesas || [])
                                        .filter(agenda => agenda.dataHoraInicio.startsWith(props.dataSelecionada))
                                        .map(agenda =>
                                            agenda.servicos
                                                .filter(s => s.id === servico.id)
                                                .map(s => (
                                                    <li key={agenda.id + '-' + s.id}>
                                                        <div>
                                                            <span>{agenda.cliente?.nome} - {agenda.pet?.nome}</span>
                                                            <span>R$ {Number(s.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                                                        </div>
                                                    </li>
                                                ))
                                        )
                                    }
                                </ul>
                            </div>
                        </details>
                    ))
                )}
            </div>
            {showModalSaida && (
                <ModalGastos
                    tipo="atualizar"
                    novoItem={saida}
                    showModal={setShowModalSaida}
                    idDespesa={idDespesa}
                    setNovoItem={setSaida}
                    despesas={props.despesas}
                    setDespesas={props.setDespesas}
                    categorias={props.categorias}
                    produtos={props.produtos}
                    setProdutos={props.setProdutos}
                >
                    <button
                        type="button"
                        className="btn-excluir"
                        onClick={excluirDespesa}
                    >Deletar</button>
                </ModalGastos>
            )}
            {showDeleteAlert && (
                <AlertDelete
                    item={"essa despesa"}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
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
    );
}