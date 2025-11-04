import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList } from 'lucide-react';

export default function SideBar(props) {
    const navigate = useNavigate();

    const onLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Falha no logout do backend, limpando sessão localmente.", error);
        } finally {
            sessionStorage.removeItem("token");
            navigate("/");
        }
    }

    return (
        <div className="sidebar flex flex-col justify-between h-screen">
            <div>
                <div className="logo p-4">
                    <img src={logo} alt="Logo" />
                </div>
                <ul>
                    <Link to="/Agenda">
                        <li className={props.selecionado === "agenda" ? "selecionado" : ""}>
                            <i>
                                <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 65 65"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M21.6667 18.9583V8.125M43.3333 18.9583V8.125M18.9583 29.7917H46.0417M13.5417 56.875H51.4583C52.8949 56.875 54.2727 56.3043 55.2885 55.2885C56.3043 54.2727 56.875 52.8949 56.875 51.4583V18.9583C56.875 17.5217 56.3043 16.144 55.2885 15.1282C54.2727 14.1123 52.8949 13.5417 51.4583 13.5417H13.5417C12.1051 13.5417 10.7273 14.1123 9.7115 15.1282C8.69568 16.144 8.125 17.5217 8.125 18.9583V51.4583C8.125 52.8949 8.69568 54.2727 9.7115 55.2885C10.7273 56.3043 12.1051 56.875 13.5417 56.875Z"
                                        stroke="#353535"
                                        strokeWidth={props.selecionado === "agenda" ? "5" : "3"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </i>
                            <span>Agenda</span>
                        </li>
                    </Link>
                    <Link to="/Dashboard">
                        <li className={props.selecionado === "dashboard" ? "selecionado" : ""}>
                            <i>
                                <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 65 65"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M32.5 21.6667C28.0123 21.6667 24.375 24.0906 24.375 27.0833C24.375 30.076 28.0123 32.5 32.5 32.5C36.9877 32.5 40.625 34.924 40.625 37.9167C40.625 40.9094 36.9877 43.3333 32.5 43.3333M32.5 21.6667V43.3333M32.5 21.6667C35.5062 21.6667 38.1333 22.7554 39.539 24.375M32.5 21.6667V18.9583M32.5 43.3333V46.0417M32.5 43.3333C29.4937 43.3333 26.8667 42.2446 25.461 40.625M56.875 32.5C56.875 35.701 56.2445 38.8706 55.0196 41.8279C53.7946 44.7852 51.9992 47.4723 49.7357 49.7357C47.4723 51.9992 44.7852 53.7946 41.8279 55.0196C38.8706 56.2445 35.701 56.875 32.5 56.875C29.299 56.875 26.1294 56.2445 23.1721 55.0196C20.2148 53.7946 17.5277 51.9992 15.2643 49.7357C13.0008 47.4723 11.2054 44.7852 9.98044 41.8279C8.75548 38.8706 8.125 35.701 8.125 32.5C8.125 26.0353 10.6931 19.8355 15.2643 15.2643C19.8355 10.6931 26.0353 8.125 32.5 8.125C38.9647 8.125 45.1645 10.6931 49.7357 15.2643C54.3069 19.8355 56.875 26.0353 56.875 32.5Z"
                                        stroke="#353535"
                                        strokeWidth={props.selecionado === "dashboard" ? "5" : "3"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </i>
                            <span>Finanças</span>
                        </li>
                    </Link>
                    <Link to="/Historico">
                        <li className={props.selecionado === "historico" ? "selecionado" : ""}>
                            <i>
                                <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 65 65"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M27.0832 56.875H46.0415C47.4781 56.875 48.8558 56.3043 49.8717 55.2885C50.8875 54.2727 51.4582 52.8949 51.4582 51.4583V25.4962C51.458 24.778 51.1726 24.0893 50.6646 23.5815L36.0017 8.91854C35.4939 8.4106 34.8052 8.12515 34.0869 8.125H18.9582C17.5216 8.125 16.1438 8.69568 15.128 9.7115C14.1122 10.7273 13.5415 12.1051 13.5415 13.5417V43.3333M13.5415 56.875L26.7555 43.661M26.7555 43.661C27.5076 44.4257 28.4037 45.0339 29.392 45.4505C30.3803 45.8671 31.4414 46.0839 32.5139 46.0884C33.5865 46.0929 34.6493 45.885 35.6411 45.4767C36.6329 45.0683 37.534 44.4677 38.2925 43.7094C39.051 42.951 39.6519 42.0501 40.0604 41.0584C40.469 40.0667 40.6771 39.0039 40.6729 37.9313C40.6687 36.8588 40.4521 35.7977 40.0357 34.8092C39.6194 33.8208 39.0114 32.9246 38.2469 32.1723C36.7192 30.6689 34.6593 29.83 32.5158 29.8385C30.3724 29.847 28.3192 30.7021 26.8034 32.2175C25.2876 33.733 24.432 35.786 24.423 37.9294C24.4141 40.0728 25.2524 42.1329 26.7555 43.661Z"
                                        stroke="#1F1F1F"
                                        strokeWidth={props.selecionado === "historico" ? "5" : "3"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </i>
                            <span>Histórico</span>
                        </li>
                    </Link>
                    <Link to="/Gerenciar">
                        <li className={props.selecionado === "gerenciar" ? "selecionado" : ""}>
                            <i>
                                {/* <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 65 65"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M27.0832 56.875H46.0415C47.4781 56.875 48.8558 56.3043 49.8717 55.2885C50.8875 54.2727 51.4582 52.8949 51.4582 51.4583V25.4962C51.458 24.778 51.1726 24.0893 50.6646 23.5815L36.0017 8.91854C35.4939 8.4106 34.8052 8.12515 34.0869 8.125H18.9582C17.5216 8.125 16.1438 8.69568 15.128 9.7115C14.1122 10.7273 13.5415 12.1051 13.5415 13.5417V43.3333M13.5415 56.875L26.7555 43.661M26.7555 43.661C27.5076 44.4257 28.4037 45.0339 29.392 45.4505C30.3803 45.8671 31.4414 46.0839 32.5139 46.0884C33.5865 46.0929 34.6493 45.885 35.6411 45.4767C36.6329 45.0683 37.534 44.4677 38.2925 43.7094C39.051 42.951 39.6519 42.0501 40.0604 41.0584C40.469 40.0667 40.6771 39.0039 40.6729 37.9313C40.6687 36.8588 40.4521 35.7977 40.0357 34.8092C39.6194 33.8208 39.0114 32.9246 38.2469 32.1723C36.7192 30.6689 34.6593 29.83 32.5158 29.8385C30.3724 29.847 28.3192 30.7021 26.8034 32.2175C25.2876 33.733 24.432 35.786 24.423 37.9294C24.4141 40.0728 25.2524 42.1329 26.7555 43.661Z"
                                        stroke="#1F1F1F"
                                        strokeWidth={props.selecionado === "gerenciar" ? "5" : "3"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg> */}
                                <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 64 64"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g transform="translate(62, 6) scale(-1, 1)">
                                        <path
                                            d="M34.7,42c-2.8,0-6.4,4.9-6.4,8h-5.2 c-1.7,0-3.2,1.6-3.2,3.5l0,0c0,2,1.4,3.4,3.2,3.4h22.5C58.6,57,62.1,45.3,61,37.1l0,0c0,0-11.1,11.8-14.1,11.8 c0.1-12.2-8.9-23.7-14.8-29C28.8,16.9,27.9,9,27.9,9V4.8c0-4.3-0.3-8.9-1.2-9.5c-1.6-1.1-4.4,4.6-6.7,4.6c-11.7,0-10,8-12.5,8H2.2 C0,7.9,0,9.7,0,10.9c0.2,3.3,1.9,6,10,6c2,0,5.1,2.8,5.1,7.9v26.1H15h-1c-1.1,0-2,0.9-2,2v2c0,1.1,0.9,2,2,2h15.75"
                                            stroke={props.selecionado === "gerenciar" ? "#1F1F1F" : "#353535"}
                                            strokeWidth={props.selecionado === "gerenciar" ? "5" : "3"}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M20.9,38v8.8"
                                            stroke={props.selecionado === "gerenciar" ? "#1F1F1F" : "#353535"}
                                            strokeWidth={props.selecionado === "gerenciar" ? "5" : "3"}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M1,14h6"
                                            stroke={props.selecionado === "gerenciar" ? "#1F1F1F" : "#353535"}
                                            strokeWidth={props.selecionado === "gerenciar" ? "2" : "1"}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                </svg>
                            </i>
                            <span>Gerenciar</span>
                        </li>
                    </Link>

                    {}
                    <Link to="/Solicitacao">
                        <li className={props.selecionado === "solicitacao" ? "selecionado" : ""}>
                            <i>
                                <ClipboardList size={48} strokeWidth={props.selecionado === "solicitacao" ? "2" : "1"} color="#1F1F1F"/>
                            </i>
                            <span>Solicitações</span>
                        </li>
                    </Link>
                </ul>
            </div>

            <ul className="mb-4">
                <li onClick={onLogout} className="cursor-pointer flex items-center gap-2">
                    <i>
                        <svg
                            width="45"
                            height="45"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#353535"
                            strokeWidth={props.selecionado === "sair" ? "5" : "2"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </i>
                    <span style={{ color: "#1F1F1F" }}>Sair</span>
                </li>
            </ul>

        </div>
    );
}