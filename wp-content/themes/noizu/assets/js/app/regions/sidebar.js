"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(sidebar){
    sidebar.els.container   = document.querySelector('#container');
    sidebar.vars.firstTime  = true;
    sidebar.vars.stop       = false;

    // events

    sidebar.listeners.on(app, 'sidebar.toggle', function(){
        sidebarToggle(sidebar);
    });

    sidebar.listeners.on(app, 'historyX.load.begin', function(){
        if(!$(sidebar.el).hasClass('closed')){
            app.emit('sidebar.toggle');
        }
    });

    sidebar.listeners.on(sidebar.els.close, 'click', function(){
        app.emit('sidebar.toggle');
    });

    sidebar.listeners.on(app, 'historyX.do.setupPage', function(){
        sidebarNavCurrentLinks(sidebar);
    });

    // setup

    sidebarNavSetup(sidebar);
};

function sidebarToggle(sidebar){
    var $el         = $(sidebar.el),
        width       = $el.width(),
        isClosed    = $el.hasClass('closed'),
        position    = ($el.hasClass('sidebar-right'))? 'right' : 'left',
        translate;

    if(!sidebar.vars.stop){
        sidebar.vars.stop = true;

        if(position === 'left'){
            translate = (isClosed)? [width, 0] : [0, width];
        }
        else {
            translate = (isClosed)? [-width, 0] : [0, -width];
        }

        if(sidebar.vars.firstTime){
            sidebar.vars.firstTime = false;
            $el.removeClass('hidden');
        }

        vlc(sidebar.els.container, {
            translateX  : translate,
            translateZ  : 0
        }, {
            duration    : (isClosed)? 1000 : 750,
            easing      : (isClosed)? 'easeInOutExpo' : 'easeOutExpo',
            complete    : function(container){
                sidebar.vars.stop = false;
                $el.toggleClass('closed');
                
                if(isClosed){
                    app.emit('sidebar.open');
                }
                else {
                    app.emit('sidebar.closed');
                    $(container).removeAttr('style');
                }
            }
        });
    }
}

function sidebarNavCurrentLinks(sidebar){
    var $li     = $(sidebar.el).find('.widget nav li'),
        $a      = $(sidebar.el).find('.widget nav a'),
        isSub   = true,
        $currentA,
        $liCurrent,
        fakeAnchor;

    $a.each(function(i){
        fakeAnchor = document.createElement('a');
        fakeAnchor.setAttribute('href', this.href);
        if(fakeAnchor.href === window.location.href){
            $currentA   = $(this);
            $liCurrent  = $currentA.parent();
        }
    });

    if($li.length){
        $li.removeClass('current');
    }
    if($liCurrent && $liCurrent.length){
        $liCurrent.addClass('current');

        while(isSub){
            $liCurrent = $liCurrent.parent().parent();
            if($liCurrent.prop('tagName').toLowerCase() !== 'li'){
                isSub = false;
            }
            else {
                $liCurrent.addClass('current');
            }
        }
    }
}

function sidebarNavSetup(sidebar){
    var hx = app.getModule('historyX');

    _.each(sidebar.el.querySelectorAll('.widget nav a'), function(a){
        var nextEl = $(a).next().get(0);

        // current class

        // sidebar.listeners.on(a, 'click', function(){
        //     var $li         = $(this).parent(),
        //         $liParent   = $li,
        //         isSub       = true;

        //     if(!this.hostname){
        //         return;
        //     }

        //     $('.widget nav li').removeClass('current');
        //     $li.addClass('current');

            
            
        // });

        if(nextEl && nextEl.tagName.toLowerCase() === 'ul' ){
            
            // remove hx history event
            if(a.deliveranceListenerId){
                hx.listeners.off(a.deliveranceListenerId);
                $(a).removeClass(hx.config.anchorSetClass);
            }

            sidebar.listeners.on(a, 'click', function(e){
                e.preventDefault();
                sidebarNavToggleSub(sidebar, a);
                return false;
            });
        }
    });
}

function sidebarNavToggleSub(sidebar, a){
    var $a          = $(a),
        $li         = $a.parent(),
        $ul         = $a.next(),
        isClosed    = $a.height() === $li.height();

    vlc($li, {
        height      : (isClosed)? $li.height() + $ul.height() : $a.height()
    }, {
        duration    : 500,
        easing      : 'easeInOutQuint'
    });
}