import CameraBaseState from './CameraBaseState.js';
import Camera from '../Camera';

export default class CameraNormalState extends CameraBaseState {
    updateState(camera: Camera) {
        camera.moveCamera();

        camera.cameraBox.update();
    }
}
