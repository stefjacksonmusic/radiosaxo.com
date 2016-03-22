"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(iconsBar){
    iconsBar.enter(iconsBar);
    iconsBar.vars.isFooter = $('#container').hasClass('bar-top');

    if(iconsBar.els.menu){
        iconsBar.listeners.on(iconsBar.els.menu, 'click', function(){
            app.emit('sidebar.toggle');
        });
    }

    // loader events

    iconsBar.listeners.on(app, 'historyX.load.begin', function(){
        if(iconsBar.vars.isFooter){
            vlc(iconsBar.el, {
                opacity     : 0
            }, {
                duration    : 200,
                easing      : 'linear',
                queue       : false
            });
        }
        else {
            loaderToggle(iconsBar, 'show');
        }
    });

    iconsBar.listeners.on(app, 'regions.in', function(){
        if(iconsBar.vars.isFooter){
            vlc(iconsBar.el, {
                opacity     : 1
            }, {
                duration    : 200,
                easing      : 'linear',
                queue       : false
            });
        }
        else {
            loaderToggle(iconsBar, 'hide');
        }
    });
};

module.exports.enter = function(iconsBar){
    var delay       = 1000,
        interval    = 150,
        $el;

    _.each(iconsBar.el.querySelectorAll('a,span'), function(el){
        $el = $(el);

        if(el === iconsBar.els.loader){
            return;
        }

        if(el.id === 'logo'){
            return;
        }

        $(el).css('opacity', 0).removeClass('hidden');
        
        vlc(el, {
            opacity     : [1, 0],
            translateX  : ($el.hasClass('left'))? [0, 15] : [0, -15],
            translateZ  : 0
        }, {
            duration    : 1000,
            easing      : 'easeInOutQuint',
            delay       : delay,
            complete    : function(){
                $(el).removeAttr('style');
            }
        });

        delay += interval;
    });
};

function loaderToggle(iconsBar, display){
    var $loader     = $(iconsBar.els.loader),
        isHidden    = $loader.hasClass('hidden'),
        rotate      = function(){
            vlc(iconsBar.els.loader.querySelector('svg'), {
                rotateZ     : ['0deg', '360deg']
            }, {
                duration    : 600,
                easing      : 'linear',
                complete    : function(){
                    vlc(iconsBar.els.loader, { rotateZ : '0deg' }, 0);
                    if(!iconsBar.vars.loaderRotateStop){
                        rotate();
                    }
                }
            });
        };

    if((display === 'show' && isHidden) || (display === 'hide' && !isHidden)){
        if(isHidden){
            $loader
                .css('opacity', 0)
                .removeClass('hidden');

            iconsBar.vars.loaderRotateStop = false;
            rotate();
        }

        vlc(iconsBar.els.loader, {
            opacity     : (isHidden)? [1, 0] : [0, 1],
            scale       : (isHidden)? [1, 0.9] : [0.9, 1]
        }, {
            easing      : 'easeInOutQuint',
            duration    : 500,
            complete    : function(){
                if(!isHidden){
                    iconsBar.vars.loaderRotateStop = true;
                    $loader.addClass('hidden');
                }
            }
        });
    }
}