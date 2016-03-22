<?php  
$grid_boxes = mthemes_get_field(array('field' => 'grid_boxes', 'is_sub' => true, 'is' => 'array'));

if($grid_boxes):
?>
<div class="region-grid" data-deliverance-region="grid">
    <ul data-deliverance-element="container" data-gutter="14" data-columns="3">
        <?php 
        foreach($grid_boxes as $box): 
            
            if($box['acf_fc_layout'] == 'image'):
                ?>
                <li class="image-lightbox" data-src="<?php echo esc_attr($box['image']['url']) ?>" data-width="<?php echo esc_attr($box['image']['width']) ?>" data-height="<?php echo esc_attr($box['image']['height']) ?>">
                    <img width="<?php echo esc_attr(($box['image']['sizes']['large-width'] / 2)) ?>" height="<?php echo esc_attr(($box['image']['sizes']['large-height'] / 2)) ?>" class="image-preload" src="<?php echo esc_attr($box['image']['sizes']['large']) ?>" alt="">
                </li>
                <?php
            endif;

            if($box['acf_fc_layout'] == 'text'):
                $box['button_text'] = ($box['button_text'] == '')? mthemes_get_l10n('details') : $box['button_text'];
                $box['button_url']  = (isset($box['button_destination']) and is_array($box['button_destination']))? get_permalink($box['button_destination'][0]) : $box['button_custom_url'];
                ?>
                <li class="info-box">
                    <div class="info-box-content">
                        <?php if(!empty($box['title'])): ?><h5><?php echo esc_html($box['title']) ?></h5><?php endif ?>
                        <?php if(!empty($box['content'])): ?><p><?php echo esc_html($box['content']) ?></p><?php endif ?>
                        <?php if($box['button_url']): ?>
                        <a href="<?php echo esc_attr($box['button_url']) ?>" class="border-button"><?php echo esc_html($box['button_text']) ?></a>
                        <?php endif ?>
                    </div>
                </li>
                <?php
            endif;
        
        endforeach; 
        ?>
    </ul>
</div>
<?php 
endif;