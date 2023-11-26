import JudgementBaseState from './JudgementBaseState.js';
import GameSettings from '../../../../constants.js';
import Game from '../../../game/Game.js';
import Judgement from '../Judgement.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import RandomHelper from '../../../utility/helper/RandomHelper.js';
import { Vector } from '../../../utility/interfaces/Vector.js';
import AudioManager from '../../../utility/manager/AudioManager.js';
import AngleHelper from '../../../utility/helper/AngleHelper.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';

export default class JudgementAttackState extends JudgementBaseState {
    private attackCount: number;
    private attackNumber: number;
    private attacking: boolean;
    private playedAudio: boolean;
    private attackAngle: number;
    private maxAttackCount: number;

    public constructor() {
        super();
        this.attackCount = 0;
        this.attackNumber = 0;
        this.attacking = false;
        this.playedAudio = false;
        this.attackAngle = 0;
        this.maxAttackCount = 0;
    }

    enterState(currJudgement: Judgement) {
        super.enterState(currJudgement);
        this.attackCount = 0;
        this.attackNumber = 0;
        this.attacking = false;
        this.playedAudio = false;
        this.attackAngle = RandomHelper.randomValue(0, Math.PI * 2);
        this.maxAttackCount = RandomHelper.randomValue(5, 8, true);

        const { player } = Game.getInstance();
        const { centerPosition } = player;

        currJudgement.angle = AngleHelper.getAngle(
            Vector.parse({
                x: centerPosition.x - currJudgement.position.x,
                y: centerPosition.y - currJudgement.position.y,
            }),
        );
    }

    drawImage(currJudgement: Judgement) {
        const judgementAttack = AssetManager.getNumberedImage('judgement_attack', this.animationStage);

        const imageSize = Box.parse({
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            w: judgementAttack.width * GameSettings.GAME.GAME_SCALE,
            h: judgementAttack.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(judgementAttack, imageSize, true, DirectionHelper.getFaceDirection(currJudgement.angle) === 'left');
    }

    updateState(currJudgement: Judgement) {
        super.updateState(currJudgement);
        this.attackNumber += Game.deltaTime;

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

    attack(currJudgement: Judgement) {
        if (this.attacking && this.attackNumber >= 2) {
            this.playedAudio = false;

            this.attackAngle += RandomHelper.randomValue((2 / 30) * Math.PI, (1 / 45) * Math.PI);

            const position = new Vector(currJudgement.position.x + this.getAttackOffset(currJudgement), currJudgement.position.y - 40);
            currJudgement.enemyObserver.notify('spawnBossBullet', { position, angle: this.attackAngle });

            currJudgement.enemyObserver.notify('spawnBossBullet', {
                position: { ...position },
                angle: this.attackAngle + Math.PI,
            });

            this.attackNumber = 0;
        }

        if (this.attacking && !this.playedAudio && this.number >= 14) {
            AudioManager.playAudio('judgement_bullet_audio').then();
            this.playedAudio = true;
        }
    }

    getAttackOffset(currJudgement: Judgement) {
        return DirectionHelper.getFaceDirection(currJudgement.angle) === 'left' ? -25 : 25;
    }
}
