(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// expose objects

window.velocity     = require('../vendors/velocity.min.js');
window._            = require('lodash');
window.noizu        = (window.noizu)? window.noizu : {};
window.screenFull   = require('../vendors/screenfull.min');

// init deliverance

window.app = require('deliverance')({
    logs    : true,
    modules : {
        historyX : {
            pushState               : (document.querySelector("html").getAttribute('data-ajax-load') === '0')? false : true,
            contentSelector         : '#content',
            anchorsSelector         : 'a:not(.history-ignore):not(.history-set):not([target="_blank"]):not(.ab-item):not(.comment-reply-link):not(#cancel-comment-reply-link):not([hreflang])'
        },
        layout : {
            breakpoints : {
                'admin-bar-mobile'  : 'screen and (max-width: 782px)',
                'breakpoint-h1'     : 'screen and (max-width: 1024px) and (min-width: 540px)',
                'breakpoint-h2'     : 'screen and (max-width: 540px)',
                'breakpoint-v1'     : 'screen and (max-height: 800px) and (min-height: 501px)',
                'breakpoint-v2'     : 'screen and (max-height: 500px)'
            }
        }
    }
}).registerModule('noizuLayout',    require('./modules/noizu-layout'))
  .registerModule('image',          require('./modules/image'))
  .registerModule('audioPlayer',    require('./modules/audio-player'))
  .registerModule('photoSwipe',     require('./modules/photoswipe'))
  .registerModule('map',            require('./modules/map'))
  .init();

// register regions

app.getModule('regions')
    .register('bar',            require('./regions/bar'))
    .register('background',     require('./regions/background'))
    .register('sidebar',        require('./regions/sidebar'))
    .register('icons-bar',      require('./regions/icons-bar'))
    .register('home',           require('./regions/home'))
    .register('page-one',       require('./regions/page-one'))
    .register('page-two',       require('./regions/page-two'))
    .register('page-three',     require('./regions/page-three'))
    .register('page-four',      require('./regions/page-four'))
    .register('share-on',       require('./regions/share-on'))
    .register('player',         require('./regions/player'))
    .register('playlist',       require('./regions/playlist'))
    .register('mobile-footer',  require('./regions/mobile-footer'))
    .register('slider',         require('./regions/slider'))
    .register('posts-list',     require('./regions/posts-list'))
    .register('image',          require('./regions/image'))
    .register('video',          require('./regions/video'))
    .register('events',         require('./regions/events'))
    .register('tracklist',      require('./regions/tracklist'))
    .register('contact-form',   require('./regions/contact-form'))
    .register('gallery',        require('./regions/gallery'))
    .register('map',            require('./regions/map'))
    .register('blog',           require('./regions/blog'))
    .register('grid',           require('./regions/grid'))
    .register('profiles',       require('./regions/profiles'))
    .register('countdown',      require('./regions/countdown'))
    .register('blog-list',      require('./regions/blog-list'))
    .register('collection',     require('./regions/collection'))
    .register('404',            require('./regions/404'))
    .register('post',           require('./regions/post'))
    .register('full-video',     require('./regions/full-video'))
    .register('full-menu',      require('./regions/full-menu'))
    .register('comments',       require('./regions/comments'));

// vars

app.vars.isFirefox      = typeof InstallTrigger !== 'undefined';
app.vars.isOpera        = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
app.vars.isSafari       = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
app.vars.isChrome       = !!window.chrome && !app.vars.isOpera;
app.vars.isIE           = /*@cc_on!@*/false || !!document.documentMode;
app.vars.quitEasing     = 'easeInOutQuint';
app.vars.quitDuration   = 500;

// livereload

if(window.location.hostname === 'localhost' && jQuery('body').hasClass('dev')){
    var script = document.createElement('script');
    script.setAttribute('src', 'http://localhost:35729/livereload.js');
    if(document.body){
        document.body.appendChild(script);
    }
    else {
        app.once('document.ready', function(){
            document.body.appendChild(script);
        }); 
    }
}
},{"../vendors/screenfull.min":44,"../vendors/velocity.min.js":46,"./modules/audio-player":2,"./modules/image":3,"./modules/map":4,"./modules/noizu-layout":5,"./modules/photoswipe":6,"./regions/404":7,"./regions/background":8,"./regions/bar":9,"./regions/blog":11,"./regions/blog-list":10,"./regions/collection":12,"./regions/comments":13,"./regions/contact-form":14,"./regions/countdown":15,"./regions/events":16,"./regions/full-menu":17,"./regions/full-video":18,"./regions/gallery":19,"./regions/grid":20,"./regions/home":21,"./regions/icons-bar":22,"./regions/image":23,"./regions/map":24,"./regions/mobile-footer":25,"./regions/page-four":26,"./regions/page-one":27,"./regions/page-three":28,"./regions/page-two":29,"./regions/player":30,"./regions/playlist":31,"./regions/post":32,"./regions/posts-list":33,"./regions/profiles":34,"./regions/share-on":35,"./regions/sidebar":36,"./regions/slider":37,"./regions/tracklist":38,"./regions/video":39,"deliverance":47,"lodash":56}],2:[function(require,module,exports){
"use strict";

var _               = require('lodash'),
    trackIndexId    = 0,
    playerIndexId   = 0,
    player,
    emitter;

/*
 * EVENTS
 * audioplayer.track.duration
 * audioplayer.track.canplay
 * audioplayer.track.canplay-first
 * audioplayer.track.ended
 * audioplayer.tracks
 * audioplayer.next
 * audioplayer.prev
 * audioplayer.play
 * audioplayer.onplay
 * audioplayer.onpause
 * audioplayer.track.changed
 */

function AudioPlayer(args){
    if(!this instanceof AudioPlayer){
        return new AudioPlayer(args);
    }

    // private vars

    var _this       = this,
        audio       = getAudioElement(),
        listeners   = [],
        tracks      = [],
        index       = 0;

    // properties

    Object.defineProperty(this, 'id', {
        enumerable  : true,
        value       : ++playerIndexId
    });

    this.browserSupport = !!(audio.canPlayType && audio.canPlayType('audio/mpeg;').replace(/no/, ''));
    this.playlist       = [];
    this.autoplay       = (args && _.isBoolean(args.autoplay))? args.autoplay : false;

    // listeners

    listeners = [{
        event       : 'audioplayer.next',
        callback    : function(audioplayer){
            _this.next();
        }
    }, {
        event       : 'audioplayer.prev',
        callback    : function(audioplayer){
            _this.prev();
        }
    }, {
        event       : 'audioplayer.play',
        callback    : function(track){
            // find track
            if(track instanceof AudioPlayerTrack){
                _.each(tracks, function(_track, i){
                    if(_track === track){
                        setAudioTrack(i);
                    }
                });
            }
            // play
             _this.play();
        }
    }, {
        event       : 'audioplayer.pause',
        callback    : function(audioplayer){
            _this.pause();
        }
    }, {
        event       : 'audioplayer.set',
        callback    : function(data){
            if(_.isArray(data)){
                _this.setTracks(data);
            }
        }
    }, {
        event       : 'audioplayer.getTracks',
        callback    : function(callback){
            if(_.isFunction(callback)){
                callback(_this.getTracks());
            }
        }
    }, {
        event       : 'audioplayer.getIndex',
        callback    : function(callback){
            if(_.isFunction(callback)){
                callback(index);
            }
        }
    }];

    listeners.forEach(function(e){
        emitter.on(e.event, e.callback);
    });

    // methods

    this.play = function(){
        if(_.isElement(audio)){
            audio.play();
            emitter.emit('audioplayer.onplay', _this);
        }
        return _this;
    };

    this.pause = function(){
        if(_.isElement(audio)){
            audio.pause();
            emitter.emit('audioplayer.onpause', _this);
        }
        return _this;
    };

    this.stop = function(){
        if(_.isElement(audio) && audio.src){
            audio.pause();
            if(audio.readyState > 0){
                audio.currentTime = 0;
            }
        }
        return _this;
    };

    this.prev = function(){
        var nextIndex = (index - 1 < 0)? tracks.length - 1 : index - 1;
        if(nextIndex >= 0){
            setAudioTrack(nextIndex);
            _this.play();
        }
        return _this;
    };

    this.next = function(){
        var nextIndex = (index + 1 === tracks.length)? 0 : index + 1;
        if(nextIndex <= tracks.length){
            setAudioTrack(nextIndex);
            _this.play();
        }

        return _this;
    };

    this.getCurrentTime = function(){
        if(audio){
            return audio.currentTime;
        }

        return 0;
    };

    this.getCurrentDuration = function(){
        var seconds     = Math.round(_this.getCurrentTime()),
            minutes     = Math.floor(seconds / 60),
            duration    = minutes + ((seconds % 60) / 100);

        return duration.toFixed(2);
    };

    this.setTracks = function(_tracks){
        if(!_.isArray(_tracks)){
            return;
        }

        if(!_this.browserSupport){
            return _this;
        }

        if(audio){
            _this.stop();
        }

        // remove previous audio elements

        if(_.isArray(tracks)){
            tracks.forEach(function(track){
                track.audio = undefined;
                track       = undefined;
            });
        }

        tracks = [];

        _tracks.forEach(function(_track){
            var track = new AudioPlayerTrack(_track);
            if(track instanceof AudioPlayerTrack){
                tracks.push(track);
            }
        });

        if(tracks.length){
            setAudioTrack(0);
            emitter.emit('audioplayer.tracks', tracks);
            tracksPreload(_this, tracks);
        }
        else {
            setAudioTrack(null);
        }

        return _this;
    };

    this.setTrack = function(_track){
        this.setTracks([_track]);
        return _this;
    };

    this.getTracks = function(){
        if(tracks && tracks.length){
            return _.clone(tracks);
        }

        return false;
    };

    this.getTrack = function(){
        if(tracks[index]){
            return _.clone(tracks[index]);
        }
    };

    this.getIndex = function(){
        return index;
    };

    this.clearTracks = function(){
        _this.setTracks([]);
        return _this;
    };

    this.clear = function(){
        _this.clearTracks();
        listeners.forEach(function(e){
            emitter.off(e.event, e.callback);
        });

        return _this;
    };

    function setAudioTrack(_index){
        if(tracks[_index]){
            _this.stop();

            index   = _index;
            audio   = tracks[index].audio;

            emitter.emit('audioplayer.track.changed', _this);
        }
        else {
            index  = -1;
            audio  = null;
        }

        return _this;
    }
}

function AudioPlayerTrack(args){
    if(!this instanceof AudioPlayerTrack){
        return new AudioPlayerTrack(args);
    }

    var _this = this;

    // test args

    if(!_.isPlainObject(args)){
        return;
    }

    if(!_.isString(args.name)){
        return;
    }

    if(!_.isString(args.path)){
        return;
    }

    // properties

    Object.defineProperty(this, 'id', {
        enumerable  : true,
        value       : ++trackIndexId
    });

    this.name       = args.name;
    this.path       = args.path;
    this.artist     = (_.isString(args.artist))? args.artist : null;
    this.audio      = getAudioElement({ preload : 'none', 'src' : this.path });
    this.duration   = (_.isString(args.duration))? args.duration : '00:00';
    this.stores     = {};

    // set stores

    if(args.stores && _.isPlainObject(args.stores)){
        _.each(args.stores, function(url, store){
            if(_.isString(url)){
                _this.stores[store.trim().toLowerCase()] = url.trim();
            }
        });
    }
}

// private functions

function tracksPreload(audioplayer, tracks){
    if(!_.isArray(tracks)){
        return;
    }

    tracks.forEach(function(track, i){
        // track.audio.addEventListener('loadedmetadata', function loadedmetadata(e){
        //     var seconds  = _.parseInt(e.target.duration.toFixed(0)),
        //         minutes  = Math.floor( seconds / 60),
        //         duration = minutes + ((seconds % 60) / 100);

        //     track.seconds   = seconds;
        //     track.duration  = duration.toFixed(2);

        //     emitter.emit('audioplayer.track.duration', track);

        //     track.audio.removeEventListener('loadedmetadata', loadedmetadata);
        // });

        // track.audio.addEventListener('canplay', function canplay(){
        //     track.canplay = true;
        //     emitter.emit('audioplayer.track.canplay', track);

        //     // set preload to none to solve a chrome bug
        //     track.

        //     if(i === 0){
        //         emitter.emit('audioplayer.track.canplay-first', track);
        //     }

        //     track.audio.removeEventListener('canplay', canplay);
        // });

        track.audio.addEventListener('ended', function(){
            emitter.emit('audioplayer.track.ended', track);
            emitter.emit('audioplayer.next', audioplayer);
        });
    });
}

function getAudioElement(args){
    var audio = document.createElement('audio');
    audio.volume = 1;

    if(_.isPlainObject(args)){
        _.each(args, function(value, attribute){
            audio.setAttribute(attribute, value);
        });
    }

    return audio;
}

// public attributes & methods

module.exports.AudioPlayer = AudioPlayer;

module.exports.init = function(){
    emitter             = this;
};

module.exports.getPlayer = function(args){
    if(!player){
        player = new AudioPlayer(args);
    }

    return player;
};
},{"lodash":56}],3:[function(require,module,exports){
"use strict";

var _       = require('lodash'),
    Promise = require('es6-promise').Promise,
    vlc     = window.velocity,
    app;

module.exports.init = function(){
    app = this;

    app.on('regions.in', function(){
        module.exports.preloadImages();
    });
};

module.exports.preload = function(img){
    var src,
        image;

    if(!(_.isElement(img) || _.isString(img))){
        return false;
    }

    if(_.isElement(img)){
        src = img.getAttribute('src');
    }

    if(_.isString(img)){
        src = img;
    }

    return new Promise(function(resolve, reject){
        image = document.createElement('img');
        image.src = src;

        if(image.complete && image.naturalWidth){
            app.emit('image.loaded', img);
            resolve(img);
        }
        else {
            image.addEventListener('load', function(){
                app.emit('image.loaded', img);
                resolve(img);
            }, false);
        }
    });
};



module.exports.preloadImages = function(){
    var images = document.querySelectorAll('.image-preload');

    _.each(images, function(img){
        module.exports.preload(img).then(function(img){
            img.style.opacity   = 0;
            img.className       = _.pull(img.className.split(' '), "image-preload").join(' ');

            vlc(img, {
                opacity     : [1, 0],
                scale       : [1, 0.95]
            }, {
                duration    : 1000,
                easing      : 'easeInOutQuint',
                delay       : 100,
                complete    : function(img){
                    img[0].removeAttribute('style');
                }
            });
        });
    });
};
},{"es6-promise":54,"lodash":56}],4:[function(require,module,exports){
"use strict";

var _       = require('lodash'),
    $       = window.jQuery,
    vlc     = window.velocity,
    hx,
    maps,
    app;

module.exports.init = function(){
    app = this;
    hx  = app.getModule('historyX');

    app.on('regions.in', function(){
        var $maps   = $(hx.config.contentSelector).find('.region-map'),
            indexId = 1;
        
        maps    = [];

        $maps.each(function(){
            var $map  = $(this),
                mapId = ['map-', indexId].join('');

            maps.push({
                id   : mapId,
                lat  : $map.data('lat'),
                lng  : $map.data('lng'),
                type : $map.data('type'),
                zoom : parseInt($map.data('zoom'))
            });

            $map.attr('id', mapId);
            indexId++;
        });

        app.on('map.apiInit', setup);
    });

    app.on('historyX.load.complete.html', function(){
        // remove google framework
        delete window.google;
    });
};

function setup(){
    if(_.isArray(maps)){
        maps.forEach(function(map){

            var mapType = null;
            switch(map.type){
                case 'ROADMAP':
                    mapType = window.google.maps.MapTypeId.ROADMAP;
                    break;

                case 'SATELLITE':
                    mapType = window.google.maps.MapTypeId.SATELLITE;
                    break;

                case 'HYBRID':
                    mapType = window.google.maps.MapTypeId.HYBRID;
                    break;

                case 'TERRAIN':
                    mapType = window.google.maps.MapTypeId.TERRAIN;
                    break;

                default:
                    mapType = window.google.maps.MapTypeId.ROADMAP;
                    break;
            }

            map.position = new window.google.maps.LatLng(map.lat, map.lng);

            map.map = new window.google.maps.Map($(['#', map.id].join('')).find('.map-content').get(0), {
                center      : map.position,
                zoom        : map.zoom,
                mapTypeId   : mapType
            });

            map.marker = new window.google.maps.Marker({
                position    : map.position,
                map         : map.map
            });
        });
    }
}
},{"lodash":56}],5:[function(require,module,exports){
"use strict";

var _       = require('lodash'),
    $       = window.jQuery,
    vlc     = window.velocity,
    hx,
    app;

module.exports.init = function(){
    app = this;
    hx  = app.getModule('historyX');

    // wp bar fix

    if(document.body && document.body.className.search('admin-bar') > -1){
        var style = document.createElement('style');
        style.innerHTML = 'html { margin-top: 0 !important }';
        document.body.appendChild(style);
    }

    app.on('historyX.load.complete.html', function(){
        scrollToTop();
    });

    app.on('regions.in', function(){
        replaceAdminBar();
        replaceBodyClasses();
        parseFullScreenRegion();
        parseDarkBacgroundRegion();
        parseIconsBarsFillRegion();
    });
};

module.exports.quitRegion = function(region){
    vlc(region.el, {
        scale       : 0.9,
        opacity     : 0,
        translateZ  : 0
    }, {
        duration    : 500,
        delay       : _.random(0, 300),
        easing      : 'easeOutExpo',
        complete    : function(){
            app.emit('region.quit', region);
        }
    });
};

module.exports.enterTitle = function(region, cb){
    if(region.els.title){
        $(region.els.title).css('opacity', 0).removeClass('hidden');

        vlc(region.els.title, {
            opacity     : [1, 0],
            translateX  : [0, 10],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 500,
            easing      : 'easeInOutQuint',
            complete    : function(el){
                if(_.isFunction(cb)){
                    cb.call(el);
                }
            }
        });
    }
};

module.exports.quitTitle = function(region, cb){
    if(region.els.title){
        vlc(region.els.title, {
            opacity     : [0, 1],
            translateX  : [-10, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutQuint',
            complete    : function(els){
                if(_.isFunction(cb)){
                    cb.call(els);
                }
            }
        });
    }
};

function replaceBodyClasses(){
    if(window.mthemesCurrentBodyClasses && _.isString(window.mthemesCurrentBodyClasses)){
        document.body.className = window.mthemesCurrentBodyClasses;
    }
}

// add full-screen class to container
function parseFullScreenRegion(){
    var content             = document.querySelector(hx.config.contentSelector),
        fullScreenRegion    = content.querySelector('.region-full-screen'),
        $container          = $(content).parent();

    if(_.isElement(fullScreenRegion)){
        $container.addClass('full-screen');
    }
    else {
        $container.removeClass('full-screen');
    }
}

// add dark-background class to container
function parseDarkBacgroundRegion(){
    var content              = document.querySelector(hx.config.contentSelector),
        darkBackgroundRegion = content.querySelector('.region-dark-background'),
        $container           = $(content).parent();

    if(_.isElement(darkBackgroundRegion)){
        $container.addClass('dark-background');
    }
    else {
        $container.removeClass('dark-background');
    }
}

// add icons-bar-fill class to container
function parseIconsBarsFillRegion(){
    var bar                 = document.querySelector('#icons-bar'),
        content             = document.querySelector(hx.config.contentSelector),
        fullScreenRegion    = content.querySelector('.region-icons-bar-fill'),
        $container          = $(content).parent(),
        toggleClass;

    if(_.isElement(fullScreenRegion) && !$container.hasClass('icons-bar-fill')){
        toggleClass = true;
    }

    if(!_.isElement(fullScreenRegion) && $container.hasClass('icons-bar-fill')){
        toggleClass = true;
    }

    if(toggleClass){
        vlc(bar, {
            opacity     : [0, 1],
            translateY  : [-15, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeOutExpo',
            delay       : 250,
            complete    : function(){
                if(_.isElement(fullScreenRegion)){
                    $container.addClass('icons-bar-fill');
                }
                else {
                    $container.removeClass('icons-bar-fill');
                }

                vlc(bar, 'reverse');
            }
        });
    }
}

function scrollToTop(){ 
    vlc(document.querySelector('#scroll'), "scroll", {
        container   : document.querySelector('#container'),
        duration    : 500,
        easing      : 'easeOutQuart',
        offset      : -50
    });
}

function replaceAdminBar(){
    var adminBars = document.body.querySelectorAll('#wpadminbar'),
        oldAdminBar, newAdminBar;

    if(adminBars.length === 2){
        oldAdminBar = _.filter(adminBars, function(adminBar){
            return adminBar.parentNode === document.body;
        })[0];

        if(oldAdminBar){
            newAdminBar = _.filter(adminBars, function(adminBar){
                return adminBar !== oldAdminBar;
            })[0];
        }

        if(oldAdminBar && newAdminBar){
            $(oldAdminBar).replaceWith(newAdminBar);
        }
    }
}
},{"lodash":56}],6:[function(require,module,exports){
"use strict";

var _               = require('lodash'),
    // $               = window.jQuery,
    PhotoSwipe      = require('../../vendors/photoswipe.min'),
    PhotoSwipeUi    = require('../../vendors/photoswipe-ui-default.min'),
    options         = { 
        history             : false,
        bgOpacity           : 0.9,
        showHideOpacity     : true
    },
    gallery,
    images,
    imagesSet,
    emitter,
    psEl;

module.exports.init = function(){
    emitter = this;

    // events

    emitter.on('document.ready', function(){
        psEl = document.querySelector('.pswp');
    });

    emitter.on('photoswipe.show', function(i){
        var opts = _.assign(options, { index : i });

        if(_.isElement(psEl) && _.isArray(imagesSet) && _.isPlainObject(opts) ){
            gallery = new PhotoSwipe(psEl, PhotoSwipeUi, imagesSet, opts);
            gallery.init();
        }
    });

    emitter.on('regions.in', function(){
        _.defer(function(){
            parsePhotoSwipeImages();
        });
    });

    emitter.on('regions.out', function(){
        if(images && images.length){
            _.each(images, function(img){
                img.removeEventListener('click', clickCallback, false);
            });
        }
    });
};

function parsePhotoSwipeImages(){
    imagesSet   = [];
    images      = document.querySelectorAll('.image-lightbox');

    if(images && images.length){
        _.each(images, function(img, i){
            img.addEventListener('click', clickCallback, false);
            img.setAttribute('data-photoswipe-index', i);
            imagesSet.push({
                src     : (img.getAttribute('data-src'))? img.getAttribute('data-src') : img.src,
                msrc    : img.src,
                w       : (img.getAttribute('data-width'))? parseInt(img.getAttribute('data-width')) : img.naturalWidth,
                h       : (img.getAttribute('data-height'))? parseInt(img.getAttribute('data-height')) : img.naturalHeight
            });
        });
    }
}

function clickCallback(e){
    var img,
        index;

    if(_.isElement(e.target)){
        img     = e.target;
        index   = parseInt(e.target.getAttribute('data-photoswipe-index'));

        if(index > -1){
            emitter.emit('photoswipe.show', index); 
        }
    }
}
},{"../../vendors/photoswipe-ui-default.min":42,"../../vendors/photoswipe.min":43,"lodash":56}],7:[function(require,module,exports){
"use strict";

var _                   = require('lodash'),
    vlc                 = window.velocity,
    app                 = window.app,
    $                   = window.jQuery;

module.exports.init = function(region404){

};

module.exports.enter = function(region404){
    if(region404.els.content){
        $(region404.els.content).css('opacity', 0).removeClass('hidden');

        vlc(region404.els.content, {
            opacity     : 1,
            scale       : [1, 0.9],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 500,
            easing      : 'easeInOutQuint',
            complete    : function(){
                app.emit('region.enter', region404);
            }
        });
    }
    else {
        app.emit('region.enter', region404);
    }
};

module.exports.quit = function(region404){
    if(region404.els.content){
        vlc(region404.els.content, {
            opacity     : 0,
            scale       : 0.9,
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutQuint',
            complete    : function(){
                app.emit('region.quit', region404);
            }
        });
    }
    else {
        app.emit('region.quit', region404);
    }
};
},{"lodash":56}],8:[function(require,module,exports){
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
},{"../../vendors/stackblur.js":45,"lodash":56}],9:[function(require,module,exports){
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
},{"lodash":56}],10:[function(require,module,exports){
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
},{"lodash":56}],11:[function(require,module,exports){
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
},{"lodash":56}],12:[function(require,module,exports){
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
},{"lodash":56}],13:[function(require,module,exports){
"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery;

module.exports.init = function(comments){
    comments.els.comments = comments.el.querySelectorAll('li.comment');

    // create header element

    _.each(comments.els.comments, function(comment){
        var $article    = $(comment).find('> article'),
            $reply      = $article.find('.reply').detach(), 
            $img        = $article.find('img').detach(),
            $footer     = $article.find('footer').detach(),
            $header     = $(document.createElement('header')).append($footer);

        $footer.find('.comment-metadata').append($reply);

        $article.prepend($header);
        $article.prepend($img);
    });
};
},{"lodash":56}],14:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(cForm){
    
};

module.exports.quit = function(cForm){
    app.getModule('noizuLayout').quitRegion(cForm);
};
},{"lodash":56}],15:[function(require,module,exports){
"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery;

module.exports.init = function(countdown){
    countdown.els.li = countdown.el.querySelectorAll('li');

    if(countdown.els.content){
        countdownSetup(countdown);
    }

    countdown.vars.interval = setInterval(function(){
        countdownUpdate(countdown);
    }, 1000);
};

module.exports.enter = function(countdown){
    var delay       = 500,
        interval    = 500;

    if(countdown.els.li){
        _.each(countdown.els.li, function(li, i){
            $(li).css('opacity', 0).removeClass('hidden');

            vlc(li, {
                opacity     : [1, 0],
                translateY  : [0, 15],
                translateZ  : 0
            }, {
                duration    : 500,
                easing      : 'easeInOutExpo',
                delay       : delay,
                complete    : function(){
                    if(i === 3){
                        app.emit('region.enter', countdown);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.enter', countdown);
    }

    if(countdown.els.message){
        $(countdown.els.message).css('opacity', 0).removeClass('hidden');

        vlc(countdown.els.message, {
            opacity     : [1, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutCirc',
            delay       : 2500
        });
    }
};

module.exports.quit = function(countdown){
    var delay       = 0,
        interval    = 250;

    if(countdown.els.li){
        _.each(countdown.els.li, function(li, i){
            vlc(li, {
                opacity     : [0, 1],
                translateY  : [-15, 0],
                translateZ  : 0
            }, {
                duration    : 250,
                easing      : 'easeInOutExpo',
                delay       : delay,
                complete    : function(){
                    if(i === 3){
                        app.emit('region.quit', countdown);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.quit', countdown);
    }

    if(countdown.els.message){
        vlc(countdown.els.message, {
            opacity     : 0,
            translateZ  : 0
        }, {
            duration    : 250,
            easing      : 'easeInOutCirc'
        });
    }
};

function countdownSetup(countdown){
    var year    = parseInt(countdown.els.content.getAttribute('data-year')),
        month   = parseInt(countdown.els.content.getAttribute('data-month')),
        day     = parseInt(countdown.els.content.getAttribute('data-day')),
        hour    = parseInt(countdown.els.content.getAttribute('data-hour'));

    countdown.vars.date = new Date(year, month - 1, day, hour);
}

function countdownUpdate(countdown){
    var now = new Date(),
        seconds,
        seconds_left,
        days,
        hours,
        minutes;

    if(countdown.vars.date instanceof Date){
        seconds         = Math.round((countdown.vars.date.getTime() - now.getTime()) / 1000);
        days            = Math.floor(seconds / 86400);
        seconds_left    = seconds % 86400;
        hours           = Math.floor(seconds_left / 3600);
        seconds_left    = seconds % 3600;
        minutes         = Math.floor(seconds_left / 60);
        seconds_left    = seconds_left % 60;

        countdown.els.days.innerHTML    = days;
        countdown.els.hours.innerHTML   = hours;
        countdown.els.minutes.innerHTML = minutes;
        countdown.els.seconds.innerHTML = seconds_left;
    }
}
},{"lodash":56}],16:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(events){};

module.exports.quit = function(events){
    _.delay(function(){
        app.emit('region.quit', events);
    }, 510);
};
},{"lodash":56}],17:[function(require,module,exports){
"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery;

module.exports.init = function(menu){
    menu.listeners.on(app, 'full-menu.toggle', function(){
        menuToggle(menu);
    });

    if(menu.els.close){
        menu.listeners.on(menu.els.close, 'click', function(){
            app.emit('full-menu.toggle');
        });        
    }

    menu.listeners.on(app, 'window.resize', function(){
        menuVertical(menu);
    });

    // setup

    menuSetup(menu);
};

function menuSetup(menu){
    // copy bar menu

    // click events
    $(menu.el).find('ul a').each(function(){
        menu.listeners.on(this, 'click', function(e){
            var $a  = $(this),
                $ul = $a.parent().find('> ul'),
                ulHeight,
                subIsHide;

            if(menu.vars.stop){
                return;
            }

            if($ul.length === 1){
                menu.vars.stop = true;
                subIsHide = $ul.css('display') === 'none';

                if(subIsHide){
                    $ul.css({
                        opacity : 0,
                        display : 'block'
                    });

                    ulHeight = $ul.height();
                    $ul.css('height', 0);
                }

                vlc($ul.get(0), {
                    height      : (subIsHide)? ulHeight : 0,
                    opacity     : (subIsHide)? 1 : 0
                }, {
                    duration    : 500,
                    easing      : 'easeInOutQuint',
                    complete    : function(){
                        if(!subIsHide){
                            $ul.removeAttr('style');    
                        }
                        menuVertical(menu);
                        menu.vars.stop = false;
                    }
                });
            }
            else {
                app.emit('full-menu.toggle');
            }
        });
    });
}

function menuVertical(menu){
    var $ul             = $(menu.el).find('> ul'),
        navHeight       = $ul.outerHeight(),
        containerHeight = $ul.parent().height(),
        top             = Math.round((containerHeight - navHeight) / 2);

    if($ul.parent().hasClass('hide')){
        return;
    }

    if(top < 0){
        top = 0;
    }

    vlc($ul.get(0), {
        marginTop   : top
    }, {
        duration    : 500,
        easing      : 'easeOutCirc'
    });
}

function menuToggle(menu){
    var $menu  = $(menu.el),
        isHide = $menu.hasClass('hide');

    if(isHide){
        $menu.css('opacity', 0).removeClass('hide');
    }

    vlc(menu.el, {
        opacity     : (isHide)? 1 : 0,
        scale       : (isHide)? [1, 0.9] : [0.9, 1]
    }, {
        duration    : 1000,
        easing      : 'easeInOutQuint',
        queue       : false,
        begin       : function(){
            _.defer(function(){
                if(isHide){
                    menuVertical(menu);
                }
            });
        },
        complete    : function(){
            if(!isHide){
                $menu.addClass('hide');
            }
        }
    });
}
},{"lodash":56}],18:[function(require,module,exports){
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
},{"lodash":56}],19:[function(require,module,exports){
"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery,
    Packery = window.Packery,
    image   = app.getModule('image');

module.exports.init = function(gallery){
    gallerySetup(gallery);

    gallery.listeners.on(app, 'window.resize', function(){
        gallerySetup(gallery);
    });
};

module.exports.enter = function(gallery){
    if(gallery.els.title){
        $(gallery.els.title).css('opacity', 0).removeClass('hidden');

        vlc(gallery.els.title, {
            opacity     : [1, 0],
            translateX  : [0, 10],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 500,
            easing      : 'easeInOutQuint',
            complete    : function(){
                app.emit('region.enter', gallery);
            }
        });
    }
    else {
        app.emit('region.enter', gallery);
    }
};

module.exports.quit = function(gallery){
    if(gallery.els.title){
        vlc(gallery.els.title, {
            opacity     : [0, 1],
            translateX  : [-10, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 0,
            easing      : 'easeInOutQuint'
        });
    }

    if(gallery.els.container){
        vlc(gallery.els.container, {
            opacity     : [0, 1],
            translateX  : [10, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 0,
            easing      : 'easeInOutQuint',
            complete    : function(){
                app.emit('region.quit', gallery);
            }
        });
    }
    else {
        app.emit('region.quit', gallery);
    }
};

function gallerySetup(gallery){
    var images,
        gutter;

    if(_.isElement(gallery.els.container)){
        gutter = (_.isFinite(gallery.els.container.getAttribute('data-gutter')))? parseInt(gallery.els.container.getAttribute('data-gutter')) : 7;
        images = gallery.els.container.querySelectorAll('img');

        if(images.length && !gallery.vars.preload){
            gallery.vars.preload = true;

            _.each(images, function(img){
                image.preload(img).then(function(){

                    $(img).css('opacity', 0).removeClass('hidden');

                    vlc(img, {
                        opacity     : [1, 0],
                        scale       : [1, 0.9],
                        translateZ  : 0
                    }, {
                        duration    : 1000,
                        easing      : 'easeInOutQuint',
                        begin       : function(){
                            _.defer(function(){
                                if(gallery.vars.packery){
                                    gallery.vars.packery.layout();
                                }
                            });
                        }
                    });
                });
            });
        }

        if(gallery.vars.packery){
            gallery.vars.packery.layout();
        }
        else {
            gallery.vars.packery = new Packery(gallery.els.container, {
                itemSelector        : 'li',
                gutter              : gutter,
                transitionDuration  : '0.5s'
            });
        }
    }
}
},{"lodash":56}],20:[function(require,module,exports){
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
},{"lodash":56}],21:[function(require,module,exports){
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
},{"lodash":56}],22:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(iconsBar){
    iconsBar.enter(iconsBar);
    iconsBar.vars.isFooter = $('#container').hasClass('bar-top');

    if(iconsBar.els.menu){
        iconsBar.listeners.on(iconsBar.els.menu, 'click', function(){
            app.emit('sidebar.toggle');
        });
    }

    // loader events

    iconsBar.listeners.on(app, 'historyX.load.begin', function(){
        if(iconsBar.vars.isFooter){
            vlc(iconsBar.el, {
                opacity     : 0
            }, {
                duration    : 200,
                easing      : 'linear',
                queue       : false
            });
        }
        else {
            loaderToggle(iconsBar, 'show');
        }
    });

    iconsBar.listeners.on(app, 'regions.in', function(){
        if(iconsBar.vars.isFooter){
            vlc(iconsBar.el, {
                opacity     : 1
            }, {
                duration    : 200,
                easing      : 'linear',
                queue       : false
            });
        }
        else {
            loaderToggle(iconsBar, 'hide');
        }
    });
};

module.exports.enter = function(iconsBar){
    var delay       = 1000,
        interval    = 150,
        $el;

    _.each(iconsBar.el.querySelectorAll('a,span'), function(el){
        $el = $(el);

        if(el === iconsBar.els.loader){
            return;
        }

        if(el.id === 'logo'){
            return;
        }

        $(el).css('opacity', 0).removeClass('hidden');
        
        vlc(el, {
            opacity     : [1, 0],
            translateX  : ($el.hasClass('left'))? [0, 15] : [0, -15],
            translateZ  : 0
        }, {
            duration    : 1000,
            easing      : 'easeInOutQuint',
            delay       : delay,
            complete    : function(){
                $(el).removeAttr('style');
            }
        });

        delay += interval;
    });
};

function loaderToggle(iconsBar, display){
    var $loader     = $(iconsBar.els.loader),
        isHidden    = $loader.hasClass('hidden'),
        rotate      = function(){
            vlc(iconsBar.els.loader.querySelector('svg'), {
                rotateZ     : ['0deg', '360deg']
            }, {
                duration    : 600,
                easing      : 'linear',
                complete    : function(){
                    vlc(iconsBar.els.loader, { rotateZ : '0deg' }, 0);
                    if(!iconsBar.vars.loaderRotateStop){
                        rotate();
                    }
                }
            });
        };

    if((display === 'show' && isHidden) || (display === 'hide' && !isHidden)){
        if(isHidden){
            $loader
                .css('opacity', 0)
                .removeClass('hidden');

            iconsBar.vars.loaderRotateStop = false;
            rotate();
        }

        vlc(iconsBar.els.loader, {
            opacity     : (isHidden)? [1, 0] : [0, 1],
            scale       : (isHidden)? [1, 0.9] : [0.9, 1]
        }, {
            easing      : 'easeInOutQuint',
            duration    : 500,
            complete    : function(){
                if(!isHidden){
                    iconsBar.vars.loaderRotateStop = true;
                    $loader.addClass('hidden');
                }
            }
        });
    }
}
},{"lodash":56}],23:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(image){};

module.exports.quit = function(image){
    _.delay(function(){
        app.emit('region.quit', image);
    }, 510);
};
},{"lodash":56}],24:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(map){};

module.exports.quit = function(map){
    app.getModule('noizuLayout').quitRegion(map);
};
},{"lodash":56}],25:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(mobileFooter){
    mobileFooterEnter(mobileFooter);
};

function mobileFooterEnter(mobileFooter){
    var $el = $(mobileFooter.el);

    $el.css('opacity', 0).removeClass('hidden');

    vlc(mobileFooter.el, {
        opacity     : [1, 0],
        translateY  : [0, 10],
        translateZ  : 0
    }, {
        duration    : 1000,
        easing      : 'easeInOutQuint',
        delay       : 2000,
        complete    : function(){
            $el.removeAttr('style');
        }
    });
}
},{"lodash":56}],26:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(page){
    page.els.boxes = page.el.querySelectorAll('.page-box');
};

module.exports.enter = function(page){
    var delay       = 750,
        interval    = 250;

    if(page.els.title){
        app.getModule('noizuLayout').enterTitle(page);
    }

    if(page.els.boxes.length){
        _.each(page.els.boxes, function(box, i){
            $(box).css('opacity', 0).removeClass('hidden');

            vlc(box, {
                opacity     : 1,
                translateZ  : 0,
                translateX  : (i % 2 === 0)? [0, 15] : [0, -15]
            }, {
                duration    : 500,
                delay       : delay,
                easing      : 'easeInOutCirc',
                complete    : function(){
                    if(i+1 === page.els.boxes.length){
                        app.emit('region.enter', page);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.enter', page);
    }
};

module.exports.quit = function(page){
    var delay       = 250;

    if(page.els.title){
        app.getModule('noizuLayout').quitTitle(page);
    }

    if(page.els.boxes.length){
        _.each(page.els.boxes, function(box, i){
            vlc(box, {
                opacity     : 0,
                translateZ  : 0,
                translateX  : (i % 2 === 0)? [15, 0] : [-15, 0]
            }, {
                duration    : 500,
                delay       : delay,
                easing      : 'easeInOutCirc',
                complete    : function(){
                    if(i+1 === page.els.boxes.length){
                        app.emit('region.quit', page);
                    }
                }
            });
        });
    }
    else {
        app.emit('region.quit', page);
    }
};
},{"lodash":56}],27:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(page){
    setMetaMargin(page);
};

module.exports.enter = function(page){
    var contentElements = [page.els.content];

    // tween title

    if(page.els.title){

        $(page.els.title).css('opacity', 0).removeClass('hidden');

        // replace title content
        vlc(page.els.title, {
            translateX  : [0, 10],
            translateZ  : 0,
            opacity     : [1, 0]
        }, {
            duration    : 1000,
            delay       : 1500,
            easing      : 'easeOutCirc'
        }); 
    }

    // tween content

    if(page.els.overlay){
        contentElements.push(page.els.overlay);
    }

    $(page.els.overlay).css('opacity', 0).removeClass('hidden');
    $(page.els.content).css('opacity', 0).removeClass('hidden');

    vlc(contentElements, {
        translateY  : [0, 20],
        opacity     : 1
    }, {
        duration    : 1000,
        easing      : 'easeInOutQuint',
        delay       : 1000,
        complete    : function(els){
            $(els).removeAttr('style');
            app.emit('region.enter', page);
        }
    });
};

module.exports.quit = function(page){
    var elements    = [page.els.content],
        delay       = 100,
        interval    = 100;

    if(page.els.featured){
        elements.push(page.els.featured);
    }

    if(page.els.title){
        elements.push(page.els.title);
    }

    if(page.els.overlay){
        elements.push(page.els.overlay);
    }

    _.each(elements, function(el, i){
        vlc(el, {
            translateX  : (i % 2 === 0)? [10, 0] : [-10, 0],
            translateZ  : 0,
            opacity     : 0
        }, {
            duration    : app.vars.quitDuration,
            easing      : app.vars.quitEasing,
            delay       : delay,
            complete    : function(){
                if(i === elements.length - 1){
                    app.emit('region.quit', page);
                }
            }
        });

        delay += interval;
    });
};

function setMetaMargin(page){
    var setMargin = function(page){
        var $image              = $(page.els.featured),
            $content            = $(page.els.content),
            $meta               = $(page.els.meta),
            imageWidth          = $image.width(),
            contentMarginLeft   = _.parseInt($content.css('margin-left'));

        $meta.css( 'left', imageWidth - contentMarginLeft + 21 );
    };

    // set content-meta margin
    if(page.els.featured && page.els.meta){
        if(page.els.featured.complete){
            setMargin(page);
        }
        else {
            page.listeners.on(app, 'image.loaded', function(img){
                setMargin(page);
            });
        }

        page.listeners.on(app, 'window.resize', function(){
            setMargin(page);
        });
    }
}
},{"lodash":56}],28:[function(require,module,exports){
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
},{"lodash":56}],29:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(page){
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
    _.each([page.els.content, page.els.sidebar], function(el, i){
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
    clearInterval(page.vars.interval);

    _.each([page.els.content, page.els.sidebar], function(el, i){
        vlc(el, {
            opacity     : [0, 1],
            translateX  : (i === 0)? [-15, 0] : [15, 0],
            translateZ  : 0
        }, {
            duration    : 1000,
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
    var $sidebar        = $(page.els.sidebar),
        $content        = $(page.els.content),
        contentHeight   = $content.outerHeight();

    $sidebar.css('height', contentHeight);
}
},{"lodash":56}],30:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(player){

    // init player

    player.audioPlayer = app.getModule('audioPlayer').getPlayer();

    // events

    player.listeners.on(app, 'player.get', function(callback){
        if(_.isFunction(callback)){
            callback(player.audioPlayer);
        }
    });

    player.listeners.on(app, 'audioplayer.onplay', function(audioplayer){
        if(audioplayer === player.audioPlayer){
            $(player.els.play).addClass('hide');
            $(player.els.pause).removeClass('hide');
            playerTimeout(player);
        }
    });

    player.listeners.on(app, 'audioplayer.onpause', function(audioplayer){
        if(audioplayer === player.audioPlayer){
            $(player.els.play).removeClass('hide');
            $(player.els.pause).addClass('hide');
            clearTimeout(player.vars.timeout);
        }
    });

    player.listeners.on(app, 'audioplayer.track.changed', function(audioplayer){
        playerTrack(player);
    });

    player.listeners.on(player.els.play, 'click', function(){
        app.emit('audioplayer.play');
    });

    player.listeners.on(player.els.pause, 'click', function(){
        app.emit('audioplayer.pause', player.audioPlayer);
    });

    player.listeners.on(player.els.prev, 'click', function(){
        app.emit('audioplayer.prev', player.audioPlayer);
    });

    player.listeners.on(player.els.next, 'click', function(){
        app.emit('audioplayer.next', player.audioPlayer);
    });

    player.listeners.on(player.els.playlist, 'click', function(){
        app.emit('playlist.toggle', player);
    });
};

function playerTimeout(player){
    clearTimeout(player.vars.timeout);

    player.vars.timeout = setTimeout(function(){
        playerPercent(player);
        playerTimeout(player);
    }, 1000);
}

function playerTrack(player){
    var track           = player.audioPlayer.getTrack(),
        trackNameOut    = true;

    if(track){
        vlc(player.els.trackName, {
            opacity     : [0, 1],
            translateX  : [10, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeOutQuint',
            complete    : function(){
                player.els.trackName.innerHTML = track.name;
                vlc(player.els.trackName, "reverse");
            }
        });

        vlc(player.els.trackArtist, {
            opacity     : [0, 1],
            translateX  : [10, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 100,
            easing      : 'easeOutQuint',
            complete    : function(){
                player.els.trackArtist.innerHTML = track.artist;
                vlc(player.els.trackArtist, "reverse");
            }
        });
    }
}

function playerPercent(player){
    var track = player.audioPlayer.getTrack(),
        currentSeconds,
        totalSeconds,
        duration,
        percent;

    if(track && _.isElement(track.audio) && track.audio.readyState > 0){
        duration        = Math.round(track.audio.duration);
        currentSeconds  = Math.round(track.audio.currentTime);
        percent         = currentSeconds / (duration / 100);
        
        app.emit('player.percent', percent);
    }
}
},{"lodash":56}],31:[function(require,module,exports){
"use strict";

var _           = require('lodash'),
    stackBlur   = require('../../vendors/stackblur.js'),
    vlc         = window.velocity,
    app         = window.app,
    $           = window.jQuery,
    image       = app.getModule('image');

module.exports.init = function(playlist){
    playlistLoad(playlist);

    playlist.vars.coverTemplate     = _.template('<img id="playlist-cover" src="<%= src %>" />');
    playlist.vars.titleTemplate     = _.template('<div id="playlist-title"><%= title %></div>');
    playlist.vars.authorTemplate    = _.template('<div id="playlist-author"><%= author %></div>');
    playlist.vars.listTemplate      = _.template('<li id="playlist-track-<%= trackId %>"><div class="track-progress"></div><%= durationTemplate %><%= iconsTemplate %><%= trackTemplate %></li>');
    playlist.vars.durationTemplate  = _.template('<div class="right track-duration">&nbsp;<%= duration %></div>');
    playlist.vars.trackTemplate     = _.template('<div class="left"><div class="track-title"><%= title %></div><div class="track-artist"><%= artist %></div></div>');
    playlist.vars.iconsTemplate     = _.template('<% _.each(stores, function(storeIcon){ %><%= storeIcon %><% }) %>');

    _.defer(function(){
        app.emit('player.get', function(player){
            playlist.vars.player = player;
        });
    });

    // update duration element

    playlist.listeners.on(app, 'audioplayer.track.duration', function(track){
        var el = playlist.els[['trackList', track.id].join('')];
        if(_.isElement(el)){
            vlc(el.querySelector('.track-duration'), {
                opacity     : [1, 0]
            }, {
                duration    : 300,
                begin       : function(el){
                    el[0].innerHTML = track.duration;
                }
            });
        }
    });

    playlist.listeners.on(app, 'audioplayer.track.changed', function(audioPlayer){
        playlistSelected(playlist, audioPlayer.getIndex());
    });

    playlist.listeners.on(app, 'player.percent', function(percent){
        playlistPercentProgress(playlist, percent);
    });

    playlist.listeners.on(app, 'window.resize', function(){
        playlistCenterContent(playlist);
    });

    playlist.listeners.on(app, 'playlist.setup', function(tracks, playlistMeta){
        app.emit('audioplayer.set', tracks);
        playlist.vars.setup = true;
        _.defer(function(){
            app.emit('audioplayer.getTracks', function(tracks){
                if(tracks){
                    playlistSetup(playlist, tracks, playlistMeta);
                }
            });
        });
    });

    playlist.listeners.on(app, 'playlist.clear', function(){
        playlist.vars.setup = false;
        playlistLoad(playlist);
    });

    playlist.listeners.on(app, 'playlist.toggle', function(){
        playlistToggle(playlist);
    });

    playlist.listeners.on(app, 'playlist.hide', function(){
        if(!$(playlist.el).hasClass('hide')){
            playlistToggle(playlist);
        }
    });

    playlist.listeners.on(app, 'sidebar.toggle', function(){
        playlistSidebarToggle(playlist);
    });
};

function playlistSidebarToggle(playlist){
    var isClosed = $('#off-screen-sidebar').hasClass('closed');

    vlc(playlist.el, {
        opacity     : (isClosed)? 0 : 1,
        translateX  : (isClosed)? 20 : 0,
        translateZ  : 0
    }, {
        duration    : 750,
        easign      : 'easeInOutExpo'
    });
}

function playlistToggle(playlist){
    var $el     = $(playlist.el),
        isHide  = $el.css('display') === 'none';

    if(!playlist.vars.toggleStop){
        playlist.vars.toggleStop = true;

        if(isHide){
            $el.css('opacity', 0).removeClass('hide');
        }

        vlc(playlist.el, {
            opacity     : (isHide)? [1, 0] : [0, 1],
            translateY  : (isHide)? [0, 25] : [25, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeOutQuint',
            begin       : function(){
                playlistCenterContent(playlist);
            },
            complete    : function(){
                if(!isHide){
                    $el.addClass('hide').removeAttr('style');
                }

                playlist.vars.toggleStop = false;
            }
        });
    }
}

function playlistLoad(playlist, path){
    var playlistMeta;

    // json load

    path = (_.isString(path))? path : playlist.el.getAttribute('data-default-path');

    if(path){
        $.getJSON(path, function(data){
            playlistMeta = {
                cover   : data.cover,
                title   : data.title,
                author  : data.author
            };

            if(!playlist.vars.setup){
                app.emit('audioplayer.set', data.tracks);

                _.defer(function(){
                    app.emit('audioplayer.getTracks', function(tracks){
                        if(tracks){
                            playlistSetup(playlist, tracks, playlistMeta);
                        }
                    });
                });
            }
        });
    }

    // html attributes

    else {
        if(_.isPlainObject(window.noizuDefaultPlaylist)){
            _.delay(function(){
                playlistMeta = {
                    cover   : window.noizuDefaultPlaylist.cover,
                    title   : window.noizuDefaultPlaylist.title,
                    author  : window.noizuDefaultPlaylist.author
                }; 

                app.emit('audioplayer.set', window.noizuDefaultPlaylist.tracks);

                _.defer(function(){
                    app.emit('audioplayer.getTracks', function(tracks){
                        if(tracks){
                            playlistSetup(playlist, tracks, playlistMeta);
                        }
                    });
                });
            }, 500);
        }
    }
}

function playlistClear(playlist){
    $(playlist.els.left).empty();
    $(playlist.els.tracksList).empty();
    app.emit('audioplayer.pause');
    playlist.els.background.getContext('2d').clearRect(0, 0, playlist.els.background.width, playlist.els.background.height);    
}

function playlistSetup(playlist, tracks, playlistMeta){
    var $el             = $(playlist.el),
        $left           = $(playlist.els.left),
        $ul             = $(playlist.els.tracksList),
        icons,
        linksDelay      = 100,
        linksInterval   = 200,
        listHeight,
        img;

    // remove previous playlist

    playlistClear(playlist);

    // set cover, title & author

    if(playlistMeta && _.isString(playlistMeta.cover) && playlistMeta.cover !== ''){
        $left.empty().append(playlist.vars.coverTemplate({ src : playlistMeta.cover }));
    }

    if(playlistMeta && _.isString(playlistMeta.author) && playlistMeta.author !== ''){
        $left.append(playlist.vars.authorTemplate({ author : playlistMeta.author }));
    }

    if(playlistMeta && _.isString(playlistMeta.title) && playlistMeta.title !== ''){
        $left.append(playlist.vars.titleTemplate({ title : playlistMeta.title }));
    }

    // img blur background

    img = playlist.el.querySelector('#playlist-cover');

    if(_.isElement(img) && playlistMeta && playlistMeta.cover && playlist.els.background){
        image.preload(img).then(function(){
            stackBlur.stackBlurImage('playlist-cover', 'playlist-background', 50);
        });
    }

    // set tracks

    _.each(tracks, function(track){
        icons = [];

        if(track.stores){
            _.each(track.stores, function(url, storeName){
                storeName = ['ico', storeName.substr(0, 1).toUpperCase(), storeName.substr(1).toLowerCase()].join('');
                if(playlist.els[storeName]){
                    icons.push(playlist.els[storeName].outerHTML.replace(/\-\-icourl\-\-/gim, url));
                }
            });
        }

        var trackProperty   = ['trackList', track.id].join(''),
            trackHtml       = playlist.vars.trackTemplate({ 
                title               : track.name, 
                artist              : track.artist 
            }),
            durationHtml    = playlist.vars.durationTemplate({ 
                duration            : track.duration 
            }),
            iconsHtml       = playlist.vars.iconsTemplate({ stores : icons }),
            listHtml        = playlist.vars.listTemplate({ 
                trackId             : track.id, 
                durationTemplate    : durationHtml, 
                trackTemplate       : trackHtml,
                iconsTemplate       : iconsHtml
            });

        $ul.append(listHtml);

        // set el

        playlist.els[trackProperty] = $ul.find(['#playlist-track-', track.id].join('')).get(0);

        // display icons

        $(playlist.els[trackProperty]).find('.ico-button').each(function(){
            $(this).css('opacity', 0).removeClass('hide');

            vlc(this, {
                opacity     : [1, 0]
            }, {
                duration    : 300,
                delay       : linksDelay
            });

            linksDelay += linksInterval;
        });

        // add listener

        playlist.listeners.on(playlist.els[trackProperty], 'click', function(){
            app.emit('audioplayer.play', track);
        });

        _.each(playlist.els[trackProperty].querySelectorAll('a'), function(link){
            playlist.listeners.on(link, 'click', function(e){
                e.stopPropagation();
            });
        });
    });

    // set css

    playlistSelected(playlist, 0);
}

function playlistCenterContent(playlist){
    var playlistHeight  = $(playlist.el).height(),
        contentHeight   = $(playlist.els.content).height();

    if(contentHeight > playlistHeight){
        $(playlist.els.content).css({
            top         : 'auto'
        });
    }
    else {
        $(playlist.els.content).css({
            top         : Math.round((playlistHeight - contentHeight) / 2)
        });
    }
}

function playlistResetProgress(playlist){
    var li = playlist.els.tracksList.querySelectorAll('li .track-progress');

    vlc(li, 'stop');
    _.defer(function(){
        vlc(li, {
            width       : 0
        }, {
            duration    : 500,
            easing      : 'easeOutQuint'
        });
    });
}

function playlistPercentProgress(playlist, percent){
    vlc($(playlist.els.tracksList).find('li.selected .track-progress').get(0), {
        width       : [percent, '%'].join('')
    }, {
        duration    : 900,
        easing      : 'linear',
        queue       : false
    });
}

function playlistSelected(playlist, index){
    index = (_.isNumber(index))? index : 0;

    var $li = $(playlist.els.tracksList).find('li');

    $li.removeClass('selected').eq(index).addClass('selected');
    playlistResetProgress(playlist);
}
},{"../../vendors/stackblur.js":45,"lodash":56}],32:[function(require,module,exports){
"use strict";

var _           = require('lodash'),
    vlc         = window.velocity,
    app         = window.app,
    $           = window.jQuery;

module.exports.init = function(post){
    post.els.contents = post.el.querySelectorAll('.post-content');
};

module.exports.enter = function(post){
    var delay       = 500,
        interval    = 200;

    if(post.els.title){
        app.getModule('noizuLayout').enterTitle(post);
    }

    if(post.els.sidebar){
        $(post.els.sidebar).css('opacity', 0).removeClass('hidden');

        vlc(post.els.sidebar, {
            opacity     : 1,
            translateY  : [0, 15],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutCirc',
            delay       : 500
        });
    }

    if(post.els.contents.length){
        _.each(post.els.contents, function(postContent, i){
            $(postContent).css('opacity', 0).removeClass('hidden');

            vlc(postContent, {
                opacity     : 1,
                translateX  : (i % 2 === 0)? [0, -15] : [0, 15],
                translateZ  : 0
            }, {
                duration    : 500,
                easing      : 'easeInOutCirc',
                delay       : delay,
                complete    : function(){
                    if(i + 1 === post.els.contents.length){
                        app.emit('region.enter', post);
                    }
                }
            });

            delay += interval;
        });
    }
    else {
        app.emit('region.enter', post);
    }
};

module.exports.quit = function(post){
    if(post.els.title){
        app.getModule('noizuLayout').quitTitle(post);
    }

    if(post.els.sidebar){
        vlc(post.els.sidebar, {
            opacity     : 0,
            translateY  : [-15, 0],
            translateZ  : 0
        }, {
            duration    : 500,
            easing      : 'easeInOutCirc'
        });
    }

    if(post.els.contents.length){
        _.each(post.els.contents, function(postContent, i){
            vlc(postContent, {
                opacity     : 0,
                translateX  : (i % 2 === 0)? [-15, 0] : [15, 0],
                translateZ  : 0
            }, {
                duration    : 500,
                easing      : 'easeInOutCirc',
                complete    : function(){
                    if(i + 1 === post.els.contents.length){
                        app.emit('region.quit', post);
                    }
                }
            });
        });
    }
    else {
        app.emit('region.quit', post);
    }
};
},{"lodash":56}],33:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(postsList){
};

module.exports.quit = function(postsList){
    app.getModule('noizuLayout').quitRegion(postsList);
};
},{"lodash":56}],34:[function(require,module,exports){
"use strict";

var _       = require('lodash'),
    vlc     = window.velocity,
    app     = window.app,
    $       = window.jQuery;

module.exports.init = function(profiles){

    if(profiles.els.next){
        profiles.listeners.on(profiles.els.next, 'click', function(){
            profiles.vars.index = (profiles.vars.index + 1 > profiles.vars.maxIndex)? 0 : profiles.vars.index + 1;
            profilesSwitch(profiles);
        });
    }

    if(profiles.els.prev){
        profiles.listeners.on(profiles.els.prev, 'click', function(){
            profiles.vars.index = (profiles.vars.index - 1 < 0)? profiles.vars.maxIndex : profiles.vars.index - 1;
            profilesSwitch(profiles);
        });
    }

    profiles.listeners.on(app, 'window.resize', function(){
        profilesSetup(profiles);
    });

    profilesSetup(profiles);
};

function profilesSetup(profiles){
    var barWidth = 0;

    profiles.vars.index             = 0;
    profiles.vars.maxIndex          = 0;
    profiles.vars.profileWidth      = 0;
    profiles.vars.containerWidth    = profiles.el.offsetWidth;
    profiles.els.profiles           = profiles.el.querySelectorAll('.profile');
    
    if(profiles.els.profiles.length > 0){
        profiles.vars.maxIndex = profiles.els.profiles.length - 1;

        _.each(profiles.els.profiles, function(profile, i){
            if(i === 0){
                profiles.vars.profileWidth = profile.offsetWidth;
            }
            barWidth += profile.offsetWidth;
        });
    }

    profiles.els.bar.style.width = [barWidth, 'px'].join('');

    if(profiles.els.bar.getAttribute('data-start-from')){
        profiles.vars.index = parseInt(profiles.els.bar.getAttribute('data-start-from'));
    }
    else {
        profiles.vars.index = Math.floor(profiles.vars.maxIndex / 2);
    }

    if(profiles.vars.index > (profiles.els.profiles.length - 1)){
        profiles.vars.index = 0;
    } 

    profilesSwitch(profiles);
}

function profilesSwitch(profiles){
    var left = Math.round(profiles.vars.containerWidth / 2) - (profiles.vars.profileWidth / 2) + ( profiles.vars.profileWidth * -profiles.vars.index );

    if(!profiles.vars.stop){
        profiles.vars.stop = true;

        _.each(profiles.els.profiles, function(profile){
            profile.className = _.without(profile.className.split(" "), 'active');
        });

        vlc(profiles.els.bar, {
            translateX  : left,
            translateZ  : 0
        }, {
            duration    : 500,
            delay       : 100,
            easing      : 'easeInOutExpo',
            complete    : function(){
                var currentProfile = profiles.els.profiles[profiles.vars.index];
                profiles.vars.stop = false;
                currentProfile.className = [currentProfile.className, 'active'].join(' ');
            }
        });
    }
}
},{"lodash":56}],35:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(shareOn){
    var $el = $(shareOn.el);

    shareOn.listeners.on(shareOn.els.select, 'click', function(){
        toggleOptions(shareOn);
    });

    // social sharrre

    _.each([{
        id      : '#share-on-facebook',
        social  : 'facebook',
        text    : 'facebook'
    }, {
        id      : '#share-on-twitter',
        social  : 'twitter',
        text    : 'twitter'
    }, {
        id      : '#share-on-google-plus',
        social  : 'googlePlus',
        text    : 'google Plus'
    }, {
        id      : '#share-on-digg',
        social  : 'digg',
        text    : 'digg'
    }, {
        id      : '#share-on-delicious',
        social  : 'delicious',
        text    : 'delicious'
    }, {
        id      : '#share-on-stumbleupon',
        social  : 'stumbleupon',
        text    : 'Stumbleupon'
    }, {
        id      : '#share-on-linkedin',
        social  : 'linkedin',
        text    : 'linkedin'
    }, {
        id      : '#share-on-pinterest',
        social  : 'pinterest',
        text    : 'pinterest'
    }], function(params){
        var sharrreParams = {
            share           : {},
            template        : params.text,
            enableHover     : false,
            urlCurl         : '',
            enableTracking  : (window._gaq)? true : false,
            click           : function(api, options){
                options.url = (options.url === 'http://example.com')? window.location.href : options.url;
                api.simulateClick();
                api.openPopup(params.social);
                toggleOptions(shareOn);
            }
        };

        sharrreParams.share[params.social] = true;

        $el.find(params.id).sharrre(sharrreParams);
    });
};

module.exports.enter = function(shareOn){
    vlc([shareOn.els.label, shareOn.els.select], {
        rotateX     : -75,
        opacity     : 0
    }, 0);

    vlc(shareOn.el, {
        perspective : 300
    }, 0);

    _.each([shareOn.els.label, shareOn.els.select], function(el, i){
        $(el).css('opacity', 0).removeClass('hidden');

        vlc(el, {
            rotateX     : 0,
            opacity     : 1,
            translateZ  : 0
        }, {
            duration    : 1000,
            delay       : (i === 0)? 150 : 300,
            easing      : 'easeInOutCirc',
            complete    : function(el){
                $(el).removeAttr('style');
                if(i === 1){
                    app.emit('region.enter', shareOn);
                }
            }
        });
    });
};

module.exports.quit = function(shareOn){
    _.each([shareOn.els.label, shareOn.els.select], function(el, i){
        vlc(el, {
            translateX  : (i === 0)? [-10, 0] : [10, 0],
            opacity     : 0,
            translateZ  : 0
        }, {
            duration    : app.vars.quitDuration,
            easing      : app.vars.quitEasing,
            complete    : function(el){
                if(i === 1){
                    app.emit('region.quit', shareOn);
                }
            }
        });
    });
};

function toggleOptions(shareOn){
    var $container  = $(shareOn.els.options),
        $options    = $container.find('div'),
        isClosed    = $container.hasClass('hide'),
        delay       = 0,
        interval    = 50;

    if(!shareOn.vars.stopOptions){
        shareOn.vars.stopOptions = true;

        // rotate triangle

        vlc(shareOn.els.triangle, {
            rotateZ     : (isClosed)? 180 : 0
        }, {
            duration    : 300,
            easing      : 'easeInOutCirc'
        });

        if(isClosed){
            $options.css('opacity', 0);
        }

        $options.each(function(i, el){
            if((i === 0) && isClosed){
                $container.removeClass('hide');
            }

            vlc(el, {
                opacity     : (isClosed)? [1, 0] : [0, 1],
                translateY  : (isClosed)? [0, 10] : [10, 0],
                translateZ  : 0
            }, {
                duration    : 300,
                easing      : 'easeInOutCirc',
                delay       : delay,
                complete    : function(el){
                    if((i === $options.length - 1)){
                        shareOn.vars.stopOptions = false;

                        if(!isClosed){
                            $container.addClass('hide');
                        }
                    }
                }
            });

            delay += interval;
        });
    }
}
},{"lodash":56}],36:[function(require,module,exports){
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
},{"lodash":56}],37:[function(require,module,exports){
"use strict";

require('../../vendors/owl.carousel.min');

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(slider){
    sliderSet(slider);
};

module.exports.quit = function(slider){
    _.delay(function(){
        app.emit('region.quit', slider);
    }, 510);
};

function sliderSet(slider){
    $(slider.els.container).owlCarousel({
        items           : 1,
        lazyLoad        : true,
        navigation      : true,
        itemsDesktop    : false
    });
}
},{"../../vendors/owl.carousel.min":41,"lodash":56}],38:[function(require,module,exports){
"use strict";

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery,
    SC  = window.SC;

module.exports.init = function(tracklist){
    var type = tracklist.el.getAttribute('data-tracklist-type').trim().toLowerCase();
    
    tracklist.vars.templateCover   = _.template('<div class="tracklist-cover"><img src="<%= coverUrl %>" alt="" /></div>'); 
    tracklist.vars.templateList    = _.template('<li data-index="<%= trackIndex %>"><span><%= trackNumber %>.</span><%= trackName %></li>'); 
    tracklist.vars.templateFooter  = _.template('<li class="tracklist-footer"><div><%= soundCloudIcon %></div>Playlist created by <a href="<%= authorUrl %>" target="_blank"><%= authorName %></a> on <a target="_blank" href="//soundcloud.com">SoundCloud</a></li>');

    if(type === 'soundcloud' && SC){
        tracklistSoundcloudSetup(tracklist);
    }

    if(type === 'mp3'){
        tracklistMp3Setup(tracklist);
    }
};

module.exports.quit = function(tracklist){
    app.emit('playlist.clear', tracklist);

    _.delay(function(){
        app.emit('region.quit', tracklist);
    }, 510);
};

function tracklistMp3Setup(tracklist){
    var author      = tracklist.el.getAttribute('data-author') || '',
        title       = tracklist.el.getAttribute('data-title') || '',
        cover       = tracklist.el.getAttribute('data-cover') || false,
        tracks      = [],
        trackMp3, trackTitle, trackAuthor, trackDuration;

    tracklist.els.lists = tracklist.el.querySelectorAll('li');

    _.each(tracklist.els.tracks.querySelectorAll('li'), function(li){
        trackMp3        = li.getAttribute('data-mp3') || '';
        trackTitle      = li.getAttribute('data-title') || '';
        trackAuthor     = li.getAttribute('data-author') || '';
        trackDuration   = li.getAttribute('data-duration') || '';

        if(trackMp3){
            tracks.push({
                name        : trackTitle,
                artist      : trackAuthor,
                duration    : trackDuration,
                path        : trackMp3
            });
        }
    });

    if(tracks.length){
        tracklist.vars.tracks = tracks;
        tracklist.vars.meta   = {
            cover   : cover,
            author  : author,
            title   : title
        };

        tracklist.vars.playlistSetup = false;

        _.delay(function(){
            app.emit('playlist.setup', tracklist.vars.tracks, tracklist.vars.meta);

            _.defer(function(){
                app.emit('audioplayer.getTracks', function(tracks){
                    tracklist.vars.tracks = tracks;
                });
            });
        }, 100);

        // events

        _.each(tracklist.els.lists, function(list){
            tracklist.listeners.on(list, 'click', function(e){
                var index = _.parseInt(e.target.getAttribute('data-index'));

                if(_.isFinite(index) && tracklist.vars.tracks && tracklist.vars.tracks.length && tracklist.vars.tracks[index]){
                    app.emit('audioplayer.play', tracklist.vars.tracks[index]);
                }
            });
        });
    }
}

function tracklistSoundcloudSetup(tracklist){
    var clientId    = tracklist.el.getAttribute('data-soundcloud-client-id'),
        url         = tracklist.el.getAttribute('data-soundcloud-url');

    if(clientId && url){
        if(!_.isFunction(window.SC.initialize)){
            _.delay(function(){
                tracklistSoundcloudSetup(tracklist);
            }, 1000); 
        }
        else {
            window.SC.initialize({
              client_id : clientId
            });

            window.SC.get(url, {}, function(data){
                if(data && data.tracks){
                    tracklist.vars.data = data;
                    tracklistSoundcloudCreate(tracklist);
                }
            });
        }
    }
}

function tracklistSoundcloudCreate(tracklist){
    var displayDescription  = (tracklist.el.getAttribute('data-soundcloud-display-description') === 'false')? false : true,
        displayCover        = (tracklist.el.getAttribute('data-soundcloud-display-cover') === 'false')? false : true,
        $ul                 = $('<ul>'),
        $h4                 = $('<h4>'),
        $img,
        $p,
        coverUrl,
        diff,
        lists,
        maxTracksIndex      = tracklist.vars.data.tracks.length - 1;

    // oEmbed Load

    window.SC.oEmbed(tracklist.vars.data.permalink_url, {}, function(oembed){
        if(oembed && oembed.html){
            $(tracklist.el).append(oembed.html);
            tracklist.vars.player = SC.Widget(tracklist.el.querySelector('iframe'));

            // select track

            if(tracklist.vars.player){
                tracklist.vars.player.bind(SC.Widget.Events.PLAY, function(){
                    tracklist.vars.player.getCurrentSoundIndex(function(i){
                        if(lists && lists.length && _.isNumber(i)){
                            $(lists).removeClass('selected').eq(i).addClass('selected');
                        }
                    });
                });
            }
        }
    });

    // build tracklist

    $h4.append(tracklist.vars.data.title);

    if(_.isString(tracklist.vars.data.description) && displayDescription){
        $p = $('<p>');
        $p.append(tracklist.vars.data.description);
    }

    if(_.isString(tracklist.vars.data.artwork_url) && tracklist.vars.data.artwork_url !== '' && displayCover){
        coverUrl = tracklist.vars.data.artwork_url.replace(/large/gi, 't300x300');
        $img     = $(tracklist.vars.templateCover({ 
            coverUrl : coverUrl 
        }));
    }

    _.each(tracklist.vars.data.tracks, function(track, i){
        $ul.append(tracklist.vars.templateList({ 
            trackName   : track.title, 
            trackNumber : i + 1, 
            trackIndex  : i 
        }));
    });

    $ul.append(tracklist.vars.templateFooter({
        soundCloudIcon  : $('<div />').append($(tracklist.els.soundcloudIco).detach()).html().replace(/hide/gi, ''), // get the entire svg tag,
        authorUrl       : tracklist.vars.data.user.permalink_url,
        authorName      : tracklist.vars.data.user.username
    }));

    $(tracklist.el).append($h4);

    if($p){
        $(tracklist.el).append($p);
    }

    if($img){
        $(tracklist.el).append($img);
    }

    $(tracklist.el).append($ul);

    lists = tracklist.el.querySelectorAll('li');

    // events

    _.each(lists, function(li){
        tracklist.listeners.on(li, 'click', function(e){
            if(_.isElement(e.target) && e.target.tagName.toLowerCase() === 'li' && tracklist.vars.player){
                var index = parseInt(li.getAttribute('data-index')),
                    playerIndex;

                _.defer(function(){
                    tracklist.vars.player.getCurrentSoundIndex(function(i){
                        if(_.isNumber(i)){
                            playerIndex = i;

                            // pause audio-player module
                            app.emit('audioplayer.pause');

                            if(index > playerIndex){
                                diff = index - playerIndex;
                                _.times(diff, function(){
                                    _.defer(function(){
                                        tracklist.vars.player.next();
                                    });
                                });
                            }
                            
                            if(index < playerIndex){
                                diff = playerIndex - index;
                                _.times(diff, function(){
                                    _.defer(function(){
                                        tracklist.vars.player.prev();
                                    });
                                });
                            }

                            if(index === playerIndex){
                                tracklist.vars.player.toggle();
                            }
                        }
                    });
                });
            }
        });
    });
}
},{"lodash":56}],39:[function(require,module,exports){
"use strict";

require('../../vendors/jquery.fitvids');

var _   = require('lodash'),
    vlc = window.velocity,
    app = window.app,
    $   = window.jQuery;

module.exports.init = function(video){
    $(video.el).fitVids();
};

module.exports.quit = function(video){
    app.getModule('noizuLayout').quitRegion(video);
};
},{"../../vendors/jquery.fitvids":40,"lodash":56}],40:[function(require,module,exports){
/*global jQuery */
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

;(function( $ ){

  'use strict';

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement("div");
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed'
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+'%');
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );
},{}],41:[function(require,module,exports){
"function"!==typeof Object.create&&(Object.create=function(f){function g(){}g.prototype=f;return new g});
(function(f,g,k){var l={init:function(a,b){this.$elem=f(b);this.options=f.extend({},f.fn.owlCarousel.options,this.$elem.data(),a);this.userOptions=a;this.loadContent()},loadContent:function(){function a(a){var d,e="";if("function"===typeof b.options.jsonSuccess)b.options.jsonSuccess.apply(this,[a]);else{for(d in a.owl)a.owl.hasOwnProperty(d)&&(e+=a.owl[d].item);b.$elem.html(e)}b.logIn()}var b=this,e;"function"===typeof b.options.beforeInit&&b.options.beforeInit.apply(this,[b.$elem]);"string"===typeof b.options.jsonPath?
(e=b.options.jsonPath,f.getJSON(e,a)):b.logIn()},logIn:function(){this.$elem.data("owl-originalStyles",this.$elem.attr("style"));this.$elem.data("owl-originalClasses",this.$elem.attr("class"));this.$elem.css({opacity:0});this.orignalItems=this.options.items;this.checkBrowser();this.wrapperWidth=0;this.checkVisible=null;this.setVars()},setVars:function(){if(0===this.$elem.children().length)return!1;this.baseClass();this.eventTypes();this.$userItems=this.$elem.children();this.itemsAmount=this.$userItems.length;
this.wrapItems();this.$owlItems=this.$elem.find(".owl-item");this.$owlWrapper=this.$elem.find(".owl-wrapper");this.playDirection="next";this.prevItem=0;this.prevArr=[0];this.currentItem=0;this.customEvents();this.onStartup()},onStartup:function(){this.updateItems();this.calculateAll();this.buildControls();this.updateControls();this.response();this.moveEvents();this.stopOnHover();this.owlStatus();!1!==this.options.transitionStyle&&this.transitionTypes(this.options.transitionStyle);!0===this.options.autoPlay&&
(this.options.autoPlay=5E3);this.play();this.$elem.find(".owl-wrapper").css("display","block");this.$elem.is(":visible")?this.$elem.css("opacity",1):this.watchVisibility();this.onstartup=!1;this.eachMoveUpdate();"function"===typeof this.options.afterInit&&this.options.afterInit.apply(this,[this.$elem])},eachMoveUpdate:function(){!0===this.options.lazyLoad&&this.lazyLoad();!0===this.options.autoHeight&&this.autoHeight();this.onVisibleItems();"function"===typeof this.options.afterAction&&this.options.afterAction.apply(this,
[this.$elem])},updateVars:function(){"function"===typeof this.options.beforeUpdate&&this.options.beforeUpdate.apply(this,[this.$elem]);this.watchVisibility();this.updateItems();this.calculateAll();this.updatePosition();this.updateControls();this.eachMoveUpdate();"function"===typeof this.options.afterUpdate&&this.options.afterUpdate.apply(this,[this.$elem])},reload:function(){var a=this;g.setTimeout(function(){a.updateVars()},0)},watchVisibility:function(){var a=this;if(!1===a.$elem.is(":visible"))a.$elem.css({opacity:0}),
g.clearInterval(a.autoPlayInterval),g.clearInterval(a.checkVisible);else return!1;a.checkVisible=g.setInterval(function(){a.$elem.is(":visible")&&(a.reload(),a.$elem.animate({opacity:1},200),g.clearInterval(a.checkVisible))},500)},wrapItems:function(){this.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>');this.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">');this.wrapperOuter=this.$elem.find(".owl-wrapper-outer");this.$elem.css("display","block")},
baseClass:function(){var a=this.$elem.hasClass(this.options.baseClass),b=this.$elem.hasClass(this.options.theme);a||this.$elem.addClass(this.options.baseClass);b||this.$elem.addClass(this.options.theme)},updateItems:function(){var a,b;if(!1===this.options.responsive)return!1;if(!0===this.options.singleItem)return this.options.items=this.orignalItems=1,this.options.itemsCustom=!1,this.options.itemsDesktop=!1,this.options.itemsDesktopSmall=!1,this.options.itemsTablet=!1,this.options.itemsTabletSmall=
!1,this.options.itemsMobile=!1;a=f(this.options.responsiveBaseWidth).width();a>(this.options.itemsDesktop[0]||this.orignalItems)&&(this.options.items=this.orignalItems);if(!1!==this.options.itemsCustom)for(this.options.itemsCustom.sort(function(a,b){return a[0]-b[0]}),b=0;b<this.options.itemsCustom.length;b+=1)this.options.itemsCustom[b][0]<=a&&(this.options.items=this.options.itemsCustom[b][1]);else a<=this.options.itemsDesktop[0]&&!1!==this.options.itemsDesktop&&(this.options.items=this.options.itemsDesktop[1]),
a<=this.options.itemsDesktopSmall[0]&&!1!==this.options.itemsDesktopSmall&&(this.options.items=this.options.itemsDesktopSmall[1]),a<=this.options.itemsTablet[0]&&!1!==this.options.itemsTablet&&(this.options.items=this.options.itemsTablet[1]),a<=this.options.itemsTabletSmall[0]&&!1!==this.options.itemsTabletSmall&&(this.options.items=this.options.itemsTabletSmall[1]),a<=this.options.itemsMobile[0]&&!1!==this.options.itemsMobile&&(this.options.items=this.options.itemsMobile[1]);this.options.items>this.itemsAmount&&
!0===this.options.itemsScaleUp&&(this.options.items=this.itemsAmount)},response:function(){var a=this,b,e;if(!0!==a.options.responsive)return!1;e=f(g).width();a.resizer=function(){f(g).width()!==e&&(!1!==a.options.autoPlay&&g.clearInterval(a.autoPlayInterval),g.clearTimeout(b),b=g.setTimeout(function(){e=f(g).width();a.updateVars()},a.options.responsiveRefreshRate))};f(g).resize(a.resizer)},updatePosition:function(){this.jumpTo(this.currentItem);!1!==this.options.autoPlay&&this.checkAp()},appendItemsSizes:function(){var a=
this,b=0,e=a.itemsAmount-a.options.items;a.$owlItems.each(function(c){var d=f(this);d.css({width:a.itemWidth}).data("owl-item",Number(c));if(0===c%a.options.items||c===e)c>e||(b+=1);d.data("owl-roundPages",b)})},appendWrapperSizes:function(){this.$owlWrapper.css({width:this.$owlItems.length*this.itemWidth*2,left:0});this.appendItemsSizes()},calculateAll:function(){this.calculateWidth();this.appendWrapperSizes();this.loops();this.max()},calculateWidth:function(){this.itemWidth=Math.round(this.$elem.width()/
this.options.items)},max:function(){var a=-1*(this.itemsAmount*this.itemWidth-this.options.items*this.itemWidth);this.options.items>this.itemsAmount?this.maximumPixels=a=this.maximumItem=0:(this.maximumItem=this.itemsAmount-this.options.items,this.maximumPixels=a);return a},min:function(){return 0},loops:function(){var a=0,b=0,e,c;this.positionsInArray=[0];this.pagesInArray=[];for(e=0;e<this.itemsAmount;e+=1)b+=this.itemWidth,this.positionsInArray.push(-b),!0===this.options.scrollPerPage&&(c=f(this.$owlItems[e]),
c=c.data("owl-roundPages"),c!==a&&(this.pagesInArray[a]=this.positionsInArray[e],a=c))},buildControls:function(){if(!0===this.options.navigation||!0===this.options.pagination)this.owlControls=f('<div class="owl-controls"/>').toggleClass("clickable",!this.browser.isTouch).appendTo(this.$elem);!0===this.options.pagination&&this.buildPagination();!0===this.options.navigation&&this.buildButtons()},buildButtons:function(){var a=this,b=f('<div class="owl-buttons"/>');a.owlControls.append(b);a.buttonPrev=
f("<div/>",{"class":"owl-prev",html:a.options.navigationText[0]||""});a.buttonNext=f("<div/>",{"class":"owl-next",html:a.options.navigationText[1]||""});b.append(a.buttonPrev).append(a.buttonNext);b.on("touchstart.owlControls mousedown.owlControls",'div[class^="owl"]',function(a){a.preventDefault()});b.on("touchend.owlControls mouseup.owlControls",'div[class^="owl"]',function(b){b.preventDefault();f(this).hasClass("owl-next")?a.next():a.prev()})},buildPagination:function(){var a=this;a.paginationWrapper=
f('<div class="owl-pagination"/>');a.owlControls.append(a.paginationWrapper);a.paginationWrapper.on("touchend.owlControls mouseup.owlControls",".owl-page",function(b){b.preventDefault();Number(f(this).data("owl-page"))!==a.currentItem&&a.goTo(Number(f(this).data("owl-page")),!0)})},updatePagination:function(){var a,b,e,c,d,g;if(!1===this.options.pagination)return!1;this.paginationWrapper.html("");a=0;b=this.itemsAmount-this.itemsAmount%this.options.items;for(c=0;c<this.itemsAmount;c+=1)0===c%this.options.items&&
(a+=1,b===c&&(e=this.itemsAmount-this.options.items),d=f("<div/>",{"class":"owl-page"}),g=f("<span></span>",{text:!0===this.options.paginationNumbers?a:"","class":!0===this.options.paginationNumbers?"owl-numbers":""}),d.append(g),d.data("owl-page",b===c?e:c),d.data("owl-roundPages",a),this.paginationWrapper.append(d));this.checkPagination()},checkPagination:function(){var a=this;if(!1===a.options.pagination)return!1;a.paginationWrapper.find(".owl-page").each(function(){f(this).data("owl-roundPages")===
f(a.$owlItems[a.currentItem]).data("owl-roundPages")&&(a.paginationWrapper.find(".owl-page").removeClass("active"),f(this).addClass("active"))})},checkNavigation:function(){if(!1===this.options.navigation)return!1;!1===this.options.rewindNav&&(0===this.currentItem&&0===this.maximumItem?(this.buttonPrev.addClass("disabled"),this.buttonNext.addClass("disabled")):0===this.currentItem&&0!==this.maximumItem?(this.buttonPrev.addClass("disabled"),this.buttonNext.removeClass("disabled")):this.currentItem===
this.maximumItem?(this.buttonPrev.removeClass("disabled"),this.buttonNext.addClass("disabled")):0!==this.currentItem&&this.currentItem!==this.maximumItem&&(this.buttonPrev.removeClass("disabled"),this.buttonNext.removeClass("disabled")))},updateControls:function(){this.updatePagination();this.checkNavigation();this.owlControls&&(this.options.items>=this.itemsAmount?this.owlControls.hide():this.owlControls.show())},destroyControls:function(){this.owlControls&&this.owlControls.remove()},next:function(a){if(this.isTransition)return!1;
this.currentItem+=!0===this.options.scrollPerPage?this.options.items:1;if(this.currentItem>this.maximumItem+(!0===this.options.scrollPerPage?this.options.items-1:0))if(!0===this.options.rewindNav)this.currentItem=0,a="rewind";else return this.currentItem=this.maximumItem,!1;this.goTo(this.currentItem,a)},prev:function(a){if(this.isTransition)return!1;this.currentItem=!0===this.options.scrollPerPage&&0<this.currentItem&&this.currentItem<this.options.items?0:this.currentItem-(!0===this.options.scrollPerPage?
this.options.items:1);if(0>this.currentItem)if(!0===this.options.rewindNav)this.currentItem=this.maximumItem,a="rewind";else return this.currentItem=0,!1;this.goTo(this.currentItem,a)},goTo:function(a,b,e){var c=this;if(c.isTransition)return!1;"function"===typeof c.options.beforeMove&&c.options.beforeMove.apply(this,[c.$elem]);a>=c.maximumItem?a=c.maximumItem:0>=a&&(a=0);c.currentItem=c.owl.currentItem=a;if(!1!==c.options.transitionStyle&&"drag"!==e&&1===c.options.items&&!0===c.browser.support3d)return c.swapSpeed(0),
!0===c.browser.support3d?c.transition3d(c.positionsInArray[a]):c.css2slide(c.positionsInArray[a],1),c.afterGo(),c.singleItemTransition(),!1;a=c.positionsInArray[a];!0===c.browser.support3d?(c.isCss3Finish=!1,!0===b?(c.swapSpeed("paginationSpeed"),g.setTimeout(function(){c.isCss3Finish=!0},c.options.paginationSpeed)):"rewind"===b?(c.swapSpeed(c.options.rewindSpeed),g.setTimeout(function(){c.isCss3Finish=!0},c.options.rewindSpeed)):(c.swapSpeed("slideSpeed"),g.setTimeout(function(){c.isCss3Finish=!0},
c.options.slideSpeed)),c.transition3d(a)):!0===b?c.css2slide(a,c.options.paginationSpeed):"rewind"===b?c.css2slide(a,c.options.rewindSpeed):c.css2slide(a,c.options.slideSpeed);c.afterGo()},jumpTo:function(a){"function"===typeof this.options.beforeMove&&this.options.beforeMove.apply(this,[this.$elem]);a>=this.maximumItem||-1===a?a=this.maximumItem:0>=a&&(a=0);this.swapSpeed(0);!0===this.browser.support3d?this.transition3d(this.positionsInArray[a]):this.css2slide(this.positionsInArray[a],1);this.currentItem=
this.owl.currentItem=a;this.afterGo()},afterGo:function(){this.prevArr.push(this.currentItem);this.prevItem=this.owl.prevItem=this.prevArr[this.prevArr.length-2];this.prevArr.shift(0);this.prevItem!==this.currentItem&&(this.checkPagination(),this.checkNavigation(),this.eachMoveUpdate(),!1!==this.options.autoPlay&&this.checkAp());"function"===typeof this.options.afterMove&&this.prevItem!==this.currentItem&&this.options.afterMove.apply(this,[this.$elem])},stop:function(){this.apStatus="stop";g.clearInterval(this.autoPlayInterval)},
checkAp:function(){"stop"!==this.apStatus&&this.play()},play:function(){var a=this;a.apStatus="play";if(!1===a.options.autoPlay)return!1;g.clearInterval(a.autoPlayInterval);a.autoPlayInterval=g.setInterval(function(){a.next(!0)},a.options.autoPlay)},swapSpeed:function(a){"slideSpeed"===a?this.$owlWrapper.css(this.addCssSpeed(this.options.slideSpeed)):"paginationSpeed"===a?this.$owlWrapper.css(this.addCssSpeed(this.options.paginationSpeed)):"string"!==typeof a&&this.$owlWrapper.css(this.addCssSpeed(a))},
addCssSpeed:function(a){return{"-webkit-transition":"all "+a+"ms ease","-moz-transition":"all "+a+"ms ease","-o-transition":"all "+a+"ms ease",transition:"all "+a+"ms ease"}},removeTransition:function(){return{"-webkit-transition":"","-moz-transition":"","-o-transition":"",transition:""}},doTranslate:function(a){return{"-webkit-transform":"translate3d("+a+"px, 0px, 0px)","-moz-transform":"translate3d("+a+"px, 0px, 0px)","-o-transform":"translate3d("+a+"px, 0px, 0px)","-ms-transform":"translate3d("+
a+"px, 0px, 0px)",transform:"translate3d("+a+"px, 0px,0px)"}},transition3d:function(a){this.$owlWrapper.css(this.doTranslate(a))},css2move:function(a){this.$owlWrapper.css({left:a})},css2slide:function(a,b){var e=this;e.isCssFinish=!1;e.$owlWrapper.stop(!0,!0).animate({left:a},{duration:b||e.options.slideSpeed,complete:function(){e.isCssFinish=!0}})},checkBrowser:function(){var a=k.createElement("div");a.style.cssText="  -moz-transform:translate3d(0px, 0px, 0px); -ms-transform:translate3d(0px, 0px, 0px); -o-transform:translate3d(0px, 0px, 0px); -webkit-transform:translate3d(0px, 0px, 0px); transform:translate3d(0px, 0px, 0px)";
a=a.style.cssText.match(/translate3d\(0px, 0px, 0px\)/g);this.browser={support3d:null!==a&&1===a.length,isTouch:"ontouchstart"in g||g.navigator.msMaxTouchPoints}},moveEvents:function(){if(!1!==this.options.mouseDrag||!1!==this.options.touchDrag)this.gestures(),this.disabledEvents()},eventTypes:function(){var a=["s","e","x"];this.ev_types={};!0===this.options.mouseDrag&&!0===this.options.touchDrag?a=["touchstart.owl mousedown.owl","touchmove.owl mousemove.owl","touchend.owl touchcancel.owl mouseup.owl"]:
!1===this.options.mouseDrag&&!0===this.options.touchDrag?a=["touchstart.owl","touchmove.owl","touchend.owl touchcancel.owl"]:!0===this.options.mouseDrag&&!1===this.options.touchDrag&&(a=["mousedown.owl","mousemove.owl","mouseup.owl"]);this.ev_types.start=a[0];this.ev_types.move=a[1];this.ev_types.end=a[2]},disabledEvents:function(){this.$elem.on("dragstart.owl",function(a){a.preventDefault()});this.$elem.on("mousedown.disableTextSelect",function(a){return f(a.target).is("input, textarea, select, option")})},
gestures:function(){function a(a){if(void 0!==a.touches)return{x:a.touches[0].pageX,y:a.touches[0].pageY};if(void 0===a.touches){if(void 0!==a.pageX)return{x:a.pageX,y:a.pageY};if(void 0===a.pageX)return{x:a.clientX,y:a.clientY}}}function b(a){"on"===a?(f(k).on(d.ev_types.move,e),f(k).on(d.ev_types.end,c)):"off"===a&&(f(k).off(d.ev_types.move),f(k).off(d.ev_types.end))}function e(b){b=b.originalEvent||b||g.event;d.newPosX=a(b).x-h.offsetX;d.newPosY=a(b).y-h.offsetY;d.newRelativeX=d.newPosX-h.relativePos;
"function"===typeof d.options.startDragging&&!0!==h.dragging&&0!==d.newRelativeX&&(h.dragging=!0,d.options.startDragging.apply(d,[d.$elem]));(8<d.newRelativeX||-8>d.newRelativeX)&&!0===d.browser.isTouch&&(void 0!==b.preventDefault?b.preventDefault():b.returnValue=!1,h.sliding=!0);(10<d.newPosY||-10>d.newPosY)&&!1===h.sliding&&f(k).off("touchmove.owl");d.newPosX=Math.max(Math.min(d.newPosX,d.newRelativeX/5),d.maximumPixels+d.newRelativeX/5);!0===d.browser.support3d?d.transition3d(d.newPosX):d.css2move(d.newPosX)}
function c(a){a=a.originalEvent||a||g.event;var c;a.target=a.target||a.srcElement;h.dragging=!1;!0!==d.browser.isTouch&&d.$owlWrapper.removeClass("grabbing");d.dragDirection=0>d.newRelativeX?d.owl.dragDirection="left":d.owl.dragDirection="right";0!==d.newRelativeX&&(c=d.getNewPosition(),d.goTo(c,!1,"drag"),h.targetElement===a.target&&!0!==d.browser.isTouch&&(f(a.target).on("click.disable",function(a){a.stopImmediatePropagation();a.stopPropagation();a.preventDefault();f(a.target).off("click.disable")}),
a=f._data(a.target,"events").click,c=a.pop(),a.splice(0,0,c)));b("off")}var d=this,h={offsetX:0,offsetY:0,baseElWidth:0,relativePos:0,position:null,minSwipe:null,maxSwipe:null,sliding:null,dargging:null,targetElement:null};d.isCssFinish=!0;d.$elem.on(d.ev_types.start,".owl-wrapper",function(c){c=c.originalEvent||c||g.event;var e;if(3===c.which)return!1;if(!(d.itemsAmount<=d.options.items)){if(!1===d.isCssFinish&&!d.options.dragBeforeAnimFinish||!1===d.isCss3Finish&&!d.options.dragBeforeAnimFinish)return!1;
!1!==d.options.autoPlay&&g.clearInterval(d.autoPlayInterval);!0===d.browser.isTouch||d.$owlWrapper.hasClass("grabbing")||d.$owlWrapper.addClass("grabbing");d.newPosX=0;d.newRelativeX=0;f(this).css(d.removeTransition());e=f(this).position();h.relativePos=e.left;h.offsetX=a(c).x-e.left;h.offsetY=a(c).y-e.top;b("on");h.sliding=!1;h.targetElement=c.target||c.srcElement}})},getNewPosition:function(){var a=this.closestItem();a>this.maximumItem?a=this.currentItem=this.maximumItem:0<=this.newPosX&&(this.currentItem=
a=0);return a},closestItem:function(){var a=this,b=!0===a.options.scrollPerPage?a.pagesInArray:a.positionsInArray,e=a.newPosX,c=null;f.each(b,function(d,g){e-a.itemWidth/20>b[d+1]&&e-a.itemWidth/20<g&&"left"===a.moveDirection()?(c=g,a.currentItem=!0===a.options.scrollPerPage?f.inArray(c,a.positionsInArray):d):e+a.itemWidth/20<g&&e+a.itemWidth/20>(b[d+1]||b[d]-a.itemWidth)&&"right"===a.moveDirection()&&(!0===a.options.scrollPerPage?(c=b[d+1]||b[b.length-1],a.currentItem=f.inArray(c,a.positionsInArray)):
(c=b[d+1],a.currentItem=d+1))});return a.currentItem},moveDirection:function(){var a;0>this.newRelativeX?(a="right",this.playDirection="next"):(a="left",this.playDirection="prev");return a},customEvents:function(){var a=this;a.$elem.on("owl.next",function(){a.next()});a.$elem.on("owl.prev",function(){a.prev()});a.$elem.on("owl.play",function(b,e){a.options.autoPlay=e;a.play();a.hoverStatus="play"});a.$elem.on("owl.stop",function(){a.stop();a.hoverStatus="stop"});a.$elem.on("owl.goTo",function(b,e){a.goTo(e)});
a.$elem.on("owl.jumpTo",function(b,e){a.jumpTo(e)})},stopOnHover:function(){var a=this;!0===a.options.stopOnHover&&!0!==a.browser.isTouch&&!1!==a.options.autoPlay&&(a.$elem.on("mouseover",function(){a.stop()}),a.$elem.on("mouseout",function(){"stop"!==a.hoverStatus&&a.play()}))},lazyLoad:function(){var a,b,e,c,d;if(!1===this.options.lazyLoad)return!1;for(a=0;a<this.itemsAmount;a+=1)b=f(this.$owlItems[a]),"loaded"!==b.data("owl-loaded")&&(e=b.data("owl-item"),c=b.find(".lazyOwl"),"string"!==typeof c.data("src")?
b.data("owl-loaded","loaded"):(void 0===b.data("owl-loaded")&&(c.hide(),b.addClass("loading").data("owl-loaded","checked")),(d=!0===this.options.lazyFollow?e>=this.currentItem:!0)&&e<this.currentItem+this.options.items&&c.length&&this.lazyPreload(b,c)))},lazyPreload:function(a,b){function e(){a.data("owl-loaded","loaded").removeClass("loading");b.removeAttr("data-src");"fade"===d.options.lazyEffect?b.fadeIn(400):b.show();"function"===typeof d.options.afterLazyLoad&&d.options.afterLazyLoad.apply(this,
[d.$elem])}function c(){f+=1;d.completeImg(b.get(0))||!0===k?e():100>=f?g.setTimeout(c,100):e()}var d=this,f=0,k;"DIV"===b.prop("tagName")?(b.css("background-image","url("+b.data("src")+")"),k=!0):b[0].src=b.data("src");c()},autoHeight:function(){function a(){var a=f(e.$owlItems[e.currentItem]).height();e.wrapperOuter.css("height",a+"px");e.wrapperOuter.hasClass("autoHeight")||g.setTimeout(function(){e.wrapperOuter.addClass("autoHeight")},0)}function b(){d+=1;e.completeImg(c.get(0))?a():100>=d?g.setTimeout(b,
100):e.wrapperOuter.css("height","")}var e=this,c=f(e.$owlItems[e.currentItem]).find("img"),d;void 0!==c.get(0)?(d=0,b()):a()},completeImg:function(a){return!a.complete||"undefined"!==typeof a.naturalWidth&&0===a.naturalWidth?!1:!0},onVisibleItems:function(){var a;!0===this.options.addClassActive&&this.$owlItems.removeClass("active");this.visibleItems=[];for(a=this.currentItem;a<this.currentItem+this.options.items;a+=1)this.visibleItems.push(a),!0===this.options.addClassActive&&f(this.$owlItems[a]).addClass("active");
this.owl.visibleItems=this.visibleItems},transitionTypes:function(a){this.outClass="owl-"+a+"-out";this.inClass="owl-"+a+"-in"},singleItemTransition:function(){var a=this,b=a.outClass,e=a.inClass,c=a.$owlItems.eq(a.currentItem),d=a.$owlItems.eq(a.prevItem),f=Math.abs(a.positionsInArray[a.currentItem])+a.positionsInArray[a.prevItem],g=Math.abs(a.positionsInArray[a.currentItem])+a.itemWidth/2;a.isTransition=!0;a.$owlWrapper.addClass("owl-origin").css({"-webkit-transform-origin":g+"px","-moz-perspective-origin":g+
"px","perspective-origin":g+"px"});d.css({position:"relative",left:f+"px"}).addClass(b).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend",function(){a.endPrev=!0;d.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");a.clearTransStyle(d,b)});c.addClass(e).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend",function(){a.endCurrent=!0;c.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");a.clearTransStyle(c,e)})},clearTransStyle:function(a,
b){a.css({position:"",left:""}).removeClass(b);this.endPrev&&this.endCurrent&&(this.$owlWrapper.removeClass("owl-origin"),this.isTransition=this.endCurrent=this.endPrev=!1)},owlStatus:function(){this.owl={userOptions:this.userOptions,baseElement:this.$elem,userItems:this.$userItems,owlItems:this.$owlItems,currentItem:this.currentItem,prevItem:this.prevItem,visibleItems:this.visibleItems,isTouch:this.browser.isTouch,browser:this.browser,dragDirection:this.dragDirection}},clearEvents:function(){this.$elem.off(".owl owl mousedown.disableTextSelect");
f(k).off(".owl owl");f(g).off("resize",this.resizer)},unWrap:function(){0!==this.$elem.children().length&&(this.$owlWrapper.unwrap(),this.$userItems.unwrap().unwrap(),this.owlControls&&this.owlControls.remove());this.clearEvents();this.$elem.attr("style",this.$elem.data("owl-originalStyles")||"").attr("class",this.$elem.data("owl-originalClasses"))},destroy:function(){this.stop();g.clearInterval(this.checkVisible);this.unWrap();this.$elem.removeData()},reinit:function(a){a=f.extend({},this.userOptions,
a);this.unWrap();this.init(a,this.$elem)},addItem:function(a,b){var e;if(!a)return!1;if(0===this.$elem.children().length)return this.$elem.append(a),this.setVars(),!1;this.unWrap();e=void 0===b||-1===b?-1:b;e>=this.$userItems.length||-1===e?this.$userItems.eq(-1).after(a):this.$userItems.eq(e).before(a);this.setVars()},removeItem:function(a){if(0===this.$elem.children().length)return!1;a=void 0===a||-1===a?-1:a;this.unWrap();this.$userItems.eq(a).remove();this.setVars()}};f.fn.owlCarousel=function(a){return this.each(function(){if(!0===
f(this).data("owl-init"))return!1;f(this).data("owl-init",!0);var b=Object.create(l);b.init(a,this);f.data(this,"owlCarousel",b)})};f.fn.owlCarousel.options={items:5,itemsCustom:!1,itemsDesktop:[1199,4],itemsDesktopSmall:[979,3],itemsTablet:[768,2],itemsTabletSmall:!1,itemsMobile:[479,1],singleItem:!1,itemsScaleUp:!1,slideSpeed:200,paginationSpeed:800,rewindSpeed:1E3,autoPlay:!1,stopOnHover:!1,navigation:!1,navigationText:["prev","next"],rewindNav:!0,scrollPerPage:!1,pagination:!0,paginationNumbers:!1,
responsive:!0,responsiveRefreshRate:200,responsiveBaseWidth:g,baseClass:"owl-carousel",theme:"owl-theme",lazyLoad:!1,lazyFollow:!0,lazyEffect:"fade",autoHeight:!1,jsonPath:!1,jsonSuccess:!1,dragBeforeAnimFinish:!0,mouseDrag:!0,touchDrag:!0,addClassActive:!1,transitionStyle:!1,beforeUpdate:!1,afterUpdate:!1,beforeInit:!1,afterInit:!1,beforeMove:!1,afterMove:!1,afterAction:!1,startDragging:!1,afterLazyLoad:!1}})(jQuery,window,document);
},{}],42:[function(require,module,exports){
/*! PhotoSwipe Default UI - 4.0.3 - 2015-01-03
* http://photoswipe.com
* Copyright (c) 2015 Dmitry Semenov; */
!function(a,b){"function"==typeof define&&define.amd?define(b):"object"==typeof exports?module.exports=b():a.PhotoSwipeUI_Default=b()}(this,function(){"use strict";var a=function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v=this,w=!1,x=!0,y=!0,z={barsSize:{top:44,bottom:"auto"},closeElClasses:["item","caption","zoom-wrap","ui","top-bar"],timeToIdle:4e3,timeToIdleOutside:1e3,loadingIndicatorDelay:1e3,addCaptionHTMLFn:function(a,b){return a.title?(b.children[0].innerHTML=a.title,!0):(b.children[0].innerHTML="",!1)},closeEl:!0,captionEl:!0,fullscreenEl:!0,zoomEl:!0,shareEl:!0,counterEl:!0,arrowEl:!0,preloaderEl:!0,tapToClose:!1,tapToToggleControls:!0,shareButtons:[{id:"facebook",label:"Share on Facebook",url:"https://www.facebook.com/sharer/sharer.php?u={{url}}"},{id:"twitter",label:"Tweet",url:"https://twitter.com/intent/tweet?text={{text}}&url={{url}}"},{id:"pinterest",label:"Pin it",url:"http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"},{id:"download",label:"Download image",url:"{{raw_image_url}}",download:!0}],getImageURLForShare:function(){return a.currItem.src||""},getPageURLForShare:function(){return window.location.href},getTextForShare:function(){return a.currItem.title||""},indexIndicatorSep:" / "},A=function(a){if(r)return!0;a=a||window.event;for(var c,d,e=a.target||a.srcElement,f=e.className,g=0;g<S.length;g++)c=S[g],c.onTap&&f.indexOf("pswp__"+c.name)>-1&&(c.onTap(),d=!0);if(d){a.stopPropagation&&a.stopPropagation(),r=!0;var h=b.features.isOldAndroid?600:30;s=setTimeout(function(){r=!1},h)}},B=function(){return!a.likelyTouchDevice||q.mouseUsed||screen.width>1200},C=function(a,c,d){b[(d?"add":"remove")+"Class"](a,"pswp__"+c)},D=function(){var a=1===q.getNumItemsFn();a!==p&&(C(d,"ui--one-slide",a),p=a)},E=function(){C(i,"share-modal--hidden",y)},F=function(){return y=!y,y?(b.removeClass(i,"pswp__share-modal--fade-in"),setTimeout(function(){y&&E()},300)):(E(),setTimeout(function(){y||b.addClass(i,"pswp__share-modal--fade-in")},30)),y||H(),!1},G=function(b){b=b||window.event;var c=b.target||b.srcElement;return a.shout("shareLinkClick",b,c),c.href?c.hasAttribute("download")?!0:(window.open(c.href,"pswp_share","scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left="+(window.screen?Math.round(screen.width/2-275):100)),y||F(),!1):!1},H=function(){for(var a,b,c,d,e,f="",g=0;g<q.shareButtons.length;g++)a=q.shareButtons[g],c=q.getImageURLForShare(a),d=q.getPageURLForShare(a),e=q.getTextForShare(a),b=a.url.replace("{{url}}",encodeURIComponent(d)).replace("{{image_url}}",encodeURIComponent(c)).replace("{{raw_image_url}}",c).replace("{{text}}",encodeURIComponent(e)),f+='<a href="'+b+'" target="_blank" class="pswp__share--'+a.id+'"'+(a.download?"download":"")+">"+a.label+"</a>",q.parseShareButtonOut&&(f=q.parseShareButtonOut(a,f));i.children[0].innerHTML=f,i.children[0].onclick=G},I=function(a){for(var c=0;c<q.closeElClasses.length;c++)if(b.hasClass(a,"pswp__"+q.closeElClasses[c]))return!0},J=0,K=function(){clearTimeout(u),J=0,k&&v.setIdle(!1)},L=function(a){a=a?a:window.event;var b=a.relatedTarget||a.toElement;b&&"HTML"!==b.nodeName||(clearTimeout(u),u=setTimeout(function(){v.setIdle(!0)},q.timeToIdleOutside))},M=function(){q.fullscreenEl&&(c||(c=v.getFullscreenAPI()),c?(b.bind(document,c.eventK,v.updateFullscreen),v.updateFullscreen(),b.addClass(a.template,"pswp--supports-fs")):b.removeClass(a.template,"pswp--supports-fs"))},N=function(){q.preloaderEl&&(O(!0),l("beforeChange",function(){clearTimeout(o),o=setTimeout(function(){a.currItem&&a.currItem.loading?(!a.allowProgressiveImg()||a.currItem.img&&!a.currItem.img.naturalWidth)&&O(!1):O(!0)},q.loadingIndicatorDelay)}),l("imageLoadComplete",function(b,c){a.currItem===c&&O(!0)}))},O=function(a){n!==a&&(C(m,"preloader--active",!a),n=a)},P=function(a){var c=a.vGap;if(B()){var g=q.barsSize;if(q.captionEl&&"auto"===g.bottom)if(f||(f=b.createEl("pswp__caption pswp__caption--fake"),f.appendChild(b.createEl("pswp__caption__center")),d.insertBefore(f,e),b.addClass(d,"pswp__ui--fit")),q.addCaptionHTMLFn(a,f,!0)){var h=f.clientHeight;c.bottom=parseInt(h,10)||44}else c.bottom=g.top;else c.bottom=g.bottom;c.top=g.top}else c.top=c.bottom=0},Q=function(){q.timeToIdle&&l("mouseUsed",function(){b.bind(document,"mousemove",K),b.bind(document,"mouseout",L),t=setInterval(function(){J++,2===J&&v.setIdle(!0)},q.timeToIdle/2)})},R=function(){l("onVerticalDrag",function(a){x&&.95>a?v.hideControls():!x&&a>=.95&&v.showControls()});var a;l("onPinchClose",function(b){x&&.9>b?(v.hideControls(),a=!0):a&&!x&&b>.9&&v.showControls()}),l("zoomGestureEnded",function(){a=!1,a&&!x&&v.showControls()})},S=[{name:"caption",option:"captionEl",onInit:function(a){e=a}},{name:"share-modal",option:"shareEl",onInit:function(a){i=a},onTap:function(){F()}},{name:"button--share",option:"shareEl",onInit:function(a){h=a},onTap:function(){F()}},{name:"button--zoom",option:"zoomEl",onTap:a.toggleDesktopZoom},{name:"counter",option:"counterEl",onInit:function(a){g=a}},{name:"button--close",option:"closeEl",onTap:a.close},{name:"button--arrow--left",option:"arrowEl",onTap:a.prev},{name:"button--arrow--right",option:"arrowEl",onTap:a.next},{name:"button--fs",option:"fullscreenEl",onTap:function(){c.isFullscreen()?c.exit():c.enter()}},{name:"preloader",option:"preloaderEl",onInit:function(a){m=a}}],T=function(){var a,c,e,f=function(d){if(d)for(var f=d.length,g=0;f>g;g++){a=d[g],c=a.className;for(var h=0;h<S.length;h++)e=S[h],c.indexOf("pswp__"+e.name)>-1&&(q[e.option]?(b.removeClass(a,"pswp__element--disabled"),e.onInit&&e.onInit(a)):b.addClass(a,"pswp__element--disabled"))}};f(d.children);var g=b.getChildByClass(d,"pswp__top-bar");g&&f(g.children)};v.init=function(){b.extend(a.options,z,!0),q=a.options,d=b.getChildByClass(a.scrollWrap,"pswp__ui"),l=a.listen,R(),l("beforeChange",v.update),l("doubleTap",function(b){var c=a.currItem.initialZoomLevel;a.getZoomLevel()!==c?a.zoomTo(c,b,333):a.zoomTo(q.getDoubleTapZoom(!1,a.currItem),b,333)}),l("preventDragEvent",function(a,b,c){var d=a.target||a.srcElement;d&&d.className&&a.type.indexOf("mouse")>-1&&(d.className.indexOf("__caption")>0||/(SMALL|STRONG|EM)/i.test(d.tagName))&&(c.prevent=!1)}),l("bindEvents",function(){b.bind(d,"pswpTap click",A),b.bind(a.scrollWrap,"pswpTap",v.onGlobalTap),a.likelyTouchDevice||b.bind(a.scrollWrap,"mouseover",v.onMouseOver)}),l("unbindEvents",function(){y||F(),t&&clearInterval(t),b.unbind(document,"mouseout",L),b.unbind(document,"mousemove",K),b.unbind(d,"pswpTap click",A),b.unbind(a.scrollWrap,"pswpTap",v.onGlobalTap),b.unbind(a.scrollWrap,"mouseover",v.onMouseOver),c&&(b.unbind(document,c.eventK,v.updateFullscreen),c.isFullscreen()&&(q.hideAnimationDuration=0,c.exit()),c=null)}),l("destroy",function(){q.captionEl&&(f&&d.removeChild(f),b.removeClass(e,"pswp__caption--empty")),i&&(i.children[0].onclick=null),b.removeClass(d,"pswp__ui--over-close"),b.addClass(d,"pswp__ui--hidden"),v.setIdle(!1)}),q.showAnimationDuration||b.removeClass(d,"pswp__ui--hidden"),l("initialZoomIn",function(){q.showAnimationDuration&&b.removeClass(d,"pswp__ui--hidden")}),l("initialZoomOut",function(){b.addClass(d,"pswp__ui--hidden")}),l("parseVerticalMargin",P),T(),q.shareEl&&h&&i&&(y=!0),D(),Q(),M(),N()},v.setIdle=function(a){k=a,C(d,"ui--idle",a)},v.update=function(){x&&a.currItem?(v.updateIndexIndicator(),q.captionEl&&(q.addCaptionHTMLFn(a.currItem,e),C(e,"caption--empty",!a.currItem.title)),w=!0):w=!1,D()},v.updateFullscreen=function(){C(a.template,"fs",c.isFullscreen())},v.updateIndexIndicator=function(){q.counterEl&&(g.innerHTML=a.getCurrentIndex()+1+q.indexIndicatorSep+q.getNumItemsFn())},v.onGlobalTap=function(c){c=c||window.event;var d=c.target||c.srcElement;if(!r)if(c.detail&&"mouse"===c.detail.pointerType)I(d)&&a.close(),b.hasClass(d,"pswp__img")&&(1===a.getZoomLevel()&&a.getZoomLevel()<=a.currItem.fitRatio?a.close():a.toggleDesktopZoom(c.detail.releasePoint));else if(q.tapToToggleControls&&(x?v.hideControls():v.showControls()),q.tapToClose&&(b.hasClass(d,"pswp__img")||I(d)))return void a.close()},v.onMouseOver=function(a){a=a||window.event;var b=a.target||a.srcElement;C(d,"ui--over-close",I(b))},v.hideControls=function(){b.addClass(d,"pswp__ui--hidden"),x=!1},v.showControls=function(){x=!0,w||v.update(),b.removeClass(d,"pswp__ui--hidden")},v.supportsFullscreen=function(){var a=document;return!!(a.exitFullscreen||a.mozCancelFullScreen||a.webkitExitFullscreen||a.msExitFullscreen)},v.getFullscreenAPI=function(){var b,c=document.documentElement,d="fullscreenchange";return c.requestFullscreen?b={enterK:"requestFullscreen",exitK:"exitFullscreen",elementK:"fullscreenElement",eventK:d}:c.mozRequestFullScreen?b={enterK:"mozRequestFullScreen",exitK:"mozCancelFullScreen",elementK:"mozFullScreenElement",eventK:"moz"+d}:c.webkitRequestFullscreen?b={enterK:"webkitRequestFullscreen",exitK:"webkitExitFullscreen",elementK:"webkitFullscreenElement",eventK:"webkit"+d}:c.msRequestFullscreen&&(b={enterK:"msRequestFullscreen",exitK:"msExitFullscreen",elementK:"msFullscreenElement",eventK:"MSFullscreenChange"}),b&&(b.enter=function(){return j=q.closeOnScroll,q.closeOnScroll=!1,"webkitRequestFullscreen"!==this.enterK?a.template[this.enterK]():void a.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT)},b.exit=function(){return q.closeOnScroll=j,document[this.exitK]()},b.isFullscreen=function(){return document[this.elementK]}),b}};return a});
},{}],43:[function(require,module,exports){
/*! PhotoSwipe - v4.0.3 - 2015-01-05
* http://photoswipe.com
* Copyright (c) 2015 Dmitry Semenov; */
!function(a,b){"function"==typeof define&&define.amd?define(b):"object"==typeof exports?module.exports=b():a.PhotoSwipe=b()}(this,function(){"use strict";var a=function(a,b,c,d){var e={features:null,bind:function(a,b,c,d){var e=(d?"remove":"add")+"EventListener";b=b.split(" ");for(var f=0;f<b.length;f++)b[f]&&a[e](b[f],c,!1)},isArray:function(a){return a instanceof Array},createEl:function(a,b){var c=document.createElement(b||"div");return a&&(c.className=a),c},getScrollY:function(){var a=window.pageYOffset;return void 0!==a?a:document.documentElement.scrollTop},unbind:function(a,b,c){e.bind(a,b,c,!0)},removeClass:function(a,b){var c=new RegExp("(\\s|^)"+b+"(\\s|$)");a.className=a.className.replace(c," ").replace(/^\s\s*/,"").replace(/\s\s*$/,"")},addClass:function(a,b){e.hasClass(a,b)||(a.className+=(a.className?" ":"")+b)},hasClass:function(a,b){return a.className&&new RegExp("(^|\\s)"+b+"(\\s|$)").test(a.className)},getChildByClass:function(a,b){for(var c=a.firstChild;c;){if(e.hasClass(c,b))return c;c=c.nextSibling}},arraySearch:function(a,b,c){for(var d=a.length;d--;)if(a[d][c]===b)return d;return-1},extend:function(a,b,c){for(var d in b)if(b.hasOwnProperty(d)){if(c&&a.hasOwnProperty(d))continue;a[d]=b[d]}},easing:{sine:{out:function(a){return Math.sin(a*(Math.PI/2))},inOut:function(a){return-(Math.cos(Math.PI*a)-1)/2}},cubic:{out:function(a){return--a*a*a+1}}},detectFeatures:function(){if(e.features)return e.features;var a=e.createEl(),b=a.style,c="",d={};if(d.oldIE=document.all&&!document.addEventListener,d.touch="ontouchstart"in window,window.requestAnimationFrame&&(d.raf=window.requestAnimationFrame,d.caf=window.cancelAnimationFrame),d.pointerEvent=navigator.pointerEnabled||navigator.msPointerEnabled,!d.pointerEvent){var f=navigator.userAgent;if(/iP(hone|od)/.test(navigator.platform)){var g=navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);g&&g.length>0&&(g=parseInt(g[1],10),g>=1&&8>g&&(d.isOldIOSPhone=!0))}var h=f.match(/Android\s([0-9\.]*)/),i=h?h[1]:0;i=parseFloat(i),i>=1&&(4.4>i&&(d.isOldAndroid=!0),d.androidVersion=i),d.isMobileOpera=/opera mini|opera mobi/i.test(f)}for(var j,k,l=["transform","perspective","animationName"],m=["","webkit","Moz","ms","O"],n=0;4>n;n++){c=m[n];for(var o=0;3>o;o++)j=l[o],k=c+(c?j.charAt(0).toUpperCase()+j.slice(1):j),!d[j]&&k in b&&(d[j]=k);c&&!d.raf&&(c=c.toLowerCase(),d.raf=window[c+"RequestAnimationFrame"],d.raf&&(d.caf=window[c+"CancelAnimationFrame"]||window[c+"CancelRequestAnimationFrame"]))}if(!d.raf){var p=0;d.raf=function(a){var b=(new Date).getTime(),c=Math.max(0,16-(b-p)),d=window.setTimeout(function(){a(b+c)},c);return p=b+c,d},d.caf=function(a){clearTimeout(a)}}return d.svg=!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,e.features=d,d}};e.detectFeatures(),e.features.oldIE&&(e.bind=function(a,b,c,d){b=b.split(" ");for(var e,f=(d?"detach":"attach")+"Event",g=function(){c.handleEvent.call(c)},h=0;h<b.length;h++)if(e=b[h])if("object"==typeof c&&c.handleEvent){if(d){if(!c["oldIE"+e])return!1}else c["oldIE"+e]=g;a[f]("on"+e,c["oldIE"+e])}else a[f]("on"+e,c)});var f=this,g=25,h=3,i={allowPanToNext:!0,spacing:.12,bgOpacity:1,mouseUsed:!1,loop:!0,pinchToClose:!0,closeOnScroll:!0,closeOnVerticalDrag:!0,hideAnimationDuration:333,showAnimationDuration:333,showHideOpacity:!1,focus:!0,escKey:!0,arrowKeys:!0,mainScrollEndFriction:.35,panEndFriction:.35,isClickableElement:function(a){return"A"===a.tagName},getDoubleTapZoom:function(a,b){return a?1:b.initialZoomLevel<.7?1:1.5},maxSpreadZoom:2,scaleMode:"fit",modal:!0,alwaysFadeIn:!1};e.extend(i,d);var j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,ab,bb,cb,db,eb,fb,gb,hb,ib,jb,kb,lb,mb,nb=function(){return{x:0,y:0}},ob=nb(),pb=nb(),qb=nb(),rb={},sb=0,tb=nb(),ub=0,vb=!0,wb=[],xb={},yb=function(a,b){e.extend(f,b.publicMethods),wb.push(a)},zb=function(a){var b=_c();return a>b-1?a-b:0>a?b+a:a},Ab={},Bb=function(a,b){return Ab[a]||(Ab[a]=[]),Ab[a].push(b)},Cb=function(a){var b=Ab[a];if(b){var c=Array.prototype.slice.call(arguments);c.shift();for(var d=0;d<b.length;d++)b[d].apply(f,c)}},Db=function(){return(new Date).getTime()},Eb=function(a){kb=a,f.bg.style.opacity=a*i.bgOpacity},Fb=function(a,b,c,d){a[G]=u+b+"px, "+c+"px"+v+" scale("+d+")"},Gb=function(){fb&&Fb(fb,qb.x,qb.y,s)},Hb=function(a){a.container&&Fb(a.container.style,a.initialPosition.x,a.initialPosition.y,a.initialZoomLevel)},Ib=function(a,b){b[G]=u+a+"px, 0px"+v},Jb=function(a,b){if(!i.loop&&b){var c=m+(tb.x*sb-a)/tb.x,d=Math.round(a-sc.x);(0>c&&d>0||c>=_c()-1&&0>d)&&(a=sc.x+d*i.mainScrollEndFriction)}sc.x=a,Ib(a,n)},Kb=function(a,b){var c=tc[a]-y[a];return pb[a]+ob[a]+c-c*(b/t)},Lb=function(a,b){a.x=b.x,a.y=b.y,b.id&&(a.id=b.id)},Mb=function(a){a.x=Math.round(a.x),a.y=Math.round(a.y)},Nb=null,Ob=function(){Nb&&(e.unbind(document,"mousemove",Ob),e.addClass(a,"pswp--has_mouse"),i.mouseUsed=!0,Cb("mouseUsed")),Nb=setTimeout(function(){Nb=null},100)},Pb=function(){e.bind(document,"keydown",f),P.transform&&e.bind(f.scrollWrap,"click",f),i.mouseUsed||e.bind(document,"mousemove",Ob),e.bind(window,"resize scroll",f),Cb("bindEvents")},Qb=function(){e.unbind(window,"resize",f),e.unbind(window,"scroll",r.scroll),e.unbind(document,"keydown",f),e.unbind(document,"mousemove",Ob),P.transform&&e.unbind(f.scrollWrap,"click",f),W&&e.unbind(window,p,f),Cb("unbindEvents")},Rb=function(a,b){var c=hd(f.currItem,rb,a);return b&&(eb=c),c},Sb=function(a){return a||(a=f.currItem),a.initialZoomLevel},Tb=function(a){return a||(a=f.currItem),a.w>0?i.maxSpreadZoom:1},Ub=function(a,b,c,d){return d===f.currItem.initialZoomLevel?(c[a]=f.currItem.initialPosition[a],!0):(c[a]=Kb(a,d),c[a]>b.min[a]?(c[a]=b.min[a],!0):c[a]<b.max[a]?(c[a]=b.max[a],!0):!1)},Vb=function(){if(G){var b=P.perspective&&!I;return u="translate"+(b?"3d(":"("),void(v=P.perspective?", 0px)":")")}G="left",e.addClass(a,"pswp--ie"),Ib=function(a,b){b.left=a+"px"},Hb=function(a){var b=a.container.style,c=a.fitRatio*a.w,d=a.fitRatio*a.h;b.width=c+"px",b.height=d+"px",b.left=a.initialPosition.x+"px",b.top=a.initialPosition.y+"px"},Gb=function(){if(fb){var a=fb,b=f.currItem,c=b.fitRatio*b.w,d=b.fitRatio*b.h;a.width=c+"px",a.height=d+"px",a.left=qb.x+"px",a.top=qb.y+"px"}}},Wb=function(a){var b="";i.escKey&&27===a.keyCode?b="close":i.arrowKeys&&(37===a.keyCode?b="prev":39===a.keyCode&&(b="next")),b&&(a.ctrlKey||a.altKey||a.shiftKey||a.metaKey||(a.preventDefault?a.preventDefault():a.returnValue=!1,f[b]()))},Xb=function(a){a&&(Z||Y||gb||U)&&(a.preventDefault(),a.stopPropagation())},Yb=function(){z=!0,i.closeOnScroll&&j&&(!f.likelyTouchDevice||i.mouseUsed)&&Math.abs(e.getScrollY()-M)>2&&(l=!0,f.close())},Zb={},$b=0,_b=function(a){Zb[a]&&(Zb[a].raf&&K(Zb[a].raf),$b--,delete Zb[a])},ac=function(a){Zb[a]&&_b(a),Zb[a]||($b++,Zb[a]={})},bc=function(){for(var a in Zb)Zb.hasOwnProperty(a)&&_b(a)},cc=function(a,b,c,d,e,f,g){var h,i=Db();ac(a);var j=function(){if(Zb[a]){if(h=Db()-i,h>=d)return _b(a),f(c),void(g&&g());f((c-b)*e(h/d)+b),Zb[a].raf=J(j)}};j()},dc={shout:Cb,listen:Bb,viewportSize:rb,options:i,isMainScrollAnimating:function(){return gb},getZoomLevel:function(){return s},getCurrentIndex:function(){return m},isDragging:function(){return W},isZooming:function(){return bb},applyZoomPan:function(a,b,c){qb.x=b,qb.y=c,s=a,Gb()},init:function(){if(!j&&!k){var c;f.framework=e,f.template=a,f.bg=e.getChildByClass(a,"pswp__bg"),L=a.className,j=!0,P=e.detectFeatures(),J=P.raf,K=P.caf,G=P.transform,N=P.oldIE,f.scrollWrap=e.getChildByClass(a,"pswp__scroll-wrap"),f.container=e.getChildByClass(f.scrollWrap,"pswp__container"),n=f.container.style,f.itemHolders=A=[{el:f.container.children[0],wrap:0,index:-1},{el:f.container.children[1],wrap:0,index:-1},{el:f.container.children[2],wrap:0,index:-1}],A[0].el.style.display=A[2].el.style.display="none",Vb(),r={resize:f.updateSize,scroll:Yb,keydown:Wb,click:Xb};var d=P.isOldIOSPhone||P.isOldAndroid||P.isMobileOpera;for(P.animationName&&P.transform&&!d||(i.showAnimationDuration=i.hideAnimationDuration=0),c=0;c<wb.length;c++)f["init"+wb[c]]();if(b){var g=f.ui=new b(f,e);g.init()}Cb("firstUpdate"),m=m||i.index||0,(isNaN(m)||0>m||m>=_c())&&(m=0),f.currItem=$c(m),(P.isOldIOSPhone||P.isOldAndroid)&&(vb=!1),i.modal&&(a.setAttribute("aria-hidden","false"),vb?a.style.position="fixed":(a.style.position="absolute",a.style.top=e.getScrollY()+"px")),void 0===O&&(Cb("initialLayout"),O=M=e.getScrollY());var l="pswp--open ";for(i.mainClass&&(l+=i.mainClass+" "),i.showHideOpacity&&(l+="pswp--animate_opacity "),l+=I?"pswp--touch":"pswp--notouch",l+=P.animationName?" pswp--css_animation":"",l+=P.svg?" pswp--svg":"",e.addClass(a,l),f.updateSize(),o=-1,ub=null,c=0;h>c;c++)Ib((c+o)*tb.x,A[c].el.style);N||e.bind(f.scrollWrap,q,f),Bb("initialZoomInEnd",function(){f.setContent(A[0],m-1),f.setContent(A[2],m+1),A[0].el.style.display=A[2].el.style.display="block",i.focus&&a.focus(),Pb()}),f.setContent(A[1],m),f.updateCurrItem(),Cb("afterInit"),vb||(w=setInterval(function(){$b||W||bb||s!==f.currItem.initialZoomLevel||f.updateSize()},1e3)),e.addClass(a,"pswp--visible")}},close:function(){j&&(j=!1,k=!0,Cb("close"),Qb(),bd(f.currItem,null,!0,f.destroy))},destroy:function(){Cb("destroy"),Wc&&clearTimeout(Wc),i.modal&&(a.setAttribute("aria-hidden","true"),a.className=L),w&&clearInterval(w),e.unbind(f.scrollWrap,q,f),e.unbind(window,"scroll",f),yc(),bc(),Ab=null},panTo:function(a,b,c){c||(a>eb.min.x?a=eb.min.x:a<eb.max.x&&(a=eb.max.x),b>eb.min.y?b=eb.min.y:b<eb.max.y&&(b=eb.max.y)),qb.x=a,qb.y=b,Gb()},handleEvent:function(a){a=a||window.event,r[a.type]&&r[a.type](a)},goTo:function(a){a=zb(a);var b=a-m;ub=b,m=a,f.currItem=$c(m),sb-=b,Jb(tb.x*sb),bc(),gb=!1,f.updateCurrItem()},next:function(){f.goTo(m+1)},prev:function(){f.goTo(m-1)},updateCurrZoomItem:function(a){if(a&&Cb("beforeChange",0),A[1].el.children.length){var b=A[1].el.children[0];fb=e.hasClass(b,"pswp__zoom-wrap")?b.style:null}else fb=null;eb=f.currItem.bounds,t=s=f.currItem.initialZoomLevel,qb.x=eb.center.x,qb.y=eb.center.y,a&&Cb("afterChange")},invalidateCurrItems:function(){x=!0;for(var a=0;h>a;a++)A[a].item&&(A[a].item.needsUpdate=!0)},updateCurrItem:function(a){if(0!==ub){var b,c=Math.abs(ub);if(!(a&&2>c)){f.currItem=$c(m),Cb("beforeChange",ub),c>=h&&(o+=ub+(ub>0?-h:h),c=h);for(var d=0;c>d;d++)ub>0?(b=A.shift(),A[h-1]=b,o++,Ib((o+2)*tb.x,b.el.style),f.setContent(b,m-c+d+1+1)):(b=A.pop(),A.unshift(b),o--,Ib(o*tb.x,b.el.style),f.setContent(b,m+c-d-1-1));if(fb&&1===Math.abs(ub)){var e=$c(B);e.initialZoomLevel!==s&&(hd(e,rb),Hb(e))}ub=0,f.updateCurrZoomItem(),B=m,Cb("afterChange")}}},updateSize:function(b){if(!vb){var c=e.getScrollY();if(O!==c&&(a.style.top=c+"px",O=c),!b&&xb.x===window.innerWidth&&xb.y===window.innerHeight)return;xb.x=window.innerWidth,xb.y=window.innerHeight,a.style.height=xb.y+"px"}if(rb.x=f.scrollWrap.clientWidth,rb.y=f.scrollWrap.clientHeight,y={x:0,y:O},tb.x=rb.x+Math.round(rb.x*i.spacing),tb.y=rb.y,Jb(tb.x*sb),Cb("beforeResize"),void 0!==o){for(var d,g,j,k=0;h>k;k++)d=A[k],Ib((k+o)*tb.x,d.el.style),j=zb(m+k-1),g=$c(j),x||g.needsUpdate||!g.bounds?(g&&f.cleanSlide(g),f.setContent(d,j),1===k&&(f.currItem=g,f.updateCurrZoomItem(!0)),g.needsUpdate=!1):-1===d.index&&j>=0&&f.setContent(d,j),g&&g.container&&(hd(g,rb),Hb(g));x=!1}t=s=f.currItem.initialZoomLevel,eb=f.currItem.bounds,eb&&(qb.x=eb.center.x,qb.y=eb.center.y,Gb()),Cb("resize")},zoomTo:function(a,b,c,d,f){b&&(t=s,tc.x=Math.abs(b.x)-qb.x,tc.y=Math.abs(b.y)-qb.y,Lb(pb,qb));var g=Rb(a,!1),h={};Ub("x",g,h,a),Ub("y",g,h,a);var i=s,j={x:qb.x,y:qb.y};Mb(h);var k=function(b){1===b?(s=a,qb.x=h.x,qb.y=h.y):(s=(a-i)*b+i,qb.x=(h.x-j.x)*b+j.x,qb.y=(h.y-j.y)*b+j.y),f&&f(b),Gb()};c?cc("customZoomTo",0,1,c,d||e.easing.sine.inOut,k):k(1)}},ec=30,fc=10,gc={},hc={},ic={},jc={},kc={},lc=[],mc={},nc=[],oc={},pc=0,qc=nb(),rc=0,sc=nb(),tc=nb(),uc=nb(),vc=function(a,b){return a.x===b.x&&a.y===b.y},wc=function(a,b){return Math.abs(a.x-b.x)<g&&Math.abs(a.y-b.y)<g},xc=function(a,b){return oc.x=Math.abs(a.x-b.x),oc.y=Math.abs(a.y-b.y),Math.sqrt(oc.x*oc.x+oc.y*oc.y)},yc=function(){$&&(K($),$=null)},zc=function(){W&&($=J(zc),Pc())},Ac=function(){return!("fit"===i.scaleMode&&s===f.currItem.initialZoomLevel)},Bc=function(a,b){return a?a.className&&a.className.indexOf("pswp__scroll-wrap")>-1?!1:b(a)?a:Bc(a.parentNode,b):!1},Cc={},Dc=function(a,b){return Cc.prevent=!Bc(a.target,i.isClickableElement),Cb("preventDragEvent",a,b,Cc),Cc.prevent},Ec=function(a,b){return b.x=a.pageX,b.y=a.pageY,b.id=a.identifier,b},Fc=function(a,b,c){c.x=.5*(a.x+b.x),c.y=.5*(a.y+b.y)},Gc=function(a,b,c){if(a-R>50){var d=nc.length>2?nc.shift():{};d.x=b,d.y=c,nc.push(d),R=a}},Hc=function(){var a=qb.y-f.currItem.initialPosition.y;return 1-Math.abs(a/(rb.y/2))},Ic={},Jc={},Kc=[],Lc=function(a){for(;Kc.length>0;)Kc.pop();return H?(mb=0,lc.forEach(function(a){0===mb?Kc[0]=a:1===mb&&(Kc[1]=a),mb++})):a.type.indexOf("touch")>-1?a.touches&&a.touches.length>0&&(Kc[0]=Ec(a.touches[0],Ic),a.touches.length>1&&(Kc[1]=Ec(a.touches[1],Jc))):(Ic.x=a.pageX,Ic.y=a.pageY,Ic.id="",Kc[0]=Ic),Kc},Mc=function(a,b){var c,d,e,g,h=0,j=qb[a]+b[a],k=b[a]>0,l=sc.x+b.x,m=sc.x-mc.x;return c=j>eb.min[a]||j<eb.max[a]?i.panEndFriction:1,j=qb[a]+b[a]*c,!i.allowPanToNext&&s!==f.currItem.initialZoomLevel||(fb?"h"!==hb||"x"!==a||Y||(k?(j>eb.min[a]&&(c=i.panEndFriction,h=eb.min[a]-j,d=eb.min[a]-pb[a]),(0>=d||0>m)&&_c()>1?(g=l,0>m&&l>mc.x&&(g=mc.x)):eb.min.x!==eb.max.x&&(e=j)):(j<eb.max[a]&&(c=i.panEndFriction,h=j-eb.max[a],d=pb[a]-eb.max[a]),(0>=d||m>0)&&_c()>1?(g=l,m>0&&l<mc.x&&(g=mc.x)):eb.min.x!==eb.max.x&&(e=j))):g=l,"x"!==a)?void(gb||_||s>f.currItem.fitRatio&&(qb[a]+=b[a]*c)):(void 0!==g&&(Jb(g,!0),_=g===mc.x?!1:!0),eb.min.x!==eb.max.x&&(void 0!==e?qb.x=e:_||(qb.x+=b.x*c)),void 0!==g)},Nc=function(a){if(!("mousedown"===a.type&&a.button>0)){if(Zc)return void a.preventDefault();if(!V||"mousedown"!==a.type){if(Dc(a,!0)&&a.preventDefault(),Cb("pointerDown"),H){var b=e.arraySearch(lc,a.pointerId,"id");0>b&&(b=lc.length),lc[b]={x:a.pageX,y:a.pageY,id:a.pointerId}}var c=Lc(a),d=c.length;ab=null,bc(),W&&1!==d||(W=ib=!0,e.bind(window,p,f),T=lb=jb=U=_=Z=X=Y=!1,hb=null,Cb("firstTouchStart",c),Lb(pb,qb),ob.x=ob.y=0,Lb(jc,c[0]),Lb(kc,jc),mc.x=tb.x*sb,nc=[{x:jc.x,y:jc.y}],R=Q=Db(),Rb(s,!0),yc(),zc()),!bb&&d>1&&!gb&&!_&&(t=s,Y=!1,bb=X=!0,ob.y=ob.x=0,Lb(pb,qb),Lb(gc,c[0]),Lb(hc,c[1]),Fc(gc,hc,uc),tc.x=Math.abs(uc.x)-qb.x,tc.y=Math.abs(uc.y)-qb.y,cb=db=xc(gc,hc))}}},Oc=function(a){if(a.preventDefault(),H){var b=e.arraySearch(lc,a.pointerId,"id");if(b>-1){var c=lc[b];c.x=a.pageX,c.y=a.pageY}}if(W){var d=Lc(a);if(hb||Z||bb)ab=d;else{var f=Math.abs(d[0].x-jc.x)-Math.abs(d[0].y-jc.y);Math.abs(f)>=fc&&(hb=f>0?"h":"v",ab=d)}}},Pc=function(){if(ab){var a=ab.length;if(0!==a)if(Lb(gc,ab[0]),ic.x=gc.x-jc.x,ic.y=gc.y-jc.y,bb&&a>1){if(jc.x=gc.x,jc.y=gc.y,!ic.x&&!ic.y&&vc(ab[1],hc))return;Lb(hc,ab[1]),Y||(Y=!0,Cb("zoomGestureStarted"));var b=xc(gc,hc),c=Uc(b);c>f.currItem.initialZoomLevel+f.currItem.initialZoomLevel/15&&(lb=!0);var d=1,e=Sb(),g=Tb();if(e>c)if(i.pinchToClose&&!lb&&t<=f.currItem.initialZoomLevel){var h=e-c,j=1-h/(e/1.2);Eb(j),Cb("onPinchClose",j),jb=!0}else d=(e-c)/e,d>1&&(d=1),c=e-d*(e/3);else c>g&&(d=(c-g)/(6*e),d>1&&(d=1),c=g+d*e);0>d&&(d=0),cb=b,Fc(gc,hc,qc),ob.x+=qc.x-uc.x,ob.y+=qc.y-uc.y,Lb(uc,qc),qb.x=Kb("x",c),qb.y=Kb("y",c),T=c>s,s=c,Gb()}else{if(!hb)return;if(ib&&(ib=!1,Math.abs(ic.x)>=fc&&(ic.x-=ab[0].x-kc.x),Math.abs(ic.y)>=fc&&(ic.y-=ab[0].y-kc.y)),jc.x=gc.x,jc.y=gc.y,0===ic.x&&0===ic.y)return;if("v"===hb&&i.closeOnVerticalDrag&&!Ac()){ob.y+=ic.y,qb.y+=ic.y;var k=Hc();return U=!0,Cb("onVerticalDrag",k),Eb(k),void Gb()}Gc(Db(),gc.x,gc.y),Z=!0,eb=f.currItem.bounds;var l=Mc("x",ic);l||(Mc("y",ic),Mb(qb),Gb())}}},Qc=function(a){if(P.isOldAndroid){if(V&&"mouseup"===a.type)return;a.type.indexOf("touch")>-1&&(clearTimeout(V),V=setTimeout(function(){V=0},600))}Cb("pointerUp"),Dc(a,!1)&&a.preventDefault();var b;if(H){var c=e.arraySearch(lc,a.pointerId,"id");if(c>-1)if(b=lc.splice(c,1)[0],navigator.pointerEnabled)b.type=a.pointerType||"mouse";else{var d={4:"mouse",2:"touch",3:"pen"};b.type=d[a.pointerType],b.type||(b.type=a.pointerType||"mouse")}}var g,h=Lc(a),i=h.length;if("mouseup"===a.type&&(i=0),2===i)return ab=null,!0;1===i&&Lb(kc,h[0]),0!==i||hb||gb||(b||("mouseup"===a.type?b={x:a.pageX,y:a.pageY,type:"mouse"}:a.changedTouches&&a.changedTouches[0]&&(b={x:a.changedTouches[0].pageX,y:a.changedTouches[0].pageY,type:"touch"})),Cb("touchRelease",a,b));var j=-1;if(0===i&&(W=!1,e.unbind(window,p,f),yc(),bb?j=0:-1!==rc&&(j=Db()-rc)),rc=1===i?Db():-1,g=-1!==j&&150>j?"zoom":"swipe",bb&&2>i&&(bb=!1,1===i&&(g="zoomPointerUp"),Cb("zoomGestureEnded")),ab=null,Z||Y||gb||U)if(bc(),S||(S=Rc()),S.calculateSwipeSpeed("x"),U){var k=Hc();if(.6>k)f.close();else{var l=qb.y,m=kb;cc("verticalDrag",0,1,300,e.easing.cubic.out,function(a){qb.y=(f.currItem.initialPosition.y-l)*a+l,Eb((1-m)*a+m),Gb()}),Cb("onVerticalDrag",1)}}else{if((_||gb)&&0===i){var n=Tc(g,S);if(n)return;g="zoomPointerUp"}if(!gb)return"swipe"!==g?void Vc():void(!_&&s>f.currItem.fitRatio&&Sc(S))}},Rc=function(){var a,b,c={lastFlickOffset:{},lastFlickDist:{},lastFlickSpeed:{},slowDownRatio:{},slowDownRatioReverse:{},speedDecelerationRatio:{},speedDecelerationRatioAbs:{},distanceOffset:{},backAnimDestination:{},backAnimStarted:{},calculateSwipeSpeed:function(d){nc.length>1?(a=Db()-R+50,b=nc[nc.length-2][d]):(a=Db()-Q,b=kc[d]),c.lastFlickOffset[d]=jc[d]-b,c.lastFlickDist[d]=Math.abs(c.lastFlickOffset[d]),c.lastFlickSpeed[d]=c.lastFlickDist[d]>20?c.lastFlickOffset[d]/a:0,Math.abs(c.lastFlickSpeed[d])<.1&&(c.lastFlickSpeed[d]=0),c.slowDownRatio[d]=.95,c.slowDownRatioReverse[d]=1-c.slowDownRatio[d],c.speedDecelerationRatio[d]=1},calculateOverBoundsAnimOffset:function(a,b){c.backAnimStarted[a]||(qb[a]>eb.min[a]?c.backAnimDestination[a]=eb.min[a]:qb[a]<eb.max[a]&&(c.backAnimDestination[a]=eb.max[a]),void 0!==c.backAnimDestination[a]&&(c.slowDownRatio[a]=.7,c.slowDownRatioReverse[a]=1-c.slowDownRatio[a],c.speedDecelerationRatioAbs[a]<.05&&(c.lastFlickSpeed[a]=0,c.backAnimStarted[a]=!0,cc("bounceZoomPan"+a,qb[a],c.backAnimDestination[a],b||300,e.easing.sine.out,function(b){qb[a]=b,Gb()}))))},calculateAnimOffset:function(a){c.backAnimStarted[a]||(c.speedDecelerationRatio[a]=c.speedDecelerationRatio[a]*(c.slowDownRatio[a]+c.slowDownRatioReverse[a]-c.slowDownRatioReverse[a]*c.timeDiff/10),c.speedDecelerationRatioAbs[a]=Math.abs(c.lastFlickSpeed[a]*c.speedDecelerationRatio[a]),c.distanceOffset[a]=c.lastFlickSpeed[a]*c.speedDecelerationRatio[a]*c.timeDiff,qb[a]+=c.distanceOffset[a])},panAnimLoop:function(){return Zb.zoomPan&&(Zb.zoomPan.raf=J(c.panAnimLoop),c.now=Db(),c.timeDiff=c.now-c.lastNow,c.lastNow=c.now,c.calculateAnimOffset("x"),c.calculateAnimOffset("y"),Gb(),c.calculateOverBoundsAnimOffset("x"),c.calculateOverBoundsAnimOffset("y"),c.speedDecelerationRatioAbs.x<.05&&c.speedDecelerationRatioAbs.y<.05)?(qb.x=Math.round(qb.x),qb.y=Math.round(qb.y),Gb(),void _b("zoomPan")):void 0}};return c},Sc=function(a){return a.calculateSwipeSpeed("y"),eb=f.currItem.bounds,a.backAnimDestination={},a.backAnimStarted={},Math.abs(a.lastFlickSpeed.x)<=.05&&Math.abs(a.lastFlickSpeed.y)<=.05?(a.speedDecelerationRatioAbs.x=a.speedDecelerationRatioAbs.y=0,a.calculateOverBoundsAnimOffset("x"),a.calculateOverBoundsAnimOffset("y"),!0):(ac("zoomPan"),a.lastNow=Db(),void a.panAnimLoop())},Tc=function(a,b){var c;gb||(pc=m);var d;if("swipe"===a){var g=jc.x-kc.x,h=b.lastFlickDist.x<10;g>ec&&(h||b.lastFlickOffset.x>20)?d=-1:-ec>g&&(h||b.lastFlickOffset.x<-20)&&(d=1)}var j;d&&(m+=d,0>m?(m=i.loop?_c()-1:0,j=!0):m>=_c()&&(m=i.loop?0:_c()-1,j=!0),(!j||i.loop)&&(ub+=d,sb-=d,c=!0));var k,l=tb.x*sb,n=Math.abs(l-sc.x);return c||l>sc.x==b.lastFlickSpeed.x>0?(k=Math.abs(b.lastFlickSpeed.x)>0?n/Math.abs(b.lastFlickSpeed.x):333,k=Math.min(k,400),k=Math.max(k,250)):k=333,pc===m&&(c=!1),gb=!0,cc("mainScroll",sc.x,l,k,e.easing.cubic.out,Jb,function(){bc(),gb=!1,pc=-1,(c||pc!==m)&&f.updateCurrItem(),Cb("mainScrollAnimComplete")}),c&&f.updateCurrItem(!0),c},Uc=function(a){return 1/db*a*t},Vc=function(){var a=s,b=Sb(),c=Tb();b>s?a=b:s>c&&(a=c);var d,g=1,h=kb;return jb&&!T&&!lb&&b>s?(f.close(),!0):(jb&&(d=function(a){Eb((g-h)*a+h)}),f.zoomTo(a,0,300,e.easing.cubic.out,d),!0)};yb("Gestures",{publicMethods:{initGestures:function(){var a=function(a,b,c,d,e){C=a+b,D=a+c,E=a+d,F=e?a+e:""};H=P.pointerEvent,H&&P.touch&&(P.touch=!1),H?navigator.pointerEnabled?a("pointer","down","move","up","cancel"):a("MSPointer","Down","Move","Up","Cancel"):P.touch?(a("touch","start","move","end","cancel"),I=!0):a("mouse","down","move","up"),p=D+" "+E+" "+F,q=C,H&&!I&&(I=navigator.maxTouchPoints>1||navigator.msMaxTouchPoints>1),f.likelyTouchDevice=I,r[C]=Nc,r[D]=Oc,r[E]=Qc,F&&(r[F]=r[E]),P.touch&&(q+=" mousedown",p+=" mousemove mouseup",r.mousedown=r[C],r.mousemove=r[D],r.mouseup=r[E]),I||(i.allowPanToNext=!1)}}});var Wc,Xc,Yc,Zc,$c,_c,ad,bd=function(b,c,d,g){Wc&&clearTimeout(Wc),Zc=!0,Yc=!0;var h;b.initialLayout?(h=b.initialLayout,b.initialLayout=null):h=i.getThumbBoundsFn&&i.getThumbBoundsFn(m);var j=d?i.hideAnimationDuration:i.showAnimationDuration,k=function(){_b("initialZoom"),d?(f.template.removeAttribute("style"),f.bg.removeAttribute("style")):(Eb(1),c&&(c.style.display="block"),e.addClass(a,"pswp--animated-in"),Cb("initialZoom"+(d?"OutEnd":"InEnd"))),g&&g(),Zc=!1};if(!j||!h||void 0===h.x){var n=function(){Cb("initialZoom"+(d?"Out":"In")),s=b.initialZoomLevel,Lb(qb,b.initialPosition),Gb(),a.style.opacity=d?0:1,Eb(1),k()};return void n()}var o=function(){var c=l,g=!f.currItem.src||f.currItem.loadError||i.showHideOpacity;b.miniImg&&(b.miniImg.style.webkitBackfaceVisibility="hidden"),d||(s=h.w/b.w,qb.x=h.x,qb.y=h.y-M,f[g?"template":"bg"].style.opacity=.001,Gb()),ac("initialZoom"),d&&!c&&e.removeClass(a,"pswp--animated-in"),g&&(d?e[(c?"remove":"add")+"Class"](a,"pswp--animate_opacity"):setTimeout(function(){e.addClass(a,"pswp--animate_opacity")},30)),Wc=setTimeout(function(){if(Cb("initialZoom"+(d?"Out":"In")),d){var f=h.w/b.w,i={x:qb.x,y:qb.y},l=s,m=M,n=kb,o=function(b){z&&(m=e.getScrollY(),z=!1),1===b?(s=f,qb.x=h.x,qb.y=h.y-m):(s=(f-l)*b+l,qb.x=(h.x-i.x)*b+i.x,qb.y=(h.y-m-i.y)*b+i.y),Gb(),g?a.style.opacity=1-b:Eb(n-b*n)};c?cc("initialZoom",0,1,j,e.easing.cubic.out,o,k):(o(1),Wc=setTimeout(k,j+20))}else s=b.initialZoomLevel,Lb(qb,b.initialPosition),Gb(),Eb(1),g?a.style.opacity=1:Eb(1),Wc=setTimeout(k,j+20)},d?25:90)};o()},cd={},dd=[],ed={index:0,errorMsg:'<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',forceProgressiveLoading:!1,preload:[1,1],getNumItemsFn:function(){return Xc.length}},fd=function(){return{center:{x:0,y:0},max:{x:0,y:0},min:{x:0,y:0}}},gd=function(a,b,c){var d=a.bounds;d.center.x=Math.round((cd.x-b)/2),d.center.y=Math.round((cd.y-c)/2)+a.vGap.top,d.max.x=b>cd.x?Math.round(cd.x-b):d.center.x,d.max.y=c>cd.y?Math.round(cd.y-c)+a.vGap.top:d.center.y,d.min.x=b>cd.x?0:d.center.x,d.min.y=c>cd.y?a.vGap.top:d.center.y},hd=function(a,b,c){if(a.src&&!a.loadError){var d=!c;if(d&&(a.vGap||(a.vGap={top:0,bottom:0}),Cb("parseVerticalMargin",a)),cd.x=b.x,cd.y=b.y-a.vGap.top-a.vGap.bottom,d){var e=cd.x/a.w,f=cd.y/a.h;a.fitRatio=f>e?e:f;var g=i.scaleMode;"orig"===g?c=1:"fit"===g&&(c=a.fitRatio),c>1&&(c=1),a.initialZoomLevel=c,a.bounds||(a.bounds=fd())}if(!c)return;return gd(a,a.w*c,a.h*c),d&&c===a.initialZoomLevel&&(a.initialPosition=a.bounds.center),a.bounds}return a.w=a.h=0,a.initialZoomLevel=a.fitRatio=1,a.bounds=fd(),a.initialPosition=a.bounds.center,a.bounds},id=function(a,b,c,d,e,g){if(!b.loadError){var h,j=f.isDragging()&&!f.isZooming(),k=a===m||f.isMainScrollAnimating()||j;!e&&(I||i.alwaysFadeIn)&&k&&(h=!0),d&&(h&&(d.style.opacity=0),b.imageAppended=!0,c.appendChild(d),h&&setTimeout(function(){d.style.opacity=1,g&&setTimeout(function(){b&&b.loaded&&b.placeholder&&(b.placeholder.style.display="none",b.placeholder=null)},500)},50))}},jd=function(a){a.loading=!0,a.loaded=!1;var b=a.img=e.createEl("pswp__img","img"),c=function(){a.loading=!1,a.loaded=!0,a.loadComplete?a.loadComplete(a):a.img=null,b.onload=b.onerror=null,b=null};return b.onload=c,b.onerror=function(){a.loadError=!0,c()},b.src=a.src,b},kd=function(a,b){return a.src&&a.loadError&&a.container?(b&&(a.container.innerHTML=""),a.container.innerHTML=i.errorMsg.replace("%url%",a.src),!0):void 0},ld=function(){if(dd.length){for(var a,b=0;b<dd.length;b++)a=dd[b],a.holder.index===a.index&&id(a.index,a.item,a.baseDiv,a.img);dd=[]}};yb("Controller",{publicMethods:{lazyLoadItem:function(a){a=zb(a);var b=$c(a);b&&b.src&&!b.loaded&&!b.loading&&(Cb("gettingData",a,b),jd(b))},initController:function(){e.extend(i,ed,!0),f.items=Xc=c,$c=f.getItemAt,_c=i.getNumItemsFn,ad=i.loop,_c()<3&&(i.loop=!1),Bb("beforeChange",function(a){var b,c=i.preload,d=null===a?!0:a>0,e=Math.min(c[0],_c()),g=Math.min(c[1],_c());for(b=1;(d?g:e)>=b;b++)f.lazyLoadItem(m+b);for(b=1;(d?e:g)>=b;b++)f.lazyLoadItem(m-b)}),Bb("initialLayout",function(){f.currItem.initialLayout=i.getThumbBoundsFn&&i.getThumbBoundsFn(m)}),Bb("mainScrollAnimComplete",ld),Bb("initialZoomInEnd",ld),Bb("destroy",function(){for(var a,b=0;b<Xc.length;b++)a=Xc[b],a.container&&(a.container=null),a.placeholder&&(a.placeholder=null),a.img&&(a.img=null),a.preloader&&(a.preloader=null),a.loadError&&(a.loaded=a.loadError=!1);dd=null})},getItemAt:function(a){return a>=0&&void 0!==Xc[a]?Xc[a]:!1},allowProgressiveImg:function(){return i.forceProgressiveLoading||!I||i.mouseUsed||screen.width>1200},setContent:function(a,b){i.loop&&(b=zb(b));var c=f.getItemAt(a.index);c&&(c.container=null);var d,g=f.getItemAt(b);if(!g)return void(a.el.innerHTML="");Cb("gettingData",b,g),a.index=b,a.item=g;var h=g.container=e.createEl("pswp__zoom-wrap");if(!g.src&&g.html&&(g.html.tagName?h.appendChild(g.html):h.innerHTML=g.html),kd(g),!g.src||g.loadError||g.loaded)g.src&&!g.loadError&&(d=e.createEl("pswp__img","img"),d.style.webkitBackfaceVisibility="hidden",d.style.opacity=1,d.src=g.src,id(b,g,h,d,!0));else{if(g.loadComplete=function(c){if(j){if(c.img.style.webkitBackfaceVisibility="hidden",a&&a.index===b){if(kd(c,!0))return c.loadComplete=c.img=null,hd(c,rb),Hb(c),void(a.index===m&&f.updateCurrZoomItem());c.imageAppended?!Zc&&c.placeholder&&(c.placeholder.style.display="none",c.placeholder=null):P.transform&&(gb||Zc)?dd.push({item:c,baseDiv:h,img:c.img,index:b,holder:a}):id(b,c,h,c.img,gb||Zc)}c.loadComplete=null,c.img=null,Cb("imageLoadComplete",b,c)}},e.features.transform){var k="pswp__img pswp__img--placeholder";k+=g.msrc?"":" pswp__img--placeholder--blank";var l=e.createEl(k,g.msrc?"img":"");g.msrc&&(l.src=g.msrc),l.style.width=g.w+"px",l.style.height=g.h+"px",h.appendChild(l),g.placeholder=l}g.loading||jd(g),f.allowProgressiveImg()&&(!Yc&&P.transform?dd.push({item:g,baseDiv:h,img:g.img,index:b,holder:a}):id(b,g,h,g.img,!0,!0))}hd(g,rb),Yc||b!==m?Hb(g):(fb=h.style,bd(g,d||g.img)),a.el.innerHTML="",a.el.appendChild(h)},cleanSlide:function(a){a.img&&(a.img.onload=a.img.onerror=null),a.loaded=a.loading=a.img=a.imageAppended=!1}}});var md,nd={},od=function(a,b,c){var d=document.createEvent("CustomEvent"),e={origEvent:a,target:a.target,releasePoint:b,pointerType:c||"touch"};d.initCustomEvent("pswpTap",!0,!0,e),a.target.dispatchEvent(d)};yb("Tap",{publicMethods:{initTap:function(){Bb("firstTouchStart",f.onTapStart),Bb("touchRelease",f.onTapRelease),Bb("destroy",function(){nd={},md=null})},onTapStart:function(a){a.length>1&&(clearTimeout(md),md=null)},onTapRelease:function(a,b){if(b&&!Z&&!X&&!$b){var c=b;if(md&&(clearTimeout(md),md=null,wc(c,nd)))return void Cb("doubleTap",c);if("mouse"===b.type)return void od(a,b,"mouse");var d=a.target.tagName.toUpperCase();if("BUTTON"===d||e.hasClass(a.target,"pswp__single-tap"))return void od(a,b);Lb(nd,c),md=setTimeout(function(){od(a,b),md=null},300)}}}});var pd;yb("DesktopZoom",{publicMethods:{initDesktopZoom:function(){N||(I?Bb("mouseUsed",function(){f.setupDesktopZoom()}):f.setupDesktopZoom(!0))},setupDesktopZoom:function(b){pd={};var c="wheel mousewheel DOMMouseScroll";Bb("bindEvents",function(){e.bind(a,c,f.handleMouseWheel)}),Bb("unbindEvents",function(){pd&&e.unbind(a,c,f.handleMouseWheel)}),f.mouseZoomedIn=!1;var d,g=function(){f.mouseZoomedIn&&(e.removeClass(a,"pswp--zoomed-in"),f.mouseZoomedIn=!1),1>s?e.addClass(a,"pswp--zoom-allowed"):e.removeClass(a,"pswp--zoom-allowed"),h()},h=function(){d&&(e.removeClass(a,"pswp--dragging"),d=!1)};Bb("resize",g),Bb("afterChange",g),Bb("pointerDown",function(){f.mouseZoomedIn&&(d=!0,e.addClass(a,"pswp--dragging"))}),Bb("pointerUp",h),b||g()},handleMouseWheel:function(a){if(s<=f.currItem.fitRatio)return i.closeOnScroll||a.preventDefault(),!0;if(a.preventDefault(),a.stopPropagation(),pd.x=0,"deltaX"in a)pd.x=a.deltaX,pd.y=a.deltaY;else if("wheelDelta"in a)a.wheelDeltaX&&(pd.x=-.16*a.wheelDeltaX),pd.y=a.wheelDeltaY?-.16*a.wheelDeltaY:-.16*a.wheelDelta;else{if(!("detail"in a))return;pd.y=a.detail}Rb(s,!0),f.panTo(qb.x-pd.x,qb.y-pd.y)},toggleDesktopZoom:function(b){b=b||{x:rb.x/2,y:rb.y/2+M};var c=i.getDoubleTapZoom(!0,f.currItem),d=s===c;f.mouseZoomedIn=!d,f.zoomTo(d?f.currItem.initialZoomLevel:c,b,333),e[(d?"remove":"add")+"Class"](a,"pswp--zoomed-in")}}});var qd,rd,sd,td,ud,vd,wd,xd,yd,zd,Ad,Bd,Cd={history:!0,galleryUID:1},Dd=function(){return Ad.hash.substring(1)},Ed=function(){qd&&clearTimeout(qd),sd&&clearTimeout(sd)},Fd=function(){var a=Dd(),b={};if(a.length<5)return b;for(var c=a.split("&"),d=0;d<c.length;d++)if(c[d]){var e=c[d].split("=");e.length<2||(b[e[0]]=e[1])}return b.pid=parseInt(b.pid,10)-1,b.pid<0&&(b.pid=0),b},Gd=function(){if(sd&&clearTimeout(sd),$b||W)return void(sd=setTimeout(Gd,500));td?clearTimeout(rd):td=!0;var a=wd+"&gid="+i.galleryUID+"&pid="+(m+1);xd||-1===Ad.hash.indexOf(a)&&(zd=!0);var b=Ad.href.split("#")[0]+"#"+a;Bd?"#"+a!==window.location.hash&&history[xd?"replaceState":"pushState"]("",document.title,b):xd?Ad.replace(b):Ad.hash=a,xd=!0,rd=setTimeout(function(){td=!1},60)};yb("History",{publicMethods:{initHistory:function(){if(e.extend(i,Cd,!0),i.history){Ad=window.location,zd=!1,yd=!1,xd=!1,wd=Dd(),Bd="pushState"in history,wd.indexOf("gid=")>-1&&(wd=wd.split("&gid=")[0],wd=wd.split("?gid=")[0]),Bb("afterChange",f.updateURL),Bb("unbindEvents",function(){e.unbind(window,"hashchange",f.onHashChange)});var a=function(){vd=!0,yd||(zd?history.back():wd?Ad.hash=wd:Bd?history.pushState("",document.title,Ad.pathname+Ad.search):Ad.hash=""),Ed()};Bb("unbindEvents",function(){l&&a()}),Bb("destroy",function(){vd||a()}),Bb("firstUpdate",function(){m=Fd().pid});var b=wd.indexOf("pid=");b>-1&&(wd=wd.substring(0,b),"&"===wd.slice(-1)&&(wd=wd.slice(0,-1))),setTimeout(function(){j&&e.bind(window,"hashchange",f.onHashChange)},40)}},onHashChange:function(){return Dd()===wd?(yd=!0,void f.close()):void(td||(ud=!0,f.goTo(Fd().pid),ud=!1))},updateURL:function(){Ed(),ud||(xd?qd=setTimeout(Gd,800):Gd())}}}),e.extend(f,dc)};return a});
},{}],44:[function(require,module,exports){
/*!
* screenfull
* v2.0.0 - 2014-12-22
* (c) Sindre Sorhus; MIT License
*/
!function(){"use strict";var a="undefined"!=typeof module&&module.exports,b="undefined"!=typeof Element&&"ALLOW_KEYBOARD_INPUT"in Element,c=function(){for(var a,b,c=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],d=0,e=c.length,f={};e>d;d++)if(a=c[d],a&&a[1]in document){for(d=0,b=a.length;b>d;d++)f[c[0][d]]=a[d];return f}return!1}(),d={request:function(a){var d=c.requestFullscreen;a=a||document.documentElement,/5\.1[\.\d]* Safari/.test(navigator.userAgent)?a[d]():a[d](b&&Element.ALLOW_KEYBOARD_INPUT)},exit:function(){document[c.exitFullscreen]()},toggle:function(a){this.isFullscreen?this.exit():this.request(a)},raw:c};return c?(Object.defineProperties(d,{isFullscreen:{get:function(){return!!document[c.fullscreenElement]}},element:{enumerable:!0,get:function(){return document[c.fullscreenElement]}},enabled:{enumerable:!0,get:function(){return!!document[c.fullscreenEnabled]}}}),void(a?module.exports=d:window.screenfull=d)):void(a?module.exports=!1:window.screenfull=!1)}();
},{}],45:[function(require,module,exports){
/*

StackBlur - a fast almost Gaussian Blur For Canvas

Version:    0.5
Author:     Mario Klingemann
Contact:    mario@quasimondo.com
Website:    http://www.quasimondo.com/StackBlurForCanvas
Twitter:    @quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr: 
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
        
   
var shg_table = [
         9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
        17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
        19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
        23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

function stackBlurImage( imageID, canvasID, radius, blurAlphaChannel )
{
            
    var img = document.getElementById( imageID );
    var w = img.naturalWidth;
    var h = img.naturalHeight;
       
    var canvas = document.getElementById( canvasID );
      
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w;
    canvas.height = h;
    
    var context = canvas.getContext("2d");
    context.clearRect( 0, 0, w, h );
    context.drawImage( img, 0, 0 );

    if ( isNaN(radius) || radius < 1 ) return;
    
    if ( blurAlphaChannel )
        stackBlurCanvasRGBA( canvasID, 0, 0, w, h, radius );
    else 
        stackBlurCanvasRGB( canvasID, 0, 0, w, h, radius );
}


function stackBlurCanvasRGBA( id, top_x, top_y, width, height, radius )
{
    if ( isNaN(radius) || radius < 1 ) return;
    radius |= 0;
    
    var canvas  = document.getElementById( id );
    var context = canvas.getContext("2d");
    var imageData;
    
    try {
      try {
        imageData = context.getImageData( top_x, top_y, width, height );
      } catch(e) {
      
        // NOTE: this part is supposedly only needed if you want to work with local files
        // so it might be okay to remove the whole try/catch block and just use
        // imageData = context.getImageData( top_x, top_y, width, height );
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            imageData = context.getImageData( top_x, top_y, width, height );
        } catch(e) {
            alert("Cannot access local image");
            throw new Error("unable to access local image data: " + e);
            return;
        }
      }
    } catch(e) {
      alert("Cannot access image");
      throw new Error("unable to access image data: " + e);
    }
            
    var pixels = imageData.data;
            
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
    r_out_sum, g_out_sum, b_out_sum, a_out_sum,
    r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
    pr, pg, pb, pa, rbs;
            
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1  = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1  = radius + 1;
    var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
    
    var stackStart = new BlurStack();
    var stack = stackStart;
    for ( i = 1; i < div; i++ )
    {
        stack = stack.next = new BlurStack();
        if ( i == radiusPlus1 ) var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;
    
    yw = yi = 0;
    
    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];
    
    for ( y = 0; y < height; y++ )
    {
        r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
        
        r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
        g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
        b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
        a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        
        stack = stackStart;
        
        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        
        for( i = 1; i < radiusPlus1; i++ )
        {
            p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
            r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
            g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
            b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
            a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
            
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            
            stack = stack.next;
        }
        
        
        stackIn = stackStart;
        stackOut = stackEnd;
        for ( x = 0; x < width; x++ )
        {
            pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
            if ( pa != 0 )
            {
                pa = 255 / pa;
                pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            } else {
                pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
            }
            
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            
            p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
            
            r_in_sum += ( stackIn.r = pixels[p]);
            g_in_sum += ( stackIn.g = pixels[p+1]);
            b_in_sum += ( stackIn.b = pixels[p+2]);
            a_in_sum += ( stackIn.a = pixels[p+3]);
            
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            a_sum += a_in_sum;
            
            stackIn = stackIn.next;
            
            r_out_sum += ( pr = stackOut.r );
            g_out_sum += ( pg = stackOut.g );
            b_out_sum += ( pb = stackOut.b );
            a_out_sum += ( pa = stackOut.a );
            
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            
            stackOut = stackOut.next;

            yi += 4;
        }
        yw += width;
    }

    
    for ( x = 0; x < width; x++ )
    {
        g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
        
        yi = x << 2;
        r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
        g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
        a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        
        stack = stackStart;
        
        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        
        yp = width;
        
        for( i = 1; i <= radius; i++ )
        {
            yi = ( yp + x ) << 2;
            
            r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
            g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
            b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
            a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
           
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            
            stack = stack.next;
        
            if( i < heightMinus1 )
            {
                yp += width;
            }
        }
        
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for ( y = 0; y < height; y++ )
        {
            p = yi << 2;
            pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
            if ( pa > 0 )
            {
                pa = 255 / pa;
                pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
                pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
                pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
            } else {
                pixels[p] = pixels[p+1] = pixels[p+2] = 0;
            }
            
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
           
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            
            p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
            
            r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
            g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
            b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
            a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
           
            stackIn = stackIn.next;
            
            r_out_sum += ( pr = stackOut.r );
            g_out_sum += ( pg = stackOut.g );
            b_out_sum += ( pb = stackOut.b );
            a_out_sum += ( pa = stackOut.a );
            
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            
            stackOut = stackOut.next;
            
            yi += width;
        }
    }
    
    context.putImageData( imageData, top_x, top_y );
    
}


function stackBlurCanvasRGB( id, top_x, top_y, width, height, radius )
{
    if ( isNaN(radius) || radius < 1 ) return;
    radius |= 0;
    
    var canvas  = document.getElementById( id );
    var context = canvas.getContext("2d");
    var imageData;
    
    try {
      try {
        imageData = context.getImageData( top_x, top_y, width, height );
      } catch(e) {
      
        // NOTE: this part is supposedly only needed if you want to work with local files
        // so it might be okay to remove the whole try/catch block and just use
        // imageData = context.getImageData( top_x, top_y, width, height );
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            imageData = context.getImageData( top_x, top_y, width, height );
        } catch(e) {
            alert("Cannot access local image");
            throw new Error("unable to access local image data: " + e);
            return;
        }
      }
    } catch(e) {
      alert("Cannot access image");
      throw new Error("unable to access image data: " + e);
    }
            
    var pixels = imageData.data;
            
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
    r_out_sum, g_out_sum, b_out_sum,
    r_in_sum, g_in_sum, b_in_sum,
    pr, pg, pb, rbs;
            
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1  = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1  = radius + 1;
    var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
    
    var stackStart = new BlurStack();
    var stack = stackStart;
    for ( i = 1; i < div; i++ )
    {
        stack = stack.next = new BlurStack();
        if ( i == radiusPlus1 ) var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;
    
    yw = yi = 0;
    
    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];
    
    for ( y = 0; y < height; y++ )
    {
        r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
        
        r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
        g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
        b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        
        stack = stackStart;
        
        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next;
        }
        
        for( i = 1; i < radiusPlus1; i++ )
        {
            p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
            r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
            g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
            b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
            
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            
            stack = stack.next;
        }
        
        
        stackIn = stackStart;
        stackOut = stackEnd;
        for ( x = 0; x < width; x++ )
        {
            pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
            pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
            pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
            
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            
            p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
            
            r_in_sum += ( stackIn.r = pixels[p]);
            g_in_sum += ( stackIn.g = pixels[p+1]);
            b_in_sum += ( stackIn.b = pixels[p+2]);
            
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            
            stackIn = stackIn.next;
            
            r_out_sum += ( pr = stackOut.r );
            g_out_sum += ( pg = stackOut.g );
            b_out_sum += ( pb = stackOut.b );
            
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            
            stackOut = stackOut.next;

            yi += 4;
        }
        yw += width;
    }

    
    for ( x = 0; x < width; x++ )
    {
        g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
        
        yi = x << 2;
        r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
        g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        
        stack = stackStart;
        
        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next;
        }
        
        yp = width;
        
        for( i = 1; i <= radius; i++ )
        {
            yi = ( yp + x ) << 2;
            
            r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
            g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
            b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
            
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            
            stack = stack.next;
        
            if( i < heightMinus1 )
            {
                yp += width;
            }
        }
        
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for ( y = 0; y < height; y++ )
        {
            p = yi << 2;
            pixels[p]   = (r_sum * mul_sum) >> shg_sum;
            pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
            pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
            
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            
            p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
            
            r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
            g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
            b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
            
            stackIn = stackIn.next;
            
            r_out_sum += ( pr = stackOut.r );
            g_out_sum += ( pg = stackOut.g );
            b_out_sum += ( pb = stackOut.b );
            
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            
            stackOut = stackOut.next;
            
            yi += width;
        }
    }
    
    context.putImageData( imageData, top_x, top_y );
    
}

function BlurStack()
{
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
}

// edit by luglio7

module.exports.stackBlurImage       = stackBlurImage;
module.exports.stackBlurCanvasRGBA  = stackBlurCanvasRGBA;
module.exports.stackBlurCanvasRGB   = stackBlurCanvasRGB;
module.exports.BlurStack            = BlurStack;
},{}],46:[function(require,module,exports){
/*! VelocityJS.org (1.1.0). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */
!function(e){function t(e){var t=e.length,r=$.type(e);return"function"===r||$.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===r||0===t||"number"==typeof t&&t>0&&t-1 in e}if(!e.jQuery){var $=function(e,t){return new $.fn.init(e,t)};$.isWindow=function(e){return null!=e&&e==e.window},$.type=function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?a[o.call(e)]||"object":typeof e},$.isArray=Array.isArray||function(e){return"array"===$.type(e)},$.isPlainObject=function(e){var t;if(!e||"object"!==$.type(e)||e.nodeType||$.isWindow(e))return!1;try{if(e.constructor&&!n.call(e,"constructor")&&!n.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}for(t in e);return void 0===t||n.call(e,t)},$.each=function(e,r,a){var n,o=0,i=e.length,s=t(e);if(a){if(s)for(;i>o&&(n=r.apply(e[o],a),n!==!1);o++);else for(o in e)if(n=r.apply(e[o],a),n===!1)break}else if(s)for(;i>o&&(n=r.call(e[o],o,e[o]),n!==!1);o++);else for(o in e)if(n=r.call(e[o],o,e[o]),n===!1)break;return e},$.data=function(e,t,a){if(void 0===a){var n=e[$.expando],o=n&&r[n];if(void 0===t)return o;if(o&&t in o)return o[t]}else if(void 0!==t){var n=e[$.expando]||(e[$.expando]=++$.uuid);return r[n]=r[n]||{},r[n][t]=a,a}},$.removeData=function(e,t){var a=e[$.expando],n=a&&r[a];n&&$.each(t,function(e,t){delete n[t]})},$.extend=function(){var e,t,r,a,n,o,i=arguments[0]||{},s=1,l=arguments.length,u=!1;for("boolean"==typeof i&&(u=i,i=arguments[s]||{},s++),"object"!=typeof i&&"function"!==$.type(i)&&(i={}),s===l&&(i=this,s--);l>s;s++)if(null!=(n=arguments[s]))for(a in n)e=i[a],r=n[a],i!==r&&(u&&r&&($.isPlainObject(r)||(t=$.isArray(r)))?(t?(t=!1,o=e&&$.isArray(e)?e:[]):o=e&&$.isPlainObject(e)?e:{},i[a]=$.extend(u,o,r)):void 0!==r&&(i[a]=r));return i},$.queue=function(e,r,a){function n(e,r){var a=r||[];return null!=e&&(t(Object(e))?!function(e,t){for(var r=+t.length,a=0,n=e.length;r>a;)e[n++]=t[a++];if(r!==r)for(;void 0!==t[a];)e[n++]=t[a++];return e.length=n,e}(a,"string"==typeof e?[e]:e):[].push.call(a,e)),a}if(e){r=(r||"fx")+"queue";var o=$.data(e,r);return a?(!o||$.isArray(a)?o=$.data(e,r,n(a)):o.push(a),o):o||[]}},$.dequeue=function(e,t){$.each(e.nodeType?[e]:e,function(e,r){t=t||"fx";var a=$.queue(r,t),n=a.shift();"inprogress"===n&&(n=a.shift()),n&&("fx"===t&&a.unshift("inprogress"),n.call(r,function(){$.dequeue(r,t)}))})},$.fn=$.prototype={init:function(e){if(e.nodeType)return this[0]=e,this;throw new Error("Not a DOM node.")},offset:function(){var t=this[0].getBoundingClientRect?this[0].getBoundingClientRect():{top:0,left:0};return{top:t.top+(e.pageYOffset||document.scrollTop||0)-(document.clientTop||0),left:t.left+(e.pageXOffset||document.scrollLeft||0)-(document.clientLeft||0)}},position:function(){function e(){for(var e=this.offsetParent||document;e&&"html"===!e.nodeType.toLowerCase&&"static"===e.style.position;)e=e.offsetParent;return e||document}var t=this[0],e=e.apply(t),r=this.offset(),a=/^(?:body|html)$/i.test(e.nodeName)?{top:0,left:0}:$(e).offset();return r.top-=parseFloat(t.style.marginTop)||0,r.left-=parseFloat(t.style.marginLeft)||0,e.style&&(a.top+=parseFloat(e.style.borderTopWidth)||0,a.left+=parseFloat(e.style.borderLeftWidth)||0),{top:r.top-a.top,left:r.left-a.left}}};var r={};$.expando="velocity"+(new Date).getTime(),$.uuid=0;for(var a={},n=a.hasOwnProperty,o=a.toString,i="Boolean Number String Function Array Date RegExp Object Error".split(" "),s=0;s<i.length;s++)a["[object "+i[s]+"]"]=i[s].toLowerCase();$.fn.init.prototype=$.fn,e.Velocity={Utilities:$}}}(window),function(e){"object"==typeof module&&"object"==typeof module.exports?module.exports=e():"function"==typeof define&&define.amd?define(e):e()}(function(){return function(e,t,r,a){function n(e){for(var t=-1,r=e?e.length:0,a=[];++t<r;){var n=e[t];n&&a.push(n)}return a}function o(e){return g.isWrapped(e)?e=[].slice.call(e):g.isNode(e)&&(e=[e]),e}function i(e){var t=$.data(e,"velocity");return null===t?a:t}function s(e){return function(t){return Math.round(t*e)*(1/e)}}function l(e,r,a,n){function o(e,t){return 1-3*t+3*e}function i(e,t){return 3*t-6*e}function s(e){return 3*e}function l(e,t,r){return((o(t,r)*e+i(t,r))*e+s(t))*e}function u(e,t,r){return 3*o(t,r)*e*e+2*i(t,r)*e+s(t)}function c(t,r){for(var n=0;m>n;++n){var o=u(r,e,a);if(0===o)return r;var i=l(r,e,a)-t;r-=i/o}return r}function p(){for(var t=0;b>t;++t)w[t]=l(t*x,e,a)}function f(t,r,n){var o,i,s=0;do i=r+(n-r)/2,o=l(i,e,a)-t,o>0?n=i:r=i;while(Math.abs(o)>h&&++s<v);return i}function d(t){for(var r=0,n=1,o=b-1;n!=o&&w[n]<=t;++n)r+=x;--n;var i=(t-w[n])/(w[n+1]-w[n]),s=r+i*x,l=u(s,e,a);return l>=y?c(t,s):0==l?s:f(t,r,r+x)}function g(){V=!0,(e!=r||a!=n)&&p()}var m=4,y=.001,h=1e-7,v=10,b=11,x=1/(b-1),S="Float32Array"in t;if(4!==arguments.length)return!1;for(var P=0;4>P;++P)if("number"!=typeof arguments[P]||isNaN(arguments[P])||!isFinite(arguments[P]))return!1;e=Math.min(e,1),a=Math.min(a,1),e=Math.max(e,0),a=Math.max(a,0);var w=S?new Float32Array(b):new Array(b),V=!1,C=function(t){return V||g(),e===r&&a===n?t:0===t?0:1===t?1:l(d(t),r,n)};C.getControlPoints=function(){return[{x:e,y:r},{x:a,y:n}]};var T="generateBezier("+[e,r,a,n]+")";return C.toString=function(){return T},C}function u(e,t){var r=e;return g.isString(e)?v.Easings[e]||(r=!1):r=g.isArray(e)&&1===e.length?s.apply(null,e):g.isArray(e)&&2===e.length?b.apply(null,e.concat([t])):g.isArray(e)&&4===e.length?l.apply(null,e):!1,r===!1&&(r=v.Easings[v.defaults.easing]?v.defaults.easing:h),r}function c(e){if(e)for(var t=(new Date).getTime(),r=0,n=v.State.calls.length;n>r;r++)if(v.State.calls[r]){var o=v.State.calls[r],s=o[0],l=o[2],u=o[3],f=!!u;u||(u=v.State.calls[r][3]=t-16);for(var d=Math.min((t-u)/l.duration,1),m=0,y=s.length;y>m;m++){var h=s[m],b=h.element;if(i(b)){var S=!1;if(l.display!==a&&null!==l.display&&"none"!==l.display){if("flex"===l.display){var w=["-webkit-box","-moz-box","-ms-flexbox","-webkit-flex"];$.each(w,function(e,t){x.setPropertyValue(b,"display",t)})}x.setPropertyValue(b,"display",l.display)}l.visibility!==a&&"hidden"!==l.visibility&&x.setPropertyValue(b,"visibility",l.visibility);for(var V in h)if("element"!==V){var C=h[V],T,k=g.isString(C.easing)?v.Easings[C.easing]:C.easing;if(1===d)T=C.endValue;else if(T=C.startValue+(C.endValue-C.startValue)*k(d),!f&&T===C.currentValue)continue;if(C.currentValue=T,x.Hooks.registered[V]){var A=x.Hooks.getRoot(V),F=i(b).rootPropertyValueCache[A];F&&(C.rootPropertyValue=F)}var E=x.setPropertyValue(b,V,C.currentValue+(0===parseFloat(T)?"":C.unitType),C.rootPropertyValue,C.scrollData);x.Hooks.registered[V]&&(i(b).rootPropertyValueCache[A]=x.Normalizations.registered[A]?x.Normalizations.registered[A]("extract",null,E[1]):E[1]),"transform"===E[0]&&(S=!0)}l.mobileHA&&i(b).transformCache.translate3d===a&&(i(b).transformCache.translate3d="(0px, 0px, 0px)",S=!0),S&&x.flushTransformCache(b)}}l.display!==a&&"none"!==l.display&&(v.State.calls[r][2].display=!1),l.visibility!==a&&"hidden"!==l.visibility&&(v.State.calls[r][2].visibility=!1),l.progress&&l.progress.call(o[1],o[1],d,Math.max(0,u+l.duration-t),u),1===d&&p(r)}v.State.isTicking&&P(c)}function p(e,t){if(!v.State.calls[e])return!1;for(var r=v.State.calls[e][0],n=v.State.calls[e][1],o=v.State.calls[e][2],s=v.State.calls[e][4],l=!1,u=0,c=r.length;c>u;u++){var p=r[u].element;if(t||o.loop||("none"===o.display&&x.setPropertyValue(p,"display",o.display),"hidden"===o.visibility&&x.setPropertyValue(p,"visibility",o.visibility)),o.loop!==!0&&($.queue(p)[1]===a||!/\.velocityQueueEntryFlag/i.test($.queue(p)[1]))&&i(p)){i(p).isAnimating=!1,i(p).rootPropertyValueCache={};var f=!1;$.each(x.Lists.transforms3D,function(e,t){var r=/^scale/.test(t)?1:0,n=i(p).transformCache[t];i(p).transformCache[t]!==a&&new RegExp("^\\("+r+"[^.]").test(n)&&(f=!0,delete i(p).transformCache[t])}),o.mobileHA&&(f=!0,delete i(p).transformCache.translate3d),f&&x.flushTransformCache(p),x.Values.removeClass(p,"velocity-animating")}if(!t&&o.complete&&!o.loop&&u===c-1)try{o.complete.call(n,n)}catch(d){setTimeout(function(){throw d},1)}s&&o.loop!==!0&&s(n),o.loop!==!0||t||($.each(i(p).tweensContainer,function(e,t){/^rotate/.test(e)&&360===parseFloat(t.endValue)&&(t.endValue=0,t.startValue=360)}),v(p,"reverse",{loop:!0,delay:o.delay})),o.queue!==!1&&$.dequeue(p,o.queue)}v.State.calls[e]=!1;for(var g=0,m=v.State.calls.length;m>g;g++)if(v.State.calls[g]!==!1){l=!0;break}l===!1&&(v.State.isTicking=!1,delete v.State.calls,v.State.calls=[])}var f=function(){if(r.documentMode)return r.documentMode;for(var e=7;e>4;e--){var t=r.createElement("div");if(t.innerHTML="<!--[if IE "+e+"]><span></span><![endif]-->",t.getElementsByTagName("span").length)return t=null,e}return a}(),d=function(){var e=0;return t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||function(t){var r=(new Date).getTime(),a;return a=Math.max(0,16-(r-e)),e=r+a,setTimeout(function(){t(r+a)},a)}}(),g={isString:function(e){return"string"==typeof e},isArray:Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},isFunction:function(e){return"[object Function]"===Object.prototype.toString.call(e)},isNode:function(e){return e&&e.nodeType},isNodeList:function(e){return"object"==typeof e&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(e))&&e.length!==a&&(0===e.length||"object"==typeof e[0]&&e[0].nodeType>0)},isWrapped:function(e){return e&&(e.jquery||t.Zepto&&t.Zepto.zepto.isZ(e))},isSVG:function(e){return t.SVGElement&&e instanceof t.SVGElement},isEmptyObject:function(e){for(var t in e)return!1;return!0}},$,m=!1;if(e.fn&&e.fn.jquery?($=e,m=!0):$=t.Velocity.Utilities,8>=f&&!m)throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");if(7>=f)return void(jQuery.fn.velocity=jQuery.fn.animate);var y=400,h="swing",v={State:{isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),isAndroid:/Android/i.test(navigator.userAgent),isGingerbread:/Android 2\.3\.[3-7]/i.test(navigator.userAgent),isChrome:t.chrome,isFirefox:/Firefox/i.test(navigator.userAgent),prefixElement:r.createElement("div"),prefixMatches:{},scrollAnchor:null,scrollPropertyLeft:null,scrollPropertyTop:null,isTicking:!1,calls:[]},CSS:{},Utilities:$,Redirects:{},Easings:{},Promise:t.Promise,defaults:{queue:"",duration:y,easing:h,begin:a,complete:a,progress:a,display:a,visibility:a,loop:!1,delay:!1,mobileHA:!0,_cacheValues:!0},init:function(e){$.data(e,"velocity",{isSVG:g.isSVG(e),isAnimating:!1,computedStyle:null,tweensContainer:null,rootPropertyValueCache:{},transformCache:{}})},hook:null,mock:!1,version:{major:1,minor:1,patch:0},debug:!1};t.pageYOffset!==a?(v.State.scrollAnchor=t,v.State.scrollPropertyLeft="pageXOffset",v.State.scrollPropertyTop="pageYOffset"):(v.State.scrollAnchor=r.documentElement||r.body.parentNode||r.body,v.State.scrollPropertyLeft="scrollLeft",v.State.scrollPropertyTop="scrollTop");var b=function(){function e(e){return-e.tension*e.x-e.friction*e.v}function t(t,r,a){var n={x:t.x+a.dx*r,v:t.v+a.dv*r,tension:t.tension,friction:t.friction};return{dx:n.v,dv:e(n)}}function r(r,a){var n={dx:r.v,dv:e(r)},o=t(r,.5*a,n),i=t(r,.5*a,o),s=t(r,a,i),l=1/6*(n.dx+2*(o.dx+i.dx)+s.dx),u=1/6*(n.dv+2*(o.dv+i.dv)+s.dv);return r.x=r.x+l*a,r.v=r.v+u*a,r}return function a(e,t,n){var o={x:-1,v:0,tension:null,friction:null},i=[0],s=0,l=1e-4,u=.016,c,p,f;for(e=parseFloat(e)||500,t=parseFloat(t)||20,n=n||null,o.tension=e,o.friction=t,c=null!==n,c?(s=a(e,t),p=s/n*u):p=u;;)if(f=r(f||o,p),i.push(1+f.x),s+=16,!(Math.abs(f.x)>l&&Math.abs(f.v)>l))break;return c?function(e){return i[e*(i.length-1)|0]}:s}}();v.Easings={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},spring:function(e){return 1-Math.cos(4.5*e*Math.PI)*Math.exp(6*-e)}},$.each([["ease",[.25,.1,.25,1]],["ease-in",[.42,0,1,1]],["ease-out",[0,0,.58,1]],["ease-in-out",[.42,0,.58,1]],["easeInSine",[.47,0,.745,.715]],["easeOutSine",[.39,.575,.565,1]],["easeInOutSine",[.445,.05,.55,.95]],["easeInQuad",[.55,.085,.68,.53]],["easeOutQuad",[.25,.46,.45,.94]],["easeInOutQuad",[.455,.03,.515,.955]],["easeInCubic",[.55,.055,.675,.19]],["easeOutCubic",[.215,.61,.355,1]],["easeInOutCubic",[.645,.045,.355,1]],["easeInQuart",[.895,.03,.685,.22]],["easeOutQuart",[.165,.84,.44,1]],["easeInOutQuart",[.77,0,.175,1]],["easeInQuint",[.755,.05,.855,.06]],["easeOutQuint",[.23,1,.32,1]],["easeInOutQuint",[.86,0,.07,1]],["easeInExpo",[.95,.05,.795,.035]],["easeOutExpo",[.19,1,.22,1]],["easeInOutExpo",[1,0,0,1]],["easeInCirc",[.6,.04,.98,.335]],["easeOutCirc",[.075,.82,.165,1]],["easeInOutCirc",[.785,.135,.15,.86]]],function(e,t){v.Easings[t[0]]=l.apply(null,t[1])});var x=v.CSS={RegEx:{isHex:/^#([A-f\d]{3}){1,2}$/i,valueUnwrap:/^[A-z]+\((.*)\)$/i,wrappedValueAlreadyExtracted:/[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,valueSplit:/([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi},Lists:{colors:["fill","stroke","stopColor","color","backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","outlineColor"],transformsBase:["translateX","translateY","scale","scaleX","scaleY","skewX","skewY","rotateZ"],transforms3D:["transformPerspective","translateZ","scaleZ","rotateX","rotateY"]},Hooks:{templates:{textShadow:["Color X Y Blur","black 0px 0px 0px"],boxShadow:["Color X Y Blur Spread","black 0px 0px 0px 0px"],clip:["Top Right Bottom Left","0px 0px 0px 0px"],backgroundPosition:["X Y","0% 0%"],transformOrigin:["X Y Z","50% 50% 0px"],perspectiveOrigin:["X Y","50% 50%"]},registered:{},register:function(){for(var e=0;e<x.Lists.colors.length;e++){var t="color"===x.Lists.colors[e]?"0 0 0 1":"255 255 255 1";x.Hooks.templates[x.Lists.colors[e]]=["Red Green Blue Alpha",t]}var r,a,n;if(f)for(r in x.Hooks.templates){a=x.Hooks.templates[r],n=a[0].split(" ");var o=a[1].match(x.RegEx.valueSplit);"Color"===n[0]&&(n.push(n.shift()),o.push(o.shift()),x.Hooks.templates[r]=[n.join(" "),o.join(" ")])}for(r in x.Hooks.templates){a=x.Hooks.templates[r],n=a[0].split(" ");for(var e in n){var i=r+n[e],s=e;x.Hooks.registered[i]=[r,s]}}},getRoot:function(e){var t=x.Hooks.registered[e];return t?t[0]:e},cleanRootPropertyValue:function(e,t){return x.RegEx.valueUnwrap.test(t)&&(t=t.match(x.RegEx.valueUnwrap)[1]),x.Values.isCSSNullValue(t)&&(t=x.Hooks.templates[e][1]),t},extractValue:function(e,t){var r=x.Hooks.registered[e];if(r){var a=r[0],n=r[1];return t=x.Hooks.cleanRootPropertyValue(a,t),t.toString().match(x.RegEx.valueSplit)[n]}return t},injectValue:function(e,t,r){var a=x.Hooks.registered[e];if(a){var n=a[0],o=a[1],i,s;return r=x.Hooks.cleanRootPropertyValue(n,r),i=r.toString().match(x.RegEx.valueSplit),i[o]=t,s=i.join(" ")}return r}},Normalizations:{registered:{clip:function(e,t,r){switch(e){case"name":return"clip";case"extract":var a;return x.RegEx.wrappedValueAlreadyExtracted.test(r)?a=r:(a=r.toString().match(x.RegEx.valueUnwrap),a=a?a[1].replace(/,(\s+)?/g," "):r),a;case"inject":return"rect("+r+")"}},blur:function(e,t,r){switch(e){case"name":return"-webkit-filter";case"extract":var a=parseFloat(r);if(!a&&0!==a){var n=r.toString().match(/blur\(([0-9]+[A-z]+)\)/i);a=n?n[1]:0}return a;case"inject":return parseFloat(r)?"blur("+r+")":"none"}},opacity:function(e,t,r){if(8>=f)switch(e){case"name":return"filter";case"extract":var a=r.toString().match(/alpha\(opacity=(.*)\)/i);return r=a?a[1]/100:1;case"inject":return t.style.zoom=1,parseFloat(r)>=1?"":"alpha(opacity="+parseInt(100*parseFloat(r),10)+")"}else switch(e){case"name":return"opacity";case"extract":return r;case"inject":return r}}},register:function(){9>=f||v.State.isGingerbread||(x.Lists.transformsBase=x.Lists.transformsBase.concat(x.Lists.transforms3D));for(var e=0;e<x.Lists.transformsBase.length;e++)!function(){var t=x.Lists.transformsBase[e];x.Normalizations.registered[t]=function(e,r,n){switch(e){case"name":return"transform";case"extract":return i(r)===a||i(r).transformCache[t]===a?/^scale/i.test(t)?1:0:i(r).transformCache[t].replace(/[()]/g,"");case"inject":var o=!1;switch(t.substr(0,t.length-1)){case"translate":o=!/(%|px|em|rem|vw|vh|\d)$/i.test(n);break;case"scal":case"scale":v.State.isAndroid&&i(r).transformCache[t]===a&&1>n&&(n=1),o=!/(\d)$/i.test(n);break;case"skew":o=!/(deg|\d)$/i.test(n);break;case"rotate":o=!/(deg|\d)$/i.test(n)}return o||(i(r).transformCache[t]="("+n+")"),i(r).transformCache[t]}}}();for(var e=0;e<x.Lists.colors.length;e++)!function(){var t=x.Lists.colors[e];x.Normalizations.registered[t]=function(e,r,n){switch(e){case"name":return t;case"extract":var o;if(x.RegEx.wrappedValueAlreadyExtracted.test(n))o=n;else{var i,s={black:"rgb(0, 0, 0)",blue:"rgb(0, 0, 255)",gray:"rgb(128, 128, 128)",green:"rgb(0, 128, 0)",red:"rgb(255, 0, 0)",white:"rgb(255, 255, 255)"};/^[A-z]+$/i.test(n)?i=s[n]!==a?s[n]:s.black:x.RegEx.isHex.test(n)?i="rgb("+x.Values.hexToRgb(n).join(" ")+")":/^rgba?\(/i.test(n)||(i=s.black),o=(i||n).toString().match(x.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g," ")}return 8>=f||3!==o.split(" ").length||(o+=" 1"),o;case"inject":return 8>=f?4===n.split(" ").length&&(n=n.split(/\s+/).slice(0,3).join(" ")):3===n.split(" ").length&&(n+=" 1"),(8>=f?"rgb":"rgba")+"("+n.replace(/\s+/g,",").replace(/\.(\d)+(?=,)/g,"")+")"}}}()}},Names:{camelCase:function(e){return e.replace(/-(\w)/g,function(e,t){return t.toUpperCase()})},SVGAttribute:function(e){var t="width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";return(f||v.State.isAndroid&&!v.State.isChrome)&&(t+="|transform"),new RegExp("^("+t+")$","i").test(e)},prefixCheck:function(e){if(v.State.prefixMatches[e])return[v.State.prefixMatches[e],!0];for(var t=["","Webkit","Moz","ms","O"],r=0,a=t.length;a>r;r++){var n;if(n=0===r?e:t[r]+e.replace(/^\w/,function(e){return e.toUpperCase()}),g.isString(v.State.prefixElement.style[n]))return v.State.prefixMatches[e]=n,[n,!0]}return[e,!1]}},Values:{hexToRgb:function(e){var t=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,a;return e=e.replace(t,function(e,t,r,a){return t+t+r+r+a+a}),a=r.exec(e),a?[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]:[0,0,0]},isCSSNullValue:function(e){return 0==e||/^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e)},getUnitType:function(e){return/^(rotate|skew)/i.test(e)?"deg":/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e)?"":"px"},getDisplayType:function(e){var t=e&&e.tagName.toString().toLowerCase();return/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t)?"inline":/^(li)$/i.test(t)?"list-item":/^(tr)$/i.test(t)?"table-row":"block"},addClass:function(e,t){e.classList?e.classList.add(t):e.className+=(e.className.length?" ":"")+t},removeClass:function(e,t){e.classList?e.classList.remove(t):e.className=e.className.toString().replace(new RegExp("(^|\\s)"+t.split(" ").join("|")+"(\\s|$)","gi")," ")}},getPropertyValue:function(e,r,n,o){function s(e,r){function n(){u&&x.setPropertyValue(e,"display","none")}var l=0;if(8>=f)l=$.css(e,r);else{var u=!1;if(/^(width|height)$/.test(r)&&0===x.getPropertyValue(e,"display")&&(u=!0,x.setPropertyValue(e,"display",x.Values.getDisplayType(e))),!o){if("height"===r&&"border-box"!==x.getPropertyValue(e,"boxSizing").toString().toLowerCase()){var c=e.offsetHeight-(parseFloat(x.getPropertyValue(e,"borderTopWidth"))||0)-(parseFloat(x.getPropertyValue(e,"borderBottomWidth"))||0)-(parseFloat(x.getPropertyValue(e,"paddingTop"))||0)-(parseFloat(x.getPropertyValue(e,"paddingBottom"))||0);return n(),c}if("width"===r&&"border-box"!==x.getPropertyValue(e,"boxSizing").toString().toLowerCase()){var p=e.offsetWidth-(parseFloat(x.getPropertyValue(e,"borderLeftWidth"))||0)-(parseFloat(x.getPropertyValue(e,"borderRightWidth"))||0)-(parseFloat(x.getPropertyValue(e,"paddingLeft"))||0)-(parseFloat(x.getPropertyValue(e,"paddingRight"))||0);return n(),p}}var d;d=i(e)===a?t.getComputedStyle(e,null):i(e).computedStyle?i(e).computedStyle:i(e).computedStyle=t.getComputedStyle(e,null),(f||v.State.isFirefox)&&"borderColor"===r&&(r="borderTopColor"),l=9===f&&"filter"===r?d.getPropertyValue(r):d[r],(""===l||null===l)&&(l=e.style[r]),n()}if("auto"===l&&/^(top|right|bottom|left)$/i.test(r)){var g=s(e,"position");("fixed"===g||"absolute"===g&&/top|left/i.test(r))&&(l=$(e).position()[r]+"px")}return l}var l;if(x.Hooks.registered[r]){var u=r,c=x.Hooks.getRoot(u);n===a&&(n=x.getPropertyValue(e,x.Names.prefixCheck(c)[0])),x.Normalizations.registered[c]&&(n=x.Normalizations.registered[c]("extract",e,n)),l=x.Hooks.extractValue(u,n)}else if(x.Normalizations.registered[r]){var p,d;p=x.Normalizations.registered[r]("name",e),"transform"!==p&&(d=s(e,x.Names.prefixCheck(p)[0]),x.Values.isCSSNullValue(d)&&x.Hooks.templates[r]&&(d=x.Hooks.templates[r][1])),l=x.Normalizations.registered[r]("extract",e,d)}return/^[\d-]/.test(l)||(l=i(e)&&i(e).isSVG&&x.Names.SVGAttribute(r)?/^(height|width)$/i.test(r)?e.getBBox()[r]:e.getAttribute(r):s(e,x.Names.prefixCheck(r)[0])),x.Values.isCSSNullValue(l)&&(l=0),v.debug>=2&&console.log("Get "+r+": "+l),l},setPropertyValue:function(e,r,a,n,o){var s=r;if("scroll"===r)o.container?o.container["scroll"+o.direction]=a:"Left"===o.direction?t.scrollTo(a,o.alternateValue):t.scrollTo(o.alternateValue,a);else if(x.Normalizations.registered[r]&&"transform"===x.Normalizations.registered[r]("name",e))x.Normalizations.registered[r]("inject",e,a),s="transform",a=i(e).transformCache[r];else{if(x.Hooks.registered[r]){var l=r,u=x.Hooks.getRoot(r);n=n||x.getPropertyValue(e,u),a=x.Hooks.injectValue(l,a,n),r=u}if(x.Normalizations.registered[r]&&(a=x.Normalizations.registered[r]("inject",e,a),r=x.Normalizations.registered[r]("name",e)),s=x.Names.prefixCheck(r)[0],8>=f)try{e.style[s]=a}catch(c){v.debug&&console.log("Browser does not support ["+a+"] for ["+s+"]")}else i(e)&&i(e).isSVG&&x.Names.SVGAttribute(r)?e.setAttribute(r,a):e.style[s]=a;v.debug>=2&&console.log("Set "+r+" ("+s+"): "+a)}return[s,a]},flushTransformCache:function(e){function t(t){return parseFloat(x.getPropertyValue(e,t))}var r="";if((f||v.State.isAndroid&&!v.State.isChrome)&&i(e).isSVG){var a={translate:[t("translateX"),t("translateY")],skewX:[t("skewX")],skewY:[t("skewY")],scale:1!==t("scale")?[t("scale"),t("scale")]:[t("scaleX"),t("scaleY")],rotate:[t("rotateZ"),0,0]};$.each(i(e).transformCache,function(e){/^translate/i.test(e)?e="translate":/^scale/i.test(e)?e="scale":/^rotate/i.test(e)&&(e="rotate"),a[e]&&(r+=e+"("+a[e].join(" ")+") ",delete a[e])})}else{var n,o;$.each(i(e).transformCache,function(t){return n=i(e).transformCache[t],"transformPerspective"===t?(o=n,!0):(9===f&&"rotateZ"===t&&(t="rotate"),void(r+=t+n+" "))}),o&&(r="perspective"+o+" "+r)}x.setPropertyValue(e,"transform",r)}};x.Hooks.register(),x.Normalizations.register(),v.hook=function(e,t,r){var n=a;return e=o(e),$.each(e,function(e,o){if(i(o)===a&&v.init(o),r===a)n===a&&(n=v.CSS.getPropertyValue(o,t));else{var s=v.CSS.setPropertyValue(o,t,r);"transform"===s[0]&&v.CSS.flushTransformCache(o),n=s}}),n};var S=function(){function e(){return f?k.promise||null:d}function s(){function e(e){function f(e,t){var r=a,n=a,i=a;return g.isArray(e)?(r=e[0],!g.isArray(e[1])&&/^[\d-]/.test(e[1])||g.isFunction(e[1])||x.RegEx.isHex.test(e[1])?i=e[1]:(g.isString(e[1])&&!x.RegEx.isHex.test(e[1])||g.isArray(e[1]))&&(n=t?e[1]:u(e[1],s.duration),e[2]!==a&&(i=e[2]))):r=e,t||(n=n||s.easing),g.isFunction(r)&&(r=r.call(o,V,w)),g.isFunction(i)&&(i=i.call(o,V,w)),[r||0,n,i]}function d(e,t){var r,a;return a=(t||"0").toString().toLowerCase().replace(/[%A-z]+$/,function(e){return r=e,""}),r||(r=x.Values.getUnitType(e)),[a,r]}function m(){var e={myParent:o.parentNode||r.body,position:x.getPropertyValue(o,"position"),fontSize:x.getPropertyValue(o,"fontSize")},a=e.position===L.lastPosition&&e.myParent===L.lastParent,n=e.fontSize===L.lastFontSize;L.lastParent=e.myParent,L.lastPosition=e.position,L.lastFontSize=e.fontSize;var s=100,l={};if(n&&a)l.emToPx=L.lastEmToPx,l.percentToPxWidth=L.lastPercentToPxWidth,l.percentToPxHeight=L.lastPercentToPxHeight;else{var u=i(o).isSVG?r.createElementNS("http://www.w3.org/2000/svg","rect"):r.createElement("div");v.init(u),e.myParent.appendChild(u),$.each(["overflow","overflowX","overflowY"],function(e,t){v.CSS.setPropertyValue(u,t,"hidden")}),v.CSS.setPropertyValue(u,"position",e.position),v.CSS.setPropertyValue(u,"fontSize",e.fontSize),v.CSS.setPropertyValue(u,"boxSizing","content-box"),$.each(["minWidth","maxWidth","width","minHeight","maxHeight","height"],function(e,t){v.CSS.setPropertyValue(u,t,s+"%")}),v.CSS.setPropertyValue(u,"paddingLeft",s+"em"),l.percentToPxWidth=L.lastPercentToPxWidth=(parseFloat(x.getPropertyValue(u,"width",null,!0))||1)/s,l.percentToPxHeight=L.lastPercentToPxHeight=(parseFloat(x.getPropertyValue(u,"height",null,!0))||1)/s,l.emToPx=L.lastEmToPx=(parseFloat(x.getPropertyValue(u,"paddingLeft"))||1)/s,e.myParent.removeChild(u)}return null===L.remToPx&&(L.remToPx=parseFloat(x.getPropertyValue(r.body,"fontSize"))||16),null===L.vwToPx&&(L.vwToPx=parseFloat(t.innerWidth)/100,L.vhToPx=parseFloat(t.innerHeight)/100),l.remToPx=L.remToPx,l.vwToPx=L.vwToPx,l.vhToPx=L.vhToPx,v.debug>=1&&console.log("Unit ratios: "+JSON.stringify(l),o),l}if(s.begin&&0===V)try{s.begin.call(h,h)}catch(y){setTimeout(function(){throw y},1)}if("scroll"===A){var S=/^x$/i.test(s.axis)?"Left":"Top",C=parseFloat(s.offset)||0,T,F,E;s.container?g.isWrapped(s.container)||g.isNode(s.container)?(s.container=s.container[0]||s.container,T=s.container["scroll"+S],E=T+$(o).position()[S.toLowerCase()]+C):s.container=null:(T=v.State.scrollAnchor[v.State["scrollProperty"+S]],F=v.State.scrollAnchor[v.State["scrollProperty"+("Left"===S?"Top":"Left")]],E=$(o).offset()[S.toLowerCase()]+C),l={scroll:{rootPropertyValue:!1,startValue:T,currentValue:T,endValue:E,unitType:"",easing:s.easing,scrollData:{container:s.container,direction:S,alternateValue:F}},element:o},v.debug&&console.log("tweensContainer (scroll): ",l.scroll,o)}else if("reverse"===A){if(!i(o).tweensContainer)return void $.dequeue(o,s.queue);"none"===i(o).opts.display&&(i(o).opts.display="auto"),"hidden"===i(o).opts.visibility&&(i(o).opts.visibility="visible"),i(o).opts.loop=!1,i(o).opts.begin=null,i(o).opts.complete=null,P.easing||delete s.easing,P.duration||delete s.duration,s=$.extend({},i(o).opts,s);var j=$.extend(!0,{},i(o).tweensContainer);for(var H in j)if("element"!==H){var N=j[H].startValue;j[H].startValue=j[H].currentValue=j[H].endValue,j[H].endValue=N,g.isEmptyObject(P)||(j[H].easing=s.easing),v.debug&&console.log("reverse tweensContainer ("+H+"): "+JSON.stringify(j[H]),o)}l=j}else if("start"===A){var j;i(o).tweensContainer&&i(o).isAnimating===!0&&(j=i(o).tweensContainer),$.each(b,function(e,t){if(RegExp("^"+x.Lists.colors.join("$|^")+"$").test(e)){var r=f(t,!0),n=r[0],o=r[1],i=r[2];if(x.RegEx.isHex.test(n)){for(var s=["Red","Green","Blue"],l=x.Values.hexToRgb(n),u=i?x.Values.hexToRgb(i):a,c=0;c<s.length;c++){var p=[l[c]];o&&p.push(o),u!==a&&p.push(u[c]),b[e+s[c]]=p}delete b[e]}}});for(var O in b){var z=f(b[O]),q=z[0],M=z[1],I=z[2];O=x.Names.camelCase(O);var B=x.Hooks.getRoot(O),W=!1;if(i(o).isSVG||x.Names.prefixCheck(B)[1]!==!1||x.Normalizations.registered[B]!==a){(s.display!==a&&null!==s.display&&"none"!==s.display||s.visibility!==a&&"hidden"!==s.visibility)&&/opacity|filter/.test(O)&&!I&&0!==q&&(I=0),s._cacheValues&&j&&j[O]?(I===a&&(I=j[O].endValue+j[O].unitType),W=i(o).rootPropertyValueCache[B]):x.Hooks.registered[O]?I===a?(W=x.getPropertyValue(o,B),I=x.getPropertyValue(o,O,W)):W=x.Hooks.templates[B][1]:I===a&&(I=x.getPropertyValue(o,O));var G,D,X,Y=!1;if(G=d(O,I),I=G[0],X=G[1],G=d(O,q),q=G[0].replace(/^([+-\/*])=/,function(e,t){return Y=t,""}),D=G[1],I=parseFloat(I)||0,q=parseFloat(q)||0,"%"===D&&(/^(fontSize|lineHeight)$/.test(O)?(q/=100,D="em"):/^scale/.test(O)?(q/=100,D=""):/(Red|Green|Blue)$/i.test(O)&&(q=q/100*255,D="")),/[\/*]/.test(Y))D=X;else if(X!==D&&0!==I)if(0===q)D=X;else{p=p||m();var Q=/margin|padding|left|right|width|text|word|letter/i.test(O)||/X$/.test(O)||"x"===O?"x":"y";switch(X){case"%":I*="x"===Q?p.percentToPxWidth:p.percentToPxHeight;break;case"px":break;default:I*=p[X+"ToPx"]}switch(D){case"%":I*=1/("x"===Q?p.percentToPxWidth:p.percentToPxHeight);break;case"px":break;default:I*=1/p[D+"ToPx"]}}switch(Y){case"+":q=I+q;break;case"-":q=I-q;break;case"*":q=I*q;break;case"/":q=I/q}l[O]={rootPropertyValue:W,startValue:I,currentValue:I,endValue:q,unitType:D,easing:M},v.debug&&console.log("tweensContainer ("+O+"): "+JSON.stringify(l[O]),o)}else v.debug&&console.log("Skipping ["+B+"] due to a lack of browser support.")}l.element=o}l.element&&(x.Values.addClass(o,"velocity-animating"),R.push(l),""===s.queue&&(i(o).tweensContainer=l,i(o).opts=s),i(o).isAnimating=!0,V===w-1?(v.State.calls.length>1e4&&(v.State.calls=n(v.State.calls)),v.State.calls.push([R,h,s,null,k.resolver]),v.State.isTicking===!1&&(v.State.isTicking=!0,c())):V++)}var o=this,s=$.extend({},v.defaults,P),l={},p;switch(i(o)===a&&v.init(o),parseFloat(s.delay)&&s.queue!==!1&&$.queue(o,s.queue,function(e){v.velocityQueueEntryFlag=!0,i(o).delayTimer={setTimeout:setTimeout(e,parseFloat(s.delay)),next:e}}),s.duration.toString().toLowerCase()){case"fast":s.duration=200;break;case"normal":s.duration=y;break;case"slow":s.duration=600;break;default:s.duration=parseFloat(s.duration)||1}v.mock!==!1&&(v.mock===!0?s.duration=s.delay=1:(s.duration*=parseFloat(v.mock)||1,s.delay*=parseFloat(v.mock)||1)),s.easing=u(s.easing,s.duration),s.begin&&!g.isFunction(s.begin)&&(s.begin=null),s.progress&&!g.isFunction(s.progress)&&(s.progress=null),s.complete&&!g.isFunction(s.complete)&&(s.complete=null),s.display!==a&&null!==s.display&&(s.display=s.display.toString().toLowerCase(),"auto"===s.display&&(s.display=v.CSS.Values.getDisplayType(o))),s.visibility!==a&&null!==s.visibility&&(s.visibility=s.visibility.toString().toLowerCase()),s.mobileHA=s.mobileHA&&v.State.isMobile&&!v.State.isGingerbread,s.queue===!1?s.delay?setTimeout(e,s.delay):e():$.queue(o,s.queue,function(t,r){return r===!0?(k.promise&&k.resolver(h),!0):(v.velocityQueueEntryFlag=!0,void e(t))}),""!==s.queue&&"fx"!==s.queue||"inprogress"===$.queue(o)[0]||$.dequeue(o)}var l=arguments[0]&&($.isPlainObject(arguments[0].properties)&&!arguments[0].properties.names||g.isString(arguments[0].properties)),f,d,m,h,b,P;if(g.isWrapped(this)?(f=!1,m=0,h=this,d=this):(f=!0,m=1,h=l?arguments[0].elements:arguments[0]),h=o(h)){l?(b=arguments[0].properties,P=arguments[0].options):(b=arguments[m],P=arguments[m+1]);var w=h.length,V=0;if("stop"!==b&&!$.isPlainObject(P)){var C=m+1;P={};for(var T=C;T<arguments.length;T++)g.isArray(arguments[T])||!/^(fast|normal|slow)$/i.test(arguments[T])&&!/^\d/.test(arguments[T])?g.isString(arguments[T])||g.isArray(arguments[T])?P.easing=arguments[T]:g.isFunction(arguments[T])&&(P.complete=arguments[T]):P.duration=arguments[T]}var k={promise:null,resolver:null,rejecter:null};f&&v.Promise&&(k.promise=new v.Promise(function(e,t){k.resolver=e,k.rejecter=t}));var A;switch(b){case"scroll":A="scroll";break;case"reverse":A="reverse";break;case"stop":$.each(h,function(e,t){i(t)&&i(t).delayTimer&&(clearTimeout(i(t).delayTimer.setTimeout),i(t).delayTimer.next&&i(t).delayTimer.next(),delete i(t).delayTimer)});var F=[];return $.each(v.State.calls,function(e,t){t&&$.each(t[1],function(r,n){var o=g.isString(P)?P:"";return P!==a&&t[2].queue!==o?!0:void $.each(h,function(t,r){r===n&&(P!==a&&($.each($.queue(r,o),function(e,t){g.isFunction(t)&&t(null,!0)}),$.queue(r,o,[])),i(r)&&""===o&&$.each(i(r).tweensContainer,function(e,t){t.endValue=t.currentValue}),F.push(e))})})}),$.each(F,function(e,t){p(t,!0)}),k.promise&&k.resolver(h),e();default:if(!$.isPlainObject(b)||g.isEmptyObject(b)){if(g.isString(b)&&v.Redirects[b]){var E=$.extend({},P),j=E.duration,H=E.delay||0;return E.backwards===!0&&(h=$.extend(!0,[],h).reverse()),$.each(h,function(e,t){parseFloat(E.stagger)?E.delay=H+parseFloat(E.stagger)*e:g.isFunction(E.stagger)&&(E.delay=H+E.stagger.call(t,e,w)),E.drag&&(E.duration=parseFloat(j)||(/^(callout|transition)/.test(b)?1e3:y),E.duration=Math.max(E.duration*(E.backwards?1-e/w:(e+1)/w),.75*E.duration,200)),v.Redirects[b].call(t,t,E||{},e,w,h,k.promise?k:a)
}),e()}var N="Velocity: First argument ("+b+") was not a property map, a known action, or a registered redirect. Aborting.";return k.promise?k.rejecter(new Error(N)):console.log(N),e()}A="start"}var L={lastParent:null,lastPosition:null,lastFontSize:null,lastPercentToPxWidth:null,lastPercentToPxHeight:null,lastEmToPx:null,remToPx:null,vwToPx:null,vhToPx:null},R=[];$.each(h,function(e,t){g.isNode(t)&&s.call(t)});var E=$.extend({},v.defaults,P),O;if(E.loop=parseInt(E.loop),O=2*E.loop-1,E.loop)for(var z=0;O>z;z++){var q={delay:E.delay,progress:E.progress};z===O-1&&(q.display=E.display,q.visibility=E.visibility,q.complete=E.complete),S(h,"reverse",q)}return e()}};v=$.extend(S,v),v.animate=S;var P=t.requestAnimationFrame||d;return v.State.isMobile||r.hidden===a||r.addEventListener("visibilitychange",function(){r.hidden?(P=function(e){return setTimeout(function(){e(!0)},16)},c()):P=t.requestAnimationFrame||d}),e.Velocity=v,e!==t&&(e.fn.velocity=S,e.fn.velocity.defaults=v.defaults),$.each(["Down","Up"],function(e,t){v.Redirects["slide"+t]=function(e,r,n,o,i,s){var l=$.extend({},r),u=l.begin,c=l.complete,p={height:"",marginTop:"",marginBottom:"",paddingTop:"",paddingBottom:""},f={};l.display===a&&(l.display="Down"===t?"inline"===v.CSS.Values.getDisplayType(e)?"inline-block":"block":"none"),l.begin=function(){u&&u.call(i,i);for(var r in p){f[r]=e.style[r];var a=v.CSS.getPropertyValue(e,r);p[r]="Down"===t?[a,0]:[0,a]}f.overflow=e.style.overflow,e.style.overflow="hidden"},l.complete=function(){for(var t in f)e.style[t]=f[t];c&&c.call(i,i),s&&s.resolver(i)},v(e,p,l)}}),$.each(["In","Out"],function(e,t){v.Redirects["fade"+t]=function(e,r,n,o,i,s){var l=$.extend({},r),u={opacity:"In"===t?1:0},c=l.complete;l.complete=n!==o-1?l.begin=null:function(){c&&c.call(i,i),s&&s.resolver(i)},l.display===a&&(l.display="In"===t?"auto":"none"),v(this,u,l)}}),v}(window.jQuery||window.Zepto||window,window,document)});

},{}],47:[function(require,module,exports){
module.exports = require('./src/app');
},{"./src/app":49}],48:[function(require,module,exports){
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {

      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    configure.call(this, conf);
  }

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }

    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }

        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = defaultMaxListeners;

            if (typeof this._events.maxListeners !== 'undefined') {
              m = this._events.maxListeners;
            }

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              console.trace();
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  }

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._events || init.call(this);
    this._events.maxListeners = n;
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) { return false; }
    }

    // Loop through the *_all* functions and invoke them.
    if (this._all) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        this._all[i].apply(this, args);
      }
    }

    // If there is no 'error' event listener then throw.
    if (type === 'error') {

      if (!this._all &&
        !this._events.error &&
        !(this.wildcard && this.listenerTree.error)) {

        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    var handler;

    if(this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    }
    else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      if (arguments.length === 1) {
        handler.call(this);
      }
      else if (arguments.length > 1)
        switch (arguments.length) {
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            var l = arguments.length;
            var args = new Array(l - 1);
            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
            handler.apply(this, args);
        }
      return true;
    }
    else if (handler) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        this.event = type;
        listeners[i].apply(this, args);
      }
      return (listeners.length > 0) || !!this._all;
    }
    else {
      return !!this._all;
    }

  };

  EventEmitter.prototype.on = function(type, listener) {

    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
    else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (!this._events[type].warned) {

        var m = defaultMaxListeners;

        if (typeof this._events.maxListeners !== 'undefined') {
          m = this._events.maxListeners;
        }

        if (m > 0 && this._events[type].length > m) {

          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          console.trace();
        }
      }
    }
    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if(!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          return this;
        }
      }
    } else {
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else {
      if (!this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    exports.EventEmitter2 = EventEmitter;
  }
  else {
    // Browser global.
    window.EventEmitter2 = EventEmitter;
  }
}();

},{}],49:[function(require,module,exports){
(function (global){
"use strict";

var Emitter         = require('eventemitter2').EventEmitter2,
    _               = require('lodash'),
    emitterDefaults = {
        wildcard        : true,
        delimiter       : '.',
        newListener     : false,
        maxListeners    : 100
    },
    Deliverance;

/* CORE EVENTS
 * 
 * deliverance.moduleInit
 * deliverance.moduleSet
 * deliverance.sectionSet
 * deliverance.regionSet
 * deliverance.init
 * 
 */

// Deliverance constructor

Deliverance = function(args){
    if(!(this instanceof Deliverance)){
        return new Deliverance(args);
    }

    // private vars

    var _this       = this,
        defaults    = {
            logs : true
        },
        userModules = {},
        modules     = {},
        config;

    args   = (_.isPlainObject(args))? args : {};
    config = _.assign(defaults, args);

    // private functions

    function moduleInit(moduleName, module, isCore){
        // args
        var args = (config.modules && config.modules[moduleName] && _.isPlainObject(config.modules[moduleName]))? config.modules[moduleName] : {};
        args.emitter            = _this;
        args.emitterDefaults    = emitterDefaults;
        args.log                = _this.log;

        _this.emit('deliverance.moduleInit', moduleName);
        modules[moduleName] = module;

        _this.log(['deliverance : registered', (isCore)? 'core module' : 'module', moduleName]);

        // init module 
        
        if(_.isFunction(module.init)){
            module.init.call(_this, args);
        }
    }

    // properties

    _this.vars = {};

    // components

    _this.components = {};
    _this.components.ListenersCollection = require('./components/listenersCollection').ListenersCollection;

    // methods

    _this.log = function(str, args){
        var type, join;

        args = (_.isPlainObject(args))? args : {};

        if(config.logs && global.console && global.console.log){
            type = (['log', 'warn', 'error', 'info'].indexOf(args.type) < 0)? 'log' : args.type;

            if(_.isArray(str)){
                join = (_.isString(args.join))? args.join : ' ';
                str  = str.join(join);
            }

            console[type](str);
        }
    };

    _this.registerModule = function(name, module){
        if(!_.isString(name)){
            return;
        }

        if(!_.isPlainObject(module)){
            return;
        }

        _this.emit('deliverance.moduleSet', name, module);
        userModules[name] = module;

        return _this;
    };

    _this.getModule = function(module){
        if(!_.isString(module)){
            return false;
        }

        return _this.get('module', module);
    };

    _this.get = function(get, value){
        if(!_.isString(get)){
            return false;
        }

        var returnValue;

        switch(get.trim().toLowerCase()){
            case 'module':
                if(_.isString(value) && modules[value] ){
                    return modules[value];
                }
                if(_.isString(value) && userModules[value] ){
                    return userModules[value];
                }
                break;

            case 'modules names':
                returnValue = _.map(modules, function(init, name){
                    return name;
                });

                break;
        }

        return returnValue;
    };

    _this.init = function(){
        // reset modules 
        modules = {};

        _this.log('deliverance : init');

        // init core modules
        moduleInit.call(_this, 'historyX', require('./modules/historyx'), true);
        moduleInit.call(_this, 'layout',   require('./modules/layout'), true);
        moduleInit.call(_this, 'regions',  require('./modules/regions'), true);

        // init user modules
        _.each(userModules, function(module, name){
            moduleInit.call(_this, name, module);
        });

        _this.emit('deliverance.init');

        // remove setup listeners
        _this.removeAllListeners('deliverance.moduleSet');
        _this.removeAllListeners('deliverance.moduleInit');

        return _this;
    };
};

Deliverance.prototype = new Emitter(emitterDefaults);

module.exports = Deliverance;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/listenersCollection":50,"./modules/historyx":51,"./modules/layout":52,"./modules/regions":53,"eventemitter2":48,"lodash":56}],50:[function(require,module,exports){
"use strict";

var Emitter = require('eventemitter2').EventEmitter2,
    _       = require('lodash');

var ListenersCollection = function(){
    if(!(this instanceof ListenersCollection)){
        return new ListenersCollection();
    }

    var listeners   = {},
        index       = 0;

    this.on = function(source, eventName, listener){
        if(!_.isString(eventName)){
            return false;
        }

        if(!_.isFunction(listener)){
            return false;
        }

        if(!_.isObject(source)){
            return false;
        }

        var type  = (source instanceof Emitter)? 'emitter' : 'native',
            event = {
                source      : source,
                type        : type,
                eventName   : eventName,
                listener    : listener,
                id          : ++index
            };

        if(type === 'emitter'){
            source.on(eventName, listener);
        }
        else {
            source.addEventListener(eventName, listener, false);
        }

        listeners[event.id] = event;

        return event.id;
    };

    this.add = this.on;

    this.off = function(param1, param2, param3){
        var removeById          = false,
            removeAll           = false,
            removeAllFromSource = false,
            id,
            event,
            returnValues;

        // remove by id
        if(_.isNumber(param1) && _.isUndefined(param2) && _.isUndefined(param3)){
            id          = param1;
            removeById  = true;
        }

        // remove with all the params
        if(_.isObject(param1) && _.isString(param2) && _.isFunction(param3)){
            var returnValue = false;
            _.each(listeners, function(event){
                if(event.source === param1 && event.eventName == param2 && event.listener === param3){
                    returnValue = removeEvent(event.id);
                }
            });

            return returnValue;
        }

        // remove everything
        if(_.every([param1, param2, param3], function(param){ return _.isUndefined(param); })){
            returnValues = [];

            _.each(listeners, function(event){
                returnValues.push(removeEvent(event.id));
            });

            return _.every(returnValues, function(value){ return value; });
        }

        // remove all from source
        if(_.isObject(param1) && _.isUndefined(param2) && _.isUndefined(param3)){
            returnValues = [];

            _.each(listeners, function(event){
                if(event.source === param1){
                    returnValues.push(removeEvent(event.id));
                }
            });

            return _.every(returnValues, function(value){ return value; });
        }

        // remove all listeners of one evet
        if(_.isString(param1) && _.isUndefined(param2) && _.isUndefined(param3)){
            returnValues = [];

            _.each(listeners, function(event){
                if(event.eventName === param1){
                    returnValues.push(removeEvent(event.id));
                }
            });

            return _.every(returnValues, function(value){ return value; });
        }

        // remove all listeners of one evet from one source
        if(_.isObject(param1) && _.isString(param2) && _.isUndefined(param3)){
            returnValues = [];

            _.each(listeners, function(event){
                if(event.source === param1 && event.eventName === param2){
                    returnValues.push(removeEvent(event.id));
                }
            });

            return _.every(returnValues, function(value){ return value; });
        }

        if(removeById){
            return removeEvent(id);
        }
    };

    this.remove = this.off;

    this.count = function(){
        return _.size(listeners);
    };

    function removeEvent(id){
        var event = listeners[id];

        if(!_.isPlainObject(event)){
            return false;
        }

        if(event.type === 'emitter'){
            event.source.removeListener(event.eventName, event.listener);
        }

        if(event.type === 'native'){
            event.source.removeEventListener(event.eventName, event.listener, false);
        }

        delete listeners[id];
        return true;
    }
};

module.exports.ListenersCollection = ListenersCollection;
},{"eventemitter2":48,"lodash":56}],51:[function(require,module,exports){
"use strict";

/*
 * HistoryX
 *
 * commands
 * historyX.do.setupPage    : setup the view
 * historyX.do.load         : load a new url
 * historyX.do.pushState    : update the url
 * 
 * events
 * historyX.popstate        : triggered when the url is changed (does not trigger with hash urls)
 * historyX.load.begin
 * historyX.load.progress
 * historyX.load.complete
 * historyX.load.error
 */

var _                   = require('lodash'),
    Emitter             = require('eventemitter2').EventEmitter2,
    Promise             = require('es6-promise').Promise,
    ListenersCollection = require('../components/listenersCollection').ListenersCollection,
    HistoryX,
    historyX;

HistoryX = function(args){
    if(!(this instanceof HistoryX)){
        return new HistoryX(args);
    }

    // return if an instance of HistoryX exist

    if(historyX){
        return;
    }

    // vars

    var _this           = this,
        supports        = {},
        defaults        = {
            htmlCommentContainerRegEx   : /([\s\S]*)<\!\-\-(\s*)deliverance\-content(\s*)\-\-\>([\s\S]+)<\!\-\-(\s*)\/deliverance\-content(\s*)\-\-\>([\s\S]*)/igm, // [\s\S] is like . but matches new lines also
            htmlCommentContainerHtml    : '$4',
            cleanHtml                   : false,
            pushState                   : true,
            contentSelector             : '#content',
            anchorIgnoreClass           : 'history-ignore',
            anchorSetClass              : 'history-set',
            anchorsSelector             : 'a:not(.history-ignore):not(.history-set):not([target="_blank"])',
            headerParameter             : 'historyX-request',
            ajaxRemoveTags              : ['meta', 'title'],
            ajaxEvalJs                  : true,
            beforeLoad                  : function(args){ 
                return args; 
            },
            afterLoad                   : function(args){
                return args;
            },
            beforeReplace               : function(args){
                return args;
            },
            afterReplace                : function(args){
                return args;
            }
        },
        config          = {},
        firstPageSetup  = true,
        listeners       = new ListenersCollection(),
        emitterDefaults,
        emitter,
        log,
        pushStateEnabled,
        isPopState,
        popStateTimeout,
        stop;

    args            = (_.isPlainObject(args))? args : {};
    config          = _.assign(defaults, args);
    emitterDefaults = (_.isPlainObject(config.emitterDefaults))? config.emitterDefaults : {};
    emitter         = (config.emitter && (config.emitter instanceof Emitter))? config.emitter : new Emitter(emitterDefaults);
    log             = (_.isFunction(config.log))? config.log : console.log;

    // expose attributes

    module.exports.config       = config;
    module.exports.listeners    = listeners;

    // supports

    supports.pushState = !!(window.history && window.history.pushState);


    // private functions 

    function eventsSetup(){
        // listeners

        listeners.on(emitter, 'historyX.do.setupPage', function(){
            setAnchors(firstPageSetup);

            // reset vars
            firstPageSetup  = false;
            isPopState      = false;
        });

        listeners.on(emitter, 'historyX.do.pushState', function(args){
            window.history.pushState({ url : args.url }, '', args.url);
        });

        listeners.on(emitter, 'historyX.do.popState', function(){
            // if stop is active delay the effect
            if(stop){
                _.delay(function(){
                    emitter.emit('historyX.do.popState');
                }, 1000);
                return;
            }

            // set pop state and load the new page
            isPopState = true;
            _.defer(function(){
                emitter.emit('historyX.do.load', { url : window.location.href });
            });
        });

        listeners.on(emitter, 'historyX.do.load', loadSequence);

        // windowListners

        // popstate event, delay prevent webkit browsers (chrome) to trigger the event on startup
        if(pushStateEnabled){

            _.delay(function(){
                listeners.on(window, 'popstate', function(e){
                    // do not trigger the historyX.popstate event if hash is present in the url
                    if(window.location.hash){
                        return;
                    }

                    // delay event emit on continuos clicks
                    clearTimeout(popStateTimeout);
                    popStateTimeout = setTimeout(function(){
                        emitter.emit('historyX.do.popState');
                    }, 200);
                });
            }, 1000);
        }
    }

    function setup(){
        // set pushstate
        pushStateEnabled = false;
        if(config.pushState && supports.pushState){
            pushStateEnabled = true;

            // replace current state
            window.history.replaceState({
                url: window.location.href
            }, '', window.location.href);
        }

        // set events
        eventsSetup();

        // set page
        if(document.readyState === 'complete'){
            emitter.emit('historyX.do.setupPage');
        }
        else {
            listeners.on(document, 'readystatechange', function(){
                if(document.readyState === 'complete'){
                    emitter.emit('historyX.do.setupPage');
                    listeners.off(document, 'readystatechange');
                }
            });
        }
    }

    function setAnchors(global){
        var container,
            anchors,
            anchorListenerId;

        global = (_.isBoolean(global))? global : true;

        if(pushStateEnabled){
            // find anchors in <body> or container
            container = (global)? document.querySelector('body') : document.querySelector(config.contentSelector);

            // loop anchors
            if(_.isElement(container)){
                anchors = container.querySelectorAll(config.anchorsSelector);
                if(anchors.length){

                    // loop every anchor
                    _.each(anchors, function(anchor){
                        
                        // disable hash anchors
                        if(anchor.hash){
                            anchor.className = (anchor.className === '')? config.anchorIgnoreClass : [anchor.className, config.anchorIgnoreClass].join(' ');
                            return;
                        }

                        // different domain
                        if(anchor.hostname !== window.location.hostname){
                            anchor.className = (anchor.className === '')? config.anchorIgnoreClass : [anchor.className, config.anchorIgnoreClass].join(' ');
                            return;
                        }

                        // set class
                        anchor.className = (anchor.className === '')? config.anchorSetClass : [anchor.className, config.anchorSetClass].join(' ');

                        // add listener to anchor
                        anchorListenerId = listeners.on(anchor, 'click', function(e){
                            var currentUrl  = window.location.href,
                                anchorUrl   = this.href;

                            e.preventDefault();

                            // if stop is active the click has no effect
                            if(stop){
                                return;   
                            }

                            // launch load event if the anchor url is different from the current one
                            if(currentUrl !== anchorUrl){
                                emitter.emit('historyX.do.load', {url : anchorUrl});
                            }
                        });

                        anchor.deliveranceListenerId = anchorListenerId;
                    });
                }
            }
        }
    }

    function loadSequence(args){
        if(!_.every([config.beforeLoad, config.afterLoad, config.beforeReplace, config.afterReplace], function(f){ return _.isFunction(f); })){
            return;
        }

        var isLoaded = false;

        // load promises

        (function(){
            return new Promise(function(resolve, reject){
                stop = true;
                log('historyX : begins load sequence');
                resolve(args);
            });
        })()
            .then(config.beforeLoad)
            .then(load)
            .then(function(args){
                isLoaded = true;
                return args;
            })
            .then(config.afterLoad)
            .then(function(args){
                stop = false;
                log('historyX : end load sequence');
                return args;
            })
            .catch(function(err){
                log(err);
            });

        // replace promises

        (function(args){
            return new Promise(function(resolve, reject){
                log('historyX : begins replace sequence');
                resolve(args);
            });
        })(args)
            .then(function(args){
                return new Promise(function(resolve, reject){
                    // test isLoaded var every 0.005s
                    var counter         = 0,
                        isLoaded        = function(){
                            var testHtml = function(args){
                                if(args.isHtml){
                                    resolve(args);
                                }
                                else {
                                    reject("historyX : the loaded content is not Html");
                                }
                            };

                            // reject after 10 seconds
                            if(++counter === 2000){
                                reject("historyX : request timeout");
                                return;
                            }

                            if(isLoaded){
                                // test if isHtml property is set
                                if(_.isBoolean(args.isHtml)){
                                    testHtml(args);
                                }
                                else {
                                    emitter.once('historyX.load.complete', function(){
                                        testHtml(args);
                                    });
                                }
                            }
                            else {
                                isLoadedDelay();
                            }
                        },
                        isLoadedDelay   = function(){
                            _.delay(isLoaded, 5);
                        };

                    // test isLoaded var
                    isLoaded();
                });
            })
            .then(config.beforeReplace)
            .then(parseHtmlResponse)
            .then(replaceHtmlContent)
            .then(function(args){
                if(!isPopState){
                    emitter.emit('historyX.do.pushState', args);
                }
                
                emitter.emit('historyX.do.setupPage', args);
            })
            .then(config.afterReplace)
            .then(function(args){
                stop = false;
                log('historyX : end replace sequence');
                return args;
            })
            .catch(function(err){
                stop = false;
                log(err);
            });
    }

    function load(args){
        return new Promise(function(resolve, reject){
            if(!(_.isPlainObject(args) && _.isString(args.url))){
                reject();
            }

            var xhr = new XMLHttpRequest();

            xhr.open('GET', args.url, true);

            xhr.setRequestHeader(config.headerParameter, 1);

            xhr.addEventListener('error', function(e){
                emitter.emit('historyX.load.error');
                reject(e);
            });

            xhr.addEventListener('progress', function(e){
                var percent = (e.lengthComputable)? e.loaded / e.total : '?';
                emitter.emit('historyX.load.progress', percent);
            });

            xhr.addEventListener('load', function(e){
                log(['historyX : load completed with content-type:', xhr.getResponseHeader('Content-Type')]);
                args.xhr    = xhr;
                args.isHtml = !!xhr.getResponseHeader('Content-Type').match(/text\/html/i);

                emitter.emit('historyX.load.complete', args);

                if(args.isHtml){
                    emitter.emit('historyX.load.complete.html', args);
                }
                else {
                    emitter.emit('historyX.load.complete.noHtml', args);   
                }

                resolve(args);
            });

            emitter.emit('historyX.load.begin');

            xhr.send();
        });
    }

    function parseHtmlResponse(args){
        if(!(args && args.xhr)){
            return;
        }

        var html = args.xhr.responseText,
            tagRegEx,
            contentTagRegEx,
            title;

        // clean html
        if(config.cleanHtml){
            // remove newlines
            html = html.replace(/(\r\n|\n|\r)/gm, '');
            // remove hidden chars
            html = html.replace(/[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g, '');
            // remove multiple whitespaces
            html = html.replace(/\s+/g, ' ');
            // remove space between tags
            html = html.split('> <').join('><');
        }

        // find title tag
        title = html.match(/<title>([\s\S]*)<\/title>/im);
        if(_.isArray(title) && title[1]){
            title = title[1];
            // set page title in app.vars.pageTitle
            if(window.app && window.app.vars){
                window.app.vars.pageTitle = title;
            }
        }

        // apply replace regex
        html = html.replace(config.htmlCommentContainerRegEx, config.htmlCommentContainerHtml).trim();

        // remove tags
        if(_.isArray(config.ajaxRemoveTags)){
            config.ajaxRemoveTags.forEach(function(tag){
                tagRegEx        = new RegExp(['<', tag, '(.+?)', '>'].join(''), 'gi');
                contentTagRegEx = new RegExp(['<', tag, '(.+?)', tag, '(.+?)', '>'].join(''), 'gi');
                html = html.replace(tagRegEx, '');
                html = html.replace(contentTagRegEx, '');
            });
        }

        // set html string to args object
        args.html = html;

        return args;
    }

    function replaceHtmlContent(args){
        if(!(args && args.html)){
            return;
        }

        var content = document.querySelector(config.contentSelector),
            scripts,
            remoteScript;

        if(_.isElement(content)){
            
            emitter.emit('historyX.replace.before', args);

            // remove content
            _.each(document.querySelectorAll([config.contentSelector, '> *'].join(' ')), function(el){
                el.parentNode.removeChild(el);
            });

            // append new content
            content.innerHTML = args.html;

            // execute & remove Js
            _.each(content.querySelectorAll('script'), function(script){
                if(config.ajaxEvalJs){
                    if(script.getAttribute("src")){
                        if(script.getAttribute("type") && script.getAttribute("type") !== 'text/javascript'){
                            return;
                        }
                        remoteScript = document.createElement('script');
                        remoteScript.setAttribute('src', script.getAttribute("src"));
                        content.appendChild(remoteScript);
                    }
                    else {
                        // inline js
                        if(script.innerHTML.length){
                            eval(script.innerHTML);
                        }
                    }
                }

                // remove script elements after execution
                if(remoteScript){
                    remoteScript.remove();
                }
                script.remove();
            });

            emitter.emit('historyX.replace.after', args);
        }

        return args;
    }


    // methods

    _this.destroy = function(){
        // @todo
    };

    // init

    setup();
};

module.exports.init = function(args){
    historyX = new HistoryX(args);
};

module.exports.HistoryX = HistoryX;
},{"../components/listenersCollection":50,"es6-promise":54,"eventemitter2":48,"lodash":56}],52:[function(require,module,exports){
"use strict";

/*
 * Layout
 * 
 * events emitted
 *
 * window.resize
 * document.ready
 * layout.breakpointchange
 * 
 */

var _                   = require('lodash'),
    Emitter             = require('eventemitter2').EventEmitter2,
    Promise             = require('es6-promise').Promise,
    ListenersCollection,
    app,
    emitter,
    log;

module.exports.init = function(args){
    var mediaqueries    = [],
        emitterDefaults,
        resizeTimeout,
        listeners,
        breakpoints;

    app                 = this;
    ListenersCollection = app.components.ListenersCollection;
    emitterDefaults     = (_.isPlainObject(args.emitterDefaults))? args.emitterDefaults : {
        wildcard    : true,
        delimiter   : '.'
    };
    emitter             = (app instanceof Emitter)? app : new Emitter(emitterDefaults);
    log                 = (_.isFunction(app.log))? app.log : console.log;
    listeners           = new ListenersCollection();
    breakpoints         = (_.isPlainObject(args.breakpoints))? args.breakpoints : null;

    // change title
    listeners.on(emitter, 'historyX.replace.after', function(){
        if(app.vars && app.vars.pageTitle && _.isString(app.vars.pageTitle)){
            document.title = app.vars.pageTitle;
        }
    });

    // window resize
    listeners.on(window, 'resize', function(){
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function(){
            emitter.emit('window.resize');
        }, 300);
    });

    // responsive breakpoints management
    function matchMediaQueries(){
        mediaqueries.forEach(function(mq){
            var html        = document.querySelector('html'),
                htmlClasses = (html.className.length)? html.className.split(" ") : [];

            // add class to html element
            if(mq.matches){
                if(!_.contains(htmlClasses, mq.cssClass)){
                    htmlClasses.push(mq.cssClass);
                    emitter.emit(['layout', mq.cssClass].join('.'));
                    emitter.emit('layout.breakpointchange', mq.cssClass);
                }
            }
            // remove class to html element
            else {
                _.pull(htmlClasses, mq.cssClass);
            }

            html.className = htmlClasses.join(" ");
        });
    }

    listeners.on(emitter, 'document.ready', function(){
        if((!!window.matchMedia) && _.isPlainObject(breakpoints)){
            _.each(breakpoints, function(mediaQuery, key){
                var mq = window.matchMedia(mediaQuery);
                mq.cssClass = key;
                mq.addListener(matchMediaQueries);
                mediaqueries.push(mq);
            });

            matchMediaQueries();
        }
    });

    // ready event
    if(document.readyState === 'complete'){
        emitter.emit('document.ready');
    }
    else {
        listeners.on(document, 'readystatechange', function(){
            if(document.readyState === 'complete'){
                emitter.emit('document.ready');
                listeners.off(document, 'readystatechange');
            }
        });
    }
};
},{"es6-promise":54,"eventemitter2":48,"lodash":56}],53:[function(require,module,exports){
"use strict";

/*
 * HistoryX
 * 
 * events
 * regions.in
 * regions.out
 * 
 * region.init
 * region.enter
 * region.quit
 *
 */

var _                   = require('lodash'),
    Promise             = require('es6-promise').Promise,
    regions             = {},
    index               = 0,
    instances           = [],
    regionsCounter      = 0,
    ListenersCollection,
    listeners,
    app,
    historyX;

function Region(){
    // test instance
    if(!(this instanceof Region)){
        return new Region();
    }
}

Region.prototype.enter = function(){
    app.emit('region.enter', this);
};

Region.prototype.quit = function(){
    app.emit('region.quit', this);
};

module.exports.create = function(name, el){

    // test args
    if(!(_.isString(name) && _.isElement(el))){
        return;
    }

    // test region
    if(!regions[name]){
        return;
    }

    // create region
    var region = new Region(),
        lId,
        elName;

    region = _.extend(region, regions[name]);

    // set properties
    region.name         = name;
    region.id           = ++index;
    region.el           = el;
    region.listeners    = new ListenersCollection();
    region.isGlobal     = isGlobal(region.el);
    region.isSub        = isSub(region.el);
    region.els          = {};
    region.vars         = {};

    // set region element id
    region.el.setAttribute('data-deliverance-region-id', region.id);

    // set elements
    _.each(region.el.querySelectorAll('[data-deliverance-element]'), function(el){
        elName = _.map(el.getAttribute('data-deliverance-element').trim().replace(/\s/g, '-').split('-'), function(str, i){
            str = str.toLowerCase();
            if(i > 0){
                str = [str.substr(0, 1).toUpperCase(), str.substr(1).toLowerCase()].join('');
            }
            return str;
        }).join('');
        region.els[elName] = el;
    });

    // emit init event
    app.emit('region.init', region);

    instances.push(region);

    // set listeners

    if(!region.isGlobal){
        region.listeners.on(app, 'regions.in', function(){
            region.enter.call(region, region);
        });

        region.listeners.on(app, 'regions.out', function(){
            region.quit.call(region, region);
        });
    }

    // log

    if(app && app.log){
        app.log(["regions : created", region.name, "region"]);
    }

    // init region

    if(_.isFunction(region.init)){
        region.init.call(region, region);
    }

    return region;
};

module.exports.register = function(name, region){
    // test args
    if(!(_.isString(name))){
        return;
    }

    if(!_.isObject(region)){
        region = {};
    }

    name = name.toLowerCase().trim();
    regions[name] = region;

    return module.exports;
};

module.exports.unregister = function(name){
    if(!_.isString(name)){
        return;
    }

    if(regions[name]){
        delete regions[name];
        return true;
    }

    return false;
};

module.exports.init = function(){
    app                 = this;
    historyX            = app.get('module', 'historyX');
    ListenersCollection = app.components.ListenersCollection;
    listeners           = new ListenersCollection();

    listeners.on(app, 'document.ready', function(){
        parse();
    });

    listeners.on(app, 'historyX.replace.after', function(){
        // parse the content regions
        var contentSelector = historyX.config.contentSelector;

        if(_.isString(contentSelector)){
            parse(document.querySelector(contentSelector));
        }
    });

    // set historyX promises
    historyX.config.beforeReplace = function(args){
        return new Promise(function(resolve, reject){
            var contentRegions = _.filter(instances, function(region){
                return !region.isGlobal;
            });

            if(contentRegions.length){
                var lId = listeners.on(app, 'region.quit', function(region){
                    regionsCounter++;
                    destroy(region);

                    if(regionsCounter === contentRegions.length){
                        regionsCounter = 0;
                        listeners.off(lId);
                        resolve(args);
                    }
                });
            }
            else {
                resolve(args);
            }

            app.emit('regions.out', contentRegions);
        });
    };
};

// private functions

function destroy(region){
    if(!(region instanceof Region)){
        return;
    }

    // cancel every region listener
    region.listeners.off();
    // remove element
    region.el.parentNode.removeChild(region.el);
    // remove from instances array
    _.pull(instances, region);
    // set region as undefined
    region = undefined;

    return true;
}

function parse(container){
    if(_.isUndefined(container)){
        container = document.querySelector('body');
    }

    if(!_.isElement(container)){
        return;
    }

    var regions = container.querySelectorAll('[data-deliverance-region]:not([data-deliverance-region-id])'),
        contentRegions;

    if(app && app.log){
        app.log(['regions : found', regions.length, (regions.length === 1)? 'region' : 'regions']);
    }

    _.each(regions, function(region){
        region.setAttribute('data-deliverance-region', region.getAttribute('data-deliverance-region').toLowerCase().trim());
        module.exports.create(region.getAttribute('data-deliverance-region'), region);
    });

    contentRegions = _.filter(instances, function(region){
        return !region.isGlobal;
    });

    app.emit('regions.in', contentRegions);
}

function isGlobal(el){
    if(!_.isElement(el)){
        return;
    }

    var node        = el.parentNode,
        contentNode = document.querySelector(historyX.config.contentSelector),
        returnValue = true; 

    while(returnValue && _.isElement(node)){
        if(node === contentNode){
            returnValue = false;
        }

        node = node.parentNode;
    }

    return returnValue;
}

function isSub(el){
    if(!_.isElement(el)){
        return;
    }

    var node        = el.parentNode,
        returnValue = false;

    while((!returnValue) && _.isElement(node)){
        if(node.getAttribute('data-deliverance-region')){
            returnValue = true;
        }

        node = node.parentNode;
    }

    return returnValue;
}
},{"es6-promise":54,"lodash":56}],54:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.0.1
 */

(function() {
    "use strict";

    function $$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function $$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function $$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var $$utils$$_isArray;

    if (!Array.isArray) {
      $$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      $$utils$$_isArray = Array.isArray;
    }

    var $$utils$$isArray = $$utils$$_isArray;
    var $$utils$$now = Date.now || function() { return new Date().getTime(); };
    function $$utils$$F() { }

    var $$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      $$utils$$F.prototype = o;
      return new $$utils$$F();
    });

    var $$asap$$len = 0;

    var $$asap$$default = function asap(callback, arg) {
      $$asap$$queue[$$asap$$len] = callback;
      $$asap$$queue[$$asap$$len + 1] = arg;
      $$asap$$len += 2;
      if ($$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        $$asap$$scheduleFlush();
      }
    };

    var $$asap$$browserGlobal = (typeof window !== 'undefined') ? window : {};
    var $$asap$$BrowserMutationObserver = $$asap$$browserGlobal.MutationObserver || $$asap$$browserGlobal.WebKitMutationObserver;

    // test for web worker but not in IE10
    var $$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function $$asap$$useNextTick() {
      return function() {
        process.nextTick($$asap$$flush);
      };
    }

    function $$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new $$asap$$BrowserMutationObserver($$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function $$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = $$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function $$asap$$useSetTimeout() {
      return function() {
        setTimeout($$asap$$flush, 1);
      };
    }

    var $$asap$$queue = new Array(1000);

    function $$asap$$flush() {
      for (var i = 0; i < $$asap$$len; i+=2) {
        var callback = $$asap$$queue[i];
        var arg = $$asap$$queue[i+1];

        callback(arg);

        $$asap$$queue[i] = undefined;
        $$asap$$queue[i+1] = undefined;
      }

      $$asap$$len = 0;
    }

    var $$asap$$scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      $$asap$$scheduleFlush = $$asap$$useNextTick();
    } else if ($$asap$$BrowserMutationObserver) {
      $$asap$$scheduleFlush = $$asap$$useMutationObserver();
    } else if ($$asap$$isWorker) {
      $$asap$$scheduleFlush = $$asap$$useMessageChannel();
    } else {
      $$asap$$scheduleFlush = $$asap$$useSetTimeout();
    }

    function $$$internal$$noop() {}
    var $$$internal$$PENDING   = void 0;
    var $$$internal$$FULFILLED = 1;
    var $$$internal$$REJECTED  = 2;
    var $$$internal$$GET_THEN_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function $$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.')
    }

    function $$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        $$$internal$$GET_THEN_ERROR.error = error;
        return $$$internal$$GET_THEN_ERROR;
      }
    }

    function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function $$$internal$$handleForeignThenable(promise, thenable, then) {
       $$asap$$default(function(promise) {
        var sealed = false;
        var error = $$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            $$$internal$$resolve(promise, value);
          } else {
            $$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          $$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          $$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function $$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, thenable._result);
      } else if (promise._state === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, thenable._result);
      } else {
        $$$internal$$subscribe(thenable, undefined, function(value) {
          $$$internal$$resolve(promise, value);
        }, function(reason) {
          $$$internal$$reject(promise, reason);
        });
      }
    }

    function $$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        $$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = $$$internal$$getThen(maybeThenable);

        if (then === $$$internal$$GET_THEN_ERROR) {
          $$$internal$$reject(promise, $$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          $$$internal$$fulfill(promise, maybeThenable);
        } else if ($$utils$$isFunction(then)) {
          $$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          $$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function $$$internal$$resolve(promise, value) {
      if (promise === value) {
        $$$internal$$reject(promise, $$$internal$$selfFullfillment());
      } else if ($$utils$$objectOrFunction(value)) {
        $$$internal$$handleMaybeThenable(promise, value);
      } else {
        $$$internal$$fulfill(promise, value);
      }
    }

    function $$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      $$$internal$$publish(promise);
    }

    function $$$internal$$fulfill(promise, value) {
      if (promise._state !== $$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = $$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
      } else {
        $$asap$$default($$$internal$$publish, promise);
      }
    }

    function $$$internal$$reject(promise, reason) {
      if (promise._state !== $$$internal$$PENDING) { return; }
      promise._state = $$$internal$$REJECTED;
      promise._result = reason;

      $$asap$$default($$$internal$$publishRejection, promise);
    }

    function $$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + $$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + $$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        $$asap$$default($$$internal$$publish, parent);
      }
    }

    function $$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          $$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function $$$internal$$ErrorObject() {
      this.error = null;
    }

    var $$$internal$$TRY_CATCH_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        $$$internal$$TRY_CATCH_ERROR.error = e;
        return $$$internal$$TRY_CATCH_ERROR;
      }
    }

    function $$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = $$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = $$$internal$$tryCatch(callback, detail);

        if (value === $$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          $$$internal$$reject(promise, $$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== $$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        $$$internal$$resolve(promise, value);
      } else if (failed) {
        $$$internal$$reject(promise, error);
      } else if (settled === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, value);
      } else if (settled === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, value);
      }
    }

    function $$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          $$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          $$$internal$$reject(promise, reason);
        });
      } catch(e) {
        $$$internal$$reject(promise, e);
      }
    }

    function $$$enumerator$$makeSettledResult(state, position, value) {
      if (state === $$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
        return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function $$$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor($$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

      if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._init();

        if (this.length === 0) {
          $$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            $$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        $$$internal$$reject(this.promise, this._validationError());
      }
    }

    $$$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return $$utils$$isArray(input);
    };

    $$$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    $$$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var $$$enumerator$$default = $$$enumerator$$Enumerator;

    $$$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var promise = this.promise;
      var input   = this._input;

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    $$$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      if ($$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== $$$internal$$PENDING) {
          entry._onerror = null;
          this._settledAt(entry._state, i, entry._result);
        } else {
          this._willSettleAt(c.resolve(entry), i);
        }
      } else {
        this._remaining--;
        this._result[i] = this._makeResult($$$internal$$FULFILLED, i, entry);
      }
    };

    $$$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === $$$internal$$PENDING) {
        this._remaining--;

        if (this._abortOnReject && state === $$$internal$$REJECTED) {
          $$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

      if (this._remaining === 0) {
        $$$internal$$fulfill(promise, this._result);
      }
    };

    $$$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    $$$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      $$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt($$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt($$$internal$$REJECTED, i, reason);
      });
    };

    var $$promise$all$$default = function all(entries, label) {
      return new $$$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    };

    var $$promise$race$$default = function race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor($$$internal$$noop, label);

      if (!$$utils$$isArray(entries)) {
        $$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        $$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        $$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        $$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    };

    var $$promise$resolve$$default = function resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$resolve(promise, object);
      return promise;
    };

    var $$promise$reject$$default = function reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$reject(promise, reason);
      return promise;
    };

    var $$es6$promise$promise$$counter = 0;

    function $$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function $$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var $$es6$promise$promise$$default = $$es6$promise$promise$$Promise;

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function $$es6$promise$promise$$Promise(resolver) {
      this._id = $$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if ($$$internal$$noop !== resolver) {
        if (!$$utils$$isFunction(resolver)) {
          $$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof $$es6$promise$promise$$Promise)) {
          $$es6$promise$promise$$needsNew();
        }

        $$$internal$$initializePromise(this, resolver);
      }
    }

    $$es6$promise$promise$$Promise.all = $$promise$all$$default;
    $$es6$promise$promise$$Promise.race = $$promise$race$$default;
    $$es6$promise$promise$$Promise.resolve = $$promise$resolve$$default;
    $$es6$promise$promise$$Promise.reject = $$promise$reject$$default;

    $$es6$promise$promise$$Promise.prototype = {
      constructor: $$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === $$$internal$$FULFILLED && !onFulfillment || state === $$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor($$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          $$asap$$default(function(){
            $$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          $$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };

    var $$es6$promise$polyfill$$default = function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport =
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return $$utils$$isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = $$es6$promise$promise$$default;
      }
    };

    var es6$promise$umd$$ES6Promise = {
      'Promise': $$es6$promise$promise$$default,
      'polyfill': $$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = es6$promise$umd$$ES6Promise;
    }
}).call(this);
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":55}],55:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],56:[function(require,module,exports){
(function (global){
/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modern -o ./dist/lodash.js`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used to pool arrays and objects used internally */
  var arrayPool = [],
      objectPool = [];

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
  var keyPrefix = +new Date + '';

  /** Used as the size when optimizations are enabled for large arrays */
  var largeArraySize = 75;

  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;

  /** Used to detect and test whitespace */
  var whitespace = (
    // whitespace
    ' \t\x0B\f\xA0\ufeff' +

    // line terminators
    '\n\r\u2028\u2029' +

    // unicode category "Zs" space separators
    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
  );

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to match "interpolate" template delimiters */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match leading whitespace and zeros to be removed */
  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to assign default `context` object properties */
  var contextProps = [
    'Array', 'Boolean', 'Date', 'Function', 'Math', 'Number', 'Object',
    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
    'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used as an internal `_.debounce` options object */
  var debounceOptions = {
    'leading': false,
    'maxWait': 0,
    'trailing': false
  };

  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.indexOf` without support for binary searches
   * or `fromIndex` constraints.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value or `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    var index = (fromIndex || 0) - 1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * An implementation of `_.contains` for cache objects that mimics the return
   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache object to inspect.
   * @param {*} value The value to search for.
   * @returns {number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    var type = typeof value;
    cache = cache.cache;

    if (type == 'boolean' || value == null) {
      return cache[value] ? 0 : -1;
    }
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value;
    cache = (cache = cache[type]) && cache[key];

    return type == 'object'
      ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
      : (cache ? 0 : -1);
  }

  /**
   * Adds a given value to the corresponding cache object.
   *
   * @private
   * @param {*} value The value to add to the cache.
   */
  function cachePush(value) {
    var cache = this.cache,
        type = typeof value;

    if (type == 'boolean' || value == null) {
      cache[value] = true;
    } else {
      if (type != 'number' && type != 'string') {
        type = 'object';
      }
      var key = type == 'number' ? value : keyPrefix + value,
          typeCache = cache[type] || (cache[type] = {});

      if (type == 'object') {
        (typeCache[key] || (typeCache[key] = [])).push(value);
      } else {
        typeCache[key] = true;
      }
    }
  }

  /**
   * Used by `_.max` and `_.min` as the default callback when a given
   * collection is a string value.
   *
   * @private
   * @param {string} value The character to inspect.
   * @returns {number} Returns the code unit of given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Used by `sortBy` to compare transformed `collection` elements, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ac = a.criteria,
        bc = b.criteria,
        index = -1,
        length = ac.length;

    while (++index < length) {
      var value = ac[index],
          other = bc[index];

      if (value !== other) {
        if (value > other || typeof value == 'undefined') {
          return 1;
        }
        if (value < other || typeof other == 'undefined') {
          return -1;
        }
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to return the same value for
    // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
    //
    // This also ensures a stable sort in V8 and other engines.
    // See http://code.google.com/p/v8/issues/detail?id=90
    return a.index - b.index;
  }

  /**
   * Creates a cache object to optimize linear searches of large arrays.
   *
   * @private
   * @param {Array} [array=[]] The array to search.
   * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
   */
  function createCache(array) {
    var index = -1,
        length = array.length,
        first = array[0],
        mid = array[(length / 2) | 0],
        last = array[length - 1];

    if (first && typeof first == 'object' &&
        mid && typeof mid == 'object' && last && typeof last == 'object') {
      return false;
    }
    var cache = getObject();
    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

    var result = getObject();
    result.array = array;
    result.cache = cache;
    result.push = cachePush;

    while (++index < length) {
      result.push(array[index]);
    }
    return result;
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {string} match The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  /**
   * Gets an object from the object pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Object} The object from the pool.
   */
  function getObject() {
    return objectPool.pop() || {
      'array': null,
      'cache': null,
      'criteria': null,
      'false': false,
      'index': 0,
      'null': false,
      'number': null,
      'object': null,
      'push': null,
      'string': null,
      'true': false,
      'undefined': false,
      'value': null
    };
  }

  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  /**
   * Releases the given object back to the object pool.
   *
   * @private
   * @param {Object} [object] The object to release.
   */
  function releaseObject(object) {
    var cache = object.cache;
    if (cache) {
      releaseObject(cache);
    }
    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
    if (objectPool.length < maxPoolSize) {
      objectPool.push(object);
    }
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new `lodash` function using the given context object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns the `lodash` function.
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See http://es5.github.io/#x11.1.5.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references */
    var Array = context.Array,
        Boolean = context.Boolean,
        Date = context.Date,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /**
     * Used for `Array` method references.
     *
     * Normally `Array.prototype` would suffice, however, using an array literal
     * avoids issues in Narwhal.
     */
    var arrayRef = [];

    /** Used for native method references */
    var objectProto = Object.prototype;

    /** Used to restore the original `_` reference in `noConflict` */
    var oldDash = context._;

    /** Used to resolve the internal [[Class]] of values */
    var toString = objectProto.toString;

    /** Used to detect if a method is native */
    var reNative = RegExp('^' +
      String(toString)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    /** Native method shortcuts */
    var ceil = Math.ceil,
        clearTimeout = context.clearTimeout,
        floor = Math.floor,
        fnToString = Function.prototype.toString,
        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
        hasOwnProperty = objectProto.hasOwnProperty,
        push = arrayRef.push,
        setTimeout = context.setTimeout,
        splice = arrayRef.splice,
        unshift = arrayRef.unshift;

    /** Used to set meta data on functions */
    var defineProperty = (function() {
      // IE 8 only accepts DOM elements
      try {
        var o = {},
            func = isNative(func = Object.defineProperty) && func,
            result = func(o, o, o) && func;
      } catch(e) { }
      return result;
    }());

    /* Native method shortcuts for methods with the same name as other `lodash` methods */
    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = context.isFinite,
        nativeIsNaN = context.isNaN,
        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used to lookup a built-in constructor by [[Class]] */
    var ctorByClass = {};
    ctorByClass[arrayClass] = Array;
    ctorByClass[boolClass] = Boolean;
    ctorByClass[dateClass] = Date;
    ctorByClass[funcClass] = Function;
    ctorByClass[objectClass] = Object;
    ctorByClass[numberClass] = Number;
    ctorByClass[regexpClass] = RegExp;
    ctorByClass[stringClass] = String;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps the given value to enable intuitive
     * method chaining.
     *
     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
     * and `unshift`
     *
     * Chaining is supported in custom builds as long as the `value` method is
     * implicitly or explicitly included in the build.
     *
     * The chainable wrapper functions are:
     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
     * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
     * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
     * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
     * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
     * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
     * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
     * and `zip`
     *
     * The non-chainable wrapper functions are:
     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
     * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
     * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
     * `template`, `unescape`, `uniqueId`, and `value`
     *
     * The wrapper functions `first` and `last` return wrapped values when `n` is
     * provided, otherwise they return unwrapped values.
     *
     * Explicit chaining can be enabled by using the `_.chain` method.
     *
     * @name _
     * @constructor
     * @category Chaining
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(num) {
     *   return num * num;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
       ? value
       : new lodashWrapper(value);
    }

    /**
     * A fast path for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap in a `lodash` instance.
     * @param {boolean} chainAll A flag to enable chaining for all methods
     * @returns {Object} Returns a `lodash` instance.
     */
    function lodashWrapper(value, chainAll) {
      this.__chain__ = !!chainAll;
      this.__wrapped__ = value;
    }
    // ensure `new lodashWrapper` is an instance of `lodash`
    lodashWrapper.prototype = lodash.prototype;

    /**
     * An object used to flag environments features.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * By default, the template delimiters used by Lo-Dash are similar to those in
     * embedded Ruby (ERB). Change the following template settings to use alternative
     * delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': /<%-([\s\S]+?)%>/g,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': /<%([\s\S]+?)%>/g,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*--------------------------------------------------------------------------*/

    /**
     * The base implementation of `_.bind` that creates the bound function and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new bound function.
     */
    function baseBind(bindData) {
      var func = bindData[0],
          partialArgs = bindData[2],
          thisArg = bindData[4];

      function bound() {
        // `Function#bind` spec
        // http://es5.github.io/#x15.3.4.5
        if (partialArgs) {
          // avoid `arguments` object deoptimizations by using `slice` instead
          // of `Array.prototype.slice.call` and not assigning `arguments` to a
          // variable as a ternary expression
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        // mimic the constructor's `return` behavior
        // http://es5.github.io/#x13.2.2
        if (this instanceof bound) {
          // ensure `new bound` is an instance of `func`
          var thisBinding = baseCreate(func.prototype),
              result = func.apply(thisBinding, args || arguments);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisArg, args || arguments);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.clone` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, callback, stackA, stackB) {
      if (callback) {
        var result = callback(value);
        if (typeof result != 'undefined') {
          return result;
        }
      }
      // inspect [[Class]]
      var isObj = isObject(value);
      if (isObj) {
        var className = toString.call(value);
        if (!cloneableClasses[className]) {
          return value;
        }
        var ctor = ctorByClass[className];
        switch (className) {
          case boolClass:
          case dateClass:
            return new ctor(+value);

          case numberClass:
          case stringClass:
            return new ctor(value);

          case regexpClass:
            result = ctor(value.source, reFlags.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }
      } else {
        return value;
      }
      var isArr = isArray(value);
      if (isDeep) {
        // check for circular references and return corresponding clone
        var initedStack = !stackA;
        stackA || (stackA = getArray());
        stackB || (stackB = getArray());

        var length = stackA.length;
        while (length--) {
          if (stackA[length] == value) {
            return stackB[length];
          }
        }
        result = isArr ? ctor(value.length) : {};
      }
      else {
        result = isArr ? slice(value) : assign({}, value);
      }
      // add array properties assigned by `RegExp#exec`
      if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
          result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
          result.input = value.input;
        }
      }
      // exit for shallow clone
      if (!isDeep) {
        return result;
      }
      // add the source value to the stack of traversed objects
      // and associate it with its clone
      stackA.push(value);
      stackB.push(result);

      // recursively populate clone (susceptible to call stack limits)
      (isArr ? forEach : forOwn)(value, function(objValue, key) {
        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
      });

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(prototype, properties) {
      return isObject(prototype) ? nativeCreate(prototype) : {};
    }
    // fallback for browsers without `Object.create`
    if (!nativeCreate) {
      baseCreate = (function() {
        function Object() {}
        return function(prototype) {
          if (isObject(prototype)) {
            Object.prototype = prototype;
            var result = new Object;
            Object.prototype = null;
          }
          return result || context.Object();
        };
      }());
    }

    /**
     * The base implementation of `_.createCallback` without support for creating
     * "_.pluck" or "_.where" style callbacks.
     *
     * @private
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     */
    function baseCreateCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      // exit early for no `thisArg` or already bound by `Function#bind`
      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
        return func;
      }
      var bindData = func.__bindData__;
      if (typeof bindData == 'undefined') {
        if (support.funcNames) {
          bindData = !func.name;
        }
        bindData = bindData || !support.funcDecomp;
        if (!bindData) {
          var source = fnToString.call(func);
          if (!support.funcNames) {
            bindData = !reFuncName.test(source);
          }
          if (!bindData) {
            // checks if `func` references the `this` keyword and stores the result
            bindData = reThis.test(source);
            setBindData(func, bindData);
          }
        }
      }
      // exit early if there are no `this` references or `func` is bound
      if (bindData === false || (bindData !== true && bindData[1] & 1)) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 2: return function(a, b) {
          return func.call(thisArg, a, b);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return bind(func, thisArg);
    }

    /**
     * The base implementation of `createWrapper` that creates the wrapper and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new function.
     */
    function baseCreateWrapper(bindData) {
      var func = bindData[0],
          bitmask = bindData[1],
          partialArgs = bindData[2],
          partialRightArgs = bindData[3],
          thisArg = bindData[4],
          arity = bindData[5];

      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          key = func;

      function bound() {
        var thisBinding = isBind ? thisArg : this;
        if (partialArgs) {
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        if (partialRightArgs || isCurry) {
          args || (args = slice(arguments));
          if (partialRightArgs) {
            push.apply(args, partialRightArgs);
          }
          if (isCurry && args.length < arity) {
            bitmask |= 16 & ~32;
            return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
          }
        }
        args || (args = arguments);
        if (isBindKey) {
          func = thisBinding[key];
        }
        if (this instanceof bound) {
          thisBinding = baseCreate(func.prototype);
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.difference` that accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {Array} [values] The array of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     */
    function baseDifference(array, values) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          isLarge = length >= largeArraySize && indexOf === baseIndexOf,
          result = [];

      if (isLarge) {
        var cache = createCache(values);
        if (cache) {
          indexOf = cacheIndexOf;
          values = cache;
        } else {
          isLarge = false;
        }
      }
      while (++index < length) {
        var value = array[index];
        if (indexOf(values, value) < 0) {
          result.push(value);
        }
      }
      if (isLarge) {
        releaseObject(values);
      }
      return result;
    }

    /**
     * The base implementation of `_.flatten` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
     * @param {number} [fromIndex=0] The index to start from.
     * @returns {Array} Returns a new flattened array.
     */
    function baseFlatten(array, isShallow, isStrict, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (value && typeof value == 'object' && typeof value.length == 'number'
            && (isArray(value) || isArguments(value))) {
          // recursively flatten arrays (susceptible to call stack limits)
          if (!isShallow) {
            value = baseFlatten(value, isShallow, isStrict);
          }
          var valIndex = -1,
              valLength = value.length,
              resIndex = result.length;

          result.length += valLength;
          while (++valIndex < valLength) {
            result[resIndex++] = value[valIndex];
          }
        } else if (!isStrict) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.isEqual`, without support for `thisArg` binding,
     * that allows partial "_.where" style comparisons.
     *
     * @private
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
      // used to indicate that when comparing objects, `a` has at least the properties of `b`
      if (callback) {
        var result = callback(a, b);
        if (typeof result != 'undefined') {
          return !!result;
        }
      }
      // exit early for identical values
      if (a === b) {
        // treat `+0` vs. `-0` as not equal
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;

      // exit early for unlike primitive values
      if (a === a &&
          !(a && objectTypes[type]) &&
          !(b && objectTypes[otherType])) {
        return false;
      }
      // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
      // http://es5.github.io/#x15.3.4.4
      if (a == null || b == null) {
        return a === b;
      }
      // compare [[Class]] names
      var className = toString.call(a),
          otherClass = toString.call(b);

      if (className == argsClass) {
        className = objectClass;
      }
      if (otherClass == argsClass) {
        otherClass = objectClass;
      }
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          // coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
          return +a == +b;

        case numberClass:
          // treat `NaN` vs. `NaN` as equal
          return (a != +a)
            ? b != +b
            // but treat `+0` vs. `-0` as not equal
            : (a == 0 ? (1 / a == 1 / b) : a == +b);

        case regexpClass:
        case stringClass:
          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
          // treat string primitives and their corresponding object instances as equal
          return a == String(b);
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        // unwrap any `lodash` wrapped values
        var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
            bWrapped = hasOwnProperty.call(b, '__wrapped__');

        if (aWrapped || bWrapped) {
          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
        }
        // exit for functions and DOM nodes
        if (className != objectClass) {
          return false;
        }
        // in older versions of Opera, `arguments` objects have `Array` constructors
        var ctorA = a.constructor,
            ctorB = b.constructor;

        // non `Object` object instances with different constructors are not equal
        if (ctorA != ctorB &&
              !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
              ('constructor' in a && 'constructor' in b)
            ) {
          return false;
        }
      }
      // assume cyclic structures are equal
      // the algorithm for detecting cyclic structures is adapted from ES 5.1
      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var size = 0;
      result = true;

      // add `a` and `b` to the stack of traversed objects
      stackA.push(a);
      stackB.push(b);

      // recursively compare objects and arrays (susceptible to call stack limits)
      if (isArr) {
        // compare lengths to determine if a deep comparison is necessary
        length = a.length;
        size = b.length;
        result = size == length;

        if (result || isWhere) {
          // deep compare the contents, ignoring non-numeric properties
          while (size--) {
            var index = length,
                value = b[size];

            if (isWhere) {
              while (index--) {
                if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                  break;
                }
              }
            } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        }
      }
      else {
        // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
        // which, in this case, is more costly
        forIn(b, function(value, key, b) {
          if (hasOwnProperty.call(b, key)) {
            // count the number of properties.
            size++;
            // deep compare each property value.
            return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
          }
        });

        if (result && !isWhere) {
          // ensure both objects have the same number of properties
          forIn(a, function(value, key, a) {
            if (hasOwnProperty.call(a, key)) {
              // `size` will be `-1` if `a` has more properties than `b`
              return (result = --size > -1);
            }
          });
        }
      }
      stackA.pop();
      stackB.pop();

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.merge` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     */
    function baseMerge(object, source, callback, stackA, stackB) {
      (isArray(source) ? forEach : forOwn)(source, function(source, key) {
        var found,
            isArr,
            result = source,
            value = object[key];

        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
          // avoid merging previously merged cyclic sources
          var stackLength = stackA.length;
          while (stackLength--) {
            if ((found = stackA[stackLength] == source)) {
              value = stackB[stackLength];
              break;
            }
          }
          if (!found) {
            var isShallow;
            if (callback) {
              result = callback(value, source);
              if ((isShallow = typeof result != 'undefined')) {
                value = result;
              }
            }
            if (!isShallow) {
              value = isArr
                ? (isArray(value) ? value : [])
                : (isPlainObject(value) ? value : {});
            }
            // add `source` and associated `value` to the stack of traversed objects
            stackA.push(source);
            stackB.push(value);

            // recursively merge objects and arrays (susceptible to call stack limits)
            if (!isShallow) {
              baseMerge(value, source, callback, stackA, stackB);
            }
          }
        }
        else {
          if (callback) {
            result = callback(value, source);
            if (typeof result == 'undefined') {
              result = source;
            }
          }
          if (typeof result != 'undefined') {
            value = result;
          }
        }
        object[key] = value;
      });
    }

    /**
     * The base implementation of `_.random` without argument juggling or support
     * for returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns a random number.
     */
    function baseRandom(min, max) {
      return min + floor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function} [callback] The function called per iteration.
     * @returns {Array} Returns a duplicate-value-free array.
     */
    function baseUniq(array, isSorted, callback) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [];

      var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
          seen = (callback || isLarge) ? getArray() : result;

      if (isLarge) {
        var cache = createCache(seen);
        indexOf = cacheIndexOf;
        seen = cache;
      }
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;

        if (isSorted
              ? !index || seen[seen.length - 1] !== computed
              : indexOf(seen, computed) < 0
            ) {
          if (callback || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      if (isLarge) {
        releaseArray(seen.array);
        releaseObject(seen);
      } else if (callback) {
        releaseArray(seen);
      }
      return result;
    }

    /**
     * Creates a function that aggregates a collection, creating an object composed
     * of keys generated from the results of running each element of the collection
     * through a callback. The given `setter` function sets the keys and values
     * of the composed object.
     *
     * @private
     * @param {Function} setter The setter function.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter) {
      return function(collection, callback, thisArg) {
        var result = {};
        callback = lodash.createCallback(callback, thisArg, 3);

        var index = -1,
            length = collection ? collection.length : 0;

        if (typeof length == 'number') {
          while (++index < length) {
            var value = collection[index];
            setter(result, value, callback(value, index, collection), collection);
          }
        } else {
          forOwn(collection, function(value, key, collection) {
            setter(result, value, callback(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a function that, when called, either curries or invokes `func`
     * with an optional `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of method flags to compose.
     *  The bitmask may be composed of the following flags:
     *  1 - `_.bind`
     *  2 - `_.bindKey`
     *  4 - `_.curry`
     *  8 - `_.curry` (bound)
     *  16 - `_.partial`
     *  32 - `_.partialRight`
     * @param {Array} [partialArgs] An array of arguments to prepend to those
     *  provided to the new function.
     * @param {Array} [partialRightArgs] An array of arguments to append to those
     *  provided to the new function.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new function.
     */
    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          isPartial = bitmask & 16,
          isPartialRight = bitmask & 32;

      if (!isBindKey && !isFunction(func)) {
        throw new TypeError;
      }
      if (isPartial && !partialArgs.length) {
        bitmask &= ~16;
        isPartial = partialArgs = false;
      }
      if (isPartialRight && !partialRightArgs.length) {
        bitmask &= ~32;
        isPartialRight = partialRightArgs = false;
      }
      var bindData = func && func.__bindData__;
      if (bindData && bindData !== true) {
        // clone `bindData`
        bindData = slice(bindData);
        if (bindData[2]) {
          bindData[2] = slice(bindData[2]);
        }
        if (bindData[3]) {
          bindData[3] = slice(bindData[3]);
        }
        // set `thisBinding` is not previously bound
        if (isBind && !(bindData[1] & 1)) {
          bindData[4] = thisArg;
        }
        // set if previously bound but not currently (subsequent curried functions)
        if (!isBind && bindData[1] & 1) {
          bitmask |= 8;
        }
        // set curried arity if not yet set
        if (isCurry && !(bindData[1] & 4)) {
          bindData[5] = arity;
        }
        // append partial left arguments
        if (isPartial) {
          push.apply(bindData[2] || (bindData[2] = []), partialArgs);
        }
        // append partial right arguments
        if (isPartialRight) {
          unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
        }
        // merge flags
        bindData[1] |= bitmask;
        return createWrapper.apply(null, bindData);
      }
      // fast path for `_.bind`
      var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
      return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
    }

    /**
     * Used by `escape` to convert characters to HTML entities.
     *
     * @private
     * @param {string} match The matched character to escape.
     * @returns {string} Returns the escaped character.
     */
    function escapeHtmlChar(match) {
      return htmlEscapes[match];
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized, this method returns the custom method, otherwise it returns
     * the `baseIndexOf` function.
     *
     * @private
     * @returns {Function} Returns the "indexOf" function.
     */
    function getIndexOf() {
      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
      return result;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
     */
    function isNative(value) {
      return typeof value == 'function' && reNative.test(value);
    }

    /**
     * Sets `this` binding data on a given function.
     *
     * @private
     * @param {Function} func The function to set data on.
     * @param {Array} value The data array to set.
     */
    var setBindData = !defineProperty ? noop : function(func, value) {
      descriptor.value = value;
      defineProperty(func, '__bindData__', descriptor);
    };

    /**
     * A fallback implementation of `isPlainObject` which checks if a given value
     * is an object created by the `Object` constructor, assuming objects created
     * by the `Object` constructor have no inherited enumerable properties and that
     * there are no `Object.prototype` extensions.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     */
    function shimIsPlainObject(value) {
      var ctor,
          result;

      // avoid non Object objects, `arguments` objects, and DOM elements
      if (!(value && toString.call(value) == objectClass) ||
          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
        return false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(value, key) {
        result = key;
      });
      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
    }

    /**
     * Used by `unescape` to convert HTML entities to characters.
     *
     * @private
     * @param {string} match The matched character to unescape.
     * @returns {string} Returns the unescaped character.
     */
    function unescapeHtmlChar(match) {
      return htmlUnescapes[match];
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Checks if `value` is an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
     * @example
     *
     * (function() { return _.isArguments(arguments); })(1, 2, 3);
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == argsClass || false;
    }

    /**
     * Checks if `value` is an array.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
     * @example
     *
     * (function() { return _.isArray(arguments); })();
     * // => false
     *
     * _.isArray([1, 2, 3]);
     * // => true
     */
    var isArray = nativeIsArray || function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == arrayClass || false;
    };

    /**
     * A fallback implementation of `Object.keys` which produces an array of the
     * given object's own enumerable property names.
     *
     * @private
     * @type Function
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     */
    var shimKeys = function(object) {
      var index, iterable = object, result = [];
      if (!iterable) return result;
      if (!(objectTypes[typeof object])) return result;
        for (index in iterable) {
          if (hasOwnProperty.call(iterable, index)) {
            result.push(index);
          }
        }
      return result
    };

    /**
     * Creates an array composed of the own enumerable property names of an object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     * @example
     *
     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
     * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (!isObject(object)) {
        return [];
      }
      return nativeKeys(object);
    };

    /**
     * Used to convert characters to HTML entities:
     *
     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
     * don't require escaping in HTML and have no special meaning unless they're part
     * of a tag or an unquoted attribute value.
     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
     */
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    /** Used to convert HTML entities to characters */
    var htmlUnescapes = invert(htmlEscapes);

    /** Used to match HTML entities and HTML characters */
    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

    /*--------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources will overwrite property assignments of previous
     * sources. If a callback is provided it will be executed to produce the
     * assigned values. The callback is bound to `thisArg` and invoked with two
     * arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @type Function
     * @alias extend
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize assigning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
     * // => { 'name': 'fred', 'employer': 'slate' }
     *
     * var defaults = _.partialRight(_.assign, function(a, b) {
     *   return typeof a == 'undefined' ? b : a;
     * });
     *
     * var object = { 'name': 'barney' };
     * defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var assign = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
        var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
      } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
        callback = args[--argsLength];
      }
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
        }
        }
      }
      return result
    };

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
     * be cloned, otherwise they will be assigned by reference. If a callback
     * is provided it will be executed to produce the cloned values. If the
     * callback returns `undefined` cloning will be handled by the method instead.
     * The callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var shallow = _.clone(characters);
     * shallow[0] === characters[0];
     * // => true
     *
     * var deep = _.clone(characters, true);
     * deep[0] === characters[0];
     * // => false
     *
     * _.mixin({
     *   'clone': _.partialRight(_.clone, function(value) {
     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
     *   })
     * });
     *
     * var clone = _.clone(document.body);
     * clone.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, callback, thisArg) {
      // allows working with "Collections" methods without using their `index`
      // and `collection` arguments for `isDeep` and `callback`
      if (typeof isDeep != 'boolean' && isDeep != null) {
        thisArg = callback;
        callback = isDeep;
        isDeep = false;
      }
      return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates a deep clone of `value`. If a callback is provided it will be
     * executed to produce the cloned values. If the callback returns `undefined`
     * cloning will be handled by the method instead. The callback is bound to
     * `thisArg` and invoked with one argument; (value).
     *
     * Note: This method is loosely based on the structured clone algorithm. Functions
     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var deep = _.cloneDeep(characters);
     * deep[0] === characters[0];
     * // => false
     *
     * var view = {
     *   'label': 'docs',
     *   'node': element
     * };
     *
     * var clone = _.cloneDeep(view, function(value) {
     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
     * });
     *
     * clone.node == view.node;
     * // => false
     */
    function cloneDeep(value, callback, thisArg) {
      return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? assign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional defaults of the same property will be ignored.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param- {Object} [guard] Allows working with `_.reduce` without using its
     *  `key` and `object` arguments as sources.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var object = { 'name': 'barney' };
     * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var defaults = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (typeof result[index] == 'undefined') result[index] = iterable[index];
        }
        }
      }
      return result
    };

    /**
     * This method is like `_.findIndex` except that it returns the key of the
     * first element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': false },
     *   'fred': {    'age': 40, 'blocked': true },
     *   'pebbles': { 'age': 1,  'blocked': false }
     * };
     *
     * _.findKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (property order is not guaranteed across environments)
     *
     * // using "_.where" callback shorthand
     * _.findKey(characters, { 'age': 1 });
     * // => 'pebbles'
     *
     * // using "_.pluck" callback shorthand
     * _.findKey(characters, 'blocked');
     * // => 'fred'
     */
    function findKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': true },
     *   'fred': {    'age': 40, 'blocked': false },
     *   'pebbles': { 'age': 1,  'blocked': true }
     * };
     *
     * _.findLastKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles`, assuming `_.findKey` returns `barney`
     *
     * // using "_.where" callback shorthand
     * _.findLastKey(characters, { 'age': 40 });
     * // => 'fred'
     *
     * // using "_.pluck" callback shorthand
     * _.findLastKey(characters, 'blocked');
     * // => 'pebbles'
     */
    function findLastKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwnRight(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over own and inherited enumerable properties of an object,
     * executing the callback for each property. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, key, object). Callbacks may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forIn(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
     */
    var forIn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        for (index in iterable) {
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forIn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forInRight(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
     */
    function forInRight(object, callback, thisArg) {
      var pairs = [];

      forIn(object, function(value, key) {
        pairs.push(key, value);
      });

      var length = pairs.length;
      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(pairs[length--], pairs[length], object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Iterates over own enumerable properties of an object, executing the callback
     * for each property. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, key, object). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
     */
    var forOwn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forOwn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
     */
    function forOwnRight(object, callback, thisArg) {
      var props = keys(object),
          length = props.length;

      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        var key = props[length];
        if (callback(object[key], key, object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Creates a sorted array of property names of all enumerable properties,
     * own and inherited, of `object` that have function values.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names that have function values.
     * @example
     *
     * _.functions(_);
     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
     */
    function functions(object) {
      var result = [];
      forIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }

    /**
     * Checks if the specified property name exists as a direct property of `object`,
     * instead of an inherited property.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to check.
     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
     * @example
     *
     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
     * // => true
     */
    function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    }

    /**
     * Creates an object composed of the inverted keys and values of the given object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the created inverted object.
     * @example
     *
     * _.invert({ 'first': 'fred', 'second': 'barney' });
     * // => { 'fred': 'first', 'barney': 'second' }
     */
    function invert(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        result[object[key]] = key;
      }
      return result;
    }

    /**
     * Checks if `value` is a boolean value.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
     * @example
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        value && typeof value == 'object' && toString.call(value) == boolClass || false;
    }

    /**
     * Checks if `value` is a date.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     */
    function isDate(value) {
      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     */
    function isElement(value) {
      return value && value.nodeType === 1 || false;
    }

    /**
     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
     * length of `0` and objects with no own enumerable properties are considered
     * "empty".
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({});
     * // => true
     *
     * _.isEmpty('');
     * // => true
     */
    function isEmpty(value) {
      var result = true;
      if (!value) {
        return result;
      }
      var className = toString.call(value),
          length = value.length;

      if ((className == arrayClass || className == stringClass || className == argsClass ) ||
          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
        return !length;
      }
      forOwn(value, function() {
        return (result = false);
      });
      return result;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent to each other. If a callback is provided it will be executed
     * to compare values. If the callback returns `undefined` comparisons will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (a, b).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var copy = { 'name': 'fred' };
     *
     * object == copy;
     * // => false
     *
     * _.isEqual(object, copy);
     * // => true
     *
     * var words = ['hello', 'goodbye'];
     * var otherWords = ['hi', 'goodbye'];
     *
     * _.isEqual(words, otherWords, function(a, b) {
     *   var reGreet = /^(?:hello|hi)$/i,
     *       aGreet = _.isString(a) && reGreet.test(a),
     *       bGreet = _.isString(b) && reGreet.test(b);
     *
     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
     * });
     * // => true
     */
    function isEqual(a, b, callback, thisArg) {
      return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
    }

    /**
     * Checks if `value` is, or can be coerced to, a finite number.
     *
     * Note: This is not the same as native `isFinite` which will return true for
     * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
     * @example
     *
     * _.isFinite(-101);
     * // => true
     *
     * _.isFinite('10');
     * // => true
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite('');
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }

    /**
     * Checks if `value` is a function.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     */
    function isFunction(value) {
      return typeof value == 'function';
    }

    /**
     * Checks if `value` is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // check if the value is the ECMAScript language type of Object
      // http://es5.github.io/#x8
      // and avoid a V8 bug
      // http://code.google.com/p/v8/issues/detail?id=2291
      return !!(value && objectTypes[typeof value]);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * Note: This is not the same as native `isNaN` which will return `true` for
     * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // `NaN` as a primitive is the only value that is not equal to itself
      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(undefined);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is a number.
     *
     * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(8.4 * 5);
     * // => true
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        value && typeof value == 'object' && toString.call(value) == numberClass || false;
    }

    /**
     * Checks if `value` is an object created by the `Object` constructor.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * _.isPlainObject(new Shape);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     */
    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
      if (!(value && toString.call(value) == objectClass)) {
        return false;
      }
      var valueOf = value.valueOf,
          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

      return objProto
        ? (value == objProto || getPrototypeOf(value) == objProto)
        : shimIsPlainObject(value);
    };

    /**
     * Checks if `value` is a regular expression.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
     * @example
     *
     * _.isRegExp(/fred/);
     * // => true
     */
    function isRegExp(value) {
      return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
    }

    /**
     * Checks if `value` is a string.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
     * @example
     *
     * _.isString('fred');
     * // => true
     */
    function isString(value) {
      return typeof value == 'string' ||
        value && typeof value == 'object' && toString.call(value) == stringClass || false;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     */
    function isUndefined(value) {
      return typeof value == 'undefined';
    }

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new object with values of the results of each `callback` execution.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     *
     * var characters = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // using "_.pluck" callback shorthand
     * _.mapValues(characters, 'age');
     * // => { 'fred': 40, 'pebbles': 1 }
     */
    function mapValues(object, callback, thisArg) {
      var result = {};
      callback = lodash.createCallback(callback, thisArg, 3);

      forOwn(object, function(value, key, object) {
        result[key] = callback(value, key, object);
      });
      return result;
    }

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * will overwrite property assignments of previous sources. If a callback is
     * provided it will be executed to produce the merged values of the destination
     * and source properties. If the callback returns `undefined` merging will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var names = {
     *   'characters': [
     *     { 'name': 'barney' },
     *     { 'name': 'fred' }
     *   ]
     * };
     *
     * var ages = {
     *   'characters': [
     *     { 'age': 36 },
     *     { 'age': 40 }
     *   ]
     * };
     *
     * _.merge(names, ages);
     * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
     *
     * var food = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var otherFood = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(food, otherFood, function(a, b) {
     *   return _.isArray(a) ? a.concat(b) : undefined;
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
     */
    function merge(object) {
      var args = arguments,
          length = 2;

      if (!isObject(object)) {
        return object;
      }
      // allows working with `_.reduce` and `_.reduceRight` without using
      // their `index` and `collection` arguments
      if (typeof args[2] != 'number') {
        length = args.length;
      }
      if (length > 3 && typeof args[length - 2] == 'function') {
        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
      } else if (length > 2 && typeof args[length - 1] == 'function') {
        callback = args[--length];
      }
      var sources = slice(arguments, 1, length),
          index = -1,
          stackA = getArray(),
          stackB = getArray();

      while (++index < length) {
        baseMerge(object, sources[index], callback, stackA, stackB);
      }
      releaseArray(stackA);
      releaseArray(stackB);
      return object;
    }

    /**
     * Creates a shallow clone of `object` excluding the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` omitting the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The properties to omit or the
     *  function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object without the omitted properties.
     * @example
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
     * // => { 'name': 'fred' }
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
     *   return typeof value == 'number';
     * });
     * // => { 'name': 'fred' }
     */
    function omit(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var props = [];
        forIn(object, function(value, key) {
          props.push(key);
        });
        props = baseDifference(props, baseFlatten(arguments, true, false, 1));

        var index = -1,
            length = props.length;

        while (++index < length) {
          var key = props[index];
          result[key] = object[key];
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (!callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * Creates a two dimensional array of an object's key-value pairs,
     * i.e. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
     */
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates a shallow clone of `object` composed of the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` picking the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The function called per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object composed of the picked properties.
     * @example
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
     * // => { 'name': 'fred' }
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
     *   return key.charAt(0) != '_';
     * });
     * // => { 'name': 'fred' }
     */
    function pick(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var index = -1,
            props = baseFlatten(arguments, true, false, 1),
            length = isObject(object) ? props.length : 0;

        while (++index < length) {
          var key = props[index];
          if (key in object) {
            result[key] = object[key];
          }
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * An alternative to `_.reduce` this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable properties through a callback, with each callback execution
     * potentially mutating the `accumulator` object. The callback is bound to
     * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
     * Callbacks may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
     *   num *= num;
     *   if (num % 2) {
     *     return result.push(num) < 3;
     *   }
     * });
     * // => [1, 9, 25]
     *
     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     * });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function transform(object, callback, accumulator, thisArg) {
      var isArr = isArray(object);
      if (accumulator == null) {
        if (isArr) {
          accumulator = [];
        } else {
          var ctor = object && object.constructor,
              proto = ctor && ctor.prototype;

          accumulator = baseCreate(proto);
        }
      }
      if (callback) {
        callback = lodash.createCallback(callback, thisArg, 4);
        (isArr ? forEach : forOwn)(object, function(value, index, object) {
          return callback(accumulator, value, index, object);
        });
      }
      return accumulator;
    }

    /**
     * Creates an array composed of the own enumerable property values of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property values.
     * @example
     *
     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
     * // => [1, 2, 3] (property order is not guaranteed across environments)
     */
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array of elements from the specified indexes, or keys, of the
     * `collection`. Indexes may be specified as individual arguments or as arrays
     * of indexes.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
     *   to retrieve, specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns a new array of elements corresponding to the
     *  provided indexes.
     * @example
     *
     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
     * // => ['a', 'c', 'e']
     *
     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
     * // => ['fred', 'pebbles']
     */
    function at(collection) {
      var args = arguments,
          index = -1,
          props = baseFlatten(args, true, false, 1),
          length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
          result = Array(length);

      while(++index < length) {
        result[index] = collection[props[index]];
      }
      return result;
    }

    /**
     * Checks if a given value is present in a collection using strict equality
     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
     * offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @alias include
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {*} target The value to check for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
     * @example
     *
     * _.contains([1, 2, 3], 1);
     * // => true
     *
     * _.contains([1, 2, 3], 1, 2);
     * // => false
     *
     * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.contains('pebbles', 'eb');
     * // => true
     */
    function contains(collection, target, fromIndex) {
      var index = -1,
          indexOf = getIndexOf(),
          length = collection ? collection.length : 0,
          result = false;

      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
      if (isArray(collection)) {
        result = indexOf(collection, target, fromIndex) > -1;
      } else if (typeof length == 'number') {
        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
      } else {
        forOwn(collection, function(value) {
          if (++index >= fromIndex) {
            return !(result = value === target);
          }
        });
      }
      return result;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through the callback. The corresponding value
     * of each key is the number of times the key was returned by the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
    });

    /**
     * Checks if the given callback returns truey value for **all** elements of
     * a collection. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if all elements passed the callback check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes']);
     * // => false
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.every(characters, 'age');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.every(characters, { 'age': 36 });
     * // => false
     */
    function every(collection, callback, thisArg) {
      var result = true;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if (!(result = !!callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return (result = !!callback(value, index, collection));
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning an array of all elements
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that passed the callback check.
     * @example
     *
     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [2, 4, 6]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.filter(characters, 'blocked');
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     *
     * // using "_.where" callback shorthand
     * _.filter(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     */
    function filter(collection, callback, thisArg) {
      var result = [];
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning the first element that
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect, findWhere
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.find(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => { 'name': 'barney', 'age': 36, 'blocked': false }
     *
     * // using "_.where" callback shorthand
     * _.find(characters, { 'age': 1 });
     * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
     *
     * // using "_.pluck" callback shorthand
     * _.find(characters, 'blocked');
     * // => { 'name': 'fred', 'age': 40, 'blocked': true }
     */
    function find(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            return value;
          }
        }
      } else {
        var result;
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result = value;
            return false;
          }
        });
        return result;
      }
    }

    /**
     * This method is like `_.find` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(num) {
     *   return num % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forEachRight(collection, function(value, index, collection) {
        if (callback(value, index, collection)) {
          result = value;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over elements of a collection, executing the callback for each
     * element. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * Note: As with other "Collections" methods, objects with a `length` property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
     * // => logs each number and returns '1,2,3'
     *
     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
     * // => logs each number and returns the object (property order is not guaranteed across environments)
     */
    function forEach(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (++index < length) {
          if (callback(collection[index], index, collection) === false) {
            break;
          }
        }
      } else {
        forOwn(collection, callback);
      }
      return collection;
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
     * // => logs each number from right to left and returns '3,2,1'
     */
    function forEachRight(collection, callback, thisArg) {
      var length = collection ? collection.length : 0;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (length--) {
          if (callback(collection[length], length, collection) === false) {
            break;
          }
        }
      } else {
        var props = keys(collection);
        length = props.length;
        forOwn(collection, function(value, key, collection) {
          key = props ? props[--length] : --length;
          return callback(collection[key], key, collection);
        });
      }
      return collection;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of a collection through the callback. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using "_.pluck" callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of the collection through the given callback. The corresponding
     * value of each key is the last element responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keys = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keys, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method named by `methodName` on each element in the `collection`
     * returning an array of the results of each invoked method. Additional arguments
     * will be provided to each invoked method. If `methodName` is a function it
     * will be invoked for, and `this` bound to, each element in the `collection`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|string} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [arg] Arguments to invoke the method with.
     * @returns {Array} Returns a new array of the results of each invoked method.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    function invoke(collection, methodName) {
      var args = slice(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }

    /**
     * Creates an array of values by running each element in the collection
     * through the callback. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of the results of each `callback` execution.
     * @example
     *
     * _.map([1, 2, 3], function(num) { return num * 3; });
     * // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
     * // => [3, 6, 9] (property order is not guaranteed across environments)
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(characters, 'name');
     * // => ['barney', 'fred']
     */
    function map(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        result = [];
        forOwn(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }

    /**
     * Retrieves the maximum value of a collection. If the collection is empty or
     * falsey `-Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.max(characters, function(chr) { return chr.age; });
     * // => { 'name': 'fred', 'age': 40 };
     *
     * // using "_.pluck" callback shorthand
     * _.max(characters, 'age');
     * // => { 'name': 'fred', 'age': 40 };
     */
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the minimum value of a collection. If the collection is empty or
     * falsey `Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.min(characters, function(chr) { return chr.age; });
     * // => { 'name': 'barney', 'age': 36 };
     *
     * // using "_.pluck" callback shorthand
     * _.min(characters, 'age');
     * // => { 'name': 'barney', 'age': 36 };
     */
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the value of a specified property from all elements in the collection.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {string} property The name of the property to pluck.
     * @returns {Array} Returns a new array of property values.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(characters, 'name');
     * // => ['barney', 'fred']
     */
    var pluck = map;

    /**
     * Reduces a collection to a value which is the accumulated result of running
     * each element in the collection through the callback, where each successive
     * callback execution consumes the return value of the previous execution. If
     * `accumulator` is not provided the first element of the collection will be
     * used as the initial `accumulator` value. The callback is bound to `thisArg`
     * and invoked with four arguments; (accumulator, value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var sum = _.reduce([1, 2, 3], function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function reduce(collection, callback, accumulator, thisArg) {
      if (!collection) return accumulator;
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);

      var index = -1,
          length = collection.length;

      if (typeof length == 'number') {
        if (noaccum) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          accumulator = noaccum
            ? (noaccum = false, value)
            : callback(accumulator, value, index, collection)
        });
      }
      return accumulator;
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var list = [[0, 1], [2, 3], [4, 5]];
     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);
      forEachRight(collection, function(value, index, collection) {
        accumulator = noaccum
          ? (noaccum = false, value)
          : callback(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The opposite of `_.filter` this method returns the elements of a
     * collection that the callback does **not** return truey for.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that failed the callback check.
     * @example
     *
     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [1, 3, 5]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.reject(characters, 'blocked');
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     *
     * // using "_.where" callback shorthand
     * _.reject(characters, { 'age': 36 });
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     */
    function reject(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);
      return filter(collection, function(value, index, collection) {
        return !callback(value, index, collection);
      });
    }

    /**
     * Retrieves a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Allows working with functions like `_.map`
     *  without using their `index` arguments as `n`.
     * @returns {Array} Returns the random sample(s) of `collection`.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (collection && typeof collection.length != 'number') {
        collection = values(collection);
      }
      if (n == null || guard) {
        return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
      }
      var result = shuffle(collection);
      result.length = nativeMin(nativeMax(0, n), result.length);
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates
     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns a new shuffled collection.
     * @example
     *
     * _.shuffle([1, 2, 3, 4, 5, 6]);
     * // => [4, 1, 6, 3, 5, 2]
     */
    function shuffle(collection) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        var rand = baseRandom(0, ++index);
        result[index] = result[rand];
        result[rand] = value;
      });
      return result;
    }

    /**
     * Gets the size of the `collection` by returning `collection.length` for arrays
     * and array-like objects or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns `collection.length` or number of own enumerable properties.
     * @example
     *
     * _.size([1, 2]);
     * // => 2
     *
     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
     * // => 3
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : keys(collection).length;
    }

    /**
     * Checks if the callback returns a truey value for **any** element of a
     * collection. The function returns as soon as it finds a passing value and
     * does not iterate over the entire collection. The callback is bound to
     * `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if any element passed the callback check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.some(characters, 'blocked');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.some(characters, { 'age': 1 });
     * // => false
     */
    function some(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if ((result = callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return !(result = callback(value, index, collection));
        });
      }
      return !!result;
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through the callback. This method
     * performs a stable sort, that is, it will preserve the original sort order
     * of equal elements. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an array of property names is provided for `callback` the collection
     * will be sorted by each property value.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of sorted elements.
     * @example
     *
     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
     * // => [3, 1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'barney',  'age': 26 },
     *   { 'name': 'fred',    'age': 30 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(_.sortBy(characters, 'age'), _.values);
     * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
     *
     * // sorting by multiple properties
     * _.map(_.sortBy(characters, ['name', 'age']), _.values);
     * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
     */
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          isArr = isArray(callback),
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      if (!isArr) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      forEach(collection, function(value, key, collection) {
        var object = result[++index] = getObject();
        if (isArr) {
          object.criteria = map(callback, function(key) { return value[key]; });
        } else {
          (object.criteria = getArray())[0] = callback(value, key, collection);
        }
        object.index = index;
        object.value = value;
      });

      length = result.length;
      result.sort(compareAscending);
      while (length--) {
        var object = result[length];
        result[length] = object.value;
        if (!isArr) {
          releaseArray(object.criteria);
        }
        releaseObject(object);
      }
      return result;
    }

    /**
     * Converts the `collection` to an array.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to convert.
     * @returns {Array} Returns the new converted array.
     * @example
     *
     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
     * // => [2, 3, 4]
     */
    function toArray(collection) {
      if (collection && typeof collection.length == 'number') {
        return slice(collection);
      }
      return values(collection);
    }

    /**
     * Performs a deep comparison of each element in a `collection` to the given
     * `properties` object, returning an array of all elements that have equivalent
     * property values.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Object} props The object of property values to filter by.
     * @returns {Array} Returns a new array of elements that have the given properties.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.where(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
     *
     * _.where(characters, { 'pets': ['dino'] });
     * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
     */
    var where = filter;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are all falsey.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to compact.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Creates an array excluding all values of the provided arrays using strict
     * equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
     * // => [1, 3, 4]
     */
    function difference(array) {
      return baseDifference(array, baseFlatten(arguments, true, true, 1));
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.findIndex(characters, function(chr) {
     *   return chr.age < 20;
     * });
     * // => 2
     *
     * // using "_.where" callback shorthand
     * _.findIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findIndex(characters, 'blocked');
     * // => 1
     */
    function findIndex(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        if (callback(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': true },
     *   { 'name': 'fred',    'age': 40, 'blocked': false },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
     * ];
     *
     * _.findLastIndex(characters, function(chr) {
     *   return chr.age > 30;
     * });
     * // => 1
     *
     * // using "_.where" callback shorthand
     * _.findLastIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findLastIndex(characters, 'blocked');
     * // => 2
     */
    function findLastIndex(array, callback, thisArg) {
      var length = array ? array.length : 0;
      callback = lodash.createCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(array[length], length, array)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Gets the first element or first `n` elements of an array. If a callback
     * is provided elements at the beginning of the array are returned as long
     * as the callback returns truey. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias head, take
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the first element(s) of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.first([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.first(characters, 'blocked');
     * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
     * // => ['barney', 'fred']
     */
    function first(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = -1;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[0] : undefined;
        }
      }
      return slice(array, 0, nativeMin(nativeMax(0, n), length));
    }

    /**
     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
     * is truey, the array will only be flattened a single level. If a callback
     * is provided each element of the array is passed through the callback before
     * flattening. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new flattened array.
     * @example
     *
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     *
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, [[4]]];
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.flatten(characters, 'pets');
     * // => ['hoppy', 'baby puss', 'dino']
     */
    function flatten(array, isShallow, callback, thisArg) {
      // juggle arguments
      if (typeof isShallow != 'boolean' && isShallow != null) {
        thisArg = callback;
        callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
        isShallow = false;
      }
      if (callback != null) {
        array = map(array, callback, thisArg);
      }
      return baseFlatten(array, isShallow);
    }

    /**
     * Gets the index at which the first occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If the array is already sorted
     * providing `true` for `fromIndex` will run a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 1
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 4
     *
     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      if (typeof fromIndex == 'number') {
        var length = array ? array.length : 0;
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
      } else if (fromIndex) {
        var index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element or last `n` elements of an array. If a
     * callback is provided elements at the end of the array are excluded from
     * the result as long as the callback returns truey. The callback is bound
     * to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     *
     * _.initial([1, 2, 3], 2);
     * // => [1]
     *
     * _.initial([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [1]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.initial(characters, 'blocked');
     * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
     * // => ['barney', 'fred']
     */
    function initial(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : callback || n;
      }
      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
    }

    /**
     * Creates an array of unique values present in all provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of shared values.
     * @example
     *
     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2]
     */
    function intersection() {
      var args = [],
          argsIndex = -1,
          argsLength = arguments.length,
          caches = getArray(),
          indexOf = getIndexOf(),
          trustIndexOf = indexOf === baseIndexOf,
          seen = getArray();

      while (++argsIndex < argsLength) {
        var value = arguments[argsIndex];
        if (isArray(value) || isArguments(value)) {
          args.push(value);
          caches.push(trustIndexOf && value.length >= largeArraySize &&
            createCache(argsIndex ? args[argsIndex] : seen));
        }
      }
      var array = args[0],
          index = -1,
          length = array ? array.length : 0,
          result = [];

      outer:
      while (++index < length) {
        var cache = caches[0];
        value = array[index];

        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
          argsIndex = argsLength;
          (cache || seen).push(value);
          while (--argsIndex) {
            cache = caches[argsIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      while (argsLength--) {
        cache = caches[argsLength];
        if (cache) {
          releaseObject(cache);
        }
      }
      releaseArray(caches);
      releaseArray(seen);
      return result;
    }

    /**
     * Gets the last element or last `n` elements of an array. If a callback is
     * provided elements at the end of the array are returned as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the last element(s) of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     *
     * _.last([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.last([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [2, 3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.last(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.last(characters, { 'employer': 'na' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function last(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[length - 1] : undefined;
        }
      }
      return slice(array, nativeMax(0, length - n));
    }

    /**
     * Gets the index at which the last occurrence of `value` is found using strict
     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
     * as the offset from the end of the collection.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 4
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from the given array using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {...*} [value] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull(array) {
      var args = arguments,
          argsIndex = 0,
          argsLength = args.length,
          length = array ? array.length : 0;

      while (++argsIndex < argsLength) {
        var index = -1,
            value = args[argsIndex];
        while (++index < length) {
          if (array[index] === value) {
            splice.call(array, index--, 1);
            length--;
          }
        }
      }
      return array;
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to but not including `end`. If `start` is less than `stop` a
     * zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns a new range array.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      start = +start || 0;
      step = typeof step == 'number' ? step : (+step || 1);

      if (end == null) {
        end = start;
        start = 0;
      }
      // use `Array(length)` so engines like Chakra and V8 avoid slower modes
      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
      var index = -1,
          length = nativeMax(0, ceil((end - start) / (step || 1))),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Removes all elements from an array that the callback returns truey for
     * and returns an array of removed elements. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4, 5, 6];
     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
     *
     * console.log(array);
     * // => [1, 3, 5]
     *
     * console.log(evens);
     * // => [2, 4, 6]
     */
    function remove(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (callback(value, index, array)) {
          result.push(value);
          splice.call(array, index--, 1);
          length--;
        }
      }
      return result;
    }

    /**
     * The opposite of `_.initial` this method gets all but the first element or
     * first `n` elements of an array. If a callback function is provided elements
     * at the beginning of the array are excluded from the result as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias drop, tail
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     *
     * _.rest([1, 2, 3], 2);
     * // => [3]
     *
     * _.rest([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.rest(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.rest(characters, { 'employer': 'slate' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function rest(array, callback, thisArg) {
      if (typeof callback != 'number' && callback != null) {
        var n = 0,
            index = -1,
            length = array ? array.length : 0;

        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
      }
      return slice(array, n);
    }

    /**
     * Uses a binary search to determine the smallest index at which a value
     * should be inserted into a given sorted array in order to maintain the sort
     * order of the array. If a callback is provided it will be executed for
     * `value` and each element of `array` to compute their sort ranking. The
     * callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([20, 30, 50], 40);
     * // => 2
     *
     * // using "_.pluck" callback shorthand
     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 2
     *
     * var dict = {
     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
     * };
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return dict.wordToNumber[word];
     * });
     * // => 2
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return this.wordToNumber[word];
     * }, dict);
     * // => 2
     */
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;

      // explicitly reference `identity` for better inlining in Firefox
      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
      value = callback(value);

      while (low < high) {
        var mid = (low + high) >>> 1;
        (callback(array[mid]) < value)
          ? low = mid + 1
          : high = mid;
      }
      return low;
    }

    /**
     * Creates an array of unique values, in order, of the provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of combined values.
     * @example
     *
     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2, 3, 5, 4]
     */
    function union() {
      return baseUniq(baseFlatten(arguments, true, true));
    }

    /**
     * Creates a duplicate-value-free version of an array using strict equality
     * for comparisons, i.e. `===`. If the array is sorted, providing
     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
     * each element of `array` is passed through the callback before uniqueness
     * is computed. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a duplicate-value-free array.
     * @example
     *
     * _.uniq([1, 2, 1, 3, 1]);
     * // => [1, 2, 3]
     *
     * _.uniq([1, 1, 2, 2, 3], true);
     * // => [1, 2, 3]
     *
     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
     * // => ['A', 'b', 'C']
     *
     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
     * // => [1, 2.5, 3]
     *
     * // using "_.pluck" callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, callback, thisArg) {
      // juggle arguments
      if (typeof isSorted != 'boolean' && isSorted != null) {
        thisArg = callback;
        callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
        isSorted = false;
      }
      if (callback != null) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      return baseUniq(array, isSorted, callback);
    }

    /**
     * Creates an array excluding all provided values using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to filter.
     * @param {...*} [value] The values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * // => [2, 3, 4]
     */
    function without(array) {
      return baseDifference(array, slice(arguments, 1));
    }

    /**
     * Creates an array that is the symmetric difference of the provided arrays.
     * See http://en.wikipedia.org/wiki/Symmetric_difference.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of values.
     * @example
     *
     * _.xor([1, 2, 3], [5, 2, 1, 4]);
     * // => [3, 5, 4]
     *
     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
     * // => [1, 4, 5]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArray(array) || isArguments(array)) {
          var result = result
            ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
            : array;
        }
      }
      return result || [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second
     * elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @alias unzip
     * @category Arrays
     * @param {...Array} [array] Arrays to process.
     * @returns {Array} Returns a new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    function zip() {
      var array = arguments.length > 1 ? arguments : arguments[0],
          index = -1,
          length = array ? max(pluck(array, 'length')) : 0,
          result = Array(length < 0 ? 0 : length);

      while (++index < length) {
        result[index] = pluck(array, index);
      }
      return result;
    }

    /**
     * Creates an object composed from arrays of `keys` and `values`. Provide
     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
     * or two arrays, one of `keys` and one of corresponding `values`.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Arrays
     * @param {Array} keys The array of keys.
     * @param {Array} [values=[]] The array of values.
     * @returns {Object} Returns an object composed of the given keys and
     *  corresponding values.
     * @example
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};

      if (!values && length && !isArray(keys[0])) {
        values = [];
      }
      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that executes `func`, with  the `this` binding and
     * arguments of the created function, only after being called `n` times.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {number} n The number of times the function must be called before
     *  `func` is executed.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('Done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'Done saving!', after all saves have completed
     */
    function after(n, func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with the `this`
     * binding of `thisArg` and prepends any additional `bind` arguments to those
     * provided to the bound function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var func = function(greeting) {
     *   return greeting + ' ' + this.name;
     * };
     *
     * func = _.bind(func, { 'name': 'fred' }, 'hi');
     * func();
     * // => 'hi fred'
     */
    function bind(func, thisArg) {
      return arguments.length > 2
        ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
        : createWrapper(func, 1, null, null, thisArg);
    }

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all the function properties
     * of `object` will be bound.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...string} [methodName] The object method names to
     *  bind, specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() { console.log('clicked ' + this.label); }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs', when the button is clicked
     */
    function bindAll(object) {
      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
          index = -1,
          length = funcs.length;

      while (++index < length) {
        var key = funcs[index];
        object[key] = createWrapper(object[key], 1, null, null, object);
      }
      return object;
    }

    /**
     * Creates a function that, when called, invokes the method at `object[key]`
     * and prepends any additional `bindKey` arguments to those provided to the bound
     * function. This method differs from `_.bind` by allowing bound functions to
     * reference methods that will be redefined or don't yet exist.
     * See http://michaux.ca/articles/lazy-function-definition-pattern.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'name': 'fred',
     *   'greet': function(greeting) {
     *     return greeting + ' ' + this.name;
     *   }
     * };
     *
     * var func = _.bindKey(object, 'greet', 'hi');
     * func();
     * // => 'hi fred'
     *
     * object.greet = function(greeting) {
     *   return greeting + 'ya ' + this.name + '!';
     * };
     *
     * func();
     * // => 'hiya fred!'
     */
    function bindKey(object, key) {
      return arguments.length > 2
        ? createWrapper(key, 19, slice(arguments, 2), null, object)
        : createWrapper(key, 3, null, null, object);
    }

    /**
     * Creates a function that is the composition of the provided functions,
     * where each function consumes the return value of the function that follows.
     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
     * Each function is executed with the `this` binding of the composed function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {...Function} [func] Functions to compose.
     * @returns {Function} Returns the new composed function.
     * @example
     *
     * var realNameMap = {
     *   'pebbles': 'penelope'
     * };
     *
     * var format = function(name) {
     *   name = realNameMap[name.toLowerCase()] || name;
     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
     * };
     *
     * var greet = function(formatted) {
     *   return 'Hiya ' + formatted + '!';
     * };
     *
     * var welcome = _.compose(greet, format);
     * welcome('pebbles');
     * // => 'Hiya Penelope!'
     */
    function compose() {
      var funcs = arguments,
          length = funcs.length;

      while (length--) {
        if (!isFunction(funcs[length])) {
          throw new TypeError;
        }
      }
      return function() {
        var args = arguments,
            length = funcs.length;

        while (length--) {
          args = [funcs[length].apply(this, args)];
        }
        return args[0];
      };
    }

    /**
     * Creates a function which accepts one or more arguments of `func` that when
     * invoked either executes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` can be specified
     * if `func.length` is not sufficient.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var curried = _.curry(function(a, b, c) {
     *   console.log(a + b + c);
     * });
     *
     * curried(1)(2)(3);
     * // => 6
     *
     * curried(1, 2)(3);
     * // => 6
     *
     * curried(1, 2, 3);
     * // => 6
     */
    function curry(func, arity) {
      arity = typeof arity == 'number' ? arity : (+arity || func.length);
      return createWrapper(func, 4, null, null, null, arity);
    }

    /**
     * Creates a function that will delay the execution of `func` until after
     * `wait` milliseconds have elapsed since the last time it was invoked.
     * Provide an options object to indicate that `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
     * to the debounced function will return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to debounce.
     * @param {number} wait The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * var lazyLayout = _.debounce(calculateLayout, 150);
     * jQuery(window).on('resize', lazyLayout);
     *
     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * });
     *
     * // ensure `batchLog` is executed once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * source.addEventListener('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }, false);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      wait = nativeMax(0, wait) || 0;
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      var delayed = function() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0) {
          if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
          }
          var isCalled = trailingCall;
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
          }
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      };

      var maxDelayed = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (trailing || (maxWait !== wait)) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = null;
          }
        }
      };

      return function() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
        return result;
      };
    }

    /**
     * Defers executing the `func` function until the current call stack has cleared.
     * Additional arguments will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to defer.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) { console.log(text); }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    function defer(func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 1);
      return setTimeout(function() { func.apply(undefined, args); }, 1);
    }

    /**
     * Executes the `func` function after `wait` milliseconds. Additional arguments
     * will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay execution.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) { console.log(text); }, 1000, 'later');
     * // => logs 'later' after one second
     */
    function delay(func, wait) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 2);
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it will be used to determine the cache key for storing the result
     * based on the arguments provided to the memoized function. By default, the
     * first argument provided to the memoized function is used as the cache key.
     * The `func` is executed with the `this` binding of the memoized function.
     * The result cache is exposed as the `cache` property on the memoized function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] A function used to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var fibonacci = _.memoize(function(n) {
     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     * });
     *
     * fibonacci(9)
     * // => 34
     *
     * var data = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // modifying the result cache
     * var get = _.memoize(function(name) { return data[name]; }, _.identity);
     * get('pebbles');
     * // => { 'name': 'pebbles', 'age': 1 }
     *
     * get.cache.pebbles.name = 'penelope';
     * get('pebbles');
     * // => { 'name': 'penelope', 'age': 1 }
     */
    function memoize(func, resolver) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var memoized = function() {
        var cache = memoized.cache,
            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

        return hasOwnProperty.call(cache, key)
          ? cache[key]
          : (cache[key] = func.apply(this, arguments));
      }
      memoized.cache = {};
      return memoized;
    }

    /**
     * Creates a function that is restricted to execute `func` once. Repeat calls to
     * the function will return the value of the first call. The `func` is executed
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` executes `createApplication` once
     */
    function once(func) {
      var ran,
          result;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);

        // clear the `func` variable so the function may be garbage collected
        func = null;
        return result;
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with any additional
     * `partial` arguments prepended to those provided to the new function. This
     * method is similar to `_.bind` except it does **not** alter the `this` binding.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) { return greeting + ' ' + name; };
     * var hi = _.partial(greet, 'hi');
     * hi('fred');
     * // => 'hi fred'
     */
    function partial(func) {
      return createWrapper(func, 16, slice(arguments, 1));
    }

    /**
     * This method is like `_.partial` except that `partial` arguments are
     * appended to those provided to the new function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
     *
     * var options = {
     *   'variable': 'data',
     *   'imports': { 'jq': $ }
     * };
     *
     * defaultsDeep(options, _.templateSettings);
     *
     * options.variable
     * // => 'data'
     *
     * options.imports
     * // => { '_': _, 'jq': $ }
     */
    function partialRight(func) {
      return createWrapper(func, 32, null, slice(arguments, 1));
    }

    /**
     * Creates a function that, when executed, will only call the `func` function
     * at most once per every `wait` milliseconds. Provide an options object to
     * indicate that `func` should be invoked on the leading and/or trailing edge
     * of the `wait` timeout. Subsequent calls to the throttled function will
     * return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to throttle.
     * @param {number} wait The number of milliseconds to throttle executions to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * var throttled = _.throttle(updatePosition, 100);
     * jQuery(window).on('scroll', throttled);
     *
     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? options.leading : leading;
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      debounceOptions.leading = leading;
      debounceOptions.maxWait = wait;
      debounceOptions.trailing = trailing;

      return debounce(func, wait, debounceOptions);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Additional arguments provided to the function are appended
     * to those provided to the wrapper function. The wrapper is executed with
     * the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('Fred, Wilma, & Pebbles');
     * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
     */
    function wrap(value, wrapper) {
      return createWrapper(wrapper, 16, [value]);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var getter = _.constant(object);
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Produces a callback bound to an optional `thisArg`. If `func` is a property
     * name the created callback will return the property value for a given element.
     * If `func` is an object the created callback will return `true` for elements
     * that contain the equivalent object properties, otherwise it will return `false`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
     *   return !match ? func(callback, thisArg) : function(object) {
     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(characters, 'age__gt38');
     * // => [{ 'name': 'fred', 'age': 40 }]
     */
    function createCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (func == null || type == 'function') {
        return baseCreateCallback(func, thisArg, argCount);
      }
      // handle "_.pluck" style callback shorthands
      if (type != 'object') {
        return property(func);
      }
      var props = keys(func),
          key = props[0],
          a = func[key];

      // handle "_.where" style callback shorthands
      if (props.length == 1 && a === a && !isObject(a)) {
        // fast path the common case of providing an object with a single
        // property containing a primitive value
        return function(object) {
          var b = object[key];
          return a === b && (a !== 0 || (1 / a == 1 / b));
        };
      }
      return function(object) {
        var length = props.length,
            result = false;

        while (length--) {
          if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
            break;
          }
        }
        return result;
      };
    }

    /**
     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
     * corresponding HTML entities.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('Fred, Wilma, & Pebbles');
     * // => 'Fred, Wilma, &amp; Pebbles'
     */
    function escape(string) {
      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Adds function properties of a source object to the destination object.
     * If `object` is a function methods will be added to its prototype as well.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Function|Object} [object=lodash] object The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
     * @example
     *
     * function capitalize(string) {
     *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
     * }
     *
     * _.mixin({ 'capitalize': capitalize });
     * _.capitalize('fred');
     * // => 'Fred'
     *
     * _('fred').capitalize().value();
     * // => 'Fred'
     *
     * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
     * _('fred').capitalize();
     * // => 'Fred'
     */
    function mixin(object, source, options) {
      var chain = true,
          methodNames = source && functions(source);

      if (!source || (!options && !methodNames.length)) {
        if (options == null) {
          options = source;
        }
        ctor = lodashWrapper;
        source = object;
        object = lodash;
        methodNames = functions(source);
      }
      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      var ctor = object,
          isFunc = isFunction(ctor);

      forEach(methodNames, function(methodName) {
        var func = object[methodName] = source[methodName];
        if (isFunc) {
          ctor.prototype[methodName] = function() {
            var chainAll = this.__chain__,
                value = this.__wrapped__,
                args = [value];

            push.apply(args, arguments);
            var result = func.apply(object, args);
            if (chain || chainAll) {
              if (value === result && isObject(result)) {
                return this;
              }
              result = new ctor(result);
              result.__chain__ = chainAll;
            }
            return result;
          };
        }
      });
    }

    /**
     * Reverts the '_' variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      context._ = oldDash;
      return this;
    }

    /**
     * A no-operation function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // no operation performed
    }

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var stamp = _.now();
     * _.defer(function() { console.log(_.now() - stamp); });
     * // => logs the number of milliseconds it took for the deferred function to be called
     */
    var now = isNative(now = Date.now) && now || function() {
      return new Date().getTime();
    };

    /**
     * Converts the given value into an integer of the specified radix.
     * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
     *
     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
     * implementations. See http://es5.github.io/#E.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} value The value to parse.
     * @param {number} [radix] The radix used to interpret the value to parse.
     * @returns {number} Returns the new integer value.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     */
    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
      // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
    };

    /**
     * Creates a "_.pluck" style function, which returns the `key` value of a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} key The name of the property to retrieve.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var characters = [
     *   { 'name': 'fred',   'age': 40 },
     *   { 'name': 'barney', 'age': 36 }
     * ];
     *
     * var getName = _.property('name');
     *
     * _.map(characters, getName);
     * // => ['barney', 'fred']
     *
     * _.sortBy(characters, getName);
     * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
     */
    function property(key) {
      return function(object) {
        return object[key];
      };
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number will be
     * returned. If `floating` is truey or either `min` or `max` are floats a
     * floating-point number will be returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating=false] Specify returning a floating-point number.
     * @returns {number} Returns a random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (typeof min == 'boolean' && noMax) {
          floating = min;
          min = 1;
        }
        else if (!noMax && typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /**
     * Resolves the value of property `key` on `object`. If `key` is a function
     * it will be invoked with the `this` binding of `object` and its result returned,
     * else the property value is returned. If `object` is falsey then `undefined`
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to resolve.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = {
     *   'cheese': 'crumpets',
     *   'stuff': function() {
     *     return 'nonsense';
     *   }
     * };
     *
     * _.result(object, 'cheese');
     * // => 'crumpets'
     *
     * _.result(object, 'stuff');
     * // => 'nonsense'
     */
    function result(object, key) {
      if (object) {
        var value = object[key];
        return isFunction(value) ? object[key]() : value;
      }
    }

    /**
     * A micro-templating method that handles arbitrary delimiters, preserves
     * whitespace, and correctly escapes quotes within interpolated code.
     *
     * Note: In the development build, `_.template` utilizes sourceURLs for easier
     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
     *
     * For more information on precompiling templates see:
     * http://lodash.com/custom-builds
     *
     * For more information on Chrome extension sandboxes see:
     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} text The template text.
     * @param {Object} data The data object used to populate the text.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as local variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [variable] The data object variable name.
     * @returns {Function|string} Returns a compiled function when no `data` object
     *  is given, else it returns the interpolated text.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= name %>');
     * compiled({ 'name': 'fred' });
     * // => 'hello fred'
     *
     * // using the "escape" delimiter to escape HTML in data property values
     * _.template('<b><%- value %></b>', { 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to generate HTML
     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
     * _.template('hello ${ name }', { 'name': 'pebbles' });
     * // => 'hello pebbles'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
     * // => 'hello barney!'
     *
     * // using a custom template delimiters
     * _.templateSettings = {
     *   'interpolate': /{{([\s\S]+?)}}/g
     * };
     *
     * _.template('hello {{ name }}!', { 'name': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using the `imports` option to import jQuery
     * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     *   var __t, __p = '', __e = _.escape;
     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
     *   return __p;
     * }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(text, data, options) {
      // based on John Resig's `tmpl` implementation
      // http://ejohn.org/blog/javascript-micro-templating/
      // and Laura Doktorova's doT.js
      // https://github.com/olado/doT
      var settings = lodash.templateSettings;
      text = String(text || '');

      // avoid missing dependencies when `iteratorTemplate` is not defined
      options = defaults({}, options, settings);

      var imports = defaults({}, options.imports, settings.imports),
          importsKeys = keys(imports),
          importsValues = values(imports);

      var isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // compile the regexp to match each delimiter
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // escape characters that cannot be included in string literals
        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // replace delimiters with snippets
        if (escapeValue) {
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // the JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value
        return match;
      });

      source += "';\n";

      // if `variable` is not specified, wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain
      var variable = options.variable,
          hasVariable = variable;

      if (!hasVariable) {
        variable = 'obj';
        source = 'with (' + variable + ') {\n' + source + '\n}\n';
      }
      // cleanup code by stripping empty strings
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // frame code as the function body
      source = 'function(' + variable + ') {\n' +
        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
        "var __t, __p = '', __e = _.escape" +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      // Use a sourceURL for easier debugging.
      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

      try {
        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
      } catch(e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      // provide the compiled function's source by its `toString` method, in
      // supported environments, or the `source` property as a convenience for
      // inlining compiled templates during the build process
      result.source = source;
      return result;
    }

    /**
     * Executes the callback `n` times, returning an array of the results
     * of each callback execution. The callback is bound to `thisArg` and invoked
     * with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} n The number of times to execute the callback.
     * @param {Function} callback The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns an array of the results of each `callback` execution.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) { mage.castSpell(n); });
     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
     *
     * _.times(3, function(n) { this.cast(n); }, mage);
     * // => also calls `mage.castSpell(n)` three times
     */
    function times(n, callback, thisArg) {
      n = (n = +n) > -1 ? n : 0;
      var index = -1,
          result = Array(n);

      callback = baseCreateCallback(callback, thisArg, 1);
      while (++index < n) {
        result[index] = callback(index);
      }
      return result;
    }

    /**
     * The inverse of `_.escape` this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
     * corresponding characters.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('Fred, Barney &amp; Pebbles');
     * // => 'Fred, Barney & Pebbles'
     */
    function unescape(string) {
      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return String(prefix == null ? '' : prefix) + id;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps the given value with explicit
     * method chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(characters)
     *     .sortBy('age')
     *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
     *     .first()
     *     .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      value = new lodashWrapper(value);
      value.__chain__ = true;
      return value;
    }

    /**
     * Invokes `interceptor` with the `value` as the first argument and then
     * returns `value`. The purpose of this method is to "tap into" a method
     * chain in order to perform operations on intermediate results within
     * the chain.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3, 4])
     *  .tap(function(array) { array.pop(); })
     *  .reverse()
     *  .value();
     * // => [3, 2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chaining
     * @returns {*} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(characters).first();
     * // => { 'name': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(characters).chain()
     *   .first()
     *   .pick('age')
     *   .value();
     * // => { 'age': 36 }
     */
    function wrapperChain() {
      this.__chain__ = true;
      return this;
    }

    /**
     * Produces the `toString` result of the wrapped value.
     *
     * @name toString
     * @memberOf _
     * @category Chaining
     * @returns {string} Returns the string result.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return String(this.__wrapped__);
    }

    /**
     * Extracts the wrapped value.
     *
     * @name valueOf
     * @memberOf _
     * @alias value
     * @category Chaining
     * @returns {*} Returns the wrapped value.
     * @example
     *
     * _([1, 2, 3]).valueOf();
     * // => [1, 2, 3]
     */
    function wrapperValueOf() {
      return this.__wrapped__;
    }

    /*--------------------------------------------------------------------------*/

    // add functions that return wrapped values when chaining
    lodash.after = after;
    lodash.assign = assign;
    lodash.at = at;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.chain = chain;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.createCallback = createCallback;
    lodash.curry = curry;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.map = map;
    lodash.mapValues = mapValues;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.min = min;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.pull = pull;
    lodash.range = range;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.values = values;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;

    // add aliases
    lodash.collect = map;
    lodash.drop = rest;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    lodash.unzip = zip;

    // add functions to `lodash.prototype`
    mixin(lodash);

    /*--------------------------------------------------------------------------*/

    // add functions that return unwrapped values when chaining
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.contains = contains;
    lodash.escape = escape;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.result = result;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.template = template;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;

    // add aliases
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.findWhere = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;

    mixin(function() {
      var source = {}
      forOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }(), false);

    /*--------------------------------------------------------------------------*/

    // add functions capable of returning wrapped and unwrapped values when chaining
    lodash.first = first;
    lodash.last = last;
    lodash.sample = sample;

    // add aliases
    lodash.take = first;
    lodash.head = first;

    forOwn(lodash, function(func, methodName) {
      var callbackable = methodName !== 'sample';
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName]= function(n, guard) {
          var chainAll = this.__chain__,
              result = func(this.__wrapped__, n, guard);

          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
            ? result
            : new lodashWrapper(result, chainAll);
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = '2.4.1';

    // add "Chaining" functions to the wrapper
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.value = wrapperValueOf;
    lodash.prototype.valueOf = wrapperValueOf;

    // add `Array` functions that return unwrapped values
    forEach(['join', 'pop', 'shift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            result = func.apply(this.__wrapped__, arguments);

        return chainAll
          ? new lodashWrapper(result, chainAll)
          : result;
      };
    });

    // add `Array` functions that return the existing wrapped value
    forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        func.apply(this.__wrapped__, arguments);
        return this;
      };
    });

    // add `Array` functions that return new wrapped values
    forEach(['concat', 'slice', 'splice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
      };
    });

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  var _ = runInContext();

  // some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash is loaded with a RequireJS shim config.
    // See http://requirejs.org/docs/api.html#config-shim
    root._ = _;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return _;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // in Narwhal or Rhino -require
    else {
      freeExports._ = _;
    }
  }
  else {
    // in a browser or Rhino
    root._ = _;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
