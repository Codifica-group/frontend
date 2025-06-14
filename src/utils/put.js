import axios from "axios";

export async function putDespesa(id, body) {
    try {
        const response = await axios.put(`http://localhost:8080/api/despesas/${id}`, body);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar despesa:", error.response || error.message);
        throw error;
    }
}


export async function putAgenda(id, body) {
    try {
        const response = await axios.put(`http://localhost:8080/api/agendas/${id}`, body);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar agenda:", error.response || error.message);
        throw error;
    }
}

export async function putProduto(id, body) {
    try {
        const response = await axios.put(`http://localhost:8080/api/produtos/${id}`, body)
        return response.data;
    }
    catch (error) {
        console.error("Erro ao atualizar produto:", error.response || error.message);
        throw error;
    }
}

export async function putCliente(id, body) {
    try {
        const response = await axios.put(`http://localhost:8080/api/clientes/${id}`, body);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error.response || error.message);
        throw error;;
    }
}

export async function putPet(id, body) {
    try {
        const response = await axios.put(`http://localhost:8080/api/pets/${id}`, body);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar pet:", error.response || error.message);
        throw error;
    }
}