<?php 
/*
Template Name: Page Two
*/

$page_classes           = array('region', 'region-icons-bar-fill', 'region-page');
$page_icons_bar_color   = mthemes_get_field(array('field' => 'page_icons_bar_color', 'is' => 'string', 'default' => 'light'));
$page_featured_image    = mthemes_get_field(array('field' => 'page_featured_image', 'is' => 'bool', 'default' => true));
$page_sidebar           = mthemes_get_field(array('field' => 'page_sidebar', 'is' => 'string', 'default' => 'sidebar-1'));

if($page_icons_bar_color == 'light'){
    $page_classes[] = 'region-dark-background';
}

get_header();
if(have_posts()): the_post();

get_template_part('mthemes', 'background');
?>
<article id="region-page-two" class="<?php echo esc_attr(implode(' ', $page_classes)) ?>" data-deliverance-region="page-two">
    <div id="page-<?php the_id() ?>" <?php post_class() ?>>
        <!-- page-sidebar -->
        <div id="page-sidebar" class="hidden" data-deliverance-element="sidebar">
            <div class="widget">
                <?php get_template_part('mthemes', 'share-on') ?>
            </div>
            <?php dynamic_sidebar($page_sidebar) ?>
        </div>
        <!-- page-content -->
        <div id="page-content" class="hidden" data-deliverance-element="content">
            <div class="in">
                <!-- page title + feature image -->
                <h1><?php the_title(); ?></h1>
                <?php if(has_post_thumbnail() and $page_featured_image): ?>
                <div class="region-image" data-deliverance-region="image">
                    <?php the_post_thumbnail("full", array("class" => "image-preload image-lightbox")); ?>
                </div>
                <?php endif ?>
                <!-- page content -->
                <div id="page-content-area">
                    <?php the_content() ?>
                </div>
                <!-- page regions -->
                <div id="page-regions">
                    <?php mthemes_regions(); ?>
                </div>
            </div>
        </div>
    </div>
</article>
<?php
endif;
get_footer();