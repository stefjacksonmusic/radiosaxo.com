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