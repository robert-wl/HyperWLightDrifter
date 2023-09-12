import Game from './game/model/Game/Game.js';
import EnemyManager from "./game/model/enemy/EnemyManager.js";

$(document).ready(async () => {
    const game = Game.getInstance();
    await game.init();
    game.debug = false;
    EnemyManager.getInstance().enemySpawn = true;

    const animationLoop = () => {
        game.updateGame();
        requestAnimationFrame(animationLoop);
    };

    animationLoop();
});
