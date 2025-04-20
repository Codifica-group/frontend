import "../styles/style-agenda.css";
import { useEffect } from "react";
import SideBar from "../components/SideBar";

export default function Agenda() {
    useEffect(() => {
        document.title = `Agenda`;
    }, []);
    const agendamentos = [
        { hora: "08:30 - 09:00", descricao: "Banho + Higienização (Mel)" },
        { hora: "10:00 - 11:00", descricao: "Banho (Rex)" },
        { hora: "11:30 - 12:00", descricao: "Banho (Bob)" },
        { hora: "13:00 - 14:00", descricao: "Banho (Max)" },
        { hora: "15:00 - 15:30", descricao: "Banho (Tobu)" },
        { hora: "16:00 - 16:30", descricao: "Banho (Fred)" },
    ];

    const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado"];
    const datasSemana = ["06", "07", "08", "09", "10", "11"];
    const horarios = [
        "08h", "09h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h"
    ];

    // Exemplo de agendamentos no grid (ajuste conforme necessário)
    const gridAgendas = [
        { dia: 2, hora: 0, texto: "Banho + Higienização (Mel)" },
        { dia: 0, hora: 1, texto: "Banho (Rex)" },
        { dia: 2, hora: 1, texto: "Banho (Rex)" },
        { dia: 2, hora: 2, texto: "Banho (Bob)" },
        { dia: 2, hora: 4, texto: "Banho (Max)" },
        { dia: 2, hora: 6, texto: "Banho (Tobu)" },
        { dia: 2, hora: 7, texto: "Banho (Fred)" },
        { dia: 3, hora: 1, texto: "Banho (Rex)" },
        { dia: 4, hora: 1, texto: "Banho (Rex)" },
        { dia: 5, hora: 7, texto: "Banho (Rex)" },
        { dia: 3, hora: 2, texto: "Banho (Rex)" },
        { dia: 1, hora: 2, texto: "Banho (Rex)" },
    ];

    return (
        <div className="agenda-root">
            <SideBar selecionado="agenda" />

            {/* Conteúdo principal */}
            <div className="agenda-container">
                <main className="agenda-main">
                    <div className="agenda-header">
                        <span>08 de Abril 2025, Quarta</span>
                        <button className="btn-novo">+ Novo Agendamento</button>
                    </div>
                    <div className="agenda-content">
                        {/* Calendário e lista lateral */}
                        <section className="agenda-sidebar">
                            <Calendar />
                            <div className="agenda-lista">
                                <h4>Agendamentos do Dia</h4>
                                <ul>
                                    {agendamentos.map((ag, i) => (
                                        <li key={i}>
                                            <span>{ag.hora}</span> - {ag.descricao}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                        {/* Grade semanal */}
                        <section className="agenda-grid">
                            <div className="agenda-grid-header">
                                <div className="agenda-grid-canto"></div>
                                {datasSemana.map((data, idx) => (
                                    <div key={idx} className="agenda-grid-dia">
                                        <span>{data}</span>
                                        <span>{diasSemana[idx]}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="agenda-grid-body">
                                {horarios.map((hora, linha) => (
                                    <div className="agenda-grid-row" key={linha}>
                                        <div className="agenda-grid-hora">{hora}</div>
                                        {datasSemana.map((_, coluna) => {
                                            const ag = gridAgendas.find(
                                                a => a.dia === coluna && a.hora === linha
                                            );
                                            return (
                                                <div
                                                    key={coluna}
                                                    className={`agenda-grid-cell${ag ? " agendado" : ""}`}
                                                >
                                                    {ag && <span>{ag.texto}</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Componente de calendário simplificado
function Calendar() {
    return (
        <div className="agenda-calendar">
            <div className="agenda-calendar-header">
                <button>{"<"}</button>
                <span>Abril 2025</span>
                <button>{">"}</button>
            </div>
            <div className="agenda-calendar-grid">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                    <div key={i} className="agenda-calendar-dia">{d}</div>
                ))}
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className={`agenda-calendar-dia${[6, 7, 8, 9, 10, 11].includes(i + 1) ? " marcado" : ""}`}
                    >
                        {i + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}
