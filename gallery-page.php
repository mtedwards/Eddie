<?php
/**
 * Template Name: Gallery
 *
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _eddie
 */

get_header(); ?>

	<section id="primary" class="content-area-wrap container">

			<?php
			while ( have_posts() ) : the_post();

				get_template_part( 'template-parts/content', 'page' );


			endwhile; // End of the loop.
			?>

	</section><!-- #primary -->

<?php

get_footer();
