"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery;

module.exports.init = function(menu){
    menu.listeners.on(app, 'full-menu.toggle', function(){
        menuToggle(menu);
    });

    if(menu.els.close){
        menu.listeners.on(menu.els.close, 'click', function(){
            app.emit('full-menu.toggle');
        });        
    }

    menu.listeners.on(app, 'window.resize', function(){
        menuVertical(menu);
    });

    // setup

    menuSetup(menu);
};

function menuSetup(menu){
    // copy bar menu

    // click events
    $(menu.el).find('ul a').each(function(){
        menu.listeners.on(this, 'click', function(e){
            var $a  = $(this),
                $ul = $a.parent().find('> ul'),
                ulHeight,
                subIsHide;

            if(menu.vars.stop){
                return;
            }

            if($ul.length === 1){
                menu.vars.stop = true;
                subIsHide = $ul.css('display') === 'none';

                if(subIsHide){
                    $ul.css({
                        opacity : 0,
                        display : 'block'
                    });

                    ulHeight = $ul.height();
                    $ul.css('height', 0);
                }

                vlc($ul.get(0), {
                    height      : (subIsHide)? ulHeight : 0,
                    opacity     : (subIsHide)? 1 : 0
                }, {
                    duration    : 500,
                    easing      : 'easeInOutQuint',
                    complete    : function(){
                        if(!subIsHide){
                            $ul.removeAttr('style');    
                        }
                        menuVertical(menu);
                        menu.vars.stop = false;
                    }
                });
            }
            else {
                app.emit('full-menu.toggle');
            }
        });
    });
}

function menuVertical(menu){
    var $ul             = $(menu.el).find('> ul'),
        navHeight       = $ul.outerHeight(),
        containerHeight = $ul.parent().height(),
        top             = Math.round((containerHeight - navHeight) / 2);

    if($ul.parent().hasClass('hide')){
        return;
    }

    if(top < 0){
        top = 0;
    }

    vlc($ul.get(0), {
        marginTop   : top
    }, {
        duration    : 500,
        easing      : 'easeOutCirc'
    });
}

function menuToggle(menu){
    var $menu  = $(menu.el),
        isHide = $menu.hasClass('hide');

    if(isHide){
        $menu.css('opacity', 0).removeClass('hide');
    }

    vlc(menu.el, {
        opacity     : (isHide)? 1 : 0,
        scale       : (isHide)? [1, 0.9] : [0.9, 1]
    }, {
        duration    : 1000,
        easing      : 'easeInOutQuint',
        queue       : false,
        begin       : function(){
            _.defer(function(){
                if(isHide){
                    menuVertical(menu);
                }
            });
        },
        complete    : function(){
            if(!isHide){
                $menu.addClass('hide');
            }
        }
    });
}