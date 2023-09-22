import Game from "../../model/Game/Game.js";


export default function playerEffectsHandler({ currPlayer, clear }){
    if(clear){
        clearFilter(currPlayer);
        return;
    }
    damagedHandler(currPlayer);
    healingHandler(currPlayer);
}

function damagedHandler(currPlayer){
    if (currPlayer.immunity < 50) {
        currPlayer.immunity++;
    }
    if (currPlayer.immunity <= 5) {
        Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)');
    }
}

function healingHandler(currPlayer){
    if(currPlayer.healing > 0){
        currPlayer.healing -= 1;

        const { ctx } = Game.getInstance();

        Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%)');

        ctx.strokeStyle = 'rgb(0, 255, 0)';
        ctx.lineWidth = (currPlayer.healing / 3) * 3;
        ctx.save();
        ctx.translate(currPlayer.centerPosition.x - 15, currPlayer.centerPosition.y - 30);
        ctx.rotate(Math.PI / 4);
        // ctx.translate((this.width - this.hitbox.x) / 2, (this.width - this.hitbox.x) / 2);
        ctx.strokeRect(
            10,
            -15,
            currPlayer.width - currPlayer.hitbox.x,
            currPlayer.width - currPlayer.hitbox.x,
        );
        ctx.restore();
    }
}

function clearFilter(currPlayer){
    if (currPlayer.immunity <= 5 || currPlayer.healing >= 0) {
        Game.getInstance().setFilter('none');
    }
}
