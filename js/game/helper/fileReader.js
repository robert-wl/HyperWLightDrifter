import Player from "../model/player/Player.js";


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
            imageCache[`${imageName}`] = image;
            callback(image);
        }
    }
}
