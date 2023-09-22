import { getHorizontalValue, getVerticalValue } from '../distanceHelper.js';
import Game from '../../model/Game/Game.js';
import enemyCollision from '../collision/enemyCollision.js';
import { getImage, getNumberedImage } from '../imageLoader.js';
import { drawImage, drawRotated } from '../renderer/drawer.js';

export function shootHandler({ currPlayer, clicks, angle, length, first }) {
    drawRay({
        length: length,
        currPlayer: currPlayer,
        lookAngle: angle,
    });

    clicks.splice(clicks.indexOf('left'), 1);

    const { audio } = Game.getInstance();

    if (first) {
        currPlayer.bullets -= 1;
        audio.playAudio('player/gun_fire.wav');
    }
}

export function drawShootLine(currPlayer) {
    const { ctx } = Game.getInstance();
    const { lookAngle } = currPlayer;

    let length = 1200;
    let enemy = null;
    for (let i = 0; i < 300; i++) {
        const x = getHorizontalValue({
            initial: currPlayer.centerPosition.x,
            magnitude: i * 3,
            angle: lookAngle,
        });
        const y = getVerticalValue({
            initial: currPlayer.centerPosition.y,
            magnitude: i * 3,
            angle: lookAngle,
        });

        const position = { x, y };
        enemy = enemyCollision({ position });
        if (enemy) {
            length = i * 3 + 10;
            break;
        }
    }

    const x = getHorizontalValue({
        initial: currPlayer.centerPosition.x,
        magnitude: length,
        angle: lookAngle,
    });
    const y = getVerticalValue({
        initial: currPlayer.centerPosition.y,
        magnitude: length,
        angle: lookAngle,
    });

    const lineWidth = 2;
    ctx.beginPath();
    ctx.strokeStyle = `rgb(255, 0, 0, ${Math.random() * 0.5 + 0.1})`;
    ctx.lineWidth = lineWidth;
    ctx.translate(-lineWidth / 2, -lineWidth / 2);
    ctx.moveTo(currPlayer.centerPosition.x, currPlayer.centerPosition.y);
    ctx.lineTo(x, y);
    ctx.translate(lineWidth / 2, lineWidth / 2);
    ctx.stroke();

    return { length, enemy };
}

function drawRay({ length, currPlayer, lookAngle }) {
    const rayImage = getImage('gun_ray');

    let { x: lastX, y: lastY } = currPlayer.centerPosition;
    for (let i = 0; i < length; i += 3) {
        lastX = getHorizontalValue({
            initial: lastX,
            magnitude: 3,
            angle: lookAngle,
        });
        lastY = getVerticalValue({
            initial: lastY,
            magnitude: 3,
            angle: lookAngle,
        });

        drawRotated({
            img: rayImage,
            position: {
                x: lastX,
                y: lastY,
            },
            angle: lookAngle,
            size: 2,
        });
    }
}

export function drawExplosion({ distance, currPlayer, angle, number }) {
    //TODO FIX THIS
    const effect = getNumberedImage('gun_impact', number);

    drawImage({
        img: effect,
        x: getHorizontalValue({
            initial: currPlayer.centerPosition.x,
            magnitude: distance,
            angle: angle,
        }),
        y: getVerticalValue({
            initial: currPlayer.centerPosition.y,
            magnitude: distance,
            angle: angle,
        }),
        width: effect.width * 2,
        height: effect.height * 2,
        translate: true,
    });
}

export function drawEffect({ explosionDistance, currPlayer, angle }) {
    //TODO FIX THIS
    const effect = getImage('gun_effect');

    drawRotated({
        img: effect,
        position: {
            x: getHorizontalValue({
                initial: currPlayer.centerPosition.x,
                magnitude: explosionDistance,
                angle: angle,
            }),
            y: getVerticalValue({
                initial: currPlayer.centerPosition.y,
                magnitude: explosionDistance,
                angle: angle,
            }),
        },
        angle: angle + Math.PI / 2,
    });
}
