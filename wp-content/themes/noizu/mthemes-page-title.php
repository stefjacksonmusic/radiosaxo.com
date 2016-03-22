<?php  

$title          = get_the_title();
$custom_title   = mthemes_get_field(array('field' => 'custom_title', 'is' => 'string'));
$subtitle       = mthemes_get_field(array('field' => 'subtitle', 'is' => 'string'));
$icon           = mthemes_get_field(array('field' => 'title_icon', 'is' => 'string'));

if($custom_title){
    $title = $custom_title;
}

?>
<!-- page title -->
<div class="page-title hidden" data-deliverance-element="title">
    <div class="page-title-content">
        <?php if($subtitle): ?>
        <h6>
            <?php if($icon){ echo mthemes_get_icon($icon); } ?>
            <?php echo esc_html($subtitle) ?>
        </h6>
        <?php endif ?>
        <h2>
            <?php  
            if(is_archive()){
                if( is_category() ){ echo single_cat_title( '', false ); }; 
                if( is_tag() ){ echo single_tag_title( '', false ); };
                if( is_author() ){ echo get_the_author(); };
                if( is_date() ){ 
                    if( is_day() ){
                        echo get_the_date();
                    }
                    if( is_month() ){
                        echo get_the_date('F Y');
                    }
                    if( is_year() ){
                        echo get_the_date('Y');
                    }
                }
            } else {
                if( is_search() ){ 
                    echo esc_html(mthemes_get_l10n('search results'));
                } else {
                    echo esc_html($title);
                }
            }
            ?>
            </h2>
    </div>
</div>