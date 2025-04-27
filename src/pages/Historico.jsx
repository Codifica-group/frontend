import "../styles/style-historico.css";
import { useEffect } from "react";
import SideBar from "../components/SideBar";
import TableHistorico from "../components/TableHistorico";

const Historico = () => {
    useEffect(() => {
        document.title = `Histórico`;
    }, []);

    const columns = ["Data", "Hora", "Cliente", "Pet", "Raça", "Serviço", "Valor"];
    const data = [
        { Data: "21/03/2025", Hora: "08:00 - 09:00", Cliente: "Maria Eduarda", Pet: "Charlotte", Raça: "Pug", Serviço: "Banho e Tosa", Valor: "R$100,00" },
        { Data: "22/03/2025", Hora: "09:30 - 10:30", Cliente: "Carlos Silva", Pet: "Bobby", Raça: "Labrador", Serviço: "Tosa Completa", Valor: "R$150,00" },
        { Data: "23/03/2025", Hora: "10:00 - 11:00", Cliente: "Ana Clara", Pet: "Luna", Raça: "Poodle", Serviço: "Banho Medicinal", Valor: "R$120,00" },
        { Data: "24/03/2025", Hora: "11:30 - 12:30", Cliente: "João Pedro", Pet: "Scooby", Raça: "Dachshund", Serviço: "Tosa Higiênica", Valor: "R$80,00" },
        { Data: "25/03/2025", Hora: "13:00 - 14:00", Cliente: "Sofia Almeida", Pet: "Mia", Raça: "Siamês (gato)", Serviço: "Banho e Escovação", Valor: "R$90,00" },
        { Data: "26/03/2025", Hora: "14:30 - 15:30", Cliente: "Lúcia Ferreira", Pet: "Duke", Raça: "Buldogue Francês", Serviço: "Tosa Completa e Banho Perfumado", Valor: "R$200,00" },
        { Data: "27/03/2025", Hora: "08:00 - 09:00", Cliente: "Gabriel Lima", Pet: "Thor", Raça: "Husky Siberiano", Serviço: "Banho", Valor: "R$90,00" },
        { Data: "27/03/2025", Hora: "09:00 - 10:00", Cliente: "Camila Rocha", Pet: "Mel", Raça: "Shih Tzu", Serviço: "Tosa Higiênica", Valor: "R$85,00" },
        { Data: "27/03/2025", Hora: "10:00 - 11:00", Cliente: "Ricardo Nunes", Pet: "Max", Raça: "Golden Retriever", Serviço: "Banho e Tosa", Valor: "R$130,00" },
        { Data: "27/03/2025", Hora: "11:00 - 12:00", Cliente: "Fernanda Dias", Pet: "Nina", Raça: "Persa (gato)", Serviço: "Hidratação", Valor: "R$110,00" },
        { Data: "27/03/2025", Hora: "13:00 - 14:00", Cliente: "Thiago Martins", Pet: "Luke", Raça: "Boxer", Serviço: "Banho", Valor: "R$100,00" },
        { Data: "27/03/2025", Hora: "14:00 - 15:00", Cliente: "Larissa Souza", Pet: "Julie", Raça: "Poodle", Serviço: "Tosa Completa", Valor: "R$120,00" },
        { Data: "27/03/2025", Hora: "15:00 - 16:00", Cliente: "Henrique Castro", Pet: "Apolo", Raça: "Rottweiler", Serviço: "Banho", Valor: "R$130,00" },
        { Data: "27/03/2025", Hora: "16:00 - 17:00", Cliente: "Bruna Reis", Pet: "Pitucha", Raça: "Yorkshire", Serviço: "Hidratação e Escovação", Valor: "R$140,00" },
        { Data: "28/03/2025", Hora: "08:30 - 09:30", Cliente: "Pedro Alves", Pet: "Zeus", Raça: "Pastor Alemão", Serviço: "Tosa Higiênica", Valor: "R$110,00" },
        { Data: "28/03/2025", Hora: "09:30 - 10:30", Cliente: "Juliana Torres", Pet: "Lily", Raça: "Pinscher", Serviço: "Banho Medicinal", Valor: "R$105,00" },
        { Data: "28/03/2025", Hora: "10:30 - 11:30", Cliente: "Felipe Moura", Pet: "Tom", Raça: "Siamês (gato)", Serviço: "Escovação", Valor: "R$75,00" },
        { Data: "28/03/2025", Hora: "11:30 - 12:30", Cliente: "Isabela Ribeiro", Pet: "Lola", Raça: "Cocker Spaniel", Serviço: "Banho e Tosa", Valor: "R$125,00" },
        { Data: "28/03/2025", Hora: "13:30 - 14:30", Cliente: "Renato Costa", Pet: "Chico", Raça: "Poodle", Serviço: "Tosa Criativa", Valor: "R$150,00" },
        { Data: "28/03/2025", Hora: "14:30 - 15:30", Cliente: "Marcela Gomes", Pet: "Bella", Raça: "Shih Tzu", Serviço: "Banho e Hidratação", Valor: "R$115,00" },
        { Data: "28/03/2025", Hora: "15:30 - 16:30", Cliente: "Lucas Araújo", Pet: "Fred", Raça: "Bulldog Inglês", Serviço: "Banho", Valor: "R$110,00" },
        { Data: "28/03/2025", Hora: "16:30 - 17:30", Cliente: "Tatiane Melo", Pet: "Amora", Raça: "Gato SRD", Serviço: "Banho e Escovação", Valor: "R$95,00" },
        { Data: "29/03/2025", Hora: "08:00 - 09:00", Cliente: "Diogo Batista", Pet: "Toby", Raça: "Pitbull", Serviço: "Hidratação", Valor: "R$125,00" },
        { Data: "29/03/2025", Hora: "09:00 - 10:00", Cliente: "Mariana Neves", Pet: "Lua", Raça: "Poodle", Serviço: "Tosa Higiênica", Valor: "R$80,00" },
        { Data: "29/03/2025", Hora: "10:00 - 11:00", Cliente: "André Coelho", Pet: "Rex", Raça: "Chow Chow", Serviço: "Banho", Valor: "R$140,00" },
        { Data: "29/03/2025", Hora: "11:00 - 12:00", Cliente: "Renata Braga", Pet: "Flor", Raça: "Gato Persa", Serviço: "Escovação", Valor: "R$85,00" },
        { Data: "29/03/2025", Hora: "13:00 - 14:00", Cliente: "Eduardo Lopes", Pet: "Nick", Raça: "Border Collie", Serviço: "Tosa Completa", Valor: "R$135,00" },
        { Data: "29/03/2025", Hora: "14:00 - 15:00", Cliente: "Vanessa Cruz", Pet: "Bia", Raça: "Pug", Serviço: "Banho", Valor: "R$90,00" },
        { Data: "29/03/2025", Hora: "15:00 - 16:00", Cliente: "Caio Mendes", Pet: "Snow", Raça: "Samoyeda", Serviço: "Banho e Hidratação", Valor: "R$160,00" },
        { Data: "29/03/2025", Hora: "16:00 - 17:00", Cliente: "Aline Barreto", Pet: "Zara", Raça: "Lhasa Apso", Serviço: "Tosa e Escovação", Valor: "R$100,00" },
        { Data: "30/03/2025", Hora: "08:00 - 09:00", Cliente: "Otávio Silva", Pet: "Félix", Raça: "Gato SRD", Serviço: "Banho Medicinal", Valor: "R$110,00" },
        { Data: "30/03/2025", Hora: "09:00 - 10:00", Cliente: "Priscila Viana", Pet: "Lady", Raça: "Beagle", Serviço: "Tosa Higiênica", Valor: "R$95,00" },
        { Data: "30/03/2025", Hora: "10:00 - 11:00", Cliente: "Hugo Andrade", Pet: "Flash", Raça: "Whippet", Serviço: "Banho", Valor: "R$90,00" },
        { Data: "30/03/2025", Hora: "11:00 - 12:00", Cliente: "Beatriz Teixeira", Pet: "Moana", Raça: "Chihuahua", Serviço: "Tosa e Hidratação", Valor: "R$105,00" },
        { Data: "30/03/2025", Hora: "13:00 - 14:00", Cliente: "Rafael Dias", Pet: "Simba", Raça: "Maine Coon", Serviço: "Banho e Escovação", Valor: "R$120,00" },
        { Data: "30/03/2025", Hora: "14:00 - 15:00", Cliente: "Catarina Souza", Pet: "Léo", Raça: "SRD", Serviço: "Tosa Higiênica", Valor: "R$80,00" },
        { Data: "30/03/2025", Hora: "15:00 - 16:00", Cliente: "Murilo Rocha", Pet: "Bento", Raça: "Spitz Alemão", Serviço: "Banho Perfumado", Valor: "R$110,00" },
    ];

    return (
        <div>
            <SideBar selecionado="historico" />
            
            <div className="content">
                <h1 className="titulo">Histórico</h1>
                <div className="filter-container">

                    <div className="filter-section">
                        <label htmlFor="start-date">Data Início:</label>
                        <input type="date" id="start-date" />

                        <label htmlFor="end-date">Data Fim:</label>
                        <input type="date" id="end-date" />
                    </div>
                    
                    <div className="filter-section">
                        <input type="text" placeholder="Nome Cliente" />

                        <input type="text" placeholder="Nome Pet" />

                        <input type="text" placeholder="Raça" />

                        <select>
                            <option value="">Serviço</option>
                            <option value="banho">Banho</option>
                            <option value="tosa">Tosa</option>
                            <option value="hidratacao">Hidratação</option>
                        </select>   

                        <button>Filtrar</button>
                    </div>
                </div>
                <TableHistorico columns={columns} data={data} />
            </div>
        </div>

    );
};

export default Historico;
