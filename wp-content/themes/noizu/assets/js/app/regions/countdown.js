"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery;

module.exports.init = function(countdown){
    countdown.els.li = countdown.el.querySelectorAll('li');

    if(countdown.els.content){
        countdownSetup(countdown);
    }

    countdown.vars.interval = setInterval(function(){
        countdownUpdate(countdown);
    }, 1000);
};

module.exports.enter = function(countdown){
    var delay       = 500,
        interval    = 500;

    if(countdown.els.li){
        _.each(countdown.els.li, function(li, i){
            $(li).css('opacity', 0).removeClass('hidden');

            vlc(li, {
                opacity     : [1, 0],
                translateY  : [0, 15],
                translateZ  : 0
            }, {
                duration    : 500,
                easing      : 'easeInOutExpo',
                delay       : delay,
                complete    : function(){
                    if(i === 3){
                        app.emit('region.enter', countdown);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.enter', countdown);
    }

    if(countdown.els.message){
        $(countdown.els.message).css('opacity', 0).removeClass('hidden');

        vlc(countdown.els.message, {
            opacity     : [1, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutCirc',
            delay       : 2500
        });
    }
};

module.exports.quit = function(countdown){
    var delay       = 0,
        interval    = 250;

    if(countdown.els.li){
        _.each(countdown.els.li, function(li, i){
            vlc(li, {
                opacity     : [0, 1],
                translateY  : [-15, 0],
                translateZ  : 0
            }, {
                duration    : 250,
                easing      : 'easeInOutExpo',
                delay       : delay,
                complete    : function(){
                    if(i === 3){
                        app.emit('region.quit', countdown);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.quit', countdown);
    }

    if(countdown.els.message){
        vlc(countdown.els.message, {
            opacity     : 0,
            translateZ  : 0
        }, {
            duration    : 250,
            easing      : 'easeInOutCirc'
        });
    }
};

function countdownSetup(countdown){
    var year    = parseInt(countdown.els.content.getAttribute('data-year')),
        month   = parseInt(countdown.els.content.getAttribute('data-month')),
        day     = parseInt(countdown.els.content.getAttribute('data-day')),
        hour    = parseInt(countdown.els.content.getAttribute('data-hour'));

    countdown.vars.date = new Date(year, month - 1, day, hour);
}

function countdownUpdate(countdown){
    var now = new Date(),
        seconds,
        seconds_left,
        days,
        hours,
        minutes;

    if(countdown.vars.date instanceof Date){
        seconds         = Math.round((countdown.vars.date.getTime() - now.getTime()) / 1000);
        days            = Math.floor(seconds / 86400);
        seconds_left    = seconds % 86400;
        hours           = Math.floor(seconds_left / 3600);
        seconds_left    = seconds % 3600;
        minutes         = Math.floor(seconds_left / 60);
        seconds_left    = seconds_left % 60;

        countdown.els.days.innerHTML    = days;
        countdown.els.hours.innerHTML   = hours;
        countdown.els.minutes.innerHTML = minutes;
        countdown.els.seconds.innerHTML = seconds_left;
    }
}