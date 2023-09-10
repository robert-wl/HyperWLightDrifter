import Game from './game/model/Game/Game.js';

$(document).ready(async () => {
    const game = Game.getInstance();
    await game.init();
    game.debug = false;
    game.enemySpawn = false;

    const animationLoop = () => {
        game.updateGame();
        requestAnimationFrame(animationLoop);
    };

    animationLoop();
});
