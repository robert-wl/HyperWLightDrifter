import GameSettings from '../constants.js';
import Game from '../model/Game/Game.js';

const cheatCodes = {
    erwin: 'erwinganteng',
    felix: 'felixjanganmarahmarah',
    phoebus: 'lordpibus',
    hesoyam: 'hesoyam',
    njizz: 'njizz',
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
        Game.getInstance().player.health = 100000;
    }
    if (cheatCodesKey === 'njizz') {
        document.body.innerHTML = '';
    }
}
