<?php 
global $wpdb;
$table		=	$wpdb->prefix."radioforge_radio";

$usql		=	"SELECT * FROM $table WHERE id='$id'";
$uresults 	= 	$wpdb->get_row( $usql  );

$prms = json_decode($uresults->params);

//print_r($prms);

$site_url = site_url();

if($prms->radiotype=="shoutcast1")
{
  $radiourl = $prms->url.";";
  
}
else
{
  $radiourl = $prms->url;
} 


if($prms->autoplay=="true")
  $autoplay="true";
else
  $autoplay="false";  
  
    


//$feedlist = new rss($uresults->url);
//echo $feedlist->display($uresults->id,$uresults->items,$uresults->title,$uresults->target,$uresults->bgcolor,$uresults->width,$site_url);

/*if($prms->html!="")
 $H = $prms->height+100;
else*/
 $H = $prms->height; 
 
if($prms->volume==0) 
 $volume = 60; 
else
 $volume = $prms->volume;
 
?>
<div align="center" id="radioforge<?php echo $id; ?>" style="background:url(<?php echo $prms->bgimage; ?>) no-repeat; width:<?php echo $prms->width; ?>px; height:<?php echo $H; ?>px;">
<!-- BEGINS: AUTO-GENERATED MUSES RADIO PLAYER CODE -->

<?php //wp_enqueue_script( $handle, $src, $deps, $ver, $in_footer ); ?> 

<?php echo '<scr'; echo 'ipt type="text/javascr'; echo 'ipt">'; ?>
MRP.insert({
'url':'<?php echo $radiourl; ?>',
'lang':'<?php echo $prms->lang; ?>',
'codec':'<?php echo $prms->codec; ?>',
'volume':<?php echo $volume; ?>,
'introurl':'<?php echo $prms->introurl; ?>',
'fallback':'<?php echo $prms->introurl; ?>',
'autoplay':<?php echo $autoplay; ?>,
'jsevents':false,
'buffering':<?php echo $prms->buffering; ?>,
'title':'<?php echo $prms->title; ?> - <?php echo $prms->artist; ?>',
'welcome':'<?php echo $prms->welcome; ?>',
'bgcolor':'#FFFFFF',
'wmode':'transparent',
'skin':'<?php echo $prms->skin; ?>',
'width':<?php echo $prms->width; ?>,
'height':<?php echo $prms->height; ?>
});
<?php echo '</scr'; echo 'ipt>'; ?>
<!-- ENDS: AUTO-GENERATED MUSES RADIO PLAYER CODE -->

<div style="float:right; padding-right:3px; margin-top:-25px; z-index:2000; overflow:auto; position:absolute;"><?php if($prms->twitter!=""){ ?><a href="<?php echo $prms->twitter;?>" target="_blank" title="Twitter"><img src="<?php echo plugin_dir_url( __FILE__ ); ?>/images/twitter.png" border="0" width="18" height="18" /></a><?php } ?><?php if($prms->facebook!=""){ ?><a href="<?php echo $prms->facebook;?>" target="_blank"  title="Facebook"><img src="<?php echo plugin_dir_url( __FILE__ ); ?>/images/facebook.png" border="0" width="18" height="18" /></a><?php } ?><?php if($prms->gplus!=""){ ?><a href="<?php echo $prms->gplus;?>" target="_blank" title="Google+"><img src="<?php echo plugin_dir_url( __FILE__ ); ?>/images/google-plus.png" border="0" width="18" height="18" /></a><?php } ?><?php /*?><?php if(!isset($_REQUEST['rand'])){ ?><a href="javascript:void(0)"  onClick="popitup();"  title="PopOut"><img src="<?php echo plugin_dir_url( __FILE__ ); ?>/images/popouticon.png" style="margin-bottom:1px;" width="18" height="18" alt="popout"></a><?php } ?><?php */?>  </div>

<?php echo $prms->html; ?>

</div>


<?php /*?><script language="javascript">


function popitup() {

var url = document.location.href;
 
 url = addParameterToURL(url, "rand=2");

        LeftPosition = (screen.width) ? (screen.width - 800) / 2 : 0;
        TopPosition = (screen.height) ? (screen.height - 700) / 2 : 0;
        var sheight = <?php echo $prms->height+10; ?>; 
        var swidth = <?php echo $prms->width+20; ?>;         

        settings = 'height='+ sheight + ',width='+ swidth + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=yes,resizable=yes,toolbar=no,status=no,menu=no, directories=no,titlebar=no,location=no,addressbar=no'
		
		
        newwindow = window.open('', '', settings);
        if (window.focus) { newwindow.focus(); newwindow.document.location.href=url;   
		
		}
        return false;
    }
	
	
	function addParameterToURL(_url, param){
    //_url = location.href;
    _url += (_url.split('?')[1] ? '&':'?') + param;
    return _url;
}

</script><?php */?>