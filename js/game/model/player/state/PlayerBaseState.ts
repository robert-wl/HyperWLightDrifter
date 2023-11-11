import Animateable from '../../utility/Animateable.js';
import Player from '../Player.js';

export default class PlayerBaseState extends Animateable {
    public updateState(currPlayer: Player) {
        this.updateNumberCounter();
    }

    public exitState(currPlayer: Player) {}

    public drawImage(currPlayer: Player) {}

    public enterState(currPlayer: Player) {
        this.number = 0;
        this.animationStage = 1;
    }
}
