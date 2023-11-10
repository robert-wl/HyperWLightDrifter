import GameSettings from '../../constants.js';
import Game from '../game/Game.js';
import Medkit from './Medkit.js';
import Key from './Key.js';
import Elevator from './Elevator/Elevator.js';
import AssetManager from '../utility/manager/AssetManager.js';
import AudioManager from '../utility/manager/AudioManager.js';
import DistanceHelper from '../utility/helper/DistanceHelper.js';
import { Box } from '../utility/interfaces/Box.js';
import DrawHelper from '../utility/helper/DrawHelper.js';
export default class InteractionBar {
    constructor(player, inputEventEmitter) {
        this.eventHandler = () => this.inputEventEmitter.subscribe(({ event, data }) => {
            if (event === 'keydown') {
                if (data === 'e') {
                    this.isInteracting = true;
                }
            }
            if (event === 'keyup') {
                if (data === 'e') {
                    this.isInteracting = false;
                }
            }
        });
        this.player = player;
        this.inputEventEmitter = inputEventEmitter;
        this.animationStage = 1;
        this.number = 0;
        this.transparency = 0;
        this.isInteracting = false;
        this.allowDraw = false;
        this.interactionStage = 0;
        this.eventHandler();
    }
    setAllowDraw(boolean) {
        this.allowDraw = boolean;
    }
    setTransparency(transparency) {
        this.transparency = transparency;
    }
    update() {
        if (!this.isInteracting) {
            this.interactionStage -= Game.deltaTime;
            this.interactionStage = Math.max(this.interactionStage, 0);
        }
    }
    detectPlayerInteraction(object, interactDistance = 100) {
        const { player } = Game.getInstance();
        if (object == null) {
            return;
        }
        const distance = DistanceHelper.getMagnitude({
            x: player.centerPosition.x - object.position.x,
            y: player.centerPosition.y - object.position.y,
        });
        if (distance < interactDistance) {
            this.setAllowDraw(true);
            this.transparency = Math.abs(distance - interactDistance) / interactDistance;
            this.handler(object);
        }
    }
    drawBar() {
        if (!this.allowDraw) {
            this.animationStage = 1;
            return;
        }
        const { player, ctx } = Game.getInstance();
        const interactionBar = AssetManager.getNumberedImage('interaction_bar', this.animationStage);
        Game.getInstance().setTransparency(this.transparency);
        if (interactionBar == null) {
            return;
        }
        const imageSize = Box.parse({
            x: player.centerPosition.x + 50,
            y: player.centerPosition.y - 10,
            w: interactionBar.width * GameSettings.GAME.GAME_SCALE,
            h: interactionBar.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(interactionBar, imageSize);
        ctx.fillStyle = 'rgb(255, 255, 255, 0.9)';
        ctx.fillRect(player.centerPosition.x + 54, player.centerPosition.y - 2, this.interactionStage, 16);
        Game.getInstance().setTransparency(1);
        this.allowDraw = false;
    }
    checkCounter(number) {
        return this.number >= number;
    }
    advanceAnimationStage(number, maxStage) {
        const advanceStage = Math.floor(this.number / number);
        if (advanceStage > 0) {
            this.animationStage += advanceStage;
            this.number = 0;
            if (maxStage && this.animationStage > maxStage) {
                this.animationStage = 1;
            }
        }
    }
    handler(object) {
        if (this.isInteracting && this.transparency >= 0.5) {
            this.number += Game.deltaTime;
            this.interactionStage += Game.deltaTime;
            if (this.interactionStage >= 20) {
                if (object instanceof Medkit) {
                    object.activate(this.player);
                }
                if (object instanceof Key) {
                    object.activate();
                }
                if (object instanceof Elevator) {
                    object.activate();
                    this.isInteracting = false;
                }
                return true;
            }
            if (this.checkCounter(10)) {
                AudioManager.playAudio('player/interact/interact.wav');
            }
            this.advanceAnimationStage(10);
        }
        return false;
    }
}
