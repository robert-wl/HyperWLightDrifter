import CrystalBruteBaseState from "./CrystalBruteBaseState.js";
import Game from "../../../Game/Game.js";
import {getRandomBoolean, getRandomValue} from "../../../../helper/randomHelper.js";
import {getHorizontalValue, getMagnitudeValue, getVerticalValue} from "../../../../helper/distanceHelper.js";
import {getAngle} from "../../../../helper/angleHelper.js";
import {getNumberedImage} from "../../../../helper/imageLoader.js";
import {drawImage, drawMirroredY} from "../../../../helper/renderer/drawer.js";
import {getFaceDirection} from "../../../../helper/collision/directionHandler.js";

export default class CrystalBruteMoveState extends CrystalBruteBaseState {
    clockwise = true;
    enterState(currBrute){
        this.number = 0;
        this.animationStage = 0;
        this.clockwise = getRandomBoolean(0.5);
        currBrute.speed = 0.5;
        this.attackDelay = getRandomValue({
            initialValue: 200,
            randomValue: 1000,
        })
    }
    updateState(currBrute){
        this.number += 1;

        if(this.number % 20 === 0){
            this.animationStage = (this.animationStage + 1) % 6;
        }

        const { position } = Game.getInstance().player;
        const distance = getMagnitudeValue({
            x: position.x - currBrute.position.x,
            y: position.y - currBrute.position.y,
        });

        if(currBrute.health <= 0){
            currBrute.switchState(currBrute.dieState);
            return;
        }

        if(this.number > this.attackDelay){
            currBrute.switchState(currBrute.attackState);
            return;
        }

        // if(distance < 100) {
        //     currBrute.angle = getAngle({
        //         x: position.x - currBrute.position.x,
        //         y: position.y - currBrute.position.y,
        //     });
        //     const angle2 = currBrute.angle + Math.PI/2 * (this.clockwise ? 1 : -1);
        //     currBrute.position.x += Math.cos(angle2) * currBrute.speed;
        //     currBrute.position.y += Math.sin(angle2) * currBrute.speed;
        // } else { //TODO
        currBrute.angle = getAngle({
            x: position.x - currBrute.position.x,
            y: position.y - currBrute.position.y,
        });
        currBrute.position.x += getHorizontalValue({
            magnitude: currBrute.speed,
            angle: currBrute.angle,
        });
        currBrute.position.y += getVerticalValue({
            magnitude: currBrute.speed,
            angle: currBrute.angle,
        });
        // }
    }
    drawImage(currBrute){
        const bruteWalk = getNumberedImage('crystal_brute_walk', this.animationStage + 1);

        if(getFaceDirection(currBrute.angle) === 'left') {
            drawMirroredY({
                img: bruteWalk,
                position: currBrute.position,
                width: currBrute.width,
                height: currBrute.height,
                translate: true,
            });
        }
        else {
            drawImage({
                img: bruteWalk,
                x: currBrute.position.x,
                y: currBrute.position.y,
                width: currBrute.width,
                height: currBrute.height,
                translate: true
            });
        }
    }
}
