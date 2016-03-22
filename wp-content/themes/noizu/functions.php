<?php
global $mthemes_is_dev;

// INCLUDE LIBRARIES

require_once get_template_directory() . '/vendors/tgm/class-tgm-plugin-activation.php';


// GLOBAL VARS

$mthemes_is_dev             = (isset($_SERVER['SERVER_ADMIN']) and $_SERVER['SERVER_ADMIN'] === 'luca@luglio7.com')? true : false;
$mthemes_is_ajax            = (isset($_SERVER['HTTP_HISTORYX_REQUEST']) and !empty($_SERVER['HTTP_HISTORYX_REQUEST']))? true : false;
$mthemes_acf_active         = class_exists('acf');
$mthemes_acf_admin_display  = $mthemes_is_dev;
$mthemes_gmaps_loaded       = false;

if(!isset($content_width)){
    $content_width = 900;
}


// INCLUDE LANGUAGE FILE & LOAD TEXT DOMAIN

if(is_file(get_template_directory() . "/languages/language-". strtolower(get_locale()) .".php" )){
    get_template_part('languages/language', strtolower(get_locale()));
}
else {
    get_template_part('languages/language', 'en_us');
}

load_theme_textdomain('mthemes', get_template_directory() . '/languages');


// THEME CLASSES

class mthemes_theme {
    function __construct(){
        
        // actions

        add_action('init',                          array($this, 'register_taxonomies'));
        add_action('init',                          array($this, 'init'));
        add_action('after_setup_theme',             array($this, 'add_theme_support'));
        add_action('after_setup_theme',             array($this, 'register_menus') );
        add_action('tgmpa_register',                array($this, 'register_plugins'));
        add_action('wp_enqueue_scripts',            array($this, 'enqueue_scripts'));
        add_action('admin_menu',                    array($this, 'hide_acf_menu'), 99);


        // filters

        add_filter('all_plugins',                   array($this, 'hide_plugins'));
        add_filter('site_transient_update_plugins', array($this, 'hide_update_notification'));
    }

    // hide acf from plugins list

    function hide_plugins($plugins){
        global $mthemes_acf_admin_display;

        if((!$mthemes_acf_admin_display) and is_plugin_active('advanced-custom-fields-pro/acf.php')) {
            unset( $plugins['advanced-custom-fields-pro/acf.php'] );
        }

        return $plugins;
    }

    // hide acf update notifications

    function hide_update_notification($value){
        global $mthemes_acf_admin_display;

        if((!$mthemes_acf_admin_display) and is_object($value) and property_exists($value, 'response') and is_array($value->response) and array_key_exists('advanced-custom-fields-pro/acf.php', $value->response)){
            unset($value->response['advanced-custom-fields-pro/acf.php']);
        }

        return $value;
    }

    // hide acf from menu

    function hide_acf_menu(){
        global $menu;
        global $mthemes_acf_admin_display;

        if(!$mthemes_acf_admin_display){
            foreach($menu as $key => $value){
                if(is_array($value) and array_key_exists(0, $value) and $value[0] === 'Custom Fields'){
                    unset($menu[$key]);
                }
            }
        }
    }

    function register_plugins(){}
    function register_post_types(){}
    function register_taxonomies(){}
    function init(){}
    function enqueue_scripts(){}
    function theme_supports(){}
    function register_menus(){}
}


class mthemes_theme_noizu extends mthemes_theme {
    function __construct(){
        add_filter('acf/load_field/name=icon',                  array($this, 'load_icons_select'));
        add_filter('acf/load_field/name=title_icon',            array($this, 'load_icons_select'));
        add_filter('acf/load_field/name=svg_logo',              array($this, 'load_icons_select'));
        
        add_filter('acf/load_field/name=posts_list_sidebar',    array($this, 'load_sidebars_select'));
        add_filter('acf/load_field/name=post_sidebar',          array($this, 'load_sidebars_select'));
        add_filter('acf/load_field/name=page_sidebar',          array($this, 'load_sidebars_select'));

        add_filter('acf/load_field/name=contact_forms',         array($this, 'load_contact_forms'));

        add_action('after_setup_theme',                         array($this, 'add_image_sizes'));
        add_action('widgets_init',                              array($this, 'add_theme_sidebars'));
        add_action('init',                                      array($this, 'add_pages_tags'));

        parent::__construct();
    }

    function init(){
        if(function_exists('acf_add_options_page')){
            acf_add_options_page();
            acf_add_options_sub_page('General');
            // acf_add_options_sub_page('Layout');
            acf_set_options_page_title(mthemes_get_l10n('Theme Options'));
        }
    }

    function add_theme_support(){
        add_theme_support('automatic-feed-links');
        add_theme_support('post-thumbnails');
        add_theme_support('menus');
        add_theme_support('html5');
        add_theme_support('post-formats', array('link', 'image', 'quote', 'status', 'video'));
        add_theme_support('woocommerce');
        add_theme_support('title-tag');
    }

    function add_image_sizes(){
        add_image_size('image-background',  1440, 960, false);
        add_image_size('image-collection',  960, 960, false);
        add_image_size('image-profile',     400, 400, true);
        add_image_size('image-gallery',     600, 600, true);
    }

    function add_pages_tags(){
        register_taxonomy_for_object_type('post_tag', 'page');
    }

    function add_theme_sidebars(){
        $custom_sidebars = mthemes_get_field(array('field' => 'custom_sidebars', 'post_id' => 'options', 'is' => 'array'));

        register_sidebar( array(
            'name'          => mthemes_get_l10n('Default Sidebar'),
            'id'            => 'sidebar-1',
            'before_widget' => '<div class="widget">',
            'after_widget'  => '</div>',
            'before_title'  => '<h5>',
            'after_title'   => '</h5>'
        ));

        register_sidebar( array(
            'name'          => mthemes_get_l10n('Off Canvas Sidebar'),
            'id'            => 'sidebar-2',
            'before_widget' => '<div class="widget">',
            'after_widget'  => '</div>',
            'before_title'  => '<h5>',
            'after_title'   => '</h5>'
        ));

        if($custom_sidebars){
            foreach($custom_sidebars as $_sidebar){
                $sidebar_id = md5($_sidebar['sidebar_name']);

                register_sidebar(array(
                    'name'          => $_sidebar['sidebar_name'],
                    'id'            => $sidebar_id,
                    'before_widget' => '<div class="widget">',
                    'after_widget'  => '</div>',
                    'before_title'  => '<h5>',
                    'after_title'   => '</h5>'
                ));
            }
        }
    }

    function enqueue_scripts(){
        global $mthemes_is_ajax;
        global $mthemes_is_dev;

        // custom css

        $custom_css = mthemes_get_field(array('field' => 'custom_css', 'post_id' => 'options', 'is' => 'string'));

        // google fonts default

        $google_fonts_base_url      = 'http://fonts.googleapis.com/css?family=';
        $google_fonts_url           = false;

        // custom fonts url

        $default_font_name          = mthemes_get_field(array('field' => 'default_font_name', 'is' => 'string', 'post_id' => 'options'));
        $headings_font_name         = mthemes_get_field(array('field' => 'headings_font_name', 'is' => 'string', 'post_id' => 'options'));
        $nav_font_name              = mthemes_get_field(array('field' => 'nav_font_name', 'is' => 'string', 'post_id' => 'options'));

        $default_font_path          = false;
        $headings_font_path         = false;
        $nav_font_path              = false;
        $font_paths                 = array();

        // custom fonts css

        $default_font_name          = mthemes_get_field(array('field' => 'default_font_name', 'is' => 'string', 'post_id' => 'options'));
        $headings_font_name         = mthemes_get_field(array('field' => 'headings_font_name', 'is' => 'string', 'post_id' => 'options'));
        $nav_font_name              = mthemes_get_field(array('field' => 'nav_font_name', 'is' => 'string', 'post_id' => 'options'));
        $custom_css_fonts           = false;

        // default font

        if($default_font_name){
            $default_font_name  = preg_replace("/\s/", "+", trim($default_font_name));
            $default_font_path  = $default_font_name . ':300,400,500,700';
            
        }
        else {
            $default_font_path  = 'Roboto:300,400,500,700';
        }

        $font_paths[]       = $default_font_path;

        // headings font

        if($headings_font_name){
            $headings_font_name = preg_replace("/\s/", "+", trim($headings_font_name));
            $headings_font_path = $headings_font_name . ':300,400,700';
        }
        else {
            $headings_font_path = 'Roboto+Condensed:300,400,700';
        }

        $font_paths[]       = $headings_font_path;

        // nav font

        if($nav_font_name){
            $nav_font_name      = preg_replace("/\s/", "+", trim($nav_font_name));
            $nav_font_path      = $nav_font_name . ':400,500,700';
            $font_paths[]       = $nav_font_path;
        }

        $google_fonts_url = $google_fonts_base_url . implode('|', $font_paths);

        // custom fonts css

        $default_font_selectors     = array(
            'body',
            '.comment-form p:not(.form-submit) input, .comment-form p:not(.form-submit) textarea'
        );

        $headings_font_selectors    = array(
            'h1,h2,h3,h5,h6',
            '.widget form div label'
        );
        $nav_font_selectors         = array(
            '#bar #bar-content nav ul li a',
            '.widget nav'
        );

        if($default_font_name){
            foreach($default_font_selectors as $_selector){
                $custom_css_fonts .= $_selector . '{ font-family : "'. $default_font_name .'" }' . "\n";
            }
        }

        if($headings_font_name){
            foreach($headings_font_selectors as $_selector){
                $custom_css_fonts .= $_selector . '{ font-family : "'. $headings_font_name .'" }' . "\n";
            }
        }

        if($nav_font_name){
            foreach($nav_font_selectors as $_selector){
                $custom_css_fonts .= $_selector . '{ font-family : "'. $nav_font_name .'" }' . "\n";
            }
        }

        // enqueue scripts & styles

        $app_js = ($mthemes_is_dev)? 'app.js' : 'app.min.js';

        if(!$mthemes_is_ajax){
            // register

            wp_register_style('style', get_bloginfo('stylesheet_url'));
            wp_register_style('fonts', $google_fonts_url);

            wp_register_script('jquery.sharrre',    get_template_directory_uri() . '/assets/js/vendors/jquery.sharrre.min.js', array('jquery'), false, true);
            wp_register_script('packery',           get_template_directory_uri() . '/assets/js/vendors/packery.pkgd.min.js', array(), false, true);
            wp_register_script('soundcloud',        get_template_directory_uri() . '/assets/js/vendors/soundcloud.api.js', array(), false, true);
            wp_register_script('velocity',          get_template_directory_uri() . '/assets/js/vendors/velocity.min.js', array('jquery'), false, true);
            wp_register_script('app',               get_template_directory_uri() . '/assets/js/' . $app_js, array('jquery', 'jquery.sharrre', 'packery', 'soundcloud', 'velocity'), false, true);

            // enqueue

            wp_enqueue_style('fonts');
            wp_enqueue_style('style');

            if($custom_css){
                wp_add_inline_style('style', $custom_css );
            }

            if($custom_css_fonts){
                wp_add_inline_style('style', $custom_css_fonts );
            }

            wp_enqueue_script('app', false, array(), false, true);
        }

        if(is_singular() && comments_open() && get_option('thread_comments')){
            wp_enqueue_script('comment-reply');
        }
    }

    function register_menus(){
        register_nav_menu('off_canvas_sidebar',     mthemes_get_l10n('Off Canvas Sidebar'));
        register_nav_menu('bar',                    mthemes_get_l10n('Bar'));
    }

    // register acf & other plugins

    function register_plugins(){
        $plugins = array(
            array(
                'name'                  => 'Advanced Custom Fields Pro',
                'slug'                  => 'advanced-custom-fields-pro',
                'source'                => get_template_directory() . '/vendors/advanced-custom-fields-pro.zip',
                'required'              => true,
                'force_activation'      => true,
                'force_deactivation'    => true
            ),
            array(
                'name'                  => 'Playlist Audio Tracks',
                'slug'                  => 'playlists-audio-tracks',
                'source'                => get_template_directory() . '/vendors/playlists-audio-tracks.zip',
                'required'              => true,
                'force_activation'      => true,
                'force_deactivation'    => true
            ),
            array(
                'name'                  => 'Envato Wordpress Toolkit',
                'slug'                  => 'envato-wordpress-toolkit',
                'source'                => get_template_directory() . '/vendors/envato-wordpress-toolkit.zip',
                'required'              => false,
                'force_activation'      => false,
                'force_deactivation'    => false
            )
        );
        
        $config = array(
            'domain'       => 'mthemes',
            'has_notices'  => true,
            'is_automatic' => true
        );

        tgmpa($plugins, $config);
    }

    function load_icons_select( $field ){
        // load icons

        $icons = mthemes_load_svg();
        $icons = mthemes_array_flat($icons);
        asort($icons);

        // set icons to field

        $field['choices'] = $icons;

        return $field;
    }

    function load_contact_forms( $field ){
        $contact_forms = new WP_Query(array(
            'posts_per_page'    => -1,
            'post_type'         => 'wpcf7_contact_form'
        ));

        $field['choices'] = array();

        if(is_array($contact_forms->posts)){
            foreach($contact_forms->posts as $post){
                $field['choices'][$post->ID] = $post->post_title;
            }
        }

        return $field;
    }

    function load_sidebars_select( $field ){
        global $wp_registered_sidebars;
        $sidebars = array();

        if(is_array($wp_registered_sidebars)){
            foreach($wp_registered_sidebars as $wp_registered_sidebar){
                $sidebars[$wp_registered_sidebar['id']]  = $wp_registered_sidebar['name'];
            }
        }

        $field['choices'] = $sidebars;
        return $field;
    }
}

new mthemes_theme_noizu();


// THEME FUNCTIONS

function mthemes_regions($args = array()){
    global $mthemes_acf_active;

    $args = (is_array($args))? $args : array();

    if($mthemes_acf_active  and have_rows('layout_elements')){
        while ( have_rows('layout_elements') ){
            the_row();
            
            if((!empty($args['before_region'])) and is_string($args['before_region'])){
                echo balanceTags($args['before_region']);
            }

            switch(get_row_layout()){
                case 'contact_form':
                    get_template_part('mthemes', 'contact-form');
                    break;

                case 'content':
                    get_template_part('mthemes', 'content');
                    break;

                case 'events_list':
                    get_template_part('mthemes', 'events-list');
                    break;

                case 'grid_boxes':
                    get_template_part('mthemes', 'grid-boxes');
                    break;

                case 'image':
                    get_template_part('mthemes', 'image');
                    break;

                case 'map':
                    get_template_part('mthemes', 'map');
                    break;

                case 'profiles':
                    get_template_part('mthemes', 'profiles');
                    break;

                case 'images_slider':
                    get_template_part('mthemes', 'slider');
                    break;

                case 'tracklist_soundcloud':
                    get_template_part('mthemes', 'tracklist-soundcloud');
                    break;

                case 'tracklist':
                    get_template_part('mthemes', 'tracklist');
                    break;

                case 'video':
                    get_template_part('mthemes', 'video');
                    break;
            }

            if((!empty($args['after_region'])) and is_string($args['after_region'])){
                echo balanceTags($args['after_region']);
            }
        }
    }
}


// FUNCTIONS

function mthemes_get_field( $args ){
    if( !is_array($args) ){
        return null;
    }

    if( empty($args['field']) or !is_string($args['field']) ){
        return null;
    }

    // vars

    $field      = $args['field'];
    $post_id    = (!empty($args['post_id']))? $args['post_id'] : null;
    $default    = (isset($args['default']))? $args['default'] : null;
    $is         = (!empty($args['is']) and is_string($args['is']) and $args['is'] !== '')? trim(strtolower($args['is'])) : null;
    $is_sub     = (!empty($args['is_sub']) and is_bool($args['is_sub']))? $args['is_sub'] : null;

    // get value

    if(function_exists('get_sub_field') and function_exists('get_field')){
        $value  = ($is_sub)? get_sub_field($field) : get_field($field, $post_id);
    }
    else {
        $value  = $default;
    }

    // is

    if( $is ){
        switch( $is ){
            case 'string':
                $value = (is_string($value) and $value !== '')? $value : $default;
                break;

            case 'bool':
                $value = (is_bool($value))? $value : $default;
                break;

            case 'array':
                $value = (is_array($value) and !empty($value))? $value : $default;
                break;

            case 'color':
                if(is_string($value)){
                    if(!preg_match("/#([a-fA-F0-9]){3}(([a-fA-F0-9]){3})?\b/", $value)){
                        $value = $default;
                    }
                }
                else {
                    $value = $default;
                }
                break;

            case 'int':
                $value = ( is_int($value) )? $value : $default;
                break;

            case 'numeric':
                $value = ( is_numeric($value) )? $value : $default;
                break;

            case 'object':
                $value = ( is_object($value) )? $value : $default;
                break;

            case 'stdclass':
                $value = ( $value instanceof stdClass )? $value : $default;
                break;
        }
    }

    return $value;
}

function mthemes_get_l10n($str){
    global $mthemes_l10n;

    if(!is_string($str)){
        $str = '';
    }

    if(is_array($mthemes_l10n) and isset($mthemes_l10n[$str]) and is_string($mthemes_l10n[$str])){
        $str = $mthemes_l10n[$str];
    }

    return $str;
}

function mthemes_get_icon($icon_path){
    $icon = false;
    if( is_string($icon_path) ){

        // set icon path
        $icon_path = (substr(strtolower($icon_path), -4) == '.svg')? $icon_path : $icon_path . '.svg';
        $icon_path = dirname(__FILE__) . "/assets/svg/{$icon_path}";

        $remove_attributes = array(
            'id', 
            'xmlns:sketch', 
            'sketch:type'
        );

        $remove_tags       = array('description', 'title', 'desc', 'metadata');

        if( is_file($icon_path) ){
            // load svg file
            $icon = file_get_contents($icon_path);
            // remove newlines
            $icon = str_replace("\n", "", $icon);
            // remove spaces between tags
            $icon = preg_replace('/\>\s+\</', '><', $icon);
            // remove hidden chars
            $icon = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $icon);
            // remove xml header
            $icon = preg_replace("/\<\?xml(.+?)\?\>/i", "", $icon);
            // remoe doctype
            $icon = preg_replace("/\<\!DOCTYPE(.+?)\>/i", "", $icon);
            // remove comments
            $icon = preg_replace("/\<\!\-\-(.+?)\-\-\>/i", "", $icon);
            // remove tags
            foreach($remove_tags as $remove_tag){
                $icon = preg_replace("/\<$remove_tag\>(.*?)\<\/$remove_tag\>/i" , "", $icon);
            }
            // remove attributes
            foreach($remove_attributes as $remove_attribute){
                $icon = preg_replace("/ $remove_attribute=\"(.+?)\"/i" , "", $icon);
            }
        }
    }

    return $icon;
}

function mthemes_load_svg( $path = null, $data = null ){
    $data = is_array($data)? $data : array();
    $path = is_string($path)? $path : dirname(__FILE__).'/assets/svg';
    $dir  = new DirectoryIterator($path);

    foreach ($dir as $fileinfo) {
        if($fileinfo->isDir() and !$fileinfo->isDot()){
            $dirname  = $fileinfo->getFilename();
            $new_path = $path . "/{$dirname}";
            $data[$dirname] = mthemes_load_svg($new_path);
        }

        if ($fileinfo->isFile() and substr(strtolower($fileinfo->getFilename()), -3) == 'svg') {
            $key   = $fileinfo->getFilename();
            $value = str_replace(".svg", "", $key);
            $data[$key] = $value;
        }
    }

    return $data;
}

function mthemes_array_flat($data, $separator = '/', $prefix = '') {
    $separator = is_string($separator)? $separator : '/';
    $_data = array();
    foreach($data as $key => $value){
        if(is_array($value)){
            $__data = mthemes_array_flat($value, $separator, $key);
            $_data = array_merge($_data, $__data);
        }
        else {
            if(is_string($value) and is_string($prefix) and strlen($prefix) > 0 ){
                $value = "{$prefix}{$separator}{$value}";
            }

            if( is_string($prefix) and strlen($prefix) > 0 ){
                $_data["{$prefix}{$separator}{$key}"] = $value;
            }
            else {
                $_data[$key] = $value;
            }
        }
    }

    return $_data;
}

function mthemes_hex2rgb( $hex ) {
    $hex = str_replace( "#", "", $hex );

    if ( strlen( $hex ) == 3 ) {
        $r = hexdec( substr( $hex, 0, 1 ).substr( $hex, 0, 1 ) );
        $g = hexdec( substr( $hex, 1, 1 ).substr( $hex, 1, 1 ) );
        $b = hexdec( substr( $hex, 2, 1 ).substr( $hex, 2, 1 ) );
    } else {
        $r = hexdec( substr( $hex, 0, 2 ) );
        $g = hexdec( substr( $hex, 2, 2 ) );
        $b = hexdec( substr( $hex, 4, 2 ) );
    }
    $rgb = array( $r, $g, $b );
    // return implode(",", $rgb); // returns the rgb values separated by commas
    return $rgb; // returns an array with the rgb values
}