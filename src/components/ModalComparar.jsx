import React from "react";

export default function ModalGastos(props) {
    return(
        <div className="modal-overlay">
            <div className="modal-comparar">
                <h2>Comparar</h2>
                <form onSubmit={props.submit} className="form-comparar">
                    <div className="form-title">
                        <label>Primeiro Intervalo</label>
                    </div>
                    <div className="form-inputs">
                        <div>
                            <label>Início do Intervalo</label>
                            <input
                                type="date"
                                name="inicio"
                                required
                            />
                        </div>
                        <div>
                            <label>Fim do Intervalo</label>
                            <input
                                type="date"
                                name="fim"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-title">
                        <label>Segundo Intervalo</label>
                    </div>
                    <div className="form-inputs">
                        <div>
                            <label>Início do Intervalo</label>
                            <input
                                type="date"
                                name="inicio"
                                required
                            />
                        </div>
                        <div>
                            <label>Fim do Intervalo</label>
                            <input
                                type="date"
                                name="fim"
                                required
                            />
                        </div>
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
    )
}