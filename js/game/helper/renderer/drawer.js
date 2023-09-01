export function drawRotated({ canvas, img, angle, position }) {
    canvas.save();
    canvas?.translate(position.x, position.y);
    canvas.rotate(angle + Math.PI);
    canvas?.translate(-img.width, -img.height);
    canvas.drawImage(img, 0, 0, img.width * 2, img.height * 2);
    canvas.restore();
}

export function drawMirroredY({ canvas, img, position, width, height }) {
    const widthM = width || img.width * 2;
    const heightM = height || img.height * 2;
    canvas.save();
    canvas?.translate(img.width * 2, 0);
    canvas.scale(-1, 1);
    canvas.drawImage(img, -position.x, position.y, widthM, heightM);
    canvas.restore();
}
