import { drawImage, drawMirroredY } from '../renderer/drawer.js';
import { getNumberedImage } from '../assets/assetGetter.js';
import { getFaceDirection } from '../collision/directionHandler.js';

export default function judgementDashDrawer({ moveNumber, angle, lastPosition }) {
    const judgementMove = getNumberedImage('judgement_move', (moveNumber % 3) + 1);

    if (getFaceDirection(angle) === 'left') {
        drawMirroredY({
            img: judgementMove,
            position: {
                x: lastPosition.x,
                y: lastPosition.y,
            },
            translate: true,
        });

        return;
    }

    drawImage({
        img: judgementMove,
        x: lastPosition.x,
        y: lastPosition.y,
        width: judgementMove.width * 2,
        height: judgementMove.height * 2,
        translate: true,
    });
}
