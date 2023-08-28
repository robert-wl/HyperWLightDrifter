import Game from "./game/model/Game.js";

$(document).ready(() => {
    const game = Game.getInstance();
    game.init();


    const animationLoop = () => {
        game.updateGame();
        requestAnimationFrame(animationLoop);
    }

    animationLoop();
})
