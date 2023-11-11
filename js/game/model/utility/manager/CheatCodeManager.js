import GameSettings from '../../../constants.js';
import Game from '../../game/Game.js';
export default class CheatCodeManager {
    constructor(game, eventEmitter) {
        this.tempKeyStorage = [];
        this.game = game;
        this.eventEmitter = eventEmitter;
        this.cheatCodes = GameSettings.GAME.CHEAT_CODES;
        this.eventHandler();
    }
    eventHandler() {
        this.eventEmitter.subscribe(({ event, data }) => {
            if (event === 'keydown') {
                this.detectCheatCode(data);
            }
        });
    }
    detectCheatCode(key) {
        if (!key) {
            return;
        }
        this.tempKeyStorage.push(key);
        if (this.tempKeyStorage.length > 30) {
            this.tempKeyStorage.shift();
        }
        for (let cheatCodesKey in this.cheatCodes) {
            const cheatCode = this.cheatCodes[cheatCodesKey];
            if (this.tempKeyStorage.join('').toLowerCase().includes(cheatCode)) {
                this.handleCheatCodes(cheatCodesKey);
                this.tempKeyStorage.length = 0;
            }
        }
    }
    handleCheatCodes(cheatCodesKey) {
        if (cheatCodesKey === 'erwin') {
            GameSettings.GAME.GAME_SPEED *= 0.5;
            return;
        }
        if (cheatCodesKey === 'felix') {
            GameSettings.GAME.GAME_SPEED *= 2;
            return;
        }
        if (cheatCodesKey === 'phoebus') {
            this.game.player.health = 0;
            return;
        }
        if (cheatCodesKey === 'hesoyam') {
            const { player } = this.game;
            GameSettings.player.MAX_STAMINA = 100000;
            GameSettings.player.MAX_HEALTH = 100000;
            GameSettings.player.MAX_BOMBS = 1000;
            GameSettings.player.MAX_BULLETS = 1000;
            player.health = 100000;
            player.stamina = 100000;
            player.bombs = 1000;
            player.bullets = 1000;
            return;
        }
        if (cheatCodesKey === 'obert') {
            Game.renderCollider = !Game.renderCollider;
            return;
        }
    }
}
