var gruntConfig = {};

var serverWatch = ['components', 'data', 'resources/js', '!resources/js/vendor', '!resources/js/src', 'resources/css'];
var serverExtWatch = 'js,html,css';
var jshintFiles = ['resources/js/**/*.js', '!resources/js/vendor/**/*.js'];
var lessFiles = {
    'resources/css/main.css': 'resources/css/main.less',
    'resources/css/styleguide.css': 'resources/css/styleguide.less'
};

gruntConfig.concurrent = {
	dev: {
		tasks: ['nodemon', 'watch'],
		options: {
			logConcurrentOutput: true
		}
	}
};

gruntConfig.nodemon = {
	dev: {
		script: 'index.js',
		options: {
			//watch: serverWatch,
			//ext: serverExtWatch,
			callback: function(nodemon){
				// nodemon.on('log', function(event){
				// 	console.log(event.colour);
				// });

				nodemon.on('config:update', function(){
					setTimeout(function(){
						require('open')('http://localhost:3000');
					}, 1000);
				});

				// nodemon.on('restart', function () {
				// 	setTimeout(function() {
				// 		require('fs').writeFileSync('.rebooted', 'rebooted');
				// 	}, 1000);
		  //       });
			}
		}
	}
};

gruntConfig.browserify = {
	dist: {
		options: {
			browserifyOptions: {
				debug: true 
			},
			transform: [
				["babelify", {
					presets: ['es2015']
				}]
			]
		},
		files: {
			"./resources/js/dist/index.js": ["./resources/js/src/index.js"]
		}
	}
};

gruntConfig.eslint = {
	scripts: {
		options: {
			configFile: './eslint.json'
		},
		src: ['./resources/js/**/*.js', '!./resources/js/vendor/**/*.js']
	}
}

gruntConfig.extract_sourcemap = {
	scripts: {
		files: {
			'./resources/js/dist/' : ['./resources/js/dist/index.js']
		}
	}
};

gruntConfig.uglify = {
	scripts: {
		options: {
			sourceMap: true,
        	sourceMapIncludeSources: true,
        	sourceMapIn: './resources/js/dist/index.js.map'
		},
		files:{
			'./resources/js/dist/main.min.js' : ['./resources/js/dist/index.js']
		}
	}
};

gruntConfig.less = {
	all:{
        options:{
            paths: ['/resources/css'],
            sourceMap: true,
            //compress: true
        },
        files: lessFiles
    }
};

gruntConfig.watch = {
	less: {
		files: ['resources/css/**/*.less'],
		tasks: ['less']
	},
	scripts: {
		files: ['./resources/js/**/*.js', '!./resources/js/vendor/**/*.js', '!./resources/js/**/*.min.js'],
		tasks: ["eslint", "browserify", "extract_sourcemap", "uglify"]
	}
};

module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);

	grunt.initConfig(gruntConfig);

	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('basic', ['watch']);

	grunt.registerTask('jsbuild', ["eslint", "browserify", "extract_sourcemap", "uglify"]);
	grunt.registerTask('lessbuild', ['less'])
};