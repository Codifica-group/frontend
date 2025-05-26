import React, { useEffect, useState } from "react";
import { getCategoriasPrdutos, getDespesas } from "../utils/get";
import { NumericFormat } from "react-number-format";
import { postDespesa, postProduto } from "../utils/post";
import { getDataAtual } from "../utils/util";
import { putDespesa } from "../utils/put";

export default function ModalGastos(props) {
    const [sugestoesSaida, setSugestoesSaida] = useState([]);
    let novaDespesa = null;

    useEffect(() => {
        setSugestoesSaida([]);
    }, []);

    const handleSubmitSaida = async (e) => {
        e.preventDefault();

        const valorNumerico = parseFloat(
            props.novoItem.valor.replace("R$ ", "").replace(".", "").replace(",", ".")
        );

        const novaSaidaFormatada = {
            ...props.novoItem,
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
            if(props.tipo === "atualizar") {
                novaDespesa = {
                    produtoId: produtoExistente.id,
                    valor: novaSaidaFormatada.valor,
                    data: novaSaidaFormatada.data,
                };
            } else {
                novaDespesa = [{
                    produtoId: produtoExistente.id,
                    valor: novaSaidaFormatada.valor,
                    data: novaSaidaFormatada.data,
                }];
            }

            try {
                if(props.tipo === "atualizar") {
                    console.log("novaDespesa: ", novaDespesa);
                    const response = await putDespesa(props.idDespesa, novaDespesa);
                    console.log("Despesa atualizada com sucesso:", response);
                } else {
                    console.log("novaDespesa: ", novaDespesa);
                    const response = await postDespesa(novaDespesa);
                    console.log("Despesa criada com sucesso:", response);
                }
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

                props.setCategorias(await getCategoriasPrdutos());
                
                if(props.tipo === "atualizar") {
                    novaDespesa = {
                        produtoId: responseProduto.id,
                        valor: novaSaidaFormatada.valor,
                        data: novaSaidaFormatada.data,
                    };
                } else {
                    novaDespesa = [{
                        produtoId: responseProduto.id,
                        valor: novaSaidaFormatada.valor,
                        data: novaSaidaFormatada.data,
                    }];
                }
                try {
                    if(props.tipo === "atualizar") {
                        const response = await putDespesa(props.idDespesa, novaDespesa);
                        console.log("Despesa atualizada com sucesso:", response);
                    } else {
                        const responseDespesa = await postDespesa(novaDespesa);
                        console.log("Despesa criada com sucesso para o novo produto:", responseDespesa);
                    }
                } catch (error) {
                    console.error("Erro ao criar despesa para o novo produto:", error);
                }
            } catch (error) {
                console.error("Erro ao criar produto:", error);
            }
        }

        console.log("Nova saída:", novaSaidaFormatada);

        props.setDespesas(await getDespesas());
        console.log("Despesas atualizadas:", props.despesas);
        props.showModal(false);
        props.setNovoItem({
            produto: "",
            categoria: "",
            valor: "",
            data: getDataAtual(),
        });
    };

    const handleInputChangeSaida = (e) => {
        const { name, value } = e.target;

        props.setNovoItem((prev) => ({ ...prev, [name]: value }));

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

    const handleSugestaoClick = (sugestao) => {
        handleInputChangeSaida({ target: { name: "produto", value: sugestao } });
        setSugestoesSaida([]);
    };

    return (
        <div className="modal-overlay">
            <div className={`modal-${props.tipo}`}>
                <h2>{props.tipo == "atualizar" ? "Atualizar saída" : "Adicionar Saída"}</h2>
                <form onSubmit={handleSubmitSaida}>
                    <div className="form-group">
                        <label>Produto</label>
                        <input
                            type="text"
                            name="produto"
                            value={props.novoItem.produto}
                            onChange={handleInputChangeSaida}
                            placeholder="Ex: Banho"
                            required
                        />
                        {sugestoesSaida.length > 0 && (
                            <ul className="sugestoes-list">
                                {sugestoesSaida.map((sugestao, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSugestaoClick(sugestao)}
                                        className="sugestao-item"
                                    >
                                        {sugestao}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Categoria</label>
                        <select
                            name="categoria"
                            id="categoria"
                            value={props.novoItem.categoria || ""}
                            onChange={handleInputChangeSaida}
                        >
                            <option value="">Selecione uma categoria</option>
                            {props.categorias &&
                                Object.entries(props.categorias).map(([categoria], index) => (
                                    <option key={index} value={index + 1}>
                                        {categoria}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Valor</label>
                        <NumericFormat
                            value={props.novoItem.valor}
                            onValueChange={(values) => {
                                const { formattedValue } = values;
                                handleInputChangeSaida({ target: { name: "valor", value: formattedValue } });
                            }}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            placeholder="R$ 0,00"
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Data</label>
                        <input
                            type="date"
                            name="data"
                            value={props.novoItem.data}
                            onChange={handleInputChangeSaida}
                            required
                        />
                    </div>

                    <div className="modal-buttons">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={() => props.showModal(false)}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn-confirmar-entrada">
                            Confirmar
                        </button>
                        {props.children}
                    </div>
                </form>
            </div>
        </div>
    );
}
