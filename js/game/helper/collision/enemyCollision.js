import Game from '../../model/Game/Game.js';

export default function enemyCollision({ position }) {
    const { enemyList, bossEntities, boss } = Game.getInstance().enemyManager;

    for (const enemy of enemyList) {
        if (enemy.currState === enemy.dieState) {
            continue;
        }

        if (enemy.position.x + enemy.hitbox.x < position.x && enemy.position.x + enemy.width / 2 - enemy.hitbox.w > position.x && enemy.position.y + enemy.hitbox.y < position.y && enemy.position.y + enemy.height / 2 - enemy.hitbox.h > position.y) {
            return enemy;
        }
    }

    for (const entity of bossEntities) {
        if (entity.currState === entity.dieState) {
            continue;
        }

        if (entity.position.x + entity.hitbox.x < position.x && entity.position.x + entity.width / 2 - entity.hitbox.w > position.x && entity.position.y + entity.hitbox.y < position.y && entity.position.y + entity.height / 2 - entity.hitbox.h > position.y) {
            return entity;
        }
    }

    if (boss) {
        if (boss.currState === boss.deathState || boss.currState === boss.bombState) {
            return null;
        }

        if (boss.position.x + boss.hitbox.x < position.x && boss.position.x + boss.width / 2 - boss.hitbox.w > position.x && boss.position.y + boss.hitbox.y < position.y && boss.position.y + boss.height / 2 - boss.hitbox.h > position.y) {
            return boss;
        }
    }
}
