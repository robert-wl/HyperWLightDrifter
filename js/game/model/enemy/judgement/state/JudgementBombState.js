import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import JudgementBomb from '../JudgementBomb.js';
import { drawImage, drawMirroredY } from '../../../../helper/renderer/drawer.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import GameSettings from '../../../../constants.js';
import { getRandomValue } from '../../../../helper/randomHelper.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';

export default class JudgementBombState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.maxAttackCount = 6;
        this.attackCount = 0;
        this.attacking = 5;
        this.attackAngle = currJudgement.angle;
        this.startAngle = getRandomValue({
            randomValue: Math.PI * 2,
        });
        this.finished = false;
    }

    updateState(currJudgement) {
        this.number += 1;

        if (this.number % 2 === 0 && this.attackCount < this.maxAttackCount) {
            Game.getInstance().darkenBackground();

            this.animationStage += 1;
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

            this.attackCount += 1;
        }

        const { backgroundOpacity } = Game.getInstance();
        if (backgroundOpacity < 0.05 && this.number % 25 === 0 && this.attackCount < this.maxAttackCount) {
            JudgementBomb.generate({
                position: Game.getInstance().player.centerPosition,
                angle: this.startAngle + (this.attackCount * Math.PI) / 3,
            });

            this.attackCount += 1;
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
        if (!this.finished) {
            this.drawNormal(currJudgement);
        }

        if (!this.isEnemyAboutToExplode()) {
            this.animationStage = 0;
            return;
        }

        this.drawSpawn(currJudgement);
    }

    drawNormal(currJudgement) {
        const judgementMove = getNumberedImage('judgement_move', 1);
        const { backgroundOpacity } = Game.getInstance();

        Game.getInstance().setTransparency(backgroundOpacity);

        if (getFaceDirection(currJudgement.angle) === 'left') {
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

        Game.getInstance().setTransparency(1);
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

    isEnemyAboutToExplode() {
        const { bossEntities } = Game.getInstance();

        return bossEntities.some((enemy) => {
            if (enemy instanceof JudgementBomb) {
                return enemy.isAboutToExplode();
            }
        });
    }
}
