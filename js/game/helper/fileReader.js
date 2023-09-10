import Player from "../model/player/Player.js";
import Game from "../model/Game/Game.js";


const imageCache = {};

export function get_image(directory, name, num, callback){
    let imageName = `${name}_${num}`;
    if(num === null) imageName = name;
    if(imageCache[`${imageName}`]) {
        callback(imageCache[`${imageName}`]);
    } else {
        const image = new Image();
        image.src = `../assets/${directory}/${imageName}.png`;

        image.onload = function () {
            // const canvas = document.createElement('canvas');
            // const ctx = canvas.getContext('2d');
            // canvas.width = image.width;
            // canvas.height = image.height;
            //
            // ctx.drawImage(image, 0, 0);
            //
            // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // const data = imageData.data;
            //
            // const targetColor = [
            //     { r: 187, g: 0, b: 41 },
            //     { r: 213, g: 108, b: 98 },
            //     { r: 197, g: 60, b: 84 },
            // ];
            //
            // const replacementColor = [
            //     { r: 40, g: 81, b: 100 },
            //     { r: 39, g: 35, b: 46 },
            //     { r: 0, g: 0, b: 0 },
            // ];
            //
            // for (let i = 0; i < data.length; i += 4) {
            //     const r = data[i];
            //     const g = data[i + 1];
            //     const b = data[i + 2];
            //
            //     for(let j = 0; j < targetColor.length; j++) {
            //         if (r === targetColor[j].r && g === targetColor[j].g && b === targetColor[j].b) {
            //             data[i] = replacementColor[j].r;
            //             data[i + 1] = replacementColor[j].g;
            //             data[i + 2] = replacementColor[j].b;
            //         }
            //     }
            // }
            //
            // ctx.putImageData(imageData, 0, 0);
            //
            // const modifiedImage = new Image();
            // modifiedImage.src = canvas.toDataURL();
            imageCache[`${imageName}`] = image;
            callback(image);
        }
    }
}
