"use strict";

var _                   = require('lodash'),
    stackBlur           = require('../../vendors/stackblur.js'),
    vlc                 = window.velocity,
    app                 = window.app,
    $                   = window.jQuery,
    containerSelector   = '#container',
    image;

module.exports.init = function(bkg){
    var $el = $(bkg.el),
        $region;

    // move region under container

    $region = $el.detach();
    $(containerSelector).prepend($region);

    // init setup

    if($el.hasClass('background-video') && bkg.els.video){
        bkg.vars.type = 'video';
    }

    if($el.hasClass('background-images')){
        bkg.vars.type = 'images';
    }

    if($el.hasClass('background-blur')){
        bkg.vars.type = 'blur';
    }

    switch(bkg.vars.type){
        case 'video':
            setupVideo(bkg);
            break;

        case 'images':
            setupImages(bkg);
            break;

        case 'blur':
            setupBlur(bkg);
            break;
    }

    // listeners

    bkg.listeners.on(app, 'background.image.loaded.first', function(){
        setImage(bkg, 0);
    });

    bkg.listeners.on(app, 'background.image.loaded.all', function(){
        if(bkg.vars.images.length > 1){
            setImageTimeout(bkg);
        }
    });

    bkg.listeners.on(app, 'sidebar.toggle', function(){
        bkgSidebarToggle(bkg);
    });
};

module.exports.enter = function(bkg){
    $(bkg.el).css('opacity', 0).removeClass('hidden');

    vlc(bkg.el, {
        opacity     : [1, 0],
        scale       : [1, 1.2]
    }, {
        duration    : 2500,
        easing      : 'easeOutCirc',
        complete    : function(){
            app.emit('region.enter', bkg);
        }
    });
};

module.exports.quit = function(bkg){
    vlc(bkg.el, {
        opacity     : [0, 1],
        scale       : [1.2, 1]
    }, {
        duration    : 1000,
        easing      : 'easeOutCirc',
        complete    : function(){
            app.emit('region.quit', bkg);
        }
    });
};

// sidebar toggle

function bkgSidebarToggle(bkg){
    var $bkg            = $(bkg.el),
        $sidebar        = $('#off-screen-sidebar'),
        isClosed        = $sidebar.hasClass('closed'),
        sidebarWidth    = $sidebar.width();

    if(!isClosed){
        $bkg.removeClass('hide');
    }

    vlc(bkg.el, {
        opacity     : (isClosed)? 0 : 1,
        translateZ  : 0
    }, {
        duration    : 500,
        easing      : 'easeInOutCirc',
        complete    : function(){
            if(isClosed){
                $bkg.addClass('hide');
            }
        }
    });
}

// images functions

function setupImages(bkg){
    var $images = $(bkg.el).find('img'),
        loaded  = 0;

    image = app.getModule('image');

    // image template

    bkg.vars.imageTemplate  = _.template('<div class="background-image background-image-over" style="background-image:url(\'<%= src %>\')"></div>');
    bkg.vars.images         = [];
    bkg.vars.loaded         = false;
    bkg.vars.imagesDelay    = (_.parseInt(bkg.el.getAttribute('data-background-delay')) > 2000)? _.parseInt(bkg.el.getAttribute('data-background-delay')) : 7500;

    // preload images

    $images.each(function(i){
        bkg.vars.images.push(this.src);

        image.preload(this).then(function(src){
            loaded++;
            if(i === 0){
                app.emit('background.image.loaded.first');
            }

            if(loaded === $images.length){
                bkg.vars.loaded = true;
                app.emit('background.image.loaded.all');
            }
        });

        $(this).remove();
    });
}

function setImage(bkg, i){
    var index   = (_.isNumber(i))? i : bkg.vars.imageIndex + 1,
        $bkg    = $(bkg.el),
        div,
        $prevDiv,
        $div;

    // reset index & set index to bkg

    if(index === bkg.vars.images.length){
        index = 0;
    }

    bkg.vars.imageIndex = index;
    
    div = bkg.vars.imageTemplate({ src : bkg.vars.images[index] });

    // append div & tween

    $bkg.append(div);
    $prevDiv    = $bkg.find('.background-image').not('.background-image-over');
    $div        = $bkg.find('.background-image-over');

    vlc($div.get(0), {
        opacity     : 1,
        translateZ  : 0
    }, {
        duration    : 2500,
        easing      : 'easeInOutCirc',
        complete    : function(){
            if($prevDiv.length){
                $prevDiv.remove();
            }
            $div.removeClass('background-image-over');

            // set timeout

            if(bkg.vars.images.length > 1 && bkg.vars.loaded){
                setImageTimeout(bkg);
            }
        }
    });
}

function setImageTimeout(bkg){
    clearTimeout(bkg.vars.timeout);

    bkg.vars.timeout = setTimeout(function(){
        setImage(bkg);
    }, bkg.vars.imagesDelay);
}

// video functions

function setupVideo(bkg){
    var video   = bkg.els.video,
        mp4Url  = video.getAttribute('data-mp4'),
        webmUrl = video.getAttribute('data-webm'),
        sourceMp4, sourceWebM;

    // append sources

    if(mp4Url){
        sourceMp4 = document.createElement('source');
        sourceMp4.setAttribute('src', mp4Url);
        sourceMp4.setAttribute('type', 'video/mp4');
        video.appendChild(sourceMp4);
    }

    if(webmUrl){
        sourceWebM = document.createElement('source');
        sourceWebM.setAttribute('src', webmUrl);
        sourceWebM.setAttribute('type', 'video/webm');
        video.appendChild(sourceWebM);
    }

    video.volume = 0;

    if(video.videoWidth === 0){
        bkg.listeners.on(video, 'loadedmetadata', function(){
            setupVideoSize(bkg, video);
            video.play();
        });
    }
    else {
        _.defer(function(){
            setupVideoSize(bkg, video);
            video.play();
        });
    }

    // loop video

    bkg.listeners.on(video, 'ended', function(){
        video.play();
    });

    // center on resize

    if(_.isElement(video)){
        bkg.listeners.on(app, 'window.resize', function(){
            setupVideoSize(bkg, video);
        });
    }
}

function setupVideoSize(bkg, video){
    var videoSize       = {
            width   : video.videoWidth,
            height  : video.videoHeight
        },
        $video          = $(video),
        $container      = $video.parent(),
        containerSize   = {
            width   : $(video).parent().width(),
            height  : $(video).parent().height()
        },
        widthRatio      = containerSize.width / videoSize.width,
        heightRatio     = containerSize.height / videoSize.height,
        ratio           = (widthRatio > heightRatio)? widthRatio : heightRatio,
        ratioType       = (widthRatio > heightRatio)? 'width' : 'height';

    if($container.css('overflow') !== 'hidden'){
        $container.css('overflow', 'hidden');
    }

    if(_.indexOf(['relative', 'absolute', 'fixed'], $container.css('position')) < 0){
        $container.css('position', 'relative');
    }

    // cover video

    $video.css({
        position : 'absolute',
        top      : 0,
        left     : 0,
        width    : Math.round(videoSize.width * ratio),
        height   : Math.round(videoSize.height * ratio)
    });

    switch(ratioType){
        case 'width':
            $video.css('top', Math.round(($video.height() - containerSize.height) / 2) * -1);
            break;

        case 'height':
            $video.css('left', Math.round(($video.width() - containerSize.width) / 2) * -1);
            break;
    }

    if($video.hasClass('hidden')){
        $video.removeClass('hidden');
    }
}

function setupBlur(bkg){
    var $img = $(document.body).find('img.image-background-blur'),
        img,
        src;

    image = app.getModule('image');

    var blurImage = function(){
        stackBlur.stackBlurImage('background-blur-image', bkg.els.blur.id, 50);
    };

    if($img.length){
        img = $img.get(0);
        src = img.src;

        if(!img.id){
            img.id = 'background-blur-image';
        }
        
        if(img.naturalWidth){
            blurImage();
        }
        else {
            image.preload(img).then(function(img){
                blurImage();
            });
        }
    }
}