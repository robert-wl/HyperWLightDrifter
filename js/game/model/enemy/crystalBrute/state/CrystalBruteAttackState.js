import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import { get_image } from '../../../../helper/fileReader.js';
import Game from '../../../Game.js';
import CrystalSpike from '../CrystalSpike.js';
import CrystalAttack from '../CrystalAttack.js';

export default class CrystalBruteAttackState extends CrystalBruteBaseState {
    angle = 0;
    number = 0;
    animationStage = 1;
    enterState(currBrute) {
        currBrute.speed = 0;
        this.number = 0;
        this.angle = currBrute.angle;
        this.animationStage = 1;
    }
    updateState(currBrute) {
        this.number++;

        if (currBrute.health <= 0) {
            currBrute.switchState(currBrute.dieState);
            return;
        }
        // if(this.number === 20) {
        //     currBrute.switchState(currBrute.moveState)
        // }
        this.attackTiming(currBrute);
        // currBrute.speed *= 0.75;
        // console.log(Math.cos(this.angle) * currBrute.speed)
        // currBrute.position.x += Math.cos(this.angle) * currBrute.speed;
        // currBrute.position.y += Math.sin(this.angle) * currBrute.speed;
    }
    drawImage(currBrute) {
        const ctx = Game.getInstance().canvasCtx;

        get_image('enemy/crystal_brute', 'crystal_brute_attack', this.animationStage, (image) => {
            if ((this.angle > 0 && this.angle < Math.PI / 2) || (this.angle < 0 && this.angle > -Math.PI / 2)) {
                ctx.drawImage(image, currBrute.position.x, currBrute.position.y, currBrute.width, currBrute.height);
            } else {
                ctx.scale(-1, 1);
                ctx.drawImage(image, -currBrute.position.x - currBrute.width, currBrute.position.y, currBrute.width, currBrute.height);
                ctx.scale(-1, 1);
            }
        });
    }

    attackTiming(currBrute) {
        if (this.number === 10 && this.animationStage < 5) {
            this.animationStage++;
            this.number = 0;
        } else if (this.number === 5 && this.animationStage >= 5 && this.animationStage < 10) {
            this.animationStage++;
            this.number = 0;
            if (this.animationStage === 9) {
                this.handleAttack(currBrute);
            }
        } else if (this.number === 50 && this.animationStage === 10) {
            this.animationStage++;
            this.number = 0;
        } else if (this.number === 5 && this.animationStage === 11) {
            currBrute.switchState(currBrute.moveState);
        }
    }

    handleAttack(currBrute) {
        const x = currBrute.position.x + currBrute.width / 2;
        const y = currBrute.position.y + currBrute.height / 2;
        const angle = Math.atan2(Game.getInstance().player.position.y - y, Game.getInstance().player.position.x - x);

        const type = Math.floor(Math.random() * 3);

        Game.getInstance().camera.shakeCamera({
            offset: {
                x: 0,
                y: 5,
            }
        });

        const constant = {
            0: [0],
            1: [0, -1/6, 1/6],
            2: [1/10, -1/10, 2/10, -2/10],
        }
        for(const num of constant[type]) {
            currBrute.attack.push(
                CrystalAttack.generate({
                    position: {
                        x: x,
                        y: y,
                    },
                    angle: angle + Math.PI * num,
                }),
            );
        }
    }
}
