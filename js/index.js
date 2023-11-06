import Game from './game/model/game/Game.js';

$(async () => {
    const game = Game.getInstance();
    game.debug = false;

    let lastTimestamp = 0;
    let isTabVisible = true;

    const updateLoop = (timestamp) => {
        let deltaTime = (timestamp - lastTimestamp) / 1000;

        game.update(deltaTime);
        lastTimestamp = timestamp;

        requestAnimationFrame(updateLoop);
    };

    $(document).on('visibilitychange', () => {
        isTabVisible = document.visibilityState === 'visible';
    });

    await game.switchState(game.startState);

    updateLoop();
});
