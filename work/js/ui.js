﻿$(function(){
    $('.drop-down').mouseover(function(){
        $(this).find('.caret-down').removeClass('caret-down').addClass('caret-up');
        $(this).addClass('open');
    }).mouseout(function(){
        $(this).find('.caret-up').removeClass('caret-up').addClass('caret-down');
        $(this).removeClass('open');
    })
})
