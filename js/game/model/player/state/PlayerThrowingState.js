import PlayerBaseState from "./PlayerBaseState.js";
import Grenade from "../Grenade.js";


export default class PlayerThrowingState extends PlayerBaseState {

    enterState(currPlayer) {
        this.number = 0;
        const angle = currPlayer.lookAngle;

        Grenade.generate({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            angle: angle,
        })
    }
    updateState(currPlayer) {
        this.number += 1;

        if(this.number >= 20){
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                aim: true,
                throws: true,
            })
        }
    }

    exitState(currPlayer) {
    }
    drawImage(currPlayer) {
    }
}
