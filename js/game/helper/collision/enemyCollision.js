import Game from "../../model/Game/Game.js";


export default function enemyCollision({ position }) {
    const { enemyList } = Game.getInstance().enemyManager;

    for (const enemy of enemyList) {
        if (enemy.currState === enemy.dieState) {
            continue;
        }

        if (
            enemy.position.x + enemy.hitbox.x < position.x &&
            enemy.position.x + enemy.width / 2 - enemy.hitbox.w > position.x &&
            enemy.position.y + enemy.hitbox.y < position.y &&
            enemy.position.y + enemy.height / 2 - enemy.hitbox.h > position.y
        ) {
            return enemy;
        }
    }
}
