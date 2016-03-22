"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(page){
    var delay = 1000;

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
    _.each([page.els.left, page.els.right], function(el, i){
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
    var $left  = $(page.els.left),
        $right = $(page.els.right);

    $left.find('.page-content').height($left.height());
    $right.find('.page-content').height($right.height());

    clearInterval(page.vars.interval);

    _.each([page.els.left, page.els.right], function(el, i){
        vlc(el, {
            opacity     : [0, 1],
            translateX  : (i === 0)? [-15, 0] : [15, 0],
            translateZ  : 0
        }, {
            duration    : 500,
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
    var breakpointH1    = _.indexOf(document.body.parentNode.className.split(' '), 'breakpoint-h1') > -1,
        breakpointH2    = _.indexOf(document.body.parentNode.className.split(' '), 'breakpoint-h2') > -1,
        $right          = $(page.els.right).find('.page-content'),
        $left           = $(page.els.left).find('.page-content'),
        rightHeight     = $right.height(),
        leftHeight      = $left.height(),
        leftInnerHeight,
        rightInnerHeight;

    if(breakpointH2){
        return;
    }

    leftInnerHeight = _.map($left.find('.page-content-in > *').get(), function(el){
        return $(el).height();
    }).reduce(function(sum, num){
        return sum + num;
    });

    rightInnerHeight = _.map($right.find('.page-content-in > *').get(), function(el){
        return $(el).height();
    }).reduce(function(sum, num){
        return sum + num;
    });

    if(leftInnerHeight !== page.vars.leftInnerHeight){
        $left.height('auto');
        leftHeight = $left.height();
    }

    if(rightInnerHeight !== page.vars.rightInnerHeight){
        $right.height('auto');
        rightHeight = $right.height();
    }

    if(rightHeight > leftHeight){
        $left.height( $right.height() );
    }
    else {
        $right.height( $left.height() );
    }
}