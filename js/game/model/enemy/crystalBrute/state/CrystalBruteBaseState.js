import Animateable from '../../../Animateable.js';


export default class CrystalBruteBaseState extends Animateable {
    updateState(_currSpider) {
        this.updateNumberCounter();
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
