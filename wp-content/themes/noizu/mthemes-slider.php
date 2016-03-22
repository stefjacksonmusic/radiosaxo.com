<?php  

$images = mthemes_get_field(array('field' => 'images', 'is_sub' => true, 'is' => 'array'));

if($images): 
?>
<div class="region-slider" data-deliverance-region="slider">
    <div class="owl-carousel" data-deliverance-element="container">
      <?php foreach($images as $image): ?>
      <div class="item"><img class="lazyOwl" data-src="<?php echo esc_attr($image['sizes']['large']) ?>" style="height:auto; width: 100%" alt=""></div>
      <?php endforeach ?>
    </div>
</div>
<?php 
endif;