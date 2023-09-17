import PlayerBaseState from './PlayerBaseState.js';
import Grenade from '../Grenade.js';
import Game from '../../Game/Game.js';

export default class PlayerThrowingState extends PlayerBaseState {
    enterState(currPlayer) {
        this.number = 0;

        const { audio } = Game.getInstance();

        audio.playAudio('player/grenade/throw.wav');

        Grenade.generate({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            angle: currPlayer.lookAngle,
        });
    }
    updateState(currPlayer) {
        this.number += 1;

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
