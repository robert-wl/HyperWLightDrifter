

export default function getEntityOnAttack({ entity, player }) {

    // tx.arc(currPlayer.position.x + playerOffset.x, currPlayer.position.y + playerOffset.y, 100, currPlayer.lookAngle - Math.PI / 3, currPlayer.lookAngle + Math.PI / 3, false);
    // ctx.lineTo(currPlayer.position.x + playerOffset.x, currPlayer.position.y + playerOffset.y);

    for(const enemy of entity) {
        const dx = player.position.x - (enemy.position.x + enemy.width / 2);
        const dy = player.position.y - (enemy.position.y + enemy.height / 2);

        const angle = (Math.atan2(dy, dx) + 4 * Math.PI) % (2 * Math.PI);
        const lookAngle = (player.lookAngle + 5 * Math.PI) % (2 * Math.PI);
        if(!(angle >= lookAngle - Math.PI / 3 && angle <= lookAngle + Math.PI / 3)) {
            return;
        }

        const absdl = Math.sqrt(dx * dx + dy * dy);
        if(!(absdl <= 125)) {
            return;
        }
        enemy.health -= 1;
    }
}
