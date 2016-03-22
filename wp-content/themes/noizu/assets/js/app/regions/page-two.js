"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(page){
    // columns height

    page.listeners.on(app, 'window.resize', function(){
        pageSidebarHeight(page);
    });

    
    page.vars.interval = setInterval(function(){
        pageSidebarHeight(page);
    }, 1000);

    pageSidebarHeight(page);
};

module.exports.enter = function(page){
    _.each([page.els.content, page.els.sidebar], function(el, i){
        $(el).css('opacity', 0).removeClass('hidden');

        vlc(el, {
            opacity     : [1, 0],
            translateX  : (i === 0)? [0, -15] : [0, 15],
            translateZ  : 0
        }, {
            duration    : 1000,
            delay       : 1000,
            easing      : 'easeInOutCirc',
            complete    : function(){
                if(i === 0){
                    $(el).removeAttr('style');
                }
                if(i === 1){
                    app.emit('region.enter', page);
                }
            }
        });
    });
};

module.exports.quit = function(page){
    clearInterval(page.vars.interval);

    _.each([page.els.content, page.els.sidebar], function(el, i){
        vlc(el, {
            opacity     : [0, 1],
            translateX  : (i === 0)? [-15, 0] : [15, 0],
            translateZ  : 0
        }, {
            duration    : 1000,
            delay       : 0,
            easing      : 'easeInCirc',
            complete    : function(){
                if(i === 1){
                    app.emit('region.quit', page);
                }
            }
        });
    });
};

function pageSidebarHeight(page){
    var $sidebar        = $(page.els.sidebar),
        $content        = $(page.els.content),
        contentHeight   = $content.outerHeight();

    $sidebar.css('height', contentHeight);
}