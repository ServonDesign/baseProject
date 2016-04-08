var styleguide = require('component-styleguide');
styleguide({
	components: 'components',
    ext: 'html',
    data: 'data',
    staticLocalDir: './resources',
    staticPath: '/resources',
    stylesheets: ['css/main.css', 'css/styleguide.css'],
    scripts: ['js/vendor/jquery.slim.min.js', 'js/vendor/underscore-min.js', 'js/style-guide/sg-svg.js', 'js/dist/main.min.js'],
});