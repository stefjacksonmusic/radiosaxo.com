<?php  
$image = mthemes_get_field(array('field' => 'image', 'is_sub' => true, 'is' => 'array'));

if($image):
?>
<div class="region-image" data-deliverance-region="image">
    <img src="<?php echo esc_attr($image['sizes']['image-background']) ?>" data-src="<?php echo esc_attr($image['url']) ?>" data-width="<?php echo esc_attr($image['width']) ?>" data-height="<?php echo esc_attr($image['height']) ?>" class="image-preload image-lightbox" alt="">
</div>
<?php 
endif;