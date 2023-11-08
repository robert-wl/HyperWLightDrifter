import Game from '../game/Game.js';
import Particles from './Particles.js';
import ParticlesFactory from './ParticlesFactory.js';
import Observable from '../utility/Observable.js';

export default class ParticlesManager {
    private eventEmitter: Observable;
    private particleList: Particles[];
    private _particleFactory: ParticlesFactory;

    constructor() {
        this.eventEmitter = new Observable();
        this.particleList = [];
        this._particleFactory = new ParticlesFactory(this.eventEmitter);

        this.eventHandler();
    }

    get particleFactory(): ParticlesFactory {
        return this._particleFactory;
    }

    set particleFactory(value: ParticlesFactory) {
        this._particleFactory = value;
    }

    public update = () => this.particleList.forEach((particle) => particle.update());

    public clear() {
        const { currState } = Game.getInstance();
        currState.spawnParticles = false;
    }

    private eventHandler() {
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
