import Game from './game/model/Game/Game.js';
import EnemyManager from "./game/model/enemy/EnemyManager.js";

$(document).ready(async () => {
    const game = Game.getInstance();
    game.debug = false;
    game.prepareCanvas();
    EnemyManager.getInstance().enemySpawn = true;

    const animationLoop = () => {
        game.updateGame();
        requestAnimationFrame(animationLoop);
    };

    animationLoop();
    game.switchState(game.startState);
});
