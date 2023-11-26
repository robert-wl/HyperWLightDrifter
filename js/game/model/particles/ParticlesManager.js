import ParticlesFactory from './ParticlesFactory.js';
import Observable from '../utility/Observable.js';
export default class ParticlesManager {
    constructor() {
        this.update = () => this.particleList.forEach((particle) => particle.update());
        this.eventEmitter = new Observable();
        this.particleList = [];
        this._particleFactory = new ParticlesFactory(this.eventEmitter);
        this.eventHandler();
    }
    get particleFactory() {
        return this._particleFactory;
    }
    eventHandler() {
        this.eventEmitter.subscribe(({ event, data }) => {
            if (event === 'spawnParticles') {
                this.particleList.push(data);
                return;
            }
            if (event === 'destroyParticles') {
                this.particleList.splice(this.particleList.indexOf(data), 1);
                return;
            }
        });
    }
}
