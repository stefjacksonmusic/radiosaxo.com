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