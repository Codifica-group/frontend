import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { showDesktopNotification } from '../utils/desktopNotification';

const API_URL = (import.meta.env.VITE_URL_API || window.location.origin);
const SOCKET_URL = `${API_URL}/api/ws`;

let stompClient = null;

export const useAppNotifications = () => {
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const connect = () => {
            if (stompClient && stompClient.active) {
                console.log("STOMP: Já conectado.");
                return;
            }

            stompClient = new Client({
                webSocketFactory: () => new SockJS(SOCKET_URL),
                
                debug: (str) => {
                    console.log('STOMP: ' + str);
                },
                
                reconnectDelay: 5000,
                
                onConnect: (frame) => {
                    console.log('STOMP: Conectado: ' + frame);
                    
                    stompClient.subscribe('/topic/solicitacoes', (message) => {
                        try {
                            const payload = JSON.parse(message.body);
                            
                            if (payload.titulo && payload.mensagem) {
                                showDesktopNotification(payload.titulo, payload.mensagem);
                            }

                            if (window.location.pathname.includes('/solicitacao')) {
                                window.location.reload(); 
                            }

                        } catch (e) {
                            console.error("Erro ao processar mensagem WebSocket:", e);
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error('STOMP: Erro no broker: ' + frame.headers['message']);
                    console.error('STOMP: Detalhes: ' + frame.body);
                },
                onWebSocketClose: () => {
                    console.log('STOMP: Conexão fechada.');
                },
                onWebSocketError: (error) => {
                    console.error('STOMP: Erro de WebSocket', error);
                }
            });

            stompClient.activate();
        };

        connect();

        return () => {
            if (stompClient && stompClient.active) {
                stompClient.deactivate();
                stompClient = null;
                console.log("STOMP: Desconectado.");
            }
        };
    }, []);
};