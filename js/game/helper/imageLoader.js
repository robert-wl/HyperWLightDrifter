import Game from '../model/Game/Game.js';

const images = {};


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

export async function imageLoader(imageData) {

    let images = [];

    imageData.forEach((imagesD) => {
        images = [...images, ...imagesD];
    });

    for (const { ref, name, amount, outfit } of images) {
        if (amount) {
            for (let i = 1; i <= amount; i++) {
                const refNumbered = `${ref.split('.')[0]}_${i}.png`;
                const nameNumbered = `${name}_${i}`;
                await loadImage({
                    ref: refNumbered,
                    name: nameNumbered,
                    outfit: outfit,
                });
            }
        } else {
            await loadImage({ ref, name, outfit });
        }
    }
}

async function loadImage({ ref, name, outfit }) {
    images[name] = await new Promise((resolve, reject) => {
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

export function getImage(name) {
    return images[name];
}

export function getNumberedImage(name, number) {
    return images[`${name}_${number}`];
}

async function replaceOutfitColor(image) {
    //i want to replace a certain color with another color
    // make me a function
    // return;
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
    // console.log(pixel[i], color[0])
    return pixel[i] === color[0] && pixel[i + 1] === color[1] && pixel[i + 2] === color[2];
}
