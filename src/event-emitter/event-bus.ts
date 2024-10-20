/* eslint-disable no-constant-condition */
type Events = Record<string, unknown>;
type AllEvents<E extends Events> = {
    [K in keyof E]: { key: K; value: E[K] };
}[keyof E];

type Listener<T> = (arg: T) => void;

class EventBus<E extends Events = Events> {
    constructor() {}

    private listeners: {
        [K in keyof E]?: Listener<E[K]>[];
    } = {};

    private allListeners: Listener<AllEvents<E>>[] = [];

    onAll(listener: Listener<AllEvents<E>>) {
        this.allListeners.push(listener);
    }

    offAll(listener: Listener<AllEvents<E>>) {
        this.allListeners = this.allListeners.filter((l) => l !== listener);
    }

    once<K extends keyof E>(event: K, timeout = 10 * 60 * 1000): Promise<E[K]> {
        return new Promise((resolve, reject) => {
            const listener = (arg: E[K]) => {
                resolve(arg);
                this.off(event, listener);
            };
            this.on(event, listener);

            setTimeout(() => {
                this.off(event, listener);
                reject("timeout");
            }, timeout);
        });
    }

    on<K extends keyof E>(event: K, listener: Listener<E[K]>) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]?.push(listener);

        return () => {
            this.off(event, listener);
        };
    }

    off<K extends keyof E>(event: K, listener: Listener<E[K]>) {
        this.listeners[event] = this.listeners[event]?.filter(
            (l) => l !== listener,
        );
    }

    emit<K extends keyof E>(event: K, arg: E[K]) {
        this.listeners[event]?.forEach((listener) => {
            listener(arg);
        });

        this.allListeners.forEach((listener) => {
            listener({ key: event, value: arg });
        });
    }
}

export const eventBus = new EventBus<{
    onModal: number;
    onAccept: "accept";
    onCancel: "cancel";
}>();

// file 1
eventBus.onAll((value) => {
    console.log(value);
});

async function modalFlow() {
    while (true) {
        const event = await eventBus.once("onModal");

        console.log("modal opened", event);

        const result = await Promise.race([
            eventBus.once("onAccept"),
            eventBus.once("onCancel"),
        ]);

        console.log(result);
    }
}

modalFlow();