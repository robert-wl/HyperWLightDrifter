import PlayerBaseState from './PlayerBaseState.js';
import Grenade from '../Grenade.js';
import Game from '../../Game/Game.js';

export default class PlayerThrowingState extends PlayerBaseState {
    enterState(currPlayer) {
        super.enterState(currPlayer);

        const { audio } = Game.getInstance();

        audio.playAudio('player/grenade/throw.wav');

        Grenade.generate({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            angle: currPlayer.lookAngle,
        });
    }

    updateState(currPlayer) {
        super.updateState(currPlayer);

        if (this.number < 20) {
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
