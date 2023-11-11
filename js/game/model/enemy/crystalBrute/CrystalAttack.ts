import CrystalSpike from './CrystalSpike.js';
import Game from '../../game/Game.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import Observable from '../../utility/Observable.js';
import { PolarVector } from '../../utility/interfaces/PolarVector.js';
import AudioManager from '../../utility/manager/AudioManager.js';

export default class CrystalAttack {
    private readonly position: Vector;
    private readonly angle: number;
    private spikes: CrystalSpike[];
    private readonly speed: number;
    private number: number;
    private lifetime: number;
    private readonly playAudio: boolean;
    private readonly attackObserver: Observable;

    constructor(position: Vector, angle: number, playAudio: boolean, attackObserver: Observable) {
        this.position = position;
        this.angle = angle;
        this.spikes = [];
        this.speed = 7;
        this.number = 0;
        this.lifetime = 0;
        this.playAudio = playAudio;
        this.attackObserver = attackObserver;
    }

    update() {
        this.number += Game.deltaTime;
        this.lifetime += Game.deltaTime;

        const vector = {
            value: this.speed * Game.deltaTime,
            angle: this.angle,
        } as PolarVector;

        this.position.x += DistanceHelper.getHorizontalValue(vector);
        this.position.y += DistanceHelper.getVerticalValue(vector);

        if (this.number >= 10) {
            const spike = new CrystalSpike(this.position, this.attackObserver);
            this.spikes.push(spike);

            if (this.playAudio) {
                AudioManager.playAudio('crystal_brute_spike_spawn_audio').then();
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
