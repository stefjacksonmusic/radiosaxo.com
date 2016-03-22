<?php 
/*
Template Name: Grid Blog
*/

global $posts_query;

get_template_part('mthemes', 'posts-query');

$next_page_url  = explode('"', get_next_posts_link('', $posts_query->max_num_pages));
$next_page_url  = (is_array($next_page_url) and !empty($next_page_url[1]))? $next_page_url[1] : false;

get_header();
get_template_part('mthemes', 'background');
?>
<div id="region-blog" class="region region-dark-background region-page" data-deliverance-region="blog">
    <?php get_template_part('mthemes', 'page-title') ?>
    <!-- blog list -->
    <ul id="blog-container" data-deliverance-element="container" data-gutter="21">
        <?php 
        if($posts_query->have_posts()):
            $date_format = get_option('date_format');

            while($posts_query->have_posts()):
                $posts_query->the_post();

                $post_format                = get_post_format();
                $post_classes               = get_post_class();
                $post_classes[]             = 'hidden';
                $post_image                 = false;
                $post_video                 = false;
                $post_meta                  = false;
                $post_list_box_classes      = array('post-list-box');
                $post_button                = false;
                $post_image_link            = false;
                $post_list_image_classes    = array('posts-list-image');
                $post_featured_original     = false;
                $post_content               = true;

                if(is_sticky()){
                    $post_classes[]         = 'sticky';
                }
                
                switch($post_format){
                    case 'quote':
                        $post_content               = false;
                        $post_classes[]             = 'post-quote';
                        break;

                    case 'link':
                        $post_content               = false;
                        $post_classes[]             = 'post-link';
                        break;

                    case 'image':
                        $post_classes[]             = 'post-image';
                        $post_featured_original     = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'original');
                        break;

                    case 'video':
                        $post_video                 = true;
                        $post_classes[]             = 'post-video';
                        $post_list_box_classes[]    = 'post-list-box-video';
                        break;

                    case 'status':
                        $post_classes[]             = 'post-status';
                        break;

                    default:
                        $post_image                 = true;
                        $post_image_link            = true;
                        $post_meta                  = true;
                        $post_button                = true;
                        if(has_post_thumbnail()){
                            $post_list_box_classes[] = 'post-list-box-image';
                        }
                        break;
                }
                ?>
                <li class="<?php echo esc_attr(implode(" ", $post_classes)) ?>">
                    
                    <?php if($post_video): ?>
                    <div class="posts-list-video">
                        <?php the_content() ?>
                    </div>
                    <?php endif ?>

                    <?php if($post_format == 'quote'): ?>
                    <div class="post-list-box">
                        <blockquote><?php the_content() ?></blockquote>
                    </div>
                    <?php endif ?>

                    <?php if($post_format == 'link'): ?>
                    <div class="post-list-box">
                        <h5><?php the_content() ?></h5>
                    </div>
                    <?php endif ?>

                    <?php if($post_format == 'image' and is_array($post_featured_original)): ?>
                    <div class="posts-list-image image-lightbox" data-src="<?php echo esc_attr($post_featured_original[0]) ?>" data-width="<?php echo esc_attr($post_featured_original[1]) ?>" data-height="<?php echo esc_attr($post_featured_original[2]) ?>">
                        <?php the_post_thumbnail('medium', array('class' => 'image-preload')) ?>
                    </div>
                    <?php endif ?>

                    <?php if($post_image and has_post_thumbnail()): ?>
                    <?php if($post_image_link): ?><a href="<?php the_permalink() ?>"><?php endif ?>
                        <div class="posts-list-image">
                            <?php the_post_thumbnail('medium', array('class' => 'image-preload')) ?>
                        </div>
                    <?php if($post_image_link): ?></a><?php endif ?>
                    <?php endif ?>
                    
                    <?php if($post_content): ?>
                    <div class="<?php echo esc_attr(implode(' ', $post_list_box_classes)) ?>">
                        <h5><?php the_title() ?></h5>
                        
                        <?php if($post_format == 'status'): ?>
                        <div class="posts-list-content"><?php the_content() ?></div>
                        <?php endif ?>
                        
                        <?php if($post_meta): ?>
                        <div class="posts-list-meta">
                            <span><?php the_time($date_format) ?> </span> • 3 Comments
                        </div>
                        <?php endif ?>
                        <?php if($post_button): ?><a class="border-button" href="<?php the_permalink() ?>"><?php echo mthemes_get_l10n('read more') ?></a><?php endif ?>
                    </div>
                    <?php endif ?>
                </li>                
                <?php 
            endwhile;
        else: 
            // NO POSTS
        endif;
        ?>
        <!-- load more -->
        <?php if($next_page_url): ?>
        <li id="load-more-url" data-deliverance-element="load-more-url" class="hide" data-url="<?php echo esc_attr($next_page_url) ?>">
            <div class="hide"><?php wp_link_pages() ?></div>
        </li>

        <li class="post hidden post-load-more" data-deliverance-element="load-more">
            <div class="post-load-more-content">
                <?php echo mthemes_get_l10n('load more') ?>
            </div>
        </li>
        <?php endif ?>
    </ul>
    <!-- pagination -->
</div>
<?php
get_footer();