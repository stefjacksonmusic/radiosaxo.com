<?php 
/*
Template Name: Countdown
*/

$countdown_date         = mthemes_get_field(array('field' => 'countdown_date', 'is' => 'string'));
$countdown_title        = mthemes_get_field(array('field' => 'countdown_title', 'is' => 'string'));
$countdown_description  = mthemes_get_field(array('field' => 'countdown_description', 'is' => 'string'));

if(is_string($countdown_date)){
    $countdown_date = strtotime($countdown_date);
}

get_header();
if(have_posts()): the_post();
get_template_part('mthemes', 'background');
?>
<div id="countdown" class="region region-full-screen region-dark-background" data-deliverance-region="countdown">
    <div id="full-screen-content">
        <!-- countdown -->
        <div id="countdown-container">
            <ul id="countdown-content" data-deliverance-element="content" data-year="<?php echo esc_attr(date("Y", $countdown_date)) ?>" data-month="<?php echo esc_attr(date("n", $countdown_date)) ?>" data-day="<?php echo esc_attr(date("j", $countdown_date)) ?>" data-hour="12">
                <li class="hidden">
                    <span data-deliverance-element="days">&nbsp;</span>
                    <h6>days</h6>
                </li>
                <li class="hidden">
                    <span data-deliverance-element="hours">&nbsp;</span>
                    <h6>hours</h6>
                </li>
                <li class="hidden">
                    <span data-deliverance-element="minutes">&nbsp;</span>
                    <h6>minutes</h6>
                </li>
                <li class="hidden">
                    <span data-deliverance-element="seconds">&nbsp;</span>
                    <h6>seconds</h6>
                </li>
            </ul>
        </div>
        <!-- message -->
        <?php if($countdown_title or $countdown_description): ?>
        <div id="countdown-message" class="hidden" data-deliverance-element="message">
            <?php if($countdown_title): ?><h5><?php echo esc_html($countdown_title) ?></h5><?php endif ?>
            <?php echo esc_html($countdown_description) ?>
        </div>
        <?php endif ?>
    </div>
</div>
<?php
endif;
get_footer();