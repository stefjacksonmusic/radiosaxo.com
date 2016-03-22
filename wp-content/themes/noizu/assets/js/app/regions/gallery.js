"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery,
    Packery = window.Packery,
    image   = app.getModule('image');

module.exports.init = function(gallery){
    gallerySetup(gallery);

    gallery.listeners.on(app, 'window.resize', function(){
        gallerySetup(gallery);
    });
};

module.exports.enter = function(gallery){
    if(gallery.els.title){
        $(gallery.els.title).css('opacity', 0).removeClass('hidden');

        vlc(gallery.els.title, {
            opacity     : [1, 0],
            translateX  : [0, 10],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 500,
            easing      : 'easeInOutQuint',
            complete    : function(){
                app.emit('region.enter', gallery);
            }
        });
    }
    else {
        app.emit('region.enter', gallery);
    }
};

module.exports.quit = function(gallery){
    if(gallery.els.title){
        vlc(gallery.els.title, {
            opacity     : [0, 1],
            translateX  : [-10, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 0,
            easing      : 'easeInOutQuint'
        });
    }

    if(gallery.els.container){
        vlc(gallery.els.container, {
            opacity     : [0, 1],
            translateX  : [10, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 0,
            easing      : 'easeInOutQuint',
            complete    : function(){
                app.emit('region.quit', gallery);
            }
        });
    }
    else {
        app.emit('region.quit', gallery);
    }
};

function gallerySetup(gallery){
    var images,
        gutter;

    if(_.isElement(gallery.els.container)){
        gutter = (_.isFinite(gallery.els.container.getAttribute('data-gutter')))? parseInt(gallery.els.container.getAttribute('data-gutter')) : 7;
        images = gallery.els.container.querySelectorAll('img');

        if(images.length && !gallery.vars.preload){
            gallery.vars.preload = true;

            _.each(images, function(img){
                image.preload(img).then(function(){

                    $(img).css('opacity', 0).removeClass('hidden');

                    vlc(img, {
                        opacity     : [1, 0],
                        scale       : [1, 0.9],
                        translateZ  : 0
                    }, {
                        duration    : 1000,
                        easing      : 'easeInOutQuint',
                        begin       : function(){
                            _.defer(function(){
                                if(gallery.vars.packery){
                                    gallery.vars.packery.layout();
                                }
                            });
                        }
                    });
                });
            });
        }

        if(gallery.vars.packery){
            gallery.vars.packery.layout();
        }
        else {
            gallery.vars.packery = new Packery(gallery.els.container, {
                itemSelector        : 'li',
                gutter              : gutter,
                transitionDuration  : '0.5s'
            });
        }
    }
}