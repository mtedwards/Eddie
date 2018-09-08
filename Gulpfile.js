'use strict';

const autoprefixer    = require( 'autoprefixer' );
const babel           = require( 'gulp-babel' );
const browserSync     = require( 'browser-sync' );
const concat          = require( 'gulp-concat' );
const cssnano         = require( 'cssnano' );
const gulp            = require( 'gulp' );
const notify          = require( 'gulp-notify' );
const plumber         = require( 'gulp-plumber' );
const postcss         = require( 'gulp-postcss' );
const reload          = browserSync.reload;
const rename          = require( 'gulp-rename' );
const sass            = require( 'gulp-sass' );
const shell           = require( 'gulp-shell' );
const sourcemaps      = require( 'gulp-sourcemaps' );
const uglify          = require( 'gulp-uglify' );

// Set Asset Paths

const paths = {
  'css': [ './*.css', '!*.min.css' ],
  'build': 'build',
  'php': [ './*.php', './**/*.php'],
  'sass': 'sass/**/*.scss',
  'scripts': 'js/*.js'
}

/**
 * Handle errors and alert the user.
 */
function handleErrors() {
	const args = Array.prototype.slice.call( arguments );

	notify.onError( {
		'title': 'Task Failed [<%= error.message %>',
		'message': 'See console.',
		'sound': 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	} ).apply( this, args );

	gutil.beep(); // Beep 'sosumi' again.

	// Prevent the 'watch' task from stopping.
	this.emit( 'end' );
}


/**
 * Handle changes to SCSS and ouput an expanded CSS file - for debugging
**/

gulp.task('sass', function(){
  var plugins = [
        autoprefixer()
    ];
  return gulp.src('./sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      'includePaths': ['node_modules/breakpoint-sass/stylesheets', 'node_modules/@fancyapps/fancybox/dist/'],
			'outputStyle': 'expanded' // Options: nested, expanded, compact, compressed
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/'))
    .pipe( browserSync.stream() )
    .pipe(notify({message: 'Sass done'}));
});

gulp.task('cssmin', function(){
  var p1_plugins = [
        autoprefixer()
    ];
  var p2_plugins = [
        cssnano()
    ];

  return gulp.src('./sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      'includePaths': ['node_modules/breakpoint-sass/stylesheets', 'node_modules/@fancyapps/fancybox/dist/'],
			'outputStyle': 'expanded' // Options: nested, expanded, compact, compressed
    }).on('error', sass.logError))
    .pipe(postcss(p1_plugins))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/'))
    .pipe( browserSync.stream() )
    .pipe(notify({message: 'Sass done'}))
    .pipe(postcss(p2_plugins))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/'))
    .pipe(notify({message: 'CSS Min done'}));
});



/**
 * Concatenate and transform JavaScript.
 *
 * https://www.npmjs.com/package/gulp-concat
 * https://github.com/babel/gulp-babel
 * https://www.npmjs.com/package/gulp-sourcemaps
 */
gulp.task( 'concat', () =>
    gulp.src([
      'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
      'js/responsive-nav.js',
      'js/app.js'
    ])

		// Deal with errors.
		.pipe( plumber(
			{'errorHandler': handleErrors}
		) )

		// Start a sourcemap.
		.pipe( sourcemaps.init() )

		// Convert ES6+ to ES2015.
		.pipe( babel( {
			'presets': [ 'env']
		} ) )

		// Concatenate partials into a single script.
		.pipe( concat( 'production.js' ) )

		// Append the sourcemap to project.js.
		.pipe( sourcemaps.write() )

		// Save project.js
		.pipe( gulp.dest( './build' ) )
		.pipe( browserSync.stream() )
);

/**
  * Minify compiled JavaScript.
  *
  * https://www.npmjs.com/package/gulp-uglify
  */
gulp.task( 'uglify', [ 'concat' ], () =>
    gulp.src([
      'build/production.js'
    ])
		.pipe( plumber( {'errorHandler': handleErrors} ) )
		.pipe( rename( {'suffix': '.min'} ) )
		.pipe( babel( {
			'presets': [
				[ 'env']
			]
		} ) )
		.pipe( uglify( {
			'mangle': false
		} ) )
		.pipe( gulp.dest( 'build' ) )
);





/**
 * Process tasks and reload browsers on file changes.
 *
 * https://www.npmjs.com/package/browser-sync
 */
gulp.task( 'watch', function() {

	// Kick off BrowserSync.
	browserSync( {
		'open': true,             // Open project in a new tab?
		'injectChanges': true,     // Auto inject changes instead of full reload.
		'proxy': 'eddie.local',         // Use the local dev sute
		'watchOptions': {
			'debounceDelay': 1000  // Wait 1 second before injecting.
		}
	} );

	// Run tasks when files change.

	gulp.watch( paths.sass, [ 'sass', 'cssmin' ] );
	gulp.watch( paths.scripts, [ 'scripts' ] );
	gulp.watch( paths.php, browserSync.reload );

});

gulp.task( 'markup', browserSync.reload );
gulp.task( 'scripts', [ 'uglify' ] );
gulp.task( 'default', [ 'cssmin', 'scripts' ] );

// gulp.task('push_dev', shell.task("rsync -av --exclude 'node_modules' ~/Websites/MGM/neglected-wp.local/wp-content/themes/neglected/. emptyhead.work:~/domains/neglected.emptyhead.work/html/wp-content/themes/neglected/. && wp migratedb profile 1") )
// gulp.task('push_dev_theme', shell.task("rsync -av --exclude 'node_modules' ~/Websites/MGM/neglected-wp.local/wp-content/themes/neglected/. emptyhead.work:~/domains/neglected.emptyhead.work/html/wp-content/themes/neglected/."));
// gulp.task('push_dev_db', shell.task('wp migratedb profile 1'));
