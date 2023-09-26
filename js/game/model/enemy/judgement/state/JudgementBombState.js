import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import JudgementBomb from '../JudgementBomb.js';
import { drawImage, drawMirroredY } from '../../../../helper/renderer/drawer.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import GameSettings from '../../../../constants.js';
import { getRandomValue } from '../../../../helper/randomHelper.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import AudioPlayer from '../../../../../audio/AudioPlayer.js';

export default class JudgementBombState extends JudgementBaseState {
    enterState(currJudgement) {
        super.enterState(currJudgement);
        this.maxAttackCount = 6;
        this.attackCount = 0;
        this.attacking = 5;
        this.attackAngle = currJudgement.angle;
        this.finished = false;
        this.playedSpawnAudio = false;
        this.playedSmashAudio = false;
        this.startAngle = getRandomValue({
            randomValue: Math.PI * 2,
        });
    }

    drawImage(currJudgement) {
        if (!this.finished) {
            this.drawNormal(currJudgement);
            return; //TODO ADA INI
        }

        if (!this.isEnemyAboutToExplode()) {
            this.animationStage = 1;
            return;
        }

        this.drawSpawn(currJudgement);
    }

    updateState(currJudgement) {
        super.updateState(currJudgement);

        const { backgroundOpacity, enemyManager, player } = Game.getInstance();


        this.backgroundHandler();


        if (backgroundOpacity < 0.05 && this.checkCounter(25) && this.attackCount < this.maxAttackCount) {
            JudgementBomb.generate({
                position: player.centerPosition,
                angle: this.startAngle + (this.attackCount * Math.PI) / 3,
            });

            AudioPlayer.getInstance().playAudio('boss/bomb_summon.wav');

            this.number = 0;
            this.attackCount += 1;
        }

        if (this.checkCounter(25) && this.attackCount === this.maxAttackCount) {
            const { bossEntities } = enemyManager;
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


        if (backgroundOpacity <= 0.05 && this.attackCount >= this.maxAttackCount + 1) {
            this.finished = true;

            this.attackCount++;
        }


        if (backgroundOpacity === 1 && this.finished && this.checkCounter(7)) {

            if (this.animationStage === 2 && !this.playedSpawnAudio) {
                AudioPlayer.getInstance().playAudio('boss/spawn.wav');
                this.playedSpawnAudio = true;
            }

            this.animationStage += 1;
            this.number = 0;
        }

        if (this.animationStage === 14 && !this.playedSmashAudio) {
            AudioPlayer.getInstance().playAudio('boss/smash_ground.wav');
            this.playedSmashAudio = true;
        }

        if (this.animationStage === 21 && this.finished) {
            currJudgement.switchState(currJudgement.moveState);
        }
    }

    drawNormal(currJudgement) {
        const judgementMove = getNumberedImage('judgement_move', 1);
        const { backgroundOpacity } = Game.getInstance();

        Game.getInstance().setTransparency(backgroundOpacity);

        drawMirroredY({
            img: judgementMove,
            position: {
                x: currJudgement.position.x,
                y: currJudgement.position.y,
            },
            width: judgementMove.width * GameSettings.GAME.GAME_SCALE,
            height: judgementMove.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: getFaceDirection(currJudgement.angle) === 'left',
        });

        Game.getInstance().setTransparency(1);
    }

    drawSpawn(currJudgement) {
        console.log(this.animationStage);
        const judgementSpawn = getNumberedImage('judgement_spawn', this.animationStage);

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
        const { bossEntities } = Game.getInstance().enemyManager;

        return bossEntities.some((enemy) => {
            if (enemy instanceof JudgementBomb) {
                return enemy.isAboutToExplode();
            }
        });
    }

    backgroundHandler() {
        const { deltaTime } = Game.getInstance();

        if (this.finished) {
            Game.getInstance().brightenBackground(0.05 * deltaTime);
            return;
        }

        Game.getInstance().darkenBackground(0.05 * deltaTime);
    }
}
