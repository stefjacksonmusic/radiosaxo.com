"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(map){};

module.exports.quit = function(map){
    app.getModule('noizuLayout').quitRegion(map);
};