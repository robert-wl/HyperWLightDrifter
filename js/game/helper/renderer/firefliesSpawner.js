import Fireflies from "../../model/particles/Fireflies.js";


let number = 0;

export default function firefliesSpawner(){
    number++;
    if(number % 2 === 0) {
        Fireflies.generate();
    }
}
