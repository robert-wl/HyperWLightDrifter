import PlayerBaseState from "./PlayerBaseState.js";
import {get_image} from "../../../helper/fileReader.js";
import Game from "../../Game.js";

const scale = 2;
export default class PlayerHurtState extends PlayerBaseState {

    enterState(currPlayer){
        this.number = 0;
        this.animationStage = 0;
    }
    updateState(currPlayer){
        this.number++;

        if(this.number % 10 === 0) {
            this.animationStage++;
        }
        if(this.animationStage === 3){
            currPlayer.handleSwitchState({
                move: true,
                idle: true,
                attackOne: true,
                dash: true,
                aim: true,
            })
        }
    }
    drawImage(currPlayer){
        get_image('player/hurt', 'hurt', this.animationStage + 1, (img) => {
            Game.getInstance().canvasCtx.drawImage(
                img,
                currPlayer.position.x - 15,
                currPlayer.position.y - 10,
                currPlayer.width * scale,
                currPlayer.height * scale
            );
        })
    }
    exitState(currPlayer){}

}
