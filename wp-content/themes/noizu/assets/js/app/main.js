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