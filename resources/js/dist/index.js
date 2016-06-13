(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";

var _polyfills = require("./util/polyfills");

var _polyfills2 = _interopRequireDefault(_polyfills);

var _multiLevelMenu = require("./ui/multi-level-menu");

var _multiLevelMenu2 = _interopRequireDefault(_multiLevelMenu);

var _svg4everybody = require("../vendor/svg4everybody");

var _svg4everybody2 = _interopRequireDefault(_svg4everybody);

var _modal = require("./ui/modal");

var _modal2 = _interopRequireDefault(_modal);

var _fontLoading = require("./util/font-loading");

var _fontLoading2 = _interopRequireDefault(_fontLoading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const add = (a, b) => a + b;

// const add = curry(sum);
// var increment = add(1);

// console.log(increment(10));

// console.log(brick);

// fetch('test.json')
// .then(function(response){
// 	return response.json();
// })
// .then(function(json){
// 	console.log(json);
// })
// .catch(function(err){
// 	console.log(err);
// });

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

//import {sum} from "./import";

//import curry from "../vendor/ramda/curry";
//import Bricks from "../vendor/brick";

document.addEventListener('DOMContentLoaded', function (event) {
	// instance
	// .resize(true)     // bind resize handler
	// .pack();           // pack initial items
	var menu = (0, _multiLevelMenu2.default)('.js-menu-test', {
		side: 'left',
		clone: false,
		breadcrumbSpacer: '<div class="ml-menu__breadcrumb-space"><svg><use xlink:href="/resources/imgs/svgsprite.svg#breadcrumb-spacer" /></svg></div>',
		subnavLinkHtml: '<svg><use xlink:href="/resources/imgs/svgsprite.svg#menu-dots" /></svg>',
		backButtonHtml: '<svg><use xlink:href="/resources/imgs/svgsprite.svg#menu-back" /></svg>',
		closeButtonHtml: '<svg><use xlink:href="/resources/imgs/svgsprite.svg#close" /></svg>'
	});
	var showMenu = document.querySelector('.js-menu-show');
	if (showMenu) {
		showMenu.addEventListener('click', menu.slideInController.show);
	}

	(0, _svg4everybody2.default)();

	_modal2.default.init(true);

	(0, _fontLoading2.default)({
		subFonts: [{
			name: 'aileron subset',
			option: {
				weight: 400
			}
		}],
		fullFonts: [{
			name: 'aileron',
			option: {
				weight: 400
			}
		}, {
			name: 'aileron',
			option: {
				weight: 400,
				style: 'italic'
			}
		}, {
			name: 'aileron',
			option: {
				weight: 700
			}
		}]
	});
});

},{"../vendor/svg4everybody":12,"./ui/modal":4,"./ui/multi-level-menu":5,"./util/font-loading":7,"./util/polyfills":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var transitionEndName = ['webkitTransitionEnd', 'transitionend', 'msTransitionEnd', 'oTransitionEnd'];

var DismissibleSlideIn = {
	init: init,

	show: show,
	hide: hide,
	blockClicks: blockClicks,
	onStart: onStart,
	onMove: onMove,
	onEnd: onEnd,
	onTransitionEnd: onTransitionEnd,
	update: update,
	destroy: destroy,

	addEventListeners: addEventListeners,
	removeEventListeners: removeEventListeners
};

var util = {
	extend: function extend() {
		var objects = arguments;
		if (objects.length < 2) {
			return objects[0];
		}
		var combinedObject = objects[0];

		for (var i = 1; i < objects.length; i++) {
			if (!objects[i]) {
				continue;
			}
			for (var key in objects[i]) {
				combinedObject[key] = objects[i][key];
			}
		}

		return combinedObject;
	}
};

function createSlideIn(el, options) {
	var slideIn = Object.create(DismissibleSlideIn);
	slideIn.init(el, options);
	return slideIn;
}

function init(el, options) {
	if (!el) {
		return;
	}

	this.defaultOptions = {
		isRight: false,
		closeButtonClass: 'ds-slidein__action ds-slidein__action--close',
		closeButtonHtml: 'x'
	};

	this.options = util.extend({}, this.defaultOptions, this.options, options);

	this.el = el;
	if (typeof this.el === "string") {
		this.el = document.querySelector(this.el);
	}

	if (!this.el.classList.contains('ds-slidein')) {
		this.el.classList.add('ds-slidein');
	}

	this.isRight = this.options.isRight;
	if (this.isRight) {
		this.el.classList.add('ds-slidein--right');
	}

	this.container = this.el.querySelector('.ds-slidein__container');
	if (!this.container) {
		buildContainer.call(this);
	}

	this.hideButtonEl = this.el.querySelector('.ds-slidein__action--close');
	if (!this.hideButtonEl) {
		buildHideButton.call(this);
	}

	this.show = this.show.bind(this);
	this.hide = this.hide.bind(this);
	this.blockClicks = this.blockClicks.bind(this);
	this.onStart = this.onStart.bind(this);
	this.onMove = this.onMove.bind(this);
	this.onEnd = this.onEnd.bind(this);
	this.onTransitionEnd = this.onTransitionEnd.bind(this);
	this.update = this.update.bind(this);
	this.destroy = this.destroy.bind(this);

	this.startX = 0;
	this.currentX = 0;
	this.touchingNav = false;

	this.addEventListeners();
}

function buildContainer() {
	var wrapContent = this.el.firstElementChild;
	var container = document.createElement('div');
	container.className = "ds-slidein__container";
	wrapContent.parentNode.insertBefore(container, wrapContent);
	container.appendChild(wrapContent);
	this.container = container;
}

function buildHideButton() {
	var button = document.createElement('button');
	button.className = this.options.closeButtonClass;
	button.innerHTML = this.options.closeButtonHtml;
	this.container.insertBefore(button, this.container.firstElementChild);
	this.hideButtonEl = button;
}

function addEventListeners() {
	this.hideButtonEl.addEventListener('click', this.hide);
	this.el.addEventListener('click', this.hide);
	this.container.addEventListener('click', this.blockClicks);

	this.el.addEventListener('touchstart', this.onStart);
	this.el.addEventListener('touchmove', this.onMove);
	this.el.addEventListener('touchend', this.onEnd);

	// this.el.addEventListener('mousedown', this.onStart);
	// this.el.addEventListener('mousemove', this.onMove);
	// this.el.addEventListener('mouseup', this.onEnd);
}

function removeEventListeners() {
	this.hideButtonEl.removeEventListener('click', this.hide);
	this.el.removeEventListener('click', this.hide);
	this.container.removeEventListener('click', this.blockClicks);

	this.el.removeEventListener('touchstart', this.onStart);
	this.el.removeEventListener('touchmove', this.onMove);
	this.el.removeEventListener('touchend', this.onEnd);

	// this.el.removeEventListener('mousedown', this.onStart);
	// this.el.removeEventListener('mousemove', this.onMove);
	// this.el.removeEventListener('mouseup', this.onEnd);
}

function onStart(evt) {
	if (!this.el.classList.contains('ds-slidein--visible') || this.destroyed) {
		return;
	}

	this.startX = evt.touches[0].pageX;
	//this.startX = evt.pageX || evt.touches[0].pageX;
	this.currentX = this.startX;

	this.touchingNav = true;
	requestAnimationFrame(this.update);
}

function onMove(evt) {
	if (!this.touchingNav) {
		return;
	}

	this.currentX = evt.touches[0].pageX;
	//this.currentX = evt.pageX || evt.touches[0].pageX;
	var translateX = this.currentX - this.startX;
	if (this.isRight && Math.max(0, translateX) > 0 || !this.isRight && Math.min(0, translateX) < 0) {
		evt.preventDefault();
	}
}

function onEnd() {
	if (!this.touchingNav) {
		return;
	}

	this.touchingNav = false;

	var translateX = this.currentX - this.startX;
	if (this.isRight && Math.max(0, translateX) > 0 || !this.isRight && Math.min(0, translateX) < 0) {
		this.hide();
	}
	this.container.style.transform = '';
}

function update() {
	if (!this.touchingNav) {
		return;
	}

	requestAnimationFrame(this.update);
	var translateX = this.currentX - this.startX;
	if (this.isRight) {
		translateX = Math.max(0, translateX);
	} else {
		translateX = Math.min(0, translateX);
	}

	this.container.style.transform = 'translateX(' + translateX + 'px)';
}

function destroy() {
	if (this.isRight) {
		this.el.classList.remove('ds-slidein--right');
	}
	this.removeEventListeners();
	this.destroyed = true;
}

function blockClicks(evt) {
	evt.stopPropagation();
}

function onTransitionEnd() {
	this.el.classList.remove('ds-slidein--animatable');
	for (var i = 0; i < transitionEndName.length; i++) {
		this.el.removeEventListener(transitionEndName[i], this.onTransitionEnd);
	}
}

function show() {
	if (this.destroyed) {
		return;
	}
	this.el.classList.add('ds-slidein--animatable');
	this.el.classList.add('ds-slidein--visible');
	for (var i = 0; i < transitionEndName.length; i++) {
		this.el.addEventListener(transitionEndName[i], this.onTransitionEnd);
	}
}

function hide() {
	if (this.destroyed) {
		return;
	}
	this.el.classList.add('ds-slidein--animatable');
	this.el.classList.remove('ds-slidein--visible');
	for (var i = 0; i < transitionEndName.length; i++) {
		this.el.addEventListener(transitionEndName[i], this.onTransitionEnd);
	}
}

exports.default = createSlideIn;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var modals = [],
    modalIDs = [];

var visibleClass = "modal--visible";

function init(toInitModals) {
	if (toInitModals) {
		initModals();
	}
	addEventListeners();
}

function initModals() {
	getModals();
}

function addEventListeners() {
	document.addEventListener('click', show.bind(this));
	document.addEventListener('click', hide.bind(this));
}

function getModals() {
	var modals = Array.prototype.slice.call(document.querySelectorAll('.js-modal'));
	for (var i = 0; i < modals.length; i++) {
		addModal(modals[i]);
	}
}

function addModal(el) {
	modals.push(el);
	var modalID = el.getAttribute('id') || el.getAttribute('data-id');
	modalIDs.push(modalID);
}

function setVisibleClass(visClass) {
	visibleClass = visClass;
}

function isNotModalLink(el) {
	return !el.classList.contains('js-modal-link') && !el.getAttribute('data-modal-id');
}

function show(evt) {
	if (isNotModalLink(evt.target) || !modals.length) {
		return;
	}

	evt.preventDefault();

	var modalID = void 0;
	if (evt.target.getAttribute('href')) {
		modalID = evt.target.getAttribute('href').replace('#', '');
	} else {
		modalID = evt.target.getAttribute('data-modal-id');
	}
	var index = modalIDs.indexOf(modalID);
	var modal = modals[index];
	if (modal) {
		modal.classList.add(visibleClass);
	}
}

function hide(evt) {
	if (!evt.target.classList.contains('modal__close-btn') && !evt.target.classList.contains('modal') && !evt.target.classList.contains('modal__container')) {
		return;
	}

	if (evt.target.classList.contains('modal__container')) {
		evt.stopPropagation();
		return;
	}

	evt.preventDefault();

	var modal = void 0;

	if (evt.target.classList.contains('modal__close-btn')) {
		modal = evt.target.closest('.modal');
	} else {
		modal = evt.target;
	}

	modal.classList.remove(visibleClass);
}

exports.default = {
	init: init,
	initModals: initModals,
	addModal: addModal,
	setVisibleClass: setVisibleClass
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dismissibleSlidein = require('./dismissible-slidein');

var _dismissibleSlidein2 = _interopRequireDefault(_dismissibleSlidein);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var animationEndEventName = ['animationend']; //, 'webkitAnimationEnd', 'MSAnimationEnd', 'oAnimationEnd'];

var util = {
	onEndAnimation: function onEndAnimation(el, callback) {
		var onEndCallbackFn = function onEndCallbackFn(evt) {
			if (evt.target !== this) {
				return;
			}
			for (var i = 0; i < animationEndEventName.length; i++) {
				this.removeEventListener(animationEndEventName[i], onEndCallbackFn);
			}
			if (callback && typeof callback === 'function') {
				callback.call();
			}
		};
		for (var i = 0; i < animationEndEventName.length; i++) {
			el.addEventListener(animationEndEventName[i], onEndCallbackFn);
		}
	},
	extend: function extend() {
		var objects = arguments;
		if (objects.length < 2) {
			return objects[0];
		}
		var combinedObject = objects[0];

		for (var i = 1; i < objects.length; i++) {
			if (!objects[i]) {
				continue;
			}
			for (var key in objects[i]) {
				combinedObject[key] = objects[i][key];
			}
		}

		return combinedObject;
	}
};

var MlMenu = {
	init: init,

	back: back,
	linkClick: linkClick,

	openSubMenu: openSubMenu,
	menuOut: menuOut,
	menuIn: menuIn,
	addBreadcrumb: addBreadcrumb,
	breadcrumbClick: breadcrumbClick,
	renderBreadCrumbs: renderBreadCrumbs,

	addEventListeners: addEventListeners,
	removeEventListeners: removeEventListeners
};

function createMlMenu(el, options) {
	var menu = Object.create(MlMenu);
	menu.init(el, options);
	return menu;
}

function init(el, options) {
	if (!el) {
		return;
	}

	this.menuEl = el;
	if (typeof this.menuEl === "string") {
		this.menuEl = document.querySelector(this.menuEl);
	}

	if (!this.menuEl) {
		return;
	}

	this.defaultOptions = {
		breadcrumbsCtrl: true,
		initialBreadcrumb: 'all',
		breadcrumbMaxLength: 15,
		breadcrumbSpacer: '<div class="ml-menu__breadcrumb-space">></div>',
		subnavLinkHtml: '',
		backCtrl: true,
		backButtonHtml: '<',
		itemsDelayInterval: 60,
		onItemClick: null,
		side: 'left',
		isRight: false,
		clone: false
	};

	this.options = util.extend({}, this.defaultOptions, this.options, options);

	if (this.options.side == 'right') {
		this.options.isRight = true;
	} else {
		this.options.isRight = false;
	}

	cloneNav.call(this);

	if (!this.menuEl.classList.contains('ml-menu')) {
		this.menuEl.classList.add('ml-menu');
	}

	if (typeof _dismissibleSlidein2.default !== "undefined") {
		this.slideInController = (0, _dismissibleSlidein2.default)(this.menuEl, this.options);
		this.menuContainer = this.slideInController.container;
	} else {
		this.menuContainer = this.menuEl;
	}

	var spaceWrapper = document.createElement('div');
	spaceWrapper.innerHTML = this.options.breadcrumbSpacer;
	this.breadcrumbSpacer = spaceWrapper.firstElementChild;

	this.breadcrumbs = [];
	this.breadcrumbSiblingsToRemove = null;
	this.current = 0;

	this.back = this.back.bind(this);
	this.linkClick = this.linkClick.bind(this);
	this.breadcrumbClick = this.breadcrumbClick.bind(this);
	this.renderBreadCrumbs = this.renderBreadCrumbs.bind(this);

	build.call(this);

	this.menusArr[this.current].menuEl.classList.add('ml-menu__level--current');

	this.addEventListeners();
}

function cloneNav() {
	if (!this.options.clone) {
		return;
	}

	var clonedNode = this.menuEl.cloneNode(true);
	var body = document.querySelector('body');
	body.insertBefore(clonedNode, body.firstElementChild);
	clonedNode.className = "";
	this.menuEl = clonedNode;
}

function build() {
	function init() {
		sortMenus.call(this);
		flattenAndWrapMenus.call(this);
		createHeaderWrapper.call(this);
		createBreadCrumbs.call(this);
		createBackButton.call(this);
		createSubNavLinks.call(this);
	}

	function sortMenus() {
		var setLinkData = function setLinkData(element) {
			var links = Array.prototype.slice.call(element.parentNode.querySelectorAll('.ml-menu__level > li > a:not(.ml-menu__link)'));
			var pos = 0;
			for (var i = 0; i < links.length; i++, pos++) {
				if (links[i].classList.contains('ml-menu__link')) {
					pos--;
					continue;
				}
				links[i].classList.add('ml-menu__link');
				links[i].setAttribute('data-pos', pos + 1);
			}
			return links;
		};

		var _setMenus = function setMenus(menu, parentPositionName) {
			menu.className = "ml-menu__level";
			var linkSibling = menu.parentNode.querySelector('[data-pos]');
			var currentPosition = linkSibling.getAttribute('data-pos');

			var menuName = "";
			if (parentPositionName) {
				menuName = parentPositionName + '-';
			}
			menuName += currentPosition;

			menu.setAttribute('data-menu', "menu-" + menuName);
			linkSibling.setAttribute('data-submenu', "menu-" + menuName);
			var menuItems = setLinkData(menu);

			this.menus.push(menu);
			this.menusArr.push({
				menuEl: menu,
				menuItems: menuItems
			});

			var subMenus = Array.prototype.slice.call(menu.parentNode.querySelectorAll('.ml-menu__level > li > ul:not(.ml-menu__level)'));
			for (var i = 0; i < subMenus.length; i++) {
				if (subMenus[i].classList.contains('ml-menu__level')) {
					continue;
				}
				_setMenus(subMenus[i], menuName);
			}
		};
		_setMenus = _setMenus.bind(this);

		this.menus = [];
		this.menusArr = [];

		var mainMenu = this.menuEl.querySelector('ul');
		mainMenu.setAttribute('data-menu', 'main');
		mainMenu.className = "ml-menu__level ml-menu__level--current";
		var mainMenuItems = setLinkData(mainMenu);

		this.menus.push(mainMenu);
		this.menusArr.push({
			menuEl: mainMenu,
			menuItems: mainMenuItems
		});

		var subMenus = Array.prototype.slice.call(mainMenu.parentNode.querySelectorAll('.ml-menu__level > li > ul'));
		for (var i = 0; i < subMenus.length; i++) {
			_setMenus(subMenus[i]);
		}
	}

	function flattenAndWrapMenus() {
		var wrapper = document.createElement('div');
		wrapper.className = 'ml-menu__wrap';
		for (var i = 0; i < this.menusArr.length; i++) {
			wrapper.appendChild(this.menusArr[i].menuEl);
		}
		this.menuWrapper = wrapper;
		this.menuContainer.appendChild(wrapper);
	}

	function createHeaderWrapper() {
		var headerWrapper = document.createElement('div');
		headerWrapper.className = "ml-menu__header";
		this.menuContainer.insertBefore(headerWrapper, this.menuWrapper);
		this.headerWrapper = headerWrapper;
	}

	function createBreadCrumbs() {
		if (this.options.breadcrumbsCtrl) {
			this.breadcrumbsCtrl = document.createElement('nav');
			this.breadcrumbsCtrl.className = 'ml-menu__breadcrumbs';
			this.headerWrapper.appendChild(this.breadcrumbsCtrl);
			// add initial breadcrumb
			this.addBreadcrumb(0);
		}
	}

	function createBackButton() {
		if (this.options.backCtrl) {
			this.backCtrl = document.createElement('button');
			this.backCtrl.className = 'ml-menu__action ml-menu__action--back ml-menu__action--hide';
			this.backCtrl.setAttribute('aria-label', 'Go back');
			this.backCtrl.innerHTML = this.options.backButtonHtml;
			this.headerWrapper.appendChild(this.backCtrl);
		}
	}

	function createSubNavLinks() {
		var subNavLinks = Array.prototype.slice.call(this.menuContainer.querySelectorAll('[data-submenu]'));
		subNavLinks.forEach(function (link) {
			var subNavLink = document.createElement('a');
			subNavLink.className = 'ml-menu__link--subnav';
			subNavLink.href = '#';
			if (this.options.subnavLinkHtml) {
				subNavLink.innerHTML = this.options.subnavLinkHtml;
			}
			link.parentNode.appendChild(subNavLink);
		}.bind(this));
	}

	init.call(this);
}

function addEventListeners() {
	this.menuContainer.addEventListener('click', this.linkClick);

	if (this.options.breadcrumbsCtrl) {
		this.breadcrumbsCtrl.addEventListener('click', this.breadcrumbClick);
	}

	if (this.options.backCtrl) {
		this.backCtrl.addEventListener('click', this.back);
	}
}

function removeEventListeners() {
	this.menuContainer.removeEventListener('click', this.linkClick);

	if (this.options.breadcrumbsCtrl) {
		this.breadcrumbsCtrl.addEventListener('click', this.breadcrumbClick);
	}

	if (this.options.backCtrl) {
		this.backCtrl.removeEventListener('click', this.back);
	}
}

function linkClick(evt) {
	if (!evt.target.classList.contains('ml-menu__link') && !evt.target.classList.contains('ml-menu__link--subnav')) {
		return;
	}

	var submenuTarget = evt.target.previousElementSibling,
	    submenu = submenuTarget ? submenuTarget.getAttribute('data-submenu') : '',
	    itemName = submenuTarget ? submenuTarget.innerHTML : evt.target.innerHTML,
	    pos = submenuTarget ? submenuTarget.getAttribute('data-pos') : evt.target.getAttribute('data-pos'),
	    subMenuEl = this.menuEl.querySelector('ul[data-menu="' + submenu + '"]');

	if (submenu && subMenuEl) {
		evt.preventDefault();

		this.openSubMenu(subMenuEl, pos, itemName);
	} else {
		var currentLink = this.menuEl.querySelector('.ml-menu__link--current');
		if (currentLink) {
			currentLink.classList.remove('ml-menu__link--current');
		}

		evt.target.classList.add('ml-menu__link--current');

		if (this.options.onItemClick) {
			this.options.onItemClick(evt, itemName);
		}
	}
}

function back() {
	if (this.isBackAnimating) {
		return false;
	}
	this.isBackAnimating = true;
	// current menu slides out
	this.menuOut();
	// next menu (previous menu) slides in
	var backMenu = this.menusArr[this.menusArr[this.current].backIdx].menuEl;
	this.menuIn(backMenu);

	// remove last breadcrumb
	if (this.options.breadcrumbsCtrl) {
		this.breadcrumbs.pop();
		requestAnimationFrame(this.renderBreadCrumbs);
	}
}

function openSubMenu(subMenuEl, clickPosition, subMenuName) {
	if (this.isAnimating) {
		return false;
	}
	this.isAnimating = true;

	// save "parent" menu index for back navigation
	this.menusArr[this.menus.indexOf(subMenuEl)].backIdx = this.current;
	// save "parent" menu´s name
	this.menusArr[this.menus.indexOf(subMenuEl)].name = subMenuName;
	// current menu slides out
	this.menuOut(clickPosition);
	// next menu (submenu) slides in
	this.menuIn(subMenuEl, clickPosition);
}

function breadcrumbClick(evt) {
	evt.preventDefault();

	var breadcrumb = evt.target;
	var index = breadcrumb.getAttribute('data-index');
	if (!index) {
		return false;
	}
	// do nothing if this breadcrumb is the last one in the list of breadcrumbs
	if (!breadcrumb.nextSibling || this.isAnimating) {
		return false;
	}
	this.isAnimating = true;

	// current menu slides out
	this.menuOut();
	// next menu slides in
	var nextMenu = this.menusArr[index].menuEl;
	this.menuIn(nextMenu);

	// remove breadcrumbs that are ahead
	var indexOfSiblingNode = this.breadcrumbs.indexOf(breadcrumb) + 1;
	if (~indexOfSiblingNode) {
		this.breadcrumbs = this.breadcrumbs.slice(0, indexOfSiblingNode);
		requestAnimationFrame(this.renderBreadCrumbs);
	}
}

function menuOut(clickPosition) {
	var currentMenu = this.menusArr[this.current].menuEl,
	    isBackNavigation = typeof clickPosition === "undefined" ? true : false,
	    menuItems = this.menusArr[this.current].menuItems,
	    menuItemsTotal = menuItems.length,
	    farthestIdx = clickPosition <= menuItemsTotal / 2 || isBackNavigation ? menuItemsTotal - 1 : 0;

	menuItems.forEach(function (link, pos) {
		var itemPos = link.getAttribute('data-pos');
		var item = link.parentNode;
		item.style.WebkitAnimationDelay = item.style.animationDelay = isBackNavigation ? parseInt(itemPos * this.options.itemsDelayInterval) + 'ms' : parseInt(Math.abs(clickPosition - itemPos) * this.options.itemsDelayInterval) + 'ms';
	}.bind(this));

	util.onEndAnimation(menuItems[farthestIdx].parentNode, function () {
		this.isBackAnimating = false;
	}.bind(this));

	currentMenu.classList.add(!(!isBackNavigation ^ !this.options.isRight) ? 'animate-outToRight' : 'animate-outToLeft');
}

function menuIn(nextMenuEl, clickPosition) {
	// the current menu
	var currentMenu = this.menusArr[this.current].menuEl,
	    isBackNavigation = typeof clickPosition === 'undefined' ? true : false,

	// index of the nextMenuEl
	nextMenuIdx = this.menus.indexOf(nextMenuEl),
	    nextMenuItems = this.menusArr[nextMenuIdx].menuItems,
	    nextMenuItemsTotal = nextMenuItems.length,


	// we need to reset the classes once the last item animates in
	// the "last item" is the farthest from the clicked item
	// let's calculate the index of the farthest item
	farthestIdx = clickPosition <= nextMenuItemsTotal / 2 || isBackNavigation ? nextMenuItemsTotal - 1 : 0;

	// slide in next menu items - first, set the delays for the items
	nextMenuItems.forEach(function (link, pos) {
		var itemPos = link.getAttribute('data-pos');
		var item = link.parentNode;
		item.style.WebkitAnimationDelay = item.style.animationDelay = isBackNavigation ? parseInt(itemPos * this.options.itemsDelayInterval) + 'ms' : parseInt(Math.abs(clickPosition - itemPos) * this.options.itemsDelayInterval) + 'ms';
	}.bind(this));

	util.onEndAnimation(nextMenuItems[farthestIdx].parentNode, function () {
		currentMenu.classList.remove(!(!isBackNavigation ^ !this.options.isRight) ? 'animate-outToRight' : 'animate-outToLeft');
		currentMenu.classList.remove('ml-menu__level--current');
		nextMenuEl.classList.remove(!(!isBackNavigation ^ !this.options.isRight) ? 'animate-inFromLeft' : 'animate-inFromRight');
		nextMenuEl.classList.add('ml-menu__level--current');

		//reset current
		this.current = nextMenuIdx;

		// control back button and breadcrumbs navigation elements
		if (!isBackNavigation) {
			// show back button
			if (this.options.backCtrl) {
				this.backCtrl.classList.remove('ml-menu__action--hide');
			}

			// add breadcrumb
			this.addBreadcrumb(nextMenuIdx);
		} else if (this.current === 0 && this.options.backCtrl) {
			// hide back button
			this.backCtrl.classList.add('ml-menu__action--hide');
		}

		// we can navigate again..
		this.isAnimating = false;
	}.bind(this));

	// animation class
	nextMenuEl.classList.add(!(!isBackNavigation ^ !this.options.isRight) ? 'animate-inFromLeft' : 'animate-inFromRight');
}

function addBreadcrumb(index) {
	if (!this.options.breadcrumbsCtrl) {
		return false;
	}

	var bc = document.createElement('a');
	var breadcrumbName = index ? this.menusArr[index].name : this.options.initialBreadcrumb;
	if (breadcrumbName.length > this.options.breadcrumbMaxLength) {
		breadcrumbName = breadcrumbName.substring(0, this.options.breadcrumbMaxLength).trim() + '...';
	}
	bc.innerHTML = breadcrumbName;
	bc.setAttribute('data-index', index);

	this.breadcrumbs.push(bc);
	requestAnimationFrame(this.renderBreadCrumbs);
}

function renderBreadCrumbs() {
	this.breadcrumbsCtrl.innerHTML = "";
	for (var i = 0; i < this.breadcrumbs.length; i++) {
		this.breadcrumbsCtrl.appendChild(this.breadcrumbs[i]);
		if (i < this.breadcrumbs.length - 1) {
			this.breadcrumbsCtrl.appendChild(this.breadcrumbSpacer.cloneNode(true));
		}
	}
}

exports.default = createMlMenu;

},{"./dismissible-slidein":3}],6:[function(require,module,exports){
'use strict';

// matches polyfill

window.Element && function (ElementPrototype) {
	ElementPrototype.matches = ElementPrototype.matches || ElementPrototype.matchesSelector || ElementPrototype.webkitMatchesSelector || ElementPrototype.msMatchesSelector || function (selector) {
		var node = this,
		    nodes = (node.parentNode || node.document).querySelectorAll(selector),
		    i = -1;
		while (nodes[++i] && nodes[i] != node) {}
		return !!nodes[i];
	};
}(Element.prototype);

// closest polyfill
window.Element && function (ElementPrototype) {
	ElementPrototype.closest = ElementPrototype.closest || function (selector) {
		var el = this;
		while (el.matches && !el.matches(selector)) {
			el = el.parentNode;
		}return el.matches ? el : null;
	};
}(Element.prototype);

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fontfaceobserver = require("./../../vendor/fontfaceobserver");

var _fontfaceobserver2 = _interopRequireDefault(_fontfaceobserver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var html = void 0,
    subFonts = void 0,
    fullFonts = void 0,
    subFontClass = void 0,
    fullFontClass = void 0;

function init(options) {
	if (!options) {
		options = {};
	}

	subFonts = options.subFonts || [];
	fullFonts = options.fullFonts || [];

	html = document.documentElement;
	subFontClass = options.subFontClass || "subfont-loaded";
	fullFontClass = options.subFontClass || "font-loaded";

	if (subFonts.length || fullFontClass.length) {
		runFontLoading();
	}
}

function runFontLoading() {
	if (sessionStorage.fullFontLoaded) {
		html.classList.add(fullFontClass);
	} else if (sessionStorage.subFontLoaded) {
		html.classList.add(subFontClass);
		loadFullSets();
	} else {
		loadSubsets();
	}
}

function loadSubsets() {
	if (!subFonts.length) {
		loadFullSets();
		return;
	}

	var fonts = [];
	for (var i = 0; i < subFonts.length; i++) {
		var options = subFonts[i].option || {};
		var font = new _fontfaceobserver2.default(subFonts[i].name, options);
		fonts.push(font.load());
	}

	Promise.all(fonts).then(function () {
		sessionStorage.subFontLoaded = true;
		html.classList.add(subFontClass);
		loadFullSets();
	}).catch(failedToLoadSub);
}

function loadFullSets() {
	// for large fonts push a timer (look at timer function below) to let these large font more time to load
	if (!fullFonts.length) {
		return;
	}

	var fonts = [];
	for (var i = 0; i < fullFonts.length; i++) {
		var options = fullFonts[i].option || {};
		var font = new _fontfaceobserver2.default(fullFonts[i].name, options);
		fonts.push(font.load());
	}

	Promise.all(fonts).then(function () {
		sessionStorage.fullFontLoaded = true;
		html.classList.remove(subFontClass);
		html.classList.add(fullFontClass);
	}).catch(failedToLoadFull);
}

function timer(time) {
	return new Promise(function (resolve, reject) {
		setTimeout(reject, time);
	});
}

function failedToLoadSub() {
	html.classList.remove(subFontClass);
	sessionStorage.subFontLoaded = false;
	console.error('sub-setted font failed to load!');
}

function failedToLoadFull() {
	html.classList.remove(fullFontClass);
	sessionStorage.fullFontLoaded = false;
	console.error('full-setted font failed to load!');
}

exports.default = init;

},{"./../../vendor/fontfaceobserver":11}],8:[function(require,module,exports){
"use strict";

var _es6Promise = require("../../vendor/es6-promise");

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _fetch = require("../../vendor/fetch");

var _fetch2 = _interopRequireDefault(_fetch);

var _element = require("./element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_es6Promise2.default.polyfill();

},{"../../vendor/es6-promise":9,"../../vendor/fetch":10,"./element.js":6}],9:[function(require,module,exports){
(function (process,global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.2.2+39aa2571
 */

(function () {
  "use strict";

  function lib$es6$promise$utils$$objectOrFunction(x) {
    return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
  }

  function lib$es6$promise$utils$$isFunction(x) {
    return typeof x === 'function';
  }

  function lib$es6$promise$utils$$isMaybeThenable(x) {
    return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
  }

  var lib$es6$promise$utils$$_isArray;
  if (!Array.isArray) {
    lib$es6$promise$utils$$_isArray = function lib$es6$promise$utils$$_isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  } else {
    lib$es6$promise$utils$$_isArray = Array.isArray;
  }

  var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
  var lib$es6$promise$asap$$len = 0;
  var lib$es6$promise$asap$$vertxNext;
  var lib$es6$promise$asap$$customSchedulerFn;

  var lib$es6$promise$asap$$asap = function asap(callback, arg) {
    lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
    lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
    lib$es6$promise$asap$$len += 2;
    if (lib$es6$promise$asap$$len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (lib$es6$promise$asap$$customSchedulerFn) {
        lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
      } else {
        lib$es6$promise$asap$$scheduleFlush();
      }
    }
  };

  function lib$es6$promise$asap$$setScheduler(scheduleFn) {
    lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
  }

  function lib$es6$promise$asap$$setAsap(asapFn) {
    lib$es6$promise$asap$$asap = asapFn;
  }

  var lib$es6$promise$asap$$browserWindow = typeof window !== 'undefined' ? window : undefined;
  var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
  var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
  var lib$es6$promise$asap$$isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function lib$es6$promise$asap$$useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      process.nextTick(lib$es6$promise$asap$$flush);
    };
  }

  // vertx
  function lib$es6$promise$asap$$useVertxTimer() {
    return function () {
      lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
    };
  }

  function lib$es6$promise$asap$$useMutationObserver() {
    var iterations = 0;
    var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function lib$es6$promise$asap$$useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = lib$es6$promise$asap$$flush;
    return function () {
      channel.port2.postMessage(0);
    };
  }

  function lib$es6$promise$asap$$useSetTimeout() {
    return function () {
      setTimeout(lib$es6$promise$asap$$flush, 1);
    };
  }

  var lib$es6$promise$asap$$queue = new Array(1000);
  function lib$es6$promise$asap$$flush() {
    for (var i = 0; i < lib$es6$promise$asap$$len; i += 2) {
      var callback = lib$es6$promise$asap$$queue[i];
      var arg = lib$es6$promise$asap$$queue[i + 1];

      callback(arg);

      lib$es6$promise$asap$$queue[i] = undefined;
      lib$es6$promise$asap$$queue[i + 1] = undefined;
    }

    lib$es6$promise$asap$$len = 0;
  }

  function lib$es6$promise$asap$$attemptVertx() {
    try {
      var r = require;
      var vertx = r('vertx');
      lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return lib$es6$promise$asap$$useVertxTimer();
    } catch (e) {
      return lib$es6$promise$asap$$useSetTimeout();
    }
  }

  var lib$es6$promise$asap$$scheduleFlush;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (lib$es6$promise$asap$$isNode) {
    lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
  } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
    lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
  } else if (lib$es6$promise$asap$$isWorker) {
    lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
  } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
    lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
  } else {
    lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
  }
  function lib$es6$promise$then$$then(onFulfillment, onRejection) {
    var parent = this;

    var child = new this.constructor(lib$es6$promise$$internal$$noop);

    if (child[lib$es6$promise$$internal$$PROMISE_ID] === undefined) {
      lib$es6$promise$$internal$$makePromise(child);
    }

    var state = parent._state;

    if (state) {
      var callback = arguments[state - 1];
      lib$es6$promise$asap$$asap(function () {
        lib$es6$promise$$internal$$invokeCallback(state, child, callback, parent._result);
      });
    } else {
      lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }
  var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
  function lib$es6$promise$promise$resolve$$resolve(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(lib$es6$promise$$internal$$noop);
    lib$es6$promise$$internal$$resolve(promise, object);
    return promise;
  }
  var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
  var lib$es6$promise$$internal$$PROMISE_ID = Math.random().toString(36).substring(16);

  function lib$es6$promise$$internal$$noop() {}

  var lib$es6$promise$$internal$$PENDING = void 0;
  var lib$es6$promise$$internal$$FULFILLED = 1;
  var lib$es6$promise$$internal$$REJECTED = 2;

  var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

  function lib$es6$promise$$internal$$selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function lib$es6$promise$$internal$$cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function lib$es6$promise$$internal$$getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
      return lib$es6$promise$$internal$$GET_THEN_ERROR;
    }
  }

  function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
    try {
      then.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
    lib$es6$promise$asap$$asap(function (promise) {
      var sealed = false;
      var error = lib$es6$promise$$internal$$tryThen(then, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        lib$es6$promise$$internal$$reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        lib$es6$promise$$internal$$reject(promise, error);
      }
    }, promise);
  }

  function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
    if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
      lib$es6$promise$$internal$$fulfill(promise, thenable._result);
    } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
      lib$es6$promise$$internal$$reject(promise, thenable._result);
    } else {
      lib$es6$promise$$internal$$subscribe(thenable, undefined, function (value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }, function (reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      });
    }
  }

  function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
    if (maybeThenable.constructor === promise.constructor && then === lib$es6$promise$then$$default && constructor.resolve === lib$es6$promise$promise$resolve$$default) {
      lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
    } else {
      if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
      } else if (then === undefined) {
        lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
      } else if (lib$es6$promise$utils$$isFunction(then)) {
        lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
      }
    }
  }

  function lib$es6$promise$$internal$$resolve(promise, value) {
    if (promise === value) {
      lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
    } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
      lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));
    } else {
      lib$es6$promise$$internal$$fulfill(promise, value);
    }
  }

  function lib$es6$promise$$internal$$publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    lib$es6$promise$$internal$$publish(promise);
  }

  function lib$es6$promise$$internal$$fulfill(promise, value) {
    if (promise._state !== lib$es6$promise$$internal$$PENDING) {
      return;
    }

    promise._result = value;
    promise._state = lib$es6$promise$$internal$$FULFILLED;

    if (promise._subscribers.length !== 0) {
      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
    }
  }

  function lib$es6$promise$$internal$$reject(promise, reason) {
    if (promise._state !== lib$es6$promise$$internal$$PENDING) {
      return;
    }
    promise._state = lib$es6$promise$$internal$$REJECTED;
    promise._result = reason;

    lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
  }

  function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
    var subscribers = parent._subscribers;
    var length = subscribers.length;

    parent._onerror = null;

    subscribers[length] = child;
    subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
    subscribers[length + lib$es6$promise$$internal$$REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
    }
  }

  function lib$es6$promise$$internal$$publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child,
        callback,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function lib$es6$promise$$internal$$ErrorObject() {
    this.error = null;
  }

  var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

  function lib$es6$promise$$internal$$tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
      return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
    }
  }

  function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
    var hasCallback = lib$es6$promise$utils$$isFunction(callback),
        value,
        error,
        succeeded,
        failed;

    if (hasCallback) {
      value = lib$es6$promise$$internal$$tryCatch(callback, detail);

      if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== lib$es6$promise$$internal$$PENDING) {
      // noop
    } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
  }

  function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }, function rejectPromise(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      });
    } catch (e) {
      lib$es6$promise$$internal$$reject(promise, e);
    }
  }

  var lib$es6$promise$$internal$$id = 0;
  function lib$es6$promise$$internal$$nextId() {
    return lib$es6$promise$$internal$$id++;
  }

  function lib$es6$promise$$internal$$makePromise(promise) {
    promise[lib$es6$promise$$internal$$PROMISE_ID] = lib$es6$promise$$internal$$id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function lib$es6$promise$promise$all$$all(entries) {
    return new lib$es6$promise$enumerator$$default(this, entries).promise;
  }
  var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
  function lib$es6$promise$promise$race$$race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!lib$es6$promise$utils$$isArray(entries)) {
      return new Constructor(function (resolve, reject) {
        reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }
  var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
  function lib$es6$promise$promise$reject$$reject(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(lib$es6$promise$$internal$$noop);
    lib$es6$promise$$internal$$reject(promise, reason);
    return promise;
  }
  var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

  function lib$es6$promise$promise$$needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function lib$es6$promise$promise$$needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.
      Terminology
    -----------
      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.
      A promise can be in one of three states: pending, fulfilled, or rejected.
      Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.
      Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.
        Basic Usage:
    ------------
      ```js
    var promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);
        // on failure
      reject(reason);
    });
      promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
      Advanced Usage:
    ---------------
      Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.
      ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
          function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }
      getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
      Unlike callbacks, promises are great composable primitives.
      ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON
        return values;
    });
    ```
      @class Promise
    @param {function} resolver
    Useful for tooling.
    @constructor
  */
  function lib$es6$promise$promise$$Promise(resolver) {
    this[lib$es6$promise$$internal$$PROMISE_ID] = lib$es6$promise$$internal$$nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (lib$es6$promise$$internal$$noop !== resolver) {
      typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();
      this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
    }
  }

  lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
  lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
  lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
  lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
  lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
  lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
  lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

  lib$es6$promise$promise$$Promise.prototype = {
    constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.
        ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```
        Chaining
      --------
        The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.
        ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });
        findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
        ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```
        Assimilation
      ------------
        Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.
        ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```
        If the assimliated promise rejects, then the downstream promise will also reject.
        ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```
        Simple Example
      --------------
        Synchronous Example
        ```javascript
      var result;
        try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```
        Errback Example
        ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```
        Promise Example;
        ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```
        Advanced Example
      --------------
        Synchronous Example
        ```javascript
      var author, books;
        try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```
        Errback Example
        ```js
        function foundBooks(books) {
        }
        function failure(reason) {
        }
        findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```
        Promise Example;
        ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```
        @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
    then: lib$es6$promise$then$$default,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.
        ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }
        // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }
        // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```
        @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
    'catch': function _catch(onRejection) {
      return this.then(null, onRejection);
    }
  };
  var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
  function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(lib$es6$promise$$internal$$noop);

    if (!this.promise[lib$es6$promise$$internal$$PROMISE_ID]) {
      lib$es6$promise$$internal$$makePromise(this.promise);
    }

    if (lib$es6$promise$utils$$isArray(input)) {
      this._input = input;
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        lib$es6$promise$$internal$$fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate();
        if (this._remaining === 0) {
          lib$es6$promise$$internal$$fulfill(this.promise, this._result);
        }
      }
    } else {
      lib$es6$promise$$internal$$reject(this.promise, lib$es6$promise$enumerator$$validationError());
    }
  }

  function lib$es6$promise$enumerator$$validationError() {
    return new Error('Array Methods must be provided an Array');
  }

  lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function () {
    var length = this.length;
    var input = this._input;

    for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function (entry, i) {
    var c = this._instanceConstructor;
    var resolve = c.resolve;

    if (resolve === lib$es6$promise$promise$resolve$$default) {
      var then = lib$es6$promise$$internal$$getThen(entry);

      if (then === lib$es6$promise$then$$default && entry._state !== lib$es6$promise$$internal$$PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === lib$es6$promise$promise$$default) {
        var promise = new c(lib$es6$promise$$internal$$noop);
        lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve) {
          resolve(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve(entry), i);
    }
  };

  lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function (state, i, value) {
    var promise = this.promise;

    if (promise._state === lib$es6$promise$$internal$$PENDING) {
      this._remaining--;

      if (state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      lib$es6$promise$$internal$$fulfill(promise, this._result);
    }
  };

  lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function (promise, i) {
    var enumerator = this;

    lib$es6$promise$$internal$$subscribe(promise, undefined, function (value) {
      enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
    }, function (reason) {
      enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
    });
  };
  function lib$es6$promise$polyfill$$polyfill() {
    var local;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
      return;
    }

    local.Promise = lib$es6$promise$promise$$default;
  }
  var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

  lib$es6$promise$promise$$default.Promise = lib$es6$promise$promise$$default;
  lib$es6$promise$promise$$default.polyfill = lib$es6$promise$polyfill$$default;

  /* global define:true module:true window: true */
  if (typeof define === 'function' && define['amd']) {
    define(function () {
      return lib$es6$promise$promise$$default;
    });
  } else if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = lib$es6$promise$promise$$default;
  } else if (typeof this !== 'undefined') {
    this['Promise'] = lib$es6$promise$promise$$default;
  }

  lib$es6$promise$polyfill$$default();
}).call(undefined);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":1}],10:[function(require,module,exports){
'use strict';

(function (self) {
  'use strict';

  if (self.fetch) {
    return;
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var list = this.map[name];
    if (!list) {
      list = [];
      this.map[name] = list;
    }
    list.push(value);
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    var values = this.map[normalizeName(name)];
    return values ? values[0] : null;
  };

  Headers.prototype.getAll = function (name) {
    return this.map[normalizeName(name)] || [];
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)];
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function (name) {
      this.map[name].forEach(function (value) {
        callback.call(thisArg, value, name, this);
      }, this);
    }, this);
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    return fileReaderReady(reader);
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    reader.readAsText(blob);
    return fileReaderReady(reader);
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;
      if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (!body) {
        this._bodyText = '';
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
          throw new Error('unsupported BodyInit type');
        }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        return this.blob().then(readBlobAsArrayBuffer);
      };

      this.text = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob);
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text');
        } else {
          return Promise.resolve(this._bodyText);
        }
      };
    } else {
      this.text = function () {
        var rejected = consumed(this);
        return rejected ? rejected : Promise.resolve(this._bodyText);
      };
    }

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = input;
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this);
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function headers(xhr) {
    var head = new Headers();
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n');
    pairs.forEach(function (header) {
      var split = header.trim().split(':');
      var key = split.shift().trim();
      var value = split.join(':').trim();
      head.append(key, value);
    });
    return head;
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText;
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request;
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input;
      } else {
        request = new Request(input, init);
      }

      var xhr = new XMLHttpRequest();

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL;
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL');
        }

        return;
      }

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        };
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : undefined);

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _es6Promise = require("./es6-promise");

var _es6Promise2 = _interopRequireDefault(_es6Promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $dom$SUPPORTS_ADDEVENTLISTENER$$ = !!document.addEventListener;

function $dom$addListener$$($element$$9$$, $callback$$47$$) {
	$dom$SUPPORTS_ADDEVENTLISTENER$$ ? $element$$9$$.addEventListener("scroll", $callback$$47$$, !1) : $element$$9$$.attachEvent("scroll", $callback$$47$$);
}

function $dom$waitForBody$$($callback$$48$$) {
	document.body ? $callback$$48$$() : $dom$SUPPORTS_ADDEVENTLISTENER$$ ? document.addEventListener("DOMContentLoaded", $callback$$48$$) : document.attachEvent("onreadystatechange", function () {
		"interactive" != document.readyState && "complete" != document.readyState || $callback$$48$$();
	});
}

function $fontface$Ruler$$($text$$11$$) {
	this.$a$ = document.createElement("div");
	this.$a$.setAttribute("aria-hidden", "true");
	this.$a$.appendChild(document.createTextNode($text$$11$$));
	this.$b$ = document.createElement("span");
	this.$c$ = document.createElement("span");
	this.$h$ = document.createElement("span");
	this.$f$ = document.createElement("span");
	this.$g$ = -1;
	this.$b$.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
	this.$c$.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
	this.$f$.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
	this.$h$.style.cssText = "display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";
	this.$b$.appendChild(this.$h$);
	this.$c$.appendChild(this.$f$);
	this.$a$.appendChild(this.$b$);
	this.$a$.appendChild(this.$c$);
}

function $JSCompiler_StaticMethods_setFont$$($JSCompiler_StaticMethods_setFont$self$$, $font$$3$$) {
	$JSCompiler_StaticMethods_setFont$self$$.$a$.style.cssText = "max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;left:-999px;white-space:nowrap;font:" + $font$$3$$ + ";";
}

function $JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$$($JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$) {
	var $offsetWidth$$ = $JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$a$.offsetWidth,
	    $width$$13$$ = $offsetWidth$$ + 100;
	$JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$f$.style.width = $width$$13$$ + "px";
	$JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$c$.scrollLeft = $width$$13$$;
	$JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$b$.scrollLeft = $JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$b$.scrollWidth + 100;
	return $JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$g$ !== $offsetWidth$$ ? ($JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$g$ = $offsetWidth$$, !0) : !1;
}

function $JSCompiler_StaticMethods_onResize$$($JSCompiler_StaticMethods_onResize$self$$, $callback$$50$$) {
	function $onScroll$$() {
		var $JSCompiler_StaticMethods_onScroll$self$$inline_34$$ = $that$$;
		$JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$$($JSCompiler_StaticMethods_onScroll$self$$inline_34$$) && null !== $JSCompiler_StaticMethods_onScroll$self$$inline_34$$.$a$.parentNode && $callback$$50$$($JSCompiler_StaticMethods_onScroll$self$$inline_34$$.$g$);
	}
	var $that$$ = $JSCompiler_StaticMethods_onResize$self$$;
	$dom$addListener$$($JSCompiler_StaticMethods_onResize$self$$.$b$, $onScroll$$);
	$dom$addListener$$($JSCompiler_StaticMethods_onResize$self$$.$c$, $onScroll$$);
	$JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$$($JSCompiler_StaticMethods_onResize$self$$);
}

// Input 3
function $fontface$Observer$$($family$$, $opt_descriptors$$) {
	var $descriptors$$1$$ = $opt_descriptors$$ || {};
	this.family = $family$$;
	this.style = $descriptors$$1$$.style || "normal";
	this.weight = $descriptors$$1$$.weight || "normal";
	this.stretch = $descriptors$$1$$.stretch || "normal";
}

var $fontface$Observer$HAS_WEBKIT_FALLBACK_BUG$$ = null,
    $fontface$Observer$SUPPORTS_STRETCH$$ = null,
    $fontface$Observer$SUPPORTS_NATIVE$$ = !!window.FontFace;

function $fontface$Observer$supportStretch$$() {
	if (null === $fontface$Observer$SUPPORTS_STRETCH$$) {
		var $div$$ = document.createElement("div");
		try {
			$div$$.style.font = "condensed 100px sans-serif";
		} catch ($e$$6$$) {}
		$fontface$Observer$SUPPORTS_STRETCH$$ = "" !== $div$$.style.font;
	}
	return $fontface$Observer$SUPPORTS_STRETCH$$;
}

function $JSCompiler_StaticMethods_getStyle$$($JSCompiler_StaticMethods_getStyle$self$$, $family$$1$$) {
	return [$JSCompiler_StaticMethods_getStyle$self$$.style, $JSCompiler_StaticMethods_getStyle$self$$.weight, $fontface$Observer$supportStretch$$() ? $JSCompiler_StaticMethods_getStyle$self$$.stretch : "", "100px", $family$$1$$].join(" ");
}

$fontface$Observer$$.prototype.load = function $$fontface$Observer$$$$load$($text$$12$$, $timeout$$) {
	var $that$$1$$ = this,
	    $testString$$ = $text$$12$$ || "BESbswy",
	    $timeoutValue$$ = $timeout$$ || 3E3,
	    $start$$16$$ = new Date().getTime();

	return new Promise(function ($resolve$$, $reject$$) {
		if ($fontface$Observer$SUPPORTS_NATIVE$$) {
			var $loader$$ = new Promise(function ($resolve$$1$$, $reject$$1$$) {
				function $check$$() {
					new Date().getTime() - $start$$16$$ >= $timeoutValue$$ ? $reject$$1$$() : document.fonts.load($JSCompiler_StaticMethods_getStyle$$($that$$1$$, $that$$1$$.family), $testString$$).then(function ($fonts$$) {
						1 <= $fonts$$.length ? $resolve$$1$$() : setTimeout($check$$, 25);
					}, function () {
						$reject$$1$$();
					});
				}
				$check$$();
			}),
			    $timer$$ = new Promise(function ($resolve$$2$$, $reject$$2$$) {
				setTimeout($reject$$2$$, $timeoutValue$$);
			});

			Promise.race([$timer$$, $loader$$]).then(function () {
				$resolve$$($that$$1$$);
			}, function () {
				$reject$$($that$$1$$);
			});
		} else {
			$dom$waitForBody$$(function () {
				function $check$$1$$() {
					var $JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$;

					if ($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ = -1 != $widthA$$ && -1 != $widthB$$ || -1 != $widthA$$ && -1 != $widthC$$ || -1 != $widthB$$ && -1 != $widthC$$) {
						($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ = $widthA$$ != $widthB$$ && $widthA$$ != $widthC$$ && $widthB$$ != $widthC$$) || (null === $fontface$Observer$HAS_WEBKIT_FALLBACK_BUG$$ && ($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent), $fontface$Observer$HAS_WEBKIT_FALLBACK_BUG$$ = !!$JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ && (536 > parseInt($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$[1], 10) || 536 === parseInt($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$[1], 10) && 11 >= parseInt($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$[2], 10))), $JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ = $fontface$Observer$HAS_WEBKIT_FALLBACK_BUG$$ && ($widthA$$ == $fallbackWidthA$$ && $widthB$$ == $fallbackWidthA$$ && $widthC$$ == $fallbackWidthA$$ || $widthA$$ == $fallbackWidthB$$ && $widthB$$ == $fallbackWidthB$$ && $widthC$$ == $fallbackWidthB$$ || $widthA$$ == $fallbackWidthC$$ && $widthB$$ == $fallbackWidthC$$ && $widthC$$ == $fallbackWidthC$$)), $JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ = !$JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$;
					}
					$JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ && (null !== $container$$.parentNode && $container$$.parentNode.removeChild($container$$), clearTimeout($timeoutId$$), $resolve$$($that$$1$$));
				}

				function $checkForTimeout$$() {
					if (new Date().getTime() - $start$$16$$ >= $timeoutValue$$) {
						null !== $container$$.parentNode && $container$$.parentNode.removeChild($container$$), $reject$$($that$$1$$);
					} else {
						var $hidden$$ = document.hidden;
						if (!0 === $hidden$$ || void 0 === $hidden$$) {
							$widthA$$ = $rulerA$$.$a$.offsetWidth, $widthB$$ = $rulerB$$.$a$.offsetWidth, $widthC$$ = $rulerC$$.$a$.offsetWidth, $check$$1$$();
						}
						$timeoutId$$ = setTimeout($checkForTimeout$$, 50);
					}
				}

				var $rulerA$$ = new $fontface$Ruler$$($testString$$),
				    $rulerB$$ = new $fontface$Ruler$$($testString$$),
				    $rulerC$$ = new $fontface$Ruler$$($testString$$),
				    $widthA$$ = -1,
				    $widthB$$ = -1,
				    $widthC$$ = -1,
				    $fallbackWidthA$$ = -1,
				    $fallbackWidthB$$ = -1,
				    $fallbackWidthC$$ = -1,
				    $container$$ = document.createElement("div"),
				    $timeoutId$$ = 0;

				$container$$.dir = "ltr";
				$JSCompiler_StaticMethods_setFont$$($rulerA$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, "sans-serif"));
				$JSCompiler_StaticMethods_setFont$$($rulerB$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, "serif"));
				$JSCompiler_StaticMethods_setFont$$($rulerC$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, "monospace"));
				$container$$.appendChild($rulerA$$.$a$);
				$container$$.appendChild($rulerB$$.$a$);
				$container$$.appendChild($rulerC$$.$a$);
				document.body.appendChild($container$$);
				$fallbackWidthA$$ = $rulerA$$.$a$.offsetWidth;
				$fallbackWidthB$$ = $rulerB$$.$a$.offsetWidth;
				$fallbackWidthC$$ = $rulerC$$.$a$.offsetWidth;

				$checkForTimeout$$();

				$JSCompiler_StaticMethods_onResize$$($rulerA$$, function ($width$$14$$) {
					$widthA$$ = $width$$14$$;
					$check$$1$$();
				});

				$JSCompiler_StaticMethods_setFont$$($rulerA$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, '"' + $that$$1$$.family + '",sans-serif'));
				$JSCompiler_StaticMethods_onResize$$($rulerB$$, function ($width$$15$$) {
					$widthB$$ = $width$$15$$;
					$check$$1$$();
				});

				$JSCompiler_StaticMethods_setFont$$($rulerB$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, '"' + $that$$1$$.family + '",serif'));
				$JSCompiler_StaticMethods_onResize$$($rulerC$$, function ($width$$16$$) {
					$widthC$$ = $width$$16$$;
					$check$$1$$();
				});

				$JSCompiler_StaticMethods_setFont$$($rulerC$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, '"' + $that$$1$$.family + '",monospace'));
			});
		}
	});
};

exports.default = $fontface$Observer$$;

},{"./es6-promise":9}],12:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

!function (root, factory) {
	"function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
	define([], function () {
		return root.svg4everybody = factory();
	}) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? module.exports = factory() : root.svg4everybody = factory();
}(undefined, function () {
	/*! svg4everybody v2.0.3 | github.com/jonathantneal/svg4everybody */
	function embed(svg, target) {
		// if the target exists
		if (target) {
			// create a document fragment to hold the contents of the target
			var fragment = document.createDocumentFragment(),
			    viewBox = !svg.getAttribute("viewBox") && target.getAttribute("viewBox");
			// conditionally set the viewBox on the svg
			viewBox && svg.setAttribute("viewBox", viewBox);
			// copy the contents of the clone into the fragment
			for ( // clone the target
			var clone = target.cloneNode(!0); clone.childNodes.length;) {
				fragment.appendChild(clone.firstChild);
			}
			// append the fragment into the svg
			svg.appendChild(fragment);
		}
	}
	function loadreadystatechange(xhr) {
		// listen to changes in the request
		xhr.onreadystatechange = function () {
			// if the request is ready
			if (4 === xhr.readyState) {
				// get the cached html document
				var cachedDocument = xhr._cachedDocument;
				// ensure the cached html document based on the xhr response
				cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
				xhr._embeds.splice(0).map(function (item) {
					// get the cached target
					var target = xhr._cachedTarget[item.id];
					// ensure the cached target
					target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
					// embed the target into the svg
					embed(item.svg, target);
				});
			}
		}, // test the ready state change immediately
		xhr.onreadystatechange();
	}
	function svg4everybody(rawopts) {
		function oninterval() {
			// while the index exists in the live <use> collection
			for ( // get the cached <use> index
			var index = 0; index < uses.length;) {
				// get the current <use>
				var use = uses[index],
				    svg = use.parentNode;
				if (svg && /svg/i.test(svg.nodeName)) {
					var src = use.getAttribute("xlink:href");
					if (polyfill && (!opts.validate || opts.validate(src, svg, use))) {
						// remove the <use> element
						svg.removeChild(use);
						// parse the src and get the url and id
						var srcSplit = src.split("#"),
						    url = srcSplit.shift(),
						    id = srcSplit.join("#");
						// if the link is external
						if (url.length) {
							// get the cached xhr request
							var xhr = requests[url];
							// ensure the xhr request exists
							xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
							xhr._embeds.push({
								svg: svg,
								id: id
							}), // prepare the xhr ready state change event
							loadreadystatechange(xhr);
						} else {
							// embed the local id into the svg
							embed(svg, document.getElementById(id));
						}
					}
				} else {
					// increase the index when the previous value was not "valid"
					++index;
				}
			}
			// continue the interval
			requestAnimationFrame(oninterval, 67);
		}
		var polyfill,
		    opts = Object(rawopts),
		    newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,
		    webkitUA = /\bAppleWebKit\/(\d+)\b/,
		    olderEdgeUA = /\bEdge\/12\.(\d+)\b/;
		polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537;
		// create xhr requests object
		var requests = {},
		    requestAnimationFrame = window.requestAnimationFrame || setTimeout,
		    uses = document.getElementsByTagName("use");
		// conditionally start the interval if the polyfill is active
		polyfill && oninterval();
	}
	return svg4everybody;
});

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwicmVzb3VyY2VzXFxqc1xcc3JjXFxpbmRleC5qcyIsInJlc291cmNlc1xcanNcXHNyY1xcdWlcXGRpc21pc3NpYmxlLXNsaWRlaW4uanMiLCJyZXNvdXJjZXNcXGpzXFxzcmNcXHVpXFxtb2RhbC5qcyIsInJlc291cmNlc1xcanNcXHNyY1xcdWlcXG11bHRpLWxldmVsLW1lbnUuanMiLCJyZXNvdXJjZXNcXGpzXFxzcmNcXHV0aWxcXGVsZW1lbnQuanMiLCJyZXNvdXJjZXNcXGpzXFxzcmNcXHV0aWxcXGZvbnQtbG9hZGluZy5qcyIsInJlc291cmNlc1xcanNcXHNyY1xcdXRpbFxccG9seWZpbGxzLmpzIiwicmVzb3VyY2VzXFxqc1xcdmVuZG9yXFxyZXNvdXJjZXNcXGpzXFx2ZW5kb3JcXGVzNi1wcm9taXNlLmpzIiwicmVzb3VyY2VzXFxqc1xcdmVuZG9yXFxmZXRjaC5qcyIsInJlc291cmNlc1xcanNcXHZlbmRvclxcZm9udGZhY2VvYnNlcnZlci5qcyIsInJlc291cmNlc1xcanNcXHZlbmRvclxcc3ZnNGV2ZXJ5Ym9keS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBRUEsV0FBSSxPQUFKLENBQVksSUFBWixDQUFpQjtBQUNoQixhQUFLLEdBQUw7QUFDQSxZQUFJLEVBQUo7UUFGRCxDQUZBO0FBTUEsNEJBQXFCLEdBQXJCLENBTkEsQ0FKZTtPQUFoQixNQVdPOztBQUVOLGFBQU0sR0FBTixFQUFXLFNBQVMsY0FBVCxDQUF3QixFQUF4QixDQUFYLEVBRk07T0FYUDtNQU5EO0tBRkQsTUF3Qk87O0FBRU4sT0FBRSxLQUFGLENBRk07S0F4QlA7SUFKRDs7QUFGcUIsd0JBb0NyQixDQUFzQixVQUF0QixFQUFrQyxFQUFsQyxFQXBDcUI7R0FBdEI7QUFzQ0EsTUFBSSxRQUFKO01BQWMsT0FBTyxPQUFPLE9BQVAsQ0FBUDtNQUF3QixZQUFZLHlDQUFaO01BQXVELFdBQVcsd0JBQVg7TUFBcUMsY0FBYyxxQkFBZCxDQXZDbkc7QUF3Qy9CLGFBQVcsY0FBYyxJQUFkLEdBQXFCLEtBQUssUUFBTCxHQUFnQixVQUFVLElBQVYsQ0FBZSxVQUFVLFNBQVYsQ0FBZixJQUF1QyxDQUFDLFVBQVUsU0FBVixDQUFvQixLQUFwQixDQUEwQixXQUExQixLQUEwQyxFQUExQyxDQUFELENBQStDLENBQS9DLElBQW9ELEtBQXBELElBQTZELENBQUMsVUFBVSxTQUFWLENBQW9CLEtBQXBCLENBQTBCLFFBQTFCLEtBQXVDLEVBQXZDLENBQUQsQ0FBNEMsQ0FBNUMsSUFBaUQsR0FBakQ7O0FBeENySCxNQTBDM0IsV0FBVyxFQUFYO01BQWUsd0JBQXdCLE9BQU8scUJBQVAsSUFBZ0MsVUFBaEM7TUFBNEMsT0FBTyxTQUFTLG9CQUFULENBQThCLEtBQTlCLENBQVA7O0FBMUN4RCxVQTRDL0IsSUFBWSxZQUFaLENBNUMrQjtFQUFoQztBQThDQSxRQUFPLGFBQVAsQ0F0RmtCO0NBQVgsQ0FMUiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImltcG9ydCBwb2x5IGZyb20gXCIuL3V0aWwvcG9seWZpbGxzXCI7XG4vL2ltcG9ydCB7c3VtfSBmcm9tIFwiLi9pbXBvcnRcIjtcblxuLy9pbXBvcnQgY3VycnkgZnJvbSBcIi4uL3ZlbmRvci9yYW1kYS9jdXJyeVwiO1xuLy9pbXBvcnQgQnJpY2tzIGZyb20gXCIuLi92ZW5kb3IvYnJpY2tcIjtcblxuaW1wb3J0IGNyZWF0ZU1sTWVudSBmcm9tIFwiLi91aS9tdWx0aS1sZXZlbC1tZW51XCI7XG5pbXBvcnQgc3ZnNGV2ZXJ5Ym9keSBmcm9tIFwiLi4vdmVuZG9yL3N2ZzRldmVyeWJvZHlcIjtcbmltcG9ydCBtb2RhbCBmcm9tIFwiLi91aS9tb2RhbFwiO1xuXG5pbXBvcnQgZm9udGxvYWRpbmcgZnJvbSBcIi4vdXRpbC9mb250LWxvYWRpbmdcIjtcblxuLy9jb25zdCBhZGQgPSAoYSwgYikgPT4gYSArIGI7XG5cbi8vIGNvbnN0IGFkZCA9IGN1cnJ5KHN1bSk7XG4vLyB2YXIgaW5jcmVtZW50ID0gYWRkKDEpO1xuXG4vLyBjb25zb2xlLmxvZyhpbmNyZW1lbnQoMTApKTtcblxuLy8gY29uc29sZS5sb2coYnJpY2spO1xuXG4vLyBmZXRjaCgndGVzdC5qc29uJylcbi8vIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbi8vIFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbi8vIH0pXG4vLyAudGhlbihmdW5jdGlvbihqc29uKXtcbi8vIFx0Y29uc29sZS5sb2coanNvbik7XG4vLyB9KVxuLy8gLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4vLyBcdGNvbnNvbGUubG9nKGVycik7XG4vLyB9KTtcblxuLy8gaW1wb3J0IEJyaWNrc1xuXG4vLyBkZWZpbmUgeW91ciBncmlkIGF0IGRpZmZlcmVudCBicmVha3BvaW50cywgbW9iaWxlIGZpcnN0IChzbWFsbGVzdCB0byBsYXJnZXN0KVxuXG4vLyBjb25zdCBzaXplcyA9IFtcbi8vIFx0eyBjb2x1bW5zOiAyLCBndXR0ZXI6IDEwIH0sICAgICAgICAgICAgICAgICAgIC8vIGFzc3VtZWQgdG8gYmUgbW9iaWxlLCBiZWNhdXNlIG9mIHRoZSBtaXNzaW5nIG1xIHByb3BlcnR5XG4vLyBcdHsgbXE6ICc3NjhweCcsIGNvbHVtbnM6IDMsIGd1dHRlcjogMjUgfSxcbi8vIFx0eyBtcTogJzEwMjRweCcsIGNvbHVtbnM6IDQsIGd1dHRlcjogNTAgfVxuLy8gXVxuXG4vLyBjcmVhdGUgYW4gaW5zdGFuY2VcblxuLy8gY29uc3QgaW5zdGFuY2UgPSBCcmlja3Moe1xuLy8gXHRjb250YWluZXI6ICcuY29udGFpbmVyJyxcbi8vIFx0cGFja2VkOiAgICAnZGF0YS1wYWNrZWQnLCAgICAgICAgLy8gaWYgbm90IHByZWZpeGVkIHdpdGggJ2RhdGEtJywgaXQgd2lsbCBiZSBhZGRlZFxuLy8gXHRzaXplczogICAgIHNpemVzXG4vLyB9KVxuXG4vLyBiaW5kIGNhbGxiYWNrc1xuXG4vLyBpbnN0YW5jZVxuLy8gLm9uKCdwYWNrJywgICAoKSA9PiBjb25zb2xlLmxvZygnQUxMIGdyaWQgaXRlbXMgcGFja2VkLicpKVxuLy8gLm9uKCd1cGRhdGUnLCAoKSA9PiBjb25zb2xlLmxvZygnTkVXIGdyaWQgaXRlbXMgcGFja2VkLicpKVxuLy8gLm9uKCdyZXNpemUnLCBzaXplID0+IGNvbnNvbGUubG9nKCdUaGUgZ3JpZCBoYXMgYmUgcmUtcGFja2VkIHRvIGFjY29tbW9kYXRlIGEgbmV3IEJSRUFLUE9JTlQuJykpXG5cbi8vIHN0YXJ0IGl0IHVwLCB3aGVuIHRoZSBET00gaXMgcmVhZHlcbi8vIG5vdGUgdGhhdCBpZiBpbWFnZXMgYXJlIGluIHRoZSBncmlkLCB5b3UgbWF5IG5lZWQgdG8gd2FpdCBmb3IgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZXZlbnQgPT4ge1xuXHQvLyBpbnN0YW5jZVxuXHQvLyAucmVzaXplKHRydWUpICAgICAvLyBiaW5kIHJlc2l6ZSBoYW5kbGVyXG5cdC8vIC5wYWNrKCk7ICAgICAgICAgICAvLyBwYWNrIGluaXRpYWwgaXRlbXNcblx0Y29uc3QgbWVudSA9IGNyZWF0ZU1sTWVudSgnLmpzLW1lbnUtdGVzdCcsIHtcblx0XHRzaWRlOiAnbGVmdCcsXG5cdFx0Y2xvbmU6IGZhbHNlLFxuXHRcdGJyZWFkY3J1bWJTcGFjZXI6ICc8ZGl2IGNsYXNzPVwibWwtbWVudV9fYnJlYWRjcnVtYi1zcGFjZVwiPjxzdmc+PHVzZSB4bGluazpocmVmPVwiL3Jlc291cmNlcy9pbWdzL3N2Z3Nwcml0ZS5zdmcjYnJlYWRjcnVtYi1zcGFjZXJcIiAvPjwvc3ZnPjwvZGl2PicsXG5cdFx0c3VibmF2TGlua0h0bWw6ICc8c3ZnPjx1c2UgeGxpbms6aHJlZj1cIi9yZXNvdXJjZXMvaW1ncy9zdmdzcHJpdGUuc3ZnI21lbnUtZG90c1wiIC8+PC9zdmc+Jyxcblx0XHRiYWNrQnV0dG9uSHRtbDogJzxzdmc+PHVzZSB4bGluazpocmVmPVwiL3Jlc291cmNlcy9pbWdzL3N2Z3Nwcml0ZS5zdmcjbWVudS1iYWNrXCIgLz48L3N2Zz4nLFxuXHRcdGNsb3NlQnV0dG9uSHRtbDogJzxzdmc+PHVzZSB4bGluazpocmVmPVwiL3Jlc291cmNlcy9pbWdzL3N2Z3Nwcml0ZS5zdmcjY2xvc2VcIiAvPjwvc3ZnPidcblx0fSk7XG5cdGNvbnN0IHNob3dNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1lbnUtc2hvdycpO1xuXHRpZihzaG93TWVudSl7XG5cdFx0c2hvd01lbnUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBtZW51LnNsaWRlSW5Db250cm9sbGVyLnNob3cpO1xuXHR9XG5cblx0c3ZnNGV2ZXJ5Ym9keSgpO1xuXG5cdG1vZGFsLmluaXQodHJ1ZSk7XG5cblx0Zm9udGxvYWRpbmcoe1xuXHRcdHN1YkZvbnRzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdhaWxlcm9uIHN1YnNldCcsXG5cdFx0XHRcdG9wdGlvbjoge1xuXHRcdFx0XHRcdHdlaWdodDogNDAwXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRdLFxuXHRcdGZ1bGxGb250czogW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnYWlsZXJvbicsXG5cdFx0XHRcdG9wdGlvbjoge1xuXHRcdFx0XHRcdHdlaWdodDogNDAwXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdhaWxlcm9uJyxcblx0XHRcdFx0b3B0aW9uOiB7XG5cdFx0XHRcdFx0d2VpZ2h0OiA0MDAsXG5cdFx0XHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdhaWxlcm9uJyxcblx0XHRcdFx0b3B0aW9uOiB7XG5cdFx0XHRcdFx0d2VpZ2h0OiA3MDBcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdF1cblx0fSk7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdHJhbnNpdGlvbkVuZE5hbWUgPSBbJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCAndHJhbnNpdGlvbmVuZCcsICdtc1RyYW5zaXRpb25FbmQnLCAnb1RyYW5zaXRpb25FbmQnXTtcblxuY29uc3QgRGlzbWlzc2libGVTbGlkZUluID0ge1xuXHRpbml0OiBpbml0LFxuXG5cdHNob3c6IHNob3csXG5cdGhpZGU6IGhpZGUsXG5cdGJsb2NrQ2xpY2tzOiBibG9ja0NsaWNrcyxcblx0b25TdGFydDogb25TdGFydCxcblx0b25Nb3ZlOiBvbk1vdmUsXG5cdG9uRW5kOiBvbkVuZCxcblx0b25UcmFuc2l0aW9uRW5kOiBvblRyYW5zaXRpb25FbmQsXG5cdHVwZGF0ZTogdXBkYXRlLFxuXHRkZXN0cm95OiBkZXN0cm95LFxuXG5cdGFkZEV2ZW50TGlzdGVuZXJzOiBhZGRFdmVudExpc3RlbmVycyxcblx0cmVtb3ZlRXZlbnRMaXN0ZW5lcnM6IHJlbW92ZUV2ZW50TGlzdGVuZXJzXG59O1xuXG5jb25zdCB1dGlsID0ge1xuXHRleHRlbmQ6IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc3Qgb2JqZWN0cyA9IGFyZ3VtZW50cztcblx0XHRpZihvYmplY3RzLmxlbmd0aCA8IDIpe1xuXHRcdFx0cmV0dXJuIG9iamVjdHNbMF07XG5cdFx0fVxuXHRcdGNvbnN0IGNvbWJpbmVkT2JqZWN0ID0gb2JqZWN0c1swXTtcblxuXHRcdGZvcihsZXQgaSA9IDE7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKXtcblx0XHRcdGlmKCFvYmplY3RzW2ldKXtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRmb3IobGV0IGtleSBpbiBvYmplY3RzW2ldKXtcblx0XHRcdFx0Y29tYmluZWRPYmplY3Rba2V5XSA9IG9iamVjdHNbaV1ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY29tYmluZWRPYmplY3Q7XG5cdH1cbn07XG5cblxuZnVuY3Rpb24gY3JlYXRlU2xpZGVJbihlbCwgb3B0aW9ucyl7XG5cdGNvbnN0IHNsaWRlSW4gPSBPYmplY3QuY3JlYXRlKERpc21pc3NpYmxlU2xpZGVJbik7XG5cdHNsaWRlSW4uaW5pdChlbCwgb3B0aW9ucyk7XG5cdHJldHVybiBzbGlkZUluO1xufVxuXG5mdW5jdGlvbiBpbml0KGVsLCBvcHRpb25zKXtcblx0aWYoIWVsKXtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xuXHRcdGlzUmlnaHQ6IGZhbHNlLFxuXHRcdGNsb3NlQnV0dG9uQ2xhc3M6ICdkcy1zbGlkZWluX19hY3Rpb24gZHMtc2xpZGVpbl9fYWN0aW9uLS1jbG9zZScsXG5cdFx0Y2xvc2VCdXR0b25IdG1sOiAneCdcblx0fTtcblxuXHR0aGlzLm9wdGlvbnMgPSB1dGlsLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuXHR0aGlzLmVsID0gZWw7XG5cdGlmKHR5cGVvZiB0aGlzLmVsID09PSBcInN0cmluZ1wiKXtcblx0XHR0aGlzLmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmVsKTtcblx0fVxuXG5cdGlmKCF0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygnZHMtc2xpZGVpbicpKXtcblx0XHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2RzLXNsaWRlaW4nKTtcblx0fVxuXG5cdHRoaXMuaXNSaWdodCA9IHRoaXMub3B0aW9ucy5pc1JpZ2h0O1xuXHRpZih0aGlzLmlzUmlnaHQpe1xuXHRcdHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnZHMtc2xpZGVpbi0tcmlnaHQnKTtcblx0fVxuXG5cdHRoaXMuY29udGFpbmVyID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZHMtc2xpZGVpbl9fY29udGFpbmVyJyk7XG5cdGlmKCF0aGlzLmNvbnRhaW5lcil7XG5cdFx0YnVpbGRDb250YWluZXIuY2FsbCh0aGlzKTtcblx0fVxuXG5cdHRoaXMuaGlkZUJ1dHRvbkVsID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZHMtc2xpZGVpbl9fYWN0aW9uLS1jbG9zZScpO1xuXHRpZighdGhpcy5oaWRlQnV0dG9uRWwpe1xuXHRcdGJ1aWxkSGlkZUJ1dHRvbi5jYWxsKHRoaXMpO1xuXHR9XG5cblx0dGhpcy5zaG93IFx0XHRcdFx0PSB0aGlzLnNob3cuYmluZCh0aGlzKTtcblx0dGhpcy5oaWRlIFx0XHRcdFx0PSB0aGlzLmhpZGUuYmluZCh0aGlzKTtcblx0dGhpcy5ibG9ja0NsaWNrcyBcdFx0PSB0aGlzLmJsb2NrQ2xpY2tzLmJpbmQodGhpcyk7XG5cdHRoaXMub25TdGFydCBcdFx0XHQ9IHRoaXMub25TdGFydC5iaW5kKHRoaXMpO1xuXHR0aGlzLm9uTW92ZSBcdFx0XHQ9IHRoaXMub25Nb3ZlLmJpbmQodGhpcyk7XG5cdHRoaXMub25FbmQgXHRcdFx0XHQ9IHRoaXMub25FbmQuYmluZCh0aGlzKTtcblx0dGhpcy5vblRyYW5zaXRpb25FbmQgXHQ9IHRoaXMub25UcmFuc2l0aW9uRW5kLmJpbmQodGhpcyk7XG5cdHRoaXMudXBkYXRlIFx0XHRcdD0gdGhpcy51cGRhdGUuYmluZCh0aGlzKTtcblx0dGhpcy5kZXN0cm95IFx0XHRcdD0gdGhpcy5kZXN0cm95LmJpbmQodGhpcyk7XG5cblx0dGhpcy5zdGFydFggPSAwO1xuXHR0aGlzLmN1cnJlbnRYID0gMDtcblx0dGhpcy50b3VjaGluZ05hdiA9IGZhbHNlO1xuXG5cdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRDb250YWluZXIoKXtcblx0Y29uc3Qgd3JhcENvbnRlbnQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkO1xuXHRjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZHMtc2xpZGVpbl9fY29udGFpbmVyXCI7XG5cdHdyYXBDb250ZW50LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNvbnRhaW5lciwgd3JhcENvbnRlbnQpO1xuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQod3JhcENvbnRlbnQpO1xuXHR0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbn1cblxuZnVuY3Rpb24gYnVpbGRIaWRlQnV0dG9uKCl7XG5cdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRidXR0b24uY2xhc3NOYW1lID0gdGhpcy5vcHRpb25zLmNsb3NlQnV0dG9uQ2xhc3M7XG5cdGJ1dHRvbi5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuY2xvc2VCdXR0b25IdG1sO1xuXHR0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYnV0dG9uLCB0aGlzLmNvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG5cdHRoaXMuaGlkZUJ1dHRvbkVsID0gYnV0dG9uO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycygpe1xuXHR0aGlzLmhpZGVCdXR0b25FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZSk7XG5cdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUpO1xuXHR0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYmxvY2tDbGlja3MpO1xuXG5cdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25TdGFydCk7XG5cdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vbk1vdmUpO1xuXHR0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vbkVuZCk7XG5cblx0Ly8gdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uU3RhcnQpO1xuXHQvLyB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3ZlKTtcblx0Ly8gdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbkVuZCk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCl7XG5cdHRoaXMuaGlkZUJ1dHRvbkVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlKTtcblx0dGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZSk7XG5cdHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ibG9ja0NsaWNrcyk7XG5cblx0dGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblN0YXJ0KTtcblx0dGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uTW92ZSk7XG5cdHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uRW5kKTtcblxuXHQvLyB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25TdGFydCk7XG5cdC8vIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdmUpO1xuXHQvLyB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uRW5kKTtcbn1cblxuZnVuY3Rpb24gb25TdGFydChldnQpe1xuXHRpZighdGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2RzLXNsaWRlaW4tLXZpc2libGUnKSB8fCB0aGlzLmRlc3Ryb3llZCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5zdGFydFggPWV2dC50b3VjaGVzWzBdLnBhZ2VYO1xuXHQvL3RoaXMuc3RhcnRYID0gZXZ0LnBhZ2VYIHx8IGV2dC50b3VjaGVzWzBdLnBhZ2VYO1xuXHR0aGlzLmN1cnJlbnRYID0gdGhpcy5zdGFydFg7XG5cblx0dGhpcy50b3VjaGluZ05hdiA9IHRydWU7XG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIG9uTW92ZShldnQpe1xuXHRpZighdGhpcy50b3VjaGluZ05hdil7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5jdXJyZW50WCA9ZXZ0LnRvdWNoZXNbMF0ucGFnZVg7XG5cdC8vdGhpcy5jdXJyZW50WCA9IGV2dC5wYWdlWCB8fCBldnQudG91Y2hlc1swXS5wYWdlWDtcblx0bGV0IHRyYW5zbGF0ZVggPSB0aGlzLmN1cnJlbnRYIC0gdGhpcy5zdGFydFg7XG5cdGlmKFxuXHRcdCh0aGlzLmlzUmlnaHQgJiYgTWF0aC5tYXgoMCwgdHJhbnNsYXRlWCkgPiAwKSB8fFxuXHRcdCghdGhpcy5pc1JpZ2h0ICYmIE1hdGgubWluKDAsdHJhbnNsYXRlWCkgPCAwKVxuXHQpe1xuXHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG9uRW5kKCl7XG5cdGlmKCF0aGlzLnRvdWNoaW5nTmF2KXtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR0aGlzLnRvdWNoaW5nTmF2ID0gZmFsc2U7XG5cblx0bGV0IHRyYW5zbGF0ZVggPSB0aGlzLmN1cnJlbnRYIC0gdGhpcy5zdGFydFg7XG5cdGlmKFxuXHRcdCh0aGlzLmlzUmlnaHQgJiYgTWF0aC5tYXgoMCwgdHJhbnNsYXRlWCkgPiAwKSB8fFxuXHRcdCghdGhpcy5pc1JpZ2h0ICYmIE1hdGgubWluKDAsIHRyYW5zbGF0ZVgpIDwgMClcblx0KXtcblx0XHR0aGlzLmhpZGUoKTtcblx0fVxuXHR0aGlzLmNvbnRhaW5lci5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbn1cblxuZnVuY3Rpb24gdXBkYXRlKCl7XG5cdGlmKCF0aGlzLnRvdWNoaW5nTmF2KXtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xuXHRsZXQgdHJhbnNsYXRlWCA9IHRoaXMuY3VycmVudFggLSB0aGlzLnN0YXJ0WDtcblx0aWYodGhpcy5pc1JpZ2h0KXtcblx0XHR0cmFuc2xhdGVYID0gTWF0aC5tYXgoMCwgdHJhbnNsYXRlWCk7XG5cdH1lbHNle1xuXHRcdHRyYW5zbGF0ZVggPSBNYXRoLm1pbigwLCB0cmFuc2xhdGVYKTtcblx0fVxuXG5cdHRoaXMuY29udGFpbmVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dHJhbnNsYXRlWH1weClgO1xufVxuXG5mdW5jdGlvbiBkZXN0cm95KCl7XG5cdGlmKHRoaXMuaXNSaWdodCl7XG5cdFx0dGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdkcy1zbGlkZWluLS1yaWdodCcpO1xuXHR9XG5cdHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcblx0dGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBibG9ja0NsaWNrcyhldnQpe1xuXHRldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG59XG5cbmZ1bmN0aW9uIG9uVHJhbnNpdGlvbkVuZCgpe1xuXHR0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2RzLXNsaWRlaW4tLWFuaW1hdGFibGUnKTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2l0aW9uRW5kTmFtZS5sZW5ndGg7IGkrKykge1xuXHRcdHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0cmFuc2l0aW9uRW5kTmFtZVtpXSwgdGhpcy5vblRyYW5zaXRpb25FbmQpO1xuXHR9XG5cbn1cblxuZnVuY3Rpb24gc2hvdygpe1xuXHRpZih0aGlzLmRlc3Ryb3llZCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnZHMtc2xpZGVpbi0tYW5pbWF0YWJsZScpO1xuXHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2RzLXNsaWRlaW4tLXZpc2libGUnKTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2l0aW9uRW5kTmFtZS5sZW5ndGg7IGkrKykge1xuXHRcdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcih0cmFuc2l0aW9uRW5kTmFtZVtpXSwgdGhpcy5vblRyYW5zaXRpb25FbmQpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhpZGUoKXtcblx0aWYodGhpcy5kZXN0cm95ZWQpe1xuXHRcdHJldHVybjtcblx0fVxuXHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2RzLXNsaWRlaW4tLWFuaW1hdGFibGUnKTtcblx0dGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdkcy1zbGlkZWluLS12aXNpYmxlJyk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNpdGlvbkVuZE5hbWUubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkVuZE5hbWVbaV0sIHRoaXMub25UcmFuc2l0aW9uRW5kKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTbGlkZUluO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBtb2RhbHMgPSBbXSxcblx0bW9kYWxJRHMgPSBbXTtcblxubGV0XHR2aXNpYmxlQ2xhc3MgPSBcIm1vZGFsLS12aXNpYmxlXCI7XG5cbmZ1bmN0aW9uIGluaXQodG9Jbml0TW9kYWxzKXtcblx0aWYodG9Jbml0TW9kYWxzKXtcblx0XHRpbml0TW9kYWxzKCk7XG5cdH1cblx0YWRkRXZlbnRMaXN0ZW5lcnMoKTtcbn1cblxuZnVuY3Rpb24gaW5pdE1vZGFscygpe1xuXHRnZXRNb2RhbHMoKTtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMoKXtcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaG93LmJpbmQodGhpcykpO1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhpZGUuYmluZCh0aGlzKSk7XG59XG5cbmZ1bmN0aW9uIGdldE1vZGFscygpe1xuXHRjb25zdCBtb2RhbHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtbW9kYWwnKSk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kYWxzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YWRkTW9kYWwobW9kYWxzW2ldKTtcblx0fVxufVxuXG5mdW5jdGlvbiBhZGRNb2RhbChlbCl7XG5cdG1vZGFscy5wdXNoKGVsKTtcblx0Y29uc3QgbW9kYWxJRCA9IGVsLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcblx0bW9kYWxJRHMucHVzaChtb2RhbElEKTtcbn1cblxuZnVuY3Rpb24gc2V0VmlzaWJsZUNsYXNzKHZpc0NsYXNzKXtcblx0dmlzaWJsZUNsYXNzID0gdmlzQ2xhc3M7XG59XG5cbmZ1bmN0aW9uIGlzTm90TW9kYWxMaW5rKGVsKXtcblx0cmV0dXJuICFlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLW1vZGFsLWxpbmsnKSAmJiAhZWwuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLWlkJyk7XG59XG5cbmZ1bmN0aW9uIHNob3coZXZ0KXtcblx0aWYoaXNOb3RNb2RhbExpbmsoZXZ0LnRhcmdldCkgfHwgIW1vZGFscy5sZW5ndGgpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdGxldCBtb2RhbElEO1xuXHRpZihldnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpKXtcblx0XHRtb2RhbElEID0gZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5yZXBsYWNlKCcjJywgJycpO1xuXHR9ZWxzZXtcblx0XHRtb2RhbElEID0gZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtaWQnKTtcblx0fVxuXHRjb25zdCBpbmRleCA9IG1vZGFsSURzLmluZGV4T2YobW9kYWxJRCk7XG5cdGNvbnN0IG1vZGFsID0gbW9kYWxzW2luZGV4XTtcblx0aWYobW9kYWwpe1xuXHRcdG1vZGFsLmNsYXNzTGlzdC5hZGQodmlzaWJsZUNsYXNzKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoaWRlKGV2dCl7XG5cdGlmKCFldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWxfX2Nsb3NlLWJ0bicpICYmXG5cdFx0IWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbCcpICYmXG5cdFx0IWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbF9fY29udGFpbmVyJylcblx0XHQpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmKGV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbF9fY29udGFpbmVyJykpe1xuXHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRldnQucHJldmVudERlZmF1bHQoKTtcblxuXHRsZXQgbW9kYWw7XG5cblx0aWYoZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsX19jbG9zZS1idG4nKSl7XG5cdFx0bW9kYWwgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbCcpO1xuXHR9ZWxzZXtcblx0XHRtb2RhbCA9IGV2dC50YXJnZXQ7XG5cdH1cblxuXHRtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKHZpc2libGVDbGFzcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdDogaW5pdCxcblx0aW5pdE1vZGFsczogaW5pdE1vZGFscyxcblx0YWRkTW9kYWw6IGFkZE1vZGFsLFxuXHRzZXRWaXNpYmxlQ2xhc3M6IHNldFZpc2libGVDbGFzc1xufTtcbiIsImltcG9ydCBjcmVhdGVTbGlkZUluIGZyb20gJy4vZGlzbWlzc2libGUtc2xpZGVpbic7XG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgYW5pbWF0aW9uRW5kRXZlbnROYW1lID0gWydhbmltYXRpb25lbmQnXTsvLywgJ3dlYmtpdEFuaW1hdGlvbkVuZCcsICdNU0FuaW1hdGlvbkVuZCcsICdvQW5pbWF0aW9uRW5kJ107XG5cbmNvbnN0IHV0aWwgPSB7XG5cdG9uRW5kQW5pbWF0aW9uOiBmdW5jdGlvbihlbCwgY2FsbGJhY2spe1xuXHRcdGNvbnN0IG9uRW5kQ2FsbGJhY2tGbiA9IGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHRpZihldnQudGFyZ2V0ICE9PSB0aGlzKXtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhbmltYXRpb25FbmRFdmVudE5hbWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZEV2ZW50TmFtZVtpXSwgb25FbmRDYWxsYmFja0ZuKTtcblx0XHRcdH1cblx0XHRcdGlmKGNhbGxiYWNrICYmIHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwoKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYW5pbWF0aW9uRW5kRXZlbnROYW1lLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZEV2ZW50TmFtZVtpXSwgb25FbmRDYWxsYmFja0ZuKTtcblx0XHR9XG5cdH0sXG5cdGV4dGVuZDogZnVuY3Rpb24oKXtcblx0XHRjb25zdCBvYmplY3RzID0gYXJndW1lbnRzO1xuXHRcdGlmKG9iamVjdHMubGVuZ3RoIDwgMil7XG5cdFx0XHRyZXR1cm4gb2JqZWN0c1swXTtcblx0XHR9XG5cdFx0Y29uc3QgY29tYmluZWRPYmplY3QgPSBvYmplY3RzWzBdO1xuXG5cdFx0Zm9yKGxldCBpID0gMTsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0aWYoIW9iamVjdHNbaV0pe1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGZvcihsZXQga2V5IGluIG9iamVjdHNbaV0pe1xuXHRcdFx0XHRjb21iaW5lZE9iamVjdFtrZXldID0gb2JqZWN0c1tpXVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjb21iaW5lZE9iamVjdDtcblx0fVxufTtcblxuY29uc3QgTWxNZW51ID0ge1xuXHRpbml0OiBpbml0LFxuXG5cdGJhY2s6IGJhY2ssXG5cdGxpbmtDbGljazogbGlua0NsaWNrLFxuXG5cdG9wZW5TdWJNZW51OiBvcGVuU3ViTWVudSxcblx0bWVudU91dDogbWVudU91dCxcblx0bWVudUluOiBtZW51SW4sXG5cdGFkZEJyZWFkY3J1bWI6IGFkZEJyZWFkY3J1bWIsXG5cdGJyZWFkY3J1bWJDbGljazogYnJlYWRjcnVtYkNsaWNrLFxuXHRyZW5kZXJCcmVhZENydW1iczogcmVuZGVyQnJlYWRDcnVtYnMsXG5cblx0YWRkRXZlbnRMaXN0ZW5lcnM6IGFkZEV2ZW50TGlzdGVuZXJzLFxuXHRyZW1vdmVFdmVudExpc3RlbmVyczogcmVtb3ZlRXZlbnRMaXN0ZW5lcnNcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWxNZW51KGVsLCBvcHRpb25zKXtcblx0Y29uc3QgbWVudSA9IE9iamVjdC5jcmVhdGUoTWxNZW51KTtcblx0bWVudS5pbml0KGVsLCBvcHRpb25zKTtcblx0cmV0dXJuIG1lbnU7XG59XG5cbmZ1bmN0aW9uIGluaXQoZWwsIG9wdGlvbnMpe1xuXHRpZighZWwpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMubWVudUVsID0gZWw7XG5cdGlmKHR5cGVvZiB0aGlzLm1lbnVFbCA9PT0gXCJzdHJpbmdcIil7XG5cdFx0dGhpcy5tZW51RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMubWVudUVsKTtcblx0fVxuXG5cdGlmKCF0aGlzLm1lbnVFbCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRicmVhZGNydW1ic0N0cmw6IHRydWUsXG5cdFx0aW5pdGlhbEJyZWFkY3J1bWI6ICdhbGwnLFxuXHRcdGJyZWFkY3J1bWJNYXhMZW5ndGg6IDE1LFxuXHRcdGJyZWFkY3J1bWJTcGFjZXI6ICc8ZGl2IGNsYXNzPVwibWwtbWVudV9fYnJlYWRjcnVtYi1zcGFjZVwiPj48L2Rpdj4nLFxuXHRcdHN1Ym5hdkxpbmtIdG1sOiAnJyxcblx0XHRiYWNrQ3RybDogdHJ1ZSxcblx0XHRiYWNrQnV0dG9uSHRtbDogJzwnLFxuXHRcdGl0ZW1zRGVsYXlJbnRlcnZhbDogNjAsXG5cdFx0b25JdGVtQ2xpY2s6IG51bGwsXG5cdFx0c2lkZTogJ2xlZnQnLFxuXHRcdGlzUmlnaHQ6IGZhbHNlLFxuXHRcdGNsb25lOiBmYWxzZVxuXHR9O1xuXG5cdHRoaXMub3B0aW9ucyA9IHV0aWwuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG5cdGlmKHRoaXMub3B0aW9ucy5zaWRlID09ICdyaWdodCcpe1xuXHRcdHRoaXMub3B0aW9ucy5pc1JpZ2h0ID0gdHJ1ZTtcblx0fWVsc2V7XG5cdFx0dGhpcy5vcHRpb25zLmlzUmlnaHQgPSBmYWxzZTtcblx0fVxuXG5cdGNsb25lTmF2LmNhbGwodGhpcyk7XG5cblx0aWYoIXRoaXMubWVudUVsLmNsYXNzTGlzdC5jb250YWlucygnbWwtbWVudScpKXtcblx0XHR0aGlzLm1lbnVFbC5jbGFzc0xpc3QuYWRkKCdtbC1tZW51Jyk7XG5cdH1cblxuXHRpZih0eXBlb2YgY3JlYXRlU2xpZGVJbiAhPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0dGhpcy5zbGlkZUluQ29udHJvbGxlciA9IGNyZWF0ZVNsaWRlSW4odGhpcy5tZW51RWwsIHRoaXMub3B0aW9ucyk7XG5cdFx0dGhpcy5tZW51Q29udGFpbmVyID0gdGhpcy5zbGlkZUluQ29udHJvbGxlci5jb250YWluZXI7XG5cdH1lbHNle1xuXHRcdHRoaXMubWVudUNvbnRhaW5lciA9IHRoaXMubWVudUVsO1xuXHR9XG5cblx0Y29uc3Qgc3BhY2VXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdHNwYWNlV3JhcHBlci5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYlNwYWNlcjtcblx0dGhpcy5icmVhZGNydW1iU3BhY2VyID0gc3BhY2VXcmFwcGVyLmZpcnN0RWxlbWVudENoaWxkO1xuXG5cdHRoaXMuYnJlYWRjcnVtYnMgPSBbXTtcblx0dGhpcy5icmVhZGNydW1iU2libGluZ3NUb1JlbW92ZSA9IG51bGw7XG5cdHRoaXMuY3VycmVudCA9IDA7XG5cblx0dGhpcy5iYWNrIFx0XHRcdFx0PSB0aGlzLmJhY2suYmluZCh0aGlzKTtcblx0dGhpcy5saW5rQ2xpY2tcdFx0XHQ9IHRoaXMubGlua0NsaWNrLmJpbmQodGhpcyk7XG5cdHRoaXMuYnJlYWRjcnVtYkNsaWNrIFx0PSB0aGlzLmJyZWFkY3J1bWJDbGljay5iaW5kKHRoaXMpO1xuXHR0aGlzLnJlbmRlckJyZWFkQ3J1bWJzXHQ9IHRoaXMucmVuZGVyQnJlYWRDcnVtYnMuYmluZCh0aGlzKTtcblxuXHRidWlsZC5jYWxsKHRoaXMpO1xuXG5cdHRoaXMubWVudXNBcnJbdGhpcy5jdXJyZW50XS5tZW51RWwuY2xhc3NMaXN0LmFkZCgnbWwtbWVudV9fbGV2ZWwtLWN1cnJlbnQnKTtcblxuXHR0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG59XG5cbmZ1bmN0aW9uIGNsb25lTmF2KCl7XG5cdGlmKCF0aGlzLm9wdGlvbnMuY2xvbmUpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGNsb25lZE5vZGUgPSB0aGlzLm1lbnVFbC5jbG9uZU5vZGUodHJ1ZSk7XG5cdGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cdGJvZHkuaW5zZXJ0QmVmb3JlKGNsb25lZE5vZGUsIGJvZHkuZmlyc3RFbGVtZW50Q2hpbGQpO1xuXHRjbG9uZWROb2RlLmNsYXNzTmFtZSA9IFwiXCI7XG5cdHRoaXMubWVudUVsID0gY2xvbmVkTm9kZTtcbn1cblxuZnVuY3Rpb24gYnVpbGQoKXtcblx0ZnVuY3Rpb24gaW5pdCgpe1xuXHRcdHNvcnRNZW51cy5jYWxsKHRoaXMpO1xuXHRcdGZsYXR0ZW5BbmRXcmFwTWVudXMuY2FsbCh0aGlzKTtcblx0XHRjcmVhdGVIZWFkZXJXcmFwcGVyLmNhbGwodGhpcyk7XG5cdFx0Y3JlYXRlQnJlYWRDcnVtYnMuY2FsbCh0aGlzKTtcblx0XHRjcmVhdGVCYWNrQnV0dG9uLmNhbGwodGhpcyk7XG5cdFx0Y3JlYXRlU3ViTmF2TGlua3MuY2FsbCh0aGlzKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNvcnRNZW51cygpe1xuXHRcdGNvbnN0IHNldExpbmtEYXRhID0gZnVuY3Rpb24oZWxlbWVudCl7XG5cdFx0XHRjb25zdCBsaW5rcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsZW1lbnQucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcubWwtbWVudV9fbGV2ZWwgPiBsaSA+IGE6bm90KC5tbC1tZW51X19saW5rKScpKTtcblx0XHRcdGxldCBwb3MgPSAwO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaW5rcy5sZW5ndGg7IGkrKywgcG9zKyspIHtcblx0XHRcdFx0aWYobGlua3NbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtbC1tZW51X19saW5rJykpe1xuXHRcdFx0XHRcdHBvcy0tO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpbmtzW2ldLmNsYXNzTGlzdC5hZGQoJ21sLW1lbnVfX2xpbmsnKTtcblx0XHRcdFx0bGlua3NbaV0uc2V0QXR0cmlidXRlKCdkYXRhLXBvcycsIHBvcyArIDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGxpbmtzO1xuXHRcdH07XG5cblx0XHRsZXQgc2V0TWVudXMgPSBmdW5jdGlvbihtZW51LCBwYXJlbnRQb3NpdGlvbk5hbWUpe1xuXHRcdFx0bWVudS5jbGFzc05hbWUgPSBcIm1sLW1lbnVfX2xldmVsXCI7XG5cdFx0XHRjb25zdCBsaW5rU2libGluZyA9IG1lbnUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wb3NdJyk7XG5cdFx0XHRsZXQgY3VycmVudFBvc2l0aW9uID0gbGlua1NpYmxpbmcuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcycpO1xuXG5cdFx0XHRsZXQgbWVudU5hbWUgPSBcIlwiO1xuXHRcdFx0aWYocGFyZW50UG9zaXRpb25OYW1lKXtcblx0XHRcdFx0bWVudU5hbWUgPSBwYXJlbnRQb3NpdGlvbk5hbWUgKyAnLSc7XG5cdFx0XHR9XG5cdFx0XHRtZW51TmFtZSArPSBjdXJyZW50UG9zaXRpb247XG5cblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCdkYXRhLW1lbnUnLCBcIm1lbnUtXCIrbWVudU5hbWUpO1xuXHRcdFx0bGlua1NpYmxpbmcuc2V0QXR0cmlidXRlKCdkYXRhLXN1Ym1lbnUnLCBcIm1lbnUtXCIrbWVudU5hbWUpO1xuXHRcdFx0Y29uc3QgbWVudUl0ZW1zID0gc2V0TGlua0RhdGEobWVudSk7XG5cblx0XHRcdHRoaXMubWVudXMucHVzaChtZW51KTtcblx0XHRcdHRoaXMubWVudXNBcnIucHVzaCh7XG5cdFx0XHRcdG1lbnVFbDogbWVudSxcblx0XHRcdFx0bWVudUl0ZW1zOiBtZW51SXRlbXNcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zdCBzdWJNZW51cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1lbnUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcubWwtbWVudV9fbGV2ZWwgPiBsaSA+IHVsOm5vdCgubWwtbWVudV9fbGV2ZWwpJykpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdWJNZW51cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZihzdWJNZW51c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ21sLW1lbnVfX2xldmVsJykpe1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNldE1lbnVzKHN1Yk1lbnVzW2ldLCBtZW51TmFtZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRzZXRNZW51cyA9IHNldE1lbnVzLmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLm1lbnVzID0gW107XG5cdFx0dGhpcy5tZW51c0FyciA9IFtdO1xuXG5cdFx0Y29uc3QgbWFpbk1lbnUgPSB0aGlzLm1lbnVFbC5xdWVyeVNlbGVjdG9yKCd1bCcpO1xuXHRcdG1haW5NZW51LnNldEF0dHJpYnV0ZSgnZGF0YS1tZW51JywgJ21haW4nKTtcblx0XHRtYWluTWVudS5jbGFzc05hbWUgPSBcIm1sLW1lbnVfX2xldmVsIG1sLW1lbnVfX2xldmVsLS1jdXJyZW50XCI7XG5cdFx0Y29uc3QgbWFpbk1lbnVJdGVtcyA9IHNldExpbmtEYXRhKG1haW5NZW51KTtcblxuXHRcdHRoaXMubWVudXMucHVzaChtYWluTWVudSk7XG5cdFx0dGhpcy5tZW51c0Fyci5wdXNoKHtcblx0XHRcdG1lbnVFbDogbWFpbk1lbnUsXG5cdFx0XHRtZW51SXRlbXM6IG1haW5NZW51SXRlbXNcblx0XHR9KTtcblxuXHRcdGNvbnN0IHN1Yk1lbnVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWFpbk1lbnUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcubWwtbWVudV9fbGV2ZWwgPiBsaSA+IHVsJykpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3ViTWVudXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNldE1lbnVzKHN1Yk1lbnVzW2ldKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBmbGF0dGVuQW5kV3JhcE1lbnVzKCl7XG5cdFx0Y29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHdyYXBwZXIuY2xhc3NOYW1lID0gJ21sLW1lbnVfX3dyYXAnO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tZW51c0Fyci5sZW5ndGg7IGkrKykge1xuXHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLm1lbnVzQXJyW2ldLm1lbnVFbCk7XG5cdFx0fVxuXHRcdHRoaXMubWVudVdyYXBwZXIgPSB3cmFwcGVyO1xuXHRcdHRoaXMubWVudUNvbnRhaW5lci5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUhlYWRlcldyYXBwZXIoKXtcblx0XHRjb25zdCBoZWFkZXJXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0aGVhZGVyV3JhcHBlci5jbGFzc05hbWUgPSBcIm1sLW1lbnVfX2hlYWRlclwiO1xuXHRcdHRoaXMubWVudUNvbnRhaW5lci5pbnNlcnRCZWZvcmUoaGVhZGVyV3JhcHBlciwgdGhpcy5tZW51V3JhcHBlcik7XG5cdFx0dGhpcy5oZWFkZXJXcmFwcGVyID0gaGVhZGVyV3JhcHBlcjtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUJyZWFkQ3J1bWJzKCl7XG5cdFx0aWYodGhpcy5vcHRpb25zLmJyZWFkY3J1bWJzQ3RybCl7XG5cdFx0XHR0aGlzLmJyZWFkY3J1bWJzQ3RybCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ25hdicpO1xuXHRcdFx0dGhpcy5icmVhZGNydW1ic0N0cmwuY2xhc3NOYW1lID0gJ21sLW1lbnVfX2JyZWFkY3J1bWJzJztcblx0XHRcdHRoaXMuaGVhZGVyV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJyZWFkY3J1bWJzQ3RybCk7XG5cdFx0XHQvLyBhZGQgaW5pdGlhbCBicmVhZGNydW1iXG5cdFx0XHR0aGlzLmFkZEJyZWFkY3J1bWIoMCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlQmFja0J1dHRvbigpe1xuXHRcdGlmKHRoaXMub3B0aW9ucy5iYWNrQ3RybCl7XG5cdFx0XHR0aGlzLmJhY2tDdHJsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0XHR0aGlzLmJhY2tDdHJsLmNsYXNzTmFtZSA9ICdtbC1tZW51X19hY3Rpb24gbWwtbWVudV9fYWN0aW9uLS1iYWNrIG1sLW1lbnVfX2FjdGlvbi0taGlkZSc7XG5cdFx0XHR0aGlzLmJhY2tDdHJsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdHbyBiYWNrJyk7XG5cdFx0XHR0aGlzLmJhY2tDdHJsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5iYWNrQnV0dG9uSHRtbDtcblx0XHRcdHRoaXMuaGVhZGVyV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJhY2tDdHJsKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVTdWJOYXZMaW5rcygpe1xuXHRcdGNvbnN0IHN1Yk5hdkxpbmtzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5tZW51Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXN1Ym1lbnVdJykpO1xuXHRcdHN1Yk5hdkxpbmtzLmZvckVhY2goZnVuY3Rpb24obGluayl7XG5cdFx0XHRjb25zdCBzdWJOYXZMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdFx0c3ViTmF2TGluay5jbGFzc05hbWUgPSAnbWwtbWVudV9fbGluay0tc3VibmF2Jztcblx0XHRcdHN1Yk5hdkxpbmsuaHJlZiA9ICcjJztcblx0XHRcdGlmKHRoaXMub3B0aW9ucy5zdWJuYXZMaW5rSHRtbCl7XG5cdFx0XHRcdHN1Yk5hdkxpbmsuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLnN1Ym5hdkxpbmtIdG1sO1xuXHRcdFx0fVxuXHRcdFx0bGluay5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHN1Yk5hdkxpbmspO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdH1cblxuXHRpbml0LmNhbGwodGhpcyk7XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKCl7XG5cdHRoaXMubWVudUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubGlua0NsaWNrKTtcblxuXHRpZih0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYnNDdHJsKXtcblx0XHR0aGlzLmJyZWFkY3J1bWJzQ3RybC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnJlYWRjcnVtYkNsaWNrKTtcblx0fVxuXG5cdGlmKHRoaXMub3B0aW9ucy5iYWNrQ3RybCl7XG5cdFx0dGhpcy5iYWNrQ3RybC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYmFjayk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKXtcblx0dGhpcy5tZW51Q29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5saW5rQ2xpY2spO1xuXG5cdGlmKHRoaXMub3B0aW9ucy5icmVhZGNydW1ic0N0cmwpe1xuXHRcdHRoaXMuYnJlYWRjcnVtYnNDdHJsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5icmVhZGNydW1iQ2xpY2spO1xuXHR9XG5cblx0aWYodGhpcy5vcHRpb25zLmJhY2tDdHJsKXtcblx0XHR0aGlzLmJhY2tDdHJsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5iYWNrKTtcblx0fVxufVxuXG5mdW5jdGlvbiBsaW5rQ2xpY2soZXZ0KXtcblx0aWYoXG5cdFx0IWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtbC1tZW51X19saW5rJykgJiZcblx0XHQhZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21sLW1lbnVfX2xpbmstLXN1Ym5hdicpXG5cdCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3Qgc3VibWVudVRhcmdldCA9IGV2dC50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZyxcblx0XHRzdWJtZW51ID0gc3VibWVudVRhcmdldCA/IHN1Ym1lbnVUYXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXN1Ym1lbnUnKSA6ICcnLFxuXHRcdGl0ZW1OYW1lID0gc3VibWVudVRhcmdldCA/IHN1Ym1lbnVUYXJnZXQuaW5uZXJIVE1MIDogZXZ0LnRhcmdldC5pbm5lckhUTUwsXG5cdFx0cG9zID0gc3VibWVudVRhcmdldCA/IHN1Ym1lbnVUYXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcycpIDogZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9zJyksXG5cdFx0c3ViTWVudUVsID0gdGhpcy5tZW51RWwucXVlcnlTZWxlY3RvcigndWxbZGF0YS1tZW51PVwiJyArIHN1Ym1lbnUgKyAnXCJdJyk7XG5cblx0aWYoc3VibWVudSAmJiBzdWJNZW51RWwpe1xuXHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dGhpcy5vcGVuU3ViTWVudShzdWJNZW51RWwsIHBvcywgaXRlbU5hbWUpO1xuXHR9ZWxzZXtcblx0XHRjb25zdCBjdXJyZW50TGluayA9IHRoaXMubWVudUVsLnF1ZXJ5U2VsZWN0b3IoJy5tbC1tZW51X19saW5rLS1jdXJyZW50Jyk7XG5cdFx0aWYoY3VycmVudExpbmspe1xuXHRcdFx0Y3VycmVudExpbmsuY2xhc3NMaXN0LnJlbW92ZSgnbWwtbWVudV9fbGluay0tY3VycmVudCcpO1xuXHRcdH1cblxuXHRcdGV2dC50YXJnZXQuY2xhc3NMaXN0LmFkZCgnbWwtbWVudV9fbGluay0tY3VycmVudCcpO1xuXG5cdFx0aWYodGhpcy5vcHRpb25zLm9uSXRlbUNsaWNrKXtcblx0XHRcdHRoaXMub3B0aW9ucy5vbkl0ZW1DbGljayhldnQsIGl0ZW1OYW1lKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYmFjaygpe1xuXHRpZih0aGlzLmlzQmFja0FuaW1hdGluZyl7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHRoaXMuaXNCYWNrQW5pbWF0aW5nID0gdHJ1ZTtcblx0Ly8gY3VycmVudCBtZW51IHNsaWRlcyBvdXRcblx0dGhpcy5tZW51T3V0KCk7XG5cdC8vIG5leHQgbWVudSAocHJldmlvdXMgbWVudSkgc2xpZGVzIGluXG5cdGNvbnN0IGJhY2tNZW51ID0gdGhpcy5tZW51c0Fyclt0aGlzLm1lbnVzQXJyW3RoaXMuY3VycmVudF0uYmFja0lkeF0ubWVudUVsO1xuXHR0aGlzLm1lbnVJbihiYWNrTWVudSk7XG5cblx0Ly8gcmVtb3ZlIGxhc3QgYnJlYWRjcnVtYlxuXHRpZih0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYnNDdHJsKXtcblx0XHR0aGlzLmJyZWFkY3J1bWJzLnBvcCgpO1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlckJyZWFkQ3J1bWJzKTtcblx0fVxufVxuXG5mdW5jdGlvbiBvcGVuU3ViTWVudShzdWJNZW51RWwsIGNsaWNrUG9zaXRpb24sIHN1Yk1lbnVOYW1lKXtcblx0aWYodGhpcy5pc0FuaW1hdGluZyl7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHRoaXMuaXNBbmltYXRpbmcgPSB0cnVlO1xuXG5cdC8vIHNhdmUgXCJwYXJlbnRcIiBtZW51IGluZGV4IGZvciBiYWNrIG5hdmlnYXRpb25cblx0dGhpcy5tZW51c0Fyclt0aGlzLm1lbnVzLmluZGV4T2Yoc3ViTWVudUVsKV0uYmFja0lkeCA9IHRoaXMuY3VycmVudDtcblx0Ly8gc2F2ZSBcInBhcmVudFwiIG1lbnXCtHMgbmFtZVxuXHR0aGlzLm1lbnVzQXJyW3RoaXMubWVudXMuaW5kZXhPZihzdWJNZW51RWwpXS5uYW1lID0gc3ViTWVudU5hbWU7XG5cdC8vIGN1cnJlbnQgbWVudSBzbGlkZXMgb3V0XG5cdHRoaXMubWVudU91dChjbGlja1Bvc2l0aW9uKTtcblx0Ly8gbmV4dCBtZW51IChzdWJtZW51KSBzbGlkZXMgaW5cblx0dGhpcy5tZW51SW4oc3ViTWVudUVsLCBjbGlja1Bvc2l0aW9uKTtcbn1cblxuZnVuY3Rpb24gYnJlYWRjcnVtYkNsaWNrKGV2dCl7XG5cdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdGNvbnN0IGJyZWFkY3J1bWIgPSBldnQudGFyZ2V0O1xuXHRjb25zdCBpbmRleCA9IGJyZWFkY3J1bWIuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4Jyk7XG5cdGlmKCFpbmRleCl7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdC8vIGRvIG5vdGhpbmcgaWYgdGhpcyBicmVhZGNydW1iIGlzIHRoZSBsYXN0IG9uZSBpbiB0aGUgbGlzdCBvZiBicmVhZGNydW1ic1xuXHRpZighYnJlYWRjcnVtYi5uZXh0U2libGluZyB8fCB0aGlzLmlzQW5pbWF0aW5nKXtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dGhpcy5pc0FuaW1hdGluZyA9IHRydWU7XG5cblx0Ly8gY3VycmVudCBtZW51IHNsaWRlcyBvdXRcblx0dGhpcy5tZW51T3V0KCk7XG5cdC8vIG5leHQgbWVudSBzbGlkZXMgaW5cblx0Y29uc3QgbmV4dE1lbnUgPSB0aGlzLm1lbnVzQXJyW2luZGV4XS5tZW51RWw7XG5cdHRoaXMubWVudUluKG5leHRNZW51KTtcblxuXHQvLyByZW1vdmUgYnJlYWRjcnVtYnMgdGhhdCBhcmUgYWhlYWRcblx0Y29uc3QgaW5kZXhPZlNpYmxpbmdOb2RlID0gdGhpcy5icmVhZGNydW1icy5pbmRleE9mKGJyZWFkY3J1bWIpICsgMTtcblx0aWYofmluZGV4T2ZTaWJsaW5nTm9kZSl7XG5cdFx0dGhpcy5icmVhZGNydW1icyA9IHRoaXMuYnJlYWRjcnVtYnMuc2xpY2UoMCwgaW5kZXhPZlNpYmxpbmdOb2RlKTtcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXJCcmVhZENydW1icyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gbWVudU91dChjbGlja1Bvc2l0aW9uKXtcblx0Y29uc3QgY3VycmVudE1lbnUgPSB0aGlzLm1lbnVzQXJyW3RoaXMuY3VycmVudF0ubWVudUVsLFxuXHRcdGlzQmFja05hdmlnYXRpb24gPSB0eXBlb2YgY2xpY2tQb3NpdGlvbiA9PT0gXCJ1bmRlZmluZWRcIiA/IHRydWUgOiBmYWxzZSxcblx0XHRtZW51SXRlbXMgPSB0aGlzLm1lbnVzQXJyW3RoaXMuY3VycmVudF0ubWVudUl0ZW1zLFxuXHRcdG1lbnVJdGVtc1RvdGFsID0gbWVudUl0ZW1zLmxlbmd0aCxcblx0XHRmYXJ0aGVzdElkeCA9IGNsaWNrUG9zaXRpb24gPD0gbWVudUl0ZW1zVG90YWwvMiB8fCBpc0JhY2tOYXZpZ2F0aW9uID8gbWVudUl0ZW1zVG90YWwgLSAxIDogMDtcblxuXHRtZW51SXRlbXMuZm9yRWFjaChmdW5jdGlvbihsaW5rLCBwb3MpIHtcblx0XHRsZXQgaXRlbVBvcyA9IGxpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcycpO1xuXHRcdGxldCBpdGVtID0gbGluay5wYXJlbnROb2RlO1xuXHRcdGl0ZW0uc3R5bGUuV2Via2l0QW5pbWF0aW9uRGVsYXkgPSBpdGVtLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gaXNCYWNrTmF2aWdhdGlvbiA/IHBhcnNlSW50KGl0ZW1Qb3MgKiB0aGlzLm9wdGlvbnMuaXRlbXNEZWxheUludGVydmFsKSArICdtcycgOiBwYXJzZUludChNYXRoLmFicyhjbGlja1Bvc2l0aW9uIC0gaXRlbVBvcykgKiB0aGlzLm9wdGlvbnMuaXRlbXNEZWxheUludGVydmFsKSArICdtcyc7XG5cdH0uYmluZCh0aGlzKSk7XG5cblx0dXRpbC5vbkVuZEFuaW1hdGlvbihtZW51SXRlbXNbZmFydGhlc3RJZHhdLnBhcmVudE5vZGUsIGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5pc0JhY2tBbmltYXRpbmcgPSBmYWxzZTtcblx0fS5iaW5kKHRoaXMpKTtcblxuXHRjdXJyZW50TWVudS5jbGFzc0xpc3QuYWRkKCEoIWlzQmFja05hdmlnYXRpb24gXiAhdGhpcy5vcHRpb25zLmlzUmlnaHQpID8gJ2FuaW1hdGUtb3V0VG9SaWdodCcgOiAnYW5pbWF0ZS1vdXRUb0xlZnQnKTtcbn1cblxuZnVuY3Rpb24gbWVudUluKG5leHRNZW51RWwsIGNsaWNrUG9zaXRpb24pe1xuXHQvLyB0aGUgY3VycmVudCBtZW51XG5cdGNvbnN0IGN1cnJlbnRNZW51ID0gdGhpcy5tZW51c0Fyclt0aGlzLmN1cnJlbnRdLm1lbnVFbCxcblx0XHRpc0JhY2tOYXZpZ2F0aW9uID0gdHlwZW9mIGNsaWNrUG9zaXRpb24gPT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IGZhbHNlLFxuXHRcdC8vIGluZGV4IG9mIHRoZSBuZXh0TWVudUVsXG5cdFx0bmV4dE1lbnVJZHggPSB0aGlzLm1lbnVzLmluZGV4T2YobmV4dE1lbnVFbCksXG5cblx0XHRuZXh0TWVudUl0ZW1zID0gdGhpcy5tZW51c0FycltuZXh0TWVudUlkeF0ubWVudUl0ZW1zLFxuXHRcdG5leHRNZW51SXRlbXNUb3RhbCA9IG5leHRNZW51SXRlbXMubGVuZ3RoLFxuXG5cdFx0Ly8gd2UgbmVlZCB0byByZXNldCB0aGUgY2xhc3NlcyBvbmNlIHRoZSBsYXN0IGl0ZW0gYW5pbWF0ZXMgaW5cblx0XHQvLyB0aGUgXCJsYXN0IGl0ZW1cIiBpcyB0aGUgZmFydGhlc3QgZnJvbSB0aGUgY2xpY2tlZCBpdGVtXG5cdFx0Ly8gbGV0J3MgY2FsY3VsYXRlIHRoZSBpbmRleCBvZiB0aGUgZmFydGhlc3QgaXRlbVxuXHRcdGZhcnRoZXN0SWR4ID0gY2xpY2tQb3NpdGlvbiA8PSBuZXh0TWVudUl0ZW1zVG90YWwvMiB8fCBpc0JhY2tOYXZpZ2F0aW9uID8gbmV4dE1lbnVJdGVtc1RvdGFsIC0gMSA6IDA7XG5cblx0Ly8gc2xpZGUgaW4gbmV4dCBtZW51IGl0ZW1zIC0gZmlyc3QsIHNldCB0aGUgZGVsYXlzIGZvciB0aGUgaXRlbXNcblx0bmV4dE1lbnVJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmssIHBvcykge1xuXHRcdGxldCBpdGVtUG9zID0gbGluay5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9zJyk7XG5cdFx0bGV0IGl0ZW0gPSBsaW5rLnBhcmVudE5vZGU7XG5cdFx0aXRlbS5zdHlsZS5XZWJraXRBbmltYXRpb25EZWxheSA9IGl0ZW0uc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBpc0JhY2tOYXZpZ2F0aW9uID8gcGFyc2VJbnQoaXRlbVBvcyAqIHRoaXMub3B0aW9ucy5pdGVtc0RlbGF5SW50ZXJ2YWwpICsgJ21zJyA6IHBhcnNlSW50KE1hdGguYWJzKGNsaWNrUG9zaXRpb24gLSBpdGVtUG9zKSAqIHRoaXMub3B0aW9ucy5pdGVtc0RlbGF5SW50ZXJ2YWwpICsgJ21zJztcblx0fS5iaW5kKHRoaXMpKTtcblxuXHR1dGlsLm9uRW5kQW5pbWF0aW9uKG5leHRNZW51SXRlbXNbZmFydGhlc3RJZHhdLnBhcmVudE5vZGUsIGZ1bmN0aW9uKCl7XG5cdFx0Y3VycmVudE1lbnUuY2xhc3NMaXN0LnJlbW92ZSghKCFpc0JhY2tOYXZpZ2F0aW9uIF4gIXRoaXMub3B0aW9ucy5pc1JpZ2h0KSA/ICdhbmltYXRlLW91dFRvUmlnaHQnIDogJ2FuaW1hdGUtb3V0VG9MZWZ0Jyk7XG5cdFx0Y3VycmVudE1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnbWwtbWVudV9fbGV2ZWwtLWN1cnJlbnQnKTtcblx0XHRuZXh0TWVudUVsLmNsYXNzTGlzdC5yZW1vdmUoISghaXNCYWNrTmF2aWdhdGlvbiBeICF0aGlzLm9wdGlvbnMuaXNSaWdodCkgPyAnYW5pbWF0ZS1pbkZyb21MZWZ0JyA6ICdhbmltYXRlLWluRnJvbVJpZ2h0Jyk7XG5cdFx0bmV4dE1lbnVFbC5jbGFzc0xpc3QuYWRkKCdtbC1tZW51X19sZXZlbC0tY3VycmVudCcpO1xuXG5cdFx0Ly9yZXNldCBjdXJyZW50XG5cdFx0dGhpcy5jdXJyZW50ID0gbmV4dE1lbnVJZHg7XG5cblx0XHQvLyBjb250cm9sIGJhY2sgYnV0dG9uIGFuZCBicmVhZGNydW1icyBuYXZpZ2F0aW9uIGVsZW1lbnRzXG5cdFx0aWYoIWlzQmFja05hdmlnYXRpb24pe1xuXHRcdFx0Ly8gc2hvdyBiYWNrIGJ1dHRvblxuXHRcdFx0aWYodGhpcy5vcHRpb25zLmJhY2tDdHJsKXtcblx0XHRcdFx0dGhpcy5iYWNrQ3RybC5jbGFzc0xpc3QucmVtb3ZlKCdtbC1tZW51X19hY3Rpb24tLWhpZGUnKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYWRkIGJyZWFkY3J1bWJcblx0XHRcdHRoaXMuYWRkQnJlYWRjcnVtYihuZXh0TWVudUlkeCk7XG5cdFx0fWVsc2UgaWYodGhpcy5jdXJyZW50ID09PSAwICYmIHRoaXMub3B0aW9ucy5iYWNrQ3RybCl7XG5cdFx0XHQvLyBoaWRlIGJhY2sgYnV0dG9uXG5cdFx0XHR0aGlzLmJhY2tDdHJsLmNsYXNzTGlzdC5hZGQoJ21sLW1lbnVfX2FjdGlvbi0taGlkZScpO1xuXHRcdH1cblxuXHRcdC8vIHdlIGNhbiBuYXZpZ2F0ZSBhZ2Fpbi4uXG5cdFx0dGhpcy5pc0FuaW1hdGluZyA9IGZhbHNlO1xuXHR9LmJpbmQodGhpcykpO1xuXG5cdC8vIGFuaW1hdGlvbiBjbGFzc1xuXHRuZXh0TWVudUVsLmNsYXNzTGlzdC5hZGQoISghaXNCYWNrTmF2aWdhdGlvbiBeICF0aGlzLm9wdGlvbnMuaXNSaWdodCkgPyAnYW5pbWF0ZS1pbkZyb21MZWZ0JyA6ICdhbmltYXRlLWluRnJvbVJpZ2h0Jylcbn1cblxuZnVuY3Rpb24gYWRkQnJlYWRjcnVtYihpbmRleCl7XG5cdGlmKCF0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYnNDdHJsKXtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRjb25zdCBiYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0bGV0IGJyZWFkY3J1bWJOYW1lID0gaW5kZXggPyB0aGlzLm1lbnVzQXJyW2luZGV4XS5uYW1lIDogdGhpcy5vcHRpb25zLmluaXRpYWxCcmVhZGNydW1iO1xuXHRpZihicmVhZGNydW1iTmFtZS5sZW5ndGggPiB0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYk1heExlbmd0aCl7XG5cdFx0YnJlYWRjcnVtYk5hbWUgPSBicmVhZGNydW1iTmFtZS5zdWJzdHJpbmcoMCwgdGhpcy5vcHRpb25zLmJyZWFkY3J1bWJNYXhMZW5ndGgpLnRyaW0oKSsnLi4uJztcblx0fVxuXHRiYy5pbm5lckhUTUwgPSBicmVhZGNydW1iTmFtZTtcblx0YmMuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgaW5kZXgpO1xuXG5cdHRoaXMuYnJlYWRjcnVtYnMucHVzaChiYyk7XG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlckJyZWFkQ3J1bWJzKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQnJlYWRDcnVtYnMoKXtcblx0dGhpcy5icmVhZGNydW1ic0N0cmwuaW5uZXJIVE1MID0gXCJcIjtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJyZWFkY3J1bWJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dGhpcy5icmVhZGNydW1ic0N0cmwuYXBwZW5kQ2hpbGQodGhpcy5icmVhZGNydW1ic1tpXSk7XG5cdFx0aWYoaSA8IHRoaXMuYnJlYWRjcnVtYnMubGVuZ3RoIC0gMSl7XG5cdFx0XHR0aGlzLmJyZWFkY3J1bWJzQ3RybC5hcHBlbmRDaGlsZCh0aGlzLmJyZWFkY3J1bWJTcGFjZXIuY2xvbmVOb2RlKHRydWUpKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTWxNZW51O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBtYXRjaGVzIHBvbHlmaWxsXG53aW5kb3cuRWxlbWVudCAmJiBmdW5jdGlvbihFbGVtZW50UHJvdG90eXBlKSB7XG5cdEVsZW1lbnRQcm90b3R5cGUubWF0Y2hlcyA9IEVsZW1lbnRQcm90b3R5cGUubWF0Y2hlcyB8fFxuXHRFbGVtZW50UHJvdG90eXBlLm1hdGNoZXNTZWxlY3RvciB8fFxuXHRFbGVtZW50UHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fFxuXHRFbGVtZW50UHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8XG5cdGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0dmFyIG5vZGUgPSB0aGlzLCBub2RlcyA9IChub2RlLnBhcmVudE5vZGUgfHwgbm9kZS5kb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvciksIGkgPSAtMTtcblx0XHR3aGlsZSAobm9kZXNbKytpXSAmJiBub2Rlc1tpXSAhPSBub2RlKTtcblx0XHRyZXR1cm4gISFub2Rlc1tpXTtcblx0fVxufShFbGVtZW50LnByb3RvdHlwZSk7XG5cbi8vIGNsb3Nlc3QgcG9seWZpbGxcbndpbmRvdy5FbGVtZW50ICYmIGZ1bmN0aW9uKEVsZW1lbnRQcm90b3R5cGUpIHtcblx0RWxlbWVudFByb3RvdHlwZS5jbG9zZXN0ID0gRWxlbWVudFByb3RvdHlwZS5jbG9zZXN0IHx8XG5cdGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0dmFyIGVsID0gdGhpcztcblx0XHR3aGlsZSAoZWwubWF0Y2hlcyAmJiAhZWwubWF0Y2hlcyhzZWxlY3RvcikpIGVsID0gZWwucGFyZW50Tm9kZTtcblx0XHRyZXR1cm4gZWwubWF0Y2hlcyA/IGVsIDogbnVsbDtcblx0fVxufShFbGVtZW50LnByb3RvdHlwZSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBGb250RmFjZU9ic2VydmVyIGZyb20gXCIuLy4uLy4uL3ZlbmRvci9mb250ZmFjZW9ic2VydmVyXCI7XG5cbmxldCBodG1sLFxuXHRzdWJGb250cyxcblx0ZnVsbEZvbnRzLFxuXHRzdWJGb250Q2xhc3MsXG5cdGZ1bGxGb250Q2xhc3M7XG5cbmZ1bmN0aW9uIGluaXQob3B0aW9ucyl7XG5cdGlmKCFvcHRpb25zKXtcblx0XHRvcHRpb25zID0ge307XG5cdH1cblxuXHRzdWJGb250cyA9IG9wdGlvbnMuc3ViRm9udHMgfHwgW107XG5cdGZ1bGxGb250cyA9IG9wdGlvbnMuZnVsbEZvbnRzIHx8IFtdO1xuXG5cdGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdHN1YkZvbnRDbGFzcyA9IG9wdGlvbnMuc3ViRm9udENsYXNzIHx8IFwic3ViZm9udC1sb2FkZWRcIjtcblx0ZnVsbEZvbnRDbGFzcyA9IG9wdGlvbnMuc3ViRm9udENsYXNzIHx8IFwiZm9udC1sb2FkZWRcIjtcblxuXHRpZihzdWJGb250cy5sZW5ndGggfHwgZnVsbEZvbnRDbGFzcy5sZW5ndGgpe1xuXHRcdHJ1bkZvbnRMb2FkaW5nKCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcnVuRm9udExvYWRpbmcoKXtcblx0aWYgKHNlc3Npb25TdG9yYWdlLmZ1bGxGb250TG9hZGVkKSB7XG5cdFx0aHRtbC5jbGFzc0xpc3QuYWRkKGZ1bGxGb250Q2xhc3MpO1xuXHR9ZWxzZSBpZihzZXNzaW9uU3RvcmFnZS5zdWJGb250TG9hZGVkKXtcblx0XHRodG1sLmNsYXNzTGlzdC5hZGQoc3ViRm9udENsYXNzKTtcblx0XHRsb2FkRnVsbFNldHMoKTtcblx0fWVsc2V7XG5cdFx0bG9hZFN1YnNldHMoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBsb2FkU3Vic2V0cygpe1xuXHRpZighc3ViRm9udHMubGVuZ3RoKXtcblx0XHRsb2FkRnVsbFNldHMoKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBmb250cyA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IHN1YkZvbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IG9wdGlvbnMgPSBzdWJGb250c1tpXS5vcHRpb24gfHwge307XG5cdFx0bGV0IGZvbnQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihzdWJGb250c1tpXS5uYW1lLCBvcHRpb25zKTtcblx0XHRmb250cy5wdXNoKGZvbnQubG9hZCgpKTtcblx0fVxuXG5cdFByb21pc2UuYWxsKGZvbnRzKVxuXHQudGhlbihcblx0XHRmdW5jdGlvbigpe1xuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc3ViRm9udExvYWRlZCA9IHRydWU7XG5cdFx0XHRodG1sLmNsYXNzTGlzdC5hZGQoc3ViRm9udENsYXNzKTtcblx0XHRcdGxvYWRGdWxsU2V0cygpO1xuXHRcdH1cblx0KVxuXHQuY2F0Y2goZmFpbGVkVG9Mb2FkU3ViKTtcbn1cblxuZnVuY3Rpb24gbG9hZEZ1bGxTZXRzKCl7XG5cdC8vIGZvciBsYXJnZSBmb250cyBwdXNoIGEgdGltZXIgKGxvb2sgYXQgdGltZXIgZnVuY3Rpb24gYmVsb3cpIHRvIGxldCB0aGVzZSBsYXJnZSBmb250IG1vcmUgdGltZSB0byBsb2FkXG5cdGlmKCFmdWxsRm9udHMubGVuZ3RoKXtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBmb250cyA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGZ1bGxGb250cy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBvcHRpb25zID0gZnVsbEZvbnRzW2ldLm9wdGlvbiB8fCB7fTtcblx0XHRsZXQgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKGZ1bGxGb250c1tpXS5uYW1lLCBvcHRpb25zKTtcblx0XHRmb250cy5wdXNoKGZvbnQubG9hZCgpKTtcblx0fVxuXG5cdFByb21pc2UuYWxsKGZvbnRzKVxuXHQudGhlbihcblx0XHRmdW5jdGlvbigpe1xuXHRcdFx0c2Vzc2lvblN0b3JhZ2UuZnVsbEZvbnRMb2FkZWQgPSB0cnVlO1xuXHRcdFx0aHRtbC5jbGFzc0xpc3QucmVtb3ZlKHN1YkZvbnRDbGFzcyk7XG5cdFx0XHRodG1sLmNsYXNzTGlzdC5hZGQoZnVsbEZvbnRDbGFzcyk7XG5cdFx0fVxuXHQpXG5cdC5jYXRjaChmYWlsZWRUb0xvYWRGdWxsKTtcbn1cblxuZnVuY3Rpb24gdGltZXIodGltZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdHNldFRpbWVvdXQocmVqZWN0LCB0aW1lKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGZhaWxlZFRvTG9hZFN1Yigpe1xuXHRodG1sLmNsYXNzTGlzdC5yZW1vdmUoc3ViRm9udENsYXNzKTtcblx0c2Vzc2lvblN0b3JhZ2Uuc3ViRm9udExvYWRlZCA9IGZhbHNlO1xuXHRjb25zb2xlLmVycm9yKCdzdWItc2V0dGVkIGZvbnQgZmFpbGVkIHRvIGxvYWQhJyk7XG59XG5cbmZ1bmN0aW9uIGZhaWxlZFRvTG9hZEZ1bGwoKXtcblx0aHRtbC5jbGFzc0xpc3QucmVtb3ZlKGZ1bGxGb250Q2xhc3MpO1xuXHRzZXNzaW9uU3RvcmFnZS5mdWxsRm9udExvYWRlZCA9IGZhbHNlO1xuXHRjb25zb2xlLmVycm9yKCdmdWxsLXNldHRlZCBmb250IGZhaWxlZCB0byBsb2FkIScpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0O1xuIiwiaW1wb3J0IHByb21pc2VQb2x5IGZyb20gXCIuLi8uLi92ZW5kb3IvZXM2LXByb21pc2VcIjtcbmltcG9ydCBmZXRjaFBvbHkgZnJvbSBcIi4uLy4uL3ZlbmRvci9mZXRjaFwiO1xuaW1wb3J0IGVsZW1lbnQgZnJvbSBcIi4vZWxlbWVudC5qc1wiO1xuXG5wcm9taXNlUG9seS5wb2x5ZmlsbCgpO1xuIiwiLyohXHJcbiAqIEBvdmVydmlldyBlczYtcHJvbWlzZSAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cclxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnMgKENvbnZlcnNpb24gdG8gRVM2IEFQSSBieSBKYWtlIEFyY2hpYmFsZClcclxuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxyXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vamFrZWFyY2hpYmFsZC9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxyXG4gKiBAdmVyc2lvbiAgIDMuMi4yKzM5YWEyNTcxXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24oeCkge1xyXG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbicgfHwgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzRnVuY3Rpb24oeCkge1xyXG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc01heWJlVGhlbmFibGUoeCkge1xyXG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkX2lzQXJyYXk7XHJcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkpIHtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJHV0aWxzJCRfaXNBcnJheSA9IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzQXJyYXkgPSBsaWIkZXM2JHByb21pc2UkdXRpbHMkJF9pc0FycmF5O1xyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW4gPSAwO1xyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR2ZXJ0eE5leHQ7XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGN1c3RvbVNjaGVkdWxlckZuO1xyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbl0gPSBjYWxsYmFjaztcclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2xpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW4gKyAxXSA9IGFyZztcclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiArPSAyO1xyXG4gICAgICBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiA9PT0gMikge1xyXG4gICAgICAgIC8vIElmIGxlbiBpcyAyLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cclxuICAgICAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxyXG4gICAgICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cclxuICAgICAgICBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGN1c3RvbVNjaGVkdWxlckZuKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkY3VzdG9tU2NoZWR1bGVyRm4obGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2goKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0U2NoZWR1bGVyKHNjaGVkdWxlRm4pIHtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGN1c3RvbVNjaGVkdWxlckZuID0gc2NoZWR1bGVGbjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0QXNhcChhc2FwRm4pIHtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAgPSBhc2FwRm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyV2luZG93ID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3Nlckdsb2JhbCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyV2luZG93IHx8IHt9O1xyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgbGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB7fS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXSc7XHJcblxyXG4gICAgLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xyXG5cclxuICAgIC8vIG5vZGVcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VOZXh0VGljaygpIHtcclxuICAgICAgLy8gbm9kZSB2ZXJzaW9uIDAuMTAueCBkaXNwbGF5cyBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgd2hlbiBuZXh0VGljayBpcyB1c2VkIHJlY3Vyc2l2ZWx5XHJcbiAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vY3Vqb2pzL3doZW4vaXNzdWVzLzQxMCBmb3IgZGV0YWlsc1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZlcnR4XHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlVmVydHhUaW1lcigpIHtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR2ZXJ0eE5leHQobGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcclxuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xyXG4gICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgbGliJGVzNiRwcm9taXNlJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCk7XHJcbiAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xyXG4gICAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcclxuXHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICBub2RlLmRhdGEgPSAoaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDIpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHdlYiB3b3JrZXJcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcclxuICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcclxuICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2g7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlU2V0VGltZW91dCgpIHtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQobGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoLCAxKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKCkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW47IGkrPTIpIHtcclxuICAgICAgICB2YXIgY2FsbGJhY2sgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbaV07XHJcbiAgICAgICAgdmFyIGFyZyA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtpKzFdO1xyXG5cclxuICAgICAgICBjYWxsYmFjayhhcmcpO1xyXG5cclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbaV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2krMV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW4gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhdHRlbXB0VmVydHgoKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIHIgPSByZXF1aXJlO1xyXG4gICAgICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VWZXJ0eFRpbWVyKCk7XHJcbiAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlU2V0VGltZW91dCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoO1xyXG4gICAgLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcclxuICAgIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkaXNOb2RlKSB7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU5leHRUaWNrKCk7XHJcbiAgICB9IGVsc2UgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNdXRhdGlvbk9ic2VydmVyKCk7XHJcbiAgICB9IGVsc2UgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRpc1dvcmtlcikge1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpO1xyXG4gICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJGF0dGVtcHRWZXJ0eCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlU2V0VGltZW91dCgpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHRoZW4kJHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcclxuICAgICAgdmFyIHBhcmVudCA9IHRoaXM7XHJcblxyXG4gICAgICB2YXIgY2hpbGQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcclxuXHJcbiAgICAgIGlmIChjaGlsZFtsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQUk9NSVNFX0lEXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbWFrZVByb21pc2UoY2hpbGQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgc3RhdGUgPSBwYXJlbnQuX3N0YXRlO1xyXG5cclxuICAgICAgaWYgKHN0YXRlKSB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzW3N0YXRlIC0gMV07XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAoZnVuY3Rpb24oKXtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHN0YXRlLCBjaGlsZCwgY2FsbGJhY2ssIHBhcmVudC5fcmVzdWx0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY2hpbGQ7XHJcbiAgICB9XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHRoZW4kJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkdGhlbiQkdGhlbjtcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJHJlc29sdmUob2JqZWN0KSB7XHJcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXHJcbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCBvYmplY3QpO1xyXG4gICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkcmVzb2x2ZTtcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQUk9NSVNFX0lEID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDE2KTtcclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKCkge31cclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORyAgID0gdm9pZCAwO1xyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRCA9IDE7XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQgID0gMjtcclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IgPSBuZXcgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzZWxmRnVsZmlsbG1lbnQoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVHlwZUVycm9yKFwiWW91IGNhbm5vdCByZXNvbHZlIGEgcHJvbWlzZSB3aXRoIGl0c2VsZlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRjYW5ub3RSZXR1cm5Pd24oKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZ2V0VGhlbihwcm9taXNlKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbjtcclxuICAgICAgfSBjYXRjaChlcnJvcikge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XHJcbiAgICAgICAgcmV0dXJuIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICByZXR1cm4gZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSwgdGhlbikge1xyXG4gICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAoZnVuY3Rpb24ocHJvbWlzZSkge1xyXG4gICAgICAgIHZhciBzZWFsZWQgPSBmYWxzZTtcclxuICAgICAgICB2YXIgZXJyb3IgPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCR0cnlUaGVuKHRoZW4sIHRoZW5hYmxlLCBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cclxuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XHJcbiAgICAgICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XHJcbiAgICAgICAgICBpZiAoc2VhbGVkKSB7IHJldHVybjsgfVxyXG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcclxuICAgICAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xyXG5cclxuICAgICAgICBpZiAoIXNlYWxlZCAmJiBlcnJvcikge1xyXG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBwcm9taXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xyXG4gICAgICBpZiAodGhlbmFibGUuX3N0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcclxuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuKSB7XHJcbiAgICAgIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yICYmXHJcbiAgICAgICAgICB0aGVuID09PSBsaWIkZXM2JHByb21pc2UkdGhlbiQkZGVmYXVsdCAmJlxyXG4gICAgICAgICAgY29uc3RydWN0b3IucmVzb2x2ZSA9PT0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGVuID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUikge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoZW4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbih0aGVuKSkge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcclxuICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHNlbGZGdWxmaWxsbWVudCgpKTtcclxuICAgICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZ2V0VGhlbih2YWx1ZSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XHJcbiAgICAgIGlmIChwcm9taXNlLl9vbmVycm9yKSB7XHJcbiAgICAgICAgcHJvbWlzZS5fb25lcnJvcihwcm9taXNlLl9yZXN1bHQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcclxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gdmFsdWU7XHJcbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEO1xyXG5cclxuICAgICAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gsIHByb21pc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xyXG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcpIHsgcmV0dXJuOyB9XHJcbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQ7XHJcbiAgICAgIHByb21pc2UuX3Jlc3VsdCA9IHJlYXNvbjtcclxuXHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xyXG4gICAgICB2YXIgc3Vic2NyaWJlcnMgPSBwYXJlbnQuX3N1YnNjcmliZXJzO1xyXG4gICAgICB2YXIgbGVuZ3RoID0gc3Vic2NyaWJlcnMubGVuZ3RoO1xyXG5cclxuICAgICAgcGFyZW50Ll9vbmVycm9yID0gbnVsbDtcclxuXHJcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcclxuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEXSA9IG9uRnVsZmlsbG1lbnQ7XHJcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEXSAgPSBvblJlamVjdGlvbjtcclxuXHJcbiAgICAgIGlmIChsZW5ndGggPT09IDAgJiYgcGFyZW50Ll9zdGF0ZSkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gsIHBhcmVudCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpIHtcclxuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XHJcbiAgICAgIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XHJcblxyXG4gICAgICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgdmFyIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XHJcbiAgICAgICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XHJcblxyXG4gICAgICAgIGlmIChjaGlsZCkge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhkZXRhaWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRFcnJvck9iamVjdCgpIHtcclxuICAgICAgdGhpcy5lcnJvciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUiA9IG5ldyBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRFcnJvck9iamVjdCgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SLmVycm9yID0gZTtcclxuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xyXG4gICAgICB2YXIgaGFzQ2FsbGJhY2sgPSBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzRnVuY3Rpb24oY2FsbGJhY2spLFxyXG4gICAgICAgICAgdmFsdWUsIGVycm9yLCBzdWNjZWVkZWQsIGZhaWxlZDtcclxuXHJcbiAgICAgIGlmIChoYXNDYWxsYmFjaykge1xyXG4gICAgICAgIHZhbHVlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SKSB7XHJcbiAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgZXJyb3IgPSB2YWx1ZS5lcnJvcjtcclxuICAgICAgICAgIHZhbHVlID0gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGNhbm5vdFJldHVybk93bigpKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID0gZGV0YWlsO1xyXG4gICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykge1xyXG4gICAgICAgIC8vIG5vb3BcclxuICAgICAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcclxuICAgICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyb3IpO1xyXG4gICAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xyXG4gICAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpe1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaWQgPSAwO1xyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbmV4dElkKCkge1xyXG4gICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaWQrKztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRtYWtlUHJvbWlzZShwcm9taXNlKSB7XHJcbiAgICAgIHByb21pc2VbbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUFJPTUlTRV9JRF0gPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpZCsrO1xyXG4gICAgICBwcm9taXNlLl9zdGF0ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gdW5kZWZpbmVkO1xyXG4gICAgICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkYWxsKGVudHJpZXMpIHtcclxuICAgICAgcmV0dXJuIG5ldyBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkZGVmYXVsdCh0aGlzLCBlbnRyaWVzKS5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkYWxsO1xyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmFjZSQkcmFjZShlbnRyaWVzKSB7XHJcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXHJcbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAoIWxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNBcnJheShlbnRyaWVzKSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgdmFyIGxlbmd0aCA9IGVudHJpZXMubGVuZ3RoO1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyYWNlJCRyYWNlO1xyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVqZWN0JCRyZWplY3QocmVhc29uKSB7XHJcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXHJcbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XHJcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcclxuICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVqZWN0JCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVqZWN0JCRyZWplY3Q7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCkge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJG5lZWRzTmV3KCkge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlO1xyXG4gICAgLyoqXHJcbiAgICAgIFByb21pc2Ugb2JqZWN0cyByZXByZXNlbnQgdGhlIGV2ZW50dWFsIHJlc3VsdCBvZiBhbiBhc3luY2hyb25vdXMgb3BlcmF0aW9uLiBUaGVcclxuICAgICAgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCwgd2hpY2hcclxuICAgICAgcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXHJcbiAgICAgIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxyXG5cclxuICAgICAgVGVybWlub2xvZ3lcclxuICAgICAgLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXHJcbiAgICAgIC0gYHRoZW5hYmxlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gdGhhdCBkZWZpbmVzIGEgYHRoZW5gIG1ldGhvZC5cclxuICAgICAgLSBgdmFsdWVgIGlzIGFueSBsZWdhbCBKYXZhU2NyaXB0IHZhbHVlIChpbmNsdWRpbmcgdW5kZWZpbmVkLCBhIHRoZW5hYmxlLCBvciBhIHByb21pc2UpLlxyXG4gICAgICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cclxuICAgICAgLSBgcmVhc29uYCBpcyBhIHZhbHVlIHRoYXQgaW5kaWNhdGVzIHdoeSBhIHByb21pc2Ugd2FzIHJlamVjdGVkLlxyXG4gICAgICAtIGBzZXR0bGVkYCB0aGUgZmluYWwgcmVzdGluZyBzdGF0ZSBvZiBhIHByb21pc2UsIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cclxuXHJcbiAgICAgIEEgcHJvbWlzZSBjYW4gYmUgaW4gb25lIG9mIHRocmVlIHN0YXRlczogcGVuZGluZywgZnVsZmlsbGVkLCBvciByZWplY3RlZC5cclxuXHJcbiAgICAgIFByb21pc2VzIHRoYXQgYXJlIGZ1bGZpbGxlZCBoYXZlIGEgZnVsZmlsbG1lbnQgdmFsdWUgYW5kIGFyZSBpbiB0aGUgZnVsZmlsbGVkXHJcbiAgICAgIHN0YXRlLiAgUHJvbWlzZXMgdGhhdCBhcmUgcmVqZWN0ZWQgaGF2ZSBhIHJlamVjdGlvbiByZWFzb24gYW5kIGFyZSBpbiB0aGVcclxuICAgICAgcmVqZWN0ZWQgc3RhdGUuICBBIGZ1bGZpbGxtZW50IHZhbHVlIGlzIG5ldmVyIGEgdGhlbmFibGUuXHJcblxyXG4gICAgICBQcm9taXNlcyBjYW4gYWxzbyBiZSBzYWlkIHRvICpyZXNvbHZlKiBhIHZhbHVlLiAgSWYgdGhpcyB2YWx1ZSBpcyBhbHNvIGFcclxuICAgICAgcHJvbWlzZSwgdGhlbiB0aGUgb3JpZ2luYWwgcHJvbWlzZSdzIHNldHRsZWQgc3RhdGUgd2lsbCBtYXRjaCB0aGUgdmFsdWUnc1xyXG4gICAgICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcclxuICAgICAgaXRzZWxmIHJlamVjdCwgYW5kIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgd2lsbFxyXG4gICAgICBpdHNlbGYgZnVsZmlsbC5cclxuXHJcblxyXG4gICAgICBCYXNpYyBVc2FnZTpcclxuICAgICAgLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICBgYGBqc1xyXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIC8vIG9uIHN1Y2Nlc3NcclxuICAgICAgICByZXNvbHZlKHZhbHVlKTtcclxuXHJcbiAgICAgICAgLy8gb24gZmFpbHVyZVxyXG4gICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIC8vIG9uIGZ1bGZpbGxtZW50XHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xyXG4gICAgICAgIC8vIG9uIHJlamVjdGlvblxyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBBZHZhbmNlZCBVc2FnZTpcclxuICAgICAgLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXHJcbiAgICAgIGBYTUxIdHRwUmVxdWVzdGBzLlxyXG5cclxuICAgICAgYGBganNcclxuICAgICAgZnVuY3Rpb24gZ2V0SlNPTih1cmwpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcclxuICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xyXG4gICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcclxuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgICAgeGhyLnNlbmQoKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcclxuICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignZ2V0SlNPTjogYCcgKyB1cmwgKyAnYCBmYWlsZWQgd2l0aCBzdGF0dXM6IFsnICsgdGhpcy5zdGF0dXMgKyAnXScpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGdldEpTT04oJy9wb3N0cy5qc29uJykudGhlbihmdW5jdGlvbihqc29uKSB7XHJcbiAgICAgICAgLy8gb24gZnVsZmlsbG1lbnRcclxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XHJcbiAgICAgICAgLy8gb24gcmVqZWN0aW9uXHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXHJcblxyXG4gICAgICBgYGBqc1xyXG4gICAgICBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgZ2V0SlNPTignL3Bvc3RzJyksXHJcbiAgICAgICAgZ2V0SlNPTignL2NvbW1lbnRzJylcclxuICAgICAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xyXG4gICAgICAgIHZhbHVlc1swXSAvLyA9PiBwb3N0c0pTT05cclxuICAgICAgICB2YWx1ZXNbMV0gLy8gPT4gY29tbWVudHNKU09OXHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIEBjbGFzcyBQcm9taXNlXHJcbiAgICAgIEBwYXJhbSB7ZnVuY3Rpb259IHJlc29sdmVyXHJcbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cclxuICAgICAgQGNvbnN0cnVjdG9yXHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UocmVzb2x2ZXIpIHtcclxuICAgICAgdGhpc1tsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQUk9NSVNFX0lEXSA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5leHRJZCgpO1xyXG4gICAgICB0aGlzLl9yZXN1bHQgPSB0aGlzLl9zdGF0ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcclxuXHJcbiAgICAgIGlmIChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wICE9PSByZXNvbHZlcikge1xyXG4gICAgICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNSZXNvbHZlcigpO1xyXG4gICAgICAgIHRoaXMgaW5zdGFuY2VvZiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZSA/IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKSA6IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc05ldygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UuYWxsID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkYWxsJCRkZWZhdWx0O1xyXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucmFjZSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJGRlZmF1bHQ7XHJcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5yZXNvbHZlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdDtcclxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLnJlamVjdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlamVjdCQkZGVmYXVsdDtcclxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLl9zZXRTY2hlZHVsZXIgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0U2NoZWR1bGVyO1xyXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UuX3NldEFzYXAgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0QXNhcDtcclxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLl9hc2FwID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXA7XHJcblxyXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucHJvdG90eXBlID0ge1xyXG4gICAgICBjb25zdHJ1Y3RvcjogbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxyXG4gICAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxyXG4gICAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXHJcblxyXG4gICAgICBgYGBqc1xyXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICAgLy8gdXNlciBpcyBhdmFpbGFibGVcclxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcclxuICAgICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBDaGFpbmluZ1xyXG4gICAgICAtLS0tLS0tLVxyXG5cclxuICAgICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcclxuICAgICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxyXG4gICAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cclxuXHJcbiAgICAgIGBgYGpzXHJcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgIHJldHVybiB1c2VyLm5hbWU7XHJcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJOYW1lKSB7XHJcbiAgICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxyXG4gICAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xyXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xyXG4gICAgICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXHJcbiAgICAgICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuICAgICAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXHJcblxyXG4gICAgICBgYGBqc1xyXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxyXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xyXG4gICAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIEFzc2ltaWxhdGlvblxyXG4gICAgICAtLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXHJcbiAgICAgIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcclxuICAgICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcclxuICAgICAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXHJcblxyXG4gICAgICBgYGBqc1xyXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XHJcbiAgICAgICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cclxuXHJcbiAgICAgIGBgYGpzXHJcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcclxuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcclxuICAgICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXHJcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIFNpbXBsZSBFeGFtcGxlXHJcbiAgICAgIC0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICBTeW5jaHJvbm91cyBFeGFtcGxlXHJcblxyXG4gICAgICBgYGBqYXZhc2NyaXB0XHJcbiAgICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcclxuICAgICAgICAvLyBzdWNjZXNzXHJcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XHJcbiAgICAgICAgLy8gZmFpbHVyZVxyXG4gICAgICB9XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgRXJyYmFjayBFeGFtcGxlXHJcblxyXG4gICAgICBgYGBqc1xyXG4gICAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAvLyBmYWlsdXJlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIHN1Y2Nlc3NcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIFByb21pc2UgRXhhbXBsZTtcclxuXHJcbiAgICAgIGBgYGphdmFzY3JpcHRcclxuICAgICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcclxuICAgICAgICAvLyBzdWNjZXNzXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XHJcbiAgICAgICAgLy8gZmFpbHVyZVxyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBBZHZhbmNlZCBFeGFtcGxlXHJcbiAgICAgIC0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICBTeW5jaHJvbm91cyBFeGFtcGxlXHJcblxyXG4gICAgICBgYGBqYXZhc2NyaXB0XHJcbiAgICAgIHZhciBhdXRob3IsIGJvb2tzO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XHJcbiAgICAgICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcclxuICAgICAgICAvLyBzdWNjZXNzXHJcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XHJcbiAgICAgICAgLy8gZmFpbHVyZVxyXG4gICAgICB9XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgRXJyYmFjayBFeGFtcGxlXHJcblxyXG4gICAgICBgYGBqc1xyXG5cclxuICAgICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcclxuICAgICAgICAgIC8vIGZhaWx1cmVcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xyXG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xyXG4gICAgICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcclxuICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gc3VjY2Vzc1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgUHJvbWlzZSBFeGFtcGxlO1xyXG5cclxuICAgICAgYGBgamF2YXNjcmlwdFxyXG4gICAgICBmaW5kQXV0aG9yKCkuXHJcbiAgICAgICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXHJcbiAgICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XHJcbiAgICAgICAgICAvLyBmb3VuZCBib29rc1xyXG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xyXG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIEBtZXRob2QgdGhlblxyXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxlZFxyXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGVkXHJcbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cclxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cclxuICAgICovXHJcbiAgICAgIHRoZW46IGxpYiRlczYkcHJvbWlzZSR0aGVuJCRkZWZhdWx0LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXHJcbiAgICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXHJcblxyXG4gICAgICBgYGBqc1xyXG4gICAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG4ndCBmaW5kIHRoYXQgYXV0aG9yJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHN5bmNocm9ub3VzXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgZmluZEF1dGhvcigpO1xyXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xyXG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcclxuICAgICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XHJcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgQG1ldGhvZCBjYXRjaFxyXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxyXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXHJcbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XHJcbiAgICAqL1xyXG4gICAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGlvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3I7XHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQpIHtcclxuICAgICAgdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xyXG4gICAgICB0aGlzLnByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMucHJvbWlzZVtsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQUk9NSVNFX0lEXSkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG1ha2VQcm9taXNlKHRoaXMucHJvbWlzZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzQXJyYXkoaW5wdXQpKSB7XHJcbiAgICAgICAgdGhpcy5faW5wdXQgICAgID0gaW5wdXQ7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggICAgID0gaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xyXG4gICAgICAgICAgdGhpcy5fZW51bWVyYXRlKCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QodGhpcy5wcm9taXNlLCBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkdmFsaWRhdGlvbkVycm9yKCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJHZhbGlkYXRpb25FcnJvcigpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGxlbmd0aCAgPSB0aGlzLmxlbmd0aDtcclxuICAgICAgdmFyIGlucHV0ICAgPSB0aGlzLl9pbnB1dDtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyB0aGlzLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLl9lYWNoRW50cnkoaW5wdXRbaV0sIGkpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24oZW50cnksIGkpIHtcclxuICAgICAgdmFyIGMgPSB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yO1xyXG4gICAgICB2YXIgcmVzb2x2ZSA9IGMucmVzb2x2ZTtcclxuXHJcbiAgICAgIGlmIChyZXNvbHZlID09PSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0KSB7XHJcbiAgICAgICAgdmFyIHRoZW4gPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRnZXRUaGVuKGVudHJ5KTtcclxuXHJcbiAgICAgICAgaWYgKHRoZW4gPT09IGxpYiRlczYkcHJvbWlzZSR0aGVuJCRkZWZhdWx0ICYmXHJcbiAgICAgICAgICAgIGVudHJ5Ll9zdGF0ZSAhPT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykge1xyXG4gICAgICAgICAgdGhpcy5fc2V0dGxlZEF0KGVudHJ5Ll9zdGF0ZSwgaSwgZW50cnkuX3Jlc3VsdCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgdGhpcy5fcmVtYWluaW5nLS07XHJcbiAgICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSBlbnRyeTtcclxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0KSB7XHJcbiAgICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBjKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgdGhlbik7XHJcbiAgICAgICAgICB0aGlzLl93aWxsU2V0dGxlQXQocHJvbWlzZSwgaSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChuZXcgYyhmdW5jdGlvbihyZXNvbHZlKSB7IHJlc29sdmUoZW50cnkpOyB9KSwgaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlKGVudHJ5KSwgaSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVkQXQgPSBmdW5jdGlvbihzdGF0ZSwgaSwgdmFsdWUpIHtcclxuICAgICAgdmFyIHByb21pc2UgPSB0aGlzLnByb21pc2U7XHJcblxyXG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcclxuICAgICAgICB0aGlzLl9yZW1haW5pbmctLTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCkge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24ocHJvbWlzZSwgaSkge1xyXG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XHJcblxyXG4gICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIHZhbHVlKTtcclxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XHJcbiAgICAgICAgZW51bWVyYXRvci5fc2V0dGxlZEF0KGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVELCBpLCByZWFzb24pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJHBvbHlmaWxsKCkge1xyXG4gICAgICB2YXIgbG9jYWw7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGxvY2FsID0gZ2xvYmFsO1xyXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgbG9jYWwgPSBzZWxmO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBsb2NhbCA9IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XHJcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5ZmlsbCBmYWlsZWQgYmVjYXVzZSBnbG9iYWwgb2JqZWN0IGlzIHVuYXZhaWxhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIFAgPSBsb2NhbC5Qcm9taXNlO1xyXG5cclxuICAgICAgaWYgKFAgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFAucmVzb2x2ZSgpKSA9PT0gJ1tvYmplY3QgUHJvbWlzZV0nICYmICFQLmNhc3QpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxvY2FsLlByb21pc2UgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdDtcclxuICAgIH1cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJHBvbHlmaWxsO1xyXG5cclxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0LlByb21pc2UgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdDtcclxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0LnBvbHlmaWxsID0gbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0O1xyXG5cclxuICAgIC8qIGdsb2JhbCBkZWZpbmU6dHJ1ZSBtb2R1bGU6dHJ1ZSB3aW5kb3c6IHRydWUgKi9cclxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10pIHtcclxuICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQ7IH0pO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGVbJ2V4cG9ydHMnXSkge1xyXG4gICAgICBtb2R1bGVbJ2V4cG9ydHMnXSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0O1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhpc1snUHJvbWlzZSddID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0KCk7XHJcbn0pLmNhbGwodGhpcyk7XHJcbiIsIihmdW5jdGlvbihzZWxmKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBpZiAoc2VsZi5mZXRjaCkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICB2YXIgc3VwcG9ydCA9IHtcclxuICAgIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcclxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxyXG4gICAgYmxvYjogJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiYgJ0Jsb2InIGluIHNlbGYgJiYgKGZ1bmN0aW9uKCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIG5ldyBCbG9iKClcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfSkoKSxcclxuICAgIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXHJcbiAgICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcclxuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgbmFtZSA9IFN0cmluZyhuYW1lKVxyXG4gICAgfVxyXG4gICAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXFxeX2B8fl0vaS50ZXN0KG5hbWUpKSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcclxuICAgIH1cclxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZVxyXG4gIH1cclxuXHJcbiAgLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcclxuICBmdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xyXG4gICAgdmFyIGl0ZXJhdG9yID0ge1xyXG4gICAgICBuZXh0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXHJcbiAgICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xyXG4gICAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaXRlcmF0b3JcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xyXG4gICAgdGhpcy5tYXAgPSB7fVxyXG5cclxuICAgIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xyXG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcclxuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcclxuICAgICAgfSwgdGhpcylcclxuXHJcbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcclxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcclxuICAgICAgfSwgdGhpcylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XHJcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxyXG4gICAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcclxuICAgIHZhciBsaXN0ID0gdGhpcy5tYXBbbmFtZV1cclxuICAgIGlmICghbGlzdCkge1xyXG4gICAgICBsaXN0ID0gW11cclxuICAgICAgdGhpcy5tYXBbbmFtZV0gPSBsaXN0XHJcbiAgICB9XHJcbiAgICBsaXN0LnB1c2godmFsdWUpXHJcbiAgfVxyXG5cclxuICBIZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cclxuICB9XHJcblxyXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgIHZhciB2YWx1ZXMgPSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxyXG4gICAgcmV0dXJuIHZhbHVlcyA/IHZhbHVlc1swXSA6IG51bGxcclxuICB9XHJcblxyXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSB8fCBbXVxyXG4gIH1cclxuXHJcbiAgSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXHJcbiAgfVxyXG5cclxuICBIZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xyXG4gICAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBbbm9ybWFsaXplVmFsdWUodmFsdWUpXVxyXG4gIH1cclxuXHJcbiAgSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XHJcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLm1hcCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgIHRoaXMubWFwW25hbWVdLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBuYW1lLCB0aGlzKVxyXG4gICAgICB9LCB0aGlzKVxyXG4gICAgfSwgdGhpcylcclxuICB9XHJcblxyXG4gIEhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpdGVtcyA9IFtdXHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChuYW1lKSB9KVxyXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxyXG4gIH1cclxuXHJcbiAgSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaXRlbXMgPSBbXVxyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IGl0ZW1zLnB1c2godmFsdWUpIH0pXHJcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXHJcbiAgfVxyXG5cclxuICBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaXRlbXMgPSBbXVxyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSkgfSlcclxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcclxuICB9XHJcblxyXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XHJcbiAgICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xyXG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxyXG4gICAgfVxyXG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWVcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcclxuICAgICAgfVxyXG4gICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xyXG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxyXG4gICAgcmV0dXJuIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XHJcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcclxuICAgIHJldHVybiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gQm9keSgpIHtcclxuICAgIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxyXG5cclxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xyXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcclxuICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxyXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XHJcbiAgICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XHJcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xyXG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcclxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcclxuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxyXG4gICAgICB9IGVsc2UgaWYgKCFib2R5KSB7XHJcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xyXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcclxuICAgICAgICAvLyBPbmx5IHN1cHBvcnQgQXJyYXlCdWZmZXJzIGZvciBQT1NUIG1ldGhvZC5cclxuICAgICAgICAvLyBSZWNlaXZpbmcgQXJyYXlCdWZmZXJzIGhhcHBlbnMgdmlhIEJsb2JzLCBpbnN0ZWFkLlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcclxuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXHJcbiAgICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcclxuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN1cHBvcnQuYmxvYikge1xyXG4gICAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxyXG4gICAgICAgIGlmIChyZWplY3RlZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcclxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXHJcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xyXG4gICAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxyXG4gICAgICAgIHJldHVybiByZWplY3RlZCA/IHJlamVjdGVkIDogUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcclxuICAgICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICAvLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcclxuICB2YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxyXG5cclxuICBmdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XHJcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXHJcbiAgICByZXR1cm4gKG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xKSA/IHVwY2FzZWQgOiBtZXRob2RcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxyXG4gICAgaWYgKFJlcXVlc3QucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoaW5wdXQpKSB7XHJcbiAgICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cmwgPSBpbnB1dC51cmxcclxuICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXHJcbiAgICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcclxuICAgICAgfVxyXG4gICAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxyXG4gICAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXHJcbiAgICAgIGlmICghYm9keSkge1xyXG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcclxuICAgICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy51cmwgPSBpbnB1dFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnXHJcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcclxuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxyXG4gICAgfVxyXG4gICAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXHJcbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcclxuICAgIHRoaXMucmVmZXJyZXIgPSBudWxsXHJcblxyXG4gICAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXHJcbiAgICB9XHJcbiAgICB0aGlzLl9pbml0Qm9keShib2R5KVxyXG4gIH1cclxuXHJcbiAgUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcclxuICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGJvZHkudHJpbSgpLnNwbGl0KCcmJykuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xyXG4gICAgICBpZiAoYnl0ZXMpIHtcclxuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXHJcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXHJcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXHJcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGZvcm1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhlYWRlcnMoeGhyKSB7XHJcbiAgICB2YXIgaGVhZCA9IG5ldyBIZWFkZXJzKClcclxuICAgIHZhciBwYWlycyA9ICh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpLnRyaW0oKS5zcGxpdCgnXFxuJylcclxuICAgIHBhaXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XHJcbiAgICAgIHZhciBzcGxpdCA9IGhlYWRlci50cmltKCkuc3BsaXQoJzonKVxyXG4gICAgICB2YXIga2V5ID0gc3BsaXQuc2hpZnQoKS50cmltKClcclxuICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignOicpLnRyaW0oKVxyXG4gICAgICBoZWFkLmFwcGVuZChrZXksIHZhbHVlKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBoZWFkXHJcbiAgfVxyXG5cclxuICBCb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXHJcblxyXG4gIGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XHJcbiAgICBpZiAoIW9wdGlvbnMpIHtcclxuICAgICAgb3B0aW9ucyA9IHt9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXHJcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzXHJcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXHJcbiAgICB0aGlzLnN0YXR1c1RleHQgPSBvcHRpb25zLnN0YXR1c1RleHRcclxuICAgIHRoaXMuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMgPyBvcHRpb25zLmhlYWRlcnMgOiBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXHJcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXHJcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcclxuICB9XHJcblxyXG4gIEJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXHJcblxyXG4gIFJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xyXG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxyXG4gICAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXHJcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXHJcbiAgICAgIHVybDogdGhpcy51cmxcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBSZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcclxuICAgIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXHJcbiAgICByZXR1cm4gcmVzcG9uc2VcclxuICB9XHJcblxyXG4gIHZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxyXG5cclxuICBSZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XHJcbiAgICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XHJcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcclxuICB9XHJcblxyXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcclxuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XHJcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXHJcblxyXG4gIHNlbGYuZmV0Y2ggPSBmdW5jdGlvbihpbnB1dCwgaW5pdCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICB2YXIgcmVxdWVzdFxyXG4gICAgICBpZiAoUmVxdWVzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihpbnB1dCkgJiYgIWluaXQpIHtcclxuICAgICAgICByZXF1ZXN0ID0gaW5wdXRcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVzcG9uc2VVUkwoKSB7XHJcbiAgICAgICAgaWYgKCdyZXNwb25zZVVSTCcgaW4geGhyKSB7XHJcbiAgICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlVVJMXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBdm9pZCBzZWN1cml0eSB3YXJuaW5ncyBvbiBnZXRSZXNwb25zZUhlYWRlciB3aGVuIG5vdCBhbGxvd2VkIGJ5IENPUlNcclxuICAgICAgICBpZiAoL15YLVJlcXVlc3QtVVJMOi9tLnRlc3QoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHhoci5nZXRSZXNwb25zZUhlYWRlcignWC1SZXF1ZXN0LVVSTCcpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxyXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzKHhociksXHJcbiAgICAgICAgICB1cmw6IHJlc3BvbnNlVVJMKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcclxuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxyXG5cclxuICAgICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xyXG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XHJcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcclxuICAgIH0pXHJcbiAgfVxyXG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlXHJcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBwcm9taXNlUG9seSBmcm9tIFwiLi9lczYtcHJvbWlzZVwiO1xuXG52YXIgJGRvbSRTVVBQT1JUU19BRERFVkVOVExJU1RFTkVSJCQgPSAhIWRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI7XG5cbmZ1bmN0aW9uICRkb20kYWRkTGlzdGVuZXIkJCgkZWxlbWVudCQkOSQkLCAkY2FsbGJhY2skJDQ3JCQpe1xuXHQkZG9tJFNVUFBPUlRTX0FEREVWRU5UTElTVEVORVIkJCA/ICRlbGVtZW50JCQ5JCQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAkY2FsbGJhY2skJDQ3JCQsICExKSA6ICRlbGVtZW50JCQ5JCQuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIiwgJGNhbGxiYWNrJCQ0NyQkKTtcbn1cblxuZnVuY3Rpb24gJGRvbSR3YWl0Rm9yQm9keSQkKCRjYWxsYmFjayQkNDgkJCkge1xuXHRkb2N1bWVudC5ib2R5ID9cblx0XHQkY2FsbGJhY2skJDQ4JCQoKSA6XG5cdFx0JGRvbSRTVVBQT1JUU19BRERFVkVOVExJU1RFTkVSJCQgP1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgJGNhbGxiYWNrJCQ0OCQkKSA6XG5cdFx0XHRkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XCJpbnRlcmFjdGl2ZVwiICE9IGRvY3VtZW50LnJlYWR5U3RhdGUgJiYgXCJjb21wbGV0ZVwiICE9IGRvY3VtZW50LnJlYWR5U3RhdGUgfHwgJGNhbGxiYWNrJCQ0OCQkKCk7XG5cdFx0XHR9KTtcbn1cblxuZnVuY3Rpb24gJGZvbnRmYWNlJFJ1bGVyJCQoJHRleHQkJDExJCQpIHtcblx0dGhpcy4kYSQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0aGlzLiRhJC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG5cdHRoaXMuJGEkLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCR0ZXh0JCQxMSQkKSk7XG5cdHRoaXMuJGIkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cdHRoaXMuJGMkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cdHRoaXMuJGgkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cdHRoaXMuJGYkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cdHRoaXMuJGckID0gLTE7XG5cdHRoaXMuJGIkLnN0eWxlLmNzc1RleHQgPSBcIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xuXHR0aGlzLiRjJC5zdHlsZS5jc3NUZXh0ID0gXCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcblx0dGhpcy4kZiQuc3R5bGUuY3NzVGV4dCA9IFwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG5cdHRoaXMuJGgkLnN0eWxlLmNzc1RleHQgPSBcImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7XCI7XG5cdHRoaXMuJGIkLmFwcGVuZENoaWxkKHRoaXMuJGgkKTtcblx0dGhpcy4kYyQuYXBwZW5kQ2hpbGQodGhpcy4kZiQpO1xuXHR0aGlzLiRhJC5hcHBlbmRDaGlsZCh0aGlzLiRiJCk7XG5cdHRoaXMuJGEkLmFwcGVuZENoaWxkKHRoaXMuJGMkKTtcbn1cblxuZnVuY3Rpb24gJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19zZXRGb250JCQoJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19zZXRGb250JHNlbGYkJCwgJGZvbnQkJDMkJCkge1xuXHQkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX3NldEZvbnQkc2VsZiQkLiRhJC5zdHlsZS5jc3NUZXh0ID0gXCJtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7bGVmdDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQ6XCIgKyAkZm9udCQkMyQkICsgXCI7XCI7XG59XG5cbmZ1bmN0aW9uICRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZm9udGZhY2VfUnVsZXJfcHJvdG90eXBlJHJlc2V0JCQoJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19mb250ZmFjZV9SdWxlcl9wcm90b3R5cGUkcmVzZXQkc2VsZiQkKSB7XG5cdHZhciAkb2Zmc2V0V2lkdGgkJCA9ICRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZm9udGZhY2VfUnVsZXJfcHJvdG90eXBlJHJlc2V0JHNlbGYkJC4kYSQub2Zmc2V0V2lkdGgsICR3aWR0aCQkMTMkJCA9ICRvZmZzZXRXaWR0aCQkICsgMTAwO1xuXHQkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2ZvbnRmYWNlX1J1bGVyX3Byb3RvdHlwZSRyZXNldCRzZWxmJCQuJGYkLnN0eWxlLndpZHRoID0gJHdpZHRoJCQxMyQkICsgXCJweFwiO1xuXHQkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2ZvbnRmYWNlX1J1bGVyX3Byb3RvdHlwZSRyZXNldCRzZWxmJCQuJGMkLnNjcm9sbExlZnQgPSAkd2lkdGgkJDEzJCQ7XG5cdCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZm9udGZhY2VfUnVsZXJfcHJvdG90eXBlJHJlc2V0JHNlbGYkJC4kYiQuc2Nyb2xsTGVmdCA9ICRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZm9udGZhY2VfUnVsZXJfcHJvdG90eXBlJHJlc2V0JHNlbGYkJC4kYiQuc2Nyb2xsV2lkdGggKyAxMDA7XG5cdHJldHVybiAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2ZvbnRmYWNlX1J1bGVyX3Byb3RvdHlwZSRyZXNldCRzZWxmJCQuJGckICE9PSAkb2Zmc2V0V2lkdGgkJCA/ICgkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2ZvbnRmYWNlX1J1bGVyX3Byb3RvdHlwZSRyZXNldCRzZWxmJCQuJGckID0gJG9mZnNldFdpZHRoJCQsICEwKSA6ICExO1xufVxuXG5mdW5jdGlvbiAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uUmVzaXplJCQoJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19vblJlc2l6ZSRzZWxmJCQsICRjYWxsYmFjayQkNTAkJCkge1xuXHRmdW5jdGlvbiAkb25TY3JvbGwkJCgpIHtcblx0XHR2YXIgJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19vblNjcm9sbCRzZWxmJCRpbmxpbmVfMzQkJCA9ICR0aGF0JCQ7XG5cdFx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19mb250ZmFjZV9SdWxlcl9wcm90b3R5cGUkcmVzZXQkJCgkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uU2Nyb2xsJHNlbGYkJGlubGluZV8zNCQkKSAmJiBudWxsICE9PSAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uU2Nyb2xsJHNlbGYkJGlubGluZV8zNCQkLiRhJC5wYXJlbnROb2RlICYmICRjYWxsYmFjayQkNTAkJCgkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uU2Nyb2xsJHNlbGYkJGlubGluZV8zNCQkLiRnJCk7XG5cdH1cblx0dmFyICR0aGF0JCQgPSAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uUmVzaXplJHNlbGYkJDtcblx0JGRvbSRhZGRMaXN0ZW5lciQkKCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfb25SZXNpemUkc2VsZiQkLiRiJCwgJG9uU2Nyb2xsJCQpO1xuXHQkZG9tJGFkZExpc3RlbmVyJCQoJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19vblJlc2l6ZSRzZWxmJCQuJGMkLCAkb25TY3JvbGwkJCk7XG5cdCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZm9udGZhY2VfUnVsZXJfcHJvdG90eXBlJHJlc2V0JCQoJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19vblJlc2l6ZSRzZWxmJCQpO1xufVxuXG4vLyBJbnB1dCAzXG5mdW5jdGlvbiAkZm9udGZhY2UkT2JzZXJ2ZXIkJCgkZmFtaWx5JCQsICRvcHRfZGVzY3JpcHRvcnMkJCkge1xuXHR2YXIgJGRlc2NyaXB0b3JzJCQxJCQgPSAkb3B0X2Rlc2NyaXB0b3JzJCQgfHwge307XG5cdHRoaXMuZmFtaWx5ID0gJGZhbWlseSQkO1xuXHR0aGlzLnN0eWxlID0gJGRlc2NyaXB0b3JzJCQxJCQuc3R5bGUgfHwgXCJub3JtYWxcIjtcblx0dGhpcy53ZWlnaHQgPSAkZGVzY3JpcHRvcnMkJDEkJC53ZWlnaHQgfHwgXCJub3JtYWxcIjtcblx0dGhpcy5zdHJldGNoID0gJGRlc2NyaXB0b3JzJCQxJCQuc3RyZXRjaCB8fCBcIm5vcm1hbFwiO1xufVxuXG52YXIgJGZvbnRmYWNlJE9ic2VydmVyJEhBU19XRUJLSVRfRkFMTEJBQ0tfQlVHJCQgPSBudWxsLFxuXHQkZm9udGZhY2UkT2JzZXJ2ZXIkU1VQUE9SVFNfU1RSRVRDSCQkID0gbnVsbCxcblx0JGZvbnRmYWNlJE9ic2VydmVyJFNVUFBPUlRTX05BVElWRSQkID0gISF3aW5kb3cuRm9udEZhY2U7XG5cbmZ1bmN0aW9uICRmb250ZmFjZSRPYnNlcnZlciRzdXBwb3J0U3RyZXRjaCQkKCkge1xuXHRpZiAobnVsbCA9PT0gJGZvbnRmYWNlJE9ic2VydmVyJFNVUFBPUlRTX1NUUkVUQ0gkJCkge1xuXHRcdHZhciAkZGl2JCQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdHRyeSB7XG5cdFx0XHQkZGl2JCQuc3R5bGUuZm9udCA9IFwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIjtcblx0XHR9IGNhdGNoICgkZSQkNiQkKSB7fVxuXHRcdCRmb250ZmFjZSRPYnNlcnZlciRTVVBQT1JUU19TVFJFVENIJCQgPSBcIlwiICE9PSAkZGl2JCQuc3R5bGUuZm9udDtcblx0fVxuXHRyZXR1cm4gJGZvbnRmYWNlJE9ic2VydmVyJFNVUFBPUlRTX1NUUkVUQ0gkJDtcbn1cblxuZnVuY3Rpb24gJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19nZXRTdHlsZSQkKCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZ2V0U3R5bGUkc2VsZiQkLCAkZmFtaWx5JCQxJCQpIHtcblx0cmV0dXJuIFskSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2dldFN0eWxlJHNlbGYkJC5zdHlsZSwgJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19nZXRTdHlsZSRzZWxmJCQud2VpZ2h0LCAkZm9udGZhY2UkT2JzZXJ2ZXIkc3VwcG9ydFN0cmV0Y2gkJCgpID8gJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19nZXRTdHlsZSRzZWxmJCQuc3RyZXRjaCA6IFwiXCIsIFwiMTAwcHhcIiwgJGZhbWlseSQkMSQkXS5qb2luKFwiIFwiKTtcbn1cblxuJGZvbnRmYWNlJE9ic2VydmVyJCQucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAkJGZvbnRmYWNlJE9ic2VydmVyJCQkJGxvYWQkKCR0ZXh0JCQxMiQkLCAkdGltZW91dCQkKSB7XG5cdHZhciAkdGhhdCQkMSQkID0gdGhpcyxcblx0XHQkdGVzdFN0cmluZyQkID0gJHRleHQkJDEyJCQgfHwgXCJCRVNic3d5XCIsXG5cdFx0JHRpbWVvdXRWYWx1ZSQkID0gJHRpbWVvdXQkJCB8fCAzRTMsXG5cdFx0JHN0YXJ0JCQxNiQkID0gKG5ldyBEYXRlKS5nZXRUaW1lKCk7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKCRyZXNvbHZlJCQsICRyZWplY3QkJCkge1xuXHRcdGlmICgkZm9udGZhY2UkT2JzZXJ2ZXIkU1VQUE9SVFNfTkFUSVZFJCQpIHtcblx0XHRcdHZhciAkbG9hZGVyJCQgPSBuZXcgUHJvbWlzZShmdW5jdGlvbigkcmVzb2x2ZSQkMSQkLCAkcmVqZWN0JCQxJCQpIHtcblx0XHRcdFx0ZnVuY3Rpb24gJGNoZWNrJCQoKSB7XG5cdFx0XHRcdFx0KG5ldyBEYXRlKS5nZXRUaW1lKCkgLSAkc3RhcnQkJDE2JCQgPj0gJHRpbWVvdXRWYWx1ZSQkID8gJHJlamVjdCQkMSQkKCkgOiBkb2N1bWVudC5mb250cy5sb2FkKCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZ2V0U3R5bGUkJCgkdGhhdCQkMSQkLCAkdGhhdCQkMSQkLmZhbWlseSksICR0ZXN0U3RyaW5nJCQpLnRoZW4oZnVuY3Rpb24oJGZvbnRzJCQpIHtcblx0XHRcdFx0XHRcdFx0MSA8PSAkZm9udHMkJC5sZW5ndGggPyAkcmVzb2x2ZSQkMSQkKCkgOiBzZXRUaW1lb3V0KCRjaGVjayQkLCAyNSk7XG5cdFx0XHRcdFx0XHR9LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0JHJlamVjdCQkMSQkKCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkY2hlY2skJCgpO1xuXHRcdFx0fSksXG5cdFx0XHQkdGltZXIkJCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKCRyZXNvbHZlJCQyJCQsICRyZWplY3QkJDIkJCkge1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoJHJlamVjdCQkMiQkLCAkdGltZW91dFZhbHVlJCQpO1xuXHRcdFx0fSk7XG5cblx0XHRcdFByb21pc2UucmFjZShbJHRpbWVyJCQsICRsb2FkZXIkJF0pXG5cdFx0XHQudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkcmVzb2x2ZSQkKCR0aGF0JCQxJCQpO1xuXHRcdFx0XHR9LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkcmVqZWN0JCQoJHRoYXQkJDEkJCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRkb20kd2FpdEZvckJvZHkkJChmdW5jdGlvbigpIHtcblx0XHRcdFx0ZnVuY3Rpb24gJGNoZWNrJCQxJCQoKSB7XG5cdFx0XHRcdFx0dmFyICRKU0NvbXBpbGVyX3RlbXAkJDFfSlNDb21waWxlcl90ZW1wJCQyX21hdGNoJCRpbmxpbmVfNDAkJDtcblxuXHRcdFx0XHRcdGlmICgkSlNDb21waWxlcl90ZW1wJCQxX0pTQ29tcGlsZXJfdGVtcCQkMl9tYXRjaCQkaW5saW5lXzQwJCQgPSAtMSAhPSAkd2lkdGhBJCQgJiYgLTEgIT0gJHdpZHRoQiQkIHx8IC0xICE9ICR3aWR0aEEkJCAmJiAtMSAhPSAkd2lkdGhDJCQgfHwgLTEgIT0gJHdpZHRoQiQkICYmIC0xICE9ICR3aWR0aEMkJCkge1xuXHRcdFx0XHRcdFx0KCRKU0NvbXBpbGVyX3RlbXAkJDFfSlNDb21waWxlcl90ZW1wJCQyX21hdGNoJCRpbmxpbmVfNDAkJCA9ICR3aWR0aEEkJCAhPSAkd2lkdGhCJCQgJiYgJHdpZHRoQSQkICE9ICR3aWR0aEMkJCAmJiAkd2lkdGhCJCQgIT0gJHdpZHRoQyQkKSB8fCAobnVsbCA9PT0gJGZvbnRmYWNlJE9ic2VydmVyJEhBU19XRUJLSVRfRkFMTEJBQ0tfQlVHJCQgJiYgKCRKU0NvbXBpbGVyX3RlbXAkJDFfSlNDb21waWxlcl90ZW1wJCQyX21hdGNoJCRpbmxpbmVfNDAkJCA9IC9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSwgJGZvbnRmYWNlJE9ic2VydmVyJEhBU19XRUJLSVRfRkFMTEJBQ0tfQlVHJCQgPSAhISRKU0NvbXBpbGVyX3RlbXAkJDFfSlNDb21waWxlcl90ZW1wJCQyX21hdGNoJCRpbmxpbmVfNDAkJCAmJiAoNTM2ID4gcGFyc2VJbnQoJEpTQ29tcGlsZXJfdGVtcCQkMV9KU0NvbXBpbGVyX3RlbXAkJDJfbWF0Y2gkJGlubGluZV80MCQkWzFdLCAxMCkgfHwgNTM2ID09PSBwYXJzZUludCgkSlNDb21waWxlcl90ZW1wJCQxX0pTQ29tcGlsZXJfdGVtcCQkMl9tYXRjaCQkaW5saW5lXzQwJCRbMV0sIDEwKSAmJiAxMSA+PSBwYXJzZUludCgkSlNDb21waWxlcl90ZW1wJCQxX0pTQ29tcGlsZXJfdGVtcCQkMl9tYXRjaCQkaW5saW5lXzQwJCRbMl0sIDEwKSkpLCAkSlNDb21waWxlcl90ZW1wJCQxX0pTQ29tcGlsZXJfdGVtcCQkMl9tYXRjaCQkaW5saW5lXzQwJCQgPSAkZm9udGZhY2UkT2JzZXJ2ZXIkSEFTX1dFQktJVF9GQUxMQkFDS19CVUckJCAmJiAoJHdpZHRoQSQkID09ICRmYWxsYmFja1dpZHRoQSQkICYmICR3aWR0aEIkJCA9PSAkZmFsbGJhY2tXaWR0aEEkJCAmJiAkd2lkdGhDJCQgPT0gJGZhbGxiYWNrV2lkdGhBJCQgfHwgJHdpZHRoQSQkID09ICRmYWxsYmFja1dpZHRoQiQkICYmICR3aWR0aEIkJCA9PSAkZmFsbGJhY2tXaWR0aEIkJCAmJiAkd2lkdGhDJCQgPT0gJGZhbGxiYWNrV2lkdGhCJCQgfHwgJHdpZHRoQSQkID09ICRmYWxsYmFja1dpZHRoQyQkICYmICR3aWR0aEIkJCA9PSAkZmFsbGJhY2tXaWR0aEMkJCAmJiAkd2lkdGhDJCQgPT0gJGZhbGxiYWNrV2lkdGhDJCQpKSwgJEpTQ29tcGlsZXJfdGVtcCQkMV9KU0NvbXBpbGVyX3RlbXAkJDJfbWF0Y2gkJGlubGluZV80MCQkID0gISRKU0NvbXBpbGVyX3RlbXAkJDFfSlNDb21waWxlcl90ZW1wJCQyX21hdGNoJCRpbmxpbmVfNDAkJDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JEpTQ29tcGlsZXJfdGVtcCQkMV9KU0NvbXBpbGVyX3RlbXAkJDJfbWF0Y2gkJGlubGluZV80MCQkICYmIChudWxsICE9PSAkY29udGFpbmVyJCQucGFyZW50Tm9kZSAmJiAkY29udGFpbmVyJCQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCgkY29udGFpbmVyJCQpLCBjbGVhclRpbWVvdXQoJHRpbWVvdXRJZCQkKSwgJHJlc29sdmUkJCgkdGhhdCQkMSQkKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiAkY2hlY2tGb3JUaW1lb3V0JCQoKSB7XG5cdFx0XHRcdFx0aWYgKChuZXcgRGF0ZSkuZ2V0VGltZSgpIC0gJHN0YXJ0JCQxNiQkID49ICR0aW1lb3V0VmFsdWUkJCkge1xuXHRcdFx0XHRcdFx0bnVsbCAhPT0gJGNvbnRhaW5lciQkLnBhcmVudE5vZGUgJiYgJGNvbnRhaW5lciQkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoJGNvbnRhaW5lciQkKSwgJHJlamVjdCQkKCR0aGF0JCQxJCQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgJGhpZGRlbiQkID0gZG9jdW1lbnQuaGlkZGVuO1xuXHRcdFx0XHRcdFx0aWYgKCEwID09PSAkaGlkZGVuJCQgfHwgdm9pZCAwID09PSAkaGlkZGVuJCQpIHtcblx0XHRcdFx0XHRcdFx0JHdpZHRoQSQkID0gJHJ1bGVyQSQkLiRhJC5vZmZzZXRXaWR0aCwgJHdpZHRoQiQkID0gJHJ1bGVyQiQkLiRhJC5vZmZzZXRXaWR0aCwgJHdpZHRoQyQkID0gJHJ1bGVyQyQkLiRhJC5vZmZzZXRXaWR0aCwgJGNoZWNrJCQxJCQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCR0aW1lb3V0SWQkJCA9IHNldFRpbWVvdXQoJGNoZWNrRm9yVGltZW91dCQkLCA1MCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyICRydWxlckEkJCA9IG5ldyAkZm9udGZhY2UkUnVsZXIkJCgkdGVzdFN0cmluZyQkKSxcblx0XHRcdFx0XHQkcnVsZXJCJCQgPSBuZXcgJGZvbnRmYWNlJFJ1bGVyJCQoJHRlc3RTdHJpbmckJCksXG5cdFx0XHRcdFx0JHJ1bGVyQyQkID0gbmV3ICRmb250ZmFjZSRSdWxlciQkKCR0ZXN0U3RyaW5nJCQpLFxuXHRcdFx0XHRcdCR3aWR0aEEkJCA9IC0xLFxuXHRcdFx0XHRcdCR3aWR0aEIkJCA9IC0xLFxuXHRcdFx0XHRcdCR3aWR0aEMkJCA9IC0xLFxuXHRcdFx0XHRcdCRmYWxsYmFja1dpZHRoQSQkID0gLTEsXG5cdFx0XHRcdFx0JGZhbGxiYWNrV2lkdGhCJCQgPSAtMSxcblx0XHRcdFx0XHQkZmFsbGJhY2tXaWR0aEMkJCA9IC0xLFxuXHRcdFx0XHRcdCRjb250YWluZXIkJCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0XHRcdFx0JHRpbWVvdXRJZCQkID0gMDtcblxuXHRcdFx0XHQkY29udGFpbmVyJCQuZGlyID0gXCJsdHJcIjtcblx0XHRcdFx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19zZXRGb250JCQoJHJ1bGVyQSQkLCAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2dldFN0eWxlJCQoJHRoYXQkJDEkJCwgXCJzYW5zLXNlcmlmXCIpKTtcblx0XHRcdFx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19zZXRGb250JCQoJHJ1bGVyQiQkLCAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2dldFN0eWxlJCQoJHRoYXQkJDEkJCwgXCJzZXJpZlwiKSk7XG5cdFx0XHRcdCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfc2V0Rm9udCQkKCRydWxlckMkJCwgJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19nZXRTdHlsZSQkKCR0aGF0JCQxJCQsIFwibW9ub3NwYWNlXCIpKTtcblx0XHRcdFx0JGNvbnRhaW5lciQkLmFwcGVuZENoaWxkKCRydWxlckEkJC4kYSQpO1xuXHRcdFx0XHQkY29udGFpbmVyJCQuYXBwZW5kQ2hpbGQoJHJ1bGVyQiQkLiRhJCk7XG5cdFx0XHRcdCRjb250YWluZXIkJC5hcHBlbmRDaGlsZCgkcnVsZXJDJCQuJGEkKTtcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCgkY29udGFpbmVyJCQpO1xuXHRcdFx0XHQkZmFsbGJhY2tXaWR0aEEkJCA9ICRydWxlckEkJC4kYSQub2Zmc2V0V2lkdGg7XG5cdFx0XHRcdCRmYWxsYmFja1dpZHRoQiQkID0gJHJ1bGVyQiQkLiRhJC5vZmZzZXRXaWR0aDtcblx0XHRcdFx0JGZhbGxiYWNrV2lkdGhDJCQgPSAkcnVsZXJDJCQuJGEkLm9mZnNldFdpZHRoO1xuXG5cdFx0XHRcdCRjaGVja0ZvclRpbWVvdXQkJCgpO1xuXG5cdFx0XHRcdCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfb25SZXNpemUkJCgkcnVsZXJBJCQsIGZ1bmN0aW9uKCR3aWR0aCQkMTQkJCkge1xuXHRcdFx0XHRcdCR3aWR0aEEkJCA9ICR3aWR0aCQkMTQkJDtcblx0XHRcdFx0XHQkY2hlY2skJDEkJCgpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX3NldEZvbnQkJCgkcnVsZXJBJCQsICRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZ2V0U3R5bGUkJCgkdGhhdCQkMSQkLCAnXCInICsgJHRoYXQkJDEkJC5mYW1pbHkgKyAnXCIsc2Fucy1zZXJpZicpKTtcblx0XHRcdFx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19vblJlc2l6ZSQkKCRydWxlckIkJCwgZnVuY3Rpb24oJHdpZHRoJCQxNSQkKSB7XG5cdFx0XHRcdFx0JHdpZHRoQiQkID0gJHdpZHRoJCQxNSQkO1xuXHRcdFx0XHRcdCRjaGVjayQkMSQkKCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfc2V0Rm9udCQkKCRydWxlckIkJCwgJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19nZXRTdHlsZSQkKCR0aGF0JCQxJCQsICdcIicgKyAkdGhhdCQkMSQkLmZhbWlseSArICdcIixzZXJpZicpKTtcblx0XHRcdFx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19vblJlc2l6ZSQkKCRydWxlckMkJCwgZnVuY3Rpb24oJHdpZHRoJCQxNiQkKSB7XG5cdFx0XHRcdFx0JHdpZHRoQyQkID0gJHdpZHRoJCQxNiQkO1xuXHRcdFx0XHRcdCRjaGVjayQkMSQkKCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfc2V0Rm9udCQkKCRydWxlckMkJCwgJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19nZXRTdHlsZSQkKCR0aGF0JCQxJCQsICdcIicgKyAkdGhhdCQkMSQkLmZhbWlseSArICdcIixtb25vc3BhY2UnKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCAkZm9udGZhY2UkT2JzZXJ2ZXIkJDtcbiIsIiFmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgZGVmaW5lICYmIGRlZmluZS5hbWQgPyAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUgdW5sZXNzIGFtZE1vZHVsZUlkIGlzIHNldFxuXHRkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiByb290LnN2ZzRldmVyeWJvZHkgPSBmYWN0b3J5KCk7XG5cdH0pIDogXCJvYmplY3RcIiA9PSB0eXBlb2YgZXhwb3J0cyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDogcm9vdC5zdmc0ZXZlcnlib2R5ID0gZmFjdG9yeSgpO1xufSh0aGlzLCBmdW5jdGlvbigpIHtcblx0LyohIHN2ZzRldmVyeWJvZHkgdjIuMC4zIHwgZ2l0aHViLmNvbS9qb25hdGhhbnRuZWFsL3N2ZzRldmVyeWJvZHkgKi9cblx0ZnVuY3Rpb24gZW1iZWQoc3ZnLCB0YXJnZXQpIHtcblx0XHQvLyBpZiB0aGUgdGFyZ2V0IGV4aXN0c1xuXHRcdGlmICh0YXJnZXQpIHtcblx0XHRcdC8vIGNyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IHRvIGhvbGQgdGhlIGNvbnRlbnRzIG9mIHRoZSB0YXJnZXRcblx0XHRcdHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSwgdmlld0JveCA9ICFzdmcuZ2V0QXR0cmlidXRlKFwidmlld0JveFwiKSAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlKFwidmlld0JveFwiKTtcblx0XHRcdC8vIGNvbmRpdGlvbmFsbHkgc2V0IHRoZSB2aWV3Qm94IG9uIHRoZSBzdmdcblx0XHRcdHZpZXdCb3ggJiYgc3ZnLnNldEF0dHJpYnV0ZShcInZpZXdCb3hcIiwgdmlld0JveCk7XG5cdFx0XHQvLyBjb3B5IHRoZSBjb250ZW50cyBvZiB0aGUgY2xvbmUgaW50byB0aGUgZnJhZ21lbnRcblx0XHRcdGZvciAoLy8gY2xvbmUgdGhlIHRhcmdldFxuXHRcdFx0dmFyIGNsb25lID0gdGFyZ2V0LmNsb25lTm9kZSghMCk7IGNsb25lLmNoaWxkTm9kZXMubGVuZ3RoOyApIHtcblx0XHRcdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2xvbmUuZmlyc3RDaGlsZCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBhcHBlbmQgdGhlIGZyYWdtZW50IGludG8gdGhlIHN2Z1xuXHRcdFx0c3ZnLmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gbG9hZHJlYWR5c3RhdGVjaGFuZ2UoeGhyKSB7XG5cdFx0Ly8gbGlzdGVuIHRvIGNoYW5nZXMgaW4gdGhlIHJlcXVlc3Rcblx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBpZiB0aGUgcmVxdWVzdCBpcyByZWFkeVxuXHRcdFx0aWYgKDQgPT09IHhoci5yZWFkeVN0YXRlKSB7XG5cdFx0XHRcdC8vIGdldCB0aGUgY2FjaGVkIGh0bWwgZG9jdW1lbnRcblx0XHRcdFx0dmFyIGNhY2hlZERvY3VtZW50ID0geGhyLl9jYWNoZWREb2N1bWVudDtcblx0XHRcdFx0Ly8gZW5zdXJlIHRoZSBjYWNoZWQgaHRtbCBkb2N1bWVudCBiYXNlZCBvbiB0aGUgeGhyIHJlc3BvbnNlXG5cdFx0XHRcdGNhY2hlZERvY3VtZW50IHx8IChjYWNoZWREb2N1bWVudCA9IHhoci5fY2FjaGVkRG9jdW1lbnQgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoXCJcIiksXG5cdFx0XHRcdGNhY2hlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0geGhyLnJlc3BvbnNlVGV4dCwgeGhyLl9jYWNoZWRUYXJnZXQgPSB7fSksIC8vIGNsZWFyIHRoZSB4aHIgZW1iZWRzIGxpc3QgYW5kIGVtYmVkIGVhY2ggaXRlbVxuXHRcdFx0XHR4aHIuX2VtYmVkcy5zcGxpY2UoMCkubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0XHQvLyBnZXQgdGhlIGNhY2hlZCB0YXJnZXRcblx0XHRcdFx0XHR2YXIgdGFyZ2V0ID0geGhyLl9jYWNoZWRUYXJnZXRbaXRlbS5pZF07XG5cdFx0XHRcdFx0Ly8gZW5zdXJlIHRoZSBjYWNoZWQgdGFyZ2V0XG5cdFx0XHRcdFx0dGFyZ2V0IHx8ICh0YXJnZXQgPSB4aHIuX2NhY2hlZFRhcmdldFtpdGVtLmlkXSA9IGNhY2hlZERvY3VtZW50LmdldEVsZW1lbnRCeUlkKGl0ZW0uaWQpKSxcblx0XHRcdFx0XHQvLyBlbWJlZCB0aGUgdGFyZ2V0IGludG8gdGhlIHN2Z1xuXHRcdFx0XHRcdGVtYmVkKGl0ZW0uc3ZnLCB0YXJnZXQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LCAvLyB0ZXN0IHRoZSByZWFkeSBzdGF0ZSBjaGFuZ2UgaW1tZWRpYXRlbHlcblx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlKCk7XG5cdH1cblx0ZnVuY3Rpb24gc3ZnNGV2ZXJ5Ym9keShyYXdvcHRzKSB7XG5cdFx0ZnVuY3Rpb24gb25pbnRlcnZhbCgpIHtcblx0XHRcdC8vIHdoaWxlIHRoZSBpbmRleCBleGlzdHMgaW4gdGhlIGxpdmUgPHVzZT4gY29sbGVjdGlvblxuXHRcdFx0Zm9yICgvLyBnZXQgdGhlIGNhY2hlZCA8dXNlPiBpbmRleFxuXHRcdFx0dmFyIGluZGV4ID0gMDsgaW5kZXggPCB1c2VzLmxlbmd0aDsgKSB7XG5cdFx0XHRcdC8vIGdldCB0aGUgY3VycmVudCA8dXNlPlxuXHRcdFx0XHR2YXIgdXNlID0gdXNlc1tpbmRleF0sIHN2ZyA9IHVzZS5wYXJlbnROb2RlO1xuXHRcdFx0XHRpZiAoc3ZnICYmIC9zdmcvaS50ZXN0KHN2Zy5ub2RlTmFtZSkpIHtcblx0XHRcdFx0XHR2YXIgc3JjID0gdXNlLmdldEF0dHJpYnV0ZShcInhsaW5rOmhyZWZcIik7XG5cdFx0XHRcdFx0aWYgKHBvbHlmaWxsICYmICghb3B0cy52YWxpZGF0ZSB8fCBvcHRzLnZhbGlkYXRlKHNyYywgc3ZnLCB1c2UpKSkge1xuXHRcdFx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSA8dXNlPiBlbGVtZW50XG5cdFx0XHRcdFx0XHRzdmcucmVtb3ZlQ2hpbGQodXNlKTtcblx0XHRcdFx0XHRcdC8vIHBhcnNlIHRoZSBzcmMgYW5kIGdldCB0aGUgdXJsIGFuZCBpZFxuXHRcdFx0XHRcdFx0dmFyIHNyY1NwbGl0ID0gc3JjLnNwbGl0KFwiI1wiKSwgdXJsID0gc3JjU3BsaXQuc2hpZnQoKSwgaWQgPSBzcmNTcGxpdC5qb2luKFwiI1wiKTtcblx0XHRcdFx0XHRcdC8vIGlmIHRoZSBsaW5rIGlzIGV4dGVybmFsXG5cdFx0XHRcdFx0XHRpZiAodXJsLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHQvLyBnZXQgdGhlIGNhY2hlZCB4aHIgcmVxdWVzdFxuXHRcdFx0XHRcdFx0XHR2YXIgeGhyID0gcmVxdWVzdHNbdXJsXTtcblx0XHRcdFx0XHRcdFx0Ly8gZW5zdXJlIHRoZSB4aHIgcmVxdWVzdCBleGlzdHNcblx0XHRcdFx0XHRcdFx0eGhyIHx8ICh4aHIgPSByZXF1ZXN0c1t1cmxdID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCksIHhoci5vcGVuKFwiR0VUXCIsIHVybCksIHhoci5zZW5kKCksXG5cdFx0XHRcdFx0XHRcdHhoci5fZW1iZWRzID0gW10pLCAvLyBhZGQgdGhlIHN2ZyBhbmQgaWQgYXMgYW4gaXRlbSB0byB0aGUgeGhyIGVtYmVkcyBsaXN0XG5cdFx0XHRcdFx0XHRcdHhoci5fZW1iZWRzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRcdHN2Zzogc3ZnLFxuXHRcdFx0XHRcdFx0XHRcdGlkOiBpZFxuXHRcdFx0XHRcdFx0XHR9KSwgLy8gcHJlcGFyZSB0aGUgeGhyIHJlYWR5IHN0YXRlIGNoYW5nZSBldmVudFxuXHRcdFx0XHRcdFx0XHRsb2FkcmVhZHlzdGF0ZWNoYW5nZSh4aHIpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly8gZW1iZWQgdGhlIGxvY2FsIGlkIGludG8gdGhlIHN2Z1xuXHRcdFx0XHRcdFx0XHRlbWJlZChzdmcsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGluY3JlYXNlIHRoZSBpbmRleCB3aGVuIHRoZSBwcmV2aW91cyB2YWx1ZSB3YXMgbm90IFwidmFsaWRcIlxuXHRcdFx0XHRcdCsraW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIGNvbnRpbnVlIHRoZSBpbnRlcnZhbFxuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9uaW50ZXJ2YWwsIDY3KTtcblx0XHR9XG5cdFx0dmFyIHBvbHlmaWxsLCBvcHRzID0gT2JqZWN0KHJhd29wdHMpLCBuZXdlcklFVUEgPSAvXFxiVHJpZGVudFxcL1s1NjddXFxifFxcYk1TSUUgKD86OXwxMClcXC4wXFxiLywgd2Via2l0VUEgPSAvXFxiQXBwbGVXZWJLaXRcXC8oXFxkKylcXGIvLCBvbGRlckVkZ2VVQSA9IC9cXGJFZGdlXFwvMTJcXC4oXFxkKylcXGIvO1xuXHRcdHBvbHlmaWxsID0gXCJwb2x5ZmlsbFwiIGluIG9wdHMgPyBvcHRzLnBvbHlmaWxsIDogbmV3ZXJJRVVBLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2gob2xkZXJFZGdlVUEpIHx8IFtdKVsxXSA8IDEwNTQ3IHx8IChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKHdlYmtpdFVBKSB8fCBbXSlbMV0gPCA1Mzc7XG5cdFx0Ly8gY3JlYXRlIHhociByZXF1ZXN0cyBvYmplY3Rcblx0XHR2YXIgcmVxdWVzdHMgPSB7fSwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBzZXRUaW1lb3V0LCB1c2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ1c2VcIik7XG5cdFx0Ly8gY29uZGl0aW9uYWxseSBzdGFydCB0aGUgaW50ZXJ2YWwgaWYgdGhlIHBvbHlmaWxsIGlzIGFjdGl2ZVxuXHRcdHBvbHlmaWxsICYmIG9uaW50ZXJ2YWwoKTtcblx0fVxuXHRyZXR1cm4gc3ZnNGV2ZXJ5Ym9keTtcbn0pO1xuIl19
