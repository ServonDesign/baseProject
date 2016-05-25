//global packages = [browserify, eslint, nodemon, postcss-cli]
var gulp 		= require('gulp'),
    sourcemaps 	= require('gulp-sourcemaps'),
    watch 		= require('gulp-watch');
   

//===============================
// 		Util
//===============================
var gutil = require('gulp-util'),
    chalk = require('chalk');

function map_error(err) {
	if (err.fileName) {
		// regular error
		gutil.log(chalk.red(err.name) 
			+ ': ' 
			+ chalk.yellow(err.fileName.replace(__dirname + '/src/js/', '')) 
			+ ': ' 
			+ 'Line ' 
			+ chalk.magenta(err.lineNumber) 
			+ ' & ' 
			+ 'Column ' 
			+ chalk.magenta(err.columnNumber || err.column) 
			+ ': ' 
			+ chalk.blue(err.description));
	} else {
		// browserify error..
		gutil.log(chalk.red(err.name)
			+ ': '
			+ chalk.yellow(err.message));
	}
}


//===============================
// 		Css - Tasks
//===============================

var less 				= require('gulp-less'),
	LessPluginCleanCSS 	= require('less-plugin-clean-css'),
    cleancss 			= new LessPluginCleanCSS({ advanced: true }),
    postcss 			= require('gulp-postcss'),
    reporter 			= require('postcss-reporter'),
    postcssLess 		= require('postcss-less');

gulp.task('less', function(){
	return gulp.src(['./resources/css/main.less', './resources/css/styleguide.less'])
		.pipe(sourcemaps.init())
		.pipe(less({
			plugins: [cleancss]
		}))
		.on('error', map_error)
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./resources/css'));
});

gulp.task('stylelint', function(){
	var stylelint = require('stylelint');

	return gulp.src('./resources/css/**/*.less')
		.pipe(watch('./resources/css/**/*.less'))
		.pipe(postcss(
			[
				stylelint(),
				reporter({ clearMessages: true })
			],
			{
				syntax: postcssLess
			}
		));
});

gulp.task('doiuse', function(){
	var doiuse = require('doiuse');

	return gulp.src('./resources/css/**/*.less')
		.pipe(watch('./resources/css/**/*.less'))
		.pipe(postcss(
			[
				doiuse({
					browsers: ['ie >= 10', 'last 2 versions']
				}),
				reporter({ clearMessages: true })
			],
			{
				syntax: postcssLess
			}
		));
});

gulp.task('watch-less', function(){
	var lessWatch = gulp.watch('./resources/css/**/*.less', ['less']);
	lessWatch.on('change',  function(e){
		console.log('File ' + e.path + ' was ' + e.type);
	});
});

gulp.task('analyse-less', ['stylelint', 'doiuse']);
gulp.task('build-less', ['analyseCss', 'less'])


//===============================
// 		Javascript - Tasks
//===============================

var watchify 			= require('watchify'),
    browserify 			= require('browserify'),
    babelify 			= require('babelify'),
    uglify 				= require('gulp-uglify'),

    rename 				= require('gulp-rename'),
    merge  				= require('merge-stream'),
    assign 				= require('lodash.assign'),
    source 				= require('vinyl-source-stream'),
    buffer 				= require('vinyl-buffer');

gulp.task('watch-js', function () {
	var customOpts = {
		entries: ['./resources/js/src/index.js'],
  		debug: true
	};
	var options = assign({}, watchify.args, customOpts);
	var bundler = watchify(browserify(options)).transform(babelify, { presets: ['es2015'] });

	var scripts = function(changedFiles){
		return bundle_js(bundler);
	};

	bundler.on('update', scripts);

	return scripts();
});

function bundle_js(bundler) {
	return bundler.bundle()
		.on('error', map_error)
		.pipe(source('index.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./resources/js/dist'))
		.pipe(rename('main.min.js'))
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./resources/js/dist'));
}

gulp.task('build-js', function(){
	var bundler = browserify('./resources/js/src/index.js').transform(babelify, { presets: ['es2015'] });
	return bundle_js(bundler);
});

//===============================
// 		Style guide - Tasks
//===============================

gulp.task('styleguide', function(){
	var nodemon = require('gulp-nodemon');

	nodemon({
		script: 'index.js',
		watch: ['./components', './resources/js/dist', 'resources/css'],
		ext: 'js html css'
	})
	.on('config:update', function(){
		setTimeout(function(){
			require('open')('http://localhost:3000');
		}, 1000);
	});
});


//===============================
// 		Grouped Tasks
//===============================

gulp.task('build', ['build-js', 'build-less']);
gulp.task('watch', ['styleguide', 'watch-js', 'watch-less']);
//task: analyse-less
gulp.task('default', ["watch"]);