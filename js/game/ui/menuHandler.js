import AudioPlayer from '../../audio/AudioPlayer.js';
import ParticlesManager from '../model/particles/ParticlesManager.js';
import Game from '../model/Game/Game.js';

const playerSelectImages = ['../assets/ui/player_select/player-red.png', '../assets/ui/player_select/player-dark.png', '../assets/ui/player_select/player-yellow.png'];

let selected = 0;
export default function menuHandler() {
    $('.settings').on('mousedown', () => {
        AudioPlayer.getInstance()
            .playSound({
                sound: 'menu/action.wav',
            })
            .then();

        $('#menu-modal').css('display', 'none');
        $('#settings-modal').css('display', 'flex').css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%');
    });

    audioHandler();
    selectScreenHandler();
}

function audioHandler() {
    $('.hoverable').on('mouseenter', () => {
        AudioPlayer.getInstance()
            .playSound({
                sound: 'menu/move.wav',
            })
            .then();
    });

    $('.clickable').on('mousedown', () => {
        AudioPlayer.getInstance()
            .playSound({
                sound: 'menu/move.wav',
            })
            .then();
    });
}

function selectScreenHandler() {
    arrowKeysHandler();

    const playButton = $('#play-button');
    const openingScreen = $('#opening-screen');
    const selectionModal = $('#selection-modal');

    playButton.on('mousedown', () => {
        AudioPlayer.getInstance()
            .playSound({
                sound: 'menu/action.wav',
            })
            .then();

        selectionModal.css('display', 'none');
        openingScreen
            .css('opacity', '0')
            .css('animation', 'fadeOut 2s ease-in-out')
            .on('animationend', async () => {
                openingScreen.css('display', 'none');
                Game.getInstance().playGame(selected).then();
                removeMenuHandler();
            });

        ParticlesManager.getInstance().clear();
    });
}

function arrowKeysHandler() {
    $('#arrow-left').on('mousedown', () => {
        if (selected === 0) {
            selected = 2;
        } else {
            selected -= 1;
        }
        $('#player-preview').attr('src', playerSelectImages[selected]);
    });

    $('#arrow-right').on('mousedown', () => {
        if (selected === 2) {
            selected = 0;
        } else {
            selected += 1;
        }
        $('#player-preview').attr('src', playerSelectImages[selected]);
    });
}

function removeMenuHandler() {
    $('#HUD').off('mousedown');
    $('.new-game').off('mousedown');
    $('#cancel-button').off('mousedown');
    $('.hoverable').off('mouseenter');
    $('.clickable').off('mousedown');
    $('#play-button').off('mousedown');
    $('#arrow-left').off('mousedown');
    $('#arrow-right').off('mousedown');
    $('#opening-screen').off('animationend');
}
