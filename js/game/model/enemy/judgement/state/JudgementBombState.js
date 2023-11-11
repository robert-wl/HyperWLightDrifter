import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../game/Game.js';
import JudgementBomb from '../JudgementBomb.js';
import GameSettings from '../../../../constants.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import RandomHelper from '../../../utility/helper/RandomHelper.js';
import AudioManager from '../../../utility/manager/AudioManager.js';
import { Vector } from '../../../utility/interfaces/Vector.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
export default class JudgementBombState extends JudgementBaseState {
    constructor() {
        super();
        this.attackCount = 0;
        this.maxAttackCount = 0;
        this.attacking = 0;
        this.attackAngle = 0;
        this.finished = false;
        this.playedSpawnAudio = false;
        this.playedSmashAudio = false;
        this.startAngle = 0;
    }
    enterState(currJudgement) {
        super.enterState(currJudgement);
        this.maxAttackCount = 6;
        this.attackCount = 0;
        this.attacking = 5;
        this.attackAngle = currJudgement.angle;
        this.finished = false;
        this.playedSpawnAudio = false;
        this.playedSmashAudio = false;
        this.startAngle = RandomHelper.randomValue(0, Math.PI * 2);
    }
    drawImage(currJudgement) {
        if (!this.finished) {
            this.drawNormal(currJudgement);
            return;
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
            currJudgement.enemyObserver.notify('spawnBossBomb', {
                position: player.centerPosition,
                angle: this.startAngle + (this.attackCount * Math.PI) / 3,
            });
            AudioManager.playAudio('judgement_bomb_summon_audio');
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
            currJudgement.position = new Vector(1000, 600);
            this.attackCount += 1;
        }
        if (backgroundOpacity <= 0.05 && this.attackCount >= this.maxAttackCount + 1) {
            this.finished = true;
            this.attackCount++;
        }
        if (backgroundOpacity === 1 && this.finished && this.checkCounter(7)) {
            if (this.animationStage === 2 && !this.playedSpawnAudio) {
                AudioManager.playAudio('judgement_spawn_audio');
                this.playedSpawnAudio = true;
            }
            this.animationStage += 1;
            this.number = 0;
        }
        if (this.animationStage === 14 && !this.playedSmashAudio) {
            AudioManager.playAudio('judgement_smash_ground_audio');
            this.playedSmashAudio = true;
        }
        if (this.animationStage === 21 && this.finished) {
            currJudgement.switchState(currJudgement.moveState);
        }
    }
    drawNormal(currJudgement) {
        const judgementMove = AssetManager.getNumberedImage('judgement_move', 1);
        const { backgroundOpacity } = Game.getInstance();
        Game.getInstance().setTransparency(backgroundOpacity);
        const imageSize = Box.parse({
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            w: judgementMove.width * GameSettings.GAME.GAME_SCALE,
            h: judgementMove.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(judgementMove, imageSize, true, DirectionHelper.getFaceDirection(currJudgement.angle) === 'left');
        Game.getInstance().setTransparency(1);
    }
    drawSpawn(currJudgement) {
        const judgementSpawn = AssetManager.getNumberedImage('judgement_spawn', this.animationStage);
        const imageSize = Box.parse({
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            w: judgementSpawn.width * GameSettings.GAME.GAME_SCALE,
            h: judgementSpawn.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(judgementSpawn, imageSize, true);
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
        if (this.finished) {
            Game.getInstance().brightenBackground(0.05 * Game.deltaTime);
            return;
        }
        Game.getInstance().darkenBackground(0.05 * Game.deltaTime);
    }
}
