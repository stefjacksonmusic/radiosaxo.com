"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery,
    image   = app.getModule('image'),
    Packery = window.Packery;

module.exports.init = function(collection){
    if(collection.els.filtersContainer){
        collection.els.filters = collection.els.filtersContainer.querySelectorAll('li');
    }

    collection.els.items = collection.els.container.querySelectorAll('li');

    collectionSetup(collection);

    // events

    collection.listeners.on(app, 'window.resize', function(){
        collectionSetup(collection);
    });

    _.each(collection.els.filters, function(filter){
        collection.listeners.on(filter, 'click', function(){
            var $filterAll  = $(collection.els.filters).filter('[data-filter="*"]'), 
                $filter     = $(this),
                filter      = $filter.attr('data-filter');

            if(filter === '*' && !$filter.hasClass('active')){
                $(collection.els.filters).not('[data-filter="*"]').removeClass('active');
            }

            if(filter !== '*' && $filterAll.hasClass('active') ){
                $filterAll.removeClass('active');
            }

            $(this).toggleClass('active');
            collectionFilter(collection);
        });
    });
};

module.exports.enter = function(collection){
    var delay    = 750,
        interval = 100;

    if(collection.els.title){
        app.getModule('noizuLayout').enterTitle(collection);
    }

    if(collection.els.filters){
        $(collection.els.filters).css('opacity', 0).removeClass('hidden');

        _.each(collection.els.filters, function(filter){
            vlc(filter, {
                opacity     : 1,
                translateX  : [0, 15],
                translateZ  : 0
            }, {
                duration    : 500,
                delay       : delay,
                queue       : false,
                easing      : 'easeInOutQuint',
                complete    : function(filter){
                    $(filter).removeAttr('style');
                }
            });

            delay += interval;
        });
    }

    if(collection.els.items && collection.els.items.length){
        delay = 750;

        _.each(collection.els.items, function(item, i){
            var itemContent = item.querySelector('.item-content');
            
            $(itemContent).css('opacity', 0).removeClass('hidden');

            vlc(itemContent, {
                opacity     : [1, 0],
                scale       : [1, 0.9],
                translateZ  : 0
            }, {
                duration    : 500,
                delay       : delay,
                queue       : false,
                easing      : 'easeInOutQuint',
                complete    : function(){
                    if(i + 1 === collection.els.items.length){
                        app.emit('region.enter', collection);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.enter', collection);
    }
};

module.exports.quit = function(collection){
    if(collection.els.title){
        app.getModule('noizuLayout').quitTitle(collection);
    }

    if(collection.els.filters){
        vlc(collection.els.filters, {
            opacity     : 0,
            translateX  : 10,
            translateZ  : 0
        }, {
            easing      : 'easeInOutQuint',
            duration    : 500,
            complete    : function(){
                if(!collection.els.filtersContainer){
                    app.emit('region.quit', collection);
                }
            }
        });
    }

    if(collection.els.container){
        vlc(collection.els.container, {
            opacity     : 0,
            translateX  : (collection.els.filters)? -10 : 10,
            translateZ  : 0
        }, {
            easing      : 'easeInOutQuint',
            duration    : 500,
            complete    : function(){
                app.emit('region.quit', collection);
            }
        });
    }
    
    if((!collection.els.container) && (!collection.els.filters)){
        app.emit('region.quit', collection);
    }
};

function collectionSetup(collection){
    if(collection.vars.packery){
        collection.vars.packery.destroy();
    }
    
    collection.vars.packery = new Packery(collection.els.container, {
        itemSelector        : 'li',
        gutter              : 21,
        transitionDuration  : '0.5s',
        isResizeBound       : false
    });
}

function collectionFilter(collection){
    var activeFilters   = [],
        delay           = 100,
        interval        = 100,
        filterData,
        itemClasses,
        itemHasFilter,
        allFilter;

    _.each(collection.els.filters, function(filter){
        if($(filter).hasClass('active')){
            filterData = filter.getAttribute('data-filter');
            activeFilters.push(filterData);
        }
    });

    allFilter = _.indexOf(activeFilters, '*') > -1;

    _.each(collection.els.items, function(item){
        itemClasses     = item.className.split(' ');
        itemHasFilter   = (allFilter)? true : false;

        _.each(activeFilters, function(filter){
            if(_.indexOf(itemClasses, filter) > -1){
                itemHasFilter = true;
            }
        });

        vlc(item, {
            opacity     : (itemHasFilter)? 1 : 0.1,
            scale       : (itemHasFilter)? 1 : 0.9,
            translateZ  : 0
        }, {
            duration    : 250,
            easing      : 'easeInOutExpo',
            delay       : delay,
            queue       : false
        });

        delay += interval;
    });
}