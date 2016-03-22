<?php 
/*
Template Name: Page Three
*/

$column_left_title      = mthemes_get_field(array('field' => 'column_left_title', 'is' => 'string'));
$column_right_title     = mthemes_get_field(array('field' => 'column_right_title', 'is' => 'string'));
$column_left_content    = mthemes_get_field(array('field' => 'column_left_content', 'is' => 'string'));
$column_right_content   = mthemes_get_field(array('field' => 'column_right_content', 'is' => 'string'));
$page_icons_bar_color   = mthemes_get_field(array('field' => 'page_icons_bar_color', 'is' => 'string', 'default' => 'light'));
$page_classes           = array('region', 'region-icons-bar-fill', 'region-page');
$page_featured_image    = mthemes_get_field(array('field' => 'page_featured_image', 'is' => 'bool', 'default' => true));

if($page_icons_bar_color == 'light'){
    $page_classes[] = 'region-dark-background';
}

get_header();
if(have_posts()): the_post();

get_template_part('mthemes', 'background');
?>
<div id="region-page-three" class="<?php echo esc_attr(implode(' ', $page_classes)) ?>" data-deliverance-region="page-three">
    <div id="page-<?php the_id() ?>" <?php post_class() ?>>
        <div id="page-left" class="hidden" data-deliverance-element="left">
            <div class="page-content">
                <div class="page-content-in">
                    <?php if($column_left_title): ?><h2><?php echo esc_html($column_left_title) ?></h2><?php endif ?>
                    <div class="region-content">
                        <div class="column column-12">
                            <div class="column-content">
                                <?php if(has_post_thumbnail() and $page_featured_image): ?>
                                <div class="region-image" data-deliverance-region="image">
                                    <?php the_post_thumbnail("large", array("class" => "image-preload")); ?>
                                </div>
                                <?php endif ?>
                                <?php echo balanceTags($column_left_content) ?>
                            </div>
                        </div>
                    </div>
                    <div class="content-spacer">&nbsp;</div>
                </div>
            </div>
        </div>
        <div id="page-right" class="hidden" data-deliverance-element="right">
            <div class="page-content">
                <div class="page-content-in">
                    <?php if($column_right_title): ?><h2><?php echo esc_html($column_right_title) ?></h2><?php endif ?>
                    <div class="region-content">
                        <div class="column column-12">
                            <div class="column-content">
                                <?php echo balanceTags($column_right_content) ?>
                            </div>
                        </div>
                    </div>
                    <div class="content-spacer">&nbsp;</div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php
endif;
get_footer();