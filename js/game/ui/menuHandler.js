
const playerSelectImages = [
    '../assets/ui/player_select/player-red.png',
    '../assets/ui/player_select/player-dark.png',
    '../assets/ui/player_select/player-yellow.png'
]

let selected = 0;
export default function menuHandler() {
    $('#HUD').mousedown(() => {
        if($('#selection-modal').css('display') === 'flex'){
            return
        }

        const menuModal = $('#menu-modal');

        if (menuModal.css('display') === 'none') {
            menuModal
                .css('display', 'flex')
                .css('animation', 'fadeIn 0.25s ease-in-out')
                .css('opacity', '100%');
            return;
        }
        menuModal.css('display', 'none');
    });

    handleArrowKeys();

    $('.new-game').mousedown(() => {
        $('#menu-modal')
            .css('display', 'none');
        $('#selection-modal')
            .css('display', 'flex')
            .css('animation', 'fadeIn 0.25s ease-in-out')
            .css('opacity', '100%');
    });

    $('#cancel-button').mousedown(() => {
        $('#selection-modal')
            .css('display', 'none');
        $('#menu-modal')
            .css('display', 'flex')
            .css('animation', 'fadeIn 0.25s ease-in-out')
            .css('opacity', '100%');
    })
}


function handleArrowKeys() {
    $('#arrow-left').mousedown(() => {
        if (selected === 0) {
            selected = 2;
        }
        else {
            selected -= 1;
        }
        $('#player-preview').attr('src', playerSelectImages[selected]);
    });

    $('#arrow-right').mousedown(() => {
        if (selected === 2) {
            selected = 0;
        }
        else {
            selected += 1;
        }
        $('#player-preview').attr('src', playerSelectImages[selected]);
    });
}
