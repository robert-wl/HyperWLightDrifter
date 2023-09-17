import AudioPlayer from '../../audio/AudioPlayer.js';
import ParticlesManager from "../model/particles/ParticlesManager.js";
import Game from "../model/Game/Game.js";

const playerSelectImages = ['../assets/ui/player_select/player-red.png', '../assets/ui/player_select/player-dark.png', '../assets/ui/player_select/player-yellow.png'];

let selected = 0;
export default function menuHandler() {


    $('#HUD').mousedown(() => {
        if ($('#selection-modal').css('display') === 'flex') {
            return;
        }

        if ($('#menu-modal').css('display') === 'none') {
            $('#menu-modal')
                .css('display', 'flex')
                .css('animation', 'fadeIn 0.25s ease-in-out')
                .css('opacity', '100%');

            AudioPlayer.getInstance().playSound({
                sound: 'menu/action.wav'
            });
            return;
        }
        $('#menu-modal').css('display', 'none');
    });


    $('.new-game').mousedown(() => {
        AudioPlayer.getInstance().playSound({
            sound: 'menu/action.wav'
        });
        $('#menu-modal').css('display', 'none');
        $('#selection-modal')
            .css('display', 'flex')
            .css('animation', 'fadeIn 0.25s ease-in-out')
            .css('opacity', '100%');
    });

    $('.settings').mousedown(() => {
        AudioPlayer.getInstance().playSound({
            sound: 'menu/action.wav'
        });

        $('#menu-modal').css('display', 'none');
        $('#settings-modal')
            .css('display', 'flex')
            .css('animation', 'fadeIn 0.25s ease-in-out')
            .css('opacity', '100%');
    });

    $('#cancel-button').mousedown(() => {
        AudioPlayer.getInstance().playSound({
            sound: 'menu/action.wav'
        });
        $('#selection-modal').css('display', 'none');
        $('#menu-modal')
            .css('display', 'flex')
            .css('animation', 'fadeIn 0.25s ease-in-out')
            .css('opacity', '100%');
    });

    audioHandler();
    selectScreenHandler();
}

function audioHandler() {

    $('.hoverable').mouseenter(() => {
        AudioPlayer.getInstance().playSound({
            sound: 'menu/move.wav'
        });
    });

    $('.clickable').mousedown(() => {
        AudioPlayer.getInstance().playSound({
            sound: 'menu/move.wav',
        });
    });
}

function selectScreenHandler() {
    arrowKeysHandler();

    const playButton = $('#play-button');
    const openingScreen = $('#opening-screen');
    const selectionModal = $('#selection-modal');

    playButton.mousedown(() => {
        AudioPlayer.getInstance().playSound({
            sound: 'menu/action.wav'
        });

        selectionModal.css('display', 'none');
        openingScreen
            .css('opacity', '0')
            .css('animation', 'fadeOut 2s ease-in-out')
            .on('animationend', () => {
                openingScreen.css('display', 'none');
                Game.getInstance().playGame(selected);
                removeMenuHandler();
            });

        ParticlesManager.getInstance().clear();
    });
}

function arrowKeysHandler() {
    $('#arrow-left').mousedown(() => {
        if (selected === 0) {
            selected = 2;
        } else {
            selected -= 1;
        }
        $('#player-preview').attr('src', playerSelectImages[selected]);
    });

    $('#arrow-right').mousedown(() => {
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
