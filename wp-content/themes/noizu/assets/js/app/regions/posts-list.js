"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(postsList){
};

module.exports.quit = function(postsList){
    app.getModule('noizuLayout').quitRegion(postsList);
};