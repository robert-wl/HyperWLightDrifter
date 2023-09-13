import { get_image } from '../fileReader.js';
import { drawImage, drawMirroredY, drawRotated } from './drawer.js';
import { getImage, getNumberedImage } from '../imageLoader.js';
import Game from '../../model/Game/Game.js';
import GameSettings from '../../constants.js';

export default function playerDashDrawer(data) {
    const { dashNumber, angle, lastPosition, filter } = data;
    if (filter) {
        Game.getInstance().setFilter(filter);
    }

    if (dashNumber < 4 && !filter) {
        const dashAnimation = getNumberedImage('dash_animation', dashNumber);

        drawRotated({
            img: dashAnimation,
            angle: angle + Math.PI,
            position: {
                x: lastPosition.x,
                y: lastPosition.y,
            },
        });
    }

    drawDirectionalDash(data);
}

function drawDirectionalDash({ canvas, currPosition, dashNumber, direction }) {
    if (direction === 'w') {
        const dashUp = getNumberedImage('dash_up', dashNumber);

        drawImage({
            img: dashUp,
            x: currPosition.x,
            y: currPosition.y,
            width: dashUp.width * GameSettings.GAME.GAME_SCALE,
            height: dashUp.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }
    if (direction === 'd' || direction === 'a') {
        const dashSide = getNumberedImage('dash_side', dashNumber);

        drawImage({
            img: dashSide,
            x: currPosition.x,
            y: currPosition.y,
            width: dashSide.width * GameSettings.GAME.GAME_SCALE,
            height: dashSide.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: direction === 'a',
        });
    }
    if (direction === 's') {
        const dashDown = getNumberedImage('dash_down', dashNumber);

        drawImage({
            img: dashDown,
            x: currPosition.x,
            y: currPosition.y,
            width: dashDown.width * GameSettings.GAME.GAME_SCALE,
            height: dashDown.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }
}
