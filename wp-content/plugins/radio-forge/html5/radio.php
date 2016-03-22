<?php

global $wpdb;
$table		=	$wpdb->prefix."radioforge_radio";


$isuccess = isset($_REQUEST['isuccess'])?$_REQUEST['isuccess']:"";
$ierror = isset($_REQUEST['ierror'])?$_REQUEST['ierror']:"";


if(isset($_GET['id'])){
	$id		=	$_GET['id'];
}


$usql		=	"SELECT * FROM $table WHERE id='$id'";
$uresults 	= 	$wpdb->get_row( $usql  );


$action		=	"add";
if(isset($_GET['action'])){
	$action	=	$_GET['action'];	
}

if($action=="delete") {

$delete		=	$wpdb->query(
							"DELETE FROM $table WHERE id='$id'"
						);
						
$isuccess	=	"Radio deleted successfully";						
						
}						

 

?>




<h2>Manage Radio</h2>


<strong>Radio Forge&nbsp;<a href="<?php bloginfo('url'); ?>/wp-admin/admin.php?page=radioforge_add_radio&action=update&id=0" style="background-color:#D84937; padding:5px; height:35px; color:#ffffff; font-weight:bold;">Add New</a></strong> <br /><br />



<?php if(!empty($isuccess)): ?>
        
<span style="color:green;"><?php echo $isuccess; ?></span>

<?php elseif(!empty($ierror)): ?>

<span style="color:red;"><?php echo $ierror; ?></span>
       
<?php endif ?>

<?php if($action=="preview") { ?>

<?php include("preview.php"); ?>

<?php } else { ?>

<table class="wp-list-table widefat fixed" cellspacing="0" style="margin-top:20px;">
	<thead>
	<tr>		
        <th scope="col" width="10%"><a href="#">Title</a></th>
        <th scope="col" width="10%" ><a href="#">Radio URL</a></th>
                <th scope="col" width="10%" ><a href="#">Target</a></th>
        <th scope="col" width="10%"><a href="#">Shortcode</a></th>
         
        <th scope="col" width="10%"><a href="#">Edit</a></th>	
        <th scope="col" width="10%"><a href="#">Delete</a></th>	
     </tr>
	</thead>

	<tfoot>
	<tr>
	    <th scope="col" width="10%"><a href="#">Title</a></th>
        <th scope="col" width="10%" ><a href="#">Radio URL</a></th>
        <th scope="col" width="10%" ><a href="#">Skin</a></th>
        <th scope="col" width="10%"><a href="#">Shortcode</a></th>
         
        <th scope="col" width="10%"><a href="#">Edit</a></th>	
        <th scope="col" width="10%"><a href="#">Delete</a></th>		
     </tr>
	</tfoot>

	<tbody id="the-list">
    
    <?php
		
		
		$mmm = 0;
		
		$sk=0;
		$results = $wpdb->get_results( $wpdb->prepare( "select * from $table where id != %d ", $sk ) );
		
		//echo "<pre>";  print_r($results);
		
	?>
	
    <?php 
	
	foreach($results as $result) {
	
		
    $prms = json_decode($result->params);
	
	
	?>
    <tr>
        <td><a href="<?php bloginfo('url'); ?>/wp-admin/admin.php?page=radioforge_add_radio&action=update&id=<?php echo $result->id; ?>"><?php echo $prms->title; ?></a></td>
        
        
        
        <td width="10%"><?php echo $prms->url; ?></td>
        
        <td width="10%"><?php echo $prms->skin; ?></td>
        
        <td width="10%">[radioforge id=<?php echo $result->id; ?>]</td>
         
        <td width="10%"><a href="<?php bloginfo('url'); ?>/wp-admin/admin.php?page=radioforge_add_radio&action=update&id=<?php echo $result->id; ?>">Update</a></td>
        <td width="10%"><a onclick="return confirm('Are you sure?');" href="<?php bloginfo('url'); ?>/wp-admin/admin.php?page=radioforge_radio&action=delete&id=<?php echo $result->id; ?>">Delete</a></td>
	</tr>
	<?php $mmm=1; } ?>
	
	<?php if($mmm==0) { ?>
    
    <td class="posts column-posts num" colspan="5"><a href="admin.php?page=radioforge_add_radio">Please Add Radio</a></td>
    
	<?php } ?>
  	
  </tbody>
</table>   

<?php } ?>          
