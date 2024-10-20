type Action<Type extends string = string, Payload = any> = {
    type: Type;
    payload: Payload;
};

type ActionCreator<Type extends string = string, Payload = any> = {
    (payload: Payload): Action<Type, Payload>;
    type: Type;
    check(action: Action): action is Action<Type, Payload>;
    withPayload<Payload>(): ActionCreator<Type, Payload>;
};

export const createAction = <Type extends string, Payload = void>(
    type: Type,
): ActionCreator<Type, Payload> => {
    function actionCreator(payload: Payload): Action<Type, Payload> {
        return {
            type,
            payload,
        };
    }

    actionCreator.type = type;
    actionCreator.check = (action: Action): action is Action<Type, Payload> =>
        actionCreator.type === action.type;

    actionCreator.withPayload = <Payload>() =>
        actionCreator as unknown as ActionCreator<Type, Payload>;

    return actionCreator;
};

type Listener<T extends Action = Action> = (action: T) => void;

class EventBus {
    constructor() {}

    private listeners = new Map<string, Set<Listener>>();
    private allListeners = new Set<Listener>();

    onAll(listener: Listener) {
        this.allListeners.add(listener);
    }

    offAll(listener: Listener) {
        this.allListeners.delete(listener);
    }

    on<A extends ActionCreator>(creator: A, listener: Listener<ReturnType<A>>) {
        if (!this.listeners.has(creator.type)) {
            this.listeners.set(creator.type, new Set());
        }

        this.listeners.get(creator.type)?.add(listener as Listener);
    }

    off<A extends ActionCreator>(creator: A, listener: Listener<ReturnType<A>>) {
        if (!this.listeners.has(creator.type)) {
            return;
        }

        this.listeners.get(creator.type)?.delete(listener as Listener);
    }

    emit(action: Action) {
        this.listeners.get(action.type)?.forEach((listener) => listener(action));
        this.allListeners.forEach((listener) => listener(action));
    }

    once<A extends ActionCreator>(creator: A): Promise<ReturnType<A>> {
        return new Promise((resolve) => {
            const listener = (action: Action) => {
                resolve(action.payload);
                this.off(creator, listener);
            };
            this.on(creator, listener);
        });
    }
}

export const bus = new EventBus();

// module1
export const userCreated = createAction("USER_CREATED").withPayload<{
    id: number;
}>();
const userUpdated = createAction("USER_UPDATED").withPayload<1>();

bus.emit(userCreated({ id: 1 }));

// module2
bus.onAll((action) => {
    if (userUpdated.check(action)) {
        action.type;
    }
});