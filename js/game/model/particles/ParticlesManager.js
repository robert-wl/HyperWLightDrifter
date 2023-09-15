import Game from "../Game/Game.js";

export default class ParticlesManager {
    static instance = null;
    constructor() {
        this.particleList = [];
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new ParticlesManager();
        }
        return this.instance;
    }

    update() {
        this.particleList.forEach((particle) => particle.update());
    }

    addParticle(particle) {
        this.particleList.push(particle);
    }

    clear() {
        Game.getInstance().currState.spawnParticles = false;
    }
}
