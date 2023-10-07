import Game from './game/model/Game/Game.js';


$(document).ready(async () => {
    const game = Game.getInstance();
    game.debug = false;
    // game.enemyManager.enemySpawn = true;


    let lastTimestamp = 0;
    let isTabVisible = true;

    const updateLoop = (timestamp) => {
        let deltaTime = (timestamp - lastTimestamp) / 1000;

        game.update(deltaTime);
        lastTimestamp = timestamp;

        requestAnimationFrame(updateLoop);
    };

    document.addEventListener('visibilitychange', () => {
        isTabVisible = document.visibilityState === 'visible';
    });

    await game.switchState(game.startState);
    updateLoop();
});
