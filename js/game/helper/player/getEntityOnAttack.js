import Game from '../../model/Game/Game.js';
import EnemyManager from '../../model/enemy/EnemyManager.js';

export default function getEntityOnAttack({ player }) {
    const { bossEntities } = Game.getInstance();
    const { enemyList } = EnemyManager.getInstance();

    for (const enemy of enemyList) {
        if (enemy.health <= 0) {
            continue;
        }
        checkCollision(enemy);
    }

    for (const enemy of bossEntities) {
        checkCollision(enemy);
    }
}

function checkCollision(enemy) {
    const { player } = Game.getInstance();
    const enemyX1 = enemy.position.x + enemy.hitbox.x;
    const enemyX2 = enemy.position.x + enemy.hitbox.x + enemy.width - enemy.hitbox.w;
    const enemyY1 = enemy.position.y + enemy.hitbox.y;
    const enemyY2 = enemy.position.y + enemy.hitbox.y + enemy.height - enemy.hitbox.h;

    const playerX1 = player.attackBox.x;
    const playerX2 = player.attackBox.x + player.attackBox.w;
    const playerY1 = player.attackBox.y;
    const playerY2 = player.attackBox.y + player.attackBox.h;

    if (enemyX1 < playerX2 && enemyX2 > playerX1 && enemyY1 < playerY2 && enemyY2 > playerY1) {
        enemy.damage({
            amount: 1,
            angle: player.lookAngle,
        });

        if (player.bullets < 3) {
            player.bullets++;
        }
    }
}
