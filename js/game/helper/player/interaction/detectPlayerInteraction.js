import Game from '../../../model/Game/Game.js';
import { getMagnitudeValue } from '../../distanceHelper.js';
import interactionBarHandler from './interactionBarHandler.js';

export default function detectPlayerInteraction(object) {
    const { player } = Game.getInstance();

    const distance = getMagnitudeValue({
        x: player.centerPosition.x - (object.x + object.width / 2),
        y: player.centerPosition.y - (object.y + object.height / 2),
    });

    if (distance < 100) {
        if (
            interactionBarHandler({
                object: object,
                opacity: Math.abs(distance - 100) / 100,
            })
        ) {
            object.destroy();
        }
    } else {
        player.interactionStage = 0;
    }
}
