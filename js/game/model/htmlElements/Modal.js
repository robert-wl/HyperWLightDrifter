import AudioPlayer from "../../../audio/AudioPlayer.js";


export default class Modal {
    static modal = null;
    static open() {
        this.modal.css('display', 'flex').css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%');

        AudioPlayer.getInstance().playSound({
            sound: 'menu/action.wav',
        });
    }

    static close() {
        this.modal.css('display', 'none');
    }
}
