import { useState } from 'react';
import { getDespesas } from '../utils/get';
import ModalGastos from './ModalGastos';
import { deleteDespesa } from '../utils/delete';

export default function ContainerCategorias(props) {
    const [showModalSaida, setShowModalSaida] = useState(false);
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

    const excluirDespesa = async () => {
        try {
            await deleteDespesa(idDespesa);
            const despesasAtualizadas = await getDespesas();
            props.setDespesas(despesasAtualizadas);
            setShowModalSaida(false);
            console.log ("Despesas atualizadas:", despesasAtualizadas);
        } catch (error) {
            console.error("Erro ao excluir despesa:", error);
        }
    }

    return (
        <div className="categoria-wrapper">
            <div className="categoria-container">
                {props.categorias.map((categoria) => (
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
                                    })}
                            </ul>
                        </div>
                    </details>
                ))}
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
        </div>
    );
}