import CrystalSpike from './CrystalSpike.js';
import {getHorizontalValue, getVerticalValue} from "../../../helper/distanceHelper.js";

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
        this.number += 1;

        this.position.x += getHorizontalValue({
            magnitude: this.speed,
            angle: this.angle,
        });

        this.position.y += getVerticalValue({
            magnitude: this.speed,
            angle: this.angle,
        });

        if (this.number % 7 === 0) {
            const spike = CrystalSpike.generate({
                    position: {
                        x: this.position.x,
                        y: this.position.y,
                    },
                });
            this.spikes.push(spike);
        }

        if (this.number >= 1000) {
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
