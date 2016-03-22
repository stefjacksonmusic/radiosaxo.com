<?php 
/*
Template Name: Video
*/

$video_url              = mthemes_get_field(array('field' => 'video_url', 'is' => 'string'));
$title                  = mthemes_get_field(array('field' => 'video_custom_title', 'is' => 'string', 'default' => get_the_title()));
$video_sidebar_title    = mthemes_get_field(array('field' => 'video_sidebar_titlte', 'is' => 'string'));
$video_sidebar_content  = mthemes_get_field(array('field' => 'video_sidebar_content', 'is' => 'string'));


get_header();
if(have_posts()): the_post();

get_template_part('mthemes', 'background');

if(!empty($video_url)):
?>
<div id="region-full-video" class="region region-full-screen region-dark-background" data-deliverance-region="full-video">
    <div id="full-screen-content" class="hidden" data-deliverance-element="wrapper">
        <!-- video info box -->
        <div id="video-info-sidebar" class="hidden" data-deliverance-element="sidebar">
            <?php if($video_sidebar_title): ?><h5><?php echo esc_html($video_sidebar_title) ?></h5><?php endif ?>
            <?php echo balanceTags($video_sidebar_content) ?>
        </div>
        <!-- video title -->
        <h5 id="video-title" class="hidden" data-deliverance-element="title"><?php echo esc_html($title) ?></h5>
        <!-- video -->
        <div id="video-container" data-deliverance-element="container">
            <div id="video-content" class="hidden" data-deliverance-element="content"><?php echo balanceTags($video_url) ?></div>
        </div>
        <!-- info icon -->
        <div id="video-info-icon-container" class="hidden" data-deliverance-element="info-container">
            <span id="video-info-icon" class="ico-button" data-deliverance-element="info">
                <svg width="30px" height="30px" viewBox="0 0 30 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <rect x="14" y="6" width="2" height="2"></rect>
                        <rect x="14" y="11" width="2" height="13"></rect>
                        <rect id="video-info-icon-border" stroke-width="2" x="0" y="0" width="30" height="30"></rect>
                    </g>
                </svg>
            </span>
        </div>
    </div>
</div>
<?php
endif;
endif;
get_footer();