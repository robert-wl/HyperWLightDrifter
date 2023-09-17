import CrystalSpike from './CrystalSpike.js';
import {getHorizontalValue, getVerticalValue} from "../../../helper/distanceHelper.js";
import Game from "../../Game/Game.js";

export default class CrystalAttack {
    static generate({ position, angle, playAudio }) {
        return new CrystalAttack({ position, angle, playAudio });
    }
    constructor({ position, angle, playAudio }) {
        this.position = position;
        this.angle = angle;
        this.width = 27;
        this.height = 45;
        this.spikes = [];
        this.speed = 7;
        this.number = 0;
        this.playAudio = playAudio;
    }

    update() {
        this.number += 1;

        this.position.x += getHorizontalValue({
            magnitude: this.speed,
            angle: this.angle,
        });

        this.position.y += getVerticalValue({
            magnitude: this.speed,
            angle: this.angle,
        });

        if (this.number % 10 === 0) {
            const spike = CrystalSpike.generate({
                    position: {
                        x: this.position.x,
                        y: this.position.y,
                    },
                });
            this.spikes.push(spike);

            if(this.playAudio) {
                const { audio } = Game.getInstance();

                audio.playAudio('enemy/crystal_brute/spike_spawn.wav');
            }
        }


        if (this.number >= 200) {
            return true;
        }


        this.spikes.forEach((spike) => {
            if(spike.update()){
                this.spikes.splice(this.spikes.indexOf(spike), 1);
            }
        });

        return false;
    }
}
