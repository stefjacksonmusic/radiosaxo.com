<?php get_header(); ?>
<div id="region-404" class="region region-dark-background region-full-screen" data-deliverance-region="404">
    <div id="container-404">
        <div id="content-404" class="hidden" data-deliverance-element="content">
            <h1><?php echo mthemes_get_l10n('Page Not Found') ?></h1>
            <p><?php echo mthemes_get_l10n('the page you have requested is not here') ?></p>
            <a href="<?php echo home_url() ?>" class="border-button">start from the beginning</a>
        </div>
    </div>
</div>
<?php get_footer();