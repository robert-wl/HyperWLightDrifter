import Game from "../../model/Game.js";

export default function playerCollision({ position, box, angle }) {
    const player = Game.getInstance().player;

    if(player.immunity < 30 || player.currState === player.dashState) {
        return false;
    }
    if(position) {
        if (
            player.position.x + player.hitbox.x < position.x &&
            player.position.x + player.width - player.hitbox.w > position.x &&
            player.position.y + player.hitbox.y < position.y &&
            player.position.y + player.height - player.hitbox.h > position.y
        ) {
            player.damage({
                amount: 1,
                angle: angle + Math.PI,
            })
            return true;
        }
    }
    if(box) {
        const enemyX1 = box.x;
        const enemyX2 = box.x + box.w;
        const enemyY1 = box.y ;
        const enemyY2 = box.y + box.h ;

        const playerX1 = player.position.x + player.hitbox.x;
        const playerX2 = player.position.x + player.hitbox.x + player.width - player.hitbox.w;
        const playerY1 = player.position.y + player.hitbox.y;
        const playerY2 = player.position.y + player.hitbox.y + player.height - player.hitbox.h;
        if(
            enemyX1 < playerX2 &&
            enemyX2 > playerX1 &&
            enemyY1 < playerY2 &&
            enemyY2 > playerY1
        ) {
            player.damage({
                amount: 1,
                angle: Math.random() * Math.PI * 2
            })
            return true;
        }
    }
    return false;
}
