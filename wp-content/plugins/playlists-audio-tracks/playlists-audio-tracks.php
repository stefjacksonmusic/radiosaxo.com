<?php 
/*
Plugin Name: Playlist Audio Tracks
Plugin URI: http://mountainthemes.com/
Description: Add playlists and audio tracks custom post types
Author: Luca Bertaiola
Author URI: http://luglio7.com/
Text Domain: playlists-audio-tracks
Version: 1.0.0
*/

function mthemes_add_custom_post_types(){
    register_post_type( 'audio-track',
        array(
            'labels' => array(
                'name'          => mthemes_get_l10n('Audio Tracks'),
                'singular_name' => mthemes_get_l10n('Audio Track'),
                'add_new_item'  => mthemes_get_l10n('Add New Audio Track'),
                'edit_item'     => mthemes_get_l10n('Edit Audio Track')
            ),
            'menu_position' => 30,
            'menu_icon'     => 'dashicons-format-audio',
            'public'        => true,
            'has_archive'   => false,
            'rewrite'       => array('slug' => 'audio-track'),
            'supports'      => array('title')
        )
    );

    register_post_type( 'playlist',
        array(
            'labels' => array(
                'name'          => mthemes_get_l10n('Playlists'),
                'singular_name' => mthemes_get_l10n('Playlist'),
                'add_new_item'  => mthemes_get_l10n('Add New Playlist'),
                'edit_item'     => mthemes_get_l10n('Edit Playlist')
            ),
            'menu_position' => 31,
            'menu_icon'     => 'dashicons-format-audio',
            'public'        => true,
            'has_archive'   => false,
            'rewrite'       => array('slug' => 'playlist'),
            'supports'      => array('title')
        )
    );
}

add_action('init', 'mthemes_add_custom_post_types');