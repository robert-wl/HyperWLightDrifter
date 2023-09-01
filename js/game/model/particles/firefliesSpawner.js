import Fireflies from "./Fireflies.js";


let number = 0;

export default function firefliesSpawner(){
    number++;
    if(number % 3 === 0) {
        Fireflies.generate();
    }
}
