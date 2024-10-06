import { writable } from 'svelte/store';

export const notifications = writable([] as Array<{ id: number; type: string; message: string }>);

export const addNotification = (type: string, message: string) => {
    const id = Date.now();
    notifications.update(n => [...n, { id, type, message }]);
    setTimeout(() => removeNotification(id), 3000); // Auto-remove notification after 3 seconds
};

export const removeNotification = (id: number) => {
    notifications.update(n => n.filter(notification => notification.id !== id));
};