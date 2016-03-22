<aside id="off-screen-sidebar" class="hidden closed sidebar-left" data-deliverance-region="sidebar">
    <span id="off-close" class="ico-button" data-deliverance-element="close">
        <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <path d="M6.08578644,7.49719826 L0,13.5829847 L1.41421356,14.9971983 L7.5,8.91141182 L13.4378306,14.8492424 L14.8520441,13.4350288 L8.91421356,7.49719826 L14.8492424,1.56216942 L13.4350288,0.147955855 L7.5,6.0829847 L1.4170153,8.8817842e-16 L0.00280174029,1.41421356 L6.08578644,7.49719826 Z" fill="#000000"></path>
            </g>
        </svg>
    </span>
    <!-- widget -->
    <div class="widget">
        <nav>
            <?php

            $menu = wp_nav_menu(array(
                'theme_location'    => 'off_canvas_sidebar',
                'container'         => false,
                'echo'              => false
            ));

            // remove container div
            if(substr($menu, 1, 3) == 'div'){
                $menu = substr($menu, 18);
                $menu = substr($menu, 0, -7);
            }

            echo balanceTags($menu);

            ?>
        </nav>
    </div>

    <?php dynamic_sidebar('sidebar-2'); ?>
</aside>