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
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on _eddie, use a find and replace
		 * to change '_eddie' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( '_eddie', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

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
		add_image_size( 'gallery-thumb', 600, 400, true ); // 6 x 4 crop


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
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

	}
endif;
add_action( 'after_setup_theme', '_eddie_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function _eddie_content_width() {
	$GLOBALS['content_width'] = apply_filters( '_eddie_content_width', 640 );
}
add_action( 'after_setup_theme', '_eddie_content_width', 0 );

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

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	wp_enqueue_style('_eddie-style');
	wp_enqueue_script('_eddie-script');
}
add_action( 'wp_enqueue_scripts', '_eddie_scripts' );

/**
 * Add ACF Options page
 */
if( function_exists('acf_add_options_page') ) {

	acf_add_options_page();

}

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

/**
 * Load WooCommerce compatibility file.
 */
if ( class_exists( 'WooCommerce' ) ) {
	require get_template_directory() . '/inc/woocommerce.php';
}

/**
 * Load Extras file
 */

require get_template_directory() . '/inc/extras.php';


/**
 * Completely Disable Comments
 */

require get_template_directory() . '/inc/disable-comments.php';


/**
 * Load Hooks file
 */

require get_template_directory() . '/inc/hooks.php';

require get_template_directory() . '/inc/video-functions.php';
