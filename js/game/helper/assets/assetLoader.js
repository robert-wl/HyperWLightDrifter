import LoadingModal from '../../model/htmlElements/LoadingModal.js';
import Game from '../../model/Game/Game.js';

export const assetList = {};

const colors = {
    default: [
        [197, 60, 84],
        [213, 108, 98],
        [187, 0, 41],
        [101, 14, 57],
        [166, 212, 52],
    ],
    dark: [
        [26, 8, 32], // 1
        [61, 20, 69],
        [105, 30, 116], //3
        [35, 35, 35],
        [213, 85, 24],
    ],
    yellow: [
        [249, 171, 9],
        [247, 199, 10],
        [21, 21, 21],
        [68, 23, 9],
        [70, 85, 255],
    ],
};

export async function assetLoader(assetData) {
    let assets = [];
    let assetAmount = 0;
    let counter = 0;

    LoadingModal.open();
    assetData.forEach((assetD) => {
        assets = [...assets, ...assetD];
    });

    for (const image of assets) {
        const { amount } = image;
        if (amount) {
            assetAmount += amount;
            continue;
        }
        assetAmount++;
    }

    for (const asset of assetData) {
        const { amount } = asset;
        if (amount) {
            assetAmount += amount;
            continue;
        }
        assetAmount++;
    }

    for (const { ref, name, amount, outfit, isAudio } of assets) {
        if (isAudio) {
            if (amount) {
                for (let i = 1; i <= amount; i++) {
                    const refNumbered = `${ref.split('.')[0]}_${i}.${ref.split('.')[1]}`;
                    const nameNumbered = `${name}_${i}`;
                    LoadingModal.editText(nameNumbered);
                    await loadAudio({
                        ref: refNumbered,
                        name: nameNumbered,
                    });
                    LoadingModal.editCounter(++counter + '/' + assetAmount);
                }
                continue;
            }

            LoadingModal.editText(name);
            await loadAudio({ ref, name });
            LoadingModal.editCounter(++counter + '/' + assetAmount);

            continue;
        }
        if (amount) {
            for (let i = 1; i <= amount; i++) {
                const refNumbered = `${ref.split('.')[0]}_${i}.png`;
                const nameNumbered = `${name}_${i}`;
                LoadingModal.editText(nameNumbered);
                await loadImage({
                    ref: refNumbered,
                    name: nameNumbered,
                    outfit: outfit,
                });
                LoadingModal.editCounter(++counter + '/' + assetAmount);
            }
            continue;
        }

        LoadingModal.editText(name);
        await loadImage({ ref, name, outfit });
        LoadingModal.editCounter(++counter + '/' + assetAmount);
    }

    LoadingModal.close();
}

async function loadAudio({ ref, name }) {
    assetList[name] = await new Promise((resolve, reject) => {
        let audio = new Audio();
        audio.src = '../assets/audio/' + ref;
        audio.oncanplaythrough = () => {
            resolve(audio);
            console.log('dah ke loaddd woioiii');
        };
        audio.onerror = () => {
            reject();
        };
        console.log('waduh');
    });
}

async function loadImage({ ref, name, outfit }) {
    assetList[name] = await new Promise((resolve, reject) => {
        let img = new Image();
        img.src = '../assets/' + ref;
        img.onload = () => {
            if (outfit && Game.getInstance().player.outfit !== 'default') {
                if (img instanceof HTMLImageElement) {
                    img = replaceOutfitColor(img);
                }
            }
            resolve(img);
        };
        img.onerror = () => {
            reject();
        };
    });
}

async function replaceOutfitColor(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //
    const defaultColor = colors.default;
    //
    const color = colors[Game.getInstance().player.outfit];

    const pixel = imageData.data;
    for (let i = 0; i < pixel.length; i += 4) {
        for (let j = 0; j < defaultColor.length; j++) {
            if (getEqualPixel(defaultColor[j], pixel, i)) {
                imageData.data[i] = color[j][0];
                imageData.data[i + 1] = color[j][1];
                imageData.data[i + 2] = color[j][2];
            }
        }
    }
    //
    ctx.putImageData(imageData, 0, 0);
    image.src = canvas.toDataURL('image/png');

    return image;
}

function getEqualPixel(color, pixel, i) {
    return pixel[i] === color[0] && pixel[i + 1] === color[1] && pixel[i + 2] === color[2];
}
