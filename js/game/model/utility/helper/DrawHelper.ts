import { Box } from '../interfaces/Box.js';
import { Vector } from '../interfaces/Vector.js';

export default class DrawHelper {
    private static ctx: CanvasRenderingContext2D;

    public static setDefaultContext(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public static setTranslate(position: Vector, ctx: CanvasRenderingContext2D = this.ctx) {
        ctx.translate(position.x, position.y);
    }

    public static setFillStyle(style: string, ctx: CanvasRenderingContext2D = this.ctx) {
        ctx.fillStyle = style;
    }

    public static drawRectangle(box: Box, ctx: CanvasRenderingContext2D = this.ctx) {
        ctx.fillRect(box.x, box.y, box.w, box.h);
    }

    public static drawImageCropped(img: HTMLImageElement, imageBox: Box, drawBox: Box) {
        this.ctx.drawImage(img, imageBox.x, imageBox.y, imageBox.w, imageBox.h, drawBox.x, drawBox.y, drawBox.w, drawBox.h);
    }

    public static drawImageFromBottom(img: HTMLImageElement, imageBox: Box, mirrored = false) {
        if (mirrored) {
            this.drawLeftBottom(img, imageBox);
        } else {
            this.drawRightBottom(img, imageBox);
        }
    }

    public static drawImage(img: HTMLImageElement, imageBox: Box, translate = false, mirrored = false) {
        if (translate) {
            this.ctx.translate(-imageBox.w / 2, -imageBox.h / 2);
        }
        if (mirrored) {
            this.drawLeft(img, imageBox);
        } else {
            this.drawRight(img, imageBox);
        }
        if (translate) {
            this.ctx.translate(imageBox.w / 2, imageBox.h / 2);
        }
    }

    public static drawRotated(img: HTMLImageElement, imageBox: Box, angle = 0, mirrored = false, canvas: CanvasRenderingContext2D | null = null) {
        const ctx = canvas || this.ctx;
        ctx.save();
        if (mirrored) {
            ctx?.translate(imageBox.x, imageBox.y);
            ctx.rotate(angle);
            ctx.scale(-1, 1);
            ctx?.translate(-(imageBox.w / 2), -(imageBox.h / 2));
            ctx.drawImage(img, 0, 0, imageBox.w, imageBox.h);
        } else {
            ctx?.translate(imageBox.x, imageBox.y);
            ctx.rotate(angle + Math.PI);
            ctx?.translate(-(imageBox.w / 2), -(imageBox.h / 2));
            ctx.drawImage(img, 0, 0, imageBox.w, imageBox.h);
        }
        ctx.restore();
    }

    public static drawRotatedRay(img: HTMLImageElement, imageBox: Box, angle = 0) {
        this.ctx.save();
        this.ctx.translate(imageBox.x, imageBox.y);
        this.ctx.rotate(angle + Math.PI);
        this.ctx.translate(-(imageBox.w / 2), -(imageBox.w / 2));
        this.ctx.drawImage(img, 0, 0, imageBox.w, imageBox.h);
        this.ctx.restore();
    }

    private static drawLeftBottom(img: HTMLImageElement, imageBox: Box) {
        this.ctx.translate(0, -imageBox.h);
        this.ctx.translate(imageBox.w, 0);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(img, -imageBox.x, imageBox.y, imageBox.w, imageBox.h);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-imageBox.w, 0);
        this.ctx.translate(0, imageBox.h);
    }

    private static drawRightBottom(img: HTMLImageElement, imageBox: Box) {
        this.ctx.translate(0, -imageBox.h);
        this.ctx.drawImage(img, imageBox.x, imageBox.y, imageBox.w, imageBox.h);
        this.ctx.translate(0, imageBox.h);
    }

    private static drawRight(img: HTMLImageElement, imageBox: Box) {
        this.ctx.drawImage(img, imageBox.x, imageBox.y, imageBox.w, imageBox.h);
    }

    private static drawLeft(img: HTMLImageElement, imageBox: Box) {
        this.ctx.translate(imageBox.w, 0);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(img, -imageBox.x, imageBox.y, imageBox.w, imageBox.h);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-imageBox.w, 0);
    }
}
