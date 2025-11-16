import appIcon from '/public/favicon.ico';

export function showDesktopNotification(title, body, icon = appIcon) {
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