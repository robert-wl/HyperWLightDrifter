import GameBaseState from './GameBaseState.js';
import EndingVideo from '../../htmlElements/EndingVideo.js';
import Game from '../Game';

export default class GameEndState extends GameBaseState {
    enterState(game: Game) {
        EndingVideo.open();
        EndingVideo.handleClose();
        localStorage.setItem('finished', 'true');
    }

    exitState(game: Game) {
        EndingVideo.close();
        $('#opening-screen').attr('src', '../assets/ui/start_end.png').css('animation', 'fadeIn 0.5s ease-in-out');
    }
}
