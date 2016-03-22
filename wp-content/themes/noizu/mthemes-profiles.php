<?php  
$profiles = mthemes_get_field(array('field' => 'profiles', 'is_sub' => true, 'is' => 'array'));

// var_dump($profiles);

if($profiles): ?>
<div class="region-profiles" data-deliverance-region="profiles">
    <!-- svg clip -->
    <svg id="profile-clip">
        <defs>
            <clipPath id="hex-clip">
                <polygon points="50 0 93.3012702 25 93.3012702 75 50 100 6.69872981 75 6.69872981 25"></polygon>
            </clipPath>
        </defs>
    </svg>
    <!-- container -->
    <div class="profiles-container">
        <div class="profiles-arrows">
            <span class="profiles-arrows-next ico-button" data-deliverance-element="next">
                <svg width="29px" height="14px" viewBox="0 0 29 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path d="M0,8 L24,8 L21,13 L22,14 L29,7 L22,0 L21,1 L24,6 L0,6 L0,8 Z" fill="#000000"></path>
                    </g>
                </svg>
            </span>
            <span class="profiles-arrows-prev ico-button" data-deliverance-element="prev">
                <svg width="29px" height="14px" viewBox="0 0 29 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path d="M-3.55271368e-15,8 L24,8 L21,13 L22,14 L29,7 L22,1.42108547e-14 L21,1 L24,6 L-3.55271368e-15,6 L-3.55271368e-15,8 Z" fill="#000000" transform="translate(14.500000, 7.000000) rotate(-180.000000) translate(-14.500000, -7.000000) "></path>
                    </g>
                </svg>
            </span>
        </div>
        <div class="profile-bar" data-deliverance-element="bar" data-start-from="1">
            <?php foreach($profiles as $profile): ?>
            <?php  
            $button_text    = ($profile['button_text'] !== '')? $profile['button_text'] : mthemes_get_l10n('read more');
            $button_url     = (is_array($profile['button_destination']))? get_permalink($profile['button_destination'][0]) : $profile['button_custom_url'];
            ?>
            <!-- profile -->
            <div class="profile">
                <?php if(!empty($profile['image'])): ?>
                <svg class="profile-image" width="100px" height="100px" viewPort="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <image x="0" y="0" width="100%" height="100%" clip-path="url(#hex-clip)" xlink:href="<?php echo esc_attr($profile['image']['sizes']['image-profile']) ?>" />
                </svg>
                <?php endif ?>
                <h3><?php echo esc_html($profile['name']) ?></h3>
                <?php if($profile['subtitle']): ?><h5><?php echo esc_html($profile['subtitle']) ?></h5><?php endif ?>
                <p class="no-indent"><?php echo esc_html($profile['description']) ?></p>
                <?php if(is_string($button_url) and strlen($button_url) > 0): ?>
                <a href="<?php echo esc_attr($button_url) ?>" class="border-button"><?php echo esc_html($button_text) ?></a>
                <?php endif ?>
            </div>
            <?php endforeach ?>
        </div>
    </div>
</div>
<?php 
endif;