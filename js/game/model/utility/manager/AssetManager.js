var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Game from '../../game/Game.js';
import GameSettings from '../../../constants.js';
import { Outfit } from '../enums/Outfit.js';
class AssetManager {
    static get assetList() {
        return this._assetList;
    }
    static set assetList(value) {
        this._assetList = value;
    }
    static setHTMLHandler(htmlHandler) {
        this.htmlHandler = htmlHandler;
    }
    static getImage(name) {
        return this._assetList.get(name);
    }
    static getNumberedImage(name, number) {
        return this._assetList.get(`${name}_${number}`);
    }
    static assetLoader(assetData, outfit, show = true) {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading = show;
            this.assetAmount = 0;
            this.counter = 0;
            let assets = [];
            if (this.showLoading)
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
                    yield this.assetLoadAudio(asset);
                    continue;
                }
                yield this.assetLoadImage(asset, outfit);
            }
            console.log(this.assetList);
            if (this.showLoading)
                this.htmlHandler.notify('loadingModal:close');
        });
    }
    static loadImage({ ref, name, isOutfit }, outfit) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield new Promise((resolve, reject) => {
                const img = new Image();
                img.src = '../assets/' + ref;
                img.onload;
                img.onload = () => {
                    resolve(img);
                };
                img.onerror = () => {
                    reject();
                };
            });
            if (isOutfit && outfit !== Outfit.default) {
                data = this.replaceOutfitColor(data);
            }
            this._assetList.set(name, data);
        });
    }
    static replaceOutfitColor(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
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
    static assetLoadImage({ ref, name, amount, isOutfit }, outfit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount) {
                for (let i = 1; i <= amount; i++) {
                    const refNumbered = `${ref.split('.')[0]}_${i}.png`;
                    const nameNumbered = `${name}_${i}`;
                    this.htmlHandler.notify('loadingModal:editText', nameNumbered);
                    yield this.loadImage({
                        ref: refNumbered,
                        name: nameNumbered,
                        isOutfit: isOutfit,
                    }, outfit);
                    this.htmlHandler.notify('loadingModal:editCounter', ++this.counter + '/' + this.assetAmount);
                }
                return;
            }
            this.htmlHandler.notify('loadingModal:editText', name);
            yield this.loadImage({ ref, name, isOutfit }, outfit);
            this.htmlHandler.notify('loadingModal:editCounter', ++this.counter + '/' + this.assetAmount);
        });
    }
    static assetLoadAudio({ ref, name, amount }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount) {
                for (let i = 1; i <= amount; i++) {
                    const refNumbered = `${ref.split('.')[0]}_${i}.${ref.split('.')[1]}`;
                    const nameNumbered = `${name}_${i}`;
                    this.htmlHandler.notify('loadingModal:editText', nameNumbered);
                    yield this.loadAudio({
                        ref: refNumbered,
                        name: nameNumbered,
                    });
                    this.htmlHandler.notify('loadingModal:editCounter', ++this.counter + '/' + this.assetAmount);
                }
                return;
            }
            this.htmlHandler.notify('loadingModal:editText', name);
            yield this.loadAudio({ ref, name });
            this.htmlHandler.notify('loadingModal:editCounter', ++this.counter + '/' + this.assetAmount);
        });
    }
    static loadAudio({ ref, name }) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new Promise((resolve, reject) => {
                let audio = new Audio();
                audio.src = '../assets/audio/' + ref;
                audio.oncanplaythrough = () => {
                    resolve(audio);
                };
                audio.onerror = () => {
                    reject();
                };
            });
            this._assetList.set(name, data);
        });
    }
    static getEqualPixel(color, pixel, i) {
        return pixel[i] === color[0] && pixel[i + 1] === color[1] && pixel[i + 2] === color[2];
    }
}
AssetManager.colors = GameSettings.GAME.COLOR;
AssetManager._assetList = new Map();
export default AssetManager;
