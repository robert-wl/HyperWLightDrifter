import Animateable from '../../utility/Animateable.js';

export default class PlayerBaseState extends Animateable {
    updateState(_currPlayer) {
        this.updateNumberCounter();
    }

    drawImage(_currPlayer) {}

    enterState(_currPlayer) {
        this.number = 0;
        this.animationStage = 1;
    }

    exitState(_currPlayer) {}
}
