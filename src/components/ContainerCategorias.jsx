import React, { useEffect, useState } from 'react';
import { getCategoriasPrdutos} from '../utils/get';
import ModalGastos from './ModalGastos';
import { deleteDespesa } from '../utils/delete';

export default function ContainerCategorias(props) {
    const [showModalSaida, setShowModalSaida] = useState(false);
    const [saida, setSaida] = useState();
    const [idDespesa, setIdDespesa] = useState();

    const exibirModalSaida = (categoriaProduto, despesa) => {
        setSaida({
            produto: categoriaProduto.nome,
            categoria: categoriaProduto.categoriaId,
            valor: despesa.valor.toString(),
            data: despesa.data,
        });

        setIdDespesa(despesa.id);

        setShowModalSaida(true);
    }

    const excluirDespesa = async () => {
        try {
            const response = await deleteDespesa(idDespesa);
            console.log("Despesa excluída com sucesso:", response);

            const categoriasAtualizadas = await getCategoriasPrdutos();
            setCategoriasProdutos(categoriasAtualizadas);

            setShowModalSaida(false);
        } catch (error) {
            console.error("Erro ao excluir despesa:", error);
        }
    }

    return (
        <div className="categoria-wrapper">
            <div className="categoria-container">
                {Object.entries(props.categorias).map(([categoriaNome, itens], index) => (
                    <details className="categoria" key={index}>
                        <summary>{categoriaNome}</summary>
                        <div className="categoria-info">
                            <ul>
                                {Array.isArray (itens) && itens
                                    .filter((item) =>
                                        (Array.isArray(props.despesas) ? props.despesas : []).some(
                                            (despesa) =>
                                                despesa.produtoId === item.id &&
                                                despesa.data === props.dataSelecionada
                                        )
                                    )
                                    .map((item) => (
                                        <li key={item.id}>
                                            <div>
                                                {props.despesas
                                                    .filter(
                                                        (despesa) =>
                                                            despesa.produtoId === item.id &&
                                                            despesa.data === props.dataSelecionada
                                                    )
                                                    .map((despesaFiltrada) => (
                                                        <div key={despesaFiltrada.id} onClick={() => exibirModalSaida(item, despesaFiltrada)}>
                                                            <div>{item.nome}</div>
                                                            <div >
                                                                R$ -{despesaFiltrada.valor}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </li>
                                    ))}
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
                    setCategorias={props.setCategorias}
                >
                    <button
                        type="button"
                        className="btn-excluir"
                        onClick={() => excluirDespesa()}
                    >Deletar</button>
                </ModalGastos>
            )}
        </div>
    );
}