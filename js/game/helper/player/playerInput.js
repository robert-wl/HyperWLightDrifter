import Game from '../../model/Game/Game.js';
import { getAngle } from '../angleHelper.js';
import GameSettings from '../../constants.js';

export default function playerInput() {
    $(document).keydown((e) => {
        const { keys } = Game.getInstance();
        const keyList = ['a', 'w', 'd', 's', 'e', 'c', 'q', 'A', 'W', 'D', 'S', 'E', 'C', 'Q'];

        console.log(e.key);
        if (keyList.includes(e.key)) {
            if (keys.includes(e.key)) {
                return;
            }

            keys.push(e.key);
        }
        if (e.key === ' ') {
            if (keys.includes('space')) {
                return;
            }

            keys.push('space');
        }
        if (e.key === 'escape') {
            if (keys.includes('escape')) {
                return;
            }

            keys.push('escape');
        }

    });


    $(document).keyup((e) => {
        const { keys } = Game.getInstance();
        const keyList = ['a', 'w', 'd', 's', 'e', 'c', 'q', 'A', 'W', 'D', 'S', 'E', 'C', 'Q'];

        if (keyList.includes(e.key)) {
            const index = keys.indexOf(e.key);
            if (index > -1) {
                keys.splice(index, 1);
            }
            Game.getInstance().lastDirection = e.key;
        }
        if (e.key === ' ') {
            const index = keys.indexOf('space');
            if (index > -1) {
                keys.splice(index, 1);
            }
        }
        if (e.key === 'Escape') {
            if (keys.includes('escape')) {
                return;
            }

            keys.push('escape');
        }
    });

    $(document).mousedown((e) => {
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


    $(document).mouseup((e) => {
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

    $(document).mousemove((e) => {
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
