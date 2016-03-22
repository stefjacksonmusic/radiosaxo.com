<?php 
/*
Template Name: Page Collection
*/

$collection_pages       = mthemes_get_field(array('field' => 'collection_pages', 'is' => 'array'));
$collection_pages_tags  = array();
$collection_filters_ids = array();
$collection_filters     = array();

// populate $collection_pages_tags

foreach($collection_pages as $_page){
    $page_tags = get_the_terms($_page->ID, 'post_tag');
    $collection_pages_tags[$_page->ID] = $page_tags;
}

// populate $collection_filters

foreach($collection_pages_tags as $_page_tags){
    if(is_array($_page_tags)){
        foreach($_page_tags as $_tag){
            if(!in_array($_tag->term_id, $collection_filters_ids)){
                $collection_filters_ids[]   = $_tag->term_id;
                $collection_filters[$_tag->term_id] = $_tag->name;
            }
        }
    }
}

asort($collection_filters);

get_header();

if(have_posts()): the_post();
get_template_part('mthemes', 'background');

if(is_array($collection_pages)):
?>
<div id="region-collection" class="region region-dark-background" data-deliverance-region="collection">
    <?php get_template_part('mthemes', 'page-title') ?>
    
    <!-- filters -->
    <?php if(!empty($collection_filters)): ?>
    <ul id="filters" data-deliverance-element="filters-container">
        <li class="active hidden" data-filter="*"><?php echo ucfirst(mthemes_get_l10n('all')); ?></li>
        <?php foreach($collection_filters as $id => $collection_filter): ?>
        <li class="hidden" data-filter="filter-<?php echo esc_attr($id) ?>"><?php echo esc_html($collection_filter) ?></li>
        <?php endforeach ?>
    </ul>
    <?php endif ?>
    
    <!-- container -->
    <ul id="collection" data-deliverance-element="container">
        <?php 
        foreach($collection_pages as $collection_page):
        $thumbnail_id   = get_post_thumbnail_id($collection_page->ID);
        $thumbnail      = ($thumbnail_id)? wp_get_attachment_image_src($thumbnail_id, 'image-collection', true) : false;
        $filters        = array();
        if(is_array($collection_pages_tags[$collection_page->ID])){
            foreach($collection_pages_tags[$collection_page->ID] as $_page_tag){
                $filters[] = 'filter-' . $_page_tag->term_id;
            }
        }
        ?>
        <li class="<?php echo esc_attr(implode(' ', $filters)) ?>">
            <div class="item-content hidden">
                <?php if(is_array($thumbnail)): ?>
                <div class="item-image">
                    <img src="<?php echo esc_attr($thumbnail[0]) ?>" width="<?php echo esc_attr($thumbnail[1] / 2) ?>" height="<?php echo esc_attr($thumbnail[2] / 2) ?>" alt="">
                </div>
                <?php endif ?>
                <div class="item-description">
                    <h5><?php echo esc_html($collection_page->post_title) ?></h5>
                    <a href="<?php echo esc_attr(get_permalink($collection_page->ID)) ?>" class="border-button"><?php echo mthemes_get_l10n('read more') ?></a>
                </div>
            </div>
        </li>
        <?php endforeach; ?>
    </ul>
</div>
<?php
endif;
endif;

get_footer();