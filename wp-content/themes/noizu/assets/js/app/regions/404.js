"use strict";

var _                   = require('lodash'),
    vlc                 = window.velocity,
    app                 = window.app,
    $                   = window.jQuery;

module.exports.init = function(region404){

};

module.exports.enter = function(region404){
    if(region404.els.content){
        $(region404.els.content).css('opacity', 0).removeClass('hidden');

        vlc(region404.els.content, {
            opacity     : 1,
            scale       : [1, 0.9],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 500,
            easing      : 'easeInOutQuint',
            complete    : function(){
                app.emit('region.enter', region404);
            }
        });
    }
    else {
        app.emit('region.enter', region404);
    }
};

module.exports.quit = function(region404){
    if(region404.els.content){
        vlc(region404.els.content, {
            opacity     : 0,
            scale       : 0.9,
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutQuint',
            complete    : function(){
                app.emit('region.quit', region404);
            }
        });
    }
    else {
        app.emit('region.quit', region404);
    }
};