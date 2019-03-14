'use strict';

// site nameUrl

const siteName = 'eddie';


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


const betterRollup = require('gulp-better-rollup')
const rollUpBabel = require('rollup-plugin-babel')
const rollUpCommonjs = require('rollup-plugin-commonjs')
const rollUpNodeResolve = require('rollup-plugin-node-resolve')

const jsFiles = [
  {
    filename: 'production',
    files: [
      'js/responsive-nav.js',
      'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
      'js/app.js'
    ]
  }
]

// Set Asset Paths

const paths = {
  'css': [ './*.css', '!*.min.css' ],
  'build': 'build',
  'php': [ './*.php', './**/*.php'],
  'sass': 'sass/**/*.scss',
  'scripts': [ './js/*.js', './js/**/*.js']
}

/**
 * Handle errors and alert the user.
 */
function handleErrors(error) {
	const args = Array.prototype.slice.call( arguments );
  let errorMsg = '\n'+error.message + '\n\n'+ error.frame;

	notify.onError( {
		'title': 'Task Failed',
		'message': errorMsg,
		'sound': 'Tink' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	} ).apply( this, args );

	// Prevent the 'watch' task from stopping.
	this.emit( 'end' );
}


/**
 * Handle changes to SCSS and ouput an expanded CSS file - for debugging
**/

gulp.task('sass', function(done){
  var plugins = [
        autoprefixer()
    ];
  return gulp.src('./sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      'includePaths': ['node_modules/breakpoint-sass/stylesheets'],
			'outputStyle': 'expanded' // Options: nested, expanded, compact, compressed
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/'))
    .pipe( browserSync.stream() )
    .pipe(notify({message: 'Sass done'})),
    done();
});

gulp.task('cssmin', function(done){
  var p1_plugins = [
        autoprefixer()
    ];
  var p2_plugins = [
        cssnano()
    ];

  return gulp.src('./sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      'includePaths': ['node_modules/breakpoint-sass/stylesheets'],
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
    .pipe(notify({message: 'CSS Min done'})),
    done();
});


// gulp.task('logincss', function(done){
//   var p1_plugins = [
//         autoprefixer()
//     ];
//   var p2_plugins = [
//         cssnano()
//     ];
//
//   return gulp.src('./sass/login/login-styles.scss')
//     .pipe(sourcemaps.init())
//     .pipe(sass({
// 			'outputStyle': 'expanded' // Options: nested, expanded, compact, compressed
//     }).on('error', sass.logError))
//     .pipe(postcss(p1_plugins))
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('./build/'))
//     .pipe( browserSync.stream() )
//     .pipe(notify({message: 'Sass done'}))
//     .pipe(postcss(p2_plugins))
//     .pipe(rename({suffix: '.min'}))
//     .pipe(gulp.dest('./build/'))
//     .pipe(notify({message: 'CSS Min done'})),
//     done();
// });


/**
 * Concatenate and transform JavaScript.
 *
 * https://www.npmjs.com/package/gulp-concat
 * https://github.com/babel/gulp-babel
 * https://www.npmjs.com/package/gulp-sourcemaps
 */
gulp.task( 'concat', function(done) {

    jsFiles.map( function( entry ){
      gulp.src(entry.files)
  		// Deal with errors.
  		.pipe( plumber(
  			{'errorHandler': handleErrors}
  		) )

  		// Start a sourcemap.
  		.pipe( sourcemaps.init() )

      .pipe(betterRollup({
        plugins: [
          rollUpNodeResolve({
            module: true,
            jsnext: true,
            main: true,
            browser: true,
            extensions: ['.js'],
            preferBuiltins: true,
          }),
          rollUpCommonjs(),
          rollUpBabel(),
        ],
      }, {
        format: 'iife',
      }))

  		// Concatenate partials into a single script.
  		.pipe( concat( entry.filename + '.js' ) )

  		// Append the sourcemap to project.js.
  		.pipe( sourcemaps.write() )

  		// Save project.js
  		.pipe( gulp.dest( './build' ) )
      .pipe( rename( {'suffix': '.min'} ) )

  		.pipe( browserSync.stream() )

    }),
    done()
  });

/**
  * Minify compiled JavaScript.
  *
  * https://www.npmjs.com/package/gulp-uglify
  */
gulp.task( 'uglify', gulp.series('concat', function(done) {
    gulp.src([
      'build/*.js'
    ])
		.pipe( plumber( {'errorHandler': handleErrors} ) )
		.pipe( rename( {'suffix': '.min'} ) )
		.pipe( babel( {
			'presets': [
				['@babel/preset-env']
			]
		} ) )
		.pipe( uglify( {
			'mangle': false
		} ) )
    .pipe( gulp.dest( './build/min' ) ),
    done()
}));


/**
 * Process tasks and reload browsers on file changes.
 *
 * https://www.npmjs.com/package/browser-sync
 */
 // BrowserSync
 function browserSyncRun(done) {
   browserSync.init({
     open: true,             // Open project in a new tab?
 		injectChanges: true,     // Auto inject changes instead of full reload.
 		proxy: siteName+'.local',         // Use the local dev sute
 		watchOptions: {
 			debounceDelay: 300  // Wait 1/2 second before injecting.
 		}
   }),
   done();
 }

 // BrowserSync Reload
 function browserSyncReload(done) {
   browserSync.reload();
   done();
 }

 function watchFiles(done) {
   gulp.watch( paths.sass, gulp.series('sass', 'cssmin'));
   gulp.watch( paths.scripts, gulp.series('scripts') );
   gulp.watch( paths.php, gulp.series(browserSyncReload) );
   done();
 }

 gulp.task( 'markup', browserSync.reload );
 gulp.task( 'scripts', gulp.series('uglify') );
 gulp.task( 'default', gulp.series('cssmin', 'scripts') );
 gulp.task( 'watch', gulp.series(browserSyncRun, watchFiles ) );

gulp.task('push_dev', shell.task("rsync -av --exclude 'node_modules' ~/Websites/"+siteName+".local/wp-content/themes/"+siteName+"/. emptyhead.work:~/domains/"+siteName+".emptyhead.work/html/wp-content/themes/"+siteName+"/. && wp migratedb profile 1") )
gulp.task('push_dev_theme', shell.task("rsync -av --exclude 'node_modules' ~/Websites/"+siteName+".local/wp-content/themes/"+siteName+"/. emptyhead.work:~/domains/"+siteName+".emptyhead.work/html/wp-content/themes/"+siteName+"/."));
gulp.task('push_dev_plugins', shell.task("rsync -av ~/Websites/"+siteName+".local/wp-content/plugins/. emptyhead.work:~/domains/"+siteName+".emptyhead.work/html/wp-content/plugins/."));
gulp.task('push_dev_db', shell.task('wp migratedb profile 1'));
