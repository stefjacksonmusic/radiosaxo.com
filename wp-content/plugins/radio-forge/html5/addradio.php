<?php

global $wpdb;
$table		=	$wpdb->prefix."html5mp3_playlist";


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
						
$isuccess	=	"Playlist deleted successfully ";						
						
}						


//$mm = 2; ?>
<h2>Manage Radio</h2>


<?php if(!empty($isuccess)): ?>
        
<span style="color:green;"><?php echo $isuccess; ?></span>

<?php elseif(!empty($ierror)): ?>

<span style="color:red;"><?php echo $ierror; ?></span>
       
<?php endif ?>


<?php if($action=='update'): ?>

<?php include("formplus.php"); ?>

<?php else:?>

<?php include("formplus.php"); ?>

<?php endif ?>
                
