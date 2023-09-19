import Game from './game/model/Game/Game.js';
import EnemyManager from './game/model/enemy/EnemyManager.js';

$(document).ready(async () => {
    const game = Game.getInstance();
    game.debug = true;
    // game.enemyManager.enemySpawn = true;

    const animationLoop = () => {
        game.updateGame();
        requestAnimationFrame(animationLoop);
    };

    animationLoop();
    // game.init();
    game.switchState(game.startState);
});
