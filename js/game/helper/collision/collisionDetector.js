export default function collisionDetector({ stage, position, number, type }) {
    if(stage === 1) {
        return stageOneDetector({ position, number, type });
    }
    return number;
}

//
const objects = [
    {
        x: 316,
        y: 800,
        width: 294,
        height: 635,
    }
]

// 316 800 -
//         - 610 1435

function stageOneDetector({ position, number, type}){
    if(number < 0) {
        if(type === "x") {
            if(objects.some(obj => obj.x + obj.width > position.x + number)) {
                return 0;
            }
        }
    }
    // if(number > 0) {
    //     if(type === "x") {
    //         if(position.x + number > 1190) {
    //             return 0;
    //         }
    //     }
    //     if(type === "y") {
    //         if(position.y + number > 1435) {
    //             return 0;
    //         }
    //     }
    // }
    // if(number < 0) {
    //     if(type === "x") {
    //         if(position.x + number < 610) {
    //             return 0;
    //         }
    //     }
    //     if(type === "y") {
    //         if(position.y + number < 990 && (position.x < 845 || position.x > 950)) {
    //             return 0;
    //         }
    //     }
    // }
    return number;
}
