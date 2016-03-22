<?php 
global $mthemes_is_ajax;
global $bar_position;

$footer_text = mthemes_get_field(array('field' => 'footer_text', 'is' => 'string', 'post_id' => 'options', 'default' => 'Designed by <a href="http://mountainthemes.com" target="_blank">Mountain Themes</a>'));

if($mthemes_is_ajax):

    wp_footer();
    ?><!-- /deliverance-content --><?php

else: ?>
<!-- /deliverance-content -->
</div><!-- /content -->
<?php if( $bar_position == 'top' ){ get_template_part('mthemes', 'icons-bar'); } ?>
<div id="mobile-footer" class="hidden" data-deliverance-region="mobile-footer"><?php echo balanceTags($footer_text) ?></div>
</div><!-- /container -->
</div><!-- /wrapper -->
<?php get_template_part('mthemes', 'photoswipe') ?>
<script src="http://connect.soundcloud.com/sdk.js"></script>
<?php wp_footer(); ?>
</body>
</html>
<?php endif; ?>