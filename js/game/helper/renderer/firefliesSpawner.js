import Fireflies from '../../model/particles/Fireflies.js';
import Game from '../../model/game/Game.js';

let number = 0;

export default function firefliesSpawner() {
    const { ctx, player, deltaTime } = Game.getInstance();
    number += deltaTime;
    if (number >= 3) {
        Fireflies.generate({
            canvas: ctx,
            distance: 500,
            position: player.centerPosition,
            speed: 0.25,
            lifespan: 3,
        });
        number = 0;
    }
}
