
const images = [];
export async function imageLoader(imageData){
    for(const {ref, name} of imageData){
        images[name] = await new Promise((resolve, reject) => {
            const img = new Image();
            img.src = '../assets/' + ref;
            img.onload = () => {
                resolve(img);
            };
            img.onerror = () => {
                reject();
            };
        });
    }
}

export function getImage(name){
    return images[name];
}
