import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import "../styles/style-dashboard.css";
import SideBar from "../components/SideBar";

export default function DashboardEleve() {
    useEffect(() => {
        document.title = `Dashboard`;
    }, []);

    // Estados para o modal de saída
    const [showModalSaida, setShowModalSaida] = useState(false);
    const [novaSaida, setNovaSaida] = useState({
        produto: "",
        categoria: "",
        valor: "",
        data: "",
    });

    // Estados para o modal de entrada
    const [showModalEntrada, setShowModalEntrada] = useState(false);
    const [novaEntrada, setNovaEntrada] = useState({
        produto: "",
        categoria: "",
        valor: "",
        data: "",
    });

    // Handlers para saída
    const handleInputChangeSaida = (e) => {
        const { name, value } = e.target;
        setNovaSaida((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitSaida = (e) => {
        e.preventDefault();
        console.log("Nova saída:", novaSaida);
        setShowModalSaida(false);
        setNovaSaida({
            produto: "",
            categoria: "",
            valor: "",
            data: "",
        });
    };

    // Handlers para entrada
    const handleInputChangeEntrada = (e) => {
        const { name, value } = e.target;
        setNovaEntrada((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitEntrada = (e) => {
        e.preventDefault();
        console.log("Nova entrada:", novaEntrada);
        setShowModalEntrada(false);
        setNovaEntrada({
            produto: "",
            categoria: "",
            valor: "",
            data: "",
        });
    };

    useEffect(() => {
        const ctxEntrada = document.getElementById("graficoEntrada");
        const ctxSaida = document.getElementById("graficoSaida");

        if (Chart.getChart(ctxEntrada)) Chart.getChart(ctxEntrada).destroy();
        if (Chart.getChart(ctxSaida)) Chart.getChart(ctxSaida).destroy();

        new Chart(ctxEntrada.getContext("2d"), {
            type: "pie",
            data: {
                labels: ["Salário", "Caixinhas", "Outros"],
                datasets: [
                    {
                        label: "Entradas",
                        data: [500, 800, 200],
                        backgroundColor: ["#58873e", "#7dac63", "#ace58d"],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });

        new Chart(ctxSaida.getContext("2d"), {
            type: "pie",
            data: {
                labels: ["Aluguel", "Transporte", "Outros"],
                datasets: [
                    {
                        label: "Saídas",
                        data: [300, 125, 75],
                        backgroundColor: ["#c26363", "#f97777", "#ffbcbc"],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });

        const btn = document.getElementById("btnBalanca");
        if (btn) {
            btn.addEventListener("click", function () {
                this.classList.toggle("ativo");
            });
        }
    }, []);

    return (
        <div className="dashboard">
            <SideBar selecionado = "dashboard"/>
            <div className="main">
                <div className="saldo-topo">
                    Saldo Total:
                    <br />
                    R$ 1.000,00
                    <br />
                    07/04/2025
                </div>

                <div className="bloco-financas-e-graficos">
                    <div className="grafico-coluna">
                        <button
                            title="Adicionar uma saída"
                            className="btnAddSaida"
                            onClick={() => setShowModalSaida(true)}
                        >
                            +
                        </button>

                        {showModalSaida && (
                            <div className="modal-overlay">
                                <div className="modal-saida">
                                    <h2>Adicionar Saída</h2>
                                    <form onSubmit={handleSubmitSaida}>
                                        <div className="form-group">
                                            <label>Produto</label>
                                            <input
                                                type="text"
                                                name="produto"
                                                value={novaSaida.produto}
                                                onChange={handleInputChangeSaida}
                                                placeholder="Ex: Bamboo"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Categoria</label>
                                            <input
                                                type="text"
                                                name="categoria"
                                                value={novaSaida.categoria}
                                                onChange={handleInputChangeSaida}
                                                placeholder="Ex: Banho e Tosa"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Valor</label>
                                            <input
                                                type="number"
                                                name="valor"
                                                value={novaSaida.valor}
                                                onChange={handleInputChangeSaida}
                                                placeholder="R$ 0,00"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Data</label>
                                            <input
                                                type="date"
                                                name="data"
                                                value={novaSaida.data}
                                                onChange={handleInputChangeSaida}
                                                required
                                            />
                                        </div>

                                        <div className="modal-buttons">
                                            <button
                                                type="button"
                                                className="btn-cancelar"
                                                onClick={() => setShowModalSaida(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <button type="submit" className="btn-confirmar">
                                                Confirmar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="grafico-titulo saida">Saída: R$ -500,00</div>
                        <div className="grafico-pizza">
                            <canvas id="graficoSaida"></canvas>
                        </div>
                    </div>

                    <div className="grafico-central">
                        <button
                            id="btnBalanca"
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="80"
                                height="80"
                                viewBox="0 0 64 64"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Base */}
                                <line x1="10" y1="50" x2="54" y2="50" />

                                {/* Suporte central */}
                                <line x1="32" y1="10" x2="32" y2="50" />
                                <circle cx="32" cy="10" r="2" />

                                {/* Barra horizontal */}
                                <line x1="16" y1="20" x2="48" y2="20" />

                                {/* Cordas e prato esquerdo */}
                                <line x1="16" y1="20" x2="22" y2="35" />
                                <line x1="16" y1="20" x2="10" y2="35" />
                                <path d="M10 35 Q16 40 22 35" />

                                {/* Cordas e prato direito */}
                                <line x1="48" y1="20" x2="54" y2="35" />
                                <line x1="48" y1="20" x2="42" y2="35" />
                                <path d="M42 35 Q48 40 54 35" />
                            </svg>
                        </button>
                    </div>

                    <div className="grafico-coluna">
                        <button
                            title="Adicionar uma entrada"
                            className="btnAddEntrada"
                            onClick={() => setShowModalEntrada(true)}
                        >
                            +
                        </button>

                        {showModalEntrada && (
                            <div className="modal-overlay">
                                <div className="modal-entrada">
                                    <h2>Indicador: Saldo</h2>
                                    <form onSubmit={handleSubmitEntrada}>
                                        <div className="form-group">
                                            <label>Produto</label>
                                            <input
                                                type="text"
                                                name="produto"
                                                value={novaEntrada.produto}
                                                onChange={handleInputChangeEntrada}
                                                placeholder="Ex: Banho"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Categoria</label>
                                            <input
                                                type="text"
                                                name="categoria"
                                                value={novaEntrada.categoria}
                                                onChange={handleInputChangeEntrada}
                                                placeholder="Ex: Banho e Tosa"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Valor</label>
                                            <input
                                                type="number"
                                                name="valor"
                                                value={novaEntrada.valor}
                                                onChange={handleInputChangeEntrada}
                                                placeholder="R$ 0,00"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Data</label>
                                            <input
                                                type="date"
                                                name="data"
                                                value={novaEntrada.data}
                                                onChange={handleInputChangeEntrada}
                                                required
                                            />
                                        </div>

                                        <div className="modal-buttons">
                                            <button
                                                type="button"
                                                className="btn-cancelar"
                                                onClick={() => setShowModalEntrada(false)}
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
                        )}

                        <div className="grafico-titulo entrada">Entrada: R$ 1.500,00</div>
                        <div className="grafico-pizza">
                            <canvas id="graficoEntrada"></canvas>
                        </div>
                    </div>
                </div>

                <div className="categorias-container">
                    <div className="saida-wrapper">
                        <div className="saida-container">
                            {[1, 2, 3].map((cat, index) => (
                                <details className="categoria saida" key={index}>
                                    <summary>Categoria {cat}</summary>
                                    <div className="categoria-info">
                                        <ul>
                                            <li>• Gasto 1</li>
                                            <li>• Gasto 2</li>
                                            <li>• Gasto 3</li>
                                        </ul>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>

                    <div className="entrada-wrapper">
                        <div className="entrada-container">
                            {[4, 5, 6].map((cat, index) => (
                                <details className="categoria entrada" key={index}>
                                    <summary>Categoria {cat}</summary>
                                    <div className="categoria-info">
                                        {" "}
                                        <ul>
                                            <li>• Entrada 1</li>
                                            <li>• Entrada 2</li>
                                            <li>• Entrada 3</li>
                                        </ul>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
