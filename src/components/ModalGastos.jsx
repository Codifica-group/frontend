import { useEffect, useState } from "react";
import { getDespesas, getProdutos } from "../utils/get";
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

        const produtoExistente = props.produtos.find(
            (item) => item.nome.toLowerCase() === novaSaidaFormatada.produto.toLowerCase()
        );


        if (produtoExistente) {
            if (props.tipo === "atualizar") {
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
                    await putDespesa(props.idDespesa, novaDespesa);
                } else {
                    await postDespesa(novaDespesa);
                }
            } catch (error) {
                console.error("Erro ao criar/atualizar despesa:", error);
            }
        } else {
            const novoProduto = [{
                categoriaId: parseInt(novaSaidaFormatada.categoria, 10),
                nome: novaSaidaFormatada.produto,
            }];
            try {
                const responseProduto = await postProduto(novoProduto);
                const produtoCriado = Array.isArray(responseProduto) ? responseProduto[0] : responseProduto;
                await props.setProdutos(await getProdutos());
                await props.setDespesas(await getDespesas());
                if (props.tipo === "atualizar") {
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
                        await putDespesa(props.idDespesa, novaDespesa);
                    } else {
                        await postDespesa(novaDespesa);
                    }
                } catch (error) {
                    console.error("Erro ao criar despesa para o novo produto:", error);
                }
            } catch (error) {
                console.error("Erro ao criar produto:", error);
            }
        }

        props.setDespesas(await getDespesas());
        console.log("Produtos atualizados:", props.produtos);
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
            const todosProdutos = props.produtos.map((item) => item.nome);
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
                            autoComplete="off"
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
                                props.categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nome}
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
