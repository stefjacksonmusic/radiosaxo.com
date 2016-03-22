<?php  
$menu = wp_nav_menu(array(
    'theme_location'    => 'bar',
    'container'         => false,
    'echo'              => false
));

$footer_text    = mthemes_get_field(array('field' => 'footer_text', 'is' => 'string', 'post_id' => 'options', 'default' => 'Designed by <a href="http://mountainthemes.com" target="_blank">Mountain Themes</a>'));
$img_logo       = mthemes_get_field(array('field' => 'image_logo', 'post_id' => 'options', 'is' => 'string'));
$svg_logo       = mthemes_get_field(array('field' => 'svg_logo', 'post_id' => 'options', 'is' => 'string'));
$logo_classes   = array();

if($img_logo){
    $logo_classes[] = 'image-logo';
}
else{
    $logo_classes[] = 'svg-logo';
}

if(substr($menu, 1, 3) == 'div'){
    $menu = substr($menu, 18);
    $menu = substr($menu, 0, -7);
}
?>
<!-- bar region -->
<div id="bar" class="bar bar-player bar-logo" data-deliverance-region="bar">
    <div id="bar-container" class="toggle-front" data-deliverance-element="container">
        <!-- bar front -->
        <div id="bar-front" class="bar-nav" data-deliverance-element="front">
            <!-- audio player -->
            <div id="bar-nav-player" data-deliverance-element="nav-player">
                <!-- progress bar -->
                <span id="bar-nav-player-progress" data-deliverance-element="player-progress"></span>
                <span class="nav-player-ico">
                    <svg width="12px" height="14px" viewBox="0 0 12 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                            <path d="M2.46294539,10.0001481 C0.948054107,10.0001481 0,10.8956023 0,11.9996647 C0,13.1044912 0.728279262,14 2.2433466,14 C3.75923553,14 4.48839507,13.1044912 4.48839507,11.9996647 L4.48839507,5.99936842 L11.0611007,3.00009357 L11.0611007,9.40881871 C10.1221428,9.15589084 10.6811162,9.00038986 10.0601129,9.00038986 C8.54598449,9.00038986 7.6393619,9.89589864 7.6393619,10.9999064 C7.6393619,12.1047875 8.3042615,13.0002417 9.81927016,13.0002417 C11.3351591,13.0002417 12,12.1047875 12,10.9999064 L12,0 L3.54937843,3.99990643 L3.54937843,10.4094503 C2.61047916,10.1564678 3.08406608,10.0001481 2.46294539,10.0001481 Z" fill="#000000" sketch:type="MSShapeGroup"></path>
                        </g>
                    </svg>
                </span>
            </div>
            <!-- bar logo & nav -->
            <div id="bar-content" data-deliverance-element="front-content">
                <div id="bar-icons" data-deliverance-element="front-icons">
                    <!-- ico full screen menu -->
                    <span class="ico-button hide" id="bar-ico-full-menu" data-deliverance-element="ico-full-menu">
                        <svg width="20px" height="14px" viewBox="0 0 20 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <path d="M0,12 L20,12 L20,14 L0,14 L0,12 Z M0,8 L20,8 L20,10 L0,10 L0,8 Z M0,4 L20,4 L20,6 L0,6 L0,4 Z M0,0 L20,0 L20,2 L0,2 L0,0 Z" fill="#FFFFFF"></path>
                            </g>
                        </svg>
                    </span>
                    <!-- ico full screen -->
                    <span class="ico-button" id="bar-ico-full-screen" data-deliverance-element="ico-full-screen">
                        <svg width="17px" height="14px" viewBox="0 0 17 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <path d="M17,0 L17,11 L0,11 L0,0 L17,0 Z M2,2 L2,9 L15,9 L15,2 L2,2 Z M13,12 L13,14 L9.61329515,14 L4,14 L4,12 L13,12 Z" fill="#FFFFFF"></path>
                            </g>
                        </svg>
                    </span>
                    <!-- ico footer -->
                    <span class="ico-button" id="bar-ico-footer" data-deliverance-element="ico-copyright">
                        <svg width="14px" height="15px" viewBox="0 0 14 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <path d="M0,6.99966829 C0.000995260664,3.13412785 3.13424171,0 7.00033175,0 C10.8669194,0 14,3.1342937 14,6.99966829 C14,10.8657063 10.8667536,13.9993366 7.00033175,14 C3.13424171,13.9993366 0.000995260664,10.866038 0,6.99966829 Z M2,6.99971319 C2.00602375,9.76099925 4.23925764,11.994694 7.00028685,12 C9.76160289,11.994694 11.9952671,9.76099925 12,6.99971319 C11.9952671,4.23900075 9.76160289,2.00501922 7.00028685,2 C4.23940107,2.00516262 2.00602375,4.23900075 2,6.99971319 Z M4.8580025,9.12117659 C4.28804192,8.53729435 3.99973397,7.7679661 4.00000019,7.00231949 C3.99973397,6.23558203 4.28617843,5.46325391 4.85853492,4.87868989 C5.42889482,4.293035 6.18147705,3.99891216 6.92860193,4.00000302 C7.67705787,3.99891216 8.42924078,4.29371679 9,4.87868989 L8.312906,5.58311203 C7.92916094,5.19053918 7.43107769,4.99636629 6.92860193,4.99582086 C6.4266586,4.99636629 5.92910777,5.19053918 5.5452296,5.58311203 C5.16228318,5.97513946 4.97300622,6.48593415 4.97247379,7.00231949 C4.97300622,7.51584133 5.16308182,8.02472702 5.54602824,8.41757259 C5.92857535,8.80905458 6.42625928,9.00350019 6.92860193,9.00404561 C7.43107769,9.00350019 7.92929404,8.80905458 8.31197426,8.41702716 L8.99986689,9.12117659 C8.42937389,9.70601333 7.67812272,9.99999981 6.93046542,9.99999981 C6.18094463,10.0002725 5.42836239,9.70601333 4.8580025,9.12117659 Z" fill="#FFFFFF"></path>
                            </g>
                        </svg>
                    </span>
                </div>

                <a id="logo" class="<?php echo esc_attr(implode(' ', $logo_classes)) ?>" href="<?php echo esc_attr(home_url()) ?>" data-deliverance-element="logo">
                    <?php 
                    if($img_logo):  ?>
                        <img src="<?php echo esc_attr($img_logo) ?>" alt=""><?php
                    else : 
                        if($svg_logo):
                            echo mthemes_get_icon($svg_logo);
                        else: ?>
                            <!-- svg logo -->
                            <svg width="130px" height="23px" viewBox="0 0 130 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <path d="M16.2352941,16 L4,0 L0,0 L0,23 L4,23 L4,22 L0,22 L0,21 L4,21 L4,20 L4,20 L0,20 L0,19 L4,19 L4,18 L0,18 L0,16 L4,16 L4,6 L11.6470588,16 L16.2352941,16 Z M17,16 L17,0 L21,0 L21,23 L17,23 L16.2352941,22 L16.2352941,22 L21,22 L21,21 L15.4705882,21 L14.7058824,20 L21,20 L21,19 L13.9411765,19 L13.1764706,18 L21,18 L21,16 L17,16 Z M70,16 L70,0 L66,0 L66,23 L70,23 L70,22 L66,22 L66,21 L70,21 L70,21 L70,20 L70,20 L66,20 L66,19 L70,19 L70,18 L66,18 L66,16 L70,16 Z M87.5124367,18 L86.6916166,19 L86.6916166,19 L81.8242203,19 L82.6437508,18 L70,18 Z M89.1540768,16 L99.8024263,3.02718169 L99.8024263,0 L81.4280763,0 L81.4280763,3.55364807 L94.4020797,3.55364807 L94.4020797,3.65236052 L84.2828119,16 L70,16 Z M128.922166,18 C128.748994,18.3501825 128.554955,18.6835158 128.340048,19 L128.340048,19 L122.299762,19 C122.916308,18.7700145 123.467785,18.4366816 123.954195,18 L116.045805,18 C116.532215,18.4366816 117.083692,18.7700145 117.700238,19 L117.700238,19 L111.659952,19 C111.445045,18.6835158 111.251006,18.3501825 111.077834,18 L87.5124367,18 Z M129.641247,16 C129.880416,15.0200762 130,13.9435901 130,12.7705382 L130,0 L126.013514,0 L126.013514,12.6076487 C126.013514,13.9071821 125.803529,15.0379619 125.383555,16 L114.616445,16 C114.196471,15.0379619 113.986486,13.9071821 113.986486,12.6076487 L113.986486,0 L110,0 L110,12.7705382 C110,13.9435901 110.119584,15.0200762 110.358753,16 L89.1540768,16 Z M100,20 L100,21 L81,21 L81,20.0057225 L81.0046897,20 L100,20 L100,20 Z M127.539416,20 C127.428665,20.1179857 127.314175,20.2329526 127.195946,20.3449008 C126.949021,20.5787093 126.692861,20.7970756 126.427467,21 L126.427467,21 L113.572533,21 C113.307139,20.7970756 113.050979,20.5787093 112.804054,20.3449008 C112.685825,20.2329526 112.571335,20.1179857 112.460584,20 L127.539416,20 L127.539416,20 Z M100,22 L100,23 L81,23 L81,22 L100,22 L100,22 Z M124.792626,22 C123.394433,22.6666687 121.796896,23 120,23 C118.203104,23 116.605567,22.6666687 115.207374,22 L124.792626,22 L124.792626,22 Z" fill="#C86464"></path>
                                    <path d="M43.5,23 C40.2499837,23 37.5208444,21.9025006 35.3125,19.7074689 C33.1041556,17.5124372 32,14.7766416 32,11.5 C32,8.22335844 33.1041556,5.48756284 35.3125,3.29253112 C37.5208444,1.0974994 40.2499837,-3.76728514e-15 43.5,0 C46.7500163,-3.76728514e-15 49.4791556,1.0974994 51.6875,3.29253112 C53.8958444,5.48756284 55,8.22335844 55,11.5 C55,14.7766416 53.8958444,17.5124372 51.6875,19.7074689 C49.4791556,21.9025006 46.7500163,23 43.5,23 Z M50.306897,3.83333333 L48.7411737,5.01732519 C50.4198937,6.66155128 51.4673846,8.95739879 51.4673846,11.5 C51.4673846,14.0426012 50.4198937,16.3384487 48.7411737,17.9813439 L50.306897,19.1666667 C52.2226366,17.1827882 53.4079994,14.4834927 53.4079994,11.5 C53.4079994,8.51650734 52.2226366,5.81588084 50.306897,3.83333333 Z M47.1936569,5.75 L45.9410782,6.63799389 C47.2840542,7.87116346 48.122047,9.59304909 48.122047,11.5 C48.122047,13.4069509 47.2840542,15.1288365 45.9410782,16.3610079 L47.1936569,17.25 C48.7262486,15.7620912 49.6745388,13.7376195 49.6745388,11.5 C49.6745388,9.26238051 48.7262486,7.23691063 47.1936569,5.75 Z M44.0804168,7.66666667 L43.1409828,8.25866259 C44.1482148,9.08077564 44.7767094,10.2286994 44.7767094,11.5 C44.7767094,12.7713006 44.1482148,13.9192244 43.1409828,14.7406719 L44.0804168,15.3333333 C45.2298606,14.3413941 45.9410782,12.9917463 45.9410782,11.5 C45.9410782,10.0082537 45.2298606,8.65794042 44.0804168,7.66666667 Z M41.9005419,9.58333333 L41.2742525,9.8793313 C41.9457405,10.2903878 42.3647369,10.8643497 42.3647369,11.5 C42.3647369,12.1356503 41.9457405,12.7096122 41.2742525,13.120336 L41.9005419,13.4166667 C42.6668377,12.9206971 43.1409828,12.2458732 43.1409828,11.5 C43.1409828,10.7541268 42.6668377,10.0789702 41.9005419,9.58333333 Z" fill="#82A0C8"></path>
                                </g>
                            </svg>
                        <?php 
                        endif;
                    endif;

                    ?>
                </a>

                <!-- bar nav links -->
                <nav data-deliverance-element="nav">
                    <?php echo balanceTags($menu); ?>
                </nav>
            </div>
        </div>
        <!-- bar copyright -->
        <div id="bar-bottom" class="bar-copyright" data-deliverance-element="bottom">
            <div id="bar-bottom-nav" data-deliverance-element="copy-nav">
                <svg width="11px" height="8px" viewBox="0 0 11 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                        <g sketch:type="MSLayerGroup" fill="#000000" transform="translate(5.500000, 4.000000) rotate(-180.000000) translate(-5.500000, -4.000000) translate(0.000000, 0.000000)">
                            <path d="M0,0 L11,0 L5.5,8 L0,0 L0,0 Z" id="triangle"></path>
                        </g>
                    </g>
                </svg>
            </div>
            <div id="bar-bottom-content">
                <p><?php echo esc_html($footer_text) ?></p>
            </div>
        </div>
        <!-- player bar -->
        <div id="bar-top" class="bar-player" data-deliverance-element="top" data-deliverance-region="player">
            <div id="bar-player-button" data-deliverance-element="player-nav">
                <svg width="11px" height="8px" viewBox="0 0 11 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path d="M0,0 L11,0 L5.5,8 L0,0 Z" id="triangle" fill="#000000"></path>
                    </g>
                </svg>
            </div>
            <div id="bar-player-track">
                <div id="bar-player-track-name" data-deliverance-element="track-name"></div>
                <div id="bar-player-author" data-deliverance-element="track-artist"></div>
                <div id="bar-player-commands">
                    <span id="bar-player-command-prev" data-deliverance-element="prev">
                        <svg width="24px" height="12px" viewBox="0 0 24 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <path d="M0,7 L19.9776864,6.96633378 L17.0235927,11 L17.9506835,12 L24,6 L18.0202223,0 L17.0235927,1 L19.9776864,4.96803799 L0,5.010234 L0,7 Z" id="prev" fill="#323746" transform="translate(12.000000, 6.000000) rotate(-180.000000) translate(-12.000000, -6.000000) "></path>
                            </g>
                        </svg>
                    </span>
                    <span id="bar-player-command-play" data-deliverance-element="play">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                            <g>
                                <path d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472 c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z"></path>
                                <polygon points="192,336 352,256 192,176"></polygon>
                            </g>
                        </svg>
                    </span>
                    <span id="bar-player-command-pause" class="hide" data-deliverance-element="pause">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                        <g>
                            <path d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472 c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z"></path>
                            <g>
                                <polygon points="271.5,336.5 335.5,336.5 335.5,211.5 335.5,176.5 271.5,176.5"></polygon>
                                <rect x="175.5" y="176.5" width="64" height="160"></rect>
                            </g>
                        </g>
                        </svg>
                    </span>
                    <span id="bar-player-command-playlist" data-deliverance-element="playlist">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                            <path d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472 c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z"></path>
                            <g>
                                <rect x="151.5" y="184.5" fill-rule="evenodd" clip-rule="evenodd" width="192" height="32"></rect>
                                <rect x="151.5" y="248.5" fill-rule="evenodd" clip-rule="evenodd" width="192" height="32"></rect>
                                <rect x="151.5" y="312.5" fill-rule="evenodd" clip-rule="evenodd" width="192" height="32"></rect>
                            </g>
                        </svg>
                    </span>
                    <span id="bar-player-command-next" data-deliverance-element="next">
                        <svg width="24px" height="12px" viewBox="0 0 24 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <path d="M-3.55271368e-15,7 L19.9776864,6.96633378 L17.0235927,11 L17.9506835,12 L24,6 L18.0202223,-5.32907052e-15 L17.0235927,1 L19.9776864,4.96803799 L-3.55271368e-15,5.010234 L-3.55271368e-15,7 Z" fill="#323746"></path>
                            </g>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- full screen menu region -->
<div id="region-full-screen-menu" class="hide" data-deliverance-region="full-menu">
    <span id="full-menu-close" class="ico-button" data-deliverance-element="close">
        <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <path d="M6.08578644,7.49719826 L0,13.5829847 L1.41421356,14.9971983 L7.5,8.91141182 L13.4378306,14.8492424 L14.8520441,13.4350288 L8.91421356,7.49719826 L14.8492424,1.56216942 L13.4350288,0.147955855 L7.5,6.0829847 L1.4170153,8.8817842e-16 L0.00280174029,1.41421356 L6.08578644,7.49719826 Z" fill="#000000"></path>
            </g>
        </svg>
    </span>
    <?php echo balanceTags($menu) ?>
</div>