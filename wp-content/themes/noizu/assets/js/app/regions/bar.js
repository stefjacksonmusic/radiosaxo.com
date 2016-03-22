"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery,
    sf  = window.screenFull;

module.exports.init = function(bar){
    if(bar.els.icoCopyright){
        bar.listeners.on(bar.els.icoCopyright, 'click', function(){
            app.emit('bar.display.copyright');
        });
    }

    if(bar.els.playerProgress){
        bar.listeners.on(app, 'player.percent', function(percent){
            vlc(bar.els.playerProgress, {
                width       : [percent, '%'].join('')
            }, {
                duration    : 100,
                easing      : 'linear'
            });
        });
    }

    if(bar.els.icoFullScreen){
        bar.listeners.on(bar.els.icoFullScreen, 'click', function(){
            toggleFullScreen(bar);
        });
    }

    if(bar.els.navPlayer){
        bar.listeners.on(bar.els.navPlayer, 'click', function(){
            app.emit('bar.display.player');
        });
    }

    if(bar.els.playerNav){
        bar.listeners.on(bar.els.playerNav, 'click', function(){
            app.emit('bar.display.nav');
            app.emit('playlist.hide');
        });
    }

    if(bar.els.copyNav){
        bar.listeners.on(bar.els.copyNav, 'click', function(){
            app.emit('bar.display.nav');
        }); 
    }

    if(bar.els.nav){
        var hx = app.getModule('historyX');

        // menu selection

        bar.listeners.on(app, 'historyX.do.setupPage', function(){
            barNavCurrentLinks(bar);
        });

        barNavCurrentLinks(bar);

        bar.vars.subMenuEvents      = {};
        bar.vars.subMenuTimeouts    = {};
        bar.vars.stopMenus          = {};

        // submenus

        $(bar.els.nav).find('> ul > li').each(function(i){
            var subMenu = this.querySelector('ul'),
                anchor  = this.querySelector('a');

            if(subMenu && anchor){
                bar.vars.subMenuEvents[i] = {};

                // remove hx history event
                if(anchor.deliveranceListenerId){
                    hx.listeners.off(anchor.deliveranceListenerId);
                    $(anchor).removeClass(hx.config.anchorSetClass);
                }

                bar.listeners.on(anchor, 'click', function(e){
                    e.preventDefault();
                    toggleSubMenu(bar, subMenu, i);
                    return false;
                });

                bar.listeners.on(subMenu, 'mouseover', function(){
                    bar.vars.subMenuEvents[i].ulOver = true;
                    clearTimeout(bar.vars.subMenuTimeouts[i]);
                });

                bar.listeners.on(subMenu, 'mouseout', function(){
                    bar.vars.subMenuEvents[i].ulOver = false;
                    clearTimeout(bar.vars.subMenuTimeouts[i]);

                    bar.vars.subMenuTimeouts[i] = _.delay(function(){
                        if((!bar.vars.subMenuEvents[i].ulOver) && (!bar.vars.subMenuEvents[i].liOver) && (subMenu.className.split(' ').indexOf('menu-visible') >= 0)){
                            bar.vars.stopMenus[i] = false;
                            toggleSubMenu(bar, subMenu, i);
                        }
                    }, 500);
                });

                bar.listeners.on(this, 'mouseover', function(){
                    bar.vars.subMenuEvents[i].liOver = true;
                    clearTimeout(bar.vars.subMenuTimeouts[i]);
                });

                bar.listeners.on(this, 'mouseout', function(){
                    bar.vars.subMenuEvents[i].liOver = false;
                    clearTimeout(bar.vars.subMenuTimeouts[i]);

                    bar.vars.subMenuTimeouts[i] = _.delay(function(){
                        if((!bar.vars.subMenuEvents[i].ulOver) && (!bar.vars.subMenuEvents[i].liOver) && (subMenu.className.split(' ').indexOf('menu-visible') >= 0)){
                            bar.vars.stopMenus[i] = false;
                            toggleSubMenu(bar, subMenu, i);
                        }
                    }, 500);
                });
            }
        });
    }

    if(bar.els.icoFullMenu){
        bar.listeners.on(bar.els.icoFullMenu, 'click', function(){
            app.emit('full-menu.toggle');
        });
    }

    // setup 

    barNavSetup(bar);
    
    if(app.vars.isIE){
        $(bar.el).addClass('bar-2d');
    }

    // other events

    bar.listeners.on(app, 'bar.display.*', function(e){
        switch(this.event){
            case 'bar.display.nav':
                toggleBar(bar, 'front');
                break;

            case 'bar.display.player':
                toggleBar(bar, 'top');
                break;

            case 'bar.display.copyright':
                toggleBar(bar, 'bottom');
                break;
        }
    });

    bar.listeners.on(window, 'resize', function(){
        clearTimeout(bar.vars.resizeTimeout);

        bar.vars.resizeTimeout = setTimeout(function(){
            barNavSetup(bar);
        }, 50);
        
    });

    bar.listeners.on(app, 'sidebar.toggle', function(){
        barSidebarToggle(bar);
    });
};

function barNavCurrentLinks(bar){
    var $li     = $(bar.el).find('nav li'),
        $a      = $(bar.el).find('nav a'),
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

    $li.removeClass('current');
    if($liCurrent && $liCurrent.length){
        $liCurrent.addClass('current');
    }
    else {
        return;
    }

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


function barNavSetup(bar){
    if(!bar.els.nav){
        return;
    }

    var $nav = $(bar.els.nav),
        $ico = $(bar.els.icoFullMenu);

    // menu goes down

    if($nav.find('> ul').position().top > 0){
        $nav.addClass('hidden');
        $ico.removeClass('hide');
    }
    else {
        $nav.removeClass('hidden');
        $ico.addClass('hide');
    }
}

function barSidebarToggle(bar){
    var isClosed = $('#off-screen-sidebar').hasClass('closed');

    vlc(bar.el, {
        opacity     : (isClosed)? 0 : 1,
        translateX  : (isClosed)? 20 : 0,
        translateZ  : 0
    }, {
        duration    : 750,
        easign      : 'easeInOutExpo',
        complete    : function(bar){
            if(!isClosed){
                $(bar).removeAttr('style');
            }
        }
    });
}

function toggleFullScreen(bar){
    if(sf.enabled){
        sf.toggle();
    }
}

function toggleBar(bar, rotation){
    var rotationClass   = ['toggle-', rotation].join(''),
        current         = bar.vars.current || 'front';

    if(!bar.vars.stopToggleBar){
        bar.vars.stopToggleBar = true;

        // ie

        if(app.vars.isIE){

            vlc(bar.els[current], {
                translateY  : $(bar.el).height(),
                translateZ  : 0,
                opacity     : 0
            }, {
                duration    : 500,
                easing      : 'easeInOutExpo',
                complete    : function(el){
                    bar.vars.current        = rotation;
                    bar.vars.stopToggleBar  = false;
                    $(el).css('display', 'none');
                }
            });

            $(bar.els[rotation]).css({'opacity': 0, 'display': 'block'});

            vlc(bar.els[rotation], {
                translateY  : [0, -$(bar.el).height()],
                translateZ  : 0,
                opacity     : 1
            }, {
                duration    : 500,
                easing      : 'easeInOutExpo'
            });
        }
        else {
            // other browsers

            if(bar.els[rotation]){
                $(bar.els[rotation]).css('display', 'block');
            }

            $(bar.els.container)
                .removeClass()
                .addClass(rotationClass);

            _.delay(function(){
                if(bar.els[current]){
                    $(bar.els[current]).css('display', 'none');
                }

                bar.vars.current        = rotation;
                bar.vars.stopToggleBar  = false;
            }, 750);
        }
    }
}

function toggleSubMenu(bar, subMenu, id){
    var delay       = 0,
        lists       = subMenu.querySelectorAll('li'),
        isVisible   = subMenu.className.split(' ').indexOf('menu-visible') >= 0,
        method      = (isVisible)? 'eachRight' : 'each',
        interval    = (isVisible)? 50 : 100,
        $lists;

    if(lists.length && !bar.vars.stopMenus[id]){
        bar.vars.stopMenus[id] = true;
        $lists = $(lists);

        if(!isVisible){
            $lists.css('opacity', 0);
        }
        
        _[method](lists, function(li, i){
            
            vlc(li, {
                opacity     : (isVisible)? 0 : [1, 0],
                translateX  : (isVisible)? [-15, 0] : [0, 15],
                translateZ  : 0
            }, {
                easing      : 'easeOutQuint',
                duration    : (isVisible)? 250 : 500,
                delay       : delay,
                begin       : function(){
                    if(i === 0 && !isVisible){
                        $(subMenu).addClass('menu-visible');
                    }
                },
                complete    : function(){
                    var condition = (isVisible)? i === 0 : i === (lists.length - 1);

                    if(condition){
                        bar.vars.stopMenus[id]     = false;
                        bar.vars.subMenuDisplayed = !isVisible;

                        if(isVisible){
                            $(subMenu).removeClass('menu-visible');
                        }
                    }
                }
            });

            delay += interval;
        });
    }
}