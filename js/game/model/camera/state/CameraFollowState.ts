import CameraBaseState from './CameraBaseState.js';
import Camera from '../Camera';

export default class CameraFollowState extends CameraBaseState {
    updateState(camera: Camera) {
        camera.moveCamera();

        camera.cameraBox.update();
    }
}
