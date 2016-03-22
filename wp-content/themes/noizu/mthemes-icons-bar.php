<?php  
$icons_bar = mthemes_get_field(array('field' => 'icons_bar', 'is' => 'array', 'post_id' => 'options'));
?>

<div id="icons-bar" data-deliverance-region="icons-bar">
    <!-- 
    {{#unless barWithLogo}}
        {{> logo }}
    {{/unless}}
    -->

    <!-- menu icon -->
    <span id="ico-menu" class="left ico ico-button hidden" data-deliverance-element="menu">
        <svg width="20px" height="14px" viewBox="0 0 20 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <path d="M0,12 L20,12 L20,14 L0,14 L0,12 Z M0,8 L20,8 L20,10 L0,10 L0,8 Z M0,4 L20,4 L20,6 L0,6 L0,4 Z M0,0 L20,0 L20,2 L0,2 L0,0 Z" id="ico-menu" fill="#FFFFFF"></path>
            </g>
        </svg>
    </span>

    <!-- social icons -->
    <?php if($icons_bar): foreach($icons_bar as $_icon_bar): ?>
    <a href="<?php echo esc_attr($_icon_bar['icon_url'])?>" <?php if($_icon_bar['icon_target']): ?>target="_blank"<?php endif ?> class="ico right ico-button hidden history-ignore">
        <?php echo mthemes_get_icon($_icon_bar['icon']) ?>
    </a>
    <?php endforeach; endif; ?>

    <!-- loader icon -->
    <span id="ico-loader" class="ico hidden" data-deliverance-element="loader">
        <svg width="21px" height="21px" viewBox="0 0 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <path d="M0,10.5 C0.0108448183,4.76869852 4.70096667,0 10.5,0 C13.7554667,0 16.6642,1.4819 18.5894333,3.80706667 L16.4157,5.9808 C15.0553667,4.19976667 12.9159333,3.04826667 10.5,3.04826667 C6.73866667,3.04826667 3.63976667,5.83333333 3,9 L7,9 C7,9 1.00525658,14.9611228 1,15 C0.365689917,13.4393228 0.0108448183,12.1037652 0,10.5 Z M21,10.5 C20.9891552,16.2313015 16.2990333,21 10.5,21 C7.24453333,21 4.3358,19.5181 2.41056667,17.1929333 L4.5843,15.0192 C5.94463333,16.8002333 8.08406667,17.9517333 10.5,17.9517333 C14.2613333,17.9517333 17.3602333,15.1666667 18,12 L14,12 C14,12 19.9947434,6.0388772 20,6 C20.6343101,7.5606772 20.9891552,8.89623481 21,10.5 Z" fill="#000000"></path>
            </g>
        </svg>
    </span>
</div>