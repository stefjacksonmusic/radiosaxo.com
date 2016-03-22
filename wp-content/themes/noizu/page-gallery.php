<?php 
/*
Template Name: Gallery
*/

get_header();
if(have_posts()): the_post();

$images = mthemes_get_field(array('field' => 'images', 'is' => 'array'));

get_template_part('mthemes', 'background');

if(!empty($images)):
?>
<div id="region-gallery" class="region region-dark-background region-page" data-deliverance-region="gallery">
    <?php get_template_part('mthemes', 'page-title') ?>
    <!-- page container -->
    <ul id="gallery-container" data-deliverance-element="container" data-gutter="14">
        <?php foreach($images as $image): ?>
        <li class="image-lightbox" data-src="<?php echo esc_attr($image['url']) ?>" data-width="<?php echo esc_attr($image['width']) ?>" data-height="<?php echo esc_attr($image['height']) ?>">
            <img width="<?php echo esc_attr($image['sizes']['image-gallery-width'] / 2) ?>" height="<?php echo esc_attr($image['sizes']['image-gallery-height'] / 2) ?>" class="hidden" src="<?php echo esc_attr($image['sizes']['image-gallery']) ?>" alt=""><span></span>
        </li>
        <?php endforeach ?>
    </ul>
</div>
<?php
endif;
endif;
get_footer();