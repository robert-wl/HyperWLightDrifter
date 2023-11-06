import GameSettings from '../constants.js';
import Game from '../model/game/Game.js';

const cheatCodes = {
    erwin: 'erwinganteng',
    felix: 'felixmarah',
    phoebus: 'lordpibus',
    hesoyam: 'hesoyam',
    obert: 'oobacachat',
};

const tempKeyStorage = [];

export default function detectCheatCode(key) {
    if (!key) {
        return;
    }

    tempKeyStorage.push(key);

    if (tempKeyStorage.length > 30) {
        tempKeyStorage.shift();
    }

    console.log('nya');
    for (let cheatCodesKey in cheatCodes) {
        const cheatCode = cheatCodes[cheatCodesKey];
        if (tempKeyStorage.join('').toLowerCase().includes(cheatCode)) {
            console.log('Cheat code activated');
            handleCheatCodes(cheatCodesKey);
            tempKeyStorage.length = 0;
        }
    }
}

function handleCheatCodes(cheatCodesKey) {
    if (cheatCodesKey === 'erwin') {
        GameSettings.GAME.GAME_SPEED *= 0.5;
        return;
    }
    if (cheatCodesKey === 'felix') {
        GameSettings.GAME.GAME_SPEED *= 2;
        return;
    }
    if (cheatCodesKey === 'phoebus') {
        Game.getInstance().player.health = 0;
    }
    if (cheatCodesKey === 'hesoyam') {
        const { player } = Game.getInstance();
        GameSettings.player.MAX_STAMINA = 100000;
        GameSettings.player.MAX_HEALTH = 100000;
        GameSettings.player.MAX_BOMBS = 1000;
        GameSettings.player.MAX_BULLETS = 1000;
        player.health = 100000;
        player.stamina = 100000;
        player.bombs = 1000;
        player.bullets = 1000;
    }
    if (cheatCodesKey === 'obert') {
        Game.getInstance().renderCollider = !Game.getInstance().renderCollider;
    }
}
