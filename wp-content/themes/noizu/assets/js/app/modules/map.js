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