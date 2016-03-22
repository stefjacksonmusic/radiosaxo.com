"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(page){
    page.els.boxes = page.el.querySelectorAll('.page-box');
};

module.exports.enter = function(page){
    var delay       = 750,
        interval    = 250;

    if(page.els.title){
        app.getModule('noizuLayout').enterTitle(page);
    }

    if(page.els.boxes.length){
        _.each(page.els.boxes, function(box, i){
            $(box).css('opacity', 0).removeClass('hidden');

            vlc(box, {
                opacity     : 1,
                translateZ  : 0,
                translateX  : (i % 2 === 0)? [0, 15] : [0, -15]
            }, {
                duration    : 500,
                delay       : delay,
                easing      : 'easeInOutCirc',
                complete    : function(){
                    if(i+1 === page.els.boxes.length){
                        app.emit('region.enter', page);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.enter', page);
    }
};

module.exports.quit = function(page){
    var delay       = 250;

    if(page.els.title){
        app.getModule('noizuLayout').quitTitle(page);
    }

    if(page.els.boxes.length){
        _.each(page.els.boxes, function(box, i){
            vlc(box, {
                opacity     : 0,
                translateZ  : 0,
                translateX  : (i % 2 === 0)? [15, 0] : [-15, 0]
            }, {
                duration    : 500,
                delay       : delay,
                easing      : 'easeInOutCirc',
                complete    : function(){
                    if(i+1 === page.els.boxes.length){
                        app.emit('region.quit', page);
                    }
                }
            });
        });
    }
    else {
        app.emit('region.quit', page);
    }
};