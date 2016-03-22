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