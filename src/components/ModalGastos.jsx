import { useEffect, useState } from "react";
import { getDespesas, getProdutos } from "../utils/get";
import { NumericFormat } from "react-number-format";
import { postDespesa, postProduto } from "../utils/post";
import { getDataAtual } from "../utils/util";
import { putDespesa } from "../utils/put";
import Select from "react-select";
import fecharIcon from "../assets/close.png";

export default function ModalGastos(props) {
    const [sugestoesSaida, setSugestoesSaida] = useState([]);
    const [desabilitarInputProduto, setDesabilitarInputProduto] = useState(props.tipo === "atualizar");
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
                if (props.tipo === "atualizar") {
                    await putDespesa(props.idDespesa, novaDespesa);
                } else {
                    await postDespesa(novaDespesa);
                }
            } catch (error) {
                console.error("Erro ao criar/atualizar despesa:", error);
                props.setErro({
                    aberto: true,
                    mensagem: "Erro ao criar/atualizar despesa.",
                    detalhe: error?.response?.data?.message || error?.message || String(error)
                });
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
                    if (props.tipo === "atualizar") {
                        await putDespesa(props.idDespesa, novaDespesa);
                    } else {
                        await postDespesa(novaDespesa);
                    }
                } catch (error) {
                    console.error("Erro ao criar despesa para o novo produto:", error);
                    props.setErro({
                        aberto: true,
                        mensagem: "Erro ao criar despesa para o novo produto.",
                        detalhe: error?.response?.data?.message || error?.message || String(error)
                    });
                }
            } catch (error) {
                console.error("Erro ao criar produto:", error);
                props.setErro({
                    aberto: true,
                    mensagem: "Erro ao criar produto.",
                    detalhe: error?.response?.data?.message || error?.message || String(error)
                });
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

        if (name === "produto" && value) {
            const produtoExistente = props.produtos.find(
                item => item.nome.toLowerCase() === value.toLowerCase()
            );
            if (produtoExistente) {
                props.setNovoItem((prev) => ({
                    ...prev,
                    produto: value,
                    categoria: produtoExistente.categoria?.id || ""
                }));
                setSugestoesSaida([]);
                setDesabilitarInputProduto(true);
                return;
            } else {
                props.setNovoItem((prev) => ({
                    ...prev,
                    produto: value,
                    categoria: ""
                }));
                const todosProdutos = props.produtos.map((item) => item.nome);
                const filtrados = todosProdutos.filter((produto) =>
                    produto.toLowerCase().includes(value.toLowerCase())
                );
                setSugestoesSaida(filtrados);
                setDesabilitarInputProduto(false);
                return;
            }
        }

        props.setNovoItem((prev) => ({ ...prev, [name]: value }));

        if (name === "produto" && value === "") {
            props.setNovoItem((prev) => ({
                ...prev,
                produto: value,
                categoria: ""
            }));
            setDesabilitarInputProduto(false);
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
                        <Select
                            name="categoria"
                            id="categoria"
                            value={
                                props.categorias
                                    .map(categoria => ({
                                        value: categoria.id,
                                        label: categoria.nome
                                    }))
                                    .find(option => option.value === props.novoItem.categoria) || null
                            }
                            onChange={(selectedOption) => {
                                handleInputChangeSaida({ target: { name: "categoria", value: selectedOption ? selectedOption.value : "" } });
                            }}
                            options={props.categorias.map(categoria => ({
                                value: categoria.id,
                                label: categoria.nome
                            }))}
                            placeholder="Selecione uma categoria"
                            isClearable
                            className="form-select"
                            isDisabled={desabilitarInputProduto ? true : false}
                        />
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
                        {props.tipo === "atualizar" ? (
                            <>
                                <button
                                    type="button"
                                    className="btn-fechar"
                                    onClick={() => props.showModal(false)}
                                >
                                    <img src={fecharIcon} alt="Fechar" />
                                </button>
                                {props.children}
                                <button type="submit" className="btn-atualizar-agenda">
                                    Atualizar
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={() => props.showModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-atualizar-agenda">
                                    Salvar
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
