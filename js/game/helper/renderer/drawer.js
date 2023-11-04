import Game from '../../model/Game/Game.js';

export function drawRotated({ canvas, img, angle, position, mirrored, size }) {
    const ctx = canvas || Game.getInstance().ctx;
    const scale = size || 2;
    ctx.save();
    if (mirrored) {
        ctx?.translate(position.x, position.y);
        ctx.rotate(angle);
        ctx.scale(-1, 1);
        ctx?.translate(-(img.width / 2) * scale, -(img.height / 2) * scale);
        ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
    } else {
        ctx?.translate(position.x, position.y);
        ctx.rotate(angle + Math.PI);
        ctx?.translate(-(img.width / 2) * scale, -(img.width / 2) * scale);
        ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
    }
    ctx.restore();
}

export function drawMirroredY({ canvas, img, position, width, height, translate = false }) {
    const ctx = Game.getInstance().ctx || canvas;
    const widthM = width || img.width * 2;
    const heightM = height || img.height * 2;
    ctx.save();
    if (translate) {
        ctx.translate(-widthM / 2, -heightM / 2);
    }
    ctx?.translate(img.width * 2, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, -position.x, position.y, widthM, heightM);
    ctx.restore();
}

export function drawImage({ img, x, y, width, height, translate = false, mirrored = false }) {
    const { ctx } = Game.getInstance();
    if (translate) {
        ctx.translate(-width / 2, -height / 2);
    }
    if (mirrored) {
        drawLeft(img, x, y, width, height);
    } else {
        drawRight(img, x, y, width, height);
    }
    if (translate) {
        ctx.translate(width / 2, height / 2);
    }
}

export function drawImageFromBottom({ img, x, y, width, height, mirrored = false }) {
    if (mirrored) {
        drawLeftBottom(img, x, y, width, height);
    } else {
        drawRightBottom(img, x, y, width, height);
    }
}

function drawRight(img, x, y, width, height) {
    const { ctx } = Game.getInstance();
    ctx.drawImage(img, x, y, width, height);
}

function drawRightBottom(img, x, y, width, height) {
    const { ctx } = Game.getInstance();
    ctx.translate(0, -height);
    ctx.drawImage(img, x, y, width, height);
    ctx.translate(0, height);
}

function drawLeft(img, x, y, width, height) {
    const { ctx } = Game.getInstance();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, -x, y, width, height);
    ctx.scale(-1, 1);
    ctx.translate(-width, 0);
}

function drawLeftBottom(img, x, y, width, height) {
    const { ctx } = Game.getInstance();
    ctx.translate(0, -height);
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, -x, y, width, height);
    ctx.scale(-1, 1);
    ctx.translate(-width, 0);
    ctx.translate(0, height);
}

export function drawImageCropped({ img, imgX, imgY, imgWidth, imgHeight, x, y, width, height }) {
    const { ctx } = Game.getInstance();

    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight, x, y, width, height);
}
