<?php 
/*
Template Name: Page One
*/

$page_classes           = array('region', 'region-page');
$page_icons_bar_color   = mthemes_get_field(array('field' => 'page_icons_bar_color', 'is' => 'string', 'default' => 'light'));
$page_featured_image    = mthemes_get_field(array('field' => 'page_featured_image', 'is' => 'bool', 'default' => true));

if($page_icons_bar_color == 'light'){
    $page_classes[] = 'region-dark-background';
}

get_header();
if(have_posts()): the_post(); 

get_template_part('mthemes', 'background');
?>
<article id="region-page-one" class="<?php echo esc_attr(implode(' ', $page_classes)) ?>" data-deliverance-region="page-one">
    <div id="page-top">
        <?php get_template_part('mthemes', 'share-on') ?>
        <?php if(has_post_thumbnail() and $page_featured_image): ?>
        <div id="featured-image">
            <?php 
            the_post_thumbnail("large", array(
                "class" => "image-preload",
                "data-deliverance-element" => "featured"
            ));
            ?>
        </div>
        <?php endif; ?>
        <h1 class="hidden" data-deliverance-element="title"><?php the_title() ?></h1>
    </div>
    <div id="page-content" class="hidden" data-deliverance-element="content">
        <?php if(is_single()): ?>
        <!-- content -->
        <div id="page-content-meta" data-deliverance-element="meta">
            <p><?php echo mthemes_get_l10n('written by') ?> <?php the_author() ?></p>
            <p><?php the_date() ?></p>
        </div>
        <?php endif ?>
        <?php the_content() ?>
        <!-- page regions -->
        <div id="page-regions">
            <?php mthemes_regions(); ?>
        </div>
    </div>
</article>
<?php
endif;
get_footer();