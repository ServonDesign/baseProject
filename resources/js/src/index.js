import poly from "./util/polyfills";

//import curry from "../vendor/ramda/curry";
//import Bricks from "../vendor/brick";

import createMlMenu from "./ui/multi-level-menu";
import svg4everybody from "../vendor/svg4everybody";
import modal from "./ui/modal";
import fontloading from "./util/font-loading";
import newFormValidation from "./form/validation";

// function brick(){
	// import Bricks

	// define your grid at different breakpoints, mobile first (smallest to largest)

	// const sizes = [
	// 	{ columns: 2, gutter: 10 },                   // assumed to be mobile, because of the missing mq property
	// 	{ mq: '768px', columns: 3, gutter: 25 },
	// 	{ mq: '1024px', columns: 4, gutter: 50 }
	// ]

	// create an instance

	// const instance = Bricks({
	// 	container: '.container',
	// 	packed:    'data-packed',        // if not prefixed with 'data-', it will be added
	// 	sizes:     sizes
	// })

	// bind callbacks

	// instance
	// .on('pack',   () => console.log('ALL grid items packed.'))
	// .on('update', () => console.log('NEW grid items packed.'))
	// .on('resize', size => console.log('The grid has be re-packed to accommodate a new BREAKPOINT.'))

	// start it up, when the DOM is ready
	// note that if images are in the grid, you may need to wait for document.readyState === 'complete'

	// instance
	// .resize(true)     // bind resize handler
	// .pack();           // pack initial items
// }

function setupMenu(){
	const menu = createMlMenu('.js-menu-test', {
		side: 'left',
		clone: false,
		breadcrumbSpacer: '<div class="ml-menu__breadcrumb-space"><svg><use xlink:href="/resources/imgs/svgsprite.svg#breadcrumb-spacer" /></svg></div>',
		subnavLinkHtml: '<svg><use xlink:href="/resources/imgs/svgsprite.svg#menu-dots" /></svg>',
		backButtonHtml: '<svg><use xlink:href="/resources/imgs/svgsprite.svg#menu-back" /></svg>',
		closeButtonHtml: '<svg><use xlink:href="/resources/imgs/svgsprite.svg#close" /></svg>'
	});

	const showMenu = document.querySelector('.js-menu-show');

	if(showMenu){
		showMenu.addEventListener('click', menu.slideInController.show);
	}
}

function setupFontLoading(){
	fontloading({
		subFonts: [
			{
				name: 'aileron_subset',
				option: {
					weight: 400
				}
			}
		],
		fullFonts: [
			{
				name: 'aileron',
				option: {
					weight: 400
				}
			},
			{
				name: 'aileron',
				option: {
					weight: 300
				}
			},
			{
				name: 'aileron',
				option: {
					weight: 200
				}
			}
		]
	});
}

document.addEventListener('DOMContentLoaded', function(evt){
	setupMenu();
	setupFontLoading();
	svg4everybody();
	modal.init(true);

	newFormValidation('.js-form-validation');
});
