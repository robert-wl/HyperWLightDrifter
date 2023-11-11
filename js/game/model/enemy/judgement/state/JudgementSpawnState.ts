import JudgementBaseState from './JudgementBaseState.js';
import GameSettings from '../../../../constants.js';
import Game from '../../../game/Game.js';
import Judgement from '../Judgement.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import AudioManager from '../../../utility/manager/AudioManager.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';

export default class JudgementSpawnState extends JudgementBaseState {
    private firstSpawn: boolean;
    private playedSmash: boolean;

    public constructor() {
        super();
        this.firstSpawn = true;
        this.playedSmash = false;
    }

    updateState(currJudgement: Judgement) {
        super.updateState(currJudgement);
        const { camera } = Game.getInstance();

        this.advanceAnimationStage(7);

        if (this.checkCounter(6) && this.animationStage === 16) {
            camera.setShakeCamera({
                duration: 200,
                angle: Math.PI / 2,
            });
        }

        if (this.animationStage === 14 && !this.playedSmash) {
            AudioManager.playAudio('judgement_smash_ground_audio').then();
            this.playedSmash = true;
        }

        if (this.animationStage === 22) {
            currJudgement.handleSwitchState();
        }
    }

    drawImage(currJudgement: Judgement) {
        const judgementSpawn = AssetManager.getNumberedImage('judgement_spawn', this.animationStage);

        const imageSize = Box.parse({
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            w: judgementSpawn.width * GameSettings.GAME.GAME_SCALE,
            h: judgementSpawn.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(judgementSpawn, imageSize, true);
    }

    enterState(currJudgement: Judgement) {
        super.enterState(currJudgement);
        this.playedSmash = false;

        AudioManager.playAudio('judgement_spawn_audio').then();
    }

    exitState(currJudgement: Judgement) {
        if (this.firstSpawn) {
            AudioManager.playAudio('boss_stage_background_audio', true).then();
        }

        this.firstSpawn = false;
    }
}
