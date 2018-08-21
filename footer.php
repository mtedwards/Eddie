<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _eddie
 */

?>

	</div><?php // end content-wrap ?>
	<div class="footer-wrap">
		<div class="site">
			<footer id="colophon" class="site-footer">
				<div class="site-info">
						All rights reserved &copy; <?php echo date('Y'); ?>
				</div><!-- .site-info -->
			</footer><!-- #colophon -->
		</div>
	</div><?php //end footer-wrap ?>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
