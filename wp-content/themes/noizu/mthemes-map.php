<?php  
global $mthemes_gmaps_loaded;

$map = mthemes_get_field(array(
    'field'     => 'map',
    'is_sub'    => true,
    'is'        => 'array'
));

$map_type = mthemes_get_field(array(
    'field'     => 'map_type',
    'is_sub'    => true,
    'is'        => 'string',
    'default'   => 'ROADMAP'
));

$map_zoom = mthemes_get_field(array(
    'field'     => 'map_zoom',
    'is_sub'    => true,
    'is'        => 'numeric',
    'default'   => '13'
));

$map_height = mthemes_get_field(array(
    'field'     => 'map_height',
    'is_sub'    => true,
    'is'        => 'numeric',
    'default'   => 500
));

if($map):
    if(!$mthemes_gmaps_loaded): $mthemes_gmaps_loaded = true; ?>
        <script>
        window.gMapsApiInit = function(){
            if(window.app){
                setTimeout(function(){
                    window.app.emit('map.apiInit');
                }, 100);
            }
            else {
                setTimeout(gMapsApiInit, 1000);
            }
        };
        </script>
        <script src="http://maps.googleapis.com/maps/api/js?&amp;sensor=FALSE&amp;callback=gMapsApiInit"></script><?php  
    endif;
    ?>
    <div class="region-map" data-deliverance-region="map" data-lat="<?php echo esc_attr($map['lat']) ?>" data-lng="<?php echo esc_attr($map['lng']) ?>" data-type="<?php echo esc_attr($map_type) ?>" data-zoom="<?php echo esc_attr($map_zoom) ?>">
        <div class="map-content" style="height:<?php echo esc_attr($map_height) ?>px"></div>
    </div>
<?php 
endif;