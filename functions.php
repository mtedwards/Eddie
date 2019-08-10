<?php
/**
 * _eddie functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package _eddie
 */

if ( ! function_exists( '_eddie_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function _eddie_setup() {
		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// add_image_size( 'name-of-size', width, height, cropped (true or false) );
		// add_image_size( 'gallery-thumb', 600, 400, true ); // 6 x 4 crop


		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'menu-1' => esc_html__( 'Primary', '_eddie' ),
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'gallery',
			'caption',
		) );

	}
endif;
add_action( 'after_setup_theme', '_eddie_setup' );


/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function _eddie_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', '_eddie' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', '_eddie' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
// add_action( 'widgets_init', '_eddie_widgets_init' );



/**
 * Enqueue scripts and styles.
 */
function _eddie_scripts() {

	$path = get_stylesheet_directory() . '/build/style.css';
	$reset = filemtime($path);

	if (strpos($_SERVER['SERVER_NAME'],'.local') !== false) {
		/* DEV SITE */
		 wp_register_style( '_eddie-style', get_template_directory_uri() . '/build/style.css', array(), $reset, 'all' );
		 wp_register_script( '_eddie-script', get_template_directory_uri() . '/build/production.js', array('jquery'), $reset, true );
	} else {
		/* NON DEV SITE */
		wp_register_style( '_eddie-style', get_template_directory_uri() . '/build/style.min.css', array(), $reset, 'all' );
		wp_register_script( '_eddie-script', get_template_directory_uri() . '/build/production.min.js', array('jquery'), $reset, true );
	}

	wp_enqueue_style('_eddie-style');
	wp_enqueue_script('_eddie-script');
}
add_action( 'wp_enqueue_scripts', '_eddie_scripts' );

/**
 * Add ACF Options page
 */
if( function_exists('acf_add_options_page') ) {

	acf_add_options_page('Theme Options');

}

/* Load Extras file*/
require get_template_directory() . '/inc/extras.php';

/* Completely Disable Comments */
require get_template_directory() . '/inc/disable-comments.php';

/* Load Hooks file */
require get_template_directory() . '/inc/hooks.php';
