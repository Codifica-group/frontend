import axios from "axios";
import { data } from "react-router-dom";
import { getAgendas } from "./get";
import { postAgenda } from "./post";
import { putAgenda } from "./put";

// REQUISIÇÕES PARA A API DE AGENDAS
const API_BASE = "http://localhost:8080/api/agendas";
export const calcularServico = async (body) => {
  try {
    const response = await axios.post(`${API_BASE}/calcular/servico`, body);
    return response.data;
  } catch (error) {
    console.error("Erro ao calcular serviço:", error.response || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Erro desconhecido",
      status: error.response?.status || 500,
    };
  }
};

export const filtrarAgendas = async (filtros) => {
  try {
    const response = await axios.post(`${API_BASE}/filtrar`, filtros);
    return response.data;
  } catch (error) {
    console.error("Erro ao filtrar agendas:", error.response || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Erro desconhecido",
      status: error.response?.status || 500,
    };
  }
};

// FUNÇÕES PARA AGENDA
export async function exibirAgendas() {
  try {
    const response = await getAgendas();
    const data = Array.isArray(response)
      ? response
      : response.content || response.data || [];
    console.log("Agendas:", data);

    return data.map((item) => ({
      id: item.id,
      title: `${Array.isArray(item.servicos) ? item.servicos.map(s => s.nome).join(", ") : (item.servicos?.nome || "")} - ${item.pet?.nome || ""}`,
      start: item.dataHoraInicio,
      end: item.dataHoraFim,
      backgroundColor: "#307e95",
    }));
  } catch (error) {
    console.error("Erro ao buscar agendas:", error);
    return [];
  }
}