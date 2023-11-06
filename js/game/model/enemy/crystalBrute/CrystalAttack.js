import CrystalSpike from './CrystalSpike.js';
import { getHorizontalValue, getVerticalValue } from '../../../helper/distanceHelper.js';
import Game from '../../game/Game.js';

export default class CrystalAttack {
    constructor({ position, angle, playAudio }) {
        this.position = position;
        this.angle = angle;
        this.width = 27;
        this.height = 45;
        this.spikes = [];
        this.speed = 7;
        this.number = 0;
        this.lifetime = 0;
        this.playAudio = playAudio;
    }

    static generate({ position, angle, playAudio }) {
        return new CrystalAttack({ position, angle, playAudio });
    }

    update() {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;
        this.lifetime += deltaTime;

        this.position.x += getHorizontalValue({
            magnitude: this.speed * deltaTime,
            angle: this.angle,
        });

        this.position.y += getVerticalValue({
            magnitude: this.speed * deltaTime,
            angle: this.angle,
        });

        if (this.number >= 10) {
            const spike = CrystalSpike.generate({
                position: {
                    x: this.position.x,
                    y: this.position.y,
                },
            });
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
            if (spike.update()) {
                this.spikes.splice(this.spikes.indexOf(spike), 1);
            }
        });

        return false;
    }
}
