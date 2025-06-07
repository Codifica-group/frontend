import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";

export default function ModalValorAgenda({ valores, onClose, onSalvar }) {
    const [servicos, setServicos] = useState(
        Array.isArray(valores.servicos)
            ? valores.servicos.map(s => ({
                ...s,
                valor: s.valor ?? ""
            }))
            : []
    );
    const [deslocamento, setDeslocamento] = useState(
        valores.deslocamento?.valor !== undefined ? valores.deslocamento.valor : ""
    );
    const [total, setTotal] = useState(
        valores.valor !== undefined && valores.valor !== null ? valores.valor : ""
    );

    useEffect(() => {
        const somaServicos = servicos.reduce((acc, s) => acc + (Number(s.valor) || 0), 0);
        setTotal((Number(deslocamento) || 0) + somaServicos);
    }, [servicos, deslocamento]);

    const handleServicoChange = (idx, value) => {
        setServicos(prev =>
            prev.map((s, i) => i === idx ? { ...s, valor: value.value === undefined ? "" : value.floatValue } : s)
        );
    };

    const handleDeslocamentoChange = (value) => {
        setDeslocamento(value.value === undefined ? "" : value.floatValue);
    };

    // Chama o onSalvar do pai passando os serviços atualizados
    const handleSalvarClick = (e) => {
        e.preventDefault();
        if (onSalvar) {
            onSalvar({
                ...valores,
                servicos,
                deslocamento,
                valor: total
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-agenda">
                <h2>Valor Agendamento</h2>
                <form>
                    {servicos.length > 0 && servicos.map((servico, idx) => (
                        <div className="form-group" key={servico.id}>
                            <label>
                                Valor do {servico.nome}
                            </label>
                            <NumericFormat
                                value={servico.valor}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="R$ "
                                allowNegative={false}
                                decimalScale={2}
                                fixedDecimalScale
                                onValueChange={val => handleServicoChange(idx, val)}
                                className="form-control"
                                placeholder="R$ 0,00"
                            />
                        </div>
                    ))}
                    <div className="form-group">
                        <label style={{ marginBottom: 0 }}>Valor do Deslocamento</label>
                        {Number(valores.deslocamento?.distancia) > 0 && Number(valores.deslocamento?.tempo) > 0 && (
                            <span>
                                Distancia: {valores.deslocamento?.distancia} KM | Tempo: {valores.deslocamento?.tempo} Minutos
                            </span>
                        )}
                        <NumericFormat
                            value={deslocamento}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            allowNegative={false}
                            decimalScale={2}
                            fixedDecimalScale
                            onValueChange={handleDeslocamentoChange}
                            className="form-control"
                            placeholder="R$ 0,00"
                            style={{ marginTop: '1vh' }}
                        />
                    </div>
                    <div className="form-group">
                        <div className="total-value">
                            Total: R$ {Number(total).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="btn-cancelar">Voltar</button>
                        <button
                            type="button"
                            className="btn-confirmar-entrada"
                            onClick={handleSalvarClick}
                        >
                            Salvar Agenda
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}