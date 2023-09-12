import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../Game/Game.js';
import CrystalAttack from '../CrystalAttack.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from '../../../../constants.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import { getRandomValue } from '../../../../helper/randomHelper.js';

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
        this.number += 1;

        if (currBrute.health <= 0) {
            currBrute.switchState(currBrute.dieState);
            return;
        }

        this.attackTiming(currBrute);
    }
    drawImage(currBrute) {
        const bruteAttack = getNumberedImage('crystal_brute_attack', this.animationStage);

        drawImage({
            img: bruteAttack,
            x: currBrute.position.x,
            y: currBrute.position.y,
            width: bruteAttack.width * GameSettings.GAME.GAME_SCALE,
            height: bruteAttack.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: getFaceDirection(currBrute.angle) === 'left',
        });
    }

    attackTiming(currBrute) {
        if (this.number === 10 && this.animationStage < 5) {
            this.animationStage += 1;
            this.number = 0;
            return;
        }

        if (this.number === 5 && this.animationStage >= 5 && this.animationStage < 10) {
            this.animationStage += 1;
            this.number = 0;

            if (this.animationStage === 9) {
                this.handleAttack(currBrute);
            }

            return;
        }

        if (this.number === 50 && this.animationStage === 10) {
            this.animationStage += 1;
            this.number = 0;

            return;
        }

        if (this.number === 5 && this.animationStage === 11) {
            currBrute.switchState(currBrute.moveState);
        }
    }

    handleAttack(currBrute) {
        const { centerPosition } = Game.getInstance().player;

        const angle = getAngle({
            x: centerPosition.x - currBrute.position.x,
            y: centerPosition.y - currBrute.position.y,
        });

        const type = getRandomValue({
            randomValue: 3,
            rounded: true,
        });

        // Game.getInstance().camera.shakeCamera({
        //     offset: {
        //         x: 0,
        //         y: 5,
        //     }
        // });

        const constant = {
            0: [0],
            1: [0, -1 / 6, 1 / 6],
            2: [1 / 10, -1 / 10, 2 / 10, -2 / 10],
        };

        for (const num of constant[type]) {
            currBrute.attack.push(
                CrystalAttack.generate({
                    position: {
                        x: currBrute.position.x,
                        y: currBrute.position.y,
                    },
                    angle: angle + Math.PI * num,
                }),
            );
        }
    }
}
