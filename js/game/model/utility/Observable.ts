export default class Observable {
    private observers: Function[] = [];

    public subscribe(observer: Function) {
        this.observers.push(observer);
    }

    public unsubscribe(observer: Function) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    public notify(event: any, data?: any) {
        this.observers.forEach((observer) => observer({ event, data }));
    }
}
