<?php 
/*
Template Name: Page Four
*/

$layout_elements        = mthemes_get_field(array('field' => 'layout_elements', 'is' => 'array'));
$page_position          = mthemes_get_field(array('field' => 'page_position', 'is' => 'string', 'default' => 'center'));
$page_classes           = array('region', 'region-page', 'page-' . $page_position);
$page_icons_bar_color   = mthemes_get_field(array('field' => 'page_icons_bar_color', 'is' => 'string', 'default' => 'light'));
$page_featured_image    = mthemes_get_field(array('field' => 'page_featured_image', 'is' => 'bool', 'default' => true));

if($page_icons_bar_color == 'light'){
    $page_classes[] = 'region-dark-background';
}

get_header();
if(have_posts()): the_post();

get_template_part('mthemes', 'background');
?>
<div id="region-page-four" class="<?php echo esc_attr(implode(' ', $page_classes)) ?>" data-deliverance-region="page-four">
    <div id="page-<?php the_id() ?>" <?php post_class() ?>>
        <?php get_template_part('mthemes', 'page-title') ?>
        <?php if(has_post_thumbnail() and $page_featured_image): ?>
        <div class="page-box hidden">
            <div class="region-image" data-deliverance-region="image">
                <?php the_post_thumbnail("large", array("class" => "image-preload")); ?>
            </div>
        </div>
        <?php endif ?>
        
        <!-- page block -->
        <?php if(get_the_content() !== ''): ?>
        <div class="page-box hidden">
            <div class="region-content">
                <div class="column column-12">
                    <div class="column-content">
                        <?php the_content(); ?>
                    </div>
                </div>
            </div>
        </div>
        <?php endif ?>

        <?php mthemes_regions(array('before_region' => '<div class="page-box hidden">', 'after_region' => '</div>')); ?>
        
    </div>
</div>
<?php
endif;
get_footer();