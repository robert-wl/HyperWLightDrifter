import Game from '../../model/Game/Game.js';
import { getAngle } from '../angleHelper.js';
import GameSettings from '../../constants.js';
import detectCheatCode from '../cheatCodeHelper.js';

export default function playerInput() {
    $(document).on('keydown', (e) => {
        // e.preventDefault();
        const { keys } = Game.getInstance();
        const keyList = ['a', 'w', 'd', 's', 'e', 'c', 'q', 'p'];

        const key = e.key.toLowerCase();
        detectCheatCode(key);
        if (key === 'f') {
            Game.getInstance().keyCount += 10;
        }
        if (keyList.includes(key)) {
            if (keys.includes(key)) {
                return;
            }

            keys.push(key);
        }
        if (key === ' ') {
            if (keys.includes('space')) {
                return;
            }

            keys.push('space');
        }
    });

    $(document).on('keyup', (e) => {
        const { keys } = Game.getInstance();
        const keyList = ['a', 'w', 'd', 's', 'e', 'c', 'q', 'p'];

        const key = e.key.toLowerCase();
        if (keyList.includes(key)) {
            const index = keys.indexOf(key);
            if (index > -1) {
                keys.splice(index, 1);
            }
            Game.getInstance().lastDirection = key;
        }
        if (key === ' ') {
            const index = keys.indexOf('space');
            if (index > -1) {
                keys.splice(index, 1);
            }
        }
    });

    $(document).on('mousedown', (e) => {
        const { clicks } = Game.getInstance();
        if (e.which === 1) {
            if (clicks.includes('left')) {
                return;
            }
            clicks.push('left');
        }
        if (e.which === 3) {
            if (clicks.includes('right')) {
                return;
            }
            clicks.push('right');
        }
    });

    $(document).on('mouseup', (e) => {
        const { clicks } = Game.getInstance();
        if (e.which === 3) {
            const index = clicks.indexOf('right');
            if (index > -1) {
                clicks.splice(index, 1);
            }
        }
    });

    $(document).on('contextmenu', (e) => {
        e.preventDefault();
    });

    $(document).on('mousemove', (e) => {
        const { player, camera, canvas } = Game.getInstance();

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const playerX = (player.centerPosition.x - camera.position.x) * GameSettings.GAME.GAME_SCALE;
        const playerY = (player.centerPosition.y - camera.position.y) * GameSettings.GAME.GAME_SCALE;
        player.lookAngle = getAngle({
            x: x - playerX,
            y: y - playerY,
        });
    });
}
