import Game from "../model/Game.js";

export default function playerInput() {
    $(document).keydown((e) => {
        if (e.key === "a" || e.key === "w" || e.key === "d" || e.key === "s") {
            if (Game.getInstance().keys.includes(e.key)) return;
            Game.getInstance().keys.push(e.key);
        }
        if (e.key === " ") {
            if (Game.getInstance().keys.includes("space")) return;
            Game.getInstance().keys.push("space");
        }
    });

    $(document).keyup((e) => {
        if (e.key === "a" || e.key === "w" || e.key === "d" || e.key === "s") {
            const index = Game.getInstance().keys.indexOf(e.key);
            if (index > -1) {
                Game.getInstance().keys.splice(index, 1);
            }
            Game.getInstance().lastDirection = e.key;
        }
    });

    $(document).mousedown((e) => {
        if (e.which === 1) {
            if (Game.getInstance().clicks.includes("left")) return;
            Game.getInstance().clicks.push("left");
        }
    });

    $(document).mousemove((e) => {
        const rect = Game.getInstance().canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const player = Game.getInstance().player;
        const camera = Game.getInstance().camera;
        const playerX = (player.position.x - camera.position.x) * 1.5;
        const playerY = (player.position.y - camera.position.y) * 1.5;
        player.lookAngle = Math.atan2(y - playerY, x - playerX);
    });

}
