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