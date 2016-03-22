"use strict";

var _           = require('lodash'),
    vlc         = window.velocity,
    app         = window.app,
    $           = window.jQuery;

module.exports.init = function(post){
    post.els.contents = post.el.querySelectorAll('.post-content');
};

module.exports.enter = function(post){
    var delay       = 500,
        interval    = 200;

    if(post.els.title){
        app.getModule('noizuLayout').enterTitle(post);
    }

    if(post.els.sidebar){
        $(post.els.sidebar).css('opacity', 0).removeClass('hidden');

        vlc(post.els.sidebar, {
            opacity     : 1,
            translateY  : [0, 15],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutCirc',
            delay       : 500
        });
    }

    if(post.els.contents.length){
        _.each(post.els.contents, function(postContent, i){
            $(postContent).css('opacity', 0).removeClass('hidden');

            vlc(postContent, {
                opacity     : 1,
                translateX  : (i % 2 === 0)? [0, -15] : [0, 15],
                translateZ  : 0
            }, {
                duration    : 500,
                easing      : 'easeInOutCirc',
                delay       : delay,
                complete    : function(){
                    if(i + 1 === post.els.contents.length){
                        app.emit('region.enter', post);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.enter', post);
    }
};

module.exports.quit = function(post){
    if(post.els.title){
        app.getModule('noizuLayout').quitTitle(post);
    }

    if(post.els.sidebar){
        vlc(post.els.sidebar, {
            opacity     : 0,
            translateY  : [-15, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutCirc'
        });
    }

    if(post.els.contents.length){
        _.each(post.els.contents, function(postContent, i){
            vlc(postContent, {
                opacity     : 0,
                translateX  : (i % 2 === 0)? [-15, 0] : [15, 0],
                translateZ  : 0
            }, {
                duration    : 500,
                easing      : 'easeInOutCirc',
                complete    : function(){
                    if(i + 1 === post.els.contents.length){
                        app.emit('region.quit', post);
                    }
                }
            });
        });
    }
    else {
        app.emit('region.quit', post);
    }
};