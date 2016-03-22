"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(page){
    setMetaMargin(page);
};

module.exports.enter = function(page){
    var contentElements = [page.els.content];

    // tween title

    if(page.els.title){

        $(page.els.title).css('opacity', 0).removeClass('hidden');

        // replace title content
        vlc(page.els.title, {
            translateX  : [0, 10],
            translateZ  : 0,
            opacity     : [1, 0]
        }, {
            duration    : 1000,
            delay       : 1500,
            easing      : 'easeOutCirc'
        }); 
    }

    // tween content

    if(page.els.overlay){
        contentElements.push(page.els.overlay);
    }

    $(page.els.overlay).css('opacity', 0).removeClass('hidden');
    $(page.els.content).css('opacity', 0).removeClass('hidden');

    vlc(contentElements, {
        translateY  : [0, 20],
        opacity     : 1
    }, {
        duration    : 1000,
        easing      : 'easeInOutQuint',
        delay       : 1000,
        complete    : function(els){
            $(els).removeAttr('style');
            app.emit('region.enter', page);
        }
    });
};

module.exports.quit = function(page){
    var elements    = [page.els.content],
        delay       = 100,
        interval    = 100;

    if(page.els.featured){
        elements.push(page.els.featured);
    }

    if(page.els.title){
        elements.push(page.els.title);
    }

    if(page.els.overlay){
        elements.push(page.els.overlay);
    }

    _.each(elements, function(el, i){
        vlc(el, {
            translateX  : (i % 2 === 0)? [10, 0] : [-10, 0],
            translateZ  : 0,
            opacity     : 0
        }, {
            duration    : app.vars.quitDuration,
            easing      : app.vars.quitEasing,
            delay       : delay,
            complete    : function(){
                if(i === elements.length - 1){
                    app.emit('region.quit', page);
                }
            }
        });

        delay += interval;
    });
};

function setMetaMargin(page){
    var setMargin = function(page){
        var $image              = $(page.els.featured),
            $content            = $(page.els.content),
            $meta               = $(page.els.meta),
            imageWidth          = $image.width(),
            contentMarginLeft   = _.parseInt($content.css('margin-left'));

        $meta.css( 'left', imageWidth - contentMarginLeft + 21 );
    };

    // set content-meta margin
    if(page.els.featured && page.els.meta){
        if(page.els.featured.complete){
            setMargin(page);
        }
        else {
            page.listeners.on(app, 'image.loaded', function(img){
                setMargin(page);
            });
        }

        page.listeners.on(app, 'window.resize', function(){
            setMargin(page);
        });
    }
}