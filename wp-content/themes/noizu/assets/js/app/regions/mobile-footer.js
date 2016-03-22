"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(mobileFooter){
    mobileFooterEnter(mobileFooter);
};

function mobileFooterEnter(mobileFooter){
    var $el = $(mobileFooter.el);

    $el.css('opacity', 0).removeClass('hidden');

    vlc(mobileFooter.el, {
        opacity     : [1, 0],
        translateY  : [0, 10],
        translateZ  : 0
    }, {
        duration    : 1000,
        easing      : 'easeInOutQuint',
        delay       : 2000,
        complete    : function(){
            $el.removeAttr('style');
        }
    });
}