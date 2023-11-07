import CrystalSpike from './CrystalSpike.js';
import Game from '../../game/Game.js';
import DistanceHelper from '../../utility/DistanceHelper.js';

export default class CrystalAttack {
    private position: Position;
    private angle: number;
    private spikes: CrystalSpike[];
    private speed: number;
    private number: number;
    private lifetime: number;
    private playAudio: boolean;

    constructor(position: Position, angle: number, playAudio: boolean) {
        this.position = position;
        this.angle = angle;
        this.spikes = [];
        this.speed = 7;
        this.number = 0;
        this.lifetime = 0;
        this.playAudio = playAudio;
    }

    update() {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;
        this.lifetime += deltaTime;

        const vector = {
            value: this.speed * deltaTime,
            angle: this.angle,
        } as Vector;

        this.position.x += DistanceHelper.getHorizontalValue(vector);
        this.position.y += DistanceHelper.getVerticalValue(vector);

        if (this.number >= 10) {
            const spike = new CrystalSpike(this.position);
            this.spikes.push(spike);

            if (this.playAudio) {
                const { audio } = Game.getInstance();

                audio.playAudio('enemy/crystal_brute/spike_spawn.wav');
            }
            this.number = 0;
        }

        if (this.lifetime >= 200) {
            return true;
        }

        this.spikes.forEach((spike) => {
            spike.update();

            if (spike.isPastLifetime()) {
                this.spikes.splice(this.spikes.indexOf(spike), 1);
            }
        });

        return false;
    }
}
