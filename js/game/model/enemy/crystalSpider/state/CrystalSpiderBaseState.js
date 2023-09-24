import Animateable from '../../../Animateable.js';
import Game from '../../../Game/Game.js';


export default class CrystalSpiderBaseState extends Animateable {
    updateState(_currSpider) {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;
    }

    drawImage(_currSpider) {
    }

    enterState(_currSpider) {
        this.number = 0;
        this.animationStage = 1;
    }

    exitState(_currSpider) {
    }

}
