"use strict";

require('../../vendors/jquery.fitvids');

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(video){
    $(video.el).fitVids();
};

module.exports.quit = function(video){
    app.getModule('noizuLayout').quitRegion(video);
};