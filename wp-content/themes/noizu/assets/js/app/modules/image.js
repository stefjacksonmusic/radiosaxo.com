"use strict";

var _       = require('lodash'),
    Promise = require('es6-promise').Promise,
    vlc     = window.velocity,
    app;

module.exports.init = function(){
    app = this;

    app.on('regions.in', function(){
        module.exports.preloadImages();
    });
};

module.exports.preload = function(img){
    var src,
        image;

    if(!(_.isElement(img) || _.isString(img))){
        return false;
    }

    if(_.isElement(img)){
        src = img.getAttribute('src');
    }

    if(_.isString(img)){
        src = img;
    }

    return new Promise(function(resolve, reject){
        image = document.createElement('img');
        image.src = src;

        if(image.complete && image.naturalWidth){
            app.emit('image.loaded', img);
            resolve(img);
        }
        else {
            image.addEventListener('load', function(){
                app.emit('image.loaded', img);
                resolve(img);
            }, false);
        }
    });
};



module.exports.preloadImages = function(){
    var images = document.querySelectorAll('.image-preload');

    _.each(images, function(img){
        module.exports.preload(img).then(function(img){
            img.style.opacity   = 0;
            img.className       = _.pull(img.className.split(' '), "image-preload").join(' ');

            vlc(img, {
                opacity     : [1, 0],
                scale       : [1, 0.95]
            }, {
                duration    : 1000,
                easing      : 'easeInOutQuint',
                delay       : 100,
                complete    : function(img){
                    img[0].removeAttribute('style');
                }
            });
        });
    });
};