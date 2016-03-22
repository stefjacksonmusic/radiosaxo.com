"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery,
    Packery = window.Packery;

module.exports.init = function(grid){
    grid.els.images = grid.el.querySelectorAll('img');
    grid.els.li     = grid.els.container.querySelectorAll('li');

    gridSetup(grid);

    grid.listeners.on(app, 'window.resize', function(){
        gridSetup(grid);
    });

    grid.listeners.on(app, 'image.loaded', function(img){
        if(img && grid.els.images && _.indexOf(grid.els.images, img) >= 0){
            gridSetup(grid);
        }
    });
};

module.exports.quit = function(grid){
    _.delay(function(){
        app.emit('region.quit', grid);
    }, 510);
};

function gridSetup(grid){
    var breakpointH1    = _.indexOf(document.body.parentNode.className.split(' '), 'breakpoint-h1') > -1,
        breakpointH2    = _.indexOf(document.body.parentNode.className.split(' '), 'breakpoint-h2') > -1,
        columns         = _.parseInt(grid.els.container.getAttribute('data-columns')),
        gutterDefault   = 14,
        gutter,
        containerWidth,
        columnWidth;

    gutter  = (grid.els.container.getAttribute('data-gutter'))? parseInt(grid.els.container.getAttribute('data-gutter')) : gutterDefault;
    gutter  = (gutter > 0)? gutter : gutterDefault;
    columns = (columns > 0)? columns : false;

    if(breakpointH2){
        columns = 1;
    }

    if(breakpointH1){
        columns = 2;
    }

    // calculate columns

    if(columns){
        containerWidth  = grid.els.container.offsetWidth;
        columnWidth     = Math.floor((containerWidth - (gutter * (columns - 1))) / columns);
        
        $(grid.els.li).css('width', columnWidth);
        $(grid.els.container).addClass('grid-columns');
    }
    else {
        $(grid.els.container).removeClass('grid-columns');
    }

    // set packery

    if(grid.vars.packery){
        grid.vars.packery.destroy();
    }
    
    grid.vars.packery = new Packery(grid.els.container, {
        itemSelector        : 'li',
        gutter              : gutter,
        transitionDuration  : '0.5s',
        isResizeBound       : false,
        columnWidth         : (columns)? columnWidth : false
    });
}