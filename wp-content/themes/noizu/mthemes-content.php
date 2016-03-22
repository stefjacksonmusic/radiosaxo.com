<?php  

$columns = mthemes_get_field(array('field' => 'columns', 'is_sub' => true, 'is' => 'array'));

if($columns):
?>
<div class="region-content">
    <?php 
    foreach($columns as $column): 
        $column_classes = array('column', 'column-'.$column['column_width']);
        if($column['column_new_row']){
            $column_classes[] = 'column-clear';
        }
        ?>
        <div class="<?php echo esc_attr(implode(' ', $column_classes)) ?>">
            <div class="column-content">
                <?php echo balanceTags($column['column_content']) ?>
            </div>
        </div>
        <?php 
    endforeach;
    ?>
</div>
<?php
endif;