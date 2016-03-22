<?php
/*
  Plugin Name: Genio Adsense Widget
  Plugin URI: http://www.geniolabs.com/genio-adsense-widget-plugin/
  Version: 1.0
  Author: Geniolabs
  Description: Genio Adsense Widget is a simple widget that can put adsense boxes in a widget avoiding the errors and mishandling of the Ads codes.
 */
add_action('widgets_init', 'adsense_load_widgets');

function adsense_load_widgets()
{
	register_widget('Genio_Adsense_Widget');
}

class Genio_Adsense_Widget extends WP_Widget {
	
	function Genio_Adsense_Widget()
	{
		$widget_ops = array('classname' => 'Genio_Adsense_Widget', 'description' => 'Shows a Google Adsense AD.');

		$control_ops = array('id_base' => 'genio-adsense-widget');

		$this->WP_Widget('Genio_Adsense_Widget', 'Genio Adsense Widget', $widget_ops);
	}
	
	function widget($args, $instance)
	{
		extract($args);
		$title=$instance['title'];
		$ad_code=$instance['ad_code'];
		echo $before_widget;

		if(isset($title)) {
			echo $before_title.$title.$after_title;
		}	
        if ( isset($ad_code )  )
		echo($ad_code);	
		
		echo $after_widget;
	}
	
	function update($new_instance, $old_instance)
	{
	  $instance = $old_instance;
		
		$instance['title'] = $new_instance['title'];
		$instance['ad_code'] = $new_instance['ad_code'];
		
		return $instance;
	}

	function form($instance)
	{
	  
		$defaults = array('title' => 'Annonce', 'ad_code' => 'Your Adsense Code Here...');
		$instance = wp_parse_args((array) $instance, $defaults); ?>
		<p>
			<label for="<?php echo $this->get_field_id('title'); ?>">Title:</label>
			<input class="widefat" style="width: 216px;" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" value="<?php echo $instance['title']; ?>" />
		</p>
		
		<p>
			<label for="<?php echo $this->get_field_id('ad_code'); ?>">Adsense Code:</label> 
			<textarea class="widefat" rows="16" cols="20" id="<?php echo $this->get_field_id('ad_code'); ?>" name="<?php echo $this->get_field_name('ad_code'); ?>"><?php if(isset($instance[ 'ad_code' ])) echo $instance[ 'ad_code' ]; ?></textarea> 
		</p>
<?php
	}
}
?>