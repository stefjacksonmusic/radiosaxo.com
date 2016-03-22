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