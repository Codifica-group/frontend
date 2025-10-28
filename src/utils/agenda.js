import api from "./api";
import { getAgendas } from "./get";

// REQUISIÇÕES PARA A API DE AGENDAS
const API_BASE = "http://localhost:8080/api/agendas";
export const calcularServico = async (body) => {
  try {
    const response = await api.post(`/agendas/calcular/servico`, body);
    return response.data;
  } catch (error) {
    console.error("Erro ao calcular serviço:", error.response || error.message);
    throw error;
  }
};

export const filtrarAgendas = async (filtros, offset = 0, size = 100) => {
  try {
    const response = await api.post(`/agendas/filtrar?offset=${offset}&size=${size}`, filtros);
    return response.data;
  } catch (error) {
    console.error("Erro ao filtrar agendas:", error.response || error.message);
    throw error;
  }
};

// FUNÇÕES PARA AGENDA
export async function exibirAgendas(offset = 0, size = 100) {
  try {
    const { dados, totalPaginas } = await getAgendas(offset, size);
    console.log("Agendas:", dados);

    return dados.map((item) => ({
      id: item.id,
      title: `${Array.isArray(item.servicos) ? item.servicos.map(s => s.nome).join(", ") : (item.servicos?.nome || "")} - ${item.pet?.nome || ""}`,
      start: item.dataHoraInicio,
      end: item.dataHoraFim,
      backgroundColor: "#307e95",
    }));
  } catch (error) {
    console.error("Erro ao buscar agendas:", error);
    throw error;
  }
}
