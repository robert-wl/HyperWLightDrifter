import { drawImage, drawRotated } from './drawer.js';
import { getNumberedImage } from '../assets/assetGetter.js';
import Game from '../../model/Game/Game.js';
import GameSettings from '../../constants.js';

export default function playerDashDrawer(data) {
    const { animationStage, angle, lastPosition, filter } = data;
    if (filter) {
        Game.getInstance().setFilter(filter);
    }

    if (animationStage < 4 && !filter) {
        const dashAnimation = getNumberedImage('dash_animation', animationStage);

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

function drawDirectionalDash({ currPosition, animationStage, direction }) {
    if (direction === 'w') {
        const dashUp = getNumberedImage('dash_up', animationStage);

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
        const dashSide = getNumberedImage('dash_side', animationStage);

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
        const dashDown = getNumberedImage('dash_down', animationStage);

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
