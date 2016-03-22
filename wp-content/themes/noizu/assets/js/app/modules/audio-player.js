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