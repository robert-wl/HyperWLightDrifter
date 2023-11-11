export default class DrawHelper {
    static setDefaultContext(ctx) {
        this.ctx = ctx;
    }
    static setTranslate(position, ctx = this.ctx) {
        ctx.translate(position.x, position.y);
    }
    static setFillStyle(style, ctx = this.ctx) {
        ctx.fillStyle = style;
    }
    static drawRectangle(box, ctx = this.ctx) {
        ctx.fillRect(box.x, box.y, box.w, box.h);
    }
    static drawImageCropped(img, imageBox, drawBox) {
        this.ctx.drawImage(img, imageBox.x, imageBox.y, imageBox.w, imageBox.h, drawBox.x, drawBox.y, drawBox.w, drawBox.h);
    }
    static drawImageFromBottom(img, imageBox, mirrored = false) {
        if (mirrored) {
            this.drawLeftBottom(img, imageBox);
        }
        else {
            this.drawRightBottom(img, imageBox);
        }
    }
    static drawImage(img, imageBox, translate = false, mirrored = false) {
        if (translate) {
            this.ctx.translate(-imageBox.w / 2, -imageBox.h / 2);
        }
        if (mirrored) {
            this.drawLeft(img, imageBox);
        }
        else {
            this.drawRight(img, imageBox);
        }
        if (translate) {
            this.ctx.translate(imageBox.w / 2, imageBox.h / 2);
        }
    }
    static drawRotated(img, imageBox, angle = 0, mirrored = false, canvas = null) {
        const ctx = canvas || this.ctx;
        ctx.save();
        if (mirrored) {
            ctx === null || ctx === void 0 ? void 0 : ctx.translate(imageBox.x, imageBox.y);
            ctx.rotate(angle);
            ctx.scale(-1, 1);
            ctx === null || ctx === void 0 ? void 0 : ctx.translate(-(imageBox.w / 2), -(imageBox.h / 2));
            ctx.drawImage(img, 0, 0, imageBox.w, imageBox.h);
        }
        else {
            ctx === null || ctx === void 0 ? void 0 : ctx.translate(imageBox.x, imageBox.y);
            ctx.rotate(angle + Math.PI);
            ctx === null || ctx === void 0 ? void 0 : ctx.translate(-(imageBox.w / 2), -(imageBox.h / 2));
            ctx.drawImage(img, 0, 0, imageBox.w, imageBox.h);
        }
        ctx.restore();
    }
    static drawRotatedRay(img, imageBox, angle = 0) {
        this.ctx.save();
        this.ctx.translate(imageBox.x, imageBox.y);
        this.ctx.rotate(angle + Math.PI);
        this.ctx.translate(-(imageBox.w / 2), -(imageBox.w / 2));
        this.ctx.drawImage(img, 0, 0, imageBox.w, imageBox.h);
        this.ctx.restore();
    }
    static drawLeftBottom(img, imageBox) {
        this.ctx.translate(0, -imageBox.h);
        this.ctx.translate(imageBox.w, 0);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(img, -imageBox.x, imageBox.y, imageBox.w, imageBox.h);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-imageBox.w, 0);
        this.ctx.translate(0, imageBox.h);
    }
    static drawRightBottom(img, imageBox) {
        this.ctx.translate(0, -imageBox.h);
        this.ctx.drawImage(img, imageBox.x, imageBox.y, imageBox.w, imageBox.h);
        this.ctx.translate(0, imageBox.h);
    }
    static drawRight(img, imageBox) {
        this.ctx.drawImage(img, imageBox.x, imageBox.y, imageBox.w, imageBox.h);
    }
    static drawLeft(img, imageBox) {
        this.ctx.translate(imageBox.w, 0);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(img, -imageBox.x, imageBox.y, imageBox.w, imageBox.h);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-imageBox.w, 0);
    }
}
