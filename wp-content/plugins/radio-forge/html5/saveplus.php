<?php
//include_once("db.php");
include_once("function.php");

global $wpdb;
$table		=	$wpdb->prefix."radioforge_radio";

if(isset($_REQUEST['id']) && $_REQUEST['id']!="")
 $id = (int) $_REQUEST['id'];
 


/*$url = isset($_REQUEST['url'])?$_REQUEST['url']:"";
$ptitle = isset($_REQUEST['ptitle'])?$_REQUEST['ptitle']:"";
$description = isset($_REQUEST['description'])?$_REQUEST['description']:"";
$bgcolor = isset($_REQUEST['bgcolor'])?$_REQUEST['bgcolor']:"";
$width = isset($_REQUEST['width'])?$_REQUEST['width']:"270";
$height = isset($_REQUEST['height'])?$_REQUEST['height']:"500";
$target = isset($_REQUEST['target'])?$_REQUEST['target']:"iframe";
$items = isset($_REQUEST['items'])?$_REQUEST['items']:"10";
$id = isset($_REQUEST['id'])?$_REQUEST['id']:"";*/

$params = json_encode($_POST);

$xml = 1;


if(isset($xml) && $xml!="")
{



$results = $wpdb->get_results( $wpdb->prepare( "select * from $table where id = %d ", $id ) );

$docid = $results[0]->id;

	if(isset($docid) && $docid!="")
	{
	
 
	  
	  
	  
		$wpdb->update( 
			$table, 
			array( 
				'params' => $params,
				'adddate' => 'now()'
			), 
			array( 'id' => $docid ), 
			array( 
				'%s',	// value1
				'%s'	// value2
			), 
			array( '%d' ) 
		);

	  
	  $iiid = $docid;
	
	}
	else
	{
	

	
	 
	  
	  
		$wpdb->insert( 
			$table, 
			array( 
				'params' => $params 
			), 
			array( 
				'%s' 
			) 
		);
	  
	  $iiid = $wpdb->insert_id;	
	
	}
	
	
	
 
	
	
	?>
    
    <script language="javascript">
    
	document.location = "<?php echo get_bloginfo('url')."/wp-admin/admin.php?page=radioforge_radio&isuccess=Radio saved successfully"; ?>";
	
	</script>
    
    <?php
	
	
 	
  $isuccess = "Radio saved successfully ";

}
else
{

   $ierror = "Something went wrong... navigate back";

}

?>