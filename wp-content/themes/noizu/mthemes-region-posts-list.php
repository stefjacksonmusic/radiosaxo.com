<?php 
global $posts_lists;

if(!is_array($posts_lists)){
    return;
}

?>
<div class="region-posts-list" data-deliverance-region="posts-list">
    <h4><?php echo mthemes_get_l10n('Related Posts') ?></h4>
    <ul>
        <?php foreach($posts_lists as $post): ?>
        <li>
            <a href="<?php echo esc_attr(get_permalink($post->ID)) ?>">
                <h4><?php echo esc_html($post->post_title) ?></h4>
            </a>
            <h6><?php echo mthemes_get_l10n('posted on') . ' ' . get_the_date(null, $post->ID); ?></h6>
        </li>
        <?php endforeach; ?>
    </ul>
</div>