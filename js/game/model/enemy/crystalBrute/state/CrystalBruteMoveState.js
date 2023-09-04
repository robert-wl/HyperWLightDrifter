import CrystalBruteBaseState from "./CrystalBruteBaseState.js";
import Game from "../../../Game.js";
import {get_image} from "../../../../helper/fileReader.js";

export default class CrystalBruteMoveState extends CrystalBruteBaseState {
    clockwise = true;
    enterState(currBrute){
        this.number = 0;
        this.animationStage = 0;
        this.clockwise = Math.random() < 0.5;
        currBrute.speed = 0.5;
    }
    updateState(currBrute){
        this.number += 1;

        const distance = Math.sqrt(
            Math.pow(Game.getInstance().player.position.x - currBrute.position.x, 2) +
            Math.pow(Game.getInstance().player.position.y - currBrute.position.y, 2)
        );

        const x = Game.getInstance().player.position.x - currBrute.position.x;
        const y = Game.getInstance().player.position.y - currBrute.position.y;

        if(currBrute.health <= 0){
            currBrute.switchState(currBrute.dieState);
            return;
        }

        if(this.number > 200 + (Math.random() * 1000)){
            currBrute.switchState(currBrute.attackState);
        } else if(distance < 100) {
            currBrute.angle = Math.atan2(y, x);
            const angle2 = currBrute.angle + Math.PI/2 * (this.clockwise ? 1 : -1);
            currBrute.position.x += Math.cos(angle2) * currBrute.speed;
            currBrute.position.y += Math.sin(angle2) * currBrute.speed;
        } else { //TODO
            currBrute.angle = Math.atan2(y, x);
            currBrute.position.x += Math.cos(currBrute.angle) * currBrute.speed;
            currBrute.position.y += Math.sin(currBrute.angle) * currBrute.speed;
        }
    }
    drawImage(currBrute){
        const ctx = Game.getInstance().canvasCtx;
        const angle = currBrute.angle;

        if(this.number % 20 === 0){
            this.animationStage = (this.animationStage + 1) % 6;
        }
        get_image("enemy/crystal_brute", "crystal_brute_walk", this.animationStage + 1, (image) => {
            if(angle > 0 && angle < Math.PI / 2 || angle < 0 && angle > -Math.PI / 2){
                ctx.drawImage(image, currBrute.position.x, currBrute.position.y, currBrute.width, currBrute.height);
            }
            else {
                ctx.scale(-1, 1);
                ctx.drawImage(image, -currBrute.position.x - currBrute.width, currBrute.position.y, currBrute.width, currBrute.height);
                ctx.scale(-1, 1);
            }
        });
    }
    exitState(currBrute){}


}
