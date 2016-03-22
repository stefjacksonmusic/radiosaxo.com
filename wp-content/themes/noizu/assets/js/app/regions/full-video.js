"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery;

module.exports.init = function(video){
    if(video.els.content){

        video.els.video = video.els.content.querySelector('video,iframe');

        video.listeners.on(app, 'window.resize', function(){
            videoVerticalAlign(video);
        });

        if(video.els.video){
            $(video.els.content).fitVids();
            videoVerticalAlign(video);
        }

        if(video.els.info && video.els.sidebar){
            video.listeners.on(video.els.info, 'click', function(){
                videoInfoToggle(video);
            });
        }
    }
};

module.exports.enter = function(video){
    var delay    = 500,
        interval = 500,
        timeout;

    _.each(['wrapper', 'title', 'content', 'infoContainer'], function(element){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            app.emit('region.enter', video);
        }, 2501);
        
        if(video.els[element]){

            $(video.els[element]).css('opacity', 0).removeClass('hidden');
            vlc(video.els[element], {
                opacity     : 1,
                translateY  : [0, 15],
                translateZ  : 0
            }, {
                delay       : delay,
                duration    : 500,
                easing      : 'easeInOutQuint'
            });

            delay += interval;
        }
    });
};

module.exports.quit = function(video){
    var delay    = 0,
        interval = 250,
        timeout;

    _.each(['infoContainer', 'content', 'title', 'wrapper'], function(element){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            app.emit('region.quit', video);
        }, 1001);

        if(video.els[element]){
            vlc(video.els[element], {
                opacity     : 0,
                translateY  : [15, 0],
                translateZ  : 0
            }, {
                delay       : delay,
                duration    : 250,
                easing      : 'easeInOutQuint'
            });

            delay += interval;
        }
    });
};

function videoVerticalAlign(video){
    var breakpointH2    = _.indexOf(document.body.parentNode.className.split(' '), 'breakpoint-h2') > -1,
        $video          = $(video.els.video),
        $content        = $(video.els.content);

    if(breakpointH2){
        return;
    }

    $content.css('bottom', Math.round($video.height() / -2));
}

function videoInfoToggle(video){
    var $sidebar        = $(video.els.sidebar),
        sidebarWidth    = $sidebar.outerWidth(),
        isHidden        = $sidebar.hasClass('hidden');

    if(!video.vars.stopSidebar){
        video.vars.stopSidebar = true;

        if(isHidden){
            $sidebar.css('opacity', 0).removeClass('hidden');
        }

        vlc(video.els.content, {
            opacity     : (isHidden)? 0.25 : 1,
            scale       : (isHidden)? 0.8 : 1,
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : (isHidden)? 0 : 100,
            easing      : 'easeInOutQuint'
        });

        vlc(video.els.sidebar, {
            opacity     : (isHidden)? [1, 0] : [0, 1], 
            translateX  : (isHidden)? [0, sidebarWidth] : [sidebarWidth, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : (isHidden)? 100 : 0,
            easing      : 'easeInOutQuint',
            complete    : function(){
                if(!isHidden){
                    $sidebar.addClass('hidden');
                }

                video.vars.stopSidebar = false;
            }
        });
    }
}