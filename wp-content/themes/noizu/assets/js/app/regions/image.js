"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(image){};

module.exports.quit = function(image){
    _.delay(function(){
        app.emit('region.quit', image);
    }, 510);
};