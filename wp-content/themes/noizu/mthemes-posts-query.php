<?php 

global $posts_query;

$posts_list_categories      = mthemes_get_field(array('field' => 'posts_list_categories', 'is' => 'array'));
$posts_list_tags_filter     = mthemes_get_field(array('field' => 'posts_list_tags_filter', 'is' => 'array'));
$posts_list_authors_filter  = mthemes_get_field(array('field' => 'posts_list_authors_filter', 'is' => 'array'));
$posts_list_posts_limit     = (int) mthemes_get_field(array('field' => 'posts_list_posts_limit', 'is' => 'numeric', 'default' => (int) get_option('posts_per_page', 15)));
$paged                      = get_query_var('page');
$paged                      = (is_int($paged))? $paged : get_query_var('paged');

if($posts_list_posts_limit < 1){
    $posts_list_posts_limit = (int) get_option('posts_per_page', 15);
}

// set query args

$query_args = array(
    'posts_per_page'    => $posts_list_posts_limit,
    'paged'             => $paged
);

if(is_array($posts_list_categories)){
    $query_args['category__in'] = $posts_list_categories;
}

if(is_array($posts_list_authors_filter)){
    $query_args['author__in'] = $posts_list_authors_filter;
}

if(is_array($posts_list_tags_filter)){
    $query_args['tag__in'] = $posts_list_tags_filter;
}

$posts_query = new WP_Query($query_args);