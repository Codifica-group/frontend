import "../styles/style-historico.css";
import { useEffect } from "react";
import SideBar from "../components/SideBar";

const Historico = () => {
    useEffect(() => {
        document.title = `Histórico`;
    }, []);

    return (
        <div>
            <SideBar selecionado="historico" />
            
            <div className="content">
                <h1 className="titulo">Histórico</h1>
                <div className="filter-section">

                    <label htmlFor="start-date">Data Início:</label>
                    <input type="date" id="start-date" />

                    <label htmlFor="end-date">Data Fim:</label>
                    <input type="date" id="end-date" />

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
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Pet</th>
                            <th>Raça</th>
                            <th>Serviço</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>21/03/2025</td>
                            <td>08:00 - 09:00</td>
                            <td>Maria Eduarda</td>
                            <td>Charlotte</td>
                            <td>Pug</td>
                            <td>Banho e Tosa</td>
                            <td>R$100,00</td>
                        </tr>
                        <tr>
                            <td>22/03/2025</td>
                            <td>09:30 - 10:30</td>
                            <td>Carlos Silva</td>
                            <td>Bobby</td>
                            <td>Labrador</td>
                            <td>Tosa Completa</td>
                            <td>R$150,00</td>
                        </tr>
                        <tr>
                            <td>23/03/2025</td>
                            <td>10:00 - 11:00</td>
                            <td>Ana Clara</td>
                            <td>Luna</td>
                            <td>Poodle</td>
                            <td>Banho Medicinal</td>
                            <td>R$120,00</td>
                        </tr>
                        <tr>
                            <td>24/03/2025</td>
                            <td>11:30 - 12:30</td>
                            <td>João Pedro</td>
                            <td>Scooby</td>
                            <td>Dachshund</td>
                            <td>Tosa Higiênica</td>
                            <td>R$80,00</td>
                        </tr>
                        <tr>
                            <td>25/03/2025</td>
                            <td>13:00 - 14:00</td>
                            <td>Sofia Almeida</td>
                            <td>Mia</td>
                            <td>Siamês (gato)</td>
                            <td>Banho e Escovação</td>
                            <td>R$90,00</td>
                        </tr>


                        <tr>
                            <td>26/03/2025</td>
                            <td>14:30 - 15:30</td>
                            <td>Lúcia Ferreira</td>
                            <td>Duke</td>
                            <td>Buldogue Francês</td>
                            <td>Tosa Completa e Banho Perfumado</td>
                            <td>R$200,00</td>
                        </tr>
                        <tr>
                            <td>27/03/2025</td>
                            <td>08:00 - 09:00</td>
                            <td>Gabriel Lima</td>
                            <td>Thor</td>
                            <td>Husky Siberiano</td>
                            <td>Banho</td>
                            <td>R$90,00</td>
                        </tr>
                        <tr>
                            <td>27/03/2025</td>
                            <td>09:00 - 10:00</td>
                            <td>Camila Rocha</td>
                            <td>Mel</td>
                            <td>Shih Tzu</td>
                            <td>Tosa Higiênica</td>
                            <td>R$85,00</td>
                        </tr>
                        <tr>
                            <td>27/03/2025</td>
                            <td>10:00 - 11:00</td>
                            <td>Ricardo Nunes</td>
                            <td>Max</td>
                            <td>Golden Retriever</td>
                            <td>Banho e Tosa</td>
                            <td>R$130,00</td>
                        </tr>
                        <tr>
                            <td>27/03/2025</td>
                            <td>11:00 - 12:00</td>
                            <td>Fernanda Dias</td>
                            <td>Nina</td>
                            <td>Persa (gato)</td>
                            <td>Hidratação</td>
                            <td>R$110,00</td>
                        </tr>
                        <tr>
                            <td>27/03/2025</td>
                            <td>13:00 - 14:00</td>
                            <td>Thiago Martins</td>
                            <td>Luke</td>
                            <td>Boxer</td>
                            <td>Banho</td>
                            <td>R$100,00</td>
                        </tr>
                        <tr>
                            <td>27/03/2025</td>
                            <td>14:00 - 15:00</td>
                            <td>Larissa Souza</td>
                            <td>Julie</td>
                            <td>Poodle</td>
                            <td>Tosa Completa</td>
                            <td>R$120,00</td>
                        </tr>
                        <tr>
                            <td>27/03/2025</td>
                            <td>15:00 - 16:00</td>
                            <td>Henrique Castro</td>
                            <td>Apolo</td>
                            <td>Rottweiler</td>
                            <td>Banho</td>
                            <td>R$130,00</td>
                        </tr>
                        <tr>
                            <td>27/03/2025</td>
                            <td>16:00 - 17:00</td>
                            <td>Bruna Reis</td>
                            <td>Pitucha</td>
                            <td>Yorkshire</td>
                            <td>Hidratação e Escovação</td>
                            <td>R$140,00</td>
                        </tr>
                        <tr>
                            <td>28/03/2025</td>
                            <td>08:30 - 09:30</td>
                            <td>Pedro Alves</td>
                            <td>Zeus</td>
                            <td>Pastor Alemão</td>
                            <td>Tosa Higiênica</td>
                            <td>R$110,00</td>
                        </tr>
                        <tr>
                            <td>28/03/2025</td>
                            <td>09:30 - 10:30</td>
                            <td>Juliana Torres</td>
                            <td>Lily</td>
                            <td>Pinscher</td>
                            <td>Banho Medicinal</td>
                            <td>R$105,00</td>
                        </tr>
                        <tr>
                            <td>28/03/2025</td>
                            <td>10:30 - 11:30</td>
                            <td>Felipe Moura</td>
                            <td>Tom</td>
                            <td>Siamês (gato)</td>
                            <td>Escovação</td>
                            <td>R$75,00</td>
                        </tr>
                        <tr>
                            <td>28/03/2025</td>
                            <td>11:30 - 12:30</td>
                            <td>Isabela Ribeiro</td>
                            <td>Lola</td>
                            <td>Cocker Spaniel</td>
                            <td>Banho e Tosa</td>
                            <td>R$125,00</td>
                        </tr>
                        <tr>
                            <td>28/03/2025</td>
                            <td>13:30 - 14:30</td>
                            <td>Renato Costa</td>
                            <td>Chico</td>
                            <td>Poodle</td>
                            <td>Tosa Criativa</td>
                            <td>R$150,00</td>
                        </tr>
                        <tr>
                            <td>28/03/2025</td>
                            <td>14:30 - 15:30</td>
                            <td>Marcela Gomes</td>
                            <td>Bella</td>
                            <td>Shih Tzu</td>
                            <td>Banho e Hidratação</td>
                            <td>R$115,00</td>
                        </tr>
                        <tr>
                            <td>28/03/2025</td>
                            <td>15:30 - 16:30</td>
                            <td>Lucas Araújo</td>
                            <td>Fred</td>
                            <td>Bulldog Inglês</td>
                            <td>Banho</td>
                            <td>R$110,00</td>
                        </tr>
                        <tr>
                            <td>28/03/2025</td>
                            <td>16:30 - 17:30</td>
                            <td>Tatiane Melo</td>
                            <td>Amora</td>
                            <td>Gato SRD</td>
                            <td>Banho e Escovação</td>
                            <td>R$95,00</td>
                        </tr>
                        <tr>
                            <td>29/03/2025</td>
                            <td>08:00 - 09:00</td>
                            <td>Diogo Batista</td>
                            <td>Toby</td>
                            <td>Pitbull</td>
                            <td>Hidratação</td>
                            <td>R$125,00</td>
                        </tr>
                        <tr>
                            <td>29/03/2025</td>
                            <td>09:00 - 10:00</td>
                            <td>Mariana Neves</td>
                            <td>Lua</td>
                            <td>Poodle</td>
                            <td>Tosa Higiênica</td>
                            <td>R$80,00</td>
                        </tr>
                        <tr>
                            <td>29/03/2025</td>
                            <td>10:00 - 11:00</td>
                            <td>André Coelho</td>
                            <td>Rex</td>
                            <td>Chow Chow</td>
                            <td>Banho</td>
                            <td>R$140,00</td>
                        </tr>
                        <tr>
                            <td>29/03/2025</td>
                            <td>11:00 - 12:00</td>
                            <td>Renata Braga</td>
                            <td>Flor</td>
                            <td>Gato Persa</td>
                            <td>Escovação</td>
                            <td>R$85,00</td>
                        </tr>
                        <tr>
                            <td>29/03/2025</td>
                            <td>13:00 - 14:00</td>
                            <td>Eduardo Lopes</td>
                            <td>Nick</td>
                            <td>Border Collie</td>
                            <td>Tosa Completa</td>
                            <td>R$135,00</td>
                        </tr>
                        <tr>
                            <td>29/03/2025</td>
                            <td>14:00 - 15:00</td>
                            <td>Vanessa Cruz</td>
                            <td>Bia</td>
                            <td>Pug</td>
                            <td>Banho</td>
                            <td>R$90,00</td>
                        </tr>
                        <tr>
                            <td>29/03/2025</td>
                            <td>15:00 - 16:00</td>
                            <td>Caio Mendes</td>
                            <td>Snow</td>
                            <td>Samoyeda</td>
                            <td>Banho e Hidratação</td>
                            <td>R$160,00</td>
                        </tr>
                        <tr>
                            <td>29/03/2025</td>
                            <td>16:00 - 17:00</td>
                            <td>Aline Barreto</td>
                            <td>Zara</td>
                            <td>Lhasa Apso</td>
                            <td>Tosa e Escovação</td>
                            <td>R$100,00</td>
                        </tr>
                        <tr>
                            <td>30/03/2025</td>
                            <td>08:00 - 09:00</td>
                            <td>Otávio Silva</td>
                            <td>Félix</td>
                            <td>Gato SRD</td>
                            <td>Banho Medicinal</td>
                            <td>R$110,00</td>
                        </tr>
                        <tr>
                            <td>30/03/2025</td>
                            <td>09:00 - 10:00</td>
                            <td>Priscila Viana</td>
                            <td>Lady</td>
                            <td>Beagle</td>
                            <td>Tosa Higiênica</td>
                            <td>R$95,00</td>
                        </tr>
                        <tr>
                            <td>30/03/2025</td>
                            <td>10:00 - 11:00</td>
                            <td>Hugo Andrade</td>
                            <td>Flash</td>
                            <td>Whippet</td>
                            <td>Banho</td>
                            <td>R$90,00</td>
                        </tr>
                        <tr>
                            <td>30/03/2025</td>
                            <td>11:00 - 12:00</td>
                            <td>Beatriz Teixeira</td>
                            <td>Moana</td>
                            <td>Chihuahua</td>
                            <td>Tosa e Hidratação</td>
                            <td>R$105,00</td>
                        </tr>
                        <tr>
                            <td>30/03/2025</td>
                            <td>13:00 - 14:00</td>
                            <td>Rafael Dias</td>
                            <td>Simba</td>
                            <td>Maine Coon</td>
                            <td>Banho e Escovação</td>
                            <td>R$120,00</td>
                        </tr>
                        <tr>
                            <td>30/03/2025</td>
                            <td>14:00 - 15:00</td>
                            <td>Catarina Souza</td>
                            <td>Léo</td>
                            <td>SRD</td>
                            <td>Tosa Higiênica</td>
                            <td>R$80,00</td>
                        </tr>
                        <tr>
                            <td>30/03/2025</td>
                            <td>15:00 - 16:00</td>
                            <td>Murilo Rocha</td>
                            <td>Bento</td>
                            <td>Spitz Alemão</td>
                            <td>Banho Perfumado</td>
                            <td>R$110,00</td>
                        </tr>



                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default Historico;
