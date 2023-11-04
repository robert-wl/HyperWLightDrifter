import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../Game/Game.js';
import CrystalAttack from '../CrystalAttack.js';
import { getNumberedImage } from '../../../../helper/assets/assetGetter.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from '../../../../constants.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import { getRandomValue } from '../../../../helper/randomHelper.js';

export default class CrystalBruteAttackState extends CrystalBruteBaseState {
    enterState(currBrute) {
        super.enterState(currBrute);
        this.angle = currBrute.angle;
        this.hasAttacked = false;

        const { centerPosition } = Game.getInstance().player;

        currBrute.speed = 0;
        currBrute.angle = getAngle({
            x: centerPosition.x - currBrute.position.x,
            y: centerPosition.y - currBrute.position.y,
        });
    }

    updateState(currBrute) {
        super.updateState(currBrute);

        if (currBrute.health <= 0) {
            currBrute.switchState(currBrute.dieState);
            return;
        }

        this.advanceAnimationStage(5);

        if (this.animationStage >= 9 && !this.hasAttacked) {
            this.handleAttack(currBrute);
            this.hasAttacked = true;
        }

        if (this.animationStage >= 21) {
            currBrute.switchState(currBrute.moveState);
        }
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

    handleAttack(currBrute) {
        const { player, camera } = Game.getInstance();
        const { centerPosition } = player;

        const angle = getAngle({
            x: centerPosition.x - currBrute.position.x,
            y: centerPosition.y - currBrute.position.y,
        });

        const type = getRandomValue({
            randomValue: 3,
            rounded: true,
        });

        camera.setShakeCamera({
            duration: 200,
            strength: 10,
        });

        const constant = {
            0: [0],
            1: [0, -1 / 6, 1 / 6],
            2: [1 / 10, -1 / 10, 2 / 10, -2 / 10],
        };

        constant[type].forEach((num, index) => {
            currBrute.attack.push(
                CrystalAttack.generate({
                    position: {
                        x: currBrute.position.x,
                        y: currBrute.position.y,
                    },
                    angle: angle + Math.PI * num,
                    playAudio: index === 0,
                }),
            );
        });
    }
}
