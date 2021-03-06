var styleguide = require('./component-styleguide');
styleguide({
	components: 'components',
    ext: 'html',
    data: 'data',
    staticLocalDir: './resources',
    staticPath: '/resources',
    stylesheets: ['css/main.css', 'css/styleguide.css'],
    scripts: ['js/style-guide/sg-svg.js', 'js/dist/index.js'],
});
