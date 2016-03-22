<?php
if ( post_password_required() )
    return;
?>
<div class="comments-area" data-deliverance-region="comments">

    <?php if ( have_comments() ) : ?>
        <h3><?php printf( _n( 'One thought on &ldquo;%2$s&rdquo;', '%1$s thoughts on &ldquo;%2$s&rdquo;', get_comments_number(), 'mthemes' ), number_format_i18n( get_comments_number() ), '<span>' . get_the_title() . '</span>' );?></h3>
        <ol class="commentlist">
            <?php 
            wp_list_comments(array(
                'style'         => 'ol', 
                'avatar_size'   => 70 
            )); 
            ?>
        </ol>
        <?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : ?>
        <nav class="navigation" role="navigation">
            <h1 class="assistive-text section-heading"><?php _e( 'Comment navigation', 'mthemes' ); ?></h1>
            <div class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments', 'mthemes' ) ); ?></div>
            <div class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;', 'mthemes' ) ); ?></div>
        </nav>
        <?php endif; // check for comment navigation ?>

        <?php
        if ( ! comments_open() && get_comments_number() ) : ?>
            <p class="nocomments"><?php _e( 'Comments are closed.' , 'mthemes' ); ?></p><?php 
        endif;

    endif;

    comment_form(); 
    ?>

</div>