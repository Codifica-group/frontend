import axios from "axios";

export async function getProdutos() {
    try {
        const response = await axios.get("http://localhost:8080/api/produtos");
        return response.data;
    } catch (error) {
        return [];
    }
}

export async function getCategorias() {
    try {
        const response = await axios.get("http://localhost:8080/api/categorias");
        return response.data;
    } catch (error) {
        return [];
    }
}

export async function getDespesas(){
    try {
        const response = await axios.get("http://localhost:8080/api/despesas")
        return response.data;
    }
    catch(error) {
        return error;
    };
}

export async function getServicos(){
    try {
        const response = await axios.get("http://localhost:8080/api/servicos")
        return response.data;
    }
    catch(error) {
        return error;
    };
}

export async function getHistorico(filtro) {
    try {
        const response = await axios.post("http://localhost:8080/api/agendas/filtrar", filtro);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return [];
    }
}

export async function getPets() {
    try {
        const response = await axios.get("http://localhost:8080/api/pets");
        return response.data; // Deve ser um array igual ao exemplo que você mandou
    } catch (error) {
        console.error("Erro ao buscar pets:", error);
        return [];
    }
}

export async function getClientes() {
    try {
        const response = await axios.get("http://localhost:8080/api/clientes");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        return [];
    }
}

    export async function getRacas() {
    try {
        const response = await axios.get("http://localhost:8080/api/racas");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar raças:", error);
        return [];
    }
}

export const getAgendas = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/agendas");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todas as agendas:", error.response || error.message);
    return [];
  }
};

export async function getEndereco(cep) {
    try {
        const response = await axios.get(`http://localhost:8080/api/cep/${cep}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar endereço:", error);
        return null;
    }
}