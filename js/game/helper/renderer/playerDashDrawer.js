import {get_image} from "../fileReader.js";
import {drawMirroredY, drawRotated} from "./drawer.js";


export default function playerDashDrawer({canvas, currPosition, dashNumber, angle, lastPosition, direction, filter}) {
    if(filter) canvas.filter = filter;
    if (dashNumber < 4 && !filter) {
        get_image("player/dash/animation", "dash_animation", dashNumber, (img) => {
            drawRotated({ canvas: canvas, img: img, angle: angle + Math.PI, position: {
                    x: lastPosition.x + 35,
                    y: lastPosition.y + 45
                } });

        });
    }
    if (direction === "w") {
        return get_image("player/dash", "dash_up", dashNumber, function (img) {
            canvas.drawImage(img, currPosition.x - 25, currPosition.y - 10, img.width * 2, img.height * 2);
        });
    }
    if (direction === "d") {
        return get_image("player/dash", "dash_side", dashNumber, function (img) {
            canvas.drawImage(img, currPosition.x - 25, currPosition.y - 10, img.width * 2, img.height * 2);
        });
    }
    if (direction === "a") {
        return get_image("player/dash", "dash_side", dashNumber, function (img) {
            drawMirroredY({ canvas: canvas, img: img, position: {
                    x: currPosition.x - 25,
                    y: currPosition.y - 10
                }});
        });
    }
    if (direction === "s") {
        return get_image("player/dash", "dash_down", dashNumber, function (img) {
            canvas.drawImage(img, currPosition.x - 25, currPosition.y - 10, img.width * 2, img.height * 2);
        });
    }
}
