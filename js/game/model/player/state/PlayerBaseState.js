import Game from '../../Game/Game.js';
import Animateable from '../../Animateable.js';

export default class PlayerBaseState extends Animateable {
    updateState(currPlayer) {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;
    }

    drawImage(currPlayer) {
    }

    enterState(currPlayer) {
        this.number = 0;
        this.animationStage = 1;
    }

    exitState(currPlayer) {
    }
}
