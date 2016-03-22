<?php 
$events_title       = mthemes_get_field(array('field' => 'events_title', 'is_sub' => true, 'is' => 'string'));
$events             = mthemes_get_field(array('field' => 'events_list', 'is_sub' => true, 'is' => 'array'));
$events_button_text = mthemes_get_field(array('field' => 'events_button_text', 'is_sub' => true, 'is' => 'string', 'default' => mthemes_get_l10n('details')));
$highlight_first    = mthemes_get_field(array('field' => 'highlight_first', 'is_sub' => true, 'is' => 'bool', 'default' => true));

if($events):
?>
<div class="region-events" data-deliverance-region="events">
    <?php if(!empty($events_title)): ?><h4><?php echo esc_html($events_title) ?></h4><?php endif ?>
    <ul>
        <?php foreach($events as $key => $event): ?>
        <?php  
        $event_time = strtotime($event['date']);
        ?>
        <li<?php if($key == 0 and $highlight_first): ?> class="next-event"<?php endif ?>>
            <div class="event-button">
                <?php if($event['button_url']): ?>
                <a target="_blank" href="<?php echo esc_attr($event['button_url']) ?>" class="button button-lite history-ignore"><span><?php echo esc_html($events_button_text) ?></span></a>
                <?php endif ?>
            </div>
            <div class="event-date">
                <div><?php echo date('d', $event_time) ?></div>
                <div><?php echo strtoupper(date('M', $event_time)) ?></div>
                <div><?php echo date('Y', $event_time) ?></div>
            </div>
            <div class="event-content">
                <h4><?php echo esc_html($event['title']) ?></h4>
                <p class="no-indent"><?php echo esc_html($event['description']) ?></p>
            </div>
        </li>
        <?php endforeach; ?>
    </ul>
</div>
<?php 
endif;