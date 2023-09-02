import Game from "../model/Game.js";


export default function handleEnemyCollision({ position }) {
    const enemies = Game.getInstance().enemyList;

    for (const enemy of enemies) {
        if (enemy.currState === enemy.dieState) {
            continue;
        }

        // console.log(enemy.position.x + enemy.hitbox.x)
        // console.log(enemy.position.x + enemy.width - enemy.hitbox.w)
        //
        // console.log(position.x)
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
