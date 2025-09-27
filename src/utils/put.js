import api from "./api";

export async function putDespesa(id, body) {
    try {
        const response = await api.put(`/despesas/${id}`, body);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar despesa:", error.response || error.message);
        throw error;
    }
}


export async function putAgenda(id, body) {
    try {
        const response = await api.put(`/agendas/${id}`, body);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar agenda:", error.response || error.message);
        throw error;
    }
}

export async function putProduto(id, body) {
    try {
        const response = await api.put(`/produtos/${id}`, body)
        return response.data;
    }
    catch (error) {
        console.error("Erro ao atualizar produto:", error.response || error.message);
        throw error;
    }
}

export async function putCliente(id, body) {
    try {
        const response = await api.put(`/clientes/${id}`, body);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error.response || error.message);
        throw error;;
    }
}

export async function putPet(id, body) {
    try {
        const response = await api.put(`/pets/${id}`, body);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar pet:", error.response || error.message);
        throw error;
    }
}
