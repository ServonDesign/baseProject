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
});

},{"../vendor/svg4everybody":8,"./ui/multi-level-menu":4,"./util/polyfills":5}],3:[function(require,module,exports){
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

},{"./dismissible-slidein":3}],5:[function(require,module,exports){
"use strict";

var _es6Promise = require("../../vendor/es6-promise");

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _fetch = require("../../vendor/fetch");

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_es6Promise2.default.polyfill();

},{"../../vendor/es6-promise":6,"../../vendor/fetch":7}],6:[function(require,module,exports){
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

},{"_process":1}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwicmVzb3VyY2VzXFxqc1xcc3JjXFxpbmRleC5qcyIsInJlc291cmNlc1xcanNcXHNyY1xcdWlcXGRpc21pc3NpYmxlLXNsaWRlaW4uanMiLCJyZXNvdXJjZXNcXGpzXFxzcmNcXHVpXFxtdWx0aS1sZXZlbC1tZW51LmpzIiwicmVzb3VyY2VzXFxqc1xcc3JjXFx1dGlsXFxwb2x5ZmlsbHMuanMiLCJyZXNvdXJjZXNcXGpzXFx2ZW5kb3JcXHJlc291cmNlc1xcanNcXHZlbmRvclxcZXM2LXByb21pc2UuanMiLCJyZXNvdXJjZXNcXGpzXFx2ZW5kb3JcXGZldGNoLmpzIiwicmVzb3VyY2VzXFxqc1xcdmVuZG9yXFxzdmc0ZXZlcnlib2R5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNG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LENBQVA7O0FBMUN4RCxVQTRDL0IsSUFBWSxZQUFaLENBNUMrQjtFQUFoQztBQThDQSxRQUFPLGFBQVAsQ0F0RmtCO0NBQVgsQ0FMUiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImltcG9ydCBwb2x5IGZyb20gXCIuL3V0aWwvcG9seWZpbGxzXCI7XG4vL2ltcG9ydCB7c3VtfSBmcm9tIFwiLi9pbXBvcnRcIjtcblxuLy9pbXBvcnQgY3VycnkgZnJvbSBcIi4uL3ZlbmRvci9yYW1kYS9jdXJyeVwiO1xuLy9pbXBvcnQgQnJpY2tzIGZyb20gXCIuLi92ZW5kb3IvYnJpY2tcIjtcblxuaW1wb3J0IGNyZWF0ZU1sTWVudSBmcm9tIFwiLi91aS9tdWx0aS1sZXZlbC1tZW51XCI7XG5pbXBvcnQgc3ZnNGV2ZXJ5Ym9keSBmcm9tIFwiLi4vdmVuZG9yL3N2ZzRldmVyeWJvZHlcIjtcblxuLy9jb25zdCBhZGQgPSAoYSwgYikgPT4gYSArIGI7XG5cbi8vIGNvbnN0IGFkZCA9IGN1cnJ5KHN1bSk7XG4vLyB2YXIgaW5jcmVtZW50ID0gYWRkKDEpO1xuXG4vLyBjb25zb2xlLmxvZyhpbmNyZW1lbnQoMTApKTtcblxuLy8gY29uc29sZS5sb2coYnJpY2spO1xuXG4vLyBmZXRjaCgndGVzdC5qc29uJylcbi8vIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbi8vIFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbi8vIH0pXG4vLyAudGhlbihmdW5jdGlvbihqc29uKXtcbi8vIFx0Y29uc29sZS5sb2coanNvbik7XG4vLyB9KVxuLy8gLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4vLyBcdGNvbnNvbGUubG9nKGVycik7XG4vLyB9KTtcblxuLy8gaW1wb3J0IEJyaWNrc1xuXG4vLyBkZWZpbmUgeW91ciBncmlkIGF0IGRpZmZlcmVudCBicmVha3BvaW50cywgbW9iaWxlIGZpcnN0IChzbWFsbGVzdCB0byBsYXJnZXN0KVxuXG4vLyBjb25zdCBzaXplcyA9IFtcbi8vIFx0eyBjb2x1bW5zOiAyLCBndXR0ZXI6IDEwIH0sICAgICAgICAgICAgICAgICAgIC8vIGFzc3VtZWQgdG8gYmUgbW9iaWxlLCBiZWNhdXNlIG9mIHRoZSBtaXNzaW5nIG1xIHByb3BlcnR5XG4vLyBcdHsgbXE6ICc3NjhweCcsIGNvbHVtbnM6IDMsIGd1dHRlcjogMjUgfSxcbi8vIFx0eyBtcTogJzEwMjRweCcsIGNvbHVtbnM6IDQsIGd1dHRlcjogNTAgfVxuLy8gXVxuXG4vLyBjcmVhdGUgYW4gaW5zdGFuY2VcblxuLy8gY29uc3QgaW5zdGFuY2UgPSBCcmlja3Moe1xuLy8gXHRjb250YWluZXI6ICcuY29udGFpbmVyJyxcbi8vIFx0cGFja2VkOiAgICAnZGF0YS1wYWNrZWQnLCAgICAgICAgLy8gaWYgbm90IHByZWZpeGVkIHdpdGggJ2RhdGEtJywgaXQgd2lsbCBiZSBhZGRlZFxuLy8gXHRzaXplczogICAgIHNpemVzXG4vLyB9KVxuXG4vLyBiaW5kIGNhbGxiYWNrc1xuXG4vLyBpbnN0YW5jZVxuLy8gLm9uKCdwYWNrJywgICAoKSA9PiBjb25zb2xlLmxvZygnQUxMIGdyaWQgaXRlbXMgcGFja2VkLicpKVxuLy8gLm9uKCd1cGRhdGUnLCAoKSA9PiBjb25zb2xlLmxvZygnTkVXIGdyaWQgaXRlbXMgcGFja2VkLicpKVxuLy8gLm9uKCdyZXNpemUnLCBzaXplID0+IGNvbnNvbGUubG9nKCdUaGUgZ3JpZCBoYXMgYmUgcmUtcGFja2VkIHRvIGFjY29tbW9kYXRlIGEgbmV3IEJSRUFLUE9JTlQuJykpXG5cbi8vIHN0YXJ0IGl0IHVwLCB3aGVuIHRoZSBET00gaXMgcmVhZHlcbi8vIG5vdGUgdGhhdCBpZiBpbWFnZXMgYXJlIGluIHRoZSBncmlkLCB5b3UgbWF5IG5lZWQgdG8gd2FpdCBmb3IgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZXZlbnQgPT4ge1xuXHQvLyBpbnN0YW5jZVxuXHQvLyAucmVzaXplKHRydWUpICAgICAvLyBiaW5kIHJlc2l6ZSBoYW5kbGVyXG5cdC8vIC5wYWNrKCk7ICAgICAgICAgICAvLyBwYWNrIGluaXRpYWwgaXRlbXNcblx0Y29uc3QgbWVudSA9IGNyZWF0ZU1sTWVudSgnLmpzLW1lbnUtdGVzdCcsIHtcblx0XHRzaWRlOiAnbGVmdCcsXG5cdFx0Y2xvbmU6IGZhbHNlLFxuXHRcdGJyZWFkY3J1bWJTcGFjZXI6ICc8ZGl2IGNsYXNzPVwibWwtbWVudV9fYnJlYWRjcnVtYi1zcGFjZVwiPjxzdmc+PHVzZSB4bGluazpocmVmPVwiL3Jlc291cmNlcy9pbWdzL3N2Z3Nwcml0ZS5zdmcjYnJlYWRjcnVtYi1zcGFjZXJcIiAvPjwvc3ZnPjwvZGl2PicsXG5cdFx0c3VibmF2TGlua0h0bWw6ICc8c3ZnPjx1c2UgeGxpbms6aHJlZj1cIi9yZXNvdXJjZXMvaW1ncy9zdmdzcHJpdGUuc3ZnI21lbnUtZG90c1wiIC8+PC9zdmc+Jyxcblx0XHRiYWNrQnV0dG9uSHRtbDogJzxzdmc+PHVzZSB4bGluazpocmVmPVwiL3Jlc291cmNlcy9pbWdzL3N2Z3Nwcml0ZS5zdmcjbWVudS1iYWNrXCIgLz48L3N2Zz4nLFxuXHRcdGNsb3NlQnV0dG9uSHRtbDogJzxzdmc+PHVzZSB4bGluazpocmVmPVwiL3Jlc291cmNlcy9pbWdzL3N2Z3Nwcml0ZS5zdmcjY2xvc2VcIiAvPjwvc3ZnPidcblx0fSk7XG5cdGNvbnN0IHNob3dNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1lbnUtc2hvdycpO1xuXHRpZihzaG93TWVudSl7XG5cdFx0c2hvd01lbnUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBtZW51LnNsaWRlSW5Db250cm9sbGVyLnNob3cpO1xuXHR9XG5cblx0c3ZnNGV2ZXJ5Ym9keSgpO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHRyYW5zaXRpb25FbmROYW1lID0gWyd3ZWJraXRUcmFuc2l0aW9uRW5kJywgJ3RyYW5zaXRpb25lbmQnLCAnbXNUcmFuc2l0aW9uRW5kJywgJ29UcmFuc2l0aW9uRW5kJ107XG5cbmNvbnN0IERpc21pc3NpYmxlU2xpZGVJbiA9IHtcblx0aW5pdDogaW5pdCxcblxuXHRzaG93OiBzaG93LFxuXHRoaWRlOiBoaWRlLFxuXHRibG9ja0NsaWNrczogYmxvY2tDbGlja3MsXG5cdG9uU3RhcnQ6IG9uU3RhcnQsXG5cdG9uTW92ZTogb25Nb3ZlLFxuXHRvbkVuZDogb25FbmQsXG5cdG9uVHJhbnNpdGlvbkVuZDogb25UcmFuc2l0aW9uRW5kLFxuXHR1cGRhdGU6IHVwZGF0ZSxcblx0ZGVzdHJveTogZGVzdHJveSxcblxuXHRhZGRFdmVudExpc3RlbmVyczogYWRkRXZlbnRMaXN0ZW5lcnMsXG5cdHJlbW92ZUV2ZW50TGlzdGVuZXJzOiByZW1vdmVFdmVudExpc3RlbmVyc1xufTtcblxuY29uc3QgdXRpbCA9IHtcblx0ZXh0ZW5kOiBmdW5jdGlvbigpe1xuXHRcdGNvbnN0IG9iamVjdHMgPSBhcmd1bWVudHM7XG5cdFx0aWYob2JqZWN0cy5sZW5ndGggPCAyKXtcblx0XHRcdHJldHVybiBvYmplY3RzWzBdO1xuXHRcdH1cblx0XHRjb25zdCBjb21iaW5lZE9iamVjdCA9IG9iamVjdHNbMF07XG5cblx0XHRmb3IobGV0IGkgPSAxOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZighb2JqZWN0c1tpXSl7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGxldCBrZXkgaW4gb2JqZWN0c1tpXSl7XG5cdFx0XHRcdGNvbWJpbmVkT2JqZWN0W2tleV0gPSBvYmplY3RzW2ldW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbWJpbmVkT2JqZWN0O1xuXHR9XG59O1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZVNsaWRlSW4oZWwsIG9wdGlvbnMpe1xuXHRjb25zdCBzbGlkZUluID0gT2JqZWN0LmNyZWF0ZShEaXNtaXNzaWJsZVNsaWRlSW4pO1xuXHRzbGlkZUluLmluaXQoZWwsIG9wdGlvbnMpO1xuXHRyZXR1cm4gc2xpZGVJbjtcbn1cblxuZnVuY3Rpb24gaW5pdChlbCwgb3B0aW9ucyl7XG5cdGlmKCFlbCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRpc1JpZ2h0OiBmYWxzZSxcblx0XHRjbG9zZUJ1dHRvbkNsYXNzOiAnZHMtc2xpZGVpbl9fYWN0aW9uIGRzLXNsaWRlaW5fX2FjdGlvbi0tY2xvc2UnLFxuXHRcdGNsb3NlQnV0dG9uSHRtbDogJ3gnXG5cdH07XG5cblx0dGhpcy5vcHRpb25zID0gdXRpbC5leHRlbmQoe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cblx0dGhpcy5lbCA9IGVsO1xuXHRpZih0eXBlb2YgdGhpcy5lbCA9PT0gXCJzdHJpbmdcIil7XG5cdFx0dGhpcy5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5lbCk7XG5cdH1cblxuXHRpZighdGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2RzLXNsaWRlaW4nKSl7XG5cdFx0dGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdkcy1zbGlkZWluJyk7XG5cdH1cblxuXHR0aGlzLmlzUmlnaHQgPSB0aGlzLm9wdGlvbnMuaXNSaWdodDtcblx0aWYodGhpcy5pc1JpZ2h0KXtcblx0XHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2RzLXNsaWRlaW4tLXJpZ2h0Jyk7XG5cdH1cblxuXHR0aGlzLmNvbnRhaW5lciA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignLmRzLXNsaWRlaW5fX2NvbnRhaW5lcicpO1xuXHRpZighdGhpcy5jb250YWluZXIpe1xuXHRcdGJ1aWxkQ29udGFpbmVyLmNhbGwodGhpcyk7XG5cdH1cblxuXHR0aGlzLmhpZGVCdXR0b25FbCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignLmRzLXNsaWRlaW5fX2FjdGlvbi0tY2xvc2UnKTtcblx0aWYoIXRoaXMuaGlkZUJ1dHRvbkVsKXtcblx0XHRidWlsZEhpZGVCdXR0b24uY2FsbCh0aGlzKTtcblx0fVxuXG5cdHRoaXMuc2hvdyBcdFx0XHRcdD0gdGhpcy5zaG93LmJpbmQodGhpcyk7XG5cdHRoaXMuaGlkZSBcdFx0XHRcdD0gdGhpcy5oaWRlLmJpbmQodGhpcyk7XG5cdHRoaXMuYmxvY2tDbGlja3MgXHRcdD0gdGhpcy5ibG9ja0NsaWNrcy5iaW5kKHRoaXMpO1xuXHR0aGlzLm9uU3RhcnQgXHRcdFx0PSB0aGlzLm9uU3RhcnQuYmluZCh0aGlzKTtcblx0dGhpcy5vbk1vdmUgXHRcdFx0PSB0aGlzLm9uTW92ZS5iaW5kKHRoaXMpO1xuXHR0aGlzLm9uRW5kIFx0XHRcdFx0PSB0aGlzLm9uRW5kLmJpbmQodGhpcyk7XG5cdHRoaXMub25UcmFuc2l0aW9uRW5kIFx0PSB0aGlzLm9uVHJhbnNpdGlvbkVuZC5iaW5kKHRoaXMpO1xuXHR0aGlzLnVwZGF0ZSBcdFx0XHQ9IHRoaXMudXBkYXRlLmJpbmQodGhpcyk7XG5cdHRoaXMuZGVzdHJveSBcdFx0XHQ9IHRoaXMuZGVzdHJveS5iaW5kKHRoaXMpO1xuXG5cdHRoaXMuc3RhcnRYID0gMDtcblx0dGhpcy5jdXJyZW50WCA9IDA7XG5cdHRoaXMudG91Y2hpbmdOYXYgPSBmYWxzZTtcblxuXHR0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ29udGFpbmVyKCl7XG5cdGNvbnN0IHdyYXBDb250ZW50ID0gdGhpcy5lbC5maXJzdEVsZW1lbnRDaGlsZDtcblx0Y29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdGNvbnRhaW5lci5jbGFzc05hbWUgPSBcImRzLXNsaWRlaW5fX2NvbnRhaW5lclwiO1xuXHR3cmFwQ29udGVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjb250YWluZXIsIHdyYXBDb250ZW50KTtcblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKHdyYXBDb250ZW50KTtcblx0dGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkSGlkZUJ1dHRvbigpe1xuXHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblx0YnV0dG9uLmNsYXNzTmFtZSA9IHRoaXMub3B0aW9ucy5jbG9zZUJ1dHRvbkNsYXNzO1xuXHRidXR0b24uaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmNsb3NlQnV0dG9uSHRtbDtcblx0dGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJ1dHRvbiwgdGhpcy5jb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQpO1xuXHR0aGlzLmhpZGVCdXR0b25FbCA9IGJ1dHRvbjtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMoKXtcblx0dGhpcy5oaWRlQnV0dG9uRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUpO1xuXHR0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlKTtcblx0dGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJsb2NrQ2xpY2tzKTtcblxuXHR0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uU3RhcnQpO1xuXHR0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Nb3ZlKTtcblx0dGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25FbmQpO1xuXG5cdC8vIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vblN0YXJ0KTtcblx0Ly8gdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW92ZSk7XG5cdC8vIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25FbmQpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpe1xuXHR0aGlzLmhpZGVCdXR0b25FbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZSk7XG5cdHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUpO1xuXHR0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYmxvY2tDbGlja3MpO1xuXG5cdHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25TdGFydCk7XG5cdHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vbk1vdmUpO1xuXHR0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vbkVuZCk7XG5cblx0Ly8gdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uU3RhcnQpO1xuXHQvLyB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3ZlKTtcblx0Ly8gdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbkVuZCk7XG59XG5cbmZ1bmN0aW9uIG9uU3RhcnQoZXZ0KXtcblx0aWYoIXRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcy1zbGlkZWluLS12aXNpYmxlJykgfHwgdGhpcy5kZXN0cm95ZWQpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMuc3RhcnRYID1ldnQudG91Y2hlc1swXS5wYWdlWDtcblx0Ly90aGlzLnN0YXJ0WCA9IGV2dC5wYWdlWCB8fCBldnQudG91Y2hlc1swXS5wYWdlWDtcblx0dGhpcy5jdXJyZW50WCA9IHRoaXMuc3RhcnRYO1xuXG5cdHRoaXMudG91Y2hpbmdOYXYgPSB0cnVlO1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xufVxuXG5mdW5jdGlvbiBvbk1vdmUoZXZ0KXtcblx0aWYoIXRoaXMudG91Y2hpbmdOYXYpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMuY3VycmVudFggPWV2dC50b3VjaGVzWzBdLnBhZ2VYO1xuXHQvL3RoaXMuY3VycmVudFggPSBldnQucGFnZVggfHwgZXZ0LnRvdWNoZXNbMF0ucGFnZVg7XG5cdGxldCB0cmFuc2xhdGVYID0gdGhpcy5jdXJyZW50WCAtIHRoaXMuc3RhcnRYO1xuXHRpZihcblx0XHQodGhpcy5pc1JpZ2h0ICYmIE1hdGgubWF4KDAsIHRyYW5zbGF0ZVgpID4gMCkgfHxcblx0XHQoIXRoaXMuaXNSaWdodCAmJiBNYXRoLm1pbigwLHRyYW5zbGF0ZVgpIDwgMClcblx0KXtcblx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBvbkVuZCgpe1xuXHRpZighdGhpcy50b3VjaGluZ05hdil7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy50b3VjaGluZ05hdiA9IGZhbHNlO1xuXG5cdGxldCB0cmFuc2xhdGVYID0gdGhpcy5jdXJyZW50WCAtIHRoaXMuc3RhcnRYO1xuXHRpZihcblx0XHQodGhpcy5pc1JpZ2h0ICYmIE1hdGgubWF4KDAsIHRyYW5zbGF0ZVgpID4gMCkgfHxcblx0XHQoIXRoaXMuaXNSaWdodCAmJiBNYXRoLm1pbigwLCB0cmFuc2xhdGVYKSA8IDApXG5cdCl7XG5cdFx0dGhpcy5oaWRlKCk7XG5cdH1cblx0dGhpcy5jb250YWluZXIuc3R5bGUudHJhbnNmb3JtID0gJyc7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZSgpe1xuXHRpZighdGhpcy50b3VjaGluZ05hdil7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcblx0bGV0IHRyYW5zbGF0ZVggPSB0aGlzLmN1cnJlbnRYIC0gdGhpcy5zdGFydFg7XG5cdGlmKHRoaXMuaXNSaWdodCl7XG5cdFx0dHJhbnNsYXRlWCA9IE1hdGgubWF4KDAsIHRyYW5zbGF0ZVgpO1xuXHR9ZWxzZXtcblx0XHR0cmFuc2xhdGVYID0gTWF0aC5taW4oMCwgdHJhbnNsYXRlWCk7XG5cdH1cblxuXHR0aGlzLmNvbnRhaW5lci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RyYW5zbGF0ZVh9cHgpYDtcbn1cblxuZnVuY3Rpb24gZGVzdHJveSgpe1xuXHRpZih0aGlzLmlzUmlnaHQpe1xuXHRcdHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZHMtc2xpZGVpbi0tcmlnaHQnKTtcblx0fVxuXHR0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG5cdHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gYmxvY2tDbGlja3MoZXZ0KXtcblx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xufVxuXG5mdW5jdGlvbiBvblRyYW5zaXRpb25FbmQoKXtcblx0dGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdkcy1zbGlkZWluLS1hbmltYXRhYmxlJyk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNpdGlvbkVuZE5hbWUubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkVuZE5hbWVbaV0sIHRoaXMub25UcmFuc2l0aW9uRW5kKTtcblx0fVxuXG59XG5cbmZ1bmN0aW9uIHNob3coKXtcblx0aWYodGhpcy5kZXN0cm95ZWQpe1xuXHRcdHJldHVybjtcblx0fVxuXHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2RzLXNsaWRlaW4tLWFuaW1hdGFibGUnKTtcblx0dGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdkcy1zbGlkZWluLS12aXNpYmxlJyk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNpdGlvbkVuZE5hbWUubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkVuZE5hbWVbaV0sIHRoaXMub25UcmFuc2l0aW9uRW5kKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoaWRlKCl7XG5cdGlmKHRoaXMuZGVzdHJveWVkKXtcblx0XHRyZXR1cm47XG5cdH1cblx0dGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdkcy1zbGlkZWluLS1hbmltYXRhYmxlJyk7XG5cdHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZHMtc2xpZGVpbi0tdmlzaWJsZScpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zaXRpb25FbmROYW1lLmxlbmd0aDsgaSsrKSB7XG5cdFx0dGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKHRyYW5zaXRpb25FbmROYW1lW2ldLCB0aGlzLm9uVHJhbnNpdGlvbkVuZCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2xpZGVJbjtcbiIsImltcG9ydCBjcmVhdGVTbGlkZUluIGZyb20gJy4vZGlzbWlzc2libGUtc2xpZGVpbic7XG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgYW5pbWF0aW9uRW5kRXZlbnROYW1lID0gWydhbmltYXRpb25lbmQnXTsvLywgJ3dlYmtpdEFuaW1hdGlvbkVuZCcsICdNU0FuaW1hdGlvbkVuZCcsICdvQW5pbWF0aW9uRW5kJ107XG5cbmNvbnN0IHV0aWwgPSB7XG5cdG9uRW5kQW5pbWF0aW9uOiBmdW5jdGlvbihlbCwgY2FsbGJhY2spe1xuXHRcdGNvbnN0IG9uRW5kQ2FsbGJhY2tGbiA9IGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHRpZihldnQudGFyZ2V0ICE9PSB0aGlzKXtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhbmltYXRpb25FbmRFdmVudE5hbWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZEV2ZW50TmFtZVtpXSwgb25FbmRDYWxsYmFja0ZuKTtcblx0XHRcdH1cblx0XHRcdGlmKGNhbGxiYWNrICYmIHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwoKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYW5pbWF0aW9uRW5kRXZlbnROYW1lLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZEV2ZW50TmFtZVtpXSwgb25FbmRDYWxsYmFja0ZuKTtcblx0XHR9XG5cdH0sXG5cdGV4dGVuZDogZnVuY3Rpb24oKXtcblx0XHRjb25zdCBvYmplY3RzID0gYXJndW1lbnRzO1xuXHRcdGlmKG9iamVjdHMubGVuZ3RoIDwgMil7XG5cdFx0XHRyZXR1cm4gb2JqZWN0c1swXTtcblx0XHR9XG5cdFx0Y29uc3QgY29tYmluZWRPYmplY3QgPSBvYmplY3RzWzBdO1xuXG5cdFx0Zm9yKGxldCBpID0gMTsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0aWYoIW9iamVjdHNbaV0pe1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGZvcihsZXQga2V5IGluIG9iamVjdHNbaV0pe1xuXHRcdFx0XHRjb21iaW5lZE9iamVjdFtrZXldID0gb2JqZWN0c1tpXVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjb21iaW5lZE9iamVjdDtcblx0fVxufTtcblxuY29uc3QgTWxNZW51ID0ge1xuXHRpbml0OiBpbml0LFxuXG5cdGJhY2s6IGJhY2ssXG5cdGxpbmtDbGljazogbGlua0NsaWNrLFxuXG5cdG9wZW5TdWJNZW51OiBvcGVuU3ViTWVudSxcblx0bWVudU91dDogbWVudU91dCxcblx0bWVudUluOiBtZW51SW4sXG5cdGFkZEJyZWFkY3J1bWI6IGFkZEJyZWFkY3J1bWIsXG5cdGJyZWFkY3J1bWJDbGljazogYnJlYWRjcnVtYkNsaWNrLFxuXHRyZW5kZXJCcmVhZENydW1iczogcmVuZGVyQnJlYWRDcnVtYnMsXG5cblx0YWRkRXZlbnRMaXN0ZW5lcnM6IGFkZEV2ZW50TGlzdGVuZXJzLFxuXHRyZW1vdmVFdmVudExpc3RlbmVyczogcmVtb3ZlRXZlbnRMaXN0ZW5lcnNcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWxNZW51KGVsLCBvcHRpb25zKXtcblx0Y29uc3QgbWVudSA9IE9iamVjdC5jcmVhdGUoTWxNZW51KTtcblx0bWVudS5pbml0KGVsLCBvcHRpb25zKTtcblx0cmV0dXJuIG1lbnU7XG59XG5cbmZ1bmN0aW9uIGluaXQoZWwsIG9wdGlvbnMpe1xuXHRpZighZWwpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMubWVudUVsID0gZWw7XG5cdGlmKHR5cGVvZiB0aGlzLm1lbnVFbCA9PT0gXCJzdHJpbmdcIil7XG5cdFx0dGhpcy5tZW51RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMubWVudUVsKTtcblx0fVxuXG5cdGlmKCF0aGlzLm1lbnVFbCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRicmVhZGNydW1ic0N0cmw6IHRydWUsXG5cdFx0aW5pdGlhbEJyZWFkY3J1bWI6ICdhbGwnLFxuXHRcdGJyZWFkY3J1bWJNYXhMZW5ndGg6IDE1LFxuXHRcdGJyZWFkY3J1bWJTcGFjZXI6ICc8ZGl2IGNsYXNzPVwibWwtbWVudV9fYnJlYWRjcnVtYi1zcGFjZVwiPj48L2Rpdj4nLFxuXHRcdHN1Ym5hdkxpbmtIdG1sOiAnJyxcblx0XHRiYWNrQ3RybDogdHJ1ZSxcblx0XHRiYWNrQnV0dG9uSHRtbDogJzwnLFxuXHRcdGl0ZW1zRGVsYXlJbnRlcnZhbDogNjAsXG5cdFx0b25JdGVtQ2xpY2s6IG51bGwsXG5cdFx0c2lkZTogJ2xlZnQnLFxuXHRcdGlzUmlnaHQ6IGZhbHNlLFxuXHRcdGNsb25lOiBmYWxzZVxuXHR9O1xuXG5cdHRoaXMub3B0aW9ucyA9IHV0aWwuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG5cdGlmKHRoaXMub3B0aW9ucy5zaWRlID09ICdyaWdodCcpe1xuXHRcdHRoaXMub3B0aW9ucy5pc1JpZ2h0ID0gdHJ1ZTtcblx0fWVsc2V7XG5cdFx0dGhpcy5vcHRpb25zLmlzUmlnaHQgPSBmYWxzZTtcblx0fVxuXG5cdGNsb25lTmF2LmNhbGwodGhpcyk7XG5cblx0aWYoIXRoaXMubWVudUVsLmNsYXNzTGlzdC5jb250YWlucygnbWwtbWVudScpKXtcblx0XHR0aGlzLm1lbnVFbC5jbGFzc0xpc3QuYWRkKCdtbC1tZW51Jyk7XG5cdH1cblxuXHRpZih0eXBlb2YgY3JlYXRlU2xpZGVJbiAhPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0dGhpcy5zbGlkZUluQ29udHJvbGxlciA9IGNyZWF0ZVNsaWRlSW4odGhpcy5tZW51RWwsIHRoaXMub3B0aW9ucyk7XG5cdFx0dGhpcy5tZW51Q29udGFpbmVyID0gdGhpcy5zbGlkZUluQ29udHJvbGxlci5jb250YWluZXI7XG5cdH1lbHNle1xuXHRcdHRoaXMubWVudUNvbnRhaW5lciA9IHRoaXMubWVudUVsO1xuXHR9XG5cblx0Y29uc3Qgc3BhY2VXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdHNwYWNlV3JhcHBlci5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYlNwYWNlcjtcblx0dGhpcy5icmVhZGNydW1iU3BhY2VyID0gc3BhY2VXcmFwcGVyLmZpcnN0RWxlbWVudENoaWxkO1xuXG5cdHRoaXMuYnJlYWRjcnVtYnMgPSBbXTtcblx0dGhpcy5icmVhZGNydW1iU2libGluZ3NUb1JlbW92ZSA9IG51bGw7XG5cdHRoaXMuY3VycmVudCA9IDA7XG5cblx0dGhpcy5iYWNrIFx0XHRcdFx0PSB0aGlzLmJhY2suYmluZCh0aGlzKTtcblx0dGhpcy5saW5rQ2xpY2tcdFx0XHQ9IHRoaXMubGlua0NsaWNrLmJpbmQodGhpcyk7XG5cdHRoaXMuYnJlYWRjcnVtYkNsaWNrIFx0PSB0aGlzLmJyZWFkY3J1bWJDbGljay5iaW5kKHRoaXMpO1xuXHR0aGlzLnJlbmRlckJyZWFkQ3J1bWJzXHQ9IHRoaXMucmVuZGVyQnJlYWRDcnVtYnMuYmluZCh0aGlzKTtcblxuXHRidWlsZC5jYWxsKHRoaXMpO1xuXG5cdHRoaXMubWVudXNBcnJbdGhpcy5jdXJyZW50XS5tZW51RWwuY2xhc3NMaXN0LmFkZCgnbWwtbWVudV9fbGV2ZWwtLWN1cnJlbnQnKTtcblxuXHR0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG59XG5cbmZ1bmN0aW9uIGNsb25lTmF2KCl7XG5cdGlmKCF0aGlzLm9wdGlvbnMuY2xvbmUpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGNsb25lZE5vZGUgPSB0aGlzLm1lbnVFbC5jbG9uZU5vZGUodHJ1ZSk7XG5cdGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cdGJvZHkuaW5zZXJ0QmVmb3JlKGNsb25lZE5vZGUsIGJvZHkuZmlyc3RFbGVtZW50Q2hpbGQpO1xuXHRjbG9uZWROb2RlLmNsYXNzTmFtZSA9IFwiXCI7XG5cdHRoaXMubWVudUVsID0gY2xvbmVkTm9kZTtcbn1cblxuZnVuY3Rpb24gYnVpbGQoKXtcblx0ZnVuY3Rpb24gaW5pdCgpe1xuXHRcdHNvcnRNZW51cy5jYWxsKHRoaXMpO1xuXHRcdGZsYXR0ZW5BbmRXcmFwTWVudXMuY2FsbCh0aGlzKTtcblx0XHRjcmVhdGVIZWFkZXJXcmFwcGVyLmNhbGwodGhpcyk7XG5cdFx0Y3JlYXRlQnJlYWRDcnVtYnMuY2FsbCh0aGlzKTtcblx0XHRjcmVhdGVCYWNrQnV0dG9uLmNhbGwodGhpcyk7XG5cdFx0Y3JlYXRlU3ViTmF2TGlua3MuY2FsbCh0aGlzKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNvcnRNZW51cygpe1xuXHRcdGNvbnN0IHNldExpbmtEYXRhID0gZnVuY3Rpb24oZWxlbWVudCl7XG5cdFx0XHRjb25zdCBsaW5rcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsZW1lbnQucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcubWwtbWVudV9fbGV2ZWwgPiBsaSA+IGE6bm90KC5tbC1tZW51X19saW5rKScpKTtcblx0XHRcdGxldCBwb3MgPSAwO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaW5rcy5sZW5ndGg7IGkrKywgcG9zKyspIHtcblx0XHRcdFx0aWYobGlua3NbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtbC1tZW51X19saW5rJykpe1xuXHRcdFx0XHRcdHBvcy0tO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpbmtzW2ldLmNsYXNzTGlzdC5hZGQoJ21sLW1lbnVfX2xpbmsnKTtcblx0XHRcdFx0bGlua3NbaV0uc2V0QXR0cmlidXRlKCdkYXRhLXBvcycsIHBvcyArIDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGxpbmtzO1xuXHRcdH07XG5cblx0XHRsZXQgc2V0TWVudXMgPSBmdW5jdGlvbihtZW51LCBwYXJlbnRQb3NpdGlvbk5hbWUpe1xuXHRcdFx0bWVudS5jbGFzc05hbWUgPSBcIm1sLW1lbnVfX2xldmVsXCI7XG5cdFx0XHRjb25zdCBsaW5rU2libGluZyA9IG1lbnUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wb3NdJyk7XG5cdFx0XHRsZXQgY3VycmVudFBvc2l0aW9uID0gbGlua1NpYmxpbmcuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcycpO1xuXG5cdFx0XHRsZXQgbWVudU5hbWUgPSBcIlwiO1xuXHRcdFx0aWYocGFyZW50UG9zaXRpb25OYW1lKXtcblx0XHRcdFx0bWVudU5hbWUgPSBwYXJlbnRQb3NpdGlvbk5hbWUgKyAnLSc7XG5cdFx0XHR9XG5cdFx0XHRtZW51TmFtZSArPSBjdXJyZW50UG9zaXRpb247XG5cblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCdkYXRhLW1lbnUnLCBcIm1lbnUtXCIrbWVudU5hbWUpO1xuXHRcdFx0bGlua1NpYmxpbmcuc2V0QXR0cmlidXRlKCdkYXRhLXN1Ym1lbnUnLCBcIm1lbnUtXCIrbWVudU5hbWUpO1xuXHRcdFx0Y29uc3QgbWVudUl0ZW1zID0gc2V0TGlua0RhdGEobWVudSk7XG5cblx0XHRcdHRoaXMubWVudXMucHVzaChtZW51KTtcblx0XHRcdHRoaXMubWVudXNBcnIucHVzaCh7XG5cdFx0XHRcdG1lbnVFbDogbWVudSxcblx0XHRcdFx0bWVudUl0ZW1zOiBtZW51SXRlbXNcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zdCBzdWJNZW51cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1lbnUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcubWwtbWVudV9fbGV2ZWwgPiBsaSA+IHVsOm5vdCgubWwtbWVudV9fbGV2ZWwpJykpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdWJNZW51cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZihzdWJNZW51c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ21sLW1lbnVfX2xldmVsJykpe1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNldE1lbnVzKHN1Yk1lbnVzW2ldLCBtZW51TmFtZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRzZXRNZW51cyA9IHNldE1lbnVzLmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLm1lbnVzID0gW107XG5cdFx0dGhpcy5tZW51c0FyciA9IFtdO1xuXG5cdFx0Y29uc3QgbWFpbk1lbnUgPSB0aGlzLm1lbnVFbC5xdWVyeVNlbGVjdG9yKCd1bCcpO1xuXHRcdG1haW5NZW51LnNldEF0dHJpYnV0ZSgnZGF0YS1tZW51JywgJ21haW4nKTtcblx0XHRtYWluTWVudS5jbGFzc05hbWUgPSBcIm1sLW1lbnVfX2xldmVsIG1sLW1lbnVfX2xldmVsLS1jdXJyZW50XCI7XG5cdFx0Y29uc3QgbWFpbk1lbnVJdGVtcyA9IHNldExpbmtEYXRhKG1haW5NZW51KTtcblxuXHRcdHRoaXMubWVudXMucHVzaChtYWluTWVudSk7XG5cdFx0dGhpcy5tZW51c0Fyci5wdXNoKHtcblx0XHRcdG1lbnVFbDogbWFpbk1lbnUsXG5cdFx0XHRtZW51SXRlbXM6IG1haW5NZW51SXRlbXNcblx0XHR9KTtcblxuXHRcdGNvbnN0IHN1Yk1lbnVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWFpbk1lbnUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcubWwtbWVudV9fbGV2ZWwgPiBsaSA+IHVsJykpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3ViTWVudXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNldE1lbnVzKHN1Yk1lbnVzW2ldKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBmbGF0dGVuQW5kV3JhcE1lbnVzKCl7XG5cdFx0Y29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHdyYXBwZXIuY2xhc3NOYW1lID0gJ21sLW1lbnVfX3dyYXAnO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tZW51c0Fyci5sZW5ndGg7IGkrKykge1xuXHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLm1lbnVzQXJyW2ldLm1lbnVFbCk7XG5cdFx0fVxuXHRcdHRoaXMubWVudVdyYXBwZXIgPSB3cmFwcGVyO1xuXHRcdHRoaXMubWVudUNvbnRhaW5lci5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUhlYWRlcldyYXBwZXIoKXtcblx0XHRjb25zdCBoZWFkZXJXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0aGVhZGVyV3JhcHBlci5jbGFzc05hbWUgPSBcIm1sLW1lbnVfX2hlYWRlclwiO1xuXHRcdHRoaXMubWVudUNvbnRhaW5lci5pbnNlcnRCZWZvcmUoaGVhZGVyV3JhcHBlciwgdGhpcy5tZW51V3JhcHBlcik7XG5cdFx0dGhpcy5oZWFkZXJXcmFwcGVyID0gaGVhZGVyV3JhcHBlcjtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUJyZWFkQ3J1bWJzKCl7XG5cdFx0aWYodGhpcy5vcHRpb25zLmJyZWFkY3J1bWJzQ3RybCl7XG5cdFx0XHR0aGlzLmJyZWFkY3J1bWJzQ3RybCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ25hdicpO1xuXHRcdFx0dGhpcy5icmVhZGNydW1ic0N0cmwuY2xhc3NOYW1lID0gJ21sLW1lbnVfX2JyZWFkY3J1bWJzJztcblx0XHRcdHRoaXMuaGVhZGVyV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJyZWFkY3J1bWJzQ3RybCk7XG5cdFx0XHQvLyBhZGQgaW5pdGlhbCBicmVhZGNydW1iXG5cdFx0XHR0aGlzLmFkZEJyZWFkY3J1bWIoMCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlQmFja0J1dHRvbigpe1xuXHRcdGlmKHRoaXMub3B0aW9ucy5iYWNrQ3RybCl7XG5cdFx0XHR0aGlzLmJhY2tDdHJsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0XHR0aGlzLmJhY2tDdHJsLmNsYXNzTmFtZSA9ICdtbC1tZW51X19hY3Rpb24gbWwtbWVudV9fYWN0aW9uLS1iYWNrIG1sLW1lbnVfX2FjdGlvbi0taGlkZSc7XG5cdFx0XHR0aGlzLmJhY2tDdHJsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdHbyBiYWNrJyk7XG5cdFx0XHR0aGlzLmJhY2tDdHJsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5iYWNrQnV0dG9uSHRtbDtcblx0XHRcdHRoaXMuaGVhZGVyV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJhY2tDdHJsKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVTdWJOYXZMaW5rcygpe1xuXHRcdGNvbnN0IHN1Yk5hdkxpbmtzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5tZW51Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXN1Ym1lbnVdJykpO1xuXHRcdHN1Yk5hdkxpbmtzLmZvckVhY2goZnVuY3Rpb24obGluayl7XG5cdFx0XHRjb25zdCBzdWJOYXZMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdFx0c3ViTmF2TGluay5jbGFzc05hbWUgPSAnbWwtbWVudV9fbGluay0tc3VibmF2Jztcblx0XHRcdHN1Yk5hdkxpbmsuaHJlZiA9ICcjJztcblx0XHRcdGlmKHRoaXMub3B0aW9ucy5zdWJuYXZMaW5rSHRtbCl7XG5cdFx0XHRcdHN1Yk5hdkxpbmsuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLnN1Ym5hdkxpbmtIdG1sO1xuXHRcdFx0fVxuXHRcdFx0bGluay5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHN1Yk5hdkxpbmspO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdH1cblxuXHRpbml0LmNhbGwodGhpcyk7XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKCl7XG5cdHRoaXMubWVudUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubGlua0NsaWNrKTtcblxuXHRpZih0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYnNDdHJsKXtcblx0XHR0aGlzLmJyZWFkY3J1bWJzQ3RybC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnJlYWRjcnVtYkNsaWNrKTtcblx0fVxuXG5cdGlmKHRoaXMub3B0aW9ucy5iYWNrQ3RybCl7XG5cdFx0dGhpcy5iYWNrQ3RybC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYmFjayk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKXtcblx0dGhpcy5tZW51Q29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5saW5rQ2xpY2spO1xuXG5cdGlmKHRoaXMub3B0aW9ucy5icmVhZGNydW1ic0N0cmwpe1xuXHRcdHRoaXMuYnJlYWRjcnVtYnNDdHJsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5icmVhZGNydW1iQ2xpY2spO1xuXHR9XG5cblx0aWYodGhpcy5vcHRpb25zLmJhY2tDdHJsKXtcblx0XHR0aGlzLmJhY2tDdHJsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5iYWNrKTtcblx0fVxufVxuXG5mdW5jdGlvbiBsaW5rQ2xpY2soZXZ0KXtcblx0aWYoXG5cdFx0IWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtbC1tZW51X19saW5rJykgJiZcblx0XHQhZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21sLW1lbnVfX2xpbmstLXN1Ym5hdicpXG5cdCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3Qgc3VibWVudVRhcmdldCA9IGV2dC50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZyxcblx0XHRzdWJtZW51ID0gc3VibWVudVRhcmdldCA/IHN1Ym1lbnVUYXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXN1Ym1lbnUnKSA6ICcnLFxuXHRcdGl0ZW1OYW1lID0gc3VibWVudVRhcmdldCA/IHN1Ym1lbnVUYXJnZXQuaW5uZXJIVE1MIDogZXZ0LnRhcmdldC5pbm5lckhUTUwsXG5cdFx0cG9zID0gc3VibWVudVRhcmdldCA/IHN1Ym1lbnVUYXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcycpIDogZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9zJyksXG5cdFx0c3ViTWVudUVsID0gdGhpcy5tZW51RWwucXVlcnlTZWxlY3RvcigndWxbZGF0YS1tZW51PVwiJyArIHN1Ym1lbnUgKyAnXCJdJyk7XG5cblx0aWYoc3VibWVudSAmJiBzdWJNZW51RWwpe1xuXHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dGhpcy5vcGVuU3ViTWVudShzdWJNZW51RWwsIHBvcywgaXRlbU5hbWUpO1xuXHR9ZWxzZXtcblx0XHRjb25zdCBjdXJyZW50TGluayA9IHRoaXMubWVudUVsLnF1ZXJ5U2VsZWN0b3IoJy5tbC1tZW51X19saW5rLS1jdXJyZW50Jyk7XG5cdFx0aWYoY3VycmVudExpbmspe1xuXHRcdFx0Y3VycmVudExpbmsuY2xhc3NMaXN0LnJlbW92ZSgnbWwtbWVudV9fbGluay0tY3VycmVudCcpO1xuXHRcdH1cblxuXHRcdGV2dC50YXJnZXQuY2xhc3NMaXN0LmFkZCgnbWwtbWVudV9fbGluay0tY3VycmVudCcpO1xuXG5cdFx0aWYodGhpcy5vcHRpb25zLm9uSXRlbUNsaWNrKXtcblx0XHRcdHRoaXMub3B0aW9ucy5vbkl0ZW1DbGljayhldnQsIGl0ZW1OYW1lKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYmFjaygpe1xuXHRpZih0aGlzLmlzQmFja0FuaW1hdGluZyl7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHRoaXMuaXNCYWNrQW5pbWF0aW5nID0gdHJ1ZTtcblx0Ly8gY3VycmVudCBtZW51IHNsaWRlcyBvdXRcblx0dGhpcy5tZW51T3V0KCk7XG5cdC8vIG5leHQgbWVudSAocHJldmlvdXMgbWVudSkgc2xpZGVzIGluXG5cdGNvbnN0IGJhY2tNZW51ID0gdGhpcy5tZW51c0Fyclt0aGlzLm1lbnVzQXJyW3RoaXMuY3VycmVudF0uYmFja0lkeF0ubWVudUVsO1xuXHR0aGlzLm1lbnVJbihiYWNrTWVudSk7XG5cblx0Ly8gcmVtb3ZlIGxhc3QgYnJlYWRjcnVtYlxuXHRpZih0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYnNDdHJsKXtcblx0XHR0aGlzLmJyZWFkY3J1bWJzLnBvcCgpO1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlckJyZWFkQ3J1bWJzKTtcblx0fVxufVxuXG5mdW5jdGlvbiBvcGVuU3ViTWVudShzdWJNZW51RWwsIGNsaWNrUG9zaXRpb24sIHN1Yk1lbnVOYW1lKXtcblx0aWYodGhpcy5pc0FuaW1hdGluZyl7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHRoaXMuaXNBbmltYXRpbmcgPSB0cnVlO1xuXG5cdC8vIHNhdmUgXCJwYXJlbnRcIiBtZW51IGluZGV4IGZvciBiYWNrIG5hdmlnYXRpb25cblx0dGhpcy5tZW51c0Fyclt0aGlzLm1lbnVzLmluZGV4T2Yoc3ViTWVudUVsKV0uYmFja0lkeCA9IHRoaXMuY3VycmVudDtcblx0Ly8gc2F2ZSBcInBhcmVudFwiIG1lbnXCtHMgbmFtZVxuXHR0aGlzLm1lbnVzQXJyW3RoaXMubWVudXMuaW5kZXhPZihzdWJNZW51RWwpXS5uYW1lID0gc3ViTWVudU5hbWU7XG5cdC8vIGN1cnJlbnQgbWVudSBzbGlkZXMgb3V0XG5cdHRoaXMubWVudU91dChjbGlja1Bvc2l0aW9uKTtcblx0Ly8gbmV4dCBtZW51IChzdWJtZW51KSBzbGlkZXMgaW5cblx0dGhpcy5tZW51SW4oc3ViTWVudUVsLCBjbGlja1Bvc2l0aW9uKTtcbn1cblxuZnVuY3Rpb24gYnJlYWRjcnVtYkNsaWNrKGV2dCl7XG5cdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdGNvbnN0IGJyZWFkY3J1bWIgPSBldnQudGFyZ2V0O1xuXHRjb25zdCBpbmRleCA9IGJyZWFkY3J1bWIuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4Jyk7XG5cdGlmKCFpbmRleCl7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdC8vIGRvIG5vdGhpbmcgaWYgdGhpcyBicmVhZGNydW1iIGlzIHRoZSBsYXN0IG9uZSBpbiB0aGUgbGlzdCBvZiBicmVhZGNydW1ic1xuXHRpZighYnJlYWRjcnVtYi5uZXh0U2libGluZyB8fCB0aGlzLmlzQW5pbWF0aW5nKXtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dGhpcy5pc0FuaW1hdGluZyA9IHRydWU7XG5cblx0Ly8gY3VycmVudCBtZW51IHNsaWRlcyBvdXRcblx0dGhpcy5tZW51T3V0KCk7XG5cdC8vIG5leHQgbWVudSBzbGlkZXMgaW5cblx0Y29uc3QgbmV4dE1lbnUgPSB0aGlzLm1lbnVzQXJyW2luZGV4XS5tZW51RWw7XG5cdHRoaXMubWVudUluKG5leHRNZW51KTtcblxuXHQvLyByZW1vdmUgYnJlYWRjcnVtYnMgdGhhdCBhcmUgYWhlYWRcblx0Y29uc3QgaW5kZXhPZlNpYmxpbmdOb2RlID0gdGhpcy5icmVhZGNydW1icy5pbmRleE9mKGJyZWFkY3J1bWIpICsgMTtcblx0aWYofmluZGV4T2ZTaWJsaW5nTm9kZSl7XG5cdFx0dGhpcy5icmVhZGNydW1icyA9IHRoaXMuYnJlYWRjcnVtYnMuc2xpY2UoMCwgaW5kZXhPZlNpYmxpbmdOb2RlKTtcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXJCcmVhZENydW1icyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gbWVudU91dChjbGlja1Bvc2l0aW9uKXtcblx0Y29uc3QgY3VycmVudE1lbnUgPSB0aGlzLm1lbnVzQXJyW3RoaXMuY3VycmVudF0ubWVudUVsLFxuXHRcdGlzQmFja05hdmlnYXRpb24gPSB0eXBlb2YgY2xpY2tQb3NpdGlvbiA9PT0gXCJ1bmRlZmluZWRcIiA/IHRydWUgOiBmYWxzZSxcblx0XHRtZW51SXRlbXMgPSB0aGlzLm1lbnVzQXJyW3RoaXMuY3VycmVudF0ubWVudUl0ZW1zLFxuXHRcdG1lbnVJdGVtc1RvdGFsID0gbWVudUl0ZW1zLmxlbmd0aCxcblx0XHRmYXJ0aGVzdElkeCA9IGNsaWNrUG9zaXRpb24gPD0gbWVudUl0ZW1zVG90YWwvMiB8fCBpc0JhY2tOYXZpZ2F0aW9uID8gbWVudUl0ZW1zVG90YWwgLSAxIDogMDtcblxuXHRtZW51SXRlbXMuZm9yRWFjaChmdW5jdGlvbihsaW5rLCBwb3MpIHtcblx0XHRsZXQgaXRlbVBvcyA9IGxpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcycpO1xuXHRcdGxldCBpdGVtID0gbGluay5wYXJlbnROb2RlO1xuXHRcdGl0ZW0uc3R5bGUuV2Via2l0QW5pbWF0aW9uRGVsYXkgPSBpdGVtLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gaXNCYWNrTmF2aWdhdGlvbiA/IHBhcnNlSW50KGl0ZW1Qb3MgKiB0aGlzLm9wdGlvbnMuaXRlbXNEZWxheUludGVydmFsKSArICdtcycgOiBwYXJzZUludChNYXRoLmFicyhjbGlja1Bvc2l0aW9uIC0gaXRlbVBvcykgKiB0aGlzLm9wdGlvbnMuaXRlbXNEZWxheUludGVydmFsKSArICdtcyc7XG5cdH0uYmluZCh0aGlzKSk7XG5cblx0dXRpbC5vbkVuZEFuaW1hdGlvbihtZW51SXRlbXNbZmFydGhlc3RJZHhdLnBhcmVudE5vZGUsIGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5pc0JhY2tBbmltYXRpbmcgPSBmYWxzZTtcblx0fS5iaW5kKHRoaXMpKTtcblxuXHRjdXJyZW50TWVudS5jbGFzc0xpc3QuYWRkKCEoIWlzQmFja05hdmlnYXRpb24gXiAhdGhpcy5vcHRpb25zLmlzUmlnaHQpID8gJ2FuaW1hdGUtb3V0VG9SaWdodCcgOiAnYW5pbWF0ZS1vdXRUb0xlZnQnKTtcbn1cblxuZnVuY3Rpb24gbWVudUluKG5leHRNZW51RWwsIGNsaWNrUG9zaXRpb24pe1xuXHQvLyB0aGUgY3VycmVudCBtZW51XG5cdGNvbnN0IGN1cnJlbnRNZW51ID0gdGhpcy5tZW51c0Fyclt0aGlzLmN1cnJlbnRdLm1lbnVFbCxcblx0XHRpc0JhY2tOYXZpZ2F0aW9uID0gdHlwZW9mIGNsaWNrUG9zaXRpb24gPT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IGZhbHNlLFxuXHRcdC8vIGluZGV4IG9mIHRoZSBuZXh0TWVudUVsXG5cdFx0bmV4dE1lbnVJZHggPSB0aGlzLm1lbnVzLmluZGV4T2YobmV4dE1lbnVFbCksXG5cblx0XHRuZXh0TWVudUl0ZW1zID0gdGhpcy5tZW51c0FycltuZXh0TWVudUlkeF0ubWVudUl0ZW1zLFxuXHRcdG5leHRNZW51SXRlbXNUb3RhbCA9IG5leHRNZW51SXRlbXMubGVuZ3RoLFxuXG5cdFx0Ly8gd2UgbmVlZCB0byByZXNldCB0aGUgY2xhc3NlcyBvbmNlIHRoZSBsYXN0IGl0ZW0gYW5pbWF0ZXMgaW5cblx0XHQvLyB0aGUgXCJsYXN0IGl0ZW1cIiBpcyB0aGUgZmFydGhlc3QgZnJvbSB0aGUgY2xpY2tlZCBpdGVtXG5cdFx0Ly8gbGV0J3MgY2FsY3VsYXRlIHRoZSBpbmRleCBvZiB0aGUgZmFydGhlc3QgaXRlbVxuXHRcdGZhcnRoZXN0SWR4ID0gY2xpY2tQb3NpdGlvbiA8PSBuZXh0TWVudUl0ZW1zVG90YWwvMiB8fCBpc0JhY2tOYXZpZ2F0aW9uID8gbmV4dE1lbnVJdGVtc1RvdGFsIC0gMSA6IDA7XG5cblx0Ly8gc2xpZGUgaW4gbmV4dCBtZW51IGl0ZW1zIC0gZmlyc3QsIHNldCB0aGUgZGVsYXlzIGZvciB0aGUgaXRlbXNcblx0bmV4dE1lbnVJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmssIHBvcykge1xuXHRcdGxldCBpdGVtUG9zID0gbGluay5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9zJyk7XG5cdFx0bGV0IGl0ZW0gPSBsaW5rLnBhcmVudE5vZGU7XG5cdFx0aXRlbS5zdHlsZS5XZWJraXRBbmltYXRpb25EZWxheSA9IGl0ZW0uc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBpc0JhY2tOYXZpZ2F0aW9uID8gcGFyc2VJbnQoaXRlbVBvcyAqIHRoaXMub3B0aW9ucy5pdGVtc0RlbGF5SW50ZXJ2YWwpICsgJ21zJyA6IHBhcnNlSW50KE1hdGguYWJzKGNsaWNrUG9zaXRpb24gLSBpdGVtUG9zKSAqIHRoaXMub3B0aW9ucy5pdGVtc0RlbGF5SW50ZXJ2YWwpICsgJ21zJztcblx0fS5iaW5kKHRoaXMpKTtcblxuXHR1dGlsLm9uRW5kQW5pbWF0aW9uKG5leHRNZW51SXRlbXNbZmFydGhlc3RJZHhdLnBhcmVudE5vZGUsIGZ1bmN0aW9uKCl7XG5cdFx0Y3VycmVudE1lbnUuY2xhc3NMaXN0LnJlbW92ZSghKCFpc0JhY2tOYXZpZ2F0aW9uIF4gIXRoaXMub3B0aW9ucy5pc1JpZ2h0KSA/ICdhbmltYXRlLW91dFRvUmlnaHQnIDogJ2FuaW1hdGUtb3V0VG9MZWZ0Jyk7XG5cdFx0Y3VycmVudE1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnbWwtbWVudV9fbGV2ZWwtLWN1cnJlbnQnKTtcblx0XHRuZXh0TWVudUVsLmNsYXNzTGlzdC5yZW1vdmUoISghaXNCYWNrTmF2aWdhdGlvbiBeICF0aGlzLm9wdGlvbnMuaXNSaWdodCkgPyAnYW5pbWF0ZS1pbkZyb21MZWZ0JyA6ICdhbmltYXRlLWluRnJvbVJpZ2h0Jyk7XG5cdFx0bmV4dE1lbnVFbC5jbGFzc0xpc3QuYWRkKCdtbC1tZW51X19sZXZlbC0tY3VycmVudCcpO1xuXG5cdFx0Ly9yZXNldCBjdXJyZW50XG5cdFx0dGhpcy5jdXJyZW50ID0gbmV4dE1lbnVJZHg7XG5cblx0XHQvLyBjb250cm9sIGJhY2sgYnV0dG9uIGFuZCBicmVhZGNydW1icyBuYXZpZ2F0aW9uIGVsZW1lbnRzXG5cdFx0aWYoIWlzQmFja05hdmlnYXRpb24pe1xuXHRcdFx0Ly8gc2hvdyBiYWNrIGJ1dHRvblxuXHRcdFx0aWYodGhpcy5vcHRpb25zLmJhY2tDdHJsKXtcblx0XHRcdFx0dGhpcy5iYWNrQ3RybC5jbGFzc0xpc3QucmVtb3ZlKCdtbC1tZW51X19hY3Rpb24tLWhpZGUnKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYWRkIGJyZWFkY3J1bWJcblx0XHRcdHRoaXMuYWRkQnJlYWRjcnVtYihuZXh0TWVudUlkeCk7XG5cdFx0fWVsc2UgaWYodGhpcy5jdXJyZW50ID09PSAwICYmIHRoaXMub3B0aW9ucy5iYWNrQ3RybCl7XG5cdFx0XHQvLyBoaWRlIGJhY2sgYnV0dG9uXG5cdFx0XHR0aGlzLmJhY2tDdHJsLmNsYXNzTGlzdC5hZGQoJ21sLW1lbnVfX2FjdGlvbi0taGlkZScpO1xuXHRcdH1cblxuXHRcdC8vIHdlIGNhbiBuYXZpZ2F0ZSBhZ2Fpbi4uXG5cdFx0dGhpcy5pc0FuaW1hdGluZyA9IGZhbHNlO1xuXHR9LmJpbmQodGhpcykpO1xuXG5cdC8vIGFuaW1hdGlvbiBjbGFzc1xuXHRuZXh0TWVudUVsLmNsYXNzTGlzdC5hZGQoISghaXNCYWNrTmF2aWdhdGlvbiBeICF0aGlzLm9wdGlvbnMuaXNSaWdodCkgPyAnYW5pbWF0ZS1pbkZyb21MZWZ0JyA6ICdhbmltYXRlLWluRnJvbVJpZ2h0Jylcbn1cblxuZnVuY3Rpb24gYWRkQnJlYWRjcnVtYihpbmRleCl7XG5cdGlmKCF0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYnNDdHJsKXtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRjb25zdCBiYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0bGV0IGJyZWFkY3J1bWJOYW1lID0gaW5kZXggPyB0aGlzLm1lbnVzQXJyW2luZGV4XS5uYW1lIDogdGhpcy5vcHRpb25zLmluaXRpYWxCcmVhZGNydW1iO1xuXHRpZihicmVhZGNydW1iTmFtZS5sZW5ndGggPiB0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYk1heExlbmd0aCl7XG5cdFx0YnJlYWRjcnVtYk5hbWUgPSBicmVhZGNydW1iTmFtZS5zdWJzdHJpbmcoMCwgdGhpcy5vcHRpb25zLmJyZWFkY3J1bWJNYXhMZW5ndGgpLnRyaW0oKSsnLi4uJztcblx0fVxuXHRiYy5pbm5lckhUTUwgPSBicmVhZGNydW1iTmFtZTtcblx0YmMuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgaW5kZXgpO1xuXG5cdHRoaXMuYnJlYWRjcnVtYnMucHVzaChiYyk7XG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlckJyZWFkQ3J1bWJzKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQnJlYWRDcnVtYnMoKXtcblx0dGhpcy5icmVhZGNydW1ic0N0cmwuaW5uZXJIVE1MID0gXCJcIjtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJyZWFkY3J1bWJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dGhpcy5icmVhZGNydW1ic0N0cmwuYXBwZW5kQ2hpbGQodGhpcy5icmVhZGNydW1ic1tpXSk7XG5cdFx0aWYoaSA8IHRoaXMuYnJlYWRjcnVtYnMubGVuZ3RoIC0gMSl7XG5cdFx0XHR0aGlzLmJyZWFkY3J1bWJzQ3RybC5hcHBlbmRDaGlsZCh0aGlzLmJyZWFkY3J1bWJTcGFjZXIuY2xvbmVOb2RlKHRydWUpKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTWxNZW51O1xuIiwiaW1wb3J0IHByb21pc2VQb2x5IGZyb20gXCIuLi8uLi92ZW5kb3IvZXM2LXByb21pc2VcIjtcclxuaW1wb3J0IGZldGNoUG9seSBmcm9tIFwiLi4vLi4vdmVuZG9yL2ZldGNoXCI7XHJcblxyXG5wcm9taXNlUG9seS5wb2x5ZmlsbCgpOyIsIi8qIVxyXG4gKiBAb3ZlcnZpZXcgZXM2LXByb21pc2UgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXHJcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzIChDb252ZXJzaW9uIHRvIEVTNiBBUEkgYnkgSmFrZSBBcmNoaWJhbGQpXHJcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcclxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2pha2VhcmNoaWJhbGQvZXM2LXByb21pc2UvbWFzdGVyL0xJQ0VOU0VcclxuICogQHZlcnNpb24gICAzLjIuMiszOWFhMjU3MVxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHV0aWxzJCRvYmplY3RPckZ1bmN0aW9uKHgpIHtcclxuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8ICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc0Z1bmN0aW9uKHgpIHtcclxuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNNYXliZVRoZW5hYmxlKHgpIHtcclxuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkdXRpbHMkJF9pc0FycmF5O1xyXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KSB7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkdXRpbHMkJF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc0FycmF5ID0gbGliJGVzNiRwcm9taXNlJHV0aWxzJCRfaXNBcnJheTtcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuID0gMDtcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkdmVydHhOZXh0O1xyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbjtcclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2xpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW5dID0gY2FsbGJhY2s7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuICsgMV0gPSBhcmc7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW4gKz0gMjtcclxuICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW4gPT09IDIpIHtcclxuICAgICAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXHJcbiAgICAgICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcclxuICAgICAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXHJcbiAgICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbikge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGN1c3RvbVNjaGVkdWxlckZuKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHNldFNjaGVkdWxlcihzY2hlZHVsZUZuKSB7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbiA9IHNjaGVkdWxlRm47XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHNldEFzYXAoYXNhcEZuKSB7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwID0gYXNhcEZuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3NlcldpbmRvdyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJHbG9iYWwgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3NlcldpbmRvdyB8fCB7fTtcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGlzTm9kZSA9IHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xyXG5cclxuICAgIC8vIHRlc3QgZm9yIHdlYiB3b3JrZXIgYnV0IG5vdCBpbiBJRTEwXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgdHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJztcclxuXHJcbiAgICAvLyBub2RlXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTmV4dFRpY2soKSB7XHJcbiAgICAgIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxyXG4gICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1am9qcy93aGVuL2lzc3Vlcy80MTAgZm9yIGRldGFpbHNcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2sobGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB2ZXJ0eFxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVZlcnR4VGltZXIoKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkdmVydHhOZXh0KGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XHJcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcclxuICAgICAgdmFyIG9ic2VydmVyID0gbmV3IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlcihsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xyXG4gICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcclxuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XHJcblxyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB3ZWIgd29ya2VyXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTWVzc2FnZUNoYW5uZWwoKSB7XHJcbiAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XHJcbiAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoO1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVNldFRpbWVvdXQoKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCwgMSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCgpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuOyBpKz0yKSB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2ldO1xyXG4gICAgICAgIHZhciBhcmcgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbaSsxXTtcclxuXHJcbiAgICAgICAgY2FsbGJhY2soYXJnKTtcclxuXHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtpKzFdID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXR0ZW1wdFZlcnR4KCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHZhciByID0gcmVxdWlyZTtcclxuICAgICAgICB2YXIgdmVydHggPSByKCd2ZXJ0eCcpO1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR2ZXJ0eE5leHQgPSB2ZXJ0eC5ydW5Pbkxvb3AgfHwgdmVydHgucnVuT25Db250ZXh0O1xyXG4gICAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlVmVydHhUaW1lcigpO1xyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaDtcclxuICAgIC8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XHJcbiAgICBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGlzTm9kZSkge1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VOZXh0VGljaygpO1xyXG4gICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpO1xyXG4gICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkaXNXb3JrZXIpIHtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTWVzc2FnZUNoYW5uZWwoKTtcclxuICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhdHRlbXB0VmVydHgoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSR0aGVuJCR0aGVuKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XHJcbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzO1xyXG5cclxuICAgICAgdmFyIGNoaWxkID0gbmV3IHRoaXMuY29uc3RydWN0b3IobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCk7XHJcblxyXG4gICAgICBpZiAoY2hpbGRbbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUFJPTUlTRV9JRF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG1ha2VQcm9taXNlKGNoaWxkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHN0YXRlID0gcGFyZW50Ll9zdGF0ZTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZSkge1xyXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1tzdGF0ZSAtIDFdO1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCBwYXJlbnQuX3Jlc3VsdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgfVxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSR0aGVuJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHRoZW4kJHRoZW47XHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlKG9iamVjdCkge1xyXG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xyXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QuY29uc3RydWN0b3IgPT09IENvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCk7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcclxuICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJHJlc29sdmU7XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUFJPTUlTRV9JRCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygxNik7XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCgpIHt9XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcgICA9IHZvaWQgMDtcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRUQgPSAxO1xyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEICA9IDI7XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SID0gbmV3IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCk7XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc2VsZkZ1bGZpbGxtZW50KCkge1xyXG4gICAgICByZXR1cm4gbmV3IFR5cGVFcnJvcihcIllvdSBjYW5ub3QgcmVzb2x2ZSBhIHByb21pc2Ugd2l0aCBpdHNlbGZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkY2Fubm90UmV0dXJuT3duKCkge1xyXG4gICAgICByZXR1cm4gbmV3IFR5cGVFcnJvcignQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGdldFRoZW4ocHJvbWlzZSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW47XHJcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xyXG4gICAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcikge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcclxuICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGZ1bmN0aW9uKHByb21pc2UpIHtcclxuICAgICAgICB2YXIgc2VhbGVkID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIGVycm9yID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB0aGVuYWJsZSwgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xyXG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cclxuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XHJcbiAgICAgICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcclxuXHJcbiAgICAgICAgaWYgKCFzZWFsZWQgJiYgZXJyb3IpIHtcclxuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgcHJvbWlzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUpIHtcclxuICAgICAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcclxuICAgICAgfSBlbHNlIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZSh0aGVuYWJsZSwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbikge1xyXG4gICAgICBpZiAobWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3RvciA9PT0gcHJvbWlzZS5jb25zdHJ1Y3RvciAmJlxyXG4gICAgICAgICAgdGhlbiA9PT0gbGliJGVzNiRwcm9taXNlJHRoZW4kJGRlZmF1bHQgJiZcclxuICAgICAgICAgIGNvbnN0cnVjdG9yLnJlc29sdmUgPT09IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhlbiA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IpIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzRnVuY3Rpb24odGhlbikpIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XHJcbiAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzZWxmRnVsZmlsbG1lbnQoKSk7XHJcbiAgICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJHV0aWxzJCRvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUsIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGdldFRoZW4odmFsdWUpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xyXG4gICAgICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xyXG4gICAgICAgIHByb21pc2UuX29uZXJyb3IocHJvbWlzZS5fcmVzdWx0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaChwcm9taXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XHJcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cclxuXHJcbiAgICAgIHByb21pc2UuX3Jlc3VsdCA9IHZhbHVlO1xyXG4gICAgICBwcm9taXNlLl9zdGF0ZSA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRDtcclxuXHJcbiAgICAgIGlmIChwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoLCBwcm9taXNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pIHtcclxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxyXG4gICAgICBwcm9taXNlLl9zdGF0ZSA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEO1xyXG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XHJcblxyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcclxuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcclxuICAgICAgdmFyIGxlbmd0aCA9IHN1YnNjcmliZXJzLmxlbmd0aDtcclxuXHJcbiAgICAgIHBhcmVudC5fb25lcnJvciA9IG51bGw7XHJcblxyXG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XHJcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xyXG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGggKyBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRF0gID0gb25SZWplY3Rpb247XHJcblxyXG4gICAgICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoLCBwYXJlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaChwcm9taXNlKSB7XHJcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xyXG4gICAgICB2YXIgc2V0dGxlZCA9IHByb21pc2UuX3N0YXRlO1xyXG5cclxuICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgIHZhciBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCA9IHByb21pc2UuX3Jlc3VsdDtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgICAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xyXG4gICAgICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xyXG5cclxuICAgICAgICBpZiAoY2hpbGQpIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2soZGV0YWlsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IgPSBuZXcgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCR0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGRldGFpbCk7XHJcbiAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUi5lcnJvciA9IGU7XHJcbiAgICAgICAgcmV0dXJuIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcclxuICAgICAgdmFyIGhhc0NhbGxiYWNrID0gbGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcclxuICAgICAgICAgIHZhbHVlLCBlcnJvciwgc3VjY2VlZGVkLCBmYWlsZWQ7XHJcblxyXG4gICAgICBpZiAoaGFzQ2FsbGJhY2spIHtcclxuICAgICAgICB2YWx1ZSA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUikge1xyXG4gICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcclxuICAgICAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XHJcbiAgICAgICAgICB2YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRjYW5ub3RSZXR1cm5Pd24oKSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YWx1ZSA9IGRldGFpbDtcclxuICAgICAgICBzdWNjZWVkZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcclxuICAgICAgICAvLyBub29wXHJcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZmFpbGVkKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycm9yKTtcclxuICAgICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcclxuICAgICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcikge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJlc29sdmVyKGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKXtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGlkID0gMDtcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5leHRJZCgpIHtcclxuICAgICAgcmV0dXJuIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGlkKys7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbWFrZVByb21pc2UocHJvbWlzZSkge1xyXG4gICAgICBwcm9taXNlW2xpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBST01JU0VfSURdID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaWQrKztcclxuICAgICAgcHJvbWlzZS5fc3RhdGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHByb21pc2UuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcclxuICAgICAgcHJvbWlzZS5fc3Vic2NyaWJlcnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRhbGwkJGFsbChlbnRyaWVzKSB7XHJcbiAgICAgIHJldHVybiBuZXcgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJGRlZmF1bHQodGhpcywgZW50cmllcykucHJvbWlzZTtcclxuICAgIH1cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRhbGwkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRhbGwkJGFsbDtcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJHJhY2UoZW50cmllcykge1xyXG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xyXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKCFsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzQXJyYXkoZW50cmllcykpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyYWNlJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmFjZSQkcmFjZTtcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlamVjdCQkcmVqZWN0KHJlYXNvbikge1xyXG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xyXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xyXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XHJcbiAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlamVjdCQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlamVjdCQkcmVqZWN0O1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNSZXNvbHZlcigpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc05ldygpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZTtcclxuICAgIC8qKlxyXG4gICAgICBQcm9taXNlIG9iamVjdHMgcmVwcmVzZW50IHRoZSBldmVudHVhbCByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhlXHJcbiAgICAgIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsIHdoaWNoXHJcbiAgICAgIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlIHJlYXNvblxyXG4gICAgICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cclxuXHJcbiAgICAgIFRlcm1pbm9sb2d5XHJcbiAgICAgIC0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAtIGBwcm9taXNlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gd2l0aCBhIGB0aGVuYCBtZXRob2Qgd2hvc2UgYmVoYXZpb3IgY29uZm9ybXMgdG8gdGhpcyBzcGVjaWZpY2F0aW9uLlxyXG4gICAgICAtIGB0aGVuYWJsZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyBhIGB0aGVuYCBtZXRob2QuXHJcbiAgICAgIC0gYHZhbHVlYCBpcyBhbnkgbGVnYWwgSmF2YVNjcmlwdCB2YWx1ZSAoaW5jbHVkaW5nIHVuZGVmaW5lZCwgYSB0aGVuYWJsZSwgb3IgYSBwcm9taXNlKS5cclxuICAgICAgLSBgZXhjZXB0aW9uYCBpcyBhIHZhbHVlIHRoYXQgaXMgdGhyb3duIHVzaW5nIHRoZSB0aHJvdyBzdGF0ZW1lbnQuXHJcbiAgICAgIC0gYHJlYXNvbmAgaXMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aHkgYSBwcm9taXNlIHdhcyByZWplY3RlZC5cclxuICAgICAgLSBgc2V0dGxlZGAgdGhlIGZpbmFsIHJlc3Rpbmcgc3RhdGUgb2YgYSBwcm9taXNlLCBmdWxmaWxsZWQgb3IgcmVqZWN0ZWQuXHJcblxyXG4gICAgICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXHJcblxyXG4gICAgICBQcm9taXNlcyB0aGF0IGFyZSBmdWxmaWxsZWQgaGF2ZSBhIGZ1bGZpbGxtZW50IHZhbHVlIGFuZCBhcmUgaW4gdGhlIGZ1bGZpbGxlZFxyXG4gICAgICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXHJcbiAgICAgIHJlamVjdGVkIHN0YXRlLiAgQSBmdWxmaWxsbWVudCB2YWx1ZSBpcyBuZXZlciBhIHRoZW5hYmxlLlxyXG5cclxuICAgICAgUHJvbWlzZXMgY2FuIGFsc28gYmUgc2FpZCB0byAqcmVzb2x2ZSogYSB2YWx1ZS4gIElmIHRoaXMgdmFsdWUgaXMgYWxzbyBhXHJcbiAgICAgIHByb21pc2UsIHRoZW4gdGhlIG9yaWdpbmFsIHByb21pc2UncyBzZXR0bGVkIHN0YXRlIHdpbGwgbWF0Y2ggdGhlIHZhbHVlJ3NcclxuICAgICAgc2V0dGxlZCBzdGF0ZS4gIFNvIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgcmVqZWN0cyB3aWxsXHJcbiAgICAgIGl0c2VsZiByZWplY3QsIGFuZCBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpbGxcclxuICAgICAgaXRzZWxmIGZ1bGZpbGwuXHJcblxyXG5cclxuICAgICAgQmFzaWMgVXNhZ2U6XHJcbiAgICAgIC0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgYGBganNcclxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAvLyBvbiBzdWNjZXNzXHJcbiAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XHJcblxyXG4gICAgICAgIC8vIG9uIGZhaWx1cmVcclxuICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAvLyBvbiBmdWxmaWxsbWVudFxyXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcclxuICAgICAgICAvLyBvbiByZWplY3Rpb25cclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgQWR2YW5jZWQgVXNhZ2U6XHJcbiAgICAgIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgUHJvbWlzZXMgc2hpbmUgd2hlbiBhYnN0cmFjdGluZyBhd2F5IGFzeW5jaHJvbm91cyBpbnRlcmFjdGlvbnMgc3VjaCBhc1xyXG4gICAgICBgWE1MSHR0cFJlcXVlc3Rgcy5cclxuXHJcbiAgICAgIGBgYGpzXHJcbiAgICAgIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XHJcbiAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlcjtcclxuICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XHJcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICAgIHhoci5zZW5kKCk7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBnZXRKU09OKCcvcG9zdHMuanNvbicpLnRoZW4oZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgIC8vIG9uIGZ1bGZpbGxtZW50XHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xyXG4gICAgICAgIC8vIG9uIHJlamVjdGlvblxyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBVbmxpa2UgY2FsbGJhY2tzLCBwcm9taXNlcyBhcmUgZ3JlYXQgY29tcG9zYWJsZSBwcmltaXRpdmVzLlxyXG5cclxuICAgICAgYGBganNcclxuICAgICAgUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgIGdldEpTT04oJy9wb3N0cycpLFxyXG4gICAgICAgIGdldEpTT04oJy9jb21tZW50cycpXHJcbiAgICAgIF0pLnRoZW4oZnVuY3Rpb24odmFsdWVzKXtcclxuICAgICAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXHJcbiAgICAgICAgdmFsdWVzWzFdIC8vID0+IGNvbW1lbnRzSlNPTlxyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWVzO1xyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBAY2xhc3MgUHJvbWlzZVxyXG4gICAgICBAcGFyYW0ge2Z1bmN0aW9ufSByZXNvbHZlclxyXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXHJcbiAgICAgIEBjb25zdHJ1Y3RvclxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlKHJlc29sdmVyKSB7XHJcbiAgICAgIHRoaXNbbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUFJPTUlTRV9JRF0gPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRuZXh0SWQoKTtcclxuICAgICAgdGhpcy5fcmVzdWx0ID0gdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gW107XHJcblxyXG4gICAgICBpZiAobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCAhPT0gcmVzb2x2ZXIpIHtcclxuICAgICAgICB0eXBlb2YgcmVzb2x2ZXIgIT09ICdmdW5jdGlvbicgJiYgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJG5lZWRzUmVzb2x2ZXIoKTtcclxuICAgICAgICB0aGlzIGluc3RhbmNlb2YgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UgPyBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcikgOiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNOZXcoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLmFsbCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkZGVmYXVsdDtcclxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLnJhY2UgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyYWNlJCRkZWZhdWx0O1xyXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucmVzb2x2ZSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQ7XHJcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5yZWplY3QgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZWplY3QkJGRlZmF1bHQ7XHJcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5fc2V0U2NoZWR1bGVyID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHNldFNjaGVkdWxlcjtcclxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLl9zZXRBc2FwID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHNldEFzYXA7XHJcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5fYXNhcCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwO1xyXG5cclxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLnByb3RvdHlwZSA9IHtcclxuICAgICAgY29uc3RydWN0b3I6IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcclxuICAgICAgd2hpY2ggcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGVcclxuICAgICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxyXG5cclxuICAgICAgYGBganNcclxuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xyXG4gICAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XHJcbiAgICAgICAgLy8gdXNlciBpcyB1bmF2YWlsYWJsZSwgYW5kIHlvdSBhcmUgZ2l2ZW4gdGhlIHJlYXNvbiB3aHlcclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgQ2hhaW5pbmdcclxuICAgICAgLS0tLS0tLS1cclxuXHJcbiAgICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXHJcbiAgICAgIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmaXJzdCBwcm9taXNlJ3MgZnVsZmlsbG1lbnRcclxuICAgICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXHJcblxyXG4gICAgICBgYGBqc1xyXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICByZXR1cm4gdXNlci5uYW1lO1xyXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XHJcbiAgICAgICAgcmV0dXJuICdkZWZhdWx0IG5hbWUnO1xyXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xyXG4gICAgICAgIC8vIElmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgdXNlck5hbWVgIHdpbGwgYmUgdGhlIHVzZXIncyBuYW1lLCBvdGhlcndpc2UgaXRcclxuICAgICAgICAvLyB3aWxsIGJlIGAnZGVmYXVsdCBuYW1lJ2BcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XHJcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcclxuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAvLyBuZXZlciByZWFjaGVkXHJcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxyXG4gICAgICAgIC8vIElmIGBmaW5kVXNlcmAgcmVqZWN0ZWQsIGByZWFzb25gIHdpbGwgYmUgJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknLlxyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcbiAgICAgIElmIHRoZSBkb3duc3RyZWFtIHByb21pc2UgZG9lcyBub3Qgc3BlY2lmeSBhIHJlamVjdGlvbiBoYW5kbGVyLCByZWplY3Rpb24gcmVhc29ucyB3aWxsIGJlIHByb3BhZ2F0ZWQgZnVydGhlciBkb3duc3RyZWFtLlxyXG5cclxuICAgICAgYGBganNcclxuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xyXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcclxuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAvLyBuZXZlciByZWFjaGVkXHJcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBBc3NpbWlsYXRpb25cclxuICAgICAgLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxyXG4gICAgICByZXRyaWV2ZWQgYXN5bmNocm9ub3VzbHkuIFRoaXMgY2FuIGJlIGFjaGlldmVkIGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gdGhlXHJcbiAgICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXHJcbiAgICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxyXG5cclxuICAgICAgYGBganNcclxuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xyXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xyXG4gICAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgSWYgdGhlIGFzc2ltbGlhdGVkIHByb21pc2UgcmVqZWN0cywgdGhlbiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgYWxzbyByZWplY3QuXHJcblxyXG4gICAgICBgYGBqc1xyXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XHJcbiAgICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCBmdWxmaWxscywgd2UnbGwgaGF2ZSB0aGUgdmFsdWUgaGVyZVxyXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XHJcbiAgICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBTaW1wbGUgRXhhbXBsZVxyXG4gICAgICAtLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgU3luY2hyb25vdXMgRXhhbXBsZVxyXG5cclxuICAgICAgYGBgamF2YXNjcmlwdFxyXG4gICAgICB2YXIgcmVzdWx0O1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXN1bHQgPSBmaW5kUmVzdWx0KCk7XHJcbiAgICAgICAgLy8gc3VjY2Vzc1xyXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xyXG4gICAgICAgIC8vIGZhaWx1cmVcclxuICAgICAgfVxyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIEVycmJhY2sgRXhhbXBsZVxyXG5cclxuICAgICAgYGBganNcclxuICAgICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgLy8gZmFpbHVyZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBzdWNjZXNzXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBQcm9taXNlIEV4YW1wbGU7XHJcblxyXG4gICAgICBgYGBqYXZhc2NyaXB0XHJcbiAgICAgIGZpbmRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XHJcbiAgICAgICAgLy8gc3VjY2Vzc1xyXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xyXG4gICAgICAgIC8vIGZhaWx1cmVcclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgQWR2YW5jZWQgRXhhbXBsZVxyXG4gICAgICAtLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgU3luY2hyb25vdXMgRXhhbXBsZVxyXG5cclxuICAgICAgYGBgamF2YXNjcmlwdFxyXG4gICAgICB2YXIgYXV0aG9yLCBib29rcztcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xyXG4gICAgICAgIGJvb2tzICA9IGZpbmRCb29rc0J5QXV0aG9yKGF1dGhvcik7XHJcbiAgICAgICAgLy8gc3VjY2Vzc1xyXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xyXG4gICAgICAgIC8vIGZhaWx1cmVcclxuICAgICAgfVxyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIEVycmJhY2sgRXhhbXBsZVxyXG5cclxuICAgICAgYGBganNcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGZhaWx1cmUocmVhc29uKSB7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBmYWlsdXJlKGVycik7XHJcbiAgICAgICAgICAvLyBmYWlsdXJlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcclxuICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBmYWlsdXJlKGVycik7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgIGZvdW5kQm9va3MoYm9va3MpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcclxuICAgICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIHN1Y2Nlc3NcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIFByb21pc2UgRXhhbXBsZTtcclxuXHJcbiAgICAgIGBgYGphdmFzY3JpcHRcclxuICAgICAgZmluZEF1dGhvcigpLlxyXG4gICAgICAgIHRoZW4oZmluZEJvb2tzQnlBdXRob3IpLlxyXG4gICAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xyXG4gICAgICAgICAgLy8gZm91bmQgYm9va3NcclxuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcclxuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBAbWV0aG9kIHRoZW5cclxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsZWRcclxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZFxyXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXHJcbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XHJcbiAgICAqL1xyXG4gICAgICB0aGVuOiBsaWIkZXM2JHByb21pc2UkdGhlbiQkZGVmYXVsdCxcclxuXHJcbiAgICAvKipcclxuICAgICAgYGNhdGNoYCBpcyBzaW1wbHkgc3VnYXIgZm9yIGB0aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24pYCB3aGljaCBtYWtlcyBpdCB0aGUgc2FtZVxyXG4gICAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxyXG5cclxuICAgICAgYGBganNcclxuICAgICAgZnVuY3Rpb24gZmluZEF1dGhvcigpe1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBzeW5jaHJvbm91c1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGZpbmRBdXRob3IoKTtcclxuICAgICAgfSBjYXRjaChyZWFzb24pIHtcclxuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBhc3luYyB3aXRoIHByb21pc2VzXHJcbiAgICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xyXG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIEBtZXRob2QgY2F0Y2hcclxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cclxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxyXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxyXG4gICAgKi9cclxuICAgICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3Rpb24pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yO1xyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IoQ29uc3RydWN0b3IsIGlucHV0KSB7XHJcbiAgICAgIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcclxuICAgICAgdGhpcy5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLnByb21pc2VbbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUFJPTUlTRV9JRF0pIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRtYWtlUHJvbWlzZSh0aGlzLnByb21pc2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc0FycmF5KGlucHV0KSkge1xyXG4gICAgICAgIHRoaXMuX2lucHV0ICAgICA9IGlucHV0O1xyXG4gICAgICAgIHRoaXMubGVuZ3RoICAgICA9IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICB0aGlzLl9yZW1haW5pbmcgPSBpbnB1dC5sZW5ndGg7XHJcblxyXG4gICAgICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5sZW5ndGggfHwgMDtcclxuICAgICAgICAgIHRoaXMuX2VudW1lcmF0ZSgpO1xyXG4gICAgICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xyXG4gICAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHRoaXMucHJvbWlzZSwgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJHZhbGlkYXRpb25FcnJvcigpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCR2YWxpZGF0aW9uRXJyb3IoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xyXG4gICAgfVxyXG5cclxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBsZW5ndGggID0gdGhpcy5sZW5ndGg7XHJcbiAgICAgIHZhciBpbnB1dCAgID0gdGhpcy5faW5wdXQ7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgdGhpcy5fc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5fZWFjaEVudHJ5KGlucHV0W2ldLCBpKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uKGVudHJ5LCBpKSB7XHJcbiAgICAgIHZhciBjID0gdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcclxuICAgICAgdmFyIHJlc29sdmUgPSBjLnJlc29sdmU7XHJcblxyXG4gICAgICBpZiAocmVzb2x2ZSA9PT0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCkge1xyXG4gICAgICAgIHZhciB0aGVuID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZ2V0VGhlbihlbnRyeSk7XHJcblxyXG4gICAgICAgIGlmICh0aGVuID09PSBsaWIkZXM2JHByb21pc2UkdGhlbiQkZGVmYXVsdCAmJlxyXG4gICAgICAgICAgICBlbnRyeS5fc3RhdGUgIT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcclxuICAgICAgICAgIHRoaXMuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xyXG4gICAgICAgICAgdGhpcy5fcmVzdWx0W2ldID0gZW50cnk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdCkge1xyXG4gICAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgYyhsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgZW50cnksIHRoZW4pO1xyXG4gICAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl93aWxsU2V0dGxlQXQobmV3IGMoZnVuY3Rpb24ocmVzb2x2ZSkgeyByZXNvbHZlKGVudHJ5KTsgfSksIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLl93aWxsU2V0dGxlQXQocmVzb2x2ZShlbnRyeSksIGkpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24oc3RhdGUsIGksIHZhbHVlKSB7XHJcbiAgICAgIHZhciBwcm9taXNlID0gdGhpcy5wcm9taXNlO1xyXG5cclxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7XHJcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nLS07XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3dpbGxTZXR0bGVBdCA9IGZ1bmN0aW9uKHByb21pc2UsIGkpIHtcclxuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xyXG5cclxuICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHByb21pc2UsIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVELCBpLCB2YWx1ZSk7XHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xyXG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCwgaSwgcmVhc29uKTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRwb2x5ZmlsbCgpIHtcclxuICAgICAgdmFyIGxvY2FsO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBsb2NhbCA9IGdsb2JhbDtcclxuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGxvY2FsID0gc2VsZjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xyXG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seWZpbGwgZmFpbGVkIGJlY2F1c2UgZ2xvYmFsIG9iamVjdCBpcyB1bmF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50Jyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBQID0gbG9jYWwuUHJvbWlzZTtcclxuXHJcbiAgICAgIGlmIChQICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChQLnJlc29sdmUoKSkgPT09ICdbb2JqZWN0IFByb21pc2VdJyAmJiAhUC5jYXN0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsb2NhbC5Qcm9taXNlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQ7XHJcbiAgICB9XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRwb2x5ZmlsbDtcclxuXHJcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdC5Qcm9taXNlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQ7XHJcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdC5wb2x5ZmlsbCA9IGxpYiRlczYkcHJvbWlzZSRwb2x5ZmlsbCQkZGVmYXVsdDtcclxuXHJcbiAgICAvKiBnbG9iYWwgZGVmaW5lOnRydWUgbW9kdWxlOnRydWUgd2luZG93OiB0cnVlICovXHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XHJcbiAgICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0OyB9KTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlWydleHBvcnRzJ10pIHtcclxuICAgICAgbW9kdWxlWydleHBvcnRzJ10gPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdDtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRoaXNbJ1Byb21pc2UnXSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGxpYiRlczYkcHJvbWlzZSRwb2x5ZmlsbCQkZGVmYXVsdCgpO1xyXG59KS5jYWxsKHRoaXMpO1xyXG4iLCIoZnVuY3Rpb24oc2VsZikge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgaWYgKHNlbGYuZmV0Y2gpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgdmFyIHN1cHBvcnQgPSB7XHJcbiAgICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXHJcbiAgICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcclxuICAgIGJsb2I6ICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmICdCbG9iJyBpbiBzZWxmICYmIChmdW5jdGlvbigpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBuZXcgQmxvYigpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0pKCksXHJcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxyXG4gICAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XHJcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcclxuICAgIH1cclxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLlxcXl9gfH5dL2kudGVzdChuYW1lKSkge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWVcclxuICB9XHJcblxyXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XHJcbiAgZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcclxuICAgIHZhciBpdGVyYXRvciA9IHtcclxuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxyXG4gICAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcclxuICAgICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBpdGVyYXRvclxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGl0ZXJhdG9yXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcclxuICAgIHRoaXMubWFwID0ge31cclxuXHJcbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcclxuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXHJcbiAgICAgIH0sIHRoaXMpXHJcblxyXG4gICAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XHJcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXHJcbiAgICAgIH0sIHRoaXMpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xyXG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcclxuICAgIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXHJcbiAgICB2YXIgbGlzdCA9IHRoaXMubWFwW25hbWVdXHJcbiAgICBpZiAoIWxpc3QpIHtcclxuICAgICAgbGlzdCA9IFtdXHJcbiAgICAgIHRoaXMubWFwW25hbWVdID0gbGlzdFxyXG4gICAgfVxyXG4gICAgbGlzdC5wdXNoKHZhbHVlKVxyXG4gIH1cclxuXHJcbiAgSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXHJcbiAgfVxyXG5cclxuICBIZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICB2YXIgdmFsdWVzID0gdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cclxuICAgIHJldHVybiB2YWx1ZXMgPyB2YWx1ZXNbMF0gOiBudWxsXHJcbiAgfVxyXG5cclxuICBIZWFkZXJzLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gfHwgW11cclxuICB9XHJcblxyXG4gIEhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxyXG4gIH1cclxuXHJcbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuICAgIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gW25vcm1hbGl6ZVZhbHVlKHZhbHVlKV1cclxuICB9XHJcblxyXG4gIEhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xyXG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5tYXApLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICB0aGlzLm1hcFtuYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgbmFtZSwgdGhpcylcclxuICAgICAgfSwgdGhpcylcclxuICAgIH0sIHRoaXMpXHJcbiAgfVxyXG5cclxuICBIZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaXRlbXMgPSBbXVxyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2gobmFtZSkgfSlcclxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcclxuICB9XHJcblxyXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGl0ZW1zID0gW11cclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkgeyBpdGVtcy5wdXNoKHZhbHVlKSB9KVxyXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxyXG4gIH1cclxuXHJcbiAgSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGl0ZW1zID0gW11cclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pIH0pXHJcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXHJcbiAgfVxyXG5cclxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xyXG4gICAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcclxuICAgIGlmIChib2R5LmJvZHlVc2VkKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcclxuICAgIH1cclxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXHJcbiAgICAgIH1cclxuICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcclxuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcclxuICAgIHJldHVybiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xyXG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXHJcbiAgICByZXR1cm4gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEJvZHkoKSB7XHJcbiAgICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcclxuXHJcbiAgICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcclxuICAgICAgdGhpcy5fYm9keUluaXQgPSBib2R5XHJcbiAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHlcclxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xyXG4gICAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxyXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcclxuICAgICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XHJcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XHJcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5LnRvU3RyaW5nKClcclxuICAgICAgfSBlbHNlIGlmICghYm9keSkge1xyXG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcclxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XHJcbiAgICAgICAgLy8gT25seSBzdXBwb3J0IEFycmF5QnVmZmVycyBmb3IgUE9TVCBtZXRob2QuXHJcbiAgICAgICAgLy8gUmVjZWl2aW5nIEFycmF5QnVmZmVycyBoYXBwZW5zIHZpYSBCbG9icywgaW5zdGVhZC5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIEJvZHlJbml0IHR5cGUnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XHJcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XHJcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzdXBwb3J0LmJsb2IpIHtcclxuICAgICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcclxuICAgICAgICBpZiAocmVqZWN0ZWQpIHtcclxuICAgICAgICAgIHJldHVybiByZWplY3RlZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XHJcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxyXG4gICAgICAgIGlmIChyZWplY3RlZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcclxuICAgICAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcclxuICAgICAgICByZXR1cm4gcmVqZWN0ZWQgPyByZWplY3RlZCA6IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XHJcbiAgICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXHJcbiAgdmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cclxuXHJcbiAgZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xyXG4gICAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxyXG4gICAgcmV0dXJuIChtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSkgPyB1cGNhc2VkIDogbWV0aG9kXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxyXG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcclxuICAgIGlmIChSZXF1ZXN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGlucHV0KSkge1xyXG4gICAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXJsID0gaW5wdXQudXJsXHJcbiAgICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xyXG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xyXG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcclxuICAgICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxyXG4gICAgICBpZiAoIWJvZHkpIHtcclxuICAgICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XHJcbiAgICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudXJsID0gaW5wdXRcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdvbWl0J1xyXG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XHJcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcclxuICAgIH1cclxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxyXG4gICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXHJcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbFxyXG5cclxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxyXG4gICAgfVxyXG4gICAgdGhpcy5faW5pdEJvZHkoYm9keSlcclxuICB9XHJcblxyXG4gIFJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRlY29kZShib2R5KSB7XHJcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBib2R5LnRyaW0oKS5zcGxpdCgnJicpLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcclxuICAgICAgaWYgKGJ5dGVzKSB7XHJcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxyXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxyXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxyXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBmb3JtXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoZWFkZXJzKHhocikge1xyXG4gICAgdmFyIGhlYWQgPSBuZXcgSGVhZGVycygpXHJcbiAgICB2YXIgcGFpcnMgPSAoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKS50cmltKCkuc3BsaXQoJ1xcbicpXHJcbiAgICBwYWlycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xyXG4gICAgICB2YXIgc3BsaXQgPSBoZWFkZXIudHJpbSgpLnNwbGl0KCc6JylcclxuICAgICAgdmFyIGtleSA9IHNwbGl0LnNoaWZ0KCkudHJpbSgpXHJcbiAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJzonKS50cmltKClcclxuICAgICAgaGVhZC5hcHBlbmQoa2V5LCB2YWx1ZSlcclxuICAgIH0pXHJcbiAgICByZXR1cm4gaGVhZFxyXG4gIH1cclxuXHJcbiAgQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxyXG5cclxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xyXG4gICAgaWYgKCFvcHRpb25zKSB7XHJcbiAgICAgIG9wdGlvbnMgPSB7fVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xyXG4gICAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1c1xyXG4gICAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxyXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gb3B0aW9ucy5zdGF0dXNUZXh0XHJcbiAgICB0aGlzLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzID8gb3B0aW9ucy5oZWFkZXJzIDogbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxyXG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xyXG4gICAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXHJcbiAgfVxyXG5cclxuICBCb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxyXG5cclxuICBSZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcclxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcclxuICAgICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxyXG4gICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxyXG4gICAgICB1cmw6IHRoaXMudXJsXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXHJcbiAgICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xyXG4gICAgcmV0dXJuIHJlc3BvbnNlXHJcbiAgfVxyXG5cclxuICB2YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cclxuXHJcbiAgUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xyXG4gICAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xyXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXHJcbiAgfVxyXG5cclxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXHJcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxyXG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxyXG5cclxuICBzZWxmLmZldGNoID0gZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgdmFyIHJlcXVlc3RcclxuICAgICAgaWYgKFJlcXVlc3QucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoaW5wdXQpICYmICFpbml0KSB7XHJcbiAgICAgICAgcmVxdWVzdCA9IGlucHV0XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlVVJMKCkge1xyXG4gICAgICAgIGlmICgncmVzcG9uc2VVUkwnIGluIHhocikge1xyXG4gICAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVVSTFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQXZvaWQgc2VjdXJpdHkgd2FybmluZ3Mgb24gZ2V0UmVzcG9uc2VIZWFkZXIgd2hlbiBub3QgYWxsb3dlZCBieSBDT1JTXHJcbiAgICAgICAgaWYgKC9eWC1SZXF1ZXN0LVVSTDovbS50ZXN0KHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkpIHtcclxuICAgICAgICAgIHJldHVybiB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ1gtUmVxdWVzdC1VUkwnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcclxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgaGVhZGVyczogaGVhZGVycyh4aHIpLFxyXG4gICAgICAgICAgdXJsOiByZXNwb25zZVVSTCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XHJcbiAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcclxuXHJcbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcclxuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xyXG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXHJcbiAgICB9KVxyXG4gIH1cclxuICBzZWxmLmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxyXG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7IiwiIWZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0XCJmdW5jdGlvblwiID09IHR5cGVvZiBkZWZpbmUgJiYgZGVmaW5lLmFtZCA/IC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZSB1bmxlc3MgYW1kTW9kdWxlSWQgaXMgc2V0XG5cdGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHJvb3Quc3ZnNGV2ZXJ5Ym9keSA9IGZhY3RvcnkoKTtcblx0fSkgOiBcIm9iamVjdFwiID09IHR5cGVvZiBleHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOiByb290LnN2ZzRldmVyeWJvZHkgPSBmYWN0b3J5KCk7XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuXHQvKiEgc3ZnNGV2ZXJ5Ym9keSB2Mi4wLjMgfCBnaXRodWIuY29tL2pvbmF0aGFudG5lYWwvc3ZnNGV2ZXJ5Ym9keSAqL1xuXHRmdW5jdGlvbiBlbWJlZChzdmcsIHRhcmdldCkge1xuXHRcdC8vIGlmIHRoZSB0YXJnZXQgZXhpc3RzXG5cdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0Ly8gY3JlYXRlIGEgZG9jdW1lbnQgZnJhZ21lbnQgdG8gaG9sZCB0aGUgY29udGVudHMgb2YgdGhlIHRhcmdldFxuXHRcdFx0dmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLCB2aWV3Qm94ID0gIXN2Zy5nZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIpICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIpO1xuXHRcdFx0Ly8gY29uZGl0aW9uYWxseSBzZXQgdGhlIHZpZXdCb3ggb24gdGhlIHN2Z1xuXHRcdFx0dmlld0JveCAmJiBzdmcuc2V0QXR0cmlidXRlKFwidmlld0JveFwiLCB2aWV3Qm94KTtcblx0XHRcdC8vIGNvcHkgdGhlIGNvbnRlbnRzIG9mIHRoZSBjbG9uZSBpbnRvIHRoZSBmcmFnbWVudFxuXHRcdFx0Zm9yICgvLyBjbG9uZSB0aGUgdGFyZ2V0XG5cdFx0XHR2YXIgY2xvbmUgPSB0YXJnZXQuY2xvbmVOb2RlKCEwKTsgY2xvbmUuY2hpbGROb2Rlcy5sZW5ndGg7ICkge1xuXHRcdFx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZChjbG9uZS5maXJzdENoaWxkKTtcblx0XHRcdH1cblx0XHRcdC8vIGFwcGVuZCB0aGUgZnJhZ21lbnQgaW50byB0aGUgc3ZnXG5cdFx0XHRzdmcuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBsb2FkcmVhZHlzdGF0ZWNoYW5nZSh4aHIpIHtcblx0XHQvLyBsaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgcmVxdWVzdFxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGlmIHRoZSByZXF1ZXN0IGlzIHJlYWR5XG5cdFx0XHRpZiAoNCA9PT0geGhyLnJlYWR5U3RhdGUpIHtcblx0XHRcdFx0Ly8gZ2V0IHRoZSBjYWNoZWQgaHRtbCBkb2N1bWVudFxuXHRcdFx0XHR2YXIgY2FjaGVkRG9jdW1lbnQgPSB4aHIuX2NhY2hlZERvY3VtZW50O1xuXHRcdFx0XHQvLyBlbnN1cmUgdGhlIGNhY2hlZCBodG1sIGRvY3VtZW50IGJhc2VkIG9uIHRoZSB4aHIgcmVzcG9uc2Vcblx0XHRcdFx0Y2FjaGVkRG9jdW1lbnQgfHwgKGNhY2hlZERvY3VtZW50ID0geGhyLl9jYWNoZWREb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudChcIlwiKSxcblx0XHRcdFx0Y2FjaGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSB4aHIucmVzcG9uc2VUZXh0LCB4aHIuX2NhY2hlZFRhcmdldCA9IHt9KSwgLy8gY2xlYXIgdGhlIHhociBlbWJlZHMgbGlzdCBhbmQgZW1iZWQgZWFjaCBpdGVtXG5cdFx0XHRcdHhoci5fZW1iZWRzLnNwbGljZSgwKS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRcdC8vIGdldCB0aGUgY2FjaGVkIHRhcmdldFxuXHRcdFx0XHRcdHZhciB0YXJnZXQgPSB4aHIuX2NhY2hlZFRhcmdldFtpdGVtLmlkXTtcblx0XHRcdFx0XHQvLyBlbnN1cmUgdGhlIGNhY2hlZCB0YXJnZXRcblx0XHRcdFx0XHR0YXJnZXQgfHwgKHRhcmdldCA9IHhoci5fY2FjaGVkVGFyZ2V0W2l0ZW0uaWRdID0gY2FjaGVkRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbS5pZCkpLFxuXHRcdFx0XHRcdC8vIGVtYmVkIHRoZSB0YXJnZXQgaW50byB0aGUgc3ZnXG5cdFx0XHRcdFx0ZW1iZWQoaXRlbS5zdmcsIHRhcmdldCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0sIC8vIHRlc3QgdGhlIHJlYWR5IHN0YXRlIGNoYW5nZSBpbW1lZGlhdGVseVxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UoKTtcblx0fVxuXHRmdW5jdGlvbiBzdmc0ZXZlcnlib2R5KHJhd29wdHMpIHtcblx0XHRmdW5jdGlvbiBvbmludGVydmFsKCkge1xuXHRcdFx0Ly8gd2hpbGUgdGhlIGluZGV4IGV4aXN0cyBpbiB0aGUgbGl2ZSA8dXNlPiBjb2xsZWN0aW9uXG5cdFx0XHRmb3IgKC8vIGdldCB0aGUgY2FjaGVkIDx1c2U+IGluZGV4XG5cdFx0XHR2YXIgaW5kZXggPSAwOyBpbmRleCA8IHVzZXMubGVuZ3RoOyApIHtcblx0XHRcdFx0Ly8gZ2V0IHRoZSBjdXJyZW50IDx1c2U+XG5cdFx0XHRcdHZhciB1c2UgPSB1c2VzW2luZGV4XSwgc3ZnID0gdXNlLnBhcmVudE5vZGU7XG5cdFx0XHRcdGlmIChzdmcgJiYgL3N2Zy9pLnRlc3Qoc3ZnLm5vZGVOYW1lKSkge1xuXHRcdFx0XHRcdHZhciBzcmMgPSB1c2UuZ2V0QXR0cmlidXRlKFwieGxpbms6aHJlZlwiKTtcblx0XHRcdFx0XHRpZiAocG9seWZpbGwgJiYgKCFvcHRzLnZhbGlkYXRlIHx8IG9wdHMudmFsaWRhdGUoc3JjLCBzdmcsIHVzZSkpKSB7XG5cdFx0XHRcdFx0XHQvLyByZW1vdmUgdGhlIDx1c2U+IGVsZW1lbnRcblx0XHRcdFx0XHRcdHN2Zy5yZW1vdmVDaGlsZCh1c2UpO1xuXHRcdFx0XHRcdFx0Ly8gcGFyc2UgdGhlIHNyYyBhbmQgZ2V0IHRoZSB1cmwgYW5kIGlkXG5cdFx0XHRcdFx0XHR2YXIgc3JjU3BsaXQgPSBzcmMuc3BsaXQoXCIjXCIpLCB1cmwgPSBzcmNTcGxpdC5zaGlmdCgpLCBpZCA9IHNyY1NwbGl0LmpvaW4oXCIjXCIpO1xuXHRcdFx0XHRcdFx0Ly8gaWYgdGhlIGxpbmsgaXMgZXh0ZXJuYWxcblx0XHRcdFx0XHRcdGlmICh1cmwubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdC8vIGdldCB0aGUgY2FjaGVkIHhociByZXF1ZXN0XG5cdFx0XHRcdFx0XHRcdHZhciB4aHIgPSByZXF1ZXN0c1t1cmxdO1xuXHRcdFx0XHRcdFx0XHQvLyBlbnN1cmUgdGhlIHhociByZXF1ZXN0IGV4aXN0c1xuXHRcdFx0XHRcdFx0XHR4aHIgfHwgKHhociA9IHJlcXVlc3RzW3VybF0gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKSwgeGhyLm9wZW4oXCJHRVRcIiwgdXJsKSwgeGhyLnNlbmQoKSxcblx0XHRcdFx0XHRcdFx0eGhyLl9lbWJlZHMgPSBbXSksIC8vIGFkZCB0aGUgc3ZnIGFuZCBpZCBhcyBhbiBpdGVtIHRvIHRoZSB4aHIgZW1iZWRzIGxpc3Rcblx0XHRcdFx0XHRcdFx0eGhyLl9lbWJlZHMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0c3ZnOiBzdmcsXG5cdFx0XHRcdFx0XHRcdFx0aWQ6IGlkXG5cdFx0XHRcdFx0XHRcdH0pLCAvLyBwcmVwYXJlIHRoZSB4aHIgcmVhZHkgc3RhdGUgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdFx0XHRcdGxvYWRyZWFkeXN0YXRlY2hhbmdlKHhocik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyBlbWJlZCB0aGUgbG9jYWwgaWQgaW50byB0aGUgc3ZnXG5cdFx0XHRcdFx0XHRcdGVtYmVkKHN2ZywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gaW5jcmVhc2UgdGhlIGluZGV4IHdoZW4gdGhlIHByZXZpb3VzIHZhbHVlIHdhcyBub3QgXCJ2YWxpZFwiXG5cdFx0XHRcdFx0KytpbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gY29udGludWUgdGhlIGludGVydmFsXG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUob25pbnRlcnZhbCwgNjcpO1xuXHRcdH1cblx0XHR2YXIgcG9seWZpbGwsIG9wdHMgPSBPYmplY3QocmF3b3B0cyksIG5ld2VySUVVQSA9IC9cXGJUcmlkZW50XFwvWzU2N11cXGJ8XFxiTVNJRSAoPzo5fDEwKVxcLjBcXGIvLCB3ZWJraXRVQSA9IC9cXGJBcHBsZVdlYktpdFxcLyhcXGQrKVxcYi8sIG9sZGVyRWRnZVVBID0gL1xcYkVkZ2VcXC8xMlxcLihcXGQrKVxcYi87XG5cdFx0cG9seWZpbGwgPSBcInBvbHlmaWxsXCIgaW4gb3B0cyA/IG9wdHMucG9seWZpbGwgOiBuZXdlcklFVUEudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSB8fCAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaChvbGRlckVkZ2VVQSkgfHwgW10pWzFdIDwgMTA1NDcgfHwgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2god2Via2l0VUEpIHx8IFtdKVsxXSA8IDUzNztcblx0XHQvLyBjcmVhdGUgeGhyIHJlcXVlc3RzIG9iamVjdFxuXHRcdHZhciByZXF1ZXN0cyA9IHt9LCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHNldFRpbWVvdXQsIHVzZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVzZVwiKTtcblx0XHQvLyBjb25kaXRpb25hbGx5IHN0YXJ0IHRoZSBpbnRlcnZhbCBpZiB0aGUgcG9seWZpbGwgaXMgYWN0aXZlXG5cdFx0cG9seWZpbGwgJiYgb25pbnRlcnZhbCgpO1xuXHR9XG5cdHJldHVybiBzdmc0ZXZlcnlib2R5O1xufSk7XG4iXX0=
