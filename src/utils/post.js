import axios from "axios";

export async function postDespesa(body){
    try {
        const response = await axios.post("http://localhost:8080/api/despesas", body)
        return response.data;
    }
    catch(error) {
        console.error("Erro na requisição:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Erro desconhecido",
            status: error.response?.status || 500,
        };
    };
}

export async function postProduto(body){
    try {
        const response = await axios.post("http://localhost:8080/api/produtos", body)
        return response.data;
    }
    catch(error) {
        console.error("Erro na requisição:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Erro desconhecido",
            status: error.response?.status || 500,
        };
    };
}

export async function postLucro(body){
    try {
        const response = await axios.post("http://localhost:8080/api/agendas/calcular/lucro", body)
        return response.data;
    }
    catch(error) {
        console.error("Erro na requisição:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Erro desconhecido",
            status: error.response?.status || 500,
        };
    };
}

export async function postVerificacao(token){
    try {
        const response = await axios.post(
            "http://localhost:8080/api/auth/validate",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    }
    catch(error) {
        console.error("Erro na requisição:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Erro desconhecido",
            status: error.response?.status || 500,
        };
    };
}

export const postAgenda = async (agenda) => {
  try {
    const response = await axios.post("http://localhost:8080/api/agendas/agenda");
    return response.data;
  } catch (error) {
    console.error("Erro ao criar agenda:", error.response || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Erro desconhecido",
      status: error.response?.status || 500,
    };
  }
};