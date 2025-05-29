import axios from "axios";

export async function getCategoriasPrdutos(){
    try {
        const response = await axios.get("http://localhost:8080/api/produtos")
        return response.data;
    }
    catch(error) {
        return error;
    };
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
