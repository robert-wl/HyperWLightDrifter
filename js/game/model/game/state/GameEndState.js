import GameBaseState from './GameBaseState.js';
export default class GameEndState extends GameBaseState {
    enterState(game) {
        game.hudManager.clearHUD();
        game.ctx.clearRect(game.camera.position.x, game.camera.position.y, game.canvas.width * 2, game.canvas.height * 2);
        game.htmlHandlers.notify('endGame');
        localStorage.setItem('finished', 'true');
    }
}
