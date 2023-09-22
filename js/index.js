import Game from './game/model/Game/Game.js';

$(document).ready(async () => {
    const game = Game.getInstance();
    game.debug = false;
    // game.enemyManager.enemySpawn = true;

    const animationLoop = () => {
        game.updateGame();
        requestAnimationFrame(animationLoop);
    };

    animationLoop();
    // game.init();
    game.switchState(game.startState);
});
