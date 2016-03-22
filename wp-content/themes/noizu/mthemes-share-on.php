<?php  
$sharing_socials = mthemes_get_field(array(
    'field'     => 'sharing_socials', 
    'post_id'   => 'options', 
    'is'        => 'array', 
    'default'   => array('facebook', 'twitter', 'google plus', 'pinterest', 'digg', 'delicious', 'stumbleupon', 'linkedin')
));

?>

<div id="share-on" data-deliverance-region="share-on">
    <span id="share-on-select" class="hidden" data-deliverance-element="select">
        <svg width="9px" height="6px" viewBox="0 0 11 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" data-deliverance-element="triangle">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <path d="M0,0 L11,0 L5.5,8 L0,0 Z" id="triangle" fill="#000000" sketch:type="MSShapeGroup"></path>
            </g>
        </svg>
        <var data-deliverance-element="select-text"><?php echo mthemes_get_l10n('select') ?></var>
    </span>
    <span id="share-on-label" class="hidden" data-deliverance-element="label">
        share on
    </span>
    <div id="share-on-options" class="hide" data-deliverance-element="options">
        <?php if(in_array('facebook', $sharing_socials)): ?><div id="share-on-facebook" data-url="http://example.com">facebook</div><?php endif ?>
        <?php if(in_array('twitter', $sharing_socials)): ?><div id="share-on-twitter" data-url="http://example.com">twitter</div><?php endif ?>
        <?php if(in_array('google plus', $sharing_socials)): ?><div id="share-on-google-plus" data-url="http://example.com">google plus</div><?php endif ?>
        <?php if(in_array('pinterest', $sharing_socials)): ?><div id="share-on-pinterest" data-url="http://example.com">pinterest</div><?php endif ?>
        <?php if(in_array('digg', $sharing_socials)): ?><div id="share-on-digg" data-url="http://example.com">digg</div><?php endif ?>
        <?php if(in_array('delicious', $sharing_socials)): ?><div id="share-on-delicious" data-url="http://example.com">delicious</div><?php endif ?>
        <?php if(in_array('stumbleupon', $sharing_socials)): ?><div id="share-on-stumbleupon" data-url="http://example.com">stumbleupon</div><?php endif ?>
        <?php if(in_array('linkedin', $sharing_socials)): ?><div id="share-on-linkedin" data-url="http://example.com">linkedin</div><?php endif ?>
    </div>
</div>