import { assetList } from './assetLoader.js';

export function getImage(name) {
    return assetList[name];
}

export function getNumberedImage(name, number) {
    return assetList[`${name}_${number}`];
}
