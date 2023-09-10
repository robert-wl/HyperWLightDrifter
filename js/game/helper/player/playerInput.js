import Game from '../../model/Game/Game.js';

export default function playerInput() {
    console.log("hai")
    $(document).keydown((e) => {
        console.log("hai")
        if (e.key === 'a' || e.key === 'w' || e.key === 'd' || e.key === 's' || e.key === 's' || e.key === 'e' || e.key === 'c'  || e.key === 'c') {
            if (Game.getInstance().keys.includes(e.key)) {
                return;
            }
            Game.getInstance().keys.push(e.key);
        }
        if (e.key === ' ') {
            if (Game.getInstance().keys.includes('space')) {
                return;
            }
            Game.getInstance().keys.push('space');
        }
    });


    $(document).keyup((e) => {
        if (e.key === 'a' || e.key === 'w' || e.key === 'd' || e.key === 's' || e.key === 'e' || e.key === 'c') {
            const index = Game.getInstance().keys.indexOf(e.key);
            if (index > -1) {
                Game.getInstance().keys.splice(index, 1);
            }
            Game.getInstance().lastDirection = e.key;
        }
        if (e.key === ' ') {
            const index = Game.getInstance().keys.indexOf('space');
            if (index > -1) {
                Game.getInstance().keys.splice(index, 1);
            }
        }
    });

    $(document).mousedown((e) => {
        if (e.which === 1) {
            if (Game.getInstance().clicks.includes('left')) {
                return;
            }
            Game.getInstance().clicks.push('left');
        }
        if (e.which === 3) {
            if (Game.getInstance().clicks.includes('right')) {
                return;
            }
            Game.getInstance().clicks.push('right');
        }
    });


    $(document).mouseup((e) => {
       if (e.which === 3) {
           const index = Game.getInstance().clicks.indexOf('right');
           if (index > -1) {
               Game.getInstance().clicks.splice(index, 1);
           }
       }
    });

    $(document).on('contextmenu', (e) => {
        e.preventDefault();
    });

    $(document).mousemove((e) => {
        const rect = Game.getInstance().canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const { player, camera } = Game.getInstance();
        const playerX = (player.position.x - camera.position.x) * 2;
        const playerY = (player.position.y - camera.position.y) * 2;
        player.lookAngle = Math.atan2(y - playerY, x - playerX);
    });
}
