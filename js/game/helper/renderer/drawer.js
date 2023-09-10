import Game from "../../model/Game/Game.js";

export function drawRotated({ canvas, img, angle, position, mirrored, size }) {
    const ctx = Game.getInstance().ctx || canvas;
    const scale = size || 2;
    ctx.save();
    if(mirrored) {
        ctx?.translate(position.x, position.y);
        ctx.rotate(angle);
        ctx.scale(-1, 1);
        ctx?.translate(-img.width, -img.height);
        ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
    }
    else {
        ctx?.translate(position.x, position.y);
        ctx.rotate(angle + Math.PI);
        ctx?.translate(-img.width, -img.height);
        ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
    }
    ctx.restore();
}

export function drawMirroredY({ canvas, img, position, width, height }) {
    const ctx = Game.getInstance().ctx || canvas;
    const widthM = width || img.width * 2;
    const heightM = height || img.height * 2;
    ctx.save();
    ctx?.translate(img.width * 2, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, -position.x, position.y, widthM, heightM);
    ctx.restore();
}

export function drawImage({ img, x, y, width, height }) {
    const ctx = Game.getInstance().ctx;
    ctx.drawImage(img, x, y, width, height);
}
