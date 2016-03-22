"use strict";

require('../../vendors/owl.carousel.min');

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(slider){
    sliderSet(slider);
};

module.exports.quit = function(slider){
    _.delay(function(){
        app.emit('region.quit', slider);
    }, 510);
};

function sliderSet(slider){
    $(slider.els.container).owlCarousel({
        items           : 1,
        lazyLoad        : true,
        navigation      : true,
        itemsDesktop    : false
    });
}