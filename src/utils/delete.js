import api from "./api";

export async function deleteDespesa(id) {
    try {
        const response = await api.delete(`/despesas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir despesa:", error.response || error.message);
        throw error;
    }
}

export async function deleteAgenda(id) {
    try {
        const response = await api.delete(`/agendas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir agenda:", error.response || error.message);
        throw error;
    }
}

export async function deleteCliente(id) {
    try {
        const response = await api.delete(`/clientes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir cliente:", error.response || error.message);
        throw error;
    }
}

export async function deletePet(id) {
    try {
        const response = await api.delete(`/pets/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir pet:", error.response || error.message);
        throw error;
    }
}
