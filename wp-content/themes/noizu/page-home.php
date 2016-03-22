<?php 
/*
Template Name: Home Page
*/

$home_claim_position        = mthemes_get_field(array('field' => 'home_claim_position', 'is' => 'string', 'default' => 'center'));
$home_claim_classes         = array('hidden');
$home_feature               = mthemes_get_field(array('field' => 'home_feature', 'is' => 'string'));
$home_posts_list_position   = mthemes_get_field(array('field' => 'home_posts_list_position', 'is' => 'string', 'default' => 'bottom right'));
$home_claim_line_one        = mthemes_get_field(array('field' => 'home_claim_line_one', 'is' => 'string'));
$home_claim_line_two        = mthemes_get_field(array('field' => 'home_claim_line_two', 'is' => 'string'));
$home_claim_line_three      = mthemes_get_field(array('field' => 'home_claim_line_three', 'is' => 'string'));
$home_button_text           = mthemes_get_field(array('field' => 'home_button_text', 'is' => 'string', 'default' => mthemes_get_l10n('details')));
$home_button_destination    = mthemes_get_field(array('field' => 'home_button_destination', 'is' => 'array'));
$home_button_custom_url     = mthemes_get_field(array('field' => 'home_button_custom_url', 'is' => 'string'));
$home_button_url            = true;
$home_posts_limit           = false;
$home_posts_query           = false;
$home_boxes                 = false;

$region_classes = array(
    'region',
    'region-full-screen',
    'region-dark-background'
);

switch($home_claim_position){
    case 'top left':
        $home_claim_classes[] = 'claim-top-left';
        break;

    case 'top right':
        $home_claim_classes[] = 'claim-top-right';
        break;

    case 'bottom left':
        $home_claim_classes[] = 'claim-bottom-left';
        break;

    case 'bottom right':
        $home_claim_classes[] = 'claim-bottom-right';
        break;

    default:
        $home_claim_classes[] = 'claim-center';
        break;
}

if($home_button_custom_url){
    $home_button_url = $home_button_custom_url;
}
elseif(is_array($home_button_destination) and !empty($home_button_destination[0])){
    $home_button_url = get_permalink($home_button_destination[0]);
}

// HOME POSTS

if($home_feature == 'latest posts'){
    $home_posts_limit       = (int) mthemes_get_field(array('field' => 'home_posts_limit', 'is' => 'numeric', 'default' => 3));
    $home_posts_category    = mthemes_get_field(array('field' => 'home_posts_category', 'is' => 'array'));
    $home_query_args        = array(
        'post_type'         => 'post',
        'posts_per_page'    => $home_posts_limit,
        'tax_query' => array(
            array(                
                'taxonomy'  => 'post_format',
                'field'     => 'slug',
                'terms'     => array( 
                    'post-format-aside',
                    'post-format-audio',
                    'post-format-chat',
                    'post-format-gallery',
                    'post-format-image',
                    'post-format-link',
                    'post-format-quote',
                    'post-format-status',
                    'post-format-video'
                ),
                'operator' => 'NOT IN'
            )
        )
    );

    if(is_array($home_posts_category)){
        $home_query_args['category__in'] = $home_posts_category;
    }

    $home_posts_query = new WP_Query($home_query_args);

    switch ($home_posts_list_position) {
        case 'top left':
            $region_classes[] = 'posts-top-left';
            break;

        case 'top right':
            $region_classes[] = 'posts-top-right';
            break;

        case 'bottom right':
            $region_classes[] = 'posts-bottom-right';
            break;

        case 'bottom left':
            $region_classes[] = 'posts-bottom-left';
            break;
    }
    
}

// HOME BOXES

if($home_feature == 'boxes'){
    $region_classes[]   = 'home-boxes';
    $home_boxes         = mthemes_get_field(array('field' => 'home_boxes', 'is' => 'array'));

    // urls 

    // var_dump($home_boxes);
    // die();

    if(is_array($home_boxes)){
        foreach($home_boxes as $key => $home_box){
            $button_url = null;
            
            if(is_array($home_box['button_destination'])){
                $button_page_id = $home_box['button_destination'][0];
                $button_url     = get_permalink($button_page_id);
            }

            if(!empty($home_box['button_custom_url'])){
                $button_url     = $home_box['button_custom_url'];
            }

            $home_boxes[$key]['button_url']     = $button_url;
            $home_boxes[$key]['button_text']    = (empty($home_box['button_text']))? mthemes_get_l10n('details') : $home_box['button_text'];
        }
    }
}

get_header();
if(have_posts()): the_post();
get_template_part('mthemes', 'background');
?>
<div id="region-home" class="<?php echo esc_attr(implode(' ', $region_classes)) ?>" data-deliverance-region="home">
    <div id="full-screen-content">
        <div id="home-claim-container" class="<?php echo esc_attr(implode(' ', $home_claim_classes)) ?>" data-deliverance-element="claim">
            <div id="home-claim-content">
                <div id="claim-line" class="hidden"></div>
                <div id="home-claim-line-1" class="hidden"><?php echo esc_html($home_claim_line_one) ?></div>
                <div id="home-claim-line-2" class="hidden"><?php echo esc_html($home_claim_line_two) ?></div>
                <div id="home-claim-line-3" class="hidden"><?php echo esc_html($home_claim_line_three) ?></div>
                <?php if($home_button_url): ?>
                <a href="<?php echo esc_attr($home_button_url)?>" class="button hidden">
                    <span><?php echo esc_html($home_button_text) ?></span>
                </a>
                <?php endif ?>
            </div>
        </div>

        <?php if($home_feature == 'latest posts' and $home_posts_query and $home_posts_query->have_posts()): ?>
        <div id="home-latest-posts" class="hidden" data-deliverance-element="latest-post">
            <?php while($home_posts_query->have_posts()): $home_posts_query->the_post(); ?>
            <a href="<?php the_permalink() ?>">
                <h6 class="date"><?php the_time(get_option('date_format')) ?></h6>
                <p><?php the_title() ?></p>
            </a>
            <?php endwhile ?>
        </div>
        <?php endif ?>

        <?php if($home_feature == 'boxes' and is_array($home_boxes)): ?>
        <ul id="home-boxes-container" class="home-boxes-<?php echo count($home_boxes) ?>" data-deliverance-element="boxes-container" data-bottom="100">
            <?php foreach($home_boxes as $home_box): ?>
            <li class="hidden">
                <div class="home-boxes-content">
                    <?php if(is_array($home_box['image'])): ?><img class="image-preload" src="<?php echo esc_attr($home_box['image']['sizes']['large']) ?>" alt=""><?php endif ?>
                    <?php if($home_box['title']): ?><h5><?php echo esc_html($home_box['title']) ?></h5><?php endif ?>
                    <?php if($home_box['title']): ?><p><?php echo esc_html($home_box['short_description']) ?></p><?php endif ?>
                    <?php if($home_box['button_url']): ?>
                    <a href="<?php echo esc_url($home_box['button_url']) ?>" class="border-button"><?php echo esc_html($home_box['button_text']) ?></a>
                    <?php endif ?>
                </div>
            </li>
            <?php endforeach ?>
        </ul>
        <?php endif ?>
    </div>
</div>
<?php
endif;
get_footer();
