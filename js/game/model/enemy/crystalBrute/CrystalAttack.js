import CrystalSpike from './CrystalSpike.js';

export default class CrystalAttack {
    static generate({ position, angle }) {
        return new CrystalAttack({ position, angle });
    }
    constructor({ position, angle }) {
        this.position = position;
        this.angle = angle;
        this.width = 27;
        this.height = 45;
        this.spikes = [];
        this.speed = 7;
        this.number = 0;
    }

    update() {
        // const ctx = Game.getInstance().canvasCtx;
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        this.number++;
        this.position.x += this.speed * Math.cos(this.angle);
        this.position.y += this.speed * Math.sin(this.angle);

        if (this.number % 7 === 0) {
            this.spikes.push(
                CrystalSpike.generate({
                    position: {
                        x: this.position.x,
                        y: this.position.y,
                    },
                }),
            );
        }

        if (this.number === 500) {
            return true;
        }

        for (const spike of this.spikes) {
            const remove = spike.update();
            if (remove) {
                this.spikes.splice(this.spikes.indexOf(spike), 1);
            }
        }
    }
}
