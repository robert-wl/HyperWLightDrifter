import CameraBaseState from './CameraBaseState.js';
export default class CameraNormalState extends CameraBaseState {
    updateState(camera) {
        camera.moveCamera();
        camera.cameraBox.update();
    }
    enterState() { }
    exitState() { }
}
