"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(home){};

module.exports.enter = function(home){
    var $claimContent,
        $claimElements,
        $claim,
        $line3,
        $button,
        $posts,
        $postsContainer,
        durations   = [500, 750, 750, 250],
        delay       = 0,
        intervals   = [250, 250, 0, 0, 0, 0];

    // boxes

    if(home.els.boxesContainer){
        homeSetupBoxes(home);
    }

    // latest posts enter

    if(home.els.latestPost){
        $postsContainer = $(home.els.latestPost);
        $posts          = $postsContainer.find('a');

        $posts.css('opacity', 0);
        $postsContainer.removeClass('hidden');

        $posts.each(function(i){
            vlc(this, {
                opacity     : 1,
                translateX  : (i % 2 === 0)? [0, -20] : [0, 20],
                translateZ  : 0
            }, {
                duration    : 500,
                delay       : (home.els.claim)? 3000 : 1000,
                easing      : 'easeInOutCirc',
                complete    : function(el){
                    $(el).removeAttr('style');

                    if(!home.els.claim){
                        app.emit('region.enter', home);
                    }
                }
            });
        });
    }

    // claim enter

    if(home.els.claim){
        $claim          = $(home.els.claim);
        $claimContent   = $claim.find('#home-claim-content');
        $claimElements  = $claimContent.find('> *').not('.button').not('#home-claim-line-3');
        $button         = $claimContent.find('.button');
        $line3          = $claimContent.find('#home-claim-line-3');

        $claimElements.css('opacity', 0).removeClass('hidden');
        $button.css('opacity', 0).removeClass('hidden');
        $line3.css('opacity', 0).removeClass('hidden');

        vlc($claimContent.get(0), {
            perspective     : 1000
        }, 0);

        vlc($claimElements.get(), {
            transformOriginX    : '50%',
            transformOriginY    : '100%',
            rotateX             : 75,
            opacity             : 0,
            translateZ          : 0
        }, 0);

        $claim.removeClass('hidden');

        $claimElements.each(function(i){
            vlc(this, {
                opacity     : 1,
                rotateX     : 0
            }, {
                duration    : durations[i],
                easing      : 'easeInOutQuad',
                delay       : delay,
                complete    : function(el){
                    $(el).removeAttr('style');
                }
            });

            delay += intervals[i];
        });

        if($line3.length){
            $line3.css('opacity', 0);

            vlc($line3.get(0), {
                opacity     : 1,
                translateY  : [0, 15],
                translateZ  : 0
            }, {
                duration    : 750,
                easing      : 'easeInOutCirc',
                delay       : 1600,
                complete    : function(btn){
                    $(btn).removeAttr('style');
                }
            });
        }

        if($button.length){
            $button.css('opacity', 0);

            vlc($button.get(0), {
                opacity     : 1,
                translateY  : [0, -15],
                translateZ  : 0
            }, {
                duration    : 750,
                easing      : 'easeInOutCirc',
                delay       : 1600,
                complete    : function(btn){
                    $(btn).removeAttr('style');
                }
            });
        }

        _.delay(function(){
            app.emit('region.enter', home);
        }, 2000);
    }
    else {
        app.emit('region.enter', home);
    }
};

module.exports.quit = function(home){
    var delay       = 0,
        interval    = 100,
        easing      = 'easeInOutCirc',
        duration    = 300,
        translateX  = 10,
        claimEls,
        posts,
        timeout;

    if(home.els.claim){
        claimEls = home.els.claim.querySelectorAll('#home-claim-content > *');
        _.each(claimEls, function(el, i){
            vlc(el, {
                translateX  : (i % 2 === 0)? [translateX, 0] : [-translateX, 0],
                translateZ  : 0,
                opacity     : 0
            }, {
                duration    : duration,
                delay       : delay,
                easing      : easing,
                complete    : function(){
                    if(i === claimEls.length - 1){
                        app.emit('region.quit', home);
                    }
                }
            });
        });
    }

    if(home.els.latestPost){
        posts = home.els.latestPost.querySelectorAll('a');
        _.each(posts, function(el, i){
            vlc(el, {
                translateX  : (i % 2 === 0)? [translateX, 0] : [-translateX, 0],
                translateZ  : 0,
                opacity     : 0
            }, {
                duration    : duration,
                delay       : delay,
                easing      : easing,
                complete    : function(){
                    if((i === posts.length - 1) && !home.els.claim){
                        app.emit('region.quit', home);
                    }
                }
            });
        });
    }

    if(home.els.boxesContainer){
        if(home.els.boxes){
            vlc(home.els.boxes, {
                opacity     : 0,
                translateY  : 20
            }, {
                duration : 500,
                easing   : 'easeInOutQuad'
            });
        }
    }

    if( (!home.els.claim) && (!home.els.latestPost) ){
        app.emit('region.quit', home);
    }
};

function homeSetupBoxes(home){
    var duration        = 400,
        easing          = 'easeInOutCirc',
        maxHeight       = 0,
        bottomDefault   = (_.isFinite(home.els.boxesContainer.getAttribute('data-bottom')))? _.parseInt(home.els.boxesContainer.getAttribute('data-bottom')) : 208,
        fromButton      = false,
        breakpointH2    = _.indexOf(document.body.parentNode.className.split(' '), 'breakpoint-h2') > -1,
        loaded          = 0,
        boxDelay        = 1000,
        boxInterval     = 250,
        opacityDefault,
        bottom; 

    home.els.boxes = home.els.boxesContainer.querySelectorAll('li');

    // preload

    _.each(home.els.boxes, function(box, i){
        var img = box.querySelector('img');

        app.getModule('image')
            .preload(img.src)
            .then(function(src){
                loaded++;
                if(loaded === home.els.boxes.length){
                    _.defer(function(){
                        _.each(home.els.boxes, function(box, i){
                            var $box                = $(box),
                                $boxContent         = $box.find('.home-boxes-content'),
                                boxHeight           = $box.height(),
                                boxContentHeight    = $box.find('.home-boxes-content').outerHeight();

                            if(i === 0){
                                opacityDefault                  = (breakpointH2)? 1 : $box.css('opacity');
                                home.vars.boxesOpacityDefault   = opacityDefault;
                            }

                            maxHeight = (boxContentHeight > maxHeight)? boxContentHeight : maxHeight;
                        });

                        bottom = bottomDefault - maxHeight;

                        home.vars.boxesBottom = bottom;

                        $(home.els.boxesContainer).height(maxHeight);
                        $(home.els.boxes).css('bottom', bottom);

                        _.each(home.els.boxes, function(box, i){
                            $(box).css('opacity', 0).removeClass('hidden');

                            vlc(box, {
                                opacity     : [home.vars.boxesOpacityDefault, 0],
                                translateY  : [0, 20]
                            }, {
                                duration : 500,
                                easing   : 'easeInOutQuad',
                                delay    : boxDelay
                            });

                            boxDelay += boxInterval;
                        });
                    });
                }
            });

    });
}

function homeSetupBoxesPosition(home){

}