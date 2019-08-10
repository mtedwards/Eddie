<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _eddie
 */

get_header(); ?>

<section id="primary" class="">

	<?php
	if ( have_posts() ) :

		if ( is_home() && ! is_front_page() ) : ?>
			<header class="entry-header">
				<h1 class="entry-title">
					<?php single_post_title(); ?>
				</h1>
			</header>
		<?php
	endif;  ?>

	<main id="main" class="content-area">
		<section id="post-<?php the_ID(); ?>" <?php post_class('entry-content'); ?>>

		<div class="excerpt-wrap">
			<?php
					/* Start the Loop */
					while ( have_posts() ) : the_post();
						/*
						 * Include the Post-Format-specific template for the content.
						 * If you want to override this in a child theme, then include a file
						 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
						 */
						get_template_part( 'template-parts/content', 'excerpt' );

					endwhile;

					the_posts_navigation();

				else :

					get_template_part( 'template-parts/content', 'none' );

				endif; ?>
			</div>
		</section>

			<?php // get_sidebar(); ?>
		</main><!-- #main -->

</section>

<?php

 get_footer();
