<?php  
$bkg                    = false;
$bkg_classes            = array('hidden');
$bkg_type               = mthemes_get_field(array('field' => 'background_type', 'is' => 'string'));
$bkg_images             = false;
$bkg_overlay            = false;
$bkg_color              = false;
$bkg_opacity            = false;
$bkg_overlay_style      = false;
$bkg_mp4                = false;
$bkg_webm               = false;

switch($bkg_type){
    case 'images':
        $bkg_images = mthemes_get_field(array('field' => 'background_images', 'is' => 'array'));
        if(!empty($bkg_images)){
            $bkg            = true;
            $bkg_classes[]  = 'background-images';
        }
        break;

    case 'video':
        $bkg_mp4            = mthemes_get_field(array('field' => 'background_mp4_video_url', 'is' => 'string'));
        $bkg_webm           = mthemes_get_field(array('field' => 'background_webm_video_url', 'is' => 'string'));
        $bkg_classes[]      = 'background-video';   
        if($bkg_mp4 and $bkg_webm){
            $bkg            = true;
        }
        break;
}

if($bkg_type){
    $bkg_overlay = mthemes_get_field(array('field' => 'background_overlay', 'is' => 'bool'));
    if($bkg_overlay){
        $bkg_color          = mthemes_get_field(array('field' => 'background_overlay_color', 'is' => 'color', 'default' => '#000000'));
        $bkg_opacity        = mthemes_get_field(array('field' => 'background_overlay_opacity', 'is' => 'numeric'));
        $bkg_opacity        = is_numeric($bkg_opacity) ? ((int) $bkg_opacity) / 100 : 1;
        $bkg_overlay_rgb    = mthemes_hex2rgb($bkg_color);
        $bkg_overlay_rgb[]  = $bkg_opacity;
        $bkg_overlay_style  = 'background-color:rgba('. esc_attr(implode(',', $bkg_overlay_rgb)) .')';
    }
}

if($bkg): 
?>
<div id="background" class="<?php echo esc_attr(implode(" ", $bkg_classes)) ?>" data-deliverance-region="background" data-background-delay="5000">
    <?php 
    if($bkg_type == 'images'): 
        foreach( $bkg_images as $bkg_image ):
        ?>
        <img src="<?php echo esc_attr($bkg_image['sizes']['image-background']) ?>" alt="" class="hidden">
        <?php
        endforeach;
    endif;

    if($bkg_type == 'video'): ?>
        <video data-deliverance-element="video" class="hidden" data-mp4="<?php echo esc_attr($bkg_mp4) ?>" data-webm="<?php echo esc_attr($bkg_webm) ?>"></video><?php
    endif;

    if($bkg_overlay): ?>
        <div id="background-overlay" style="<?php echo esc_attr($bkg_overlay_style) ?>"></div>
        <?php
    endif;
    ?>
</div>
<?php 
endif;