import React, { useEffect, useState } from "react";
import { getCategoriasPrdutos } from "../utils/get";
import { NumericFormat } from "react-number-format";

export default function ModalGastos(props) {

    const [categorias, setCategorias] = useState();

    useEffect(() => {
        (async () => {
            try {
                setCategorias(await getCategoriasPrdutos());
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
            }
        })();
        props.setSugestoes([]);
    }, []);

    const handleSugestaoClick = (sugestao) => {
        props.change({ target: { name: "produto", value: sugestao } });
        props.setSugestoes([]);
    };

    return (
        <div className="modal-overlay">
            <div className={`modal-${props.tipo}`}>
                <h2>{props.tipo == "atualizar" ? "Atualizar saída" : "Adicionar Saída"}</h2>
                <form onSubmit={props.submit}>
                    <div className="form-group">
                        <label>Produto</label>
                        <input
                            type="text"
                            name="produto"
                            value={props.novoItem.produto}
                            onChange={props.change}
                            placeholder="Ex: Banho"
                            required
                        />
                        {props.sugestoes.length > 0 && (
                            <ul className="sugestoes-list">
                                {props.sugestoes.map((sugestao, index) => (
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
                            onChange={props.change}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categorias &&
                                Object.entries(categorias).map(([categoria], index) => (
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
                                props.change({ target: { name: "valor", value: formattedValue } });
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
                            onChange={props.change}
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
