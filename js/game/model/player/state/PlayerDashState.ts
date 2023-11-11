import PlayerBaseState from './PlayerBaseState.js';
import Game from '../../game/Game.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import Player from '../Player.js';
import { PlayerDashData } from '../../utility/interfaces/PlayerDashData';
import DirectionHelper from '../../utility/helper/DirectionHelper.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import { PolarVector } from '../../utility/interfaces/PolarVector.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import GameSettings from '../../../constants.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';

export default class PlayerDashState extends PlayerBaseState {
    private lastData: PlayerDashData[] = [];
    private lastPosition: Vector;
    private direction: string;
    private angle: number;
    private finished: boolean;

    public constructor() {
        super();
        this.lastPosition = Vector.Zero();
        this.direction = '';
        this.angle = 0;
        this.finished = false;
    }

    enterState(currPlayer: Player) {
        super.enterState(currPlayer);
        this.angle = currPlayer.lookAngle;

        const direction = DirectionHelper.getMouseDirection(this.angle);
        this.direction = direction;
        this.lastPosition = { ...currPlayer.centerPosition };
        this.finished = false;

        currPlayer.lastDirection = direction;
        currPlayer.stamina -= 20;

        AudioManager.playAudio('player_dash_audio').then();
    }

    updateState(currPlayer: Player) {
        super.updateState(currPlayer);

        this.dashTiming(currPlayer);
        if (this.checkCounter(4)) {
            return;
        }

        const pVector = new PolarVector(currPlayer.dashMoveSpeed * Game.deltaTime, this.angle);
        currPlayer.velocity.x = DistanceHelper.getHorizontalValue(pVector);
        currPlayer.velocity.y = DistanceHelper.getVerticalValue(pVector);
    }

    drawImage(currPlayer: Player) {
        this.lastData.forEach((data) => {
            Game.getInstance().setFilter('brightness(50%) hue-rotate(200deg)');
            this.playerDashDrawer(data);
            Game.getInstance().setFilter('none');
        });

        const data = this.generateDashData(currPlayer);
        this.playerDashDrawer(data);

        if (this.lastData.length > 4) {
            this.lastData.shift();
        }
        if (this.animationStage % 3 === 0 && this.number <= 1 && !this.finished) {
            this.lastData.push(data);
        }
    }

    exitState(currPlayer: Player) {
        this.number = 1;
        this.animationStage = 1;
        this.lastData = [];
    }

    private playerDashDrawer(data: PlayerDashData) {
        const { animationStage, angle, lastPosition } = data;

        if (animationStage < 4) {
            const dashAnimation = AssetManager.getNumberedImage('dash_animation', animationStage);

            const imageSize = Box.parse({
                x: lastPosition.x,
                y: lastPosition.y,
                w: dashAnimation.width * GameSettings.GAME.GAME_SCALE,
                h: dashAnimation.height * GameSettings.GAME.GAME_SCALE,
            });

            DrawHelper.drawRotated(dashAnimation, imageSize, angle + Math.PI);
        }

        this.drawDirectionalDash(data);
    }

    private drawDirectionalDash({ currPosition, animationStage, direction }: PlayerDashData) {
        if (direction === 'w') {
            const dashUp = AssetManager.getNumberedImage('dash_up', animationStage);

            const imageSize = Box.parse({
                x: currPosition.x,
                y: currPosition.y,
                w: dashUp.width * GameSettings.GAME.GAME_SCALE,
                h: dashUp.height * GameSettings.GAME.GAME_SCALE,
            });

            DrawHelper.drawImage(dashUp, imageSize, true);
        }
        if (direction === 'd' || direction === 'a') {
            const dashSide = AssetManager.getNumberedImage('dash_side', animationStage);

            const imageSize = Box.parse({
                x: currPosition.x,
                y: currPosition.y,
                w: dashSide.width * GameSettings.GAME.GAME_SCALE,
                h: dashSide.height * GameSettings.GAME.GAME_SCALE,
            });

            DrawHelper.drawImage(dashSide, imageSize, true, direction === 'a');
        }
        if (direction === 's') {
            const dashDown = AssetManager.getNumberedImage('dash_down', animationStage);

            const imageSize = Box.parse({
                x: currPosition.x,
                y: currPosition.y,
                w: dashDown.width * GameSettings.GAME.GAME_SCALE,
                h: dashDown.height * GameSettings.GAME.GAME_SCALE,
            });

            DrawHelper.drawImage(dashDown, imageSize, true);
        }
    }

    private generateDashData(currPlayer: Player): PlayerDashData {
        return {
            currPosition: {
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
            },
            animationStage: this.animationStage,
            angle: this.angle,
            lastPosition: this.lastPosition,
            direction: this.direction,
        };
    }

    private dashTiming(currPlayer: Player) {
        this.advanceAnimationStage(2);
        this.animationStage = Math.min(this.animationStage, 11);

        if (this.animationStage >= 11) {
            this.finished = true;
            if (this.lastData.length > 0) {
                this.lastData.shift();
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
    }
}
