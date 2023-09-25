import JudgementBaseState from './JudgementBaseState.js';
import { drawMirroredY } from '../../../../helper/renderer/drawer.js';
import JudgementBullet from '../JudgementBullet.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { getRandomValue } from '../../../../helper/randomHelper.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import GameSettings from '../../../../constants.js';
import AudioPlayer from '../../../../../audio/AudioPlayer.js';
import Game from '../../../Game/Game.js';

export default class JudgementAttackState extends JudgementBaseState {
    enterState() {
        super.enterState();
        this.attackCount = 0;
        this.attackNumber = 0;
        this.attacking = false;
        this.playedAudio = false;
        this.attackAngle = getRandomValue({
            randomValue: Math.PI * 2,
        });
        this.maxAttackCount =
            getRandomValue({
                randomValue: 8,
                rounded: true,
            }) + 5;
    }

    drawImage(currJudgement) {
        const judgementAttack = getNumberedImage('judgement_attack', this.animationStage);

        drawMirroredY({
            img: judgementAttack,
            position: {
                x: currJudgement.position.x,
                y: currJudgement.position.y,
            },
            width: judgementAttack.width * GameSettings.GAME.GAME_SCALE,
            height: judgementAttack.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: getFaceDirection(currJudgement.angle) === 'left',
        });
    }

    updateState(currJudgement) {
        super.updateState();
        const { deltaTime } = Game.getInstance();
        this.attackNumber += deltaTime;

        this.advanceAnimationStage(15);

        this.attack(currJudgement);

        if (this.animationStage >= 7) {
            this.animationStage -= 3;
            this.attackCount += 1;
        }

        if (this.animationStage >= 4) {
            this.attacking = true;
        }

        if (this.attackCount === this.maxAttackCount) {
            currJudgement.handleSwitchState();
        }
    }

    attack(currJudgement) {
        const { deltaTime } = Game.getInstance();

        if (this.attacking && this.attackNumber >= 2) {
            this.playedAudio = false;

            this.attackAngle += getRandomValue({
                initialValue: (2 / 30) * Math.PI,
                randomValue: (1 / 45) * Math.PI,
            });


            JudgementBullet.generate({
                x: currJudgement.position.x + this.getAttackOffset(currJudgement),
                y: currJudgement.position.y - 40,
                angle: this.attackAngle,
            });

            JudgementBullet.generate({
                x: currJudgement.position.x + this.getAttackOffset(currJudgement),
                y: currJudgement.position.y - 40,
                angle: this.attackAngle + Math.PI,
            });

            this.attackNumber = 0;
        }

        if (this.attacking && !this.playedAudio && this.number >= 8) {
            AudioPlayer.getInstance().playAudio('boss/bullet.wav');
            this.playedAudio = true;
        }
    }

    getAttackOffset(currJudgement) {
        return getFaceDirection(currJudgement.angle) === 'left' ? -15 : 15;
    }
}
