import { useEffect, useState } from "react";
import { getCategoriasPrdutos, getDespesas } from "../utils/get";
import "../styles/style-dashboard.css";
import SideBar from "../components/SideBar";
import ContainerCategorias from "../components/ContainerCategorias";
import ChartComponent from "../components/ChartComponent";
import ModalGastos from "../components/ModalGastos";
import ModalComparar from "../components/ModalComparar";
import { getDataAtual } from "../utils/util";

export default function DashboardEleve() {
  const [dataSelecionada, setDataSelecionada] = useState(getDataAtual());
  const [categoriasProdutos, setCategoriasProdutos] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [showModalSaida, setShowModalSaida] = useState(false);
  const [novaSaida, setNovaSaida] = useState({
      produto: "",
      categoria: "",
      valor: "",
      data: getDataAtual(),
  });

   useEffect(() => {
        document.title = `Dashboard`;
        (async () => {
            try {
                setCategoriasProdutos(await getCategoriasPrdutos());
                setDespesas(await getDespesas());
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        })();
    }, []);

  const [showModalSaida, setShowModalSaida] = useState(false);
  const [novaSaida, setNovaSaida] = useState({
    produto: "",
    categoria: "",
    valor: "",
    data: getDataAtual(),
  });

  const [showModalComparar, setShowModalComparar] = useState(false);

  const handleSubmitComparar = (e) => {
    e.preventDefault();
    setShowModalComparar(false);
  };

  const [ativo, setAtivo] = useState(false);

  const toggleClasse = () => {
    setAtivo((prev) => !prev);
    setShowModalComparar(true);
  };


  const obterDataFormatada = () => {
    return "terça-feira, 13 de maio de 2025";
  };

  return (
    <div className="dashboard">
      <SideBar selecionado="dashboard" />
      <div className="main">
        {/* NOVO HEADER DE KPI INSERIDO AQUI */}
        <header className="kpi-header-container">
          <div className="kpi-date-display">{obterDataFormatada()}</div>
          <div className="kpi-content-area">
            <div className="kpi-cards-section">
              <div className="kpi-card">
                <div className="kpi-card-title">
                  <span role="img" aria-label="ícone olho" className="icon-eye">👁️</span> Saldo Disponível
                  <span role="img" aria-label="ícone informação" className="icon-info">ⓘ</span>
                </div>
                <div className="kpi-card-value">R$ 1.000,00</div>
              </div>
              <div className="kpi-actions-section">
                <button className="kpi-action-button" onClick={toggleClasse}>
                  <span role="img" aria-label="ícone balança" className="icon-balance">⚖️</span> Comparar
                </button>

                {showModalComparar && (
                  <ModalComparar
                    submit={handleSubmitComparar}
                    showModal={setShowModalComparar}
                  />
                )}
                <button
                  className="kpi-action-button"
                  onClick={() => setShowModalSaida(true)}
                >
                  Adicionar Saída
                </button>
              </div>
              <div className="kpi-card">
                <div className="kpi-card-title">
                  <span role="img" aria-label="ícone gráfico" className="icon-chart">📊</span> Margem de Lucro (últimos 30 dias)
                  <span role="img" aria-label="ícone informação" className="icon-info">ⓘ</span>
                </div>
                <div className="kpi-card-value">
                  +R$ 14.456,80
                  <span className="kpi-percentage-badge">22.3% ↗</span>
                </div>
              </div>
            </div>

          </div>
        </header>

        <div className="bloco-financas-e-graficos">
          <div className="grafico-coluna">
            <div className="grafico-container">

              <div className="grafico-titulo saida">Saída: R$ -500,00</div>
              <div className="grafico-pizza">
                <ChartComponent
                  id="graficoSaida"
                  type="pie"
                  data={{
                    labels: ["Aluguel", "Transporte", "Outros"],
                    datasets: [
                      {
                        label: "Saídas",
                        data: [300, 125, 75],
                        backgroundColor: ["#c26363", "#f97777", "#ffbcbc"],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="categorias-container">
              <ContainerCategorias
                tipo="saida"
                categorias={categoriasProdutos}
                dataSelecionada={dataSelecionada}
              />
            </div>
            {showModalSaida && (
              <ModalGastos
                tipo="saida"
                submit={handleSubmitSaida}
                novoItem={novaSaida}
                showModal={setShowModalSaida} // Passando a função para controlar a visibilidade
                change={handleInputChangeSaida}
                sugestoes={sugestoesSaida}
                setSugestoes={setSugestoesSaida}
              // onClose={() => setShowModalSaida(false)} // Alternativa se o ModalGastos usar onClose
              />
            )}
          </div>



          <div className="grafico-coluna">
            <div className="grafico-container">

              <div className="grafico-titulo entrada">Entrada: R$ 1.500,00</div>
              <div className="grafico-pizza">
                <ChartComponent
                  id="graficoEntrada"
                  type="pie"
                  data={{
                    labels: ["Salário", "Caixinhas", "Outros"],
                    datasets: [
                      {
                        label: "Entradas",
                        data: [500, 800, 200],
                        backgroundColor: ["#58873e", "#7dac63", "#ace58d"],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="categorias-container">
              {/* <ContainerCategorias tipo="entrada" categorias={categoriasProdutos} dataSelecionada={dataSelecionada} /> */}
              {/* Exemplo de como poderia ser, ajuste conforme sua necessidade */}
            </div>
            {/* {showModalEntrada && (
              <ModalGastos 
                tipo="entrada" 
                submit={handleSubmitEntrada} // Definir handleSubmitEntrada
                novoItem={novaEntrada} // Definir novaEntrada
                showModal={setShowModalEntrada} // Passar setShowModalEntrada
                change={handleInputChangeEntrada} // Definir handleInputChangeEntrada
              />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
