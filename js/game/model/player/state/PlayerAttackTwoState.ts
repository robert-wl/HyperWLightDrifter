import PlayerBaseState from './PlayerBaseState.js';
import { getMouseDirection } from '../../../helper/collision/directionHandler.js';
import Game from '../../game/Game.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import { getHorizontalValue, getVerticalValue } from '../../../helper/distanceHelper.js';
import GameSettings from '../../../constants.js';
import Player from '../Player.js';
import AssetManager from '../../utility/AssetManager.js';

export default class PlayerAttackTwoState extends PlayerBaseState {
    private direction: string;

    public constructor() {
        super();
        this.direction = '';
    }

    enterState(currPlayer: Player) {
        this.number = 1;
        this.animationStage = 1;
        const angle = currPlayer.lookAngle;

        currPlayer.velocity.x = getHorizontalValue({
            magnitude: currPlayer.attackMoveSpeed,
            angle: angle,
        });
        currPlayer.velocity.y = getVerticalValue({
            magnitude: currPlayer.attackMoveSpeed,
            angle: angle,
        });

        const direction = getMouseDirection({ angle });

        this.direction = direction;
        currPlayer.lastDirection = direction;

        currPlayer.getAttackBox({
            direction: this.direction,
        });

        currPlayer.attackObserver.notify('playerAttack');

        const { clicks, audio, enemyManager } = Game.getInstance();

        clicks.splice(clicks.indexOf('left'), 1);
        audio.playAudio('player/attack.wav', 2);
    }

    exitState(currPlayer: Player) {
        this.direction = '';
        this.animationStage = 1;
    }

    updateState(currPlayer: Player) {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;

        currPlayer.getAttackBox({
            direction: this.direction,
        });

        if (this.direction === 'a' || this.direction === 'd') {
            this.attackSideTiming(currPlayer);
            return;
        }
        if (this.direction === 'w' || this.direction === 's') {
            this.attackVerticalTiming(currPlayer);
        }
    }

    drawImage(currPlayer: Player) {
        if (Game.getInstance().debug) {
            this.drawDebug(currPlayer);
        }

        let attackImage: HTMLImageElement | null = null;

        if (this.direction === 'w') {
            attackImage = AssetManager.getNumberedImage('attack_two_up', this.animationStage);
        }
        if (this.direction === 'a' || this.direction === 'd') {
            attackImage = AssetManager.getNumberedImage('attack_two_side', this.animationStage);
        }
        if (this.direction === 's') {
            attackImage = AssetManager.getNumberedImage('attack_two_down', this.animationStage);
        }

        if (attackImage === null) {
            return;
        }

        drawImage({
            img: attackImage,
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            width: attackImage.width * GameSettings.GAME.GAME_SCALE,
            height: attackImage.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: this.direction === 'a',
        });
    }

    private drawDebug(currPlayer: Player) {
        const { ctx } = Game.getInstance();
        ctx.fillStyle = 'red';
        ctx.fillRect(currPlayer.attackBox.x, currPlayer.attackBox.y, currPlayer.attackBox.w, currPlayer.attackBox.h);
    }

    private attackSideTiming(currPlayer: Player) {
        this.advanceAnimationStage(1);

        if (this.animationStage >= 20) {
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                aim: true,
                throws: true,
            });
        }
    }

    private attackVerticalTiming(currPlayer: Player) {
        this.advanceAnimationStage(2);

        if (this.animationStage >= 12) {
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                aim: true,
                throws: true,
            });
        }
    }
}
