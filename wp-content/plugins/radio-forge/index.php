<?php

/*
Plugin Name: Radio Forge Free
Plugin URI: http://www.radioforge.com/
Description: RadioForge Players enable native audio playback within the browser. It supports all browsers i.e. iOS, Android, Firefox, Chrome, Safari, IE and Opera.
Version: 1.6
Date: 2014, Aug, 19
Author: Radio Forge
Author URI: http://www.radioforge.com
License: GPLv2
*/

/*
Author: Radio Forge
Website: http://www.radioforge.com
Copyright 2014 radioforge.com, India All Rights Reserved.

*/


//Database table versions
global $radioforge_db_table_version;
$radioforge_db_table_version = "1.0.4";

//Create database tables
function radioforge_db_create () {
    radioforge_create_table_radio();
}


function radioforge_create_table_radio(){
    //Get the table name with the WP database prefix
    global $wpdb;
    $table_name_radio = $wpdb->prefix . "radioforge_radio";
	
    global $radioforge_db_table_version;
    $installed_ver = get_option( "radioforge_db_table_version" );
     
	//Check if the table already exists and if the table is up to date, if not create it
    if($wpdb->get_var("SHOW TABLES LIKE '$table_name_radio'") != $table_name_radio ||  $installed_ver != $radioforge_db_table_version ) {
        $sql = "CREATE TABLE " . $table_name_radio . " (
					`id` int(11) NOT NULL AUTO_INCREMENT,
					`params` text,
					`adddate` datetime NOT NULL,
					PRIMARY KEY (`id`)	
				);";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
		}
		
		
	
		
    //Add database table versions to options
    add_option("radioforge_db_table_version", $radioforge_db_table_version);
}

register_activation_hook( __FILE__, 'radioforge_db_create' );


add_action( 'admin_menu', 'radioforge_plugin_menu' );


function radioforge_plugin_menu() {
	add_menu_page( 'RadioForge', 'Radio Forge', 'manage_options', 'radioforge_radio', 'wp_radioforge_radio',plugin_dir_url( __FILE__ )."/html5mp3.png" );
	add_submenu_page('radioforge_radio','','','manage_options','radioforge-options','wp_radioforge_options');
	add_submenu_page('radioforge_radio', 'Manage Radio', 'Manage Radio', 'manage_options', 'radioforge_radio', 'wp_radioforge_radio' );
	add_submenu_page('radioforge_radio', 'Add Radio', 'Add Radio', 'manage_options', 'radioforge_add_radio', 'wp_add_radioforge_radio' );
	add_submenu_page('radioforge_radio','Help','Help','manage_options','radioforge_help','wp_radioforge_help');
	
}


add_action( 'admin_init', 'register_radioforgesettings' );

function register_radioforgesettings() {
	/*register_setting( 'baw-settings-group', 'buy_text' );
	register_setting( 'baw-settings-group', 'color' );
	register_setting( 'baw-settings-group', 'showlist' );
	register_setting( 'baw-settings-group', 'showbuy' );
	register_setting( 'baw-settings-group', 'radioforge_description' );
	register_setting( 'baw-settings-group', 'currency' );
	register_setting( 'baw-settings-group', 'tracks' );
	register_setting( 'baw-settings-group', 'tcolor' );*/
}



function wp_radioforge_help() {

include 'html5/help.php';

}

function wp_radioforge_options() {

 global $wpdb;
	$table		=	$wpdb->prefix.'radioforge_radio';

//include 'radio/settings.php';
include 'html5/formplus.php';

}



function wp_radioforge_radio(){
		
include('html5/radio.php');
		
}


function wp_add_radioforge_radio(){
		
include('html5/addradio.php');
		
}


function radioforge1($content){
	
	
    global $wpdb;
	$table		=	$wpdb->prefix.'radioforge_radio';	
	  
	$pluginurl	=	plugin_dir_url( __FILE__ );

    //$regex = '/\[radioforge (.*?)]/i';
	
	$regex = '/\[radioforge(\s+id=([0-9]+))?(\s+type=([a-z]+))?\s*}(.*)\]/i';
    preg_match_all( $regex, $content, $matches );
	//echo "<pre>";
	//print_r($matches);

    //include('html5/radio.php');

    $radio_div	=	'<div id="myradio">'.$content.'</div>';
    return $radio_div;

}


function wp_radioforge( $atts, $content = null ) {

    global $wpdb;
	$table		=	$wpdb->prefix.'radioforge_radio';	
	  
	$pluginurl	=	plugin_dir_url( __FILE__ );

   extract( shortcode_atts( array(
		'id' => '1',
		'title' => '',
		'welcome' => '',
		'url' => '',
		'introurl' => '',
		'bgcolor' => '343434',
		'wmode' => '',
		'skin' => '',
		'width' => '600',
		'height' => '250',
		'autoplay' => 'false',
		'jsevents'  => 'false',
		'buffering' => '5',
		'lang' => 'en',
		'codec' => 'mp3',
		'volume' => '50',
	), $atts ) );

	
	
	/* Actual radio code */
	
    //$rss_radio = "RSS here....";
	
	 
	
	include('html5/widget.php');
	
	
	
	/* Actual radio code */

    return '<span>' . $rss_radio . '</span>';
}


add_shortcode('radioforge','wp_radioforge');

//add_filter('the_content','wp_radioforge');

$plugin = plugin_basename(__FILE__);

add_filter("plugin_action_links_{$plugin}", 'upgrade_to_pro');


function upgrade_to_pro($links) { 

	if (function_exists('is_plugin_active') && !is_plugin_active('radioforge-pro/radioforge-pro.php')) {

		$links[] = '<a href="http://www.radioforge.com/" target="_blank">' . __("Go Pro", "metaslider") . '</a>'; 

	}

	return $links; 

}

wp_register_script('radioforgejs', 'http://hosted.musesradioplayer.com/mrp.js', false, '1.6', false );
//wp_register_script('radioforge1');

wp_enqueue_script( 'radioforgejs' );

?>