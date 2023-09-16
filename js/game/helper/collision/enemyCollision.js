import EnemyManager from "../../model/enemy/EnemyManager.js";


export default function enemyCollision({ position }) {
    const { enemyList } = EnemyManager.getInstance();

    for (const enemy of enemyList) {
        if (enemy.currState === enemy.dieState) {
            continue;
        }

        if (
            enemy.position.x + enemy.hitbox.x < position.x &&
            enemy.position.x + enemy.width - enemy.hitbox.w > position.x &&
            enemy.position.y + enemy.hitbox.y < position.y &&
            enemy.position.y + enemy.height - enemy.hitbox.h > position.y
        ) {
            return enemy;
        }
    }
}
