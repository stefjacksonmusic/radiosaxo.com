"use strict";

var _       = require('lodash'),
    $       = window.jQuery,
    vlc     = window.velocity,
    hx,
    app;

module.exports.init = function(){
    app = this;
    hx  = app.getModule('historyX');

    // wp bar fix

    if(document.body && document.body.className.search('admin-bar') > -1){
        var style = document.createElement('style');
        style.innerHTML = 'html { margin-top: 0 !important }';
        document.body.appendChild(style);
    }

    app.on('historyX.load.complete.html', function(){
        scrollToTop();
    });

    app.on('regions.in', function(){
        replaceAdminBar();
        replaceBodyClasses();
        parseFullScreenRegion();
        parseDarkBacgroundRegion();
        parseIconsBarsFillRegion();
    });
};

module.exports.quitRegion = function(region){
    vlc(region.el, {
        scale       : 0.9,
        opacity     : 0,
        translateZ  : 0
    }, {
        duration    : 500,
        delay       : _.random(0, 300),
        easing      : 'easeOutExpo',
        complete    : function(){
            app.emit('region.quit', region);
        }
    });
};

module.exports.enterTitle = function(region, cb){
    if(region.els.title){
        $(region.els.title).css('opacity', 0).removeClass('hidden');

        vlc(region.els.title, {
            opacity     : [1, 0],
            translateX  : [0, 10],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 500,
            easing      : 'easeInOutQuint',
            complete    : function(el){
                if(_.isFunction(cb)){
                    cb.call(el);
                }
            }
        });
    }
};

module.exports.quitTitle = function(region, cb){
    if(region.els.title){
        vlc(region.els.title, {
            opacity     : [0, 1],
            translateX  : [-10, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutQuint',
            complete    : function(els){
                if(_.isFunction(cb)){
                    cb.call(els);
                }
            }
        });
    }
};

function replaceBodyClasses(){
    if(window.mthemesCurrentBodyClasses && _.isString(window.mthemesCurrentBodyClasses)){
        document.body.className = window.mthemesCurrentBodyClasses;
    }
}

// add full-screen class to container
function parseFullScreenRegion(){
    var content             = document.querySelector(hx.config.contentSelector),
        fullScreenRegion    = content.querySelector('.region-full-screen'),
        $container          = $(content).parent();

    if(_.isElement(fullScreenRegion)){
        $container.addClass('full-screen');
    }
    else {
        $container.removeClass('full-screen');
    }
}

// add dark-background class to container
function parseDarkBacgroundRegion(){
    var content              = document.querySelector(hx.config.contentSelector),
        darkBackgroundRegion = content.querySelector('.region-dark-background'),
        $container           = $(content).parent();

    if(_.isElement(darkBackgroundRegion)){
        $container.addClass('dark-background');
    }
    else {
        $container.removeClass('dark-background');
    }
}

// add icons-bar-fill class to container
function parseIconsBarsFillRegion(){
    var bar                 = document.querySelector('#icons-bar'),
        content             = document.querySelector(hx.config.contentSelector),
        fullScreenRegion    = content.querySelector('.region-icons-bar-fill'),
        $container          = $(content).parent(),
        toggleClass;

    if(_.isElement(fullScreenRegion) && !$container.hasClass('icons-bar-fill')){
        toggleClass = true;
    }

    if(!_.isElement(fullScreenRegion) && $container.hasClass('icons-bar-fill')){
        toggleClass = true;
    }

    if(toggleClass){
        vlc(bar, {
            opacity     : [0, 1],
            translateY  : [-15, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeOutExpo',
            delay       : 250,
            complete    : function(){
                if(_.isElement(fullScreenRegion)){
                    $container.addClass('icons-bar-fill');
                }
                else {
                    $container.removeClass('icons-bar-fill');
                }

                vlc(bar, 'reverse');
            }
        });
    }
}

function scrollToTop(){ 
    vlc(document.querySelector('#scroll'), "scroll", {
        container   : document.querySelector('#container'),
        duration    : 500,
        easing      : 'easeOutQuart',
        offset      : -50
    });
}

function replaceAdminBar(){
    var adminBars = document.body.querySelectorAll('#wpadminbar'),
        oldAdminBar, newAdminBar;

    if(adminBars.length === 2){
        oldAdminBar = _.filter(adminBars, function(adminBar){
            return adminBar.parentNode === document.body;
        })[0];

        if(oldAdminBar){
            newAdminBar = _.filter(adminBars, function(adminBar){
                return adminBar !== oldAdminBar;
            })[0];
        }

        if(oldAdminBar && newAdminBar){
            $(oldAdminBar).replaceWith(newAdminBar);
        }
    }
}