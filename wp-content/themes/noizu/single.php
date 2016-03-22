<?php
global $posts_lists;

$posts_lists            = mthemes_get_field(array('field' => 'related_posts', 'is' => 'array'));
$post_display_sidebar   = mthemes_get_field(array('field' => 'post_display_sidebar', 'is' => 'bool'));
$region_classes         = array('region', 'region-dark-background', 'region-post');
$post_sidebar           = false;
$post_position          = mthemes_get_field(array('field' => 'post_position', 'is' => 'string', 'default' => 'center'));

if($post_display_sidebar){
    $post_sidebar       = mthemes_get_field(array('field' => 'post_sidebar', 'is' => 'string', 'default' => 'sidebar-1'));
    $region_classes[]   = 'region-post-sidebar';
}

$region_classes[]       = 'post-' . $post_position;

get_header();
get_template_part('mthemes', 'background');
if(have_posts()): the_post();
?>
<div id="region-post" class="<?php echo esc_attr(implode(' ', $region_classes)) ?>" data-deliverance-region="post">
    <div id="post-<?php the_id() ?>" <?php post_class("post-container") ?>>
        <?php get_template_part('mthemes', 'page-title'); ?>

        <?php if($post_sidebar): ?>
        <aside class="hidden" data-deliverance-element="sidebar">
            <div class="post-aside-content">
                <?php dynamic_sidebar($post_sidebar) ?>
            </div>
        </aside>
        <?php endif ?>

        <!-- featured image -->
        <?php if(has_post_thumbnail()): ?>
        <div class="post-content hidden">
            <div class="post-featured-image">
                <?php the_post_thumbnail('large', array('class' => 'image-preload image-background-blur')); ?>
            </div>
        </div>
        <?php endif ?>
        
        <!-- post content -->
        <div class="post-content hidden">
            <div class="post-meta">
                <?php echo mthemes_get_l10n('by') . ' '; the_author(); echo ' ' . mthemes_get_l10n('on'). ' '; the_date(); ?>
                <?php  
                $tags = get_the_tags();
                if(count($tags) > 0):
                    echo '<br />';
                    the_tags('tags : ', ' ');
                endif;
                ?>
            </div>
            <?php the_content() ?>
        </div>

        <?php if(is_array($posts_lists)): ?>
        <div class="post-content hidden">
            <?php get_template_part('mthemes', 'region-posts-list') ?>
        </div>
        <?php endif; ?>

        <!-- comments -->
        <div class="post-content hidden">
            <?php comments_template( '', true ); ?>
        </div>
    </div>
</div>
<?php
endif;
get_footer();