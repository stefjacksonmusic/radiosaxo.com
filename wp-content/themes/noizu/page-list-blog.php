<?php 
/*
Template Name: List Blog
*/

global $posts_query;

$posts_list_position        = mthemes_get_field(array('field' => 'posts_list_position', 'is' => 'string', 'default' => 'center'));
$posts_list_display_sidebar = mthemes_get_field(array('field' => 'posts_list_display_sidebar', 'is' => 'bool'));
$posts_list_sidebar         = false;

if(is_page()){
    get_template_part('mthemes', 'posts-query');
}

if(is_null($posts_query)){
    $posts_query = $wp_query;
}

$next_page_url  = explode('"', get_next_posts_link());
$next_page_url  = (is_array($next_page_url) and !empty($next_page_url[1]))? $next_page_url[1] : false;

$region_classes = array(
    'region',
    'region-dark-background',
    'region-page',
    'blog-list-' . $posts_list_position
);

if($posts_list_display_sidebar){
    $region_classes[] = 'blog-list-sidebar';

    $posts_list_sidebar = mthemes_get_field(array('field' => 'posts_list_sidebar', 'is' => 'string', 'default' => 'sidebar-1'));
}

get_header();
get_template_part('mthemes', 'background');
?>
<div id="region-blog-list" class="<?php echo esc_attr(implode(' ', $region_classes)) ?>" data-deliverance-region="blog-list">
    <div class="blog-list-container">
        <?php 

        if(!is_home()){
            get_template_part('mthemes', 'page-title');
        }

        if($posts_list_display_sidebar and is_string($posts_list_sidebar)): ?>
        <!-- sidebar -->
        <aside data-deliverance-element="sidebar" class="hidden">
            <?php dynamic_sidebar($posts_list_sidebar) ?>
        </aside>
        <?php
        endif;

        if($posts_query->have_posts()):
            while($posts_query->have_posts()): 
                $posts_query->the_post();

                $post_classes = get_post_class();
                $post_format  = get_post_format();

                if(is_sticky()){
                    $post_classes[] = 'sticky';
                }

                switch ($post_format) {
                    case 'link':
                        $post_classes[] = 'post-link';
                        $post_classes[] = 'hidden';
                        ?>
                        <!-- post link -->
                        <div class="<?php echo esc_attr(implode(' ', $post_classes)) ?>">
                            <h6><?php the_time( get_option('date_format') ) ?></h6>
                            <h3><?php the_title() ?></h3>
                            <?php the_content(false) ?>
                        </div>
                        <?php
                        break;

                    case 'quote':
                        $post_classes[] = 'post-quote';
                        $post_classes[] = 'hidden';
                        ?>
                        <!-- post quote -->
                        <div class="<?php echo esc_attr(implode(' ', $post_classes)) ?>">
                            <div class="post-content">
                                <h6><?php the_time( get_option('date_format') ) ?></h6>
                                <blockquote><?php the_content(false) ?></blockquote>
                            </div>
                        </div>
                        <?php
                        break;

                    case 'status':
                        $post_classes[] = 'post-status';
                        $post_classes[] = 'hidden';
                        ?>
                        <!-- post status -->
                        <div class="<?php echo esc_attr(implode(' ', $post_classes)) ?>">
                            <div class="post-content">
                                <h6><?php the_time( get_option('date_format') ) ?></h6>
                                <h3><?php the_title() ?></h3>
                                <?php the_content(false) ?>
                            </div>
                        </div>
                        <?php
                        break;

                    case 'video':
                        $post_classes[] = 'post-video';
                        $post_classes[] = 'hidden';
                        ?>
                        <div class="<?php echo esc_attr(implode(' ', $post_classes)) ?>">
                            <div class="post-content">
                                <?php the_content(false) ?>
                                <h6><?php the_time( get_option('date_format') ) ?></h6>
                                <h3><?php the_title() ?></h3>
                            </div>
                        </div>
                        <?php
                        break;
                    
                    default:
                        $post_classes[] = 'hidden';
                        if(has_post_thumbnail()){
                            $post_classes[] = 'post-image';
                        }
                        ?>
                        <div class="<?php echo esc_attr(implode(' ', $post_classes)) ?>">
                            <?php if(has_post_thumbnail() and $post_format !== 'video'): ?>
                            <div class="post-featured-image">
                                <?php the_post_thumbnail('large'); ?>
                            </div>
                            <?php endif ?>
                            <div class="post-content">
                                <h6><?php the_time( get_option('date_format') ) ?></h6>
                                <h3>
                                    <?php if($post_format !== 'image'): ?><a href="<?php the_permalink() ?>"><?php endif ?>
                                        <?php the_title() ?>
                                    <?php if($post_format !== 'image'): ?></a><?php endif ?>
                                </h3>
                                <?php if(!$post_format): ?>
                                <?php the_content(false) ?>
                                <a href="<?php the_permalink() ?>" class="border-button"><?php echo mthemes_get_l10n('read more') ?></a>
                                <?php endif ?>
                            </div>
                        </div>
                        <?php 
                        break;
                }
            endwhile ?>
            <!-- load-more -->
            <?php if($next_page_url): ?>
            <div id="load-more-url" data-deliverance-element="load-more-url" class="hide" data-url="<?php echo esc_attr($next_page_url) ?>">
                <div class="hide"><?php wp_link_pages() ?></div>
            </div>
            <div id="load-more" data-deliverance-element="load-more" class="post hidden"><?php echo mthemes_get_l10n('load more'); ?></div>
            <?php endif;
        endif; ?>
    </div>
</div>
<?php
get_footer();