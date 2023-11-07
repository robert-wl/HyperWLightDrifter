export default class EventDispatcher {
    private listeners: Map<string, Function[]>;

    constructor() {
        this.listeners = new Map();
    }

    public addEventListener(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    public removeEventListener(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            return;
        }
        this.listeners.set(
            event,
            this.listeners.get(event)!.filter((listener) => listener !== callback),
        );
    }

    public dispatchEvent(event: string, data?: any) {
        if (!this.listeners.has(event)) {
            return;
        }
        this.listeners.get(event)!.forEach((listener) => listener(data));
    }
}
