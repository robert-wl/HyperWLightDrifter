import Game from "../../model/Game.js";


export default function getEntityOnAttack({ player }) {

    const enemies = Game.getInstance().enemyList;
    // tx.arc(currPlayer.position.x + playerOffset.x, currPlayer.position.y + playerOffset.y, 100, currPlayer.lookAngle - Math.PI / 3, currPlayer.lookAngle + Math.PI / 3, false);
    // ctx.lineTo(currPlayer.position.x + playerOffset.x, currPlayer.position.y + playerOffset.y);

    for(const enemy of enemies) {
        if(enemy.health <= 0) {
            continue;
        }

        const enemyX1 = enemy.position.x + enemy.hitbox.x;
        const enemyX2 = enemy.position.x + enemy.hitbox.x + enemy.width - enemy.hitbox.w;
        const enemyY1 = enemy.position.y + enemy.hitbox.y;
        const enemyY2 = enemy.position.y + enemy.hitbox.y + enemy.height - enemy.hitbox.h;

        const playerX1 = player.attackBox.x;
        const playerX2 = player.attackBox.x + player.attackBox.w;
        const playerY1 = player.attackBox.y;
        const playerY2 = player.attackBox.y + player.attackBox.h;

        if(
            enemyX1 < playerX2 &&
            enemyX2 > playerX1 &&
            enemyY1 < playerY2 &&
            enemyY2 > playerY1
        ) {
            enemy.damage({
                amount: 1,
                angle: player.lookAngle,
            });

            if(player.bullets < 3) {
                player.bullets++;
            }
        }
    }
}
