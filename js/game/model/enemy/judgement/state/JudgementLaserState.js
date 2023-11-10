var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../game/Game.js';
import GameSettings from '../../../../constants.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import AudioManager from '../../../utility/manager/AudioManager.js';
import { Vector } from '../../../utility/interfaces/Vector.js';
import AngleHelper from '../../../utility/helper/AngleHelper.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';
export default class JudgementLaserState extends JudgementBaseState {
    constructor() {
        super();
        this.attacking = 8;
        this.attackingNumber = 0;
        this.attackAmount = 0;
        this.angleConstant = 0;
        this.attackAngle = 0;
        this.audio = new Audio();
    }
    enterState(currJudgement) {
        const _super = Object.create(null, {
            enterState: { get: () => super.enterState }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.enterState.call(this, currJudgement);
            this.attacking = 8;
            this.attackingNumber = 0;
            this.attackAmount = 0;
            this.angleConstant = 0;
            this.attackAngle = currJudgement.angle;
            this.audio = yield AudioManager.playAudio('boss/laser.wav');
        });
    }
    drawImage(currJudgement) {
        const judgementLaser = AssetManager.getNumberedImage('judgement_laser', this.animationStage);
        const imageSize = Box.parse({
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            w: judgementLaser.width * GameSettings.GAME.GAME_SCALE,
            h: judgementLaser.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(judgementLaser, imageSize, true, DirectionHelper.getFaceDirection(currJudgement.angle) === 'left');
    }
    updateState(currJudgement) {
        super.updateState(currJudgement);
        this.advanceAnimationStage(12);
        const { player } = Game.getInstance();
        this.attackingNumber += Game.deltaTime;
        this.angleConstant += Game.deltaTime;
        this.attackAmount += Game.deltaTime;
        if (this.animationStage === 8) {
            this.attackAngle = AngleHelper.getAngle({
                x: player.centerPosition.x - currJudgement.position.x,
                y: player.centerPosition.y - (currJudgement.position.y + 40),
            });
            currJudgement.angle = this.attackAngle;
        }
        if (this.attacking < 8 && this.animationStage < 13 && this.attackAmount >= 1) {
            const position = new Vector(currJudgement.position.x + this.getAttackOffset(currJudgement), currJudgement.position.y + 60);
            const angle = this.getAttackAngle(currJudgement.angle);
            currJudgement.enemyObserver.notify('spawnBossLaser', { position, angle });
            this.attackAmount = 0;
        }
        if (this.animationStage === 9 && this.attackingNumber >= 14) {
            this.attacking -= 1;
            this.attackingNumber = 0;
        }
        if (this.animationStage === 13 && this.attacking > 0) {
            this.animationStage -= 4;
        }
        if (this.animationStage >= 14) {
            currJudgement.switchState(currJudgement.moveState);
        }
    }
    getAttackAngle(angle) {
        return angle + (Math.random() - 0.5) * 0.25 + Math.sin(this.angleConstant * 0.05) * 0.5;
    }
    getAttackOffset(currJudgement) {
        return DirectionHelper.getFaceDirection(currJudgement.angle) === 'left' ? -60 : 60;
    }
    exitState() {
        AudioManager === null || AudioManager === void 0 ? void 0 : AudioManager.stop(this.audio);
    }
}
