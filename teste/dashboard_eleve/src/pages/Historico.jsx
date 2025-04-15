// src/components/Historico.js
import React from "react";
import "../styles/style-historico.css";
import logo from "../assets/logo.png";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Historico = () => {
    useEffect(() => {
        document.title = `Histórico`;
      }, []);
    return (
        <><div className="sidebar">
            <div className="logo">
                <img src={logo} alt="Logo" />

            </div>
            <ul>
                <li><i><svg width="45" height="45" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21.6667 18.9583V8.125M43.3333 18.9583V8.125M18.9583 29.7917H46.0417M13.5417 56.875H51.4583C52.8949 56.875 54.2727 56.3043 55.2885 55.2885C56.3043 54.2727 56.875 52.8949 56.875 51.4583V18.9583C56.875 17.5217 56.3043 16.144 55.2885 15.1282C54.2727 14.1123 52.8949 13.5417 51.4583 13.5417H13.5417C12.1051 13.5417 10.7273 14.1123 9.7115 15.1282C8.69568 16.144 8.125 17.5217 8.125 18.9583V51.4583C8.125 52.8949 8.69568 54.2727 9.7115 55.2885C10.7273 56.3043 12.1051 56.875 13.5417 56.875Z"
                        stroke="#353535" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                </i><span>Agenda</span></li>
                <li><i><svg width="45" height="45" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M32.5 21.6667C28.0123 21.6667 24.375 24.0906 24.375 27.0833C24.375 30.076 28.0123 32.5 32.5 32.5C36.9877 32.5 40.625 34.924 40.625 37.9167C40.625 40.9094 36.9877 43.3333 32.5 43.3333M32.5 21.6667V43.3333M32.5 21.6667C35.5062 21.6667 38.1333 22.7554 39.539 24.375M32.5 21.6667V18.9583M32.5 43.3333V46.0417M32.5 43.3333C29.4937 43.3333 26.8667 42.2446 25.461 40.625M56.875 32.5C56.875 35.701 56.2445 38.8706 55.0196 41.8279C53.7946 44.7852 51.9992 47.4723 49.7357 49.7357C47.4723 51.9992 44.7852 53.7946 41.8279 55.0196C38.8706 56.2445 35.701 56.875 32.5 56.875C29.299 56.875 26.1294 56.2445 23.1721 55.0196C20.2148 53.7946 17.5277 51.9992 15.2643 49.7357C13.0008 47.4723 11.2054 44.7852 9.98044 41.8279C8.75548 38.8706 8.125 35.701 8.125 32.5C8.125 26.0353 10.6931 19.8355 15.2643 15.2643C19.8355 10.6931 26.0353 8.125 32.5 8.125C38.9647 8.125 45.1645 10.6931 49.7357 15.2643C54.3069 19.8355 56.875 26.0353 56.875 32.5Z"
                        stroke="#353535" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                </i>
                <Link to="/Dashboard">
                <span>Finanças</span>
                </Link>
                </li>
                <li className="historico"><i><svg width="45" height="45" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M27.0832 56.875H46.0415C47.4781 56.875 48.8558 56.3043 49.8717 55.2885C50.8875 54.2727 51.4582 52.8949 51.4582 51.4583V25.4962C51.458 24.778 51.1726 24.0893 50.6646 23.5815L36.0017 8.91854C35.4939 8.4106 34.8052 8.12515 34.0869 8.125H18.9582C17.5216 8.125 16.1438 8.69568 15.128 9.7115C14.1122 10.7273 13.5415 12.1051 13.5415 13.5417V43.3333M13.5415 56.875L26.7555 43.661M26.7555 43.661C27.5076 44.4257 28.4037 45.0339 29.392 45.4505C30.3803 45.8671 31.4414 46.0839 32.5139 46.0884C33.5865 46.0929 34.6493 45.885 35.6411 45.4767C36.6329 45.0683 37.534 44.4677 38.2925 43.7094C39.051 42.951 39.6519 42.0501 40.0604 41.0584C40.469 40.0667 40.6771 39.0039 40.6729 37.9313C40.6687 36.8588 40.4521 35.7977 40.0357 34.8092C39.6194 33.8208 39.0114 32.9246 38.2469 32.1723C36.7192 30.6689 34.6593 29.83 32.5158 29.8385C30.3724 29.847 28.3192 30.7021 26.8034 32.2175C25.2876 33.733 24.432 35.786 24.423 37.9294C24.4141 40.0728 25.2524 42.1329 26.7555 43.661Z"
                        stroke="#1F1F1F" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                </i><span>Histórico</span></li>
            </ul>
        </div><div className="content">
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
            </div></>
            
    );
};

export default Historico;
