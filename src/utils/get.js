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

export async function getServicos(){
    try {
        const response = await axios.get("http://localhost:8080/api/servicos")
        return response.data;
    }
    catch(error) {
        return error;
    };
}

