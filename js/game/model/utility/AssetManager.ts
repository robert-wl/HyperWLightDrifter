import Game from '../game/Game.js';
import GameSettings from '../../constants.js';
import HTMLHandlers from '../htmlElements/HTMLHandlers.js';

export default class AssetManager {
    private static colors = GameSettings.GAME.COLOR;
    private static htmlHandler: HTMLHandlers;
    private static counter: number;
    private static assetAmount: number;
    private static assetList: Map<string, HTMLImageElement | HTMLAudioElement> = new Map();

    private constructor() {
        //
    }

    public static setHTMLHandler(htmlHandler: HTMLHandlers) {
        this.htmlHandler = htmlHandler;
    }

    public static getImage(name: string): HTMLImageElement {
        return <HTMLImageElement>this.assetList.get(name);
    }

    public static getNumberedImage(name: string, number: number): HTMLImageElement {
        return <HTMLImageElement>this.assetList.get(`${name}_${number}`);
    }

    public static async assetLoader(assetData: Asset[][]) {
        this.assetAmount = 0;
        this.counter = 0;
        let assets: Asset[] = [];

        this.htmlHandler.notify('loadingModal:open');
        assetData.forEach((assetD) => {
            assets = [...assets, ...assetD];
        });

        for (const image of assets) {
            const { amount } = image;
            if (amount) {
                this.assetAmount += amount;
                continue;
            }
            this.assetAmount++;
        }

        for (const asset of assets) {
            if (asset.isAudio) {
                await this.assetLoadAudio(asset);
                continue;
            }
            await this.assetLoadImage(asset);
        }

        this.htmlHandler.notify('loadingModal:close');
    }

    public static async loadImage({ ref, name, outfit }: Asset) {
        const data: HTMLImageElement = await new Promise((resolve, reject) => {
            let img = new Image();
            img.src = '../assets/' + ref;
            img.onload = () => {
                if (outfit && Game.getInstance().player.outfit !== 'default') {
                    if (img instanceof HTMLImageElement) {
                        img = this.replaceOutfitColor(img);
                    }
                }
                resolve(img);
            };
            img.onerror = () => {
                reject();
            };
        });

        this.assetList.set(name, data);
    }

    public static replaceOutfitColor(image: HTMLImageElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const defaultColor = this.colors.default;
        const color = this.colors[Game.getInstance().player.outfit];

        const pixel = imageData.data;
        for (let i = 0; i < pixel.length; i += 4) {
            for (let j = 0; j < defaultColor.length; j++) {
                if (this.getEqualPixel(defaultColor[j], pixel, i)) {
                    imageData.data[i] = color[j][0];
                    imageData.data[i + 1] = color[j][1];
                    imageData.data[i + 2] = color[j][2];
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
        image.src = canvas.toDataURL('image/png');

        return image;
    }

    private static async assetLoadImage({ ref, name, amount, outfit }: Asset) {
        if (amount) {
            for (let i = 1; i <= amount; i++) {
                const refNumbered = `${ref.split('.')[0]}_${i}.png`;
                const nameNumbered = `${name}_${i}`;
                this.htmlHandler.notify('loadingModal:editText', nameNumbered);
                await this.loadImage({
                    ref: refNumbered,
                    name: nameNumbered,
                    outfit: outfit,
                });
                this.htmlHandler.notify('loadingModal:editCounter', ++this.counter + '/' + this.assetAmount);
            }
            return;
        }

        this.htmlHandler.notify('loadingModal:editText', name);
        await this.loadImage({ ref, name, outfit });
        this.htmlHandler.notify('loadingModal:editCounter', ++this.counter + '/' + this.assetAmount);
    }

    private static async assetLoadAudio({ ref, name, amount }: Asset) {
        if (amount) {
            for (let i = 1; i <= amount; i++) {
                const refNumbered = `${ref.split('.')[0]}_${i}.${ref.split('.')[1]}`;
                const nameNumbered = `${name}_${i}`;
                this.htmlHandler.notify('loadingModal:editText', nameNumbered);

                await this.loadAudio({
                    ref: refNumbered,
                    name: nameNumbered,
                });

                this.htmlHandler.notify('loadingModal:editCounter', ++this.counter + '/' + this.assetAmount);
            }
            return;
        }

        this.htmlHandler.notify('loadingModal:editText', name);
        await this.loadAudio({ ref, name });
        this.htmlHandler.notify('loadingModal:editCounter', ++this.counter + '/' + this.assetAmount);
    }

    private static async loadAudio({ ref, name }: Asset) {
        const data: HTMLAudioElement = await new Promise((resolve, reject) => {
            let audio = new Audio();
            audio.src = '../assets/audio/' + ref;
            audio.oncanplaythrough = () => {
                resolve(audio);
            };
            audio.onerror = () => {
                reject();
            };
        });

        this.assetList.set(name, data);
    }

    private static getEqualPixel(color: number[], pixel: Uint8ClampedArray, i: number) {
        return pixel[i] === color[0] && pixel[i + 1] === color[1] && pixel[i + 2] === color[2];
    }
}
