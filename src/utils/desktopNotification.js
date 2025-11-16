export function showDesktopNotification(title, body, icon = '/favicon.ico') {
    if (!("Notification" in window)) {
        console.warn("Este navegador não suporta notificações desktop.");
        return;
    }

    if (Notification.permission === "granted") {
        new Notification(title, { body, icon, lang: 'pt-BR' });
    }
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification(title, { body, icon, lang: 'pt-BR' });
            }
        });
    }
}