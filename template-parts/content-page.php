<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _eddie
 */

?>

<header class="entry-header">
	<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
</header><!-- .entry-header -->

<main id="main" class="content-area">
	<section id="post-<?php the_ID(); ?>" <?php post_class('entry-content '); ?>>

			<?php
				the_content();

				if(is_page_template ( 'gallery-page.php' )) {
					get_template_part( 'template-parts/modules/image', 'gallery' );
				}

				if(is_page_template ( 'video-gallery-page.php' )) {
					get_template_part( 'template-parts/modules/video', 'gallery' );
				}
			?>

	</section><!-- #post-<?php the_ID(); ?> -->

	<?php //  get_sidebar(); ?>

</main><!-- #main -->
