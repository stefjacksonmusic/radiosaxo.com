<?php  
$soundcloud_api_client_id                   = mthemes_get_field(array('field' => 'soundcloud_app_client_id', 'is' => 'string', 'post_id' => 'options'));
$tracklist_soundcloud_url                   = mthemes_get_field(array('field' => 'tracklist_soundcloud_url', 'is_sub' => true));
$tracklist_soundcloud_display_cover         = mthemes_get_field(array('field' => 'tracklist_soundcloud_display_cover', 'is_sub' => true, 'is' => 'bool', 'default' => true));
$tracklist_soundcloud_display_cover         = ($tracklist_soundcloud_display_cover)? 'true' : 'false';
$tracklist_soundcloud_display_description   = mthemes_get_field(array('field' => 'tracklist_soundcloud_display_description', 'is_sub' => true, 'is' => 'bool', 'default' => true));
$tracklist_soundcloud_display_description   = ($tracklist_soundcloud_display_description)? 'true' : 'false';

if($soundcloud_api_client_id and $tracklist_soundcloud_url): ?>
<div class="region-tracklist region-tracklist-soundcloud" data-deliverance-region="tracklist" data-tracklist-type="soundcloud" data-soundcloud-url="<?php echo esc_attr($tracklist_soundcloud_url) ?>" data-soundcloud-client-id="<?php echo esc_attr($soundcloud_api_client_id) ?>" data-soundcloud-display-description="<?php echo esc_attr($tracklist_soundcloud_display_description) ?>" data-soundcloud-display-cover="<?php echo esc_attr($tracklist_soundcloud_display_cover) ?>">
    <svg data-deliverance-element="soundcloud-ico" class="hide" width="35px" height="15px" viewBox="0 0 35 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <path d="M30.4869141,6.50236607 C29.8687402,6.50236607 29.2787305,6.62022321 28.7415625,6.83236607 C28.3824707,3.00341518 24.9718848,0 20.811875,0 C19.7937988,0 18.8061426,0.188504464 17.9299121,0.507723214 C17.5894824,0.631674107 17.5,0.759508929 17.5,1.00714286 L17.5,14.4908705 C17.5,14.7508929 17.7132813,14.9674554 17.9827539,14.9929688 C17.9942383,14.9941071 30.4083008,15 30.4887598,15 C32.9805957,15 35,13.0976786 35,10.751317 C35,8.40495536 32.9788184,6.50236607 30.4869141,6.50236607 L30.4869141,6.50236607 L30.4869141,6.50236607 Z M13.671875,15 L14.765625,15 L15.3125,7.49263393 L14.765625,0 L13.671875,0 L13.125,7.49263393 L13.671875,15 L13.671875,15 Z M10.390625,15 L9.296875,15 L8.75,9.55078125 L9.296875,4.28571429 L10.390625,4.28571429 L10.9375,9.64285714 L10.390625,15 L10.390625,15 Z M4.921875,15 L6.015625,15 L6.5625,10.7142857 L6.015625,6.42857143 L4.921875,6.42857143 L4.375,10.7142857 L4.921875,15 L4.921875,15 Z M0.546875,12.8571429 L1.640625,12.8571429 L2.1875,10.7142857 L1.640625,8.57142857 L0.546875,8.57142857 L0,10.7142857 L0.546875,12.8571429 L0.546875,12.8571429 Z" id="Shape" fill="#000000"></path>
        </g>
    </svg>
</div>
<?php 
endif;