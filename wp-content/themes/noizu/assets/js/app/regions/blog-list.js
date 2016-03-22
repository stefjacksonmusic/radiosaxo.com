"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery;

module.exports.init = function(blogList){
    blogList.els.posts      = blogList.el.querySelectorAll('.post');
    blogList.vars.scrollTop = 0;
    blogList.els.$container = $('#container');

    // scroll setup

    blogList.els.$container.on('scroll', function(){
        blogList.vars.scrollTop = this.scrollTop;
        blogListScroll(blogList);
    });

    blogListScroll(blogList);

    // find videos

    $(blogList.el.querySelectorAll('.post-video')).fitVids();

    // load more

    if(blogList.els.loadMore && blogList.els.loadMoreUrl){
        $(blogList.els.loadMore).on('click', function(){
            blogListLoadMore(blogList);
        });
    }
};

module.exports.enter = function(blogList){
    if(blogList.els.title){
        app.getModule('noizuLayout').enterTitle(blogList, function(){
            if(!blogList.els.sidebar){
                app.emit('region.enter', blogList);
            }
        });
    }

    if(blogList.els.sidebar){
        $(blogList.els.sidebar).css('opacity', 0).removeClass('hidden');

        vlc(blogList.els.sidebar, {
            translateX  : [0, 15],
            translateZ  : 0,
            opacity     : 1
        }, {
            duration    : 500,
            easing      : 'easeInOutQuint',
            delay       : 1000,
            complete    : function(){
                app.emit('region.enter', blogList);
            }
        });
    }

    if((!blogList.els.sidebar) && (!blogList.els.title)){
        app.emit('region.enter', blogList);
    }
};

module.exports.quit = function(blogList){
    var delay       = 0,
        interval    = 50;

    app.getModule('noizuLayout').quitTitle(blogList);

    if(blogList.els.sidebar){
        vlc(blogList.els.sidebar, {
            translateX  : [15, 0],
            translateZ  : 0,
            opacity     : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutQuint',
            complete    : function(){
                if((!blogList.els.posts) || blogList.els.posts.length === 0){
                    app.emit('region.quit', blogList);
                }
            }
        });
    }

    if(blogList.els.posts && blogList.els.posts.length){
        _.each(blogList.els.posts, function(post, i){
            vlc(post, {
                opacity     : 0,
                translateX  : (i % 2 === 0)? 10 : -10,
                translateZ  : 0
            }, {
                duration    : 250,
                easing      : 'easeInOutQuint',
                delay       : delay,
                complete    : function(el){
                    if(i === blogList.els.posts.length - 1){
                        app.emit('region.quit', blogList);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        if(!blogList.els.sidebar){
            app.emit('region.quit', blogList);
        }
    }
};

function blogListScroll(blogList){
    var offset = 100,
        $post,
        postTop;

    blogList.vars.viewportHeight = blogList.els.$container.outerHeight();

    _.each(blogList.els.posts, function(post){
        $post   = $(post);
        postTop = $post.position().top;

        if( (postTop >= blogList.vars.scrollTop) && (postTop <= (blogList.vars.scrollTop + blogList.vars.viewportHeight - offset)) && $post.hasClass('hidden') ){
            $post.css('opacity', 0).removeClass('hidden');

            vlc(post, {
                opacity     : 1,
                translateY  : [0, 25],
                translateZ  : 0
            }, {
                duration    : 500,
                easing      : 'easeInOutQuint',
                delay       : 200,
                complete    : function(els){
                    $(els).removeAttr('style');
                }
            });
        }
    });
}

function blogListLoadMore(blogList){
    // get load more url

    var url         = (blogList.vars.nextPostsUrl)? blogList.vars.nextPostsUrl : blogList.els.loadMoreUrl.getAttribute('data-url'),
        $loadMore   = $(blogList.els.loadMore).detach(),
        $posts      = $(blogList.el).find('.post'),
        $lastPost   = $posts.eq(-1);

    // load & append

    if(_.isString(url)){
        $.get(url, null, function(data, status){
            var $data           = $(data),
                $newPosts       = $data.find('.post').not('#load-more'),
                $loadMoreUrl    = $data.find('#load-more-url');

            blogList.vars.nextPostsUrl = ($loadMoreUrl.length)? $loadMoreUrl.attr('data-url') : false;

            if($posts.length && $lastPost.length){
                $lastPost.after($newPosts);
                $loadMore.addClass('hidden');
                $posts              = $(blogList.el).find('.post');
                $lastPost           = $posts.eq(-1);
                if(blogList.vars.nextPostsUrl){
                    $lastPost.after($loadMore);
                }
                blogList.els.posts  = blogList.el.querySelectorAll('.post');

                blogListScroll(blogList);
            }

        }, 'html');
    }
}