import React, { useEffect } from "react";
import SideBar from "../components/SideBar";
import LineChartComparacao from "../components/LineChartComparacao";
import "../styles/style-comparacao.css";

const dadosSaida = {
  abril: [12, 14, 15, 16, 18, 20, 21, 23, 24, 25],
  maio: [15, 16, 17, 18, 20, 22, 24, 25, 26, 27],
};

const dadosEntrada = {
  abril: [8, 9, 10, 11, 13, 14, 15, 16, 17, 18],
  maio: [10, 11, 12, 13, 15, 16, 18, 19, 20, 22],
};

export default function Comparacao() {
  useEffect(() => {
    document.title = "Comparação";
  }, []);

  return (
    <div className="container-dashboard">
      <SideBar ativo="Finanças" />
      <main className="main-comparacao">
        <h2>COMPARAÇÃO</h2>

        <div className="cards-info">
        <div className="botoes-comparacao">
          <button className="btn-comparar">Comparar</button>
          <button className="btn-voltar">Voltar</button>
        </div>
          <div className="card-info saida">
            <span>Principais Saídas</span>
            <strong>Material</strong>
            <div className="progress-bar saida">
              <div className="progress" style={{ width: "65%" }}>65%</div>
            </div>
          </div>
          <div className="card-info entrada">
            <span>Principais Entradas</span>
            <strong>Banho e Tosa</strong>
            <div className="progress-bar entrada">
              <div className="progress" style={{ width: "15%" }}>15%</div>
            </div>
          </div>
          <div className="card-info lucro">
            <span>Margem de Lucro</span>
            <strong className="lucro-valor">+ R$ 14.456,80</strong>
          
          </div>
        </div>

        <div className="graficos-comparacao">
          <div className="grafico-box">
            <h3 className="titulo-saida">SAÍDA</h3>
            <LineChartComparacao
              abril={dadosSaida.abril}
              maio={dadosSaida.maio}
              corAbril="#F7A36C"
              corMaio="#4B8BBE"
              maxY={30}
            />
            <span className="intervalo">
              Início do intervalo: terça-feira, 13 de abril de 2025<br />
              Fim do intervalo: terça-feira, 13 de maio de 2025
            </span>
          </div>
          <div className="grafico-box">
            <h3 className="titulo-entrada">ENTRADA</h3>
            <LineChartComparacao
              abril={dadosEntrada.abril}
              maio={dadosEntrada.maio}
              corAbril="#F7A36C"
              corMaio="#4B8BBE"
              maxY={30}
            />
            <span className="intervalo">
              Início do intervalo: terça-feira, 13 de abril de 2025<br />
              Fim do intervalo: terça-feira, 13 de maio de 2025
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
