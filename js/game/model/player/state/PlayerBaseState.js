import Animateable from '../../utility/Animateable.js';
export default class PlayerBaseState extends Animateable {
    updateState(currPlayer) {
        this.updateNumberCounter();
    }
    exitState(currPlayer) { }
    drawImage(currPlayer) { }
    enterState(currPlayer) {
        this.number = 0;
        this.animationStage = 1;
    }
}
