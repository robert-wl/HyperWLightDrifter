import Game from './game/model/Game/Game.js';


$(document).ready(async () => {
    const game = Game.getInstance();
    game.debug = false;
    // game.enemyManager.enemySpawn = true;


    let lastTimestamp = 0;

    const animationLoop = (timestamp) => {

        const deltaTime = (timestamp - lastTimestamp) / 1000;

        // console.log(1 / deltaTime)
        game.updateGame(deltaTime);
        lastTimestamp = timestamp;


        requestAnimationFrame(animationLoop);
    };

    await game.switchState(game.startState);
    animationLoop();
    // game.init();
});
