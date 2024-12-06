export function swDev() {
    function determineAppServerKey() {
        const vapidPublicKey =
            "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
        return urlBase64ToUint8Array(vapidPublicKey);
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    let swUrl = `./service-worker.js`;
    navigator.serviceWorker
        .register(swUrl)
        .then(async (registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
            const subscription = await registration.pushManager.getSubscription();
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: determineAppServerKey()
            });
        })
        .catch((error) => {
            console.log("Service Worker registration failed:", error);
        });
}
