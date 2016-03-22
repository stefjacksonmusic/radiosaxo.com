"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(events){};

module.exports.quit = function(events){
    _.delay(function(){
        app.emit('region.quit', events);
    }, 510);
};