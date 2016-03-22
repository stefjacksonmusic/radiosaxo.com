<?php  
global $acf_active;

$tracklist_name     = mthemes_get_field(array('field' => 'tracklist_name', 'is_sub' => true, 'is' => 'string'));
$tracklist_cover    = mthemes_get_field(array('field' => 'tracklist_cover', 'is_sub' => true, 'is' => 'image'));
$tracklist_playlist = mthemes_get_field(array('field' => 'tracklist_playlist', 'is_sub' => true, 'is' => 'object'));

if($acf_active):

$tracklist_tracks   = get_fields($tracklist_playlist->ID);

if(is_array($tracklist_tracks)):
?>
<div class="region-tracklist" data-deliverance-region="tracklist" data-tracklist-type="mp3" data-title="<?php echo esc_attr($tracklist_playlist->post_title) ?>" data-author="<?php echo esc_attr($tracklist_tracks['author']) ?>" data-cover="<?php if(is_array($tracklist_cover)){ echo esc_attr($tracklist_cover['sizes']['large']); } ?>">
    <h4><?php echo esc_html($tracklist_name) ?></h4>
    <?php if(is_array($tracklist_cover)): ?>
    <div class="tracklist-cover">
        <img src="<?php echo esc_attr($tracklist_cover['sizes']['large']) ?>" alt="">
    </div>
    <?php endif ?>
    <ul data-deliverance-element="tracks">
        <?php
        if(!empty($tracklist_tracks['audio_tracks'])):
            foreach($tracklist_tracks['audio_tracks'] as $key => $_track): 
            $_track_data = get_fields($_track->ID);
            if(is_array($_track_data)): ?>
            <li data-index="<?php echo esc_attr($key) ?>" data-title="<?php echo esc_attr($_track->post_title) ?>" data-author="<?php echo esc_attr($_track_data['author']) ?>" data-duration="<?php echo esc_attr($_track_data['duration']) ?>" data-mp3="<?php echo esc_attr($_track_data['mp3_file']['url']) ?>"><span><?php echo esc_html($key + 1) ?>.</span><?php echo esc_html($_track_data['author']) ?> - <?php echo esc_html($_track->post_title) ?></li>
            <?php  
            endif;
            endforeach;
        endif;
        ?>
    </ul>
</div>
<?php 
endif;
endif;