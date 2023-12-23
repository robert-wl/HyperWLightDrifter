"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
$(function () {
    const keys = {
        w: 'key-w',
        a: 'key-a',
        s: 'key-s',
        d: 'key-d',
        ' ': 'key-space',
        c: 'key-c',
        e: 'key-e',
        q: 'key-q',
        p: 'key-p',
    };
    const modal = $('#how-to-play-modal');
    const innerContainer = $('.modal-inner-container');
    $('#how-to-play').on('click', () => {
        $('#selection-modal').css('display', 'none');
        $('#settings-modal').css('display', 'none');
        $('#menu-modal').css('display', 'none');
        $('.modal-inner-first').removeClass('hidden');
        $('.modal-inner-second').addClass('hidden');
        $('html').css('overflow', 'hidden');
        modal.css('display', 'flex').css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '1');
    });
    $('.modal-close-button').on('click', () => __awaiter(this, void 0, void 0, function* () {
        yield modal.css('opacity', '0').css('animation', 'fadeOut 0.25s ease-in-out').promise();
        modal.on('animationend', () => {
            modal.css('display', 'none');
            modal.off();
        });
        $('html').css('overflow', 'auto');
    }));
    $('.arrow-left-modal').on('click', () => {
        innerContainer.toggleClass('hidden');
    });
    $('.arrow-right-modal').on('click', () => {
        innerContainer.toggleClass('hidden');
    });
    $(document).on('keydown', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            $(`#${keys[e.key]}`).css('background-color', 'rgb(253, 27, 94)');
        }
    });
    $(document).on('keyup', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            $(`#${keys[e.key]}`).css('background-color', 'transparent');
        }
    });
    $(document).on('click', () => {
        $('#key-left').css('background-color', 'rgb(253, 27, 94)');
        setTimeout(() => {
            $('#key-left').css('background-color', 'transparent');
        }, 100);
    });
    $(document).on('contextmenu', (e) => {
        e.preventDefault();
        $('#key-right').css('background-color', 'rgb(253, 27, 94)');
        setTimeout(() => {
            $('#key-right').css('background-color', 'transparent');
        }, 100);
    });
});
