//global packages
// browserify
// eslint
// nodemon

var gulp 				= require('gulp'),

	less 				= require('gulp-less'),
	LessPluginCleanCSS 	= require('less-plugin-clean-css'),
    cleancss 			= new LessPluginCleanCSS({ advanced: true }),

    sourcemaps 			= require('gulp-sourcemaps'),

    eslint 				= require('gulp-eslint'),
    watchify 			= require('watchify'),
    browserify 			= require('browserify'),
    babelify 			= require('babelify'),
    uglify 				= require('gulp-uglify'),

    source 				= require('vinyl-source-stream'),
    buffer 				= require('vinyl-buffer'),

    nodemon 			= require('gulp-nodemon'),

    rename 				= require('gulp-rename'),
    merge  				= require('merge-stream'),
    assign 				= require('lodash.assign')
    gutil 				= require('gulp-util'),
    chalk 				= require('chalk');


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

gulp.task('watchLess', function(){
	var lessWatch = gulp.watch('./resources/css/**/*.less', ['less']);
	lessWatch.on('change',  function(e){
		console.log('File ' + e.path + ' was ' + e.type);
	});
});


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

gulp.task('watchify', function () {
	var customOpts = {
		entries: ['./resources/js/src/index.js'],
  		debug: true
	};
	var options = assign({}, watchify.args, customOpts);
	var bundler = watchify(browserify(options)).transform(babelify, { presets: ['es2015'] });

	var scripts = function(changedFiles){
		var compileStream = bundle_js(bundler);

		if(changedFiles){
			console.log('File Changed: ', changedFiles.join(','));
			var lintStream = gulp.src(changedFiles)
				.pipe(eslint({
					configFile: './eslint.json'
				}))
				.pipe(eslint.format());

			return merge(lintStream, compileStream);
		}

		return compileStream;
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

gulp.task('browserify', function(){
	var bundler = browserify('./resources/js/src/index.js').transform(babelify, { presets: ['es2015'] });
	return bundle_js(bundler);
});


gulp.task('styleguide', function(){
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

gulp.task('build', ['browserify', 'less']);
gulp.task('watch', ['styleguide', 'watchify', 'watchLess']);