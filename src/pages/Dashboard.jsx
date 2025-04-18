import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import "../styles/style-dashboard.css";
import logo from "../assets/logo.png";

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
    data: ""
  });

  // Estados para o modal de entrada
  const [showModalEntrada, setShowModalEntrada] = useState(false);
  const [novaEntrada, setNovaEntrada] = useState({
    produto: "",
    categoria: "",
    valor: "",
    data: ""
  });

  // Handlers para saída
  const handleInputChangeSaida = (e) => {
    const { name, value } = e.target;
    setNovaSaida(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitSaida = (e) => {
    e.preventDefault();
    console.log("Nova saída:", novaSaida);
    setShowModalSaida(false);
    setNovaSaida({
      produto: "",
      categoria: "",
      valor: "",
      data: ""
    });
  };

  // Handlers para entrada
  const handleInputChangeEntrada = (e) => {
    const { name, value } = e.target;
    setNovaEntrada(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEntrada = (e) => {
    e.preventDefault();
    console.log("Nova entrada:", novaEntrada);
    setShowModalEntrada(false);
    setNovaEntrada({
      produto: "",
      categoria: "",
      valor: "",
      data: ""
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
      <link rel="icon" type="image/svg+xml" href="/logo.png" />
      <div className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul>
                 <li>
                   <i>
                     <svg width="45" height="45" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path
                         d="M21.6667 18.9583V8.125M43.3333 18.9583V8.125M18.9583 29.7917H46.0417M13.5417 56.875H51.4583C52.8949 56.875 54.2727 56.3043 55.2885 55.2885C56.3043 54.2727 56.875 52.8949 56.875 51.4583V18.9583C56.875 17.5217 56.3043 16.144 55.2885 15.1282C54.2727 14.1123 52.8949 13.5417 51.4583 13.5417H13.5417C12.1051 13.5417 10.7273 14.1123 9.7115 15.1282C8.69568 16.144 8.125 17.5217 8.125 18.9583V51.4583C8.125 52.8949 8.69568 54.2727 9.7115 55.2885C10.7273 56.3043 12.1051 56.875 13.5417 56.875Z"
                         stroke="#353535" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                       />
                     </svg>
                   </i>
                   <Link to="/Agenda">
                   <span>Agenda</span>
                   </Link>
                 </li>
                 <li className="financas">
                   <i>
                     <svg width="45" height="45" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path
                         d="M32.5 21.6667C28.0123 21.6667 24.375 24.0906 24.375 27.0833C24.375 30.076 28.0123 32.5 32.5 32.5C36.9877 32.5 40.625 34.924 40.625 37.9167C40.625 40.9094 36.9877 43.3333 32.5 43.3333M32.5 21.6667V43.3333M32.5 21.6667C35.5062 21.6667 38.1333 22.7554 39.539 24.375M32.5 21.6667V18.9583M32.5 43.3333V46.0417M32.5 43.3333C29.4937 43.3333 26.8667 42.2446 25.461 40.625M56.875 32.5C56.875 35.701 56.2445 38.8706 55.0196 41.8279C53.7946 44.7852 51.9992 47.4723 49.7357 49.7357C47.4723 51.9992 44.7852 53.7946 41.8279 55.0196C38.8706 56.2445 35.701 56.875 32.5 56.875C29.299 56.875 26.1294 56.2445 23.1721 55.0196C20.2148 53.7946 17.5277 51.9992 15.2643 49.7357C13.0008 47.4723 11.2054 44.7852 9.98044 41.8279C8.75548 38.8706 8.125 35.701 8.125 32.5C8.125 26.0353 10.6931 19.8355 15.2643 15.2643C19.8355 10.6931 26.0353 8.125 32.5 8.125C38.9647 8.125 45.1645 10.6931 49.7357 15.2643C54.3069 19.8355 56.875 26.0353 56.875 32.5Z"
                         stroke="#353535" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                       />
                     </svg>
                   </i>
                   <Link to="/Dashboard">
                   <span >Finanças</span>
                   </Link>
                 </li>
                 <li>
                   <i>
                     <svg width="45" height="45" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path
                         d="M27.0832 56.875H46.0415C47.4781 56.875 48.8558 56.3043 49.8717 55.2885C50.8875 54.2727 51.4582 52.8949 51.4582 51.4583V25.4962C51.458 24.778 51.1726 24.0893 50.6646 23.5815L36.0017 8.91854C35.4939 8.4106 34.8052 8.12515 34.0869 8.125H18.9582C17.5216 8.125 16.1438 8.69568 15.128 9.7115C14.1122 10.7273 13.5415 12.1051 13.5415 13.5417V43.3333M13.5415 56.875L26.7555 43.661M26.7555 43.661C27.5076 44.4257 28.4037 45.0339 29.392 45.4505C30.3803 45.8671 31.4414 46.0839 32.5139 46.0884C33.5865 46.0929 34.6493 45.885 35.6411 45.4767C36.6329 45.0683 37.534 44.4677 38.2925 43.7094C39.051 42.951 39.6519 42.0501 40.0604 41.0584C40.469 40.0667 40.6771 39.0039 40.6729 37.9313C40.6687 36.8588 40.4521 35.7977 40.0357 34.8092C39.6194 33.8208 39.0114 32.9246 38.2469 32.1723C36.7192 30.6689 34.6593 29.83 32.5158 29.8385C30.3724 29.847 28.3192 30.7021 26.8034 32.2175C25.2876 33.733 24.432 35.786 24.423 37.9294C24.4141 40.0728 25.2524 42.1329 26.7555 43.661Z"
                         stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                       />
                     </svg>
                   </i>
                   <Link to="/historico">
                     <span>Histórico</span>
                     </Link>
                 </li>
               </ul>
      </div>

      <div className="main">
        <div className="saldo-topo">
          Saldo Total:<br />R$ 1.000,00<br />07/04/2025
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
            <button id="btnBalanca" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
                  <div className="categoria-info">   <ul>
                    <li>• Entrada 1</li>
                    <li>• Entrada 2</li>
                    <li>• Entrada 3</li>
                  </ul></div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}