import Game from './game/model/Game.js';

$(document).ready(() => {
    const game = Game.getInstance();
    game.init();
    game.debug = false;
    game.enemySpawn = true;

    const animationLoop = () => {
        game.updateGame();
        requestAnimationFrame(animationLoop);
    };

    animationLoop();
});
