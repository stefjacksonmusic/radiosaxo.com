"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery,
    image   = app.getModule('image'),
    Packery = window.Packery;

module.exports.init = function(blog){
    blogSetup(blog);

    blog.listeners.on(app, 'window.resize', function(){
        blogSetup(blog);
    });

    blog.listeners.on(app, 'image.loaded', function(img){
        if(img && blog.els.images && _.indexOf(blog.els.images, img) >= 0){
            blogSetup(blog);
        }
    });

    // find videos

    $(blog.el.querySelectorAll('.post-video')).fitVids();

    // load more

    if(blog.els.loadMore && blog.els.loadMoreUrl){
        $(blog.els.loadMore).on('click', function(){
            blogListLoadMore(blog);
        });
    }
};

module.exports.enter = function(blog){
    var delay       = 500,
        interval    = 100,
        posts;

    if(blog.els.title){
        app.getModule('noizuLayout').enterTitle(blog);
    }

    if(blog.els.container){
        posts = blog.els.container.querySelectorAll('li');
        _.each(posts, function(post, i){
            $(post).css('opacity', 0).removeClass('hidden');

            vlc(post, {
                opacity     : [1, 0],
                translateX  : (i % 2 === 0)? [0, -10] : [0, 10],
                translateZ  : 0
            }, {
                duration    : 500,
                delay       : delay,
                easing      : 'easeInOutQuint',
                complete    : function(){
                    if( i === posts.length - 1){
                        app.emit('region.enter', blog);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.enter', blog);
    }
};

module.exports.quit = function(blog){
    var delay       = 0,
        interval    = 50,
        posts;

    if(blog.els.title){
        app.getModule('noizuLayout').quitTitle(blog);
    }

    if(blog.els.container){
        posts = blog.els.container.querySelectorAll('li');

        _.each(posts, function(post, i){
            vlc(post, {
                opacity     : 0,
                translateX  : (i % 2 === 0)? [-10, 0] : [10, 0],
                translateZ  : 0
            }, {
                duration    : 250,
                delay       : delay,
                easing      : 'easeInOutQuint',
                complete    : function(){
                    if( i === posts.length - 1){
                        app.emit('region.quit', blog);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.quit', blog);
    }
};


function blogSetup(blog){
    var breakpointH1 = _.indexOf(document.body.parentNode.className.split(' '), 'breakpoint-h1') > -1,
        breakpointH2 = _.indexOf(document.body.parentNode.className.split(' '), 'breakpoint-h2') > -1,
        containerWidth,
        columns,
        li,
        columnWidth,
        images,
        gutter;

    if(blog.els.container){
        columns         = 4;
        containerWidth  = $(blog.els.container).width();
        gutter          = (_.isFinite(blog.els.container.getAttribute('data-gutter')))? parseInt(blog.els.container.getAttribute('data-gutter')) : 21;

        if(breakpointH1){
            columns     = 2;
        }

        if(breakpointH2){
            columns     = 1;
        }

        columnWidth = Math.floor((containerWidth - (gutter * (columns - 1))) / columns);
        blog.vars.columnWidth = columnWidth;

        // set images

        if(!blog.els.images){
            blog.els.images = blog.els.container.querySelectorAll('img');
        }

        // set columns width

        $(blog.els.container).find('li').width(columnWidth);

        if(blog.vars.packery){
            blog.vars.packery.destroy();
        }
        
        blog.vars.packery = new Packery(blog.els.container, {
            itemSelector        : 'li',
            gutter              : gutter,
            transitionDuration  : '0.5s',
            isResizeBound       : false,
            columnWidth         : columnWidth
        });
    }
}


function blogListLoadMore(blog){
    // get load more url

    var url         = (blog.vars.nextPostsUrl)? blog.vars.nextPostsUrl : blog.els.loadMoreUrl.getAttribute('data-url'),
        $posts      = $(blog.el).find('.post'),
        $lastPost   = $posts.eq(-1),
        $loadMore;

    // load & append

    if(_.isString(url)){
        $.get(url, null, function(data, status){
            var $data           = $(data),
                $newPosts       = $data.find('.post'),
                $loadMoreUrl    = $data.find('#load-more-url');

            blog.vars.nextPostsUrl = ($loadMoreUrl.length)? $loadMoreUrl.attr('data-url') : false;

            if($posts.length && $lastPost.length){
                $lastPost.after($newPosts);
                $posts              = $(blog.el).find('.post');
                $loadMore           = $newPosts.filter('.post-load-more');
                $lastPost           = $posts.eq(-1);
                blog.els.posts  = blog.el.querySelectorAll('.post');

                blog.vars.packery.remove(blog.els.loadMore);

                if(!blog.vars.nextPostsUrl){
                    $newPosts = $newPosts.filter(':not(.post-load-more)');
                }
                
                blog.vars.packery.appended($newPosts.get());

                if(blog.vars.nextPostsUrl && $loadMore.length){
                    blog.els.loadMore = $loadMore.get(0);

                    $loadMore.on('click', function(){
                        blogListLoadMore(blog);
                    });
                }

                $newPosts
                    .css('width', blog.vars.columnWidth)
                    .removeClass('hidden');

                app.getModule('image').preloadImages();
                app.emit('historyX.do.setupPage');
            }

        }, 'html');
    }
}