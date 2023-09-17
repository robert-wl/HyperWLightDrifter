import Game from '../../../model/Game/Game.js';
import { getNumberedImage } from '../../imageLoader.js';
import { drawImage } from '../../renderer/drawer.js';
import GameSettings from '../../../constants.js';
import Medkit from '../../../model/interactables/Medkit.js';

let animationStage = 1;
let number = 0;
export default function interactionBarHandler({ object, opacity }) {
    const { player, ctx, keys, audio } = Game.getInstance();

    if (keys.includes('e') && opacity >= 0.5) {
        number += 1;

        object.interactionStage++;

        if (object.interactionStage === 20) {
            if (object instanceof Medkit) {
                player.healing = 6;
            }
            return true;
        }

        if (number % 7 === 0) {
            audio.playAudio('player/interact/interact.wav');
        }

        if (number % 10 === 0) {
            animationStage = (animationStage % 3) + 2;
        }

        const interactionBar = getNumberedImage('interaction_bar', animationStage);

        drawImage({
            img: interactionBar,
            x: player.centerPosition.x + 50,
            y: player.centerPosition.y - 10,
            width: interactionBar.width * GameSettings.GAME.GAME_SCALE,
            height: interactionBar.height * GameSettings.GAME.GAME_SCALE,
        });
    }
    else {
        if (object.interactionStage > 0) {
            object.interactionStage -= 1;
        }

        Game.getInstance().setTransparency(opacity);

        const interactionBar = getNumberedImage('interaction_bar', 1);

        drawImage({
            img: interactionBar,
            x: player.centerPosition.x + 50,
            y: player.centerPosition.y - 10,
            width: interactionBar.width * GameSettings.GAME.GAME_SCALE,
            height: interactionBar.height * GameSettings.GAME.GAME_SCALE,
        });
    }

    ctx.fillStyle = 'rgb(255, 255, 255, 0.9)';

    ctx.fillRect(player.centerPosition.x + 54, player.centerPosition.y - 2, object.interactionStage, 16);

    Game.getInstance().setTransparency(1);

    return false;
}
