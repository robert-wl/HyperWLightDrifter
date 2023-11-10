import PlayerBaseState from './PlayerBaseState.js';
import Grenade from '../Grenade.js';
import GameSettings from '../../../constants.js';
import Player from '../Player.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import DirectionHelper from '../../utility/helper/DirectionHelper.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';
import { Box } from '../../utility/interfaces/Box.js';

export default class PlayerThrowingState extends PlayerBaseState {
    private hasThrown: boolean;
    private direction: string;

    constructor() {
        super();
        this.hasThrown = false;
        this.direction = '';
    }

    enterState(currPlayer: Player) {
        super.enterState(currPlayer);

        this.hasThrown = false;
        this.direction = DirectionHelper.getMouseDirection(currPlayer.lookAngle);

        AudioManager.playAudio('player/grenade/throw.wav');
    }

    updateState(currPlayer: Player) {
        super.updateState(currPlayer);

        this.advanceAnimationStage(5);

        if (this.animationStage >= 4 && !this.hasThrown) {
            Grenade.generate({
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                angle: currPlayer.lookAngle,
            });
            this.hasThrown = true;
        }

        if (this.animationStage < 8) {
            return;
        }

        currPlayer.handleSwitchState({
            move: true,
            attackOne: true,
            dash: true,
            aim: true,
            throws: true,
        });
    }

    drawImage(currPlayer: Player) {
        let playerThrow: HTMLImageElement | null = null;

        const { centerPosition, lookAngle } = currPlayer;
        if (this.direction === 'a' || this.direction === 'd') {
            playerThrow = AssetManager.getNumberedImage('player_throw_side', this.animationStage);
        }
        if (this.direction === 'w') {
            playerThrow = AssetManager.getNumberedImage('player_throw_up', this.animationStage);
        }
        if (this.direction === 's') {
            playerThrow = AssetManager.getNumberedImage('player_throw_down', this.animationStage);
        }

        if (!playerThrow) {
            return;
        }

        const imageSize = Box.parse({
            x: centerPosition.x,
            y: centerPosition.y,
            w: playerThrow.width * GameSettings.GAME.GAME_SCALE,
            h: playerThrow.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(playerThrow, imageSize, true, DirectionHelper.getFaceDirection(lookAngle) === 'left');
    }
}
