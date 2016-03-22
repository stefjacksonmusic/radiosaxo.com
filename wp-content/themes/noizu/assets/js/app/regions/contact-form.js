"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(cForm){
    
};

module.exports.quit = function(cForm){
    app.getModule('noizuLayout').quitRegion(cForm);
};