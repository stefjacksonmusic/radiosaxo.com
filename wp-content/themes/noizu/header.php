<?php  
global $mthemes_is_ajax;
global $mthemes_is_dev;
global $bar_position;

$ajax_page_load         = mthemes_get_field(array('field' => 'ajax_page_load', 'post_id' => 'options', 'is' => 'bool'));
$ajax_page_load         = ($ajax_page_load)? '1' : '0';
$bar_position           = mthemes_get_field(array('field' => 'bar_position', 'post_id' => 'options', 'is' => 'string', 'default' => 'bottom'));
$container_classes      = array('bar-with-logo');
$container_classes[]    = ($bar_position == 'bottom')? 'bar-bottom' : 'bar-top';
$body_classes           = array();

if($mthemes_is_dev){
    $body_classes[] = 'dev';
}

if(!$mthemes_is_ajax): ?>
<!doctype html>
<html <?php language_attributes(); ?> data-ajax-load="<?php echo esc_attr($ajax_page_load) ?>">
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><![endif]-->
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black"><?php

// wp_head

wp_head(); 

?>
</head>
<body <?php body_class($body_classes); ?>>
<div id="wrapper">
<?php get_template_part('mthemes', 'off-canvas-sidebar') ?>
<div id="container" class="<?php echo esc_attr(implode(' ', $container_classes)) ?>">
<div id="scroll"></div>
<?php get_template_part('mthemes', 'playlist') ?>
<?php if( $bar_position == 'bottom' ){ get_template_part('mthemes', 'icons-bar'); } ?>
<?php get_template_part('mthemes', 'bar'); ?>
<div id="content">
<!-- deliverance-content -->
<?php else: ?>
    <!-- deliverance-content -->
    <script>
    window.mthemesCurrentBodyClasses = '<?php body_class( $body_classes ) ?>'.slice(7, -1);
    </script>
    <?php wp_head(); ?>
<?php endif ?>