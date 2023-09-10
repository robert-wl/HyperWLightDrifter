import Game from "../../model/Game/Game.js";


export default function enemyCollision({ position }) {
    const enemies = Game.getInstance().enemyList;

    for (const enemy of enemies) {
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
