import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import JudgementBomb from '../JudgementBomb.js';
import { drawImage, drawMirroredY } from '../../../../helper/renderer/drawer.js';
import { getImage, getNumberedImage } from '../../../../helper/imageLoader.js';
import GameSettings from '../../../../constants.js';

export default class JudgementBombState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.maxAttackCount = 6;
        this.attackCount = 0;
        this.attacking = 5;
        this.attackAngle = currJudgement.angle;
        this.startAngle = Math.random() * Math.PI;
        this.finished = false;
    }

    updateState(currJudgement) {
        this.number++;

        const { backgroundOpacity } = Game.getInstance();
        if (this.number % 2 === 0 && this.attackCount < this.maxAttackCount) {
            Game.getInstance().darkenBackground();

            this.animationStage++;
        }

        if (this.number % 100 === 0 && this.attackCount === this.maxAttackCount) {
            const { bossEntities } = Game.getInstance();

            bossEntities.forEach((enemy) => {
                if (enemy instanceof JudgementBomb) {
                    enemy.spawning = false;
                }
            });
            currJudgement.position = {
                x: 1000,
                y: 600,
            };

            this.attackCount++;
        }

        if (backgroundOpacity < 0.05 && this.number % 25 === 0 && this.attackCount < this.maxAttackCount) {
            JudgementBomb.generate({
                position: Game.getInstance().player.centerPosition,
                angle: this.startAngle + (this.attackCount * Math.PI) / 3,
            });

            this.attackCount++;
        }

        if (backgroundOpacity !== 1 && this.attackCount >= this.maxAttackCount + 1 && this.number % 2 === 0) {
            Game.getInstance().brightenBackground();
            this.finished = true;
            this.attackCount++;
        }

        if (backgroundOpacity === 1 && this.finished && this.number % 7 === 0) {
            this.animationStage += 1;
        }

        if (this.animationStage === 21 && this.finished) {
            currJudgement.switchState(currJudgement.moveState);
        }
    }

    drawImage(currJudgement) {
        const { bossEntities } = Game.getInstance();

        if (!this.finished) {
            this.drawNormal(currJudgement);
        }

        if (
            !bossEntities.some((enemy) => {
                if (enemy instanceof JudgementBomb) {
                    return enemy.isAboutToExplode();
                }
            })
        ) {
            this.animationStage = 0;
            return;
        }

        this.drawSpawn(currJudgement);
    }

    drawNormal(currJudgement) {
        const judgementMove = getNumberedImage('judgement_move', 1);
        const { ctx, backgroundOpacity } = Game.getInstance();

        ctx.globalAlpha = backgroundOpacity;
        if (currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
            drawMirroredY({
                img: judgementMove,
                position: {
                    x: currJudgement.position.x,
                    y: currJudgement.position.y,
                },
                width: judgementMove.width * GameSettings.GAME.GAME_SCALE,
                height: judgementMove.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });
        } else {
            drawImage({
                img: judgementMove,
                x: currJudgement.position.x,
                y: currJudgement.position.y,
                width: judgementMove.width * GameSettings.GAME.GAME_SCALE,
                height: judgementMove.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });
        }
        ctx.globalAlpha = 1;
    }

    drawSpawn(currJudgement) {
        const judgementSpawn = getNumberedImage('judgement_spawn', this.animationStage + 1);

        drawImage({
            img: judgementSpawn,
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            width: judgementSpawn.width * GameSettings.GAME.GAME_SCALE,
            height: judgementSpawn.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }
}
