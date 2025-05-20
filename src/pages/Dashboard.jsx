import { useEffect, useState } from "react";
import { getCategoriasPrdutos } from "../utils/get";
import "../styles/style-dashboard.css"; // Certifique-se que este arquivo contém os estilos para o novo header
import SideBar from "../components/SideBar";
import ContainerCategorias from "../components/ContainerCategorias";
import ChartComponent from "../components/ChartComponent";
import ModalGastos from "../components/ModalGastos";
import ModalComparar from "../components/ModalComparar";
import { getDataAtual } from "../utils/util";
import { postDespesa, postProduto } from "../utils/post";

export default function DashboardEleve() {
  const [dataSelecionada, setDataSelecionada] = useState(getDataAtual());
  const [categoriasProdutos, setCategoriasProdutos] = useState([]);

  useEffect(() => {
    document.title = `Dashboard`;
    (async () => {
      try {
        setCategoriasProdutos(await getCategoriasPrdutos());
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

  const [sugestoesSaida, setSugestoesSaida] = useState([]);

  const handleInputChangeSaida = (e) => {
    const { name, value } = e.target;
    setNovaSaida((prev) => ({ ...prev, [name]: value }));

    if (name === "produto" && value) {
      const todosProdutos = Object.values(categoriasProdutos).flatMap(
        (categoria) => categoria.map((item) => item.nome)
      );
      const filtrados = todosProdutos.filter((produto) =>
        produto.toLowerCase().includes(value.toLowerCase())
      );
      setSugestoesSaida(filtrados);
    } else if (name === "produto") {
      setSugestoesSaida([]);
    }
  };

  const handleSubmitSaida = async (e) => {
    e.preventDefault();

    const valorNumerico = parseFloat(
      novaSaida.valor.replace("R$ ", "").replace(".", "").replace(",", ".")
    );

    const novaSaidaFormatada = {
      ...novaSaida,
      valor: valorNumerico,
    };

    let produtoExistente = null;

    Object.entries(categoriasProdutos).forEach(([categoriaNome, itens]) => {
      const encontrado = itens.find(
        (item) =>
          item.nome.toLowerCase() === novaSaidaFormatada.produto.toLowerCase()
      );
      if (encontrado) {
        produtoExistente = encontrado;
      }
    });

    if (produtoExistente) {
      const novaDespesa = [
        {
          produtoId: produtoExistente.id,
          valor: novaSaidaFormatada.valor,
          data: novaSaidaFormatada.data,
        },
      ];

      try {
        const response = await postDespesa(novaDespesa);
        console.log("Despesa criada com sucesso:", response);
      } catch (error) {
        console.error("Erro ao criar despesa:", error);
      }
    } else {
      const novoProduto = [
        {
          categoriaId: parseInt(novaSaidaFormatada.categoria, 10),
          nome: novaSaidaFormatada.produto,
        },
      ];

      console.log("Novo produto criado:", novoProduto);

      try {
        const responseProduto = await postProduto(novoProduto);
        console.log("Produto criado com sucesso:", responseProduto);

        const categoriasAtualizadas = await getCategoriasPrdutos();
        setCategoriasProdutos(categoriasAtualizadas);

        let novoProdutoCriado = null;

        Object.entries(categoriasAtualizadas).forEach(
          ([categoriaNome, itens]) => {
            const novoProdutoencontrado = itens.find(
              (item) =>
                item.nome.toLowerCase() ===
                novaSaidaFormatada.produto.toLowerCase()
            );
            if (novoProdutoencontrado) {
              novoProdutoCriado = novoProdutoencontrado;
            }
          }
        );

        console.log(novoProdutoCriado);

        if (novoProdutoCriado) {
          const novaDespesa = [
            {
              produtoId: novoProdutoCriado.id,
              valor: novaSaidaFormatada.valor,
              data: novaSaidaFormatada.data,
            },
          ];

          try {
            const responseDespesa = await postDespesa(novaDespesa);
            console.log(
              "Despesa criada com sucesso para o novo produto:",
              responseDespesa
            );
          } catch (error) {
            console.error(
              "Erro ao criar despesa para o novo produto:",
              error
            );
          }
        } else {
          console.error("Erro: Novo produto não encontrado após atualização.");
        }
      } catch (error) {
        console.error("Erro ao criar produto:", error);
      }
    }

    console.log("Nova saída:", novaSaidaFormatada);

    // Resetar o estado e fechar o modal
    setShowModalSaida(false);
    setNovaSaida({
      produto: "",
      categoria: "",
      valor: "",
      data: getDataAtual(),
    });
  };

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



//   const [showModalEntrada, setShowModalEntrada] = useState(false);
  // const [novaEntrada, setNovaEntrada] = useState({...});
  // const handleInputChangeEntrada = (e) => {...};
  // const handleSubmitEntrada = async (e) => {...};


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
                    {showModalComparar && (
              <ModalComparar
                submit={handleSubmitComparar}
                showModal={setShowModalComparar} // Passando a função para controlar a visibilidade
                // onClose={() => setShowModalComparar(false)} // Alternativa se o ModalComparar usar onClose
              />
            )}
              </button>
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
