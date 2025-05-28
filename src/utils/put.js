import axios from "axios";

export async function putDespesa(id, body) {
    try {
        const response = await axios.put(`http://localhost:8080/api/despesas/${id}`, body);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar despesa:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Erro desconhecido",
            status: error.response?.status || 500,
        };
    }
}

export async function putProduto(id, body){
    try {
        const response = await axios.put(`http://localhost:8080/api/produtos/${id}`, body)
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