import React from "react";

export default function ModalAgenda(props) {

    return (
        <div className="modal-overlay">
            <div className="modal-agenda">
                <h2>Novo Agendamento</h2>
                <form onSubmit={() => props.showModal(false)}>
                    <div className="form-inputs">
                        <div className="form-group">
                            <label>Cliente</label>
                            <input type="text" placeholder="Nome do Cliente" required />
                        </div>
                        <div className="form-group">
                            <label>Pet</label>
                            <input type="text" placeholder="Nome do Pet" required />
                        </div>
                    </div>
                    <div className="form-inputs">
                        <div className="form-group">
                            <label>Raça</label>
                            <input type="text" placeholder="Raça do pet" required />
                        </div>
                        <div className="form-group select">
                            <label>Tipo de Serviço</label>
                            <select required>
                                <option value="">Serviço</option>
                                <option value="banho">Banho</option>
                                <option value="tosa">Tosa</option>
                                <option value="hidratacao">Hidratação</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-inputs">
                        <div className="form-group">
                            <label>Começo do atendimento</label>
                            <input type="datetime-local" required />
                        </div>
                        <div className="form-group">
                            <label>Final do atendimento</label>
                            <input type="datetime-local" required />
                        </div>
                    </div>
                    <div className="form-inputs">
                        <div className="form-group">
                            <label>Observação</label>
                            <input type="text" placeholder="Detalhes do atendimento do pet" />
                        </div>
                    </div>
                    <div className="modal-buttons">
                        <button type="button" onClick={() => props.showModal(false)} className="btn-cancelar">Cancelar</button>
                        <button type="submit" className="btn-confirmar-entrada">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    )

}