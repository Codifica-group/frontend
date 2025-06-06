import axios from "axios";

export async function deleteDespesa(id) {
    try {
        const response = await axios.delete(`http://localhost:8080/api/despesas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir despesa:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Erro desconhecido",
            status: error.response?.status || 500,
        };
    }
}

export async function deleteAgenda(id) {
    try {
        const response = await axios.delete(`http://localhost:8080/api/agendas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir agenda:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Erro desconhecido",
            status: error.response?.status || 500,
        };
    }
}

export async function deleteCliente(id) {
    try {
        const response = await axios.delete(`http://localhost:8080/api/clientes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir cliente:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Erro desconhecido",
            status: error.response?.status || 500,
        };
    }
}

export async function deletePet(id) {
    try {
        const response = await axios.delete(`http://localhost:8080/api/pets/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir pet:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Erro desconhecido",
            status: error.response?.status || 500,
        };
    }
}
