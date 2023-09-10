import {drawImage, drawMirroredY} from "../renderer/drawer.js";
import {getNumberedImage} from "../imageLoader.js";


export default function judgementDashDrawer({canvas, moveNumber, angle, lastPosition}) {
    const judgementMove = getNumberedImage('judgement_move', (moveNumber % 3) + 1);

    if(angle > Math.PI / 2 || angle < -Math.PI / 2) {
        drawMirroredY({
            img: judgementMove,
            position: {
                x: lastPosition.x,
                y: lastPosition.y,
            },
            translate: true,
        });
    }
    else {
        drawImage({
            img: judgementMove,
            x: lastPosition.x,
            y: lastPosition.y,
            width: judgementMove.width * 2,
            height: judgementMove.height * 2,
            translate: true,
        })
    }
}
