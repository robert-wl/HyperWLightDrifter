const images = {};
export async function imageLoader(imageData) {
    for (const { ref, name, amount } of imageData) {
        if (amount) {
            for (let i = 1; i <= amount; i++) {
                const refNumbered = `${ref.split('.')[0]}_${i}.png`;
                const nameNumbered = `${name}_${i}`;
                await loadImage({
                    ref: refNumbered,
                    name: nameNumbered,
                });
            }
        } else {
            await loadImage({ ref, name });
        }
    }
}

async function loadImage({ ref, name }) {
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

export function getImage(name) {
    return images[name];
}

export function getNumberedImage(name, number) {
    return images[`${name}_${number}`];
}
