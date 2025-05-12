import React, { useEffect, useState } from 'react';
import { getCategoriasPrdutos, getDespesas } from '../utils/get';
import ModalGastos from './ModalGastos';
import { putDespesa } from '../utils/put';
import { postProduto } from '../utils/post';
import { deleteDespesa } from '../utils/delete';

export default function ContainerCategorias(props) {
    const [showModalSaida, setShowModalSaida] = useState(false);
    const [despesas, setDespesas] = useState([]);
    const [categoriasProdutos, setCategoriasProdutos] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                setDespesas(await getDespesas());
            } catch (error) {
                console.error("Erro ao carregar despesas:", error);
            }
        })();
    }, []);

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

    const handleSubmitSaida = async (e) => {
        e.preventDefault();

        const valorNumerico = parseFloat(
            saida.valor.replace("R$ ", "").replace(".", "").replace(",", ".")
        );

        const novaSaidaFormatada = {
            ...saida,
            valor: valorNumerico,
        };

        let produtoExistente = null;

        Object.entries(props.categorias).forEach(([categoriaNome, itens]) => {
            const encontrado = itens.find(
                (item) => item.nome.toLowerCase() === novaSaidaFormatada.produto.toLowerCase()
            );
            if (encontrado) {
                produtoExistente = encontrado;
            }
        });

        if (produtoExistente) {
            const novaDespesa = {
                produtoId: produtoExistente.id,
                valor: novaSaidaFormatada.valor,
                data: novaSaidaFormatada.data,
            };

            try {
                const response = await putDespesa(idDespesa, novaDespesa);
                console.log("Despesa atualizada com sucesso:", response);
            } catch (error) {
                console.error("Erro ao criar despesa:", error);
            }
        } else {
            const novoProduto = [{
                categoriaId: parseInt(novaSaidaFormatada.categoria, 10),
                nome: novaSaidaFormatada.produto,
            }];

            console.log("Novo produto criado:", novoProduto);

            try {
                const responseProduto = await postProduto(novoProduto);
                console.log("Produto criado com sucesso:", responseProduto);

                const categoriasAtualizadas = await getCategoriasPrdutos();
                setCategoriasProdutos(categoriasAtualizadas);

                let novoProdutoCriado = null;

                Object.entries(categoriasAtualizadas).forEach(([categoriaNome, itens]) => {
                    const novoProdutoencontrado = itens.find(
                        (item) => item.nome.toLowerCase() === novaSaidaFormatada.produto.toLowerCase()
                    );
                    if (novoProdutoencontrado) {
                        novoProdutoCriado = novoProdutoencontrado;
                    }
                });

                console.log(novoProdutoCriado);

                if (novoProdutoCriado) {
                    const novaDespesa = {
                        produtoId: novoProdutoCriado.id,
                        valor: novaSaidaFormatada.valor,
                        data: novaSaidaFormatada.data,
                    };

                    try {
                        const responseDespesa = await putDespesa(idDespesa, novaDespesa);
                        console.log("Despesa criada com sucesso para o novo produto:", responseDespesa);
                    } catch (error) {
                        console.error("Erro ao criar despesa para o novo produto:", error);
                    }
                } else {
                    console.error("Erro: Novo produto não encontrado após atualização.");
                }
            } catch (error) {
                console.error("Erro ao criar produto:", error);
            }
        }

        console.log("Nova saída:", novaSaidaFormatada);

        setShowModalSaida(false);
    };

    const [sugestoesSaida, setSugestoesSaida] = useState([]);

    const handleInputChangeSaida = (e) => {
        const { name, value } = e.target;

        setSaida((prev) => ({ ...prev, [name]: value }));

        if (name === "produto" && value) {
            const todosProdutos = Object.values(props.categorias).flatMap((categoria) =>
                categoria.map((item) => item.nome)
            );
            const filtrados = todosProdutos.filter((produto) =>
                produto.toLowerCase().includes(value.toLowerCase())
            );
            setSugestoesSaida(filtrados);
        } else if (name === "produto") {
            setSugestoesSaida([]);
        }
    };

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
                                {despesas && itens
                                    .filter((item) =>
                                        despesas.some(
                                            (despesa) =>
                                                despesa.produtoId === item.id &&
                                                despesa.data === props.dataSelecionada
                                        )
                                    )
                                    .map((item) => (
                                        <li key={item.id}>
                                            <div>
                                                {despesas
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
                    submit={handleSubmitSaida}
                    novoItem={saida}
                    showModal={setShowModalSaida}
                    change={handleInputChangeSaida}
                    sugestoes={sugestoesSaida}
                    setSugestoes={setSugestoesSaida}
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