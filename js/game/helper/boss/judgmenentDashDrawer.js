import {get_image} from "../fileReader.js";
import {drawMirroredY} from "../renderer/drawer.js";


export default function judgementDashDrawer({canvas, moveNumber, angle, lastPosition}) {
    get_image("boss/move", "judgement_move", (moveNumber % 3) + 1, (img) => {
        if(angle > Math.PI / 2 || angle < -Math.PI / 2) {
            drawMirroredY({
                canvas: canvas,
                img: img,
                position: {
                    x: lastPosition.x,
                    y: lastPosition.y,
                },
            });
        }
        else {
            canvas.drawImage(
                img,
                lastPosition.x,
                lastPosition.y,
                img.width * 2,
                img.height * 2
            );
        }
    });
}
