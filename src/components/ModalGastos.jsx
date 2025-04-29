import React from "react";

export default function ModalGastos(props) {
    return (
        <div className="modal-overlay">
            <div className={`modal-${props.tipo}`}>
                <h2>{props.tipo == "entrada" ? "Adicionar Entrada" : "Adicionar Saída"}</h2>
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
                    </div>

                    <div className="form-group">
                        <label>Categoria</label>
                        <input
                            type="text"
                            name="categoria"
                            value={props.novoItem.categoria}
                            onChange={props.change}
                            placeholder="Ex: Banho e Tosa"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Valor</label>
                        <input
                            type="number"
                            name="valor"
                            value={props.novoItem.valor}
                            onChange={props.change}
                            placeholder="R$ 0,00"
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
                    </div>
                </form>
            </div>
        </div>
    );
}
