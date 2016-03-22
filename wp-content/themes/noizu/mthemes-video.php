<?php  
$video_embed_code = mthemes_get_field(array('field' => 'video_embed_code', 'is_sub' => true));

if($video_embed_code):
?>
<div class="region-video" data-deliverance-region="video">
    <?php echo balanceTags($video_embed_code) ?>
</div>
<?php 
endif;