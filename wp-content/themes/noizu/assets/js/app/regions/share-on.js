"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(shareOn){
    var $el = $(shareOn.el);

    shareOn.listeners.on(shareOn.els.select, 'click', function(){
        toggleOptions(shareOn);
    });

    // social sharrre

    _.each([{
        id      : '#share-on-facebook',
        social  : 'facebook',
        text    : 'facebook'
    }, {
        id      : '#share-on-twitter',
        social  : 'twitter',
        text    : 'twitter'
    }, {
        id      : '#share-on-google-plus',
        social  : 'googlePlus',
        text    : 'google Plus'
    }, {
        id      : '#share-on-digg',
        social  : 'digg',
        text    : 'digg'
    }, {
        id      : '#share-on-delicious',
        social  : 'delicious',
        text    : 'delicious'
    }, {
        id      : '#share-on-stumbleupon',
        social  : 'stumbleupon',
        text    : 'Stumbleupon'
    }, {
        id      : '#share-on-linkedin',
        social  : 'linkedin',
        text    : 'linkedin'
    }, {
        id      : '#share-on-pinterest',
        social  : 'pinterest',
        text    : 'pinterest'
    }], function(params){
        var sharrreParams = {
            share           : {},
            template        : params.text,
            enableHover     : false,
            urlCurl         : '',
            enableTracking  : (window._gaq)? true : false,
            click           : function(api, options){
                options.url = (options.url === 'http://example.com')? window.location.href : options.url;
                api.simulateClick();
                api.openPopup(params.social);
                toggleOptions(shareOn);
            }
        };

        sharrreParams.share[params.social] = true;

        $el.find(params.id).sharrre(sharrreParams);
    });
};

module.exports.enter = function(shareOn){
    vlc([shareOn.els.label, shareOn.els.select], {
        rotateX     : -75,
        opacity     : 0
    }, 0);

    vlc(shareOn.el, {
        perspective : 300
    }, 0);

    _.each([shareOn.els.label, shareOn.els.select], function(el, i){
        $(el).css('opacity', 0).removeClass('hidden');

        vlc(el, {
            rotateX     : 0,
            opacity     : 1,
            translateZ  : 0
        }, {
            duration    : 1000,
            delay       : (i === 0)? 150 : 300,
            easing      : 'easeInOutCirc',
            complete    : function(el){
                $(el).removeAttr('style');
                if(i === 1){
                    app.emit('region.enter', shareOn);
                }
            }
        });
    });
};

module.exports.quit = function(shareOn){
    _.each([shareOn.els.label, shareOn.els.select], function(el, i){
        vlc(el, {
            translateX  : (i === 0)? [-10, 0] : [10, 0],
            opacity     : 0,
            translateZ  : 0
        }, {
            duration    : app.vars.quitDuration,
            easing      : app.vars.quitEasing,
            complete    : function(el){
                if(i === 1){
                    app.emit('region.quit', shareOn);
                }
            }
        });
    });
};

function toggleOptions(shareOn){
    var $container  = $(shareOn.els.options),
        $options    = $container.find('div'),
        isClosed    = $container.hasClass('hide'),
        delay       = 0,
        interval    = 50;

    if(!shareOn.vars.stopOptions){
        shareOn.vars.stopOptions = true;

        // rotate triangle

        vlc(shareOn.els.triangle, {
            rotateZ     : (isClosed)? 180 : 0
        }, {
            duration    : 300,
            easing      : 'easeInOutCirc'
        });

        if(isClosed){
            $options.css('opacity', 0);
        }

        $options.each(function(i, el){
            if((i === 0) && isClosed){
                $container.removeClass('hide');
            }

            vlc(el, {
                opacity     : (isClosed)? [1, 0] : [0, 1],
                translateY  : (isClosed)? [0, 10] : [10, 0],
                translateZ  : 0
            }, {
                duration    : 300,
                easing      : 'easeInOutCirc',
                delay       : delay,
                complete    : function(el){
                    if((i === $options.length - 1)){
                        shareOn.vars.stopOptions = false;

                        if(!isClosed){
                            $container.addClass('hide');
                        }
                    }
                }
            });

            delay += interval;
        });
    }
}