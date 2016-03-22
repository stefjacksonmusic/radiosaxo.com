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