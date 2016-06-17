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
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var emailPattern = /[^\s]+@[^\s]+/i;

var FormValidation = {
	init: init,
	setupFormControls: setupFormControls,

	validateHandle: validateHandle,
	validateField: validateField,
	validate: validate
};

function newFormValidation(formEl, options) {
	var formValidation = Object.create(FormValidation);
	formValidation.init(formEl, options);
	return formValidation;
}

function init(formEl, options) {
	if (!formEl) {
		return;
	}

	this.formEl = formEl;

	if (typeof this.formEl == "string") {
		this.formEl = document.querySelector(this.formEl);
	}

	if (!this.formEl) {
		return;
	}

	if (!options) {
		options = {};
	}

	this.invalidClass = options.invalidClass || 'control--invalid';
	this.validClass = options.validClass || 'control--valid';

	this.validateField = this.validateField.bind(this);
	this.validateHandle = this.validateHandle.bind(this);
	this.validate = this.validate.bind(this);

	this.setupFormControls();
	addEventListeners.call(this);
}

function setupFormControls() {
	var requiredFields = Array.prototype.slice.call(this.formEl.querySelectorAll('[required]'));
	this.fields = [];
	this.fieldsArray = [];

	var confirmArray = [];

	for (var i = 0; i < requiredFields.length; i++) {
		this.fieldsArray.push(requiredFields[i]);

		var confirmEl = false;
		if (requiredFields[i].getAttribute('data-confirm-for')) {
			confirmEl = this.formEl.querySelector('#' + requiredFields[i].getAttribute('data-confirm-for'));
			confirmArray.push({
				index: i,
				confirmEl: confirmEl
			});
		}

		this.fields.push({
			fieldEl: requiredFields[i],
			isDirty: false,
			isValid: true,
			wasValid: false,
			pattern: requiredFields[i].getAttribute('data-pattern') || /./,
			confirmEl: confirmEl,
			confirmField: false
		});
	}

	var index = 0;
	for (var _i = 0; _i < confirmArray.length; _i++) {
		index = this.fieldsArray.indexOf(confirmArray[_i].confirmEl);
		var confirmField = this.fields[confirmArray[_i].index];
		var field = this.fields[index];
		field.confirmField = confirmField;
	}
}

function addEventListeners() {
	this.formEl.addEventListener('change', this.validateHandle);
	this.formEl.addEventListener('keyup', this.validateHandle);
}

function validateHandle(evt) {
	var index = this.fieldsArray.indexOf(evt.target);
	if (! ~index) {
		return;
	}

	var field = this.fields[index];
	this.validateField(field, evt.type);
}

function validateField(field, type) {
	if (!field.isDirty && (!type || type == "change")) {
		field.isDirty = true;
	}

	if (!field.isDirty) {
		return;
	}

	if (field.isValid) {
		field.wasValid = true;
	} else {
		field.wasValid = false;
	}

	this.validate(field);

	if (field.wasValid && (!type || type == "change") || !field.wasValid) {
		if (field.isValid) {
			field.fieldEl.classList.remove(this.invalidClass);
			field.fieldEl.classList.add(this.validClass);
		} else {
			field.fieldEl.classList.add(this.invalidClass);
			field.fieldEl.classList.remove(this.validClass);
		}
	}

	if (field.confirmField && field.confirmField.isDirty) {
		this.validateField(field.confirmField, 'change');
	}
}

function validate(field) {
	var pattern = void 0;
	var fieldType = field.fieldEl.getAttribute('type');

	if (fieldType == "email") {
		pattern = emailPattern;
	} else {
		pattern = field.pattern;
	}
	var isValid = pattern.test(field.fieldEl.value);
	if (field.confirmEl) {
		if (field.confirmEl.value != field.fieldEl.value) {
			isValid = false;
		}
	}
	field.isValid = isValid;
}

exports.default = newFormValidation;

},{}],3:[function(require,module,exports){
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

var _validation = require("./form/validation");

var _validation2 = _interopRequireDefault(_validation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function setupMenu() {
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
}

//import curry from "../vendor/ramda/curry";
//import Bricks from "../vendor/brick";

function setupFontLoading() {
	(0, _fontLoading2.default)({
		subFonts: [{
			name: 'aileron_subset',
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
				weight: 300
			}
		}, {
			name: 'aileron',
			option: {
				weight: 200
			}
		}]
	});
}

document.addEventListener('DOMContentLoaded', function (evt) {
	setupMenu();
	setupFontLoading();
	(0, _svg4everybody2.default)();
	_modal2.default.init(true);

	(0, _validation2.default)('.js-form-validation');
});

},{"../vendor/svg4everybody":13,"./form/validation":2,"./ui/modal":5,"./ui/multi-level-menu":6,"./util/font-loading":7,"./util/polyfills":8}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = require('./../util/util');

'use strict';

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

	this.options = (0, _util.extend)({}, this.defaultOptions, this.options, options);

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

},{"./../util/util":9}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dismissibleSlidein = require('./dismissible-slidein');

var _dismissibleSlidein2 = _interopRequireDefault(_dismissibleSlidein);

var _util = require('./../util/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var MlMenu = {
	init: init,

	back: back,
	linkClick: linkClick,

	openSubMenu: openSubMenu,
	menuOut: menuOut,
	menuIn: menuIn,
	addBreadcrumb: addBreadcrumb,
	breadcrumbClick: breadcrumbClick,
	removeBreadcrumbs: removeBreadcrumbs,
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

	this.options = (0, _util.extend)({}, this.defaultOptions, this.options, options);

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
				links[i].setAttribute('data-pos', pos);
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

		var currentUnderLinks = Array.prototype.slice.call(this.menuEl.querySelectorAll('.ml-menu__link--current-under'));
		if (currentUnderLinks.length) {
			for (var i = 0; i < currentUnderLinks.length; i++) {
				currentUnderLinks[i].classList.remove('ml-menu__link--current-under');
			}
		}

		evt.target.classList.add('ml-menu__link--current');
		for (var _i = 0; _i < this.breadcrumbs.length; _i++) {
			if (this.breadcrumbs[_i].isFirst) {
				continue;
			}

			var backindex = this.menusArr[this.breadcrumbs[_i].index].backIdx;
			var menuLocation = this.menusArr[this.breadcrumbs[_i].index].menuEl.getAttribute('data-menu');
			var link = this.menusArr[backindex].menuEl.querySelector('[data-submenu=' + menuLocation + ']');
			link.classList.add('ml-menu__link--current-under');
		}

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
		this.removeBreadcrumbs();
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
		this.removeBreadcrumbs(indexOfSiblingNode);
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

	(0, _util.onEndAnimation)(menuItems[farthestIdx].parentNode, function () {
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

	if (!isBackNavigation) {
		// add breadcrumb
		this.addBreadcrumb(nextMenuIdx);
	}

	(0, _util.onEndAnimation)(nextMenuItems[farthestIdx].parentNode, function () {
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
	var spacer = this.breadcrumbSpacer.cloneNode(true);

	var breadcrumb = {
		bcEl: bc,
		spacer: spacer,
		in: true,
		out: false,
		isFirst: !index,
		index: index,
		setanimClasses: function setanimClasses() {
			if (this.in) {
				this.bcEl.classList.add('animate-in');
				this.spacer.classList.add('animate-in');
			} else if (this.out) {
				this.bcEl.classList.add('animate-out');
				this.spacer.classList.add('animate-out');
			}
		}
	};

	this.breadcrumbs.push(breadcrumb);
	requestAnimationFrame(this.renderBreadCrumbs);
}

function removeBreadcrumbs(index) {
	if (index != undefined) {
		var delay = 0;
		var delayInterval = 0.05;
		for (var i = this.breadcrumbs.length - 1; i >= index; i--) {
			if (this.breadcrumbs[i].isFirst) {
				continue;
			}
			this.breadcrumbs[i].out = true;
			this.breadcrumbs[i].bcEl.style.animationDelay = delay + "s";
			delay += delayInterval;
			this.breadcrumbs[i].spacer.style.animationDelay = delay + "s";
			delay += delayInterval;
		}
	} else {
		this.breadcrumbs[this.breadcrumbs.length - 1].out = true;
	}
	requestAnimationFrame(this.renderBreadCrumbs);
}

function breadcrumbsAfterRender() {
	var breadcrumbsIn = this.breadcrumbs.filter(function (el) {
		return el.in;
	});

	if (breadcrumbsIn.length) {
		(0, _util.onEndAnimation)(breadcrumbsIn[breadcrumbsIn.length - 1].bcEl, function () {
			breadcrumbsIn.forEach(function (el) {
				el.in = false;
				el.bcEl.classList.remove('animate-in');
				el.spacer.classList.remove('animate-in');
			});
		}.bind(this));
	}

	var breadcrumbsOut = this.breadcrumbs.filter(function (el) {
		return el.out;
	});

	if (breadcrumbsOut.length) {
		(0, _util.onEndAnimation)(breadcrumbsOut[breadcrumbsOut.length - 1].bcEl, function () {
			breadcrumbsOut.forEach(function (el) {
				el.bcEl.remove();
				el.spacer.remove();
			});
		}.bind(this));

		this.breadcrumbs = this.breadcrumbs.filter(function (el) {
			return !el.out;
		});
	}
}

function renderBreadCrumbs() {
	this.breadcrumbsCtrl.innerHTML = "";
	for (var i = 0; i < this.breadcrumbs.length; i++) {
		this.breadcrumbs[i].setanimClasses();
		if (!this.breadcrumbs[i].isFirst) {
			this.breadcrumbsCtrl.appendChild(this.breadcrumbs[i].spacer);
		}
		this.breadcrumbsCtrl.appendChild(this.breadcrumbs[i].bcEl);
	}

	breadcrumbsAfterRender.call(this);
}

exports.default = createMlMenu;

},{"./../util/util":9,"./dismissible-slidein":4}],7:[function(require,module,exports){
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

},{"./../../vendor/fontfaceobserver":12}],8:[function(require,module,exports){
"use strict";

var _es6Promise = require("../../vendor/es6-promise");

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _fetch = require("../../vendor/fetch");

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

_es6Promise2.default.polyfill();

},{"../../vendor/es6-promise":10,"../../vendor/fetch":11}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var animationEndEventName = ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oAnimationEnd'];

function onEndAnimation(el, callback) {
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

	if (!el) {
		return;
	}

	for (var i = 0; i < animationEndEventName.length; i++) {
		el.addEventListener(animationEndEventName[i], onEndCallbackFn);
	}
}

function extend() {
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

exports.onEndAnimation = onEndAnimation;
exports.extend = extend;

},{}],10:[function(require,module,exports){
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

},{"_process":1}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./es6-promise":10}],13:[function(require,module,exports){
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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwicmVzb3VyY2VzXFxqc1xcc3JjXFxmb3JtXFx2YWxpZGF0aW9uLmpzIiwicmVzb3VyY2VzXFxqc1xcc3JjXFxpbmRleC5qcyIsInJlc291cmNlc1xcanNcXHNyY1xcdWlcXGRpc21pc3NpYmxlLXNsaWRlaW4uanMiLCJyZXNvdXJjZXNcXGpzXFxzcmNcXHVpXFxtb2RhbC5qcyIsInJlc291cmNlc1xcanNcXHNyY1xcdWlcXG11bHRpLWxldmVsLW1lbnUuanMiLCJyZXNvdXJjZXNcXGpzXFxzcmNcXHV0aWxcXGZvbnQtbG9hZGluZy5qcyIsInJlc291cmNlc1xcanNcXHNyY1xcdXRpbFxccG9seWZpbGxzLmpzIiwicmVzb3VyY2VzXFxqc1xcc3JjXFx1dGlsXFx1dGlsLmpzIiwicmVzb3VyY2VzXFxqc1xcdmVuZG9yXFxyZXNvdXJjZXNcXGpzXFx2ZW5kb3JcXGVzNi1wcm9taXNlLmpzIiwicmVzb3VyY2VzXFxqc1xcdmVuZG9yXFxmZXRjaC5qcyIsInJlc291cmNlc1xcanNcXHZlbmRvclxcZm9udGZhY2VvYnNlcnZlci5qcyIsInJlc291cmNlc1xcanNcXHZlbmRvclxcc3ZnNGV2ZXJ5Ym9keS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QkFBd0IsT0FBTyxxQkFBUCxJQUFnQyxVQUFoQztNQUE0QyxPQUFPLFNBQVMsb0JBQVQsQ0FBOEIsS0FBOUIsQ0FBUDs7QUExQ3hELFVBNEMvQixJQUFZLFlBQVosQ0E1QytCO0VBQWhDO0FBOENBLFFBQU8sYUFBUCxDQXRGa0I7Q0FBWCxDQUxSIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBlbWFpbFBhdHRlcm4gPSAvW15cXHNdK0BbXlxcc10rL2k7XG5cbmNvbnN0IEZvcm1WYWxpZGF0aW9uID0ge1xuXHRpbml0OiBpbml0LFxuXHRzZXR1cEZvcm1Db250cm9sczogc2V0dXBGb3JtQ29udHJvbHMsXG5cblx0dmFsaWRhdGVIYW5kbGU6IHZhbGlkYXRlSGFuZGxlLFxuXHR2YWxpZGF0ZUZpZWxkOiB2YWxpZGF0ZUZpZWxkLFxuXHR2YWxpZGF0ZTogdmFsaWRhdGVcbn07XG5cbmZ1bmN0aW9uIG5ld0Zvcm1WYWxpZGF0aW9uKGZvcm1FbCwgb3B0aW9ucyl7XG5cdGNvbnN0IGZvcm1WYWxpZGF0aW9uID0gT2JqZWN0LmNyZWF0ZShGb3JtVmFsaWRhdGlvbik7XG5cdGZvcm1WYWxpZGF0aW9uLmluaXQoZm9ybUVsLCBvcHRpb25zKTtcblx0cmV0dXJuIGZvcm1WYWxpZGF0aW9uO1xufVxuXG5mdW5jdGlvbiBpbml0KGZvcm1FbCwgb3B0aW9ucyl7XG5cdGlmKCFmb3JtRWwpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMuZm9ybUVsID0gZm9ybUVsO1xuXG5cdGlmKHR5cGVvZiB0aGlzLmZvcm1FbCA9PSBcInN0cmluZ1wiKXtcblx0XHR0aGlzLmZvcm1FbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5mb3JtRWwpO1xuXHR9XG5cblx0aWYoIXRoaXMuZm9ybUVsKXtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZighb3B0aW9ucyl7XG5cdFx0b3B0aW9ucyA9IHt9O1xuXHR9XG5cblx0dGhpcy5pbnZhbGlkQ2xhc3MgPSBvcHRpb25zLmludmFsaWRDbGFzcyB8fCAnY29udHJvbC0taW52YWxpZCc7XG5cdHRoaXMudmFsaWRDbGFzcyA9IG9wdGlvbnMudmFsaWRDbGFzcyB8fCAnY29udHJvbC0tdmFsaWQnO1xuXG5cdHRoaXMudmFsaWRhdGVGaWVsZCA9IHRoaXMudmFsaWRhdGVGaWVsZC5iaW5kKHRoaXMpO1xuXHR0aGlzLnZhbGlkYXRlSGFuZGxlID0gdGhpcy52YWxpZGF0ZUhhbmRsZS5iaW5kKHRoaXMpO1xuXHR0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xuXG5cdHRoaXMuc2V0dXBGb3JtQ29udHJvbHMoKTtcblx0YWRkRXZlbnRMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcbn1cblxuZnVuY3Rpb24gc2V0dXBGb3JtQ29udHJvbHMoKXtcblx0Y29uc3QgcmVxdWlyZWRGaWVsZHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmZvcm1FbC5xdWVyeVNlbGVjdG9yQWxsKCdbcmVxdWlyZWRdJykpO1xuXHR0aGlzLmZpZWxkcyA9IFtdO1xuXHR0aGlzLmZpZWxkc0FycmF5ID0gW107XG5cblx0Y29uc3QgY29uZmlybUFycmF5ID0gW107XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZXF1aXJlZEZpZWxkcy5sZW5ndGg7IGkrKykge1xuXHRcdHRoaXMuZmllbGRzQXJyYXkucHVzaChyZXF1aXJlZEZpZWxkc1tpXSk7XG5cblx0XHRsZXQgY29uZmlybUVsID0gZmFsc2U7XG5cdFx0aWYocmVxdWlyZWRGaWVsZHNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLWNvbmZpcm0tZm9yJykpe1xuXHRcdFx0Y29uZmlybUVsID0gdGhpcy5mb3JtRWwucXVlcnlTZWxlY3RvcignIycrcmVxdWlyZWRGaWVsZHNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLWNvbmZpcm0tZm9yJykpO1xuXHRcdFx0Y29uZmlybUFycmF5LnB1c2goe1xuXHRcdFx0XHRpbmRleDogaSxcblx0XHRcdFx0Y29uZmlybUVsOiBjb25maXJtRWxcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHRoaXMuZmllbGRzLnB1c2goe1xuXHRcdFx0ZmllbGRFbDogcmVxdWlyZWRGaWVsZHNbaV0sXG5cdFx0XHRpc0RpcnR5OiBmYWxzZSxcblx0XHRcdGlzVmFsaWQ6IHRydWUsXG5cdFx0XHR3YXNWYWxpZDogZmFsc2UsXG5cdFx0XHRwYXR0ZXJuOiByZXF1aXJlZEZpZWxkc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0dGVybicpIHx8IC8uLyxcblx0XHRcdGNvbmZpcm1FbDogY29uZmlybUVsLFxuXHRcdFx0Y29uZmlybUZpZWxkOiBmYWxzZVxuXHRcdH0pO1xuXHR9XG5cblx0bGV0IGluZGV4ID0gMDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb25maXJtQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRpbmRleCA9IHRoaXMuZmllbGRzQXJyYXkuaW5kZXhPZihjb25maXJtQXJyYXlbaV0uY29uZmlybUVsKTtcblx0XHRjb25zdCBjb25maXJtRmllbGQgPSB0aGlzLmZpZWxkc1tjb25maXJtQXJyYXlbaV0uaW5kZXhdO1xuXHRcdGNvbnN0IGZpZWxkID0gdGhpcy5maWVsZHNbaW5kZXhdO1xuXHRcdGZpZWxkLmNvbmZpcm1GaWVsZCA9IGNvbmZpcm1GaWVsZDtcblx0fVxufVxuXG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycygpe1xuXHR0aGlzLmZvcm1FbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLnZhbGlkYXRlSGFuZGxlKTtcblx0dGhpcy5mb3JtRWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLnZhbGlkYXRlSGFuZGxlKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVIYW5kbGUoZXZ0KXtcblx0Y29uc3QgaW5kZXggPSB0aGlzLmZpZWxkc0FycmF5LmluZGV4T2YoZXZ0LnRhcmdldCk7XG5cdGlmKCF+aW5kZXgpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGZpZWxkID0gdGhpcy5maWVsZHNbaW5kZXhdO1xuXHR0aGlzLnZhbGlkYXRlRmllbGQoZmllbGQsIGV2dC50eXBlKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVGaWVsZChmaWVsZCwgdHlwZSl7XG5cdGlmKCFmaWVsZC5pc0RpcnR5ICYmICghdHlwZSB8fCB0eXBlID09IFwiY2hhbmdlXCIpKXtcblx0XHRmaWVsZC5pc0RpcnR5ID0gdHJ1ZTtcblx0fVxuXG5cdGlmKCFmaWVsZC5pc0RpcnR5KXtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZihmaWVsZC5pc1ZhbGlkKXtcblx0XHRmaWVsZC53YXNWYWxpZCA9IHRydWU7XG5cdH1lbHNle1xuXHRcdGZpZWxkLndhc1ZhbGlkID0gZmFsc2U7XG5cdH1cblxuXHR0aGlzLnZhbGlkYXRlKGZpZWxkKTtcblxuXHRpZihcblx0XHQoZmllbGQud2FzVmFsaWQgJiYgKCF0eXBlIHx8IHR5cGUgPT0gXCJjaGFuZ2VcIikpIHx8XG5cdFx0IWZpZWxkLndhc1ZhbGlkXG5cdCl7XG5cdFx0aWYoZmllbGQuaXNWYWxpZCl7XG5cdFx0XHRmaWVsZC5maWVsZEVsLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5pbnZhbGlkQ2xhc3MpO1xuXHRcdFx0ZmllbGQuZmllbGRFbC5jbGFzc0xpc3QuYWRkKHRoaXMudmFsaWRDbGFzcyk7XG5cdFx0fWVsc2V7XG5cdFx0XHRmaWVsZC5maWVsZEVsLmNsYXNzTGlzdC5hZGQodGhpcy5pbnZhbGlkQ2xhc3MpO1xuXHRcdFx0ZmllbGQuZmllbGRFbC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMudmFsaWRDbGFzcyk7XG5cdFx0fVxuXHR9XG5cblx0aWYoZmllbGQuY29uZmlybUZpZWxkICYmIGZpZWxkLmNvbmZpcm1GaWVsZC5pc0RpcnR5KXtcblx0XHR0aGlzLnZhbGlkYXRlRmllbGQoZmllbGQuY29uZmlybUZpZWxkLCAnY2hhbmdlJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGUoZmllbGQpe1xuXHRsZXQgcGF0dGVybjtcblx0Y29uc3QgZmllbGRUeXBlID0gZmllbGQuZmllbGRFbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcblxuXHRpZihmaWVsZFR5cGUgPT0gXCJlbWFpbFwiKXtcblx0XHRwYXR0ZXJuID0gZW1haWxQYXR0ZXJuO1xuXHR9ZWxzZXtcblx0XHRwYXR0ZXJuID0gZmllbGQucGF0dGVybjtcblx0fVxuXHRsZXQgaXNWYWxpZCA9IHBhdHRlcm4udGVzdChmaWVsZC5maWVsZEVsLnZhbHVlKTtcblx0aWYoZmllbGQuY29uZmlybUVsKXtcblx0XHRpZihmaWVsZC5jb25maXJtRWwudmFsdWUgIT0gZmllbGQuZmllbGRFbC52YWx1ZSl7XG5cdFx0XHRpc1ZhbGlkID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdGZpZWxkLmlzVmFsaWQgPSBpc1ZhbGlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBuZXdGb3JtVmFsaWRhdGlvbjtcbiIsImltcG9ydCBwb2x5IGZyb20gXCIuL3V0aWwvcG9seWZpbGxzXCI7XG5cbi8vaW1wb3J0IGN1cnJ5IGZyb20gXCIuLi92ZW5kb3IvcmFtZGEvY3VycnlcIjtcbi8vaW1wb3J0IEJyaWNrcyBmcm9tIFwiLi4vdmVuZG9yL2JyaWNrXCI7XG5cbmltcG9ydCBjcmVhdGVNbE1lbnUgZnJvbSBcIi4vdWkvbXVsdGktbGV2ZWwtbWVudVwiO1xuaW1wb3J0IHN2ZzRldmVyeWJvZHkgZnJvbSBcIi4uL3ZlbmRvci9zdmc0ZXZlcnlib2R5XCI7XG5pbXBvcnQgbW9kYWwgZnJvbSBcIi4vdWkvbW9kYWxcIjtcbmltcG9ydCBmb250bG9hZGluZyBmcm9tIFwiLi91dGlsL2ZvbnQtbG9hZGluZ1wiO1xuaW1wb3J0IG5ld0Zvcm1WYWxpZGF0aW9uIGZyb20gXCIuL2Zvcm0vdmFsaWRhdGlvblwiO1xuXG4vLyBmdW5jdGlvbiBicmljaygpe1xuXHQvLyBpbXBvcnQgQnJpY2tzXG5cblx0Ly8gZGVmaW5lIHlvdXIgZ3JpZCBhdCBkaWZmZXJlbnQgYnJlYWtwb2ludHMsIG1vYmlsZSBmaXJzdCAoc21hbGxlc3QgdG8gbGFyZ2VzdClcblxuXHQvLyBjb25zdCBzaXplcyA9IFtcblx0Ly8gXHR7IGNvbHVtbnM6IDIsIGd1dHRlcjogMTAgfSwgICAgICAgICAgICAgICAgICAgLy8gYXNzdW1lZCB0byBiZSBtb2JpbGUsIGJlY2F1c2Ugb2YgdGhlIG1pc3NpbmcgbXEgcHJvcGVydHlcblx0Ly8gXHR7IG1xOiAnNzY4cHgnLCBjb2x1bW5zOiAzLCBndXR0ZXI6IDI1IH0sXG5cdC8vIFx0eyBtcTogJzEwMjRweCcsIGNvbHVtbnM6IDQsIGd1dHRlcjogNTAgfVxuXHQvLyBdXG5cblx0Ly8gY3JlYXRlIGFuIGluc3RhbmNlXG5cblx0Ly8gY29uc3QgaW5zdGFuY2UgPSBCcmlja3Moe1xuXHQvLyBcdGNvbnRhaW5lcjogJy5jb250YWluZXInLFxuXHQvLyBcdHBhY2tlZDogICAgJ2RhdGEtcGFja2VkJywgICAgICAgIC8vIGlmIG5vdCBwcmVmaXhlZCB3aXRoICdkYXRhLScsIGl0IHdpbGwgYmUgYWRkZWRcblx0Ly8gXHRzaXplczogICAgIHNpemVzXG5cdC8vIH0pXG5cblx0Ly8gYmluZCBjYWxsYmFja3NcblxuXHQvLyBpbnN0YW5jZVxuXHQvLyAub24oJ3BhY2snLCAgICgpID0+IGNvbnNvbGUubG9nKCdBTEwgZ3JpZCBpdGVtcyBwYWNrZWQuJykpXG5cdC8vIC5vbigndXBkYXRlJywgKCkgPT4gY29uc29sZS5sb2coJ05FVyBncmlkIGl0ZW1zIHBhY2tlZC4nKSlcblx0Ly8gLm9uKCdyZXNpemUnLCBzaXplID0+IGNvbnNvbGUubG9nKCdUaGUgZ3JpZCBoYXMgYmUgcmUtcGFja2VkIHRvIGFjY29tbW9kYXRlIGEgbmV3IEJSRUFLUE9JTlQuJykpXG5cblx0Ly8gc3RhcnQgaXQgdXAsIHdoZW4gdGhlIERPTSBpcyByZWFkeVxuXHQvLyBub3RlIHRoYXQgaWYgaW1hZ2VzIGFyZSBpbiB0aGUgZ3JpZCwgeW91IG1heSBuZWVkIHRvIHdhaXQgZm9yIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcblxuXHQvLyBpbnN0YW5jZVxuXHQvLyAucmVzaXplKHRydWUpICAgICAvLyBiaW5kIHJlc2l6ZSBoYW5kbGVyXG5cdC8vIC5wYWNrKCk7ICAgICAgICAgICAvLyBwYWNrIGluaXRpYWwgaXRlbXNcbi8vIH1cblxuZnVuY3Rpb24gc2V0dXBNZW51KCl7XG5cdGNvbnN0IG1lbnUgPSBjcmVhdGVNbE1lbnUoJy5qcy1tZW51LXRlc3QnLCB7XG5cdFx0c2lkZTogJ2xlZnQnLFxuXHRcdGNsb25lOiBmYWxzZSxcblx0XHRicmVhZGNydW1iU3BhY2VyOiAnPGRpdiBjbGFzcz1cIm1sLW1lbnVfX2JyZWFkY3J1bWItc3BhY2VcIj48c3ZnPjx1c2UgeGxpbms6aHJlZj1cIi9yZXNvdXJjZXMvaW1ncy9zdmdzcHJpdGUuc3ZnI2JyZWFkY3J1bWItc3BhY2VyXCIgLz48L3N2Zz48L2Rpdj4nLFxuXHRcdHN1Ym5hdkxpbmtIdG1sOiAnPHN2Zz48dXNlIHhsaW5rOmhyZWY9XCIvcmVzb3VyY2VzL2ltZ3Mvc3Znc3ByaXRlLnN2ZyNtZW51LWRvdHNcIiAvPjwvc3ZnPicsXG5cdFx0YmFja0J1dHRvbkh0bWw6ICc8c3ZnPjx1c2UgeGxpbms6aHJlZj1cIi9yZXNvdXJjZXMvaW1ncy9zdmdzcHJpdGUuc3ZnI21lbnUtYmFja1wiIC8+PC9zdmc+Jyxcblx0XHRjbG9zZUJ1dHRvbkh0bWw6ICc8c3ZnPjx1c2UgeGxpbms6aHJlZj1cIi9yZXNvdXJjZXMvaW1ncy9zdmdzcHJpdGUuc3ZnI2Nsb3NlXCIgLz48L3N2Zz4nXG5cdH0pO1xuXG5cdGNvbnN0IHNob3dNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLW1lbnUtc2hvdycpO1xuXG5cdGlmKHNob3dNZW51KXtcblx0XHRzaG93TWVudS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG1lbnUuc2xpZGVJbkNvbnRyb2xsZXIuc2hvdyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0dXBGb250TG9hZGluZygpe1xuXHRmb250bG9hZGluZyh7XG5cdFx0c3ViRm9udHM6IFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ2FpbGVyb25fc3Vic2V0Jyxcblx0XHRcdFx0b3B0aW9uOiB7XG5cdFx0XHRcdFx0d2VpZ2h0OiA0MDBcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0ZnVsbEZvbnRzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdhaWxlcm9uJyxcblx0XHRcdFx0b3B0aW9uOiB7XG5cdFx0XHRcdFx0d2VpZ2h0OiA0MDBcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ2FpbGVyb24nLFxuXHRcdFx0XHRvcHRpb246IHtcblx0XHRcdFx0XHR3ZWlnaHQ6IDMwMFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnYWlsZXJvbicsXG5cdFx0XHRcdG9wdGlvbjoge1xuXHRcdFx0XHRcdHdlaWdodDogMjAwXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRdXG5cdH0pO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oZXZ0KXtcblx0c2V0dXBNZW51KCk7XG5cdHNldHVwRm9udExvYWRpbmcoKTtcblx0c3ZnNGV2ZXJ5Ym9keSgpO1xuXHRtb2RhbC5pbml0KHRydWUpO1xuXG5cdG5ld0Zvcm1WYWxpZGF0aW9uKCcuanMtZm9ybS12YWxpZGF0aW9uJyk7XG59KTtcbiIsImltcG9ydCB7ZXh0ZW5kfSBmcm9tICcuLy4uL3V0aWwvdXRpbCc7XG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgdHJhbnNpdGlvbkVuZE5hbWUgPSBbJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCAndHJhbnNpdGlvbmVuZCcsICdtc1RyYW5zaXRpb25FbmQnLCAnb1RyYW5zaXRpb25FbmQnXTtcblxuY29uc3QgRGlzbWlzc2libGVTbGlkZUluID0ge1xuXHRpbml0OiBpbml0LFxuXG5cdHNob3c6IHNob3csXG5cdGhpZGU6IGhpZGUsXG5cdGJsb2NrQ2xpY2tzOiBibG9ja0NsaWNrcyxcblx0b25TdGFydDogb25TdGFydCxcblx0b25Nb3ZlOiBvbk1vdmUsXG5cdG9uRW5kOiBvbkVuZCxcblx0b25UcmFuc2l0aW9uRW5kOiBvblRyYW5zaXRpb25FbmQsXG5cdHVwZGF0ZTogdXBkYXRlLFxuXHRkZXN0cm95OiBkZXN0cm95LFxuXG5cdGFkZEV2ZW50TGlzdGVuZXJzOiBhZGRFdmVudExpc3RlbmVycyxcblx0cmVtb3ZlRXZlbnRMaXN0ZW5lcnM6IHJlbW92ZUV2ZW50TGlzdGVuZXJzXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVTbGlkZUluKGVsLCBvcHRpb25zKXtcblx0Y29uc3Qgc2xpZGVJbiA9IE9iamVjdC5jcmVhdGUoRGlzbWlzc2libGVTbGlkZUluKTtcblx0c2xpZGVJbi5pbml0KGVsLCBvcHRpb25zKTtcblx0cmV0dXJuIHNsaWRlSW47XG59XG5cbmZ1bmN0aW9uIGluaXQoZWwsIG9wdGlvbnMpe1xuXHRpZighZWwpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0aXNSaWdodDogZmFsc2UsXG5cdFx0Y2xvc2VCdXR0b25DbGFzczogJ2RzLXNsaWRlaW5fX2FjdGlvbiBkcy1zbGlkZWluX19hY3Rpb24tLWNsb3NlJyxcblx0XHRjbG9zZUJ1dHRvbkh0bWw6ICd4J1xuXHR9O1xuXG5cdHRoaXMub3B0aW9ucyA9IGV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuXHR0aGlzLmVsID0gZWw7XG5cdGlmKHR5cGVvZiB0aGlzLmVsID09PSBcInN0cmluZ1wiKXtcblx0XHR0aGlzLmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmVsKTtcblx0fVxuXG5cdGlmKCF0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygnZHMtc2xpZGVpbicpKXtcblx0XHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2RzLXNsaWRlaW4nKTtcblx0fVxuXG5cdHRoaXMuaXNSaWdodCA9IHRoaXMub3B0aW9ucy5pc1JpZ2h0O1xuXHRpZih0aGlzLmlzUmlnaHQpe1xuXHRcdHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnZHMtc2xpZGVpbi0tcmlnaHQnKTtcblx0fVxuXG5cdHRoaXMuY29udGFpbmVyID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZHMtc2xpZGVpbl9fY29udGFpbmVyJyk7XG5cdGlmKCF0aGlzLmNvbnRhaW5lcil7XG5cdFx0YnVpbGRDb250YWluZXIuY2FsbCh0aGlzKTtcblx0fVxuXG5cdHRoaXMuaGlkZUJ1dHRvbkVsID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZHMtc2xpZGVpbl9fYWN0aW9uLS1jbG9zZScpO1xuXHRpZighdGhpcy5oaWRlQnV0dG9uRWwpe1xuXHRcdGJ1aWxkSGlkZUJ1dHRvbi5jYWxsKHRoaXMpO1xuXHR9XG5cblx0dGhpcy5zaG93IFx0XHRcdFx0PSB0aGlzLnNob3cuYmluZCh0aGlzKTtcblx0dGhpcy5oaWRlIFx0XHRcdFx0PSB0aGlzLmhpZGUuYmluZCh0aGlzKTtcblx0dGhpcy5ibG9ja0NsaWNrcyBcdFx0PSB0aGlzLmJsb2NrQ2xpY2tzLmJpbmQodGhpcyk7XG5cdHRoaXMub25TdGFydCBcdFx0XHQ9IHRoaXMub25TdGFydC5iaW5kKHRoaXMpO1xuXHR0aGlzLm9uTW92ZSBcdFx0XHQ9IHRoaXMub25Nb3ZlLmJpbmQodGhpcyk7XG5cdHRoaXMub25FbmQgXHRcdFx0XHQ9IHRoaXMub25FbmQuYmluZCh0aGlzKTtcblx0dGhpcy5vblRyYW5zaXRpb25FbmQgXHQ9IHRoaXMub25UcmFuc2l0aW9uRW5kLmJpbmQodGhpcyk7XG5cdHRoaXMudXBkYXRlIFx0XHRcdD0gdGhpcy51cGRhdGUuYmluZCh0aGlzKTtcblx0dGhpcy5kZXN0cm95IFx0XHRcdD0gdGhpcy5kZXN0cm95LmJpbmQodGhpcyk7XG5cblx0dGhpcy5zdGFydFggPSAwO1xuXHR0aGlzLmN1cnJlbnRYID0gMDtcblx0dGhpcy50b3VjaGluZ05hdiA9IGZhbHNlO1xuXG5cdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRDb250YWluZXIoKXtcblx0Y29uc3Qgd3JhcENvbnRlbnQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkO1xuXHRjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZHMtc2xpZGVpbl9fY29udGFpbmVyXCI7XG5cdHdyYXBDb250ZW50LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNvbnRhaW5lciwgd3JhcENvbnRlbnQpO1xuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQod3JhcENvbnRlbnQpO1xuXHR0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbn1cblxuZnVuY3Rpb24gYnVpbGRIaWRlQnV0dG9uKCl7XG5cdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRidXR0b24uY2xhc3NOYW1lID0gdGhpcy5vcHRpb25zLmNsb3NlQnV0dG9uQ2xhc3M7XG5cdGJ1dHRvbi5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuY2xvc2VCdXR0b25IdG1sO1xuXHR0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYnV0dG9uLCB0aGlzLmNvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCk7XG5cdHRoaXMuaGlkZUJ1dHRvbkVsID0gYnV0dG9uO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycygpe1xuXHR0aGlzLmhpZGVCdXR0b25FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZSk7XG5cdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUpO1xuXHR0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYmxvY2tDbGlja3MpO1xuXG5cdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25TdGFydCk7XG5cdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vbk1vdmUpO1xuXHR0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vbkVuZCk7XG5cblx0Ly8gdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uU3RhcnQpO1xuXHQvLyB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3ZlKTtcblx0Ly8gdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbkVuZCk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCl7XG5cdHRoaXMuaGlkZUJ1dHRvbkVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlKTtcblx0dGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZSk7XG5cdHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ibG9ja0NsaWNrcyk7XG5cblx0dGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblN0YXJ0KTtcblx0dGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uTW92ZSk7XG5cdHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uRW5kKTtcblxuXHQvLyB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25TdGFydCk7XG5cdC8vIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdmUpO1xuXHQvLyB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uRW5kKTtcbn1cblxuZnVuY3Rpb24gb25TdGFydChldnQpe1xuXHRpZighdGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2RzLXNsaWRlaW4tLXZpc2libGUnKSB8fCB0aGlzLmRlc3Ryb3llZCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5zdGFydFggPWV2dC50b3VjaGVzWzBdLnBhZ2VYO1xuXHQvL3RoaXMuc3RhcnRYID0gZXZ0LnBhZ2VYIHx8IGV2dC50b3VjaGVzWzBdLnBhZ2VYO1xuXHR0aGlzLmN1cnJlbnRYID0gdGhpcy5zdGFydFg7XG5cblx0dGhpcy50b3VjaGluZ05hdiA9IHRydWU7XG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIG9uTW92ZShldnQpe1xuXHRpZighdGhpcy50b3VjaGluZ05hdil7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5jdXJyZW50WCA9ZXZ0LnRvdWNoZXNbMF0ucGFnZVg7XG5cdC8vdGhpcy5jdXJyZW50WCA9IGV2dC5wYWdlWCB8fCBldnQudG91Y2hlc1swXS5wYWdlWDtcblx0bGV0IHRyYW5zbGF0ZVggPSB0aGlzLmN1cnJlbnRYIC0gdGhpcy5zdGFydFg7XG5cdGlmKFxuXHRcdCh0aGlzLmlzUmlnaHQgJiYgTWF0aC5tYXgoMCwgdHJhbnNsYXRlWCkgPiAwKSB8fFxuXHRcdCghdGhpcy5pc1JpZ2h0ICYmIE1hdGgubWluKDAsdHJhbnNsYXRlWCkgPCAwKVxuXHQpe1xuXHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG9uRW5kKCl7XG5cdGlmKCF0aGlzLnRvdWNoaW5nTmF2KXtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR0aGlzLnRvdWNoaW5nTmF2ID0gZmFsc2U7XG5cblx0bGV0IHRyYW5zbGF0ZVggPSB0aGlzLmN1cnJlbnRYIC0gdGhpcy5zdGFydFg7XG5cdGlmKFxuXHRcdCh0aGlzLmlzUmlnaHQgJiYgTWF0aC5tYXgoMCwgdHJhbnNsYXRlWCkgPiAwKSB8fFxuXHRcdCghdGhpcy5pc1JpZ2h0ICYmIE1hdGgubWluKDAsIHRyYW5zbGF0ZVgpIDwgMClcblx0KXtcblx0XHR0aGlzLmhpZGUoKTtcblx0fVxuXHR0aGlzLmNvbnRhaW5lci5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbn1cblxuZnVuY3Rpb24gdXBkYXRlKCl7XG5cdGlmKCF0aGlzLnRvdWNoaW5nTmF2KXtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xuXHRsZXQgdHJhbnNsYXRlWCA9IHRoaXMuY3VycmVudFggLSB0aGlzLnN0YXJ0WDtcblx0aWYodGhpcy5pc1JpZ2h0KXtcblx0XHR0cmFuc2xhdGVYID0gTWF0aC5tYXgoMCwgdHJhbnNsYXRlWCk7XG5cdH1lbHNle1xuXHRcdHRyYW5zbGF0ZVggPSBNYXRoLm1pbigwLCB0cmFuc2xhdGVYKTtcblx0fVxuXG5cdHRoaXMuY29udGFpbmVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dHJhbnNsYXRlWH1weClgO1xufVxuXG5mdW5jdGlvbiBkZXN0cm95KCl7XG5cdGlmKHRoaXMuaXNSaWdodCl7XG5cdFx0dGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdkcy1zbGlkZWluLS1yaWdodCcpO1xuXHR9XG5cdHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcblx0dGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBibG9ja0NsaWNrcyhldnQpe1xuXHRldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG59XG5cbmZ1bmN0aW9uIG9uVHJhbnNpdGlvbkVuZCgpe1xuXHR0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2RzLXNsaWRlaW4tLWFuaW1hdGFibGUnKTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2l0aW9uRW5kTmFtZS5sZW5ndGg7IGkrKykge1xuXHRcdHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0cmFuc2l0aW9uRW5kTmFtZVtpXSwgdGhpcy5vblRyYW5zaXRpb25FbmQpO1xuXHR9XG5cbn1cblxuZnVuY3Rpb24gc2hvdygpe1xuXHRpZih0aGlzLmRlc3Ryb3llZCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnZHMtc2xpZGVpbi0tYW5pbWF0YWJsZScpO1xuXHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2RzLXNsaWRlaW4tLXZpc2libGUnKTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2l0aW9uRW5kTmFtZS5sZW5ndGg7IGkrKykge1xuXHRcdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcih0cmFuc2l0aW9uRW5kTmFtZVtpXSwgdGhpcy5vblRyYW5zaXRpb25FbmQpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhpZGUoKXtcblx0aWYodGhpcy5kZXN0cm95ZWQpe1xuXHRcdHJldHVybjtcblx0fVxuXHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2RzLXNsaWRlaW4tLWFuaW1hdGFibGUnKTtcblx0dGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdkcy1zbGlkZWluLS12aXNpYmxlJyk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNpdGlvbkVuZE5hbWUubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkVuZE5hbWVbaV0sIHRoaXMub25UcmFuc2l0aW9uRW5kKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTbGlkZUluO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBtb2RhbHMgPSBbXSxcblx0bW9kYWxJRHMgPSBbXTtcblxubGV0XHR2aXNpYmxlQ2xhc3MgPSBcIm1vZGFsLS12aXNpYmxlXCI7XG5cbmZ1bmN0aW9uIGluaXQodG9Jbml0TW9kYWxzKXtcblx0aWYodG9Jbml0TW9kYWxzKXtcblx0XHRpbml0TW9kYWxzKCk7XG5cdH1cblx0YWRkRXZlbnRMaXN0ZW5lcnMoKTtcbn1cblxuZnVuY3Rpb24gaW5pdE1vZGFscygpe1xuXHRnZXRNb2RhbHMoKTtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMoKXtcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaG93LmJpbmQodGhpcykpO1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhpZGUuYmluZCh0aGlzKSk7XG59XG5cbmZ1bmN0aW9uIGdldE1vZGFscygpe1xuXHRjb25zdCBtb2RhbHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtbW9kYWwnKSk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kYWxzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YWRkTW9kYWwobW9kYWxzW2ldKTtcblx0fVxufVxuXG5mdW5jdGlvbiBhZGRNb2RhbChlbCl7XG5cdG1vZGFscy5wdXNoKGVsKTtcblx0Y29uc3QgbW9kYWxJRCA9IGVsLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcblx0bW9kYWxJRHMucHVzaChtb2RhbElEKTtcbn1cblxuZnVuY3Rpb24gc2V0VmlzaWJsZUNsYXNzKHZpc0NsYXNzKXtcblx0dmlzaWJsZUNsYXNzID0gdmlzQ2xhc3M7XG59XG5cbmZ1bmN0aW9uIGlzTm90TW9kYWxMaW5rKGVsKXtcblx0cmV0dXJuICFlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLW1vZGFsLWxpbmsnKSAmJiAhZWwuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLWlkJyk7XG59XG5cbmZ1bmN0aW9uIHNob3coZXZ0KXtcblx0aWYoaXNOb3RNb2RhbExpbmsoZXZ0LnRhcmdldCkgfHwgIW1vZGFscy5sZW5ndGgpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdGxldCBtb2RhbElEO1xuXHRpZihldnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpKXtcblx0XHRtb2RhbElEID0gZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5yZXBsYWNlKCcjJywgJycpO1xuXHR9ZWxzZXtcblx0XHRtb2RhbElEID0gZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtaWQnKTtcblx0fVxuXHRjb25zdCBpbmRleCA9IG1vZGFsSURzLmluZGV4T2YobW9kYWxJRCk7XG5cdGNvbnN0IG1vZGFsID0gbW9kYWxzW2luZGV4XTtcblx0aWYobW9kYWwpe1xuXHRcdG1vZGFsLmNsYXNzTGlzdC5hZGQodmlzaWJsZUNsYXNzKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoaWRlKGV2dCl7XG5cdGlmKCFldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWxfX2Nsb3NlLWJ0bicpICYmXG5cdFx0IWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbCcpICYmXG5cdFx0IWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbF9fY29udGFpbmVyJylcblx0XHQpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmKGV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbF9fY29udGFpbmVyJykpe1xuXHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRldnQucHJldmVudERlZmF1bHQoKTtcblxuXHRsZXQgbW9kYWw7XG5cblx0aWYoZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsX19jbG9zZS1idG4nKSl7XG5cdFx0bW9kYWwgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbCcpO1xuXHR9ZWxzZXtcblx0XHRtb2RhbCA9IGV2dC50YXJnZXQ7XG5cdH1cblxuXHRtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKHZpc2libGVDbGFzcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdDogaW5pdCxcblx0aW5pdE1vZGFsczogaW5pdE1vZGFscyxcblx0YWRkTW9kYWw6IGFkZE1vZGFsLFxuXHRzZXRWaXNpYmxlQ2xhc3M6IHNldFZpc2libGVDbGFzc1xufTtcbiIsImltcG9ydCBjcmVhdGVTbGlkZUluIGZyb20gJy4vZGlzbWlzc2libGUtc2xpZGVpbic7XG5pbXBvcnQge29uRW5kQW5pbWF0aW9uLCBleHRlbmR9IGZyb20gJy4vLi4vdXRpbC91dGlsJztcblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBNbE1lbnUgPSB7XG5cdGluaXQ6IGluaXQsXG5cblx0YmFjazogYmFjayxcblx0bGlua0NsaWNrOiBsaW5rQ2xpY2ssXG5cblx0b3BlblN1Yk1lbnU6IG9wZW5TdWJNZW51LFxuXHRtZW51T3V0OiBtZW51T3V0LFxuXHRtZW51SW46IG1lbnVJbixcblx0YWRkQnJlYWRjcnVtYjogYWRkQnJlYWRjcnVtYixcblx0YnJlYWRjcnVtYkNsaWNrOiBicmVhZGNydW1iQ2xpY2ssXG5cdHJlbW92ZUJyZWFkY3J1bWJzOiByZW1vdmVCcmVhZGNydW1icyxcblx0cmVuZGVyQnJlYWRDcnVtYnM6IHJlbmRlckJyZWFkQ3J1bWJzLFxuXG5cdGFkZEV2ZW50TGlzdGVuZXJzOiBhZGRFdmVudExpc3RlbmVycyxcblx0cmVtb3ZlRXZlbnRMaXN0ZW5lcnM6IHJlbW92ZUV2ZW50TGlzdGVuZXJzXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1sTWVudShlbCwgb3B0aW9ucyl7XG5cdGNvbnN0IG1lbnUgPSBPYmplY3QuY3JlYXRlKE1sTWVudSk7XG5cdG1lbnUuaW5pdChlbCwgb3B0aW9ucyk7XG5cdHJldHVybiBtZW51O1xufVxuXG5mdW5jdGlvbiBpbml0KGVsLCBvcHRpb25zKXtcblx0aWYoIWVsKXtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR0aGlzLm1lbnVFbCA9IGVsO1xuXHRpZih0eXBlb2YgdGhpcy5tZW51RWwgPT09IFwic3RyaW5nXCIpe1xuXHRcdHRoaXMubWVudUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLm1lbnVFbCk7XG5cdH1cblxuXHRpZighdGhpcy5tZW51RWwpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0YnJlYWRjcnVtYnNDdHJsOiB0cnVlLFxuXHRcdGluaXRpYWxCcmVhZGNydW1iOiAnYWxsJyxcblx0XHRicmVhZGNydW1iTWF4TGVuZ3RoOiAxNSxcblx0XHRicmVhZGNydW1iU3BhY2VyOiAnPGRpdiBjbGFzcz1cIm1sLW1lbnVfX2JyZWFkY3J1bWItc3BhY2VcIj4+PC9kaXY+Jyxcblx0XHRzdWJuYXZMaW5rSHRtbDogJycsXG5cdFx0YmFja0N0cmw6IHRydWUsXG5cdFx0YmFja0J1dHRvbkh0bWw6ICc8Jyxcblx0XHRpdGVtc0RlbGF5SW50ZXJ2YWw6IDYwLFxuXHRcdG9uSXRlbUNsaWNrOiBudWxsLFxuXHRcdHNpZGU6ICdsZWZ0Jyxcblx0XHRpc1JpZ2h0OiBmYWxzZSxcblx0XHRjbG9uZTogZmFsc2Vcblx0fTtcblxuXHR0aGlzLm9wdGlvbnMgPSBleHRlbmQoe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cblx0aWYodGhpcy5vcHRpb25zLnNpZGUgPT0gJ3JpZ2h0Jyl7XG5cdFx0dGhpcy5vcHRpb25zLmlzUmlnaHQgPSB0cnVlO1xuXHR9ZWxzZXtcblx0XHR0aGlzLm9wdGlvbnMuaXNSaWdodCA9IGZhbHNlO1xuXHR9XG5cblx0Y2xvbmVOYXYuY2FsbCh0aGlzKTtcblxuXHRpZighdGhpcy5tZW51RWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdtbC1tZW51Jykpe1xuXHRcdHRoaXMubWVudUVsLmNsYXNzTGlzdC5hZGQoJ21sLW1lbnUnKTtcblx0fVxuXG5cdGlmKHR5cGVvZiBjcmVhdGVTbGlkZUluICE9PSBcInVuZGVmaW5lZFwiKXtcblx0XHR0aGlzLnNsaWRlSW5Db250cm9sbGVyID0gY3JlYXRlU2xpZGVJbih0aGlzLm1lbnVFbCwgdGhpcy5vcHRpb25zKTtcblx0XHR0aGlzLm1lbnVDb250YWluZXIgPSB0aGlzLnNsaWRlSW5Db250cm9sbGVyLmNvbnRhaW5lcjtcblx0fWVsc2V7XG5cdFx0dGhpcy5tZW51Q29udGFpbmVyID0gdGhpcy5tZW51RWw7XG5cdH1cblxuXHRjb25zdCBzcGFjZVdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0c3BhY2VXcmFwcGVyLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5icmVhZGNydW1iU3BhY2VyO1xuXHR0aGlzLmJyZWFkY3J1bWJTcGFjZXIgPSBzcGFjZVdyYXBwZXIuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cblx0dGhpcy5icmVhZGNydW1icyA9IFtdO1xuXHR0aGlzLmJyZWFkY3J1bWJTaWJsaW5nc1RvUmVtb3ZlID0gbnVsbDtcblx0dGhpcy5jdXJyZW50ID0gMDtcblxuXHR0aGlzLmJhY2sgXHRcdFx0XHQ9IHRoaXMuYmFjay5iaW5kKHRoaXMpO1xuXHR0aGlzLmxpbmtDbGlja1x0XHRcdD0gdGhpcy5saW5rQ2xpY2suYmluZCh0aGlzKTtcblx0dGhpcy5icmVhZGNydW1iQ2xpY2sgXHQ9IHRoaXMuYnJlYWRjcnVtYkNsaWNrLmJpbmQodGhpcyk7XG5cdHRoaXMucmVuZGVyQnJlYWRDcnVtYnNcdD0gdGhpcy5yZW5kZXJCcmVhZENydW1icy5iaW5kKHRoaXMpO1xuXG5cdGJ1aWxkLmNhbGwodGhpcyk7XG5cblx0dGhpcy5tZW51c0Fyclt0aGlzLmN1cnJlbnRdLm1lbnVFbC5jbGFzc0xpc3QuYWRkKCdtbC1tZW51X19sZXZlbC0tY3VycmVudCcpO1xuXG5cdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcbn1cblxuZnVuY3Rpb24gY2xvbmVOYXYoKXtcblx0aWYoIXRoaXMub3B0aW9ucy5jbG9uZSl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgY2xvbmVkTm9kZSA9IHRoaXMubWVudUVsLmNsb25lTm9kZSh0cnVlKTtcblx0Y29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblx0Ym9keS5pbnNlcnRCZWZvcmUoY2xvbmVkTm9kZSwgYm9keS5maXJzdEVsZW1lbnRDaGlsZCk7XG5cdGNsb25lZE5vZGUuY2xhc3NOYW1lID0gXCJcIjtcblx0dGhpcy5tZW51RWwgPSBjbG9uZWROb2RlO1xufVxuXG5mdW5jdGlvbiBidWlsZCgpe1xuXHRmdW5jdGlvbiBpbml0KCl7XG5cdFx0c29ydE1lbnVzLmNhbGwodGhpcyk7XG5cdFx0ZmxhdHRlbkFuZFdyYXBNZW51cy5jYWxsKHRoaXMpO1xuXHRcdGNyZWF0ZUhlYWRlcldyYXBwZXIuY2FsbCh0aGlzKTtcblx0XHRjcmVhdGVCcmVhZENydW1icy5jYWxsKHRoaXMpO1xuXHRcdGNyZWF0ZUJhY2tCdXR0b24uY2FsbCh0aGlzKTtcblx0XHRjcmVhdGVTdWJOYXZMaW5rcy5jYWxsKHRoaXMpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc29ydE1lbnVzKCl7XG5cdFx0Y29uc3Qgc2V0TGlua0RhdGEgPSBmdW5jdGlvbihlbGVtZW50KXtcblx0XHRcdGNvbnN0IGxpbmtzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWxlbWVudC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5tbC1tZW51X19sZXZlbCA+IGxpID4gYTpub3QoLm1sLW1lbnVfX2xpbmspJykpO1xuXHRcdFx0bGV0IHBvcyA9IDA7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpbmtzLmxlbmd0aDsgaSsrLCBwb3MrKykge1xuXHRcdFx0XHRpZihsaW5rc1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ21sLW1lbnVfX2xpbmsnKSl7XG5cdFx0XHRcdFx0cG9zLS07XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlua3NbaV0uY2xhc3NMaXN0LmFkZCgnbWwtbWVudV9fbGluaycpO1xuXHRcdFx0XHRsaW5rc1tpXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcG9zJywgcG9zKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBsaW5rcztcblx0XHR9O1xuXG5cdFx0bGV0IHNldE1lbnVzID0gZnVuY3Rpb24obWVudSwgcGFyZW50UG9zaXRpb25OYW1lKXtcblx0XHRcdG1lbnUuY2xhc3NOYW1lID0gXCJtbC1tZW51X19sZXZlbFwiO1xuXHRcdFx0Y29uc3QgbGlua1NpYmxpbmcgPSBtZW51LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignW2RhdGEtcG9zXScpO1xuXHRcdFx0bGV0IGN1cnJlbnRQb3NpdGlvbiA9IGxpbmtTaWJsaW5nLmdldEF0dHJpYnV0ZSgnZGF0YS1wb3MnKTtcblxuXHRcdFx0bGV0IG1lbnVOYW1lID0gXCJcIjtcblx0XHRcdGlmKHBhcmVudFBvc2l0aW9uTmFtZSl7XG5cdFx0XHRcdG1lbnVOYW1lID0gcGFyZW50UG9zaXRpb25OYW1lICsgJy0nO1xuXHRcdFx0fVxuXHRcdFx0bWVudU5hbWUgKz0gY3VycmVudFBvc2l0aW9uO1xuXG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSgnZGF0YS1tZW51JywgXCJtZW51LVwiK21lbnVOYW1lKTtcblx0XHRcdGxpbmtTaWJsaW5nLnNldEF0dHJpYnV0ZSgnZGF0YS1zdWJtZW51JywgXCJtZW51LVwiK21lbnVOYW1lKTtcblx0XHRcdGNvbnN0IG1lbnVJdGVtcyA9IHNldExpbmtEYXRhKG1lbnUpO1xuXG5cdFx0XHR0aGlzLm1lbnVzLnB1c2gobWVudSk7XG5cdFx0XHR0aGlzLm1lbnVzQXJyLnB1c2goe1xuXHRcdFx0XHRtZW51RWw6IG1lbnUsXG5cdFx0XHRcdG1lbnVJdGVtczogbWVudUl0ZW1zXG5cdFx0XHR9KTtcblxuXHRcdFx0Y29uc3Qgc3ViTWVudXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtZW51LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCgnLm1sLW1lbnVfX2xldmVsID4gbGkgPiB1bDpub3QoLm1sLW1lbnVfX2xldmVsKScpKTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3ViTWVudXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYoc3ViTWVudXNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtbC1tZW51X19sZXZlbCcpKXtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZXRNZW51cyhzdWJNZW51c1tpXSwgbWVudU5hbWUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0c2V0TWVudXMgPSBzZXRNZW51cy5iaW5kKHRoaXMpO1xuXG5cdFx0dGhpcy5tZW51cyA9IFtdO1xuXHRcdHRoaXMubWVudXNBcnIgPSBbXTtcblxuXHRcdGNvbnN0IG1haW5NZW51ID0gdGhpcy5tZW51RWwucXVlcnlTZWxlY3RvcigndWwnKTtcblx0XHRtYWluTWVudS5zZXRBdHRyaWJ1dGUoJ2RhdGEtbWVudScsICdtYWluJyk7XG5cdFx0bWFpbk1lbnUuY2xhc3NOYW1lID0gXCJtbC1tZW51X19sZXZlbCBtbC1tZW51X19sZXZlbC0tY3VycmVudFwiO1xuXHRcdGNvbnN0IG1haW5NZW51SXRlbXMgPSBzZXRMaW5rRGF0YShtYWluTWVudSk7XG5cblx0XHR0aGlzLm1lbnVzLnB1c2gobWFpbk1lbnUpO1xuXHRcdHRoaXMubWVudXNBcnIucHVzaCh7XG5cdFx0XHRtZW51RWw6IG1haW5NZW51LFxuXHRcdFx0bWVudUl0ZW1zOiBtYWluTWVudUl0ZW1zXG5cdFx0fSk7XG5cblx0XHRjb25zdCBzdWJNZW51cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1haW5NZW51LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCgnLm1sLW1lbnVfX2xldmVsID4gbGkgPiB1bCcpKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHN1Yk1lbnVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzZXRNZW51cyhzdWJNZW51c1tpXSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZmxhdHRlbkFuZFdyYXBNZW51cygpe1xuXHRcdGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHR3cmFwcGVyLmNsYXNzTmFtZSA9ICdtbC1tZW51X193cmFwJztcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWVudXNBcnIubGVuZ3RoOyBpKyspIHtcblx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5tZW51c0FycltpXS5tZW51RWwpO1xuXHRcdH1cblx0XHR0aGlzLm1lbnVXcmFwcGVyID0gd3JhcHBlcjtcblx0XHR0aGlzLm1lbnVDb250YWluZXIuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVIZWFkZXJXcmFwcGVyKCl7XG5cdFx0Y29uc3QgaGVhZGVyV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGhlYWRlcldyYXBwZXIuY2xhc3NOYW1lID0gXCJtbC1tZW51X19oZWFkZXJcIjtcblx0XHR0aGlzLm1lbnVDb250YWluZXIuaW5zZXJ0QmVmb3JlKGhlYWRlcldyYXBwZXIsIHRoaXMubWVudVdyYXBwZXIpO1xuXHRcdHRoaXMuaGVhZGVyV3JhcHBlciA9IGhlYWRlcldyYXBwZXI7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVCcmVhZENydW1icygpe1xuXHRcdGlmKHRoaXMub3B0aW9ucy5icmVhZGNydW1ic0N0cmwpe1xuXHRcdFx0dGhpcy5icmVhZGNydW1ic0N0cmwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCduYXYnKTtcblx0XHRcdHRoaXMuYnJlYWRjcnVtYnNDdHJsLmNsYXNzTmFtZSA9ICdtbC1tZW51X19icmVhZGNydW1icyc7XG5cdFx0XHR0aGlzLmhlYWRlcldyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5icmVhZGNydW1ic0N0cmwpO1xuXHRcdFx0Ly8gYWRkIGluaXRpYWwgYnJlYWRjcnVtYlxuXHRcdFx0dGhpcy5hZGRCcmVhZGNydW1iKDApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUJhY2tCdXR0b24oKXtcblx0XHRpZih0aGlzLm9wdGlvbnMuYmFja0N0cmwpe1xuXHRcdFx0dGhpcy5iYWNrQ3RybCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRcdFx0dGhpcy5iYWNrQ3RybC5jbGFzc05hbWUgPSAnbWwtbWVudV9fYWN0aW9uIG1sLW1lbnVfX2FjdGlvbi0tYmFjayBtbC1tZW51X19hY3Rpb24tLWhpZGUnO1xuXHRcdFx0dGhpcy5iYWNrQ3RybC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnR28gYmFjaycpO1xuXHRcdFx0dGhpcy5iYWNrQ3RybC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuYmFja0J1dHRvbkh0bWw7XG5cdFx0XHR0aGlzLmhlYWRlcldyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5iYWNrQ3RybCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlU3ViTmF2TGlua3MoKXtcblx0XHRjb25zdCBzdWJOYXZMaW5rcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMubWVudUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1zdWJtZW51XScpKTtcblx0XHRzdWJOYXZMaW5rcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmspe1xuXHRcdFx0Y29uc3Qgc3ViTmF2TGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHRcdHN1Yk5hdkxpbmsuY2xhc3NOYW1lID0gJ21sLW1lbnVfX2xpbmstLXN1Ym5hdic7XG5cdFx0XHRzdWJOYXZMaW5rLmhyZWYgPSAnIyc7XG5cdFx0XHRpZih0aGlzLm9wdGlvbnMuc3VibmF2TGlua0h0bWwpe1xuXHRcdFx0XHRzdWJOYXZMaW5rLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5zdWJuYXZMaW5rSHRtbDtcblx0XHRcdH1cblx0XHRcdGxpbmsucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChzdWJOYXZMaW5rKTtcblx0XHR9LmJpbmQodGhpcykpO1xuXHR9XG5cblx0aW5pdC5jYWxsKHRoaXMpO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycygpe1xuXHR0aGlzLm1lbnVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmxpbmtDbGljayk7XG5cblx0aWYodGhpcy5vcHRpb25zLmJyZWFkY3J1bWJzQ3RybCl7XG5cdFx0dGhpcy5icmVhZGNydW1ic0N0cmwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJyZWFkY3J1bWJDbGljayk7XG5cdH1cblxuXHRpZih0aGlzLm9wdGlvbnMuYmFja0N0cmwpe1xuXHRcdHRoaXMuYmFja0N0cmwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJhY2spO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCl7XG5cdHRoaXMubWVudUNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubGlua0NsaWNrKTtcblxuXHRpZih0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYnNDdHJsKXtcblx0XHR0aGlzLmJyZWFkY3J1bWJzQ3RybC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnJlYWRjcnVtYkNsaWNrKTtcblx0fVxuXG5cdGlmKHRoaXMub3B0aW9ucy5iYWNrQ3RybCl7XG5cdFx0dGhpcy5iYWNrQ3RybC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYmFjayk7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlua0NsaWNrKGV2dCl7XG5cdGlmKFxuXHRcdCFldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWwtbWVudV9fbGluaycpICYmXG5cdFx0IWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtbC1tZW51X19saW5rLS1zdWJuYXYnKVxuXHQpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IHN1Ym1lbnVUYXJnZXQgPSBldnQudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcsXG5cdFx0c3VibWVudSA9IHN1Ym1lbnVUYXJnZXQgPyBzdWJtZW51VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zdWJtZW51JykgOiAnJyxcblx0XHRpdGVtTmFtZSA9IHN1Ym1lbnVUYXJnZXQgPyBzdWJtZW51VGFyZ2V0LmlubmVySFRNTCA6IGV2dC50YXJnZXQuaW5uZXJIVE1MLFxuXHRcdHBvcyA9IHN1Ym1lbnVUYXJnZXQgPyBzdWJtZW51VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1wb3MnKSA6IGV2dC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcycpLFxuXHRcdHN1Yk1lbnVFbCA9IHRoaXMubWVudUVsLnF1ZXJ5U2VsZWN0b3IoJ3VsW2RhdGEtbWVudT1cIicgKyBzdWJtZW51ICsgJ1wiXScpO1xuXG5cdGlmKHN1Ym1lbnUgJiYgc3ViTWVudUVsKXtcblx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLm9wZW5TdWJNZW51KHN1Yk1lbnVFbCwgcG9zLCBpdGVtTmFtZSk7XG5cdH1lbHNle1xuXHRcdGNvbnN0IGN1cnJlbnRMaW5rID0gdGhpcy5tZW51RWwucXVlcnlTZWxlY3RvcignLm1sLW1lbnVfX2xpbmstLWN1cnJlbnQnKTtcblx0XHRpZihjdXJyZW50TGluayl7XG5cdFx0XHRjdXJyZW50TGluay5jbGFzc0xpc3QucmVtb3ZlKCdtbC1tZW51X19saW5rLS1jdXJyZW50Jyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY3VycmVudFVuZGVyTGlua3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLm1lbnVFbC5xdWVyeVNlbGVjdG9yQWxsKCcubWwtbWVudV9fbGluay0tY3VycmVudC11bmRlcicpKTtcblx0XHRpZihjdXJyZW50VW5kZXJMaW5rcy5sZW5ndGgpe1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50VW5kZXJMaW5rcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjdXJyZW50VW5kZXJMaW5rc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdtbC1tZW51X19saW5rLS1jdXJyZW50LXVuZGVyJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdtbC1tZW51X19saW5rLS1jdXJyZW50Jyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJyZWFkY3J1bWJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZih0aGlzLmJyZWFkY3J1bWJzW2ldLmlzRmlyc3Qpe1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYmFja2luZGV4ID0gdGhpcy5tZW51c0Fyclt0aGlzLmJyZWFkY3J1bWJzW2ldLmluZGV4XS5iYWNrSWR4O1xuXHRcdFx0Y29uc3QgbWVudUxvY2F0aW9uID0gdGhpcy5tZW51c0Fyclt0aGlzLmJyZWFkY3J1bWJzW2ldLmluZGV4XS5tZW51RWwuZ2V0QXR0cmlidXRlKCdkYXRhLW1lbnUnKTtcblx0XHRcdGNvbnN0IGxpbmsgPSB0aGlzLm1lbnVzQXJyW2JhY2tpbmRleF0ubWVudUVsLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXN1Ym1lbnU9JyttZW51TG9jYXRpb24rJ10nKTtcblx0XHRcdGxpbmsuY2xhc3NMaXN0LmFkZCgnbWwtbWVudV9fbGluay0tY3VycmVudC11bmRlcicpO1xuXHRcdH1cblxuXHRcdGlmKHRoaXMub3B0aW9ucy5vbkl0ZW1DbGljayl7XG5cdFx0XHR0aGlzLm9wdGlvbnMub25JdGVtQ2xpY2soZXZ0LCBpdGVtTmFtZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGJhY2soKXtcblx0aWYodGhpcy5pc0JhY2tBbmltYXRpbmcpe1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHR0aGlzLmlzQmFja0FuaW1hdGluZyA9IHRydWU7XG5cdC8vIGN1cnJlbnQgbWVudSBzbGlkZXMgb3V0XG5cdHRoaXMubWVudU91dCgpO1xuXHQvLyBuZXh0IG1lbnUgKHByZXZpb3VzIG1lbnUpIHNsaWRlcyBpblxuXHRjb25zdCBiYWNrTWVudSA9IHRoaXMubWVudXNBcnJbdGhpcy5tZW51c0Fyclt0aGlzLmN1cnJlbnRdLmJhY2tJZHhdLm1lbnVFbDtcblx0dGhpcy5tZW51SW4oYmFja01lbnUpO1xuXG5cdC8vIHJlbW92ZSBsYXN0IGJyZWFkY3J1bWJcblx0aWYodGhpcy5vcHRpb25zLmJyZWFkY3J1bWJzQ3RybCl7XG5cdFx0dGhpcy5yZW1vdmVCcmVhZGNydW1icygpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG9wZW5TdWJNZW51KHN1Yk1lbnVFbCwgY2xpY2tQb3NpdGlvbiwgc3ViTWVudU5hbWUpe1xuXHRpZih0aGlzLmlzQW5pbWF0aW5nKXtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dGhpcy5pc0FuaW1hdGluZyA9IHRydWU7XG5cblx0Ly8gc2F2ZSBcInBhcmVudFwiIG1lbnUgaW5kZXggZm9yIGJhY2sgbmF2aWdhdGlvblxuXHR0aGlzLm1lbnVzQXJyW3RoaXMubWVudXMuaW5kZXhPZihzdWJNZW51RWwpXS5iYWNrSWR4ID0gdGhpcy5jdXJyZW50O1xuXHQvLyBzYXZlIFwicGFyZW50XCIgbWVudcK0cyBuYW1lXG5cdHRoaXMubWVudXNBcnJbdGhpcy5tZW51cy5pbmRleE9mKHN1Yk1lbnVFbCldLm5hbWUgPSBzdWJNZW51TmFtZTtcblx0Ly8gY3VycmVudCBtZW51IHNsaWRlcyBvdXRcblx0dGhpcy5tZW51T3V0KGNsaWNrUG9zaXRpb24pO1xuXHQvLyBuZXh0IG1lbnUgKHN1Ym1lbnUpIHNsaWRlcyBpblxuXHR0aGlzLm1lbnVJbihzdWJNZW51RWwsIGNsaWNrUG9zaXRpb24pO1xufVxuXG5mdW5jdGlvbiBicmVhZGNydW1iQ2xpY2soZXZ0KXtcblx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cblx0Y29uc3QgYnJlYWRjcnVtYiA9IGV2dC50YXJnZXQ7XG5cdGNvbnN0IGluZGV4ID0gYnJlYWRjcnVtYi5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKTtcblx0aWYoIWluZGV4KXtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Ly8gZG8gbm90aGluZyBpZiB0aGlzIGJyZWFkY3J1bWIgaXMgdGhlIGxhc3Qgb25lIGluIHRoZSBsaXN0IG9mIGJyZWFkY3J1bWJzXG5cdGlmKCFicmVhZGNydW1iLm5leHRTaWJsaW5nIHx8IHRoaXMuaXNBbmltYXRpbmcpe1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHR0aGlzLmlzQW5pbWF0aW5nID0gdHJ1ZTtcblxuXHQvLyBjdXJyZW50IG1lbnUgc2xpZGVzIG91dFxuXHR0aGlzLm1lbnVPdXQoKTtcblx0Ly8gbmV4dCBtZW51IHNsaWRlcyBpblxuXHRjb25zdCBuZXh0TWVudSA9IHRoaXMubWVudXNBcnJbaW5kZXhdLm1lbnVFbDtcblx0dGhpcy5tZW51SW4obmV4dE1lbnUpO1xuXG5cdC8vIHJlbW92ZSBicmVhZGNydW1icyB0aGF0IGFyZSBhaGVhZFxuXHRjb25zdCBpbmRleE9mU2libGluZ05vZGUgPSB0aGlzLmJyZWFkY3J1bWJzLmluZGV4T2YoYnJlYWRjcnVtYikgKyAxO1xuXHRpZih+aW5kZXhPZlNpYmxpbmdOb2RlKXtcblx0XHR0aGlzLnJlbW92ZUJyZWFkY3J1bWJzKGluZGV4T2ZTaWJsaW5nTm9kZSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gbWVudU91dChjbGlja1Bvc2l0aW9uKXtcblx0Y29uc3QgY3VycmVudE1lbnUgPSB0aGlzLm1lbnVzQXJyW3RoaXMuY3VycmVudF0ubWVudUVsLFxuXHRcdGlzQmFja05hdmlnYXRpb24gPSB0eXBlb2YgY2xpY2tQb3NpdGlvbiA9PT0gXCJ1bmRlZmluZWRcIiA/IHRydWUgOiBmYWxzZSxcblx0XHRtZW51SXRlbXMgPSB0aGlzLm1lbnVzQXJyW3RoaXMuY3VycmVudF0ubWVudUl0ZW1zLFxuXHRcdG1lbnVJdGVtc1RvdGFsID0gbWVudUl0ZW1zLmxlbmd0aCxcblx0XHRmYXJ0aGVzdElkeCA9IGNsaWNrUG9zaXRpb24gPD0gbWVudUl0ZW1zVG90YWwvMiB8fCBpc0JhY2tOYXZpZ2F0aW9uID8gbWVudUl0ZW1zVG90YWwgLSAxIDogMDtcblxuXHRtZW51SXRlbXMuZm9yRWFjaChmdW5jdGlvbihsaW5rLCBwb3MpIHtcblx0XHRsZXQgaXRlbVBvcyA9IGxpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcycpO1xuXHRcdGxldCBpdGVtID0gbGluay5wYXJlbnROb2RlO1xuXHRcdGl0ZW0uc3R5bGUuV2Via2l0QW5pbWF0aW9uRGVsYXkgPSBpdGVtLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gaXNCYWNrTmF2aWdhdGlvbiA/IHBhcnNlSW50KGl0ZW1Qb3MgKiB0aGlzLm9wdGlvbnMuaXRlbXNEZWxheUludGVydmFsKSArICdtcycgOiBwYXJzZUludChNYXRoLmFicyhjbGlja1Bvc2l0aW9uIC0gaXRlbVBvcykgKiB0aGlzLm9wdGlvbnMuaXRlbXNEZWxheUludGVydmFsKSArICdtcyc7XG5cdH0uYmluZCh0aGlzKSk7XG5cblx0b25FbmRBbmltYXRpb24obWVudUl0ZW1zW2ZhcnRoZXN0SWR4XS5wYXJlbnROb2RlLCBmdW5jdGlvbigpe1xuXHRcdHRoaXMuaXNCYWNrQW5pbWF0aW5nID0gZmFsc2U7XG5cdH0uYmluZCh0aGlzKSk7XG5cblx0Y3VycmVudE1lbnUuY2xhc3NMaXN0LmFkZCghKCFpc0JhY2tOYXZpZ2F0aW9uIF4gIXRoaXMub3B0aW9ucy5pc1JpZ2h0KSA/ICdhbmltYXRlLW91dFRvUmlnaHQnIDogJ2FuaW1hdGUtb3V0VG9MZWZ0Jyk7XG59XG5cbmZ1bmN0aW9uIG1lbnVJbihuZXh0TWVudUVsLCBjbGlja1Bvc2l0aW9uKXtcblx0Ly8gdGhlIGN1cnJlbnQgbWVudVxuXHRjb25zdCBjdXJyZW50TWVudSA9IHRoaXMubWVudXNBcnJbdGhpcy5jdXJyZW50XS5tZW51RWwsXG5cdFx0aXNCYWNrTmF2aWdhdGlvbiA9IHR5cGVvZiBjbGlja1Bvc2l0aW9uID09PSAndW5kZWZpbmVkJyA/IHRydWUgOiBmYWxzZSxcblx0XHQvLyBpbmRleCBvZiB0aGUgbmV4dE1lbnVFbFxuXHRcdG5leHRNZW51SWR4ID0gdGhpcy5tZW51cy5pbmRleE9mKG5leHRNZW51RWwpLFxuXG5cdFx0bmV4dE1lbnVJdGVtcyA9IHRoaXMubWVudXNBcnJbbmV4dE1lbnVJZHhdLm1lbnVJdGVtcyxcblx0XHRuZXh0TWVudUl0ZW1zVG90YWwgPSBuZXh0TWVudUl0ZW1zLmxlbmd0aCxcblxuXHRcdC8vIHdlIG5lZWQgdG8gcmVzZXQgdGhlIGNsYXNzZXMgb25jZSB0aGUgbGFzdCBpdGVtIGFuaW1hdGVzIGluXG5cdFx0Ly8gdGhlIFwibGFzdCBpdGVtXCIgaXMgdGhlIGZhcnRoZXN0IGZyb20gdGhlIGNsaWNrZWQgaXRlbVxuXHRcdC8vIGxldCdzIGNhbGN1bGF0ZSB0aGUgaW5kZXggb2YgdGhlIGZhcnRoZXN0IGl0ZW1cblx0XHRmYXJ0aGVzdElkeCA9IGNsaWNrUG9zaXRpb24gPD0gbmV4dE1lbnVJdGVtc1RvdGFsLzIgfHwgaXNCYWNrTmF2aWdhdGlvbiA/IG5leHRNZW51SXRlbXNUb3RhbCAtIDEgOiAwO1xuXG5cdC8vIHNsaWRlIGluIG5leHQgbWVudSBpdGVtcyAtIGZpcnN0LCBzZXQgdGhlIGRlbGF5cyBmb3IgdGhlIGl0ZW1zXG5cdG5leHRNZW51SXRlbXMuZm9yRWFjaChmdW5jdGlvbihsaW5rLCBwb3MpIHtcblx0XHRsZXQgaXRlbVBvcyA9IGxpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcycpO1xuXHRcdGxldCBpdGVtID0gbGluay5wYXJlbnROb2RlO1xuXHRcdGl0ZW0uc3R5bGUuV2Via2l0QW5pbWF0aW9uRGVsYXkgPSBpdGVtLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gaXNCYWNrTmF2aWdhdGlvbiA/IHBhcnNlSW50KGl0ZW1Qb3MgKiB0aGlzLm9wdGlvbnMuaXRlbXNEZWxheUludGVydmFsKSArICdtcycgOiBwYXJzZUludChNYXRoLmFicyhjbGlja1Bvc2l0aW9uIC0gaXRlbVBvcykgKiB0aGlzLm9wdGlvbnMuaXRlbXNEZWxheUludGVydmFsKSArICdtcyc7XG5cdH0uYmluZCh0aGlzKSk7XG5cblx0aWYoIWlzQmFja05hdmlnYXRpb24pe1xuXHRcdC8vIGFkZCBicmVhZGNydW1iXG5cdFx0dGhpcy5hZGRCcmVhZGNydW1iKG5leHRNZW51SWR4KTtcblx0fVxuXG5cdG9uRW5kQW5pbWF0aW9uKG5leHRNZW51SXRlbXNbZmFydGhlc3RJZHhdLnBhcmVudE5vZGUsIGZ1bmN0aW9uKCl7XG5cdFx0Y3VycmVudE1lbnUuY2xhc3NMaXN0LnJlbW92ZSghKCFpc0JhY2tOYXZpZ2F0aW9uIF4gIXRoaXMub3B0aW9ucy5pc1JpZ2h0KSA/ICdhbmltYXRlLW91dFRvUmlnaHQnIDogJ2FuaW1hdGUtb3V0VG9MZWZ0Jyk7XG5cdFx0Y3VycmVudE1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnbWwtbWVudV9fbGV2ZWwtLWN1cnJlbnQnKTtcblx0XHRuZXh0TWVudUVsLmNsYXNzTGlzdC5yZW1vdmUoISghaXNCYWNrTmF2aWdhdGlvbiBeICF0aGlzLm9wdGlvbnMuaXNSaWdodCkgPyAnYW5pbWF0ZS1pbkZyb21MZWZ0JyA6ICdhbmltYXRlLWluRnJvbVJpZ2h0Jyk7XG5cdFx0bmV4dE1lbnVFbC5jbGFzc0xpc3QuYWRkKCdtbC1tZW51X19sZXZlbC0tY3VycmVudCcpO1xuXG5cdFx0Ly9yZXNldCBjdXJyZW50XG5cdFx0dGhpcy5jdXJyZW50ID0gbmV4dE1lbnVJZHg7XG5cblx0XHQvLyBjb250cm9sIGJhY2sgYnV0dG9uIGFuZCBicmVhZGNydW1icyBuYXZpZ2F0aW9uIGVsZW1lbnRzXG5cdFx0aWYoIWlzQmFja05hdmlnYXRpb24pe1xuXHRcdFx0Ly8gc2hvdyBiYWNrIGJ1dHRvblxuXHRcdFx0aWYodGhpcy5vcHRpb25zLmJhY2tDdHJsKXtcblx0XHRcdFx0dGhpcy5iYWNrQ3RybC5jbGFzc0xpc3QucmVtb3ZlKCdtbC1tZW51X19hY3Rpb24tLWhpZGUnKTtcblx0XHRcdH1cblx0XHR9ZWxzZSBpZih0aGlzLmN1cnJlbnQgPT09IDAgJiYgdGhpcy5vcHRpb25zLmJhY2tDdHJsKXtcblx0XHRcdC8vIGhpZGUgYmFjayBidXR0b25cblx0XHRcdHRoaXMuYmFja0N0cmwuY2xhc3NMaXN0LmFkZCgnbWwtbWVudV9fYWN0aW9uLS1oaWRlJyk7XG5cdFx0fVxuXG5cdFx0Ly8gd2UgY2FuIG5hdmlnYXRlIGFnYWluLi5cblx0XHR0aGlzLmlzQW5pbWF0aW5nID0gZmFsc2U7XG5cdH0uYmluZCh0aGlzKSk7XG5cblx0Ly8gYW5pbWF0aW9uIGNsYXNzXG5cdG5leHRNZW51RWwuY2xhc3NMaXN0LmFkZCghKCFpc0JhY2tOYXZpZ2F0aW9uIF4gIXRoaXMub3B0aW9ucy5pc1JpZ2h0KSA/ICdhbmltYXRlLWluRnJvbUxlZnQnIDogJ2FuaW1hdGUtaW5Gcm9tUmlnaHQnKVxufVxuXG5mdW5jdGlvbiBhZGRCcmVhZGNydW1iKGluZGV4KXtcblx0aWYoIXRoaXMub3B0aW9ucy5icmVhZGNydW1ic0N0cmwpe1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGNvbnN0IGJjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRsZXQgYnJlYWRjcnVtYk5hbWUgPSBpbmRleCA/IHRoaXMubWVudXNBcnJbaW5kZXhdLm5hbWUgOiB0aGlzLm9wdGlvbnMuaW5pdGlhbEJyZWFkY3J1bWI7XG5cdGlmKGJyZWFkY3J1bWJOYW1lLmxlbmd0aCA+IHRoaXMub3B0aW9ucy5icmVhZGNydW1iTWF4TGVuZ3RoKXtcblx0XHRicmVhZGNydW1iTmFtZSA9IGJyZWFkY3J1bWJOYW1lLnN1YnN0cmluZygwLCB0aGlzLm9wdGlvbnMuYnJlYWRjcnVtYk1heExlbmd0aCkudHJpbSgpKycuLi4nO1xuXHR9XG5cdGJjLmlubmVySFRNTCA9IGJyZWFkY3J1bWJOYW1lO1xuXHRiYy5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpbmRleCk7XG5cdGNvbnN0IHNwYWNlciA9IHRoaXMuYnJlYWRjcnVtYlNwYWNlci5jbG9uZU5vZGUodHJ1ZSk7XG5cblx0Y29uc3QgYnJlYWRjcnVtYiA9IHtcblx0XHRiY0VsOiBiYyxcblx0XHRzcGFjZXI6IHNwYWNlcixcblx0XHRpbjogdHJ1ZSxcblx0XHRvdXQ6IGZhbHNlLFxuXHRcdGlzRmlyc3Q6ICFpbmRleCxcblx0XHRpbmRleDogaW5kZXgsXG5cdFx0c2V0YW5pbUNsYXNzZXM6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZih0aGlzLmluKXtcblx0XHRcdFx0dGhpcy5iY0VsLmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUtaW4nKTtcblx0XHRcdFx0dGhpcy5zcGFjZXIuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZS1pbicpO1xuXHRcdFx0fWVsc2UgaWYodGhpcy5vdXQpe1xuXHRcdFx0XHR0aGlzLmJjRWwuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZS1vdXQnKTtcblx0XHRcdFx0dGhpcy5zcGFjZXIuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZS1vdXQnKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dGhpcy5icmVhZGNydW1icy5wdXNoKGJyZWFkY3J1bWIpO1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXJCcmVhZENydW1icyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUJyZWFkY3J1bWJzKGluZGV4KXtcblx0aWYoaW5kZXggIT0gdW5kZWZpbmVkKXtcblx0XHRsZXQgZGVsYXkgPSAwO1xuXHRcdGNvbnN0IGRlbGF5SW50ZXJ2YWwgPSAwLjA1O1xuXHRcdGZvciAobGV0IGkgPSB0aGlzLmJyZWFkY3J1bWJzLmxlbmd0aCAtIDE7IGkgPj0gaW5kZXg7IGktLSkge1xuXHRcdFx0aWYodGhpcy5icmVhZGNydW1ic1tpXS5pc0ZpcnN0KXtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmJyZWFkY3J1bWJzW2ldLm91dCA9IHRydWU7XG5cdFx0XHR0aGlzLmJyZWFkY3J1bWJzW2ldLmJjRWwuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBkZWxheStcInNcIjtcblx0XHRcdGRlbGF5ICs9IGRlbGF5SW50ZXJ2YWw7XG5cdFx0XHR0aGlzLmJyZWFkY3J1bWJzW2ldLnNwYWNlci5zdHlsZS5hbmltYXRpb25EZWxheSA9IGRlbGF5K1wic1wiO1xuXHRcdFx0ZGVsYXkgKz0gZGVsYXlJbnRlcnZhbDtcblx0XHR9XG5cdH1lbHNle1xuXHRcdHRoaXMuYnJlYWRjcnVtYnNbdGhpcy5icmVhZGNydW1icy5sZW5ndGggLTFdLm91dCA9IHRydWU7XG5cdH1cblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyQnJlYWRDcnVtYnMpO1xufVxuXG5mdW5jdGlvbiBicmVhZGNydW1ic0FmdGVyUmVuZGVyKCl7XG5cdGNvbnN0IGJyZWFkY3J1bWJzSW4gPSB0aGlzLmJyZWFkY3J1bWJzLmZpbHRlcihmdW5jdGlvbihlbCl7XG5cdFx0cmV0dXJuIGVsLmluO1xuXHR9KTtcblxuXHRpZihicmVhZGNydW1ic0luLmxlbmd0aCl7XG5cdFx0b25FbmRBbmltYXRpb24oYnJlYWRjcnVtYnNJblticmVhZGNydW1ic0luLmxlbmd0aCAtIDFdLmJjRWwsIGZ1bmN0aW9uKCl7XG5cdFx0XHRicmVhZGNydW1ic0luLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRlbC5pbiA9IGZhbHNlO1xuXHRcdFx0XHRlbC5iY0VsLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUtaW4nKTtcblx0XHRcdFx0ZWwuc3BhY2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUtaW4nKTtcblx0XHRcdH0pO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdH1cblxuXHRjb25zdCBicmVhZGNydW1ic091dCA9IHRoaXMuYnJlYWRjcnVtYnMuZmlsdGVyKGZ1bmN0aW9uKGVsKXtcblx0XHRyZXR1cm4gZWwub3V0O1xuXHR9KTtcblxuXHRpZihicmVhZGNydW1ic091dC5sZW5ndGgpe1xuXHRcdG9uRW5kQW5pbWF0aW9uKGJyZWFkY3J1bWJzT3V0W2JyZWFkY3J1bWJzT3V0Lmxlbmd0aC0xXS5iY0VsLCBmdW5jdGlvbigpe1xuXHRcdFx0YnJlYWRjcnVtYnNPdXQuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHRcdGVsLmJjRWwucmVtb3ZlKCk7XG5cdFx0XHRcdGVsLnNwYWNlci5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cblx0XHR0aGlzLmJyZWFkY3J1bWJzID0gdGhpcy5icmVhZGNydW1icy5maWx0ZXIoZnVuY3Rpb24oZWwpe1xuXHRcdFx0cmV0dXJuICFlbC5vdXQ7XG5cdFx0fSk7XG5cdH1cblxufVxuXG5mdW5jdGlvbiByZW5kZXJCcmVhZENydW1icygpe1xuXHR0aGlzLmJyZWFkY3J1bWJzQ3RybC5pbm5lckhUTUwgPSBcIlwiO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnJlYWRjcnVtYnMubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLmJyZWFkY3J1bWJzW2ldLnNldGFuaW1DbGFzc2VzKCk7XG5cdFx0aWYoIXRoaXMuYnJlYWRjcnVtYnNbaV0uaXNGaXJzdCl7XG5cdFx0XHR0aGlzLmJyZWFkY3J1bWJzQ3RybC5hcHBlbmRDaGlsZCh0aGlzLmJyZWFkY3J1bWJzW2ldLnNwYWNlcik7XG5cdFx0fVxuXHRcdHRoaXMuYnJlYWRjcnVtYnNDdHJsLmFwcGVuZENoaWxkKHRoaXMuYnJlYWRjcnVtYnNbaV0uYmNFbCk7XG5cdH1cblxuXHRicmVhZGNydW1ic0FmdGVyUmVuZGVyLmNhbGwodGhpcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZU1sTWVudTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEZvbnRGYWNlT2JzZXJ2ZXIgZnJvbSBcIi4vLi4vLi4vdmVuZG9yL2ZvbnRmYWNlb2JzZXJ2ZXJcIjtcblxubGV0IGh0bWwsXG5cdHN1YkZvbnRzLFxuXHRmdWxsRm9udHMsXG5cdHN1YkZvbnRDbGFzcyxcblx0ZnVsbEZvbnRDbGFzcztcblxuZnVuY3Rpb24gaW5pdChvcHRpb25zKXtcblx0aWYoIW9wdGlvbnMpe1xuXHRcdG9wdGlvbnMgPSB7fTtcblx0fVxuXG5cdHN1YkZvbnRzID0gb3B0aW9ucy5zdWJGb250cyB8fCBbXTtcblx0ZnVsbEZvbnRzID0gb3B0aW9ucy5mdWxsRm9udHMgfHwgW107XG5cblx0aHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblx0c3ViRm9udENsYXNzID0gb3B0aW9ucy5zdWJGb250Q2xhc3MgfHwgXCJzdWJmb250LWxvYWRlZFwiO1xuXHRmdWxsRm9udENsYXNzID0gb3B0aW9ucy5zdWJGb250Q2xhc3MgfHwgXCJmb250LWxvYWRlZFwiO1xuXG5cdGlmKHN1YkZvbnRzLmxlbmd0aCB8fCBmdWxsRm9udENsYXNzLmxlbmd0aCl7XG5cdFx0cnVuRm9udExvYWRpbmcoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBydW5Gb250TG9hZGluZygpe1xuXHRpZiAoc2Vzc2lvblN0b3JhZ2UuZnVsbEZvbnRMb2FkZWQpIHtcblx0XHRodG1sLmNsYXNzTGlzdC5hZGQoZnVsbEZvbnRDbGFzcyk7XG5cdH1lbHNlIGlmKHNlc3Npb25TdG9yYWdlLnN1YkZvbnRMb2FkZWQpe1xuXHRcdGh0bWwuY2xhc3NMaXN0LmFkZChzdWJGb250Q2xhc3MpO1xuXHRcdGxvYWRGdWxsU2V0cygpO1xuXHR9ZWxzZXtcblx0XHRsb2FkU3Vic2V0cygpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxvYWRTdWJzZXRzKCl7XG5cdGlmKCFzdWJGb250cy5sZW5ndGgpe1xuXHRcdGxvYWRGdWxsU2V0cygpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGZvbnRzID0gW107XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc3ViRm9udHMubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgb3B0aW9ucyA9IHN1YkZvbnRzW2ldLm9wdGlvbiB8fCB7fTtcblx0XHRsZXQgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKHN1YkZvbnRzW2ldLm5hbWUsIG9wdGlvbnMpO1xuXHRcdGZvbnRzLnB1c2goZm9udC5sb2FkKCkpO1xuXHR9XG5cblx0UHJvbWlzZS5hbGwoZm9udHMpXG5cdC50aGVuKFxuXHRcdGZ1bmN0aW9uKCl7XG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zdWJGb250TG9hZGVkID0gdHJ1ZTtcblx0XHRcdGh0bWwuY2xhc3NMaXN0LmFkZChzdWJGb250Q2xhc3MpO1xuXHRcdFx0bG9hZEZ1bGxTZXRzKCk7XG5cdFx0fVxuXHQpXG5cdC5jYXRjaChmYWlsZWRUb0xvYWRTdWIpO1xufVxuXG5mdW5jdGlvbiBsb2FkRnVsbFNldHMoKXtcblx0Ly8gZm9yIGxhcmdlIGZvbnRzIHB1c2ggYSB0aW1lciAobG9vayBhdCB0aW1lciBmdW5jdGlvbiBiZWxvdykgdG8gbGV0IHRoZXNlIGxhcmdlIGZvbnQgbW9yZSB0aW1lIHRvIGxvYWRcblx0aWYoIWZ1bGxGb250cy5sZW5ndGgpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGZvbnRzID0gW107XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZnVsbEZvbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IG9wdGlvbnMgPSBmdWxsRm9udHNbaV0ub3B0aW9uIHx8IHt9O1xuXHRcdGxldCBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZnVsbEZvbnRzW2ldLm5hbWUsIG9wdGlvbnMpO1xuXHRcdGZvbnRzLnB1c2goZm9udC5sb2FkKCkpO1xuXHR9XG5cblx0UHJvbWlzZS5hbGwoZm9udHMpXG5cdC50aGVuKFxuXHRcdGZ1bmN0aW9uKCl7XG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5mdWxsRm9udExvYWRlZCA9IHRydWU7XG5cdFx0XHRodG1sLmNsYXNzTGlzdC5yZW1vdmUoc3ViRm9udENsYXNzKTtcblx0XHRcdGh0bWwuY2xhc3NMaXN0LmFkZChmdWxsRm9udENsYXNzKTtcblx0XHR9XG5cdClcblx0LmNhdGNoKGZhaWxlZFRvTG9hZEZ1bGwpO1xufVxuXG5mdW5jdGlvbiB0aW1lcih0aW1lKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0c2V0VGltZW91dChyZWplY3QsIHRpbWUpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gZmFpbGVkVG9Mb2FkU3ViKCl7XG5cdGh0bWwuY2xhc3NMaXN0LnJlbW92ZShzdWJGb250Q2xhc3MpO1xuXHRzZXNzaW9uU3RvcmFnZS5zdWJGb250TG9hZGVkID0gZmFsc2U7XG5cdGNvbnNvbGUuZXJyb3IoJ3N1Yi1zZXR0ZWQgZm9udCBmYWlsZWQgdG8gbG9hZCEnKTtcbn1cblxuZnVuY3Rpb24gZmFpbGVkVG9Mb2FkRnVsbCgpe1xuXHRodG1sLmNsYXNzTGlzdC5yZW1vdmUoZnVsbEZvbnRDbGFzcyk7XG5cdHNlc3Npb25TdG9yYWdlLmZ1bGxGb250TG9hZGVkID0gZmFsc2U7XG5cdGNvbnNvbGUuZXJyb3IoJ2Z1bGwtc2V0dGVkIGZvbnQgZmFpbGVkIHRvIGxvYWQhJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXQ7XG4iLCJpbXBvcnQgcHJvbWlzZVBvbHkgZnJvbSBcIi4uLy4uL3ZlbmRvci9lczYtcHJvbWlzZVwiO1xuaW1wb3J0IGZldGNoUG9seSBmcm9tIFwiLi4vLi4vdmVuZG9yL2ZldGNoXCI7XG5cbid1c2Ugc3RyaWN0JztcblxuLy8gbWF0Y2hlcyBwb2x5ZmlsbFxud2luZG93LkVsZW1lbnQgJiYgZnVuY3Rpb24oRWxlbWVudFByb3RvdHlwZSkge1xuXHRFbGVtZW50UHJvdG90eXBlLm1hdGNoZXMgPSBFbGVtZW50UHJvdG90eXBlLm1hdGNoZXMgfHxcblx0RWxlbWVudFByb3RvdHlwZS5tYXRjaGVzU2VsZWN0b3IgfHxcblx0RWxlbWVudFByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcblx0RWxlbWVudFByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fFxuXHRmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHZhciBub2RlID0gdGhpcywgbm9kZXMgPSAobm9kZS5wYXJlbnROb2RlIHx8IG5vZGUuZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLCBpID0gLTE7XG5cdFx0d2hpbGUgKG5vZGVzWysraV0gJiYgbm9kZXNbaV0gIT0gbm9kZSk7XG5cdFx0cmV0dXJuICEhbm9kZXNbaV07XG5cdH1cbn0oRWxlbWVudC5wcm90b3R5cGUpO1xuXG4vLyBjbG9zZXN0IHBvbHlmaWxsXG53aW5kb3cuRWxlbWVudCAmJiBmdW5jdGlvbihFbGVtZW50UHJvdG90eXBlKSB7XG5cdEVsZW1lbnRQcm90b3R5cGUuY2xvc2VzdCA9IEVsZW1lbnRQcm90b3R5cGUuY2xvc2VzdCB8fFxuXHRmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHZhciBlbCA9IHRoaXM7XG5cdFx0d2hpbGUgKGVsLm1hdGNoZXMgJiYgIWVsLm1hdGNoZXMoc2VsZWN0b3IpKSBlbCA9IGVsLnBhcmVudE5vZGU7XG5cdFx0cmV0dXJuIGVsLm1hdGNoZXMgPyBlbCA6IG51bGw7XG5cdH1cbn0oRWxlbWVudC5wcm90b3R5cGUpO1xuXG5cbnByb21pc2VQb2x5LnBvbHlmaWxsKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgYW5pbWF0aW9uRW5kRXZlbnROYW1lID0gWydhbmltYXRpb25lbmQnLCAnd2Via2l0QW5pbWF0aW9uRW5kJywgJ01TQW5pbWF0aW9uRW5kJywgJ29BbmltYXRpb25FbmQnXTtcblxuZnVuY3Rpb24gb25FbmRBbmltYXRpb24oZWwsIGNhbGxiYWNrKXtcblx0Y29uc3Qgb25FbmRDYWxsYmFja0ZuID0gZnVuY3Rpb24oZXZ0KXtcblx0XHRpZihldnQudGFyZ2V0ICE9PSB0aGlzKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhbmltYXRpb25FbmRFdmVudE5hbWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmRFdmVudE5hbWVbaV0sIG9uRW5kQ2FsbGJhY2tGbik7XG5cdFx0fVxuXHRcdGlmKGNhbGxiYWNrICYmIHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRjYWxsYmFjay5jYWxsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdGlmKCFlbCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhbmltYXRpb25FbmRFdmVudE5hbWUubGVuZ3RoOyBpKyspIHtcblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZEV2ZW50TmFtZVtpXSwgb25FbmRDYWxsYmFja0ZuKTtcblx0fVxufVxuXG5mdW5jdGlvbiBleHRlbmQoKXtcblx0Y29uc3Qgb2JqZWN0cyA9IGFyZ3VtZW50cztcblx0aWYob2JqZWN0cy5sZW5ndGggPCAyKXtcblx0XHRyZXR1cm4gb2JqZWN0c1swXTtcblx0fVxuXHRjb25zdCBjb21iaW5lZE9iamVjdCA9IG9iamVjdHNbMF07XG5cblx0Zm9yKGxldCBpID0gMTsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspe1xuXHRcdGlmKCFvYmplY3RzW2ldKXtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRmb3IobGV0IGtleSBpbiBvYmplY3RzW2ldKXtcblx0XHRcdGNvbWJpbmVkT2JqZWN0W2tleV0gPSBvYmplY3RzW2ldW2tleV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGNvbWJpbmVkT2JqZWN0O1xufVxuXG5cbmV4cG9ydCB7b25FbmRBbmltYXRpb24sIGV4dGVuZH07XG4iLCIvKiFcclxuICogQG92ZXJ2aWV3IGVzNi1wcm9taXNlIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxyXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9ycyAoQ29udmVyc2lvbiB0byBFUzYgQVBJIGJ5IEpha2UgQXJjaGliYWxkKVxyXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXHJcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9qYWtlYXJjaGliYWxkL2VzNi1wcm9taXNlL21hc3Rlci9MSUNFTlNFXHJcbiAqIEB2ZXJzaW9uICAgMy4yLjIrMzlhYTI1NzFcclxuICovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkb2JqZWN0T3JGdW5jdGlvbih4KSB7XHJcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyB8fCAodHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbih4KSB7XHJcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzTWF5YmVUaGVuYWJsZSh4KSB7XHJcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHV0aWxzJCRfaXNBcnJheTtcclxuICAgIGlmICghQXJyYXkuaXNBcnJheSkge1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkdXRpbHMkJF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJHV0aWxzJCRfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNBcnJheSA9IGxpYiRlczYkcHJvbWlzZSR1dGlscyQkX2lzQXJyYXk7XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiA9IDA7XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJHZlcnR4TmV4dDtcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkY3VzdG9tU2NoZWR1bGVyRm47XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuXSA9IGNhbGxiYWNrO1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiArIDFdID0gYXJnO1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuICs9IDI7XHJcbiAgICAgIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuID09PSAyKSB7XHJcbiAgICAgICAgLy8gSWYgbGVuIGlzIDIsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxyXG4gICAgICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XHJcbiAgICAgICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxyXG4gICAgICAgIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkY3VzdG9tU2NoZWR1bGVyRm4pIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbihsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzZXRTY2hlZHVsZXIoc2NoZWR1bGVGbikge1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkY3VzdG9tU2NoZWR1bGVyRm4gPSBzY2hlZHVsZUZuO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzZXRBc2FwKGFzYXBGbikge1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcCA9IGFzYXBGbjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJXaW5kb3cgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDogdW5kZWZpbmVkO1xyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyR2xvYmFsID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJXaW5kb3cgfHwge307XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRpc05vZGUgPSB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcclxuXHJcbiAgICAvLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XHJcblxyXG4gICAgLy8gbm9kZVxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU5leHRUaWNrKCkge1xyXG4gICAgICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcclxuICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWpvanMvd2hlbi9pc3N1ZXMvNDEwIGZvciBkZXRhaWxzXHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdmVydHhcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VWZXJ0eFRpbWVyKCkge1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHZlcnR4TmV4dChsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xyXG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XHJcbiAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBsaWIkZXM2JHByb21pc2UkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIobGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKTtcclxuICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XHJcbiAgICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gd2ViIHdvcmtlclxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU1lc3NhZ2VDaGFubmVsKCkge1xyXG4gICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xyXG4gICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaDtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VTZXRUaW1lb3V0KCkge1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gsIDEpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2goKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbjsgaSs9Mikge1xyXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtpXTtcclxuICAgICAgICB2YXIgYXJnID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2krMV07XHJcblxyXG4gICAgICAgIGNhbGxiYWNrKGFyZyk7XHJcblxyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbaSsxXSA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJGF0dGVtcHRWZXJ0eCgpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICB2YXIgciA9IHJlcXVpcmU7XHJcbiAgICAgICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcclxuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVZlcnR4VGltZXIoKTtcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgcmV0dXJuIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VTZXRUaW1lb3V0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2g7XHJcbiAgICAvLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxyXG4gICAgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRpc05vZGUpIHtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTmV4dFRpY2soKTtcclxuICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcclxuICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGlzV29ya2VyKSB7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU1lc3NhZ2VDaGFubmVsKCk7XHJcbiAgICB9IGVsc2UgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyV2luZG93ID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXR0ZW1wdFZlcnR4KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VTZXRUaW1lb3V0KCk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkdGhlbiQkdGhlbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xyXG4gICAgICB2YXIgcGFyZW50ID0gdGhpcztcclxuXHJcbiAgICAgIHZhciBjaGlsZCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xyXG5cclxuICAgICAgaWYgKGNoaWxkW2xpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBST01JU0VfSURdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRtYWtlUHJvbWlzZShjaGlsZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBzdGF0ZSA9IHBhcmVudC5fc3RhdGU7XHJcblxyXG4gICAgICBpZiAoc3RhdGUpIHtcclxuICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbc3RhdGUgLSAxXTtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcGFyZW50Ll9yZXN1bHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjaGlsZDtcclxuICAgIH1cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkdGhlbiQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSR0aGVuJCR0aGVuO1xyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkcmVzb2x2ZShvYmplY3QpIHtcclxuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cclxuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcclxuXHJcbiAgICAgIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xyXG4gICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XHJcbiAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlO1xyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBST01JU0VfSUQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMTYpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3AoKSB7fVxyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HICAgPSB2b2lkIDA7XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEID0gMTtcclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCAgPSAyO1xyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUiA9IG5ldyBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRFcnJvck9iamVjdCgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHNlbGZGdWxmaWxsbWVudCgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGNhbm5vdFJldHVybk93bigpIHtcclxuICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRnZXRUaGVuKHByb21pc2UpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xyXG4gICAgICB9IGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IuZXJyb3IgPSBlcnJvcjtcclxuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCR0cnlUaGVuKHRoZW4sIHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XHJcbiAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgIHJldHVybiBlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XHJcbiAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcChmdW5jdGlvbihwcm9taXNlKSB7XHJcbiAgICAgICAgdmFyIHNlYWxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBlcnJvciA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICBpZiAoc2VhbGVkKSB7IHJldHVybjsgfVxyXG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcclxuICAgICAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcclxuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xyXG4gICAgICAgIH0sICdTZXR0bGU6ICcgKyAocHJvbWlzZS5fbGFiZWwgfHwgJyB1bmtub3duIHByb21pc2UnKSk7XHJcblxyXG4gICAgICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XHJcbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIHByb21pc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XHJcbiAgICAgIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4pIHtcclxuICAgICAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IgJiZcclxuICAgICAgICAgIHRoZW4gPT09IGxpYiRlczYkcHJvbWlzZSR0aGVuJCRkZWZhdWx0ICYmXHJcbiAgICAgICAgICBjb25zdHJ1Y3Rvci5yZXNvbHZlID09PSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0KSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoZW4gPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IuZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhlbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc0Z1bmN0aW9uKHRoZW4pKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xyXG4gICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc2VsZkZ1bGZpbGxtZW50KCkpO1xyXG4gICAgICB9IGVsc2UgaWYgKGxpYiRlczYkcHJvbWlzZSR1dGlscyQkb2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlLCBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRnZXRUaGVuKHZhbHVlKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcclxuICAgICAgaWYgKHByb21pc2UuX29uZXJyb3IpIHtcclxuICAgICAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gocHJvbWlzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xyXG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcclxuICAgICAgcHJvbWlzZS5fc3RhdGUgPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRUQ7XHJcblxyXG4gICAgICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaCwgcHJvbWlzZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XHJcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cclxuICAgICAgcHJvbWlzZS5fc3RhdGUgPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRDtcclxuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xyXG5cclxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XHJcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XHJcbiAgICAgIHZhciBsZW5ndGggPSBzdWJzY3JpYmVycy5sZW5ndGg7XHJcblxyXG4gICAgICBwYXJlbnQuX29uZXJyb3IgPSBudWxsO1xyXG5cclxuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xyXG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGggKyBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcclxuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURURdICA9IG9uUmVqZWN0aW9uO1xyXG5cclxuICAgICAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaCwgcGFyZW50KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gocHJvbWlzZSkge1xyXG4gICAgICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcclxuICAgICAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcclxuXHJcbiAgICAgIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICB2YXIgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwgPSBwcm9taXNlLl9yZXN1bHQ7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgICAgY2hpbGQgPSBzdWJzY3JpYmVyc1tpXTtcclxuICAgICAgICBjYWxsYmFjayA9IHN1YnNjcmliZXJzW2kgKyBzZXR0bGVkXTtcclxuXHJcbiAgICAgICAgaWYgKGNoaWxkKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGRldGFpbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCkge1xyXG4gICAgICB0aGlzLmVycm9yID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SID0gbmV3IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCk7XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhkZXRhaWwpO1xyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xyXG4gICAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XHJcbiAgICAgIHZhciBoYXNDYWxsYmFjayA9IGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbihjYWxsYmFjayksXHJcbiAgICAgICAgICB2YWx1ZSwgZXJyb3IsIHN1Y2NlZWRlZCwgZmFpbGVkO1xyXG5cclxuICAgICAgaWYgKGhhc0NhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFsdWUgPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCR0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IpIHtcclxuICAgICAgICAgIGZhaWxlZCA9IHRydWU7XHJcbiAgICAgICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xyXG4gICAgICAgICAgdmFsdWUgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzdWNjZWVkZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkY2Fubm90UmV0dXJuT3duKCkpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFsdWUgPSBkZXRhaWw7XHJcbiAgICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7XHJcbiAgICAgICAgLy8gbm9vcFxyXG4gICAgICB9IGVsc2UgaWYgKGhhc0NhbGxiYWNrICYmIHN1Y2NlZWRlZCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xyXG4gICAgICB9IGVsc2UgaWYgKGZhaWxlZCkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XHJcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSl7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xyXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpZCA9IDA7XHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRuZXh0SWQoKSB7XHJcbiAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpZCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG1ha2VQcm9taXNlKHByb21pc2UpIHtcclxuICAgICAgcHJvbWlzZVtsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQUk9NSVNFX0lEXSA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGlkKys7XHJcbiAgICAgIHByb21pc2UuX3N0YXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHByb21pc2UuX3N1YnNjcmliZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkYWxsJCRhbGwoZW50cmllcykge1xyXG4gICAgICByZXR1cm4gbmV3IGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRkZWZhdWx0KHRoaXMsIGVudHJpZXMpLnByb21pc2U7XHJcbiAgICB9XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHByb21pc2UkYWxsJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkYWxsJCRhbGw7XHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyYWNlJCRyYWNlKGVudHJpZXMpIHtcclxuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cclxuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcclxuXHJcbiAgICAgIGlmICghbGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc0FycmF5KGVudHJpZXMpKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIENvbnN0cnVjdG9yLnJlc29sdmUoZW50cmllc1tpXSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmFjZSQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJHJhY2U7XHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZWplY3QkJHJlamVjdChyZWFzb24pIHtcclxuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cclxuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcclxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCk7XHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xyXG4gICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZWplY3QkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZWplY3QkJHJlamVjdDtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJG5lZWRzUmVzb2x2ZXIoKSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNOZXcoKSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2U7XHJcbiAgICAvKipcclxuICAgICAgUHJvbWlzZSBvYmplY3RzIHJlcHJlc2VudCB0aGUgZXZlbnR1YWwgcmVzdWx0IG9mIGFuIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uIFRoZVxyXG4gICAgICBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLCB3aGljaFxyXG4gICAgICByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZSByZWFzb25cclxuICAgICAgd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXHJcblxyXG4gICAgICBUZXJtaW5vbG9neVxyXG4gICAgICAtLS0tLS0tLS0tLVxyXG5cclxuICAgICAgLSBgcHJvbWlzZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHdpdGggYSBgdGhlbmAgbWV0aG9kIHdob3NlIGJlaGF2aW9yIGNvbmZvcm1zIHRvIHRoaXMgc3BlY2lmaWNhdGlvbi5cclxuICAgICAgLSBgdGhlbmFibGVgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB0aGF0IGRlZmluZXMgYSBgdGhlbmAgbWV0aG9kLlxyXG4gICAgICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXHJcbiAgICAgIC0gYGV4Y2VwdGlvbmAgaXMgYSB2YWx1ZSB0aGF0IGlzIHRocm93biB1c2luZyB0aGUgdGhyb3cgc3RhdGVtZW50LlxyXG4gICAgICAtIGByZWFzb25gIGlzIGEgdmFsdWUgdGhhdCBpbmRpY2F0ZXMgd2h5IGEgcHJvbWlzZSB3YXMgcmVqZWN0ZWQuXHJcbiAgICAgIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxyXG5cclxuICAgICAgQSBwcm9taXNlIGNhbiBiZSBpbiBvbmUgb2YgdGhyZWUgc3RhdGVzOiBwZW5kaW5nLCBmdWxmaWxsZWQsIG9yIHJlamVjdGVkLlxyXG5cclxuICAgICAgUHJvbWlzZXMgdGhhdCBhcmUgZnVsZmlsbGVkIGhhdmUgYSBmdWxmaWxsbWVudCB2YWx1ZSBhbmQgYXJlIGluIHRoZSBmdWxmaWxsZWRcclxuICAgICAgc3RhdGUuICBQcm9taXNlcyB0aGF0IGFyZSByZWplY3RlZCBoYXZlIGEgcmVqZWN0aW9uIHJlYXNvbiBhbmQgYXJlIGluIHRoZVxyXG4gICAgICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cclxuXHJcbiAgICAgIFByb21pc2VzIGNhbiBhbHNvIGJlIHNhaWQgdG8gKnJlc29sdmUqIGEgdmFsdWUuICBJZiB0aGlzIHZhbHVlIGlzIGFsc28gYVxyXG4gICAgICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXHJcbiAgICAgIHNldHRsZWQgc3RhdGUuICBTbyBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMgd2lsbFxyXG4gICAgICBpdHNlbGYgcmVqZWN0LCBhbmQgYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB3aWxsXHJcbiAgICAgIGl0c2VsZiBmdWxmaWxsLlxyXG5cclxuXHJcbiAgICAgIEJhc2ljIFVzYWdlOlxyXG4gICAgICAtLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIGBgYGpzXHJcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgLy8gb24gc3VjY2Vzc1xyXG4gICAgICAgIHJlc29sdmUodmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBvbiBmYWlsdXJlXHJcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgLy8gb24gZnVsZmlsbG1lbnRcclxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XHJcbiAgICAgICAgLy8gb24gcmVqZWN0aW9uXHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIEFkdmFuY2VkIFVzYWdlOlxyXG4gICAgICAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIFByb21pc2VzIHNoaW5lIHdoZW4gYWJzdHJhY3RpbmcgYXdheSBhc3luY2hyb25vdXMgaW50ZXJhY3Rpb25zIHN1Y2ggYXNcclxuICAgICAgYFhNTEh0dHBSZXF1ZXN0YHMuXHJcblxyXG4gICAgICBgYGBqc1xyXG4gICAgICBmdW5jdGlvbiBnZXRKU09OKHVybCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xyXG4gICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZXI7XHJcbiAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xyXG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgICB4aHIuc2VuZCgpO1xyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IHRoaXMuRE9ORSkge1xyXG4gICAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdnZXRKU09OOiBgJyArIHVybCArICdgIGZhaWxlZCB3aXRoIHN0YXR1czogWycgKyB0aGlzLnN0YXR1cyArICddJykpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcclxuICAgICAgICAvLyBvbiBmdWxmaWxsbWVudFxyXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcclxuICAgICAgICAvLyBvbiByZWplY3Rpb25cclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgVW5saWtlIGNhbGxiYWNrcywgcHJvbWlzZXMgYXJlIGdyZWF0IGNvbXBvc2FibGUgcHJpbWl0aXZlcy5cclxuXHJcbiAgICAgIGBgYGpzXHJcbiAgICAgIFByb21pc2UuYWxsKFtcclxuICAgICAgICBnZXRKU09OKCcvcG9zdHMnKSxcclxuICAgICAgICBnZXRKU09OKCcvY29tbWVudHMnKVxyXG4gICAgICBdKS50aGVuKGZ1bmN0aW9uKHZhbHVlcyl7XHJcbiAgICAgICAgdmFsdWVzWzBdIC8vID0+IHBvc3RzSlNPTlxyXG4gICAgICAgIHZhbHVlc1sxXSAvLyA9PiBjb21tZW50c0pTT05cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgQGNsYXNzIFByb21pc2VcclxuICAgICAgQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZXJcclxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxyXG4gICAgICBAY29uc3RydWN0b3JcclxuICAgICovXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZShyZXNvbHZlcikge1xyXG4gICAgICB0aGlzW2xpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBST01JU0VfSURdID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbmV4dElkKCk7XHJcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xyXG5cclxuICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3AgIT09IHJlc29sdmVyKSB7XHJcbiAgICAgICAgdHlwZW9mIHJlc29sdmVyICE9PSAnZnVuY3Rpb24nICYmIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCk7XHJcbiAgICAgICAgdGhpcyBpbnN0YW5jZW9mIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlID8gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpIDogbGliJGVzNiRwcm9taXNlJHByb21pc2UkJG5lZWRzTmV3KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5hbGwgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRhbGwkJGRlZmF1bHQ7XHJcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5yYWNlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmFjZSQkZGVmYXVsdDtcclxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLnJlc29sdmUgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0O1xyXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucmVqZWN0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVqZWN0JCRkZWZhdWx0O1xyXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UuX3NldFNjaGVkdWxlciA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzZXRTY2hlZHVsZXI7XHJcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5fc2V0QXNhcCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzZXRBc2FwO1xyXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UuX2FzYXAgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcDtcclxuXHJcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5wcm90b3R5cGUgPSB7XHJcbiAgICAgIGNvbnN0cnVjdG9yOiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZSxcclxuXHJcbiAgICAvKipcclxuICAgICAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXHJcbiAgICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXHJcbiAgICAgIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cclxuXHJcbiAgICAgIGBgYGpzXHJcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcclxuICAgICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxyXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xyXG4gICAgICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIENoYWluaW5nXHJcbiAgICAgIC0tLS0tLS0tXHJcblxyXG4gICAgICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xyXG4gICAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XHJcbiAgICAgIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxyXG5cclxuICAgICAgYGBganNcclxuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgcmV0dXJuIHVzZXIubmFtZTtcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xyXG4gICAgICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcclxuICAgICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcclxuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XHJcbiAgICAgICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xyXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jyk7XHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxyXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XHJcbiAgICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cclxuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG4gICAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cclxuXHJcbiAgICAgIGBgYGpzXHJcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcclxuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAvLyBuZXZlciByZWFjaGVkXHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxyXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XHJcbiAgICAgICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgQXNzaW1pbGF0aW9uXHJcbiAgICAgIC0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcclxuICAgICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxyXG4gICAgICBmdWxmaWxsbWVudCBvciByZWplY3Rpb24gaGFuZGxlci4gVGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIHRoZW4gYmUgcGVuZGluZ1xyXG4gICAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cclxuXHJcbiAgICAgIGBgYGpzXHJcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcclxuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcclxuICAgICAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxyXG5cclxuICAgICAgYGBganNcclxuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xyXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xyXG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xyXG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgU2ltcGxlIEV4YW1wbGVcclxuICAgICAgLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcclxuXHJcbiAgICAgIGBgYGphdmFzY3JpcHRcclxuICAgICAgdmFyIHJlc3VsdDtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xyXG4gICAgICAgIC8vIHN1Y2Nlc3NcclxuICAgICAgfSBjYXRjaChyZWFzb24pIHtcclxuICAgICAgICAvLyBmYWlsdXJlXHJcbiAgICAgIH1cclxuICAgICAgYGBgXHJcblxyXG4gICAgICBFcnJiYWNrIEV4YW1wbGVcclxuXHJcbiAgICAgIGBgYGpzXHJcbiAgICAgIGZpbmRSZXN1bHQoZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIC8vIGZhaWx1cmVcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gc3VjY2Vzc1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgUHJvbWlzZSBFeGFtcGxlO1xyXG5cclxuICAgICAgYGBgamF2YXNjcmlwdFxyXG4gICAgICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xyXG4gICAgICAgIC8vIHN1Y2Nlc3NcclxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcclxuICAgICAgICAvLyBmYWlsdXJlXHJcbiAgICAgIH0pO1xyXG4gICAgICBgYGBcclxuXHJcbiAgICAgIEFkdmFuY2VkIEV4YW1wbGVcclxuICAgICAgLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcclxuXHJcbiAgICAgIGBgYGphdmFzY3JpcHRcclxuICAgICAgdmFyIGF1dGhvciwgYm9va3M7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcclxuICAgICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xyXG4gICAgICAgIC8vIHN1Y2Nlc3NcclxuICAgICAgfSBjYXRjaChyZWFzb24pIHtcclxuICAgICAgICAvLyBmYWlsdXJlXHJcbiAgICAgIH1cclxuICAgICAgYGBgXHJcblxyXG4gICAgICBFcnJiYWNrIEV4YW1wbGVcclxuXHJcbiAgICAgIGBgYGpzXHJcblxyXG4gICAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xyXG4gICAgICAgICAgLy8gZmFpbHVyZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBjYXRjaChlcnJvcikge1xyXG4gICAgICAgICAgICBmYWlsdXJlKGVycik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBzdWNjZXNzXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBQcm9taXNlIEV4YW1wbGU7XHJcblxyXG4gICAgICBgYGBqYXZhc2NyaXB0XHJcbiAgICAgIGZpbmRBdXRob3IoKS5cclxuICAgICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cclxuICAgICAgICB0aGVuKGZ1bmN0aW9uKGJvb2tzKXtcclxuICAgICAgICAgIC8vIGZvdW5kIGJvb2tzXHJcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XHJcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcclxuICAgICAgfSk7XHJcbiAgICAgIGBgYFxyXG5cclxuICAgICAgQG1ldGhvZCB0aGVuXHJcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkXHJcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0ZWRcclxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxyXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxyXG4gICAgKi9cclxuICAgICAgdGhlbjogbGliJGVzNiRwcm9taXNlJHRoZW4kJGRlZmF1bHQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcclxuICAgICAgYXMgdGhlIGNhdGNoIGJsb2NrIG9mIGEgdHJ5L2NhdGNoIHN0YXRlbWVudC5cclxuXHJcbiAgICAgIGBgYGpzXHJcbiAgICAgIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc3luY2hyb25vdXNcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBmaW5kQXV0aG9yKCk7XHJcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XHJcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xyXG4gICAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcclxuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xyXG4gICAgICB9KTtcclxuICAgICAgYGBgXHJcblxyXG4gICAgICBAbWV0aG9kIGNhdGNoXHJcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXHJcbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cclxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cclxuICAgICovXHJcbiAgICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvcjtcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yKENvbnN0cnVjdG9yLCBpbnB1dCkge1xyXG4gICAgICB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XHJcbiAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcclxuXHJcbiAgICAgIGlmICghdGhpcy5wcm9taXNlW2xpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBST01JU0VfSURdKSB7XHJcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbWFrZVByb21pc2UodGhpcy5wcm9taXNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNBcnJheShpbnB1dCkpIHtcclxuICAgICAgICB0aGlzLl9pbnB1dCAgICAgPSBpbnB1dDtcclxuICAgICAgICB0aGlzLmxlbmd0aCAgICAgPSBpbnB1dC5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xyXG5cclxuICAgICAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XHJcbiAgICAgICAgICB0aGlzLl9lbnVtZXJhdGUoKTtcclxuICAgICAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcclxuICAgICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdCh0aGlzLnByb21pc2UsIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCR2YWxpZGF0aW9uRXJyb3IoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkdmFsaWRhdGlvbkVycm9yKCkge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdBcnJheSBNZXRob2RzIG11c3QgYmUgcHJvdmlkZWQgYW4gQXJyYXknKTtcclxuICAgIH1cclxuXHJcbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgbGVuZ3RoICA9IHRoaXMubGVuZ3RoO1xyXG4gICAgICB2YXIgaW5wdXQgICA9IHRoaXMuX2lucHV0O1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IHRoaXMuX3N0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoaXMuX2VhY2hFbnRyeShpbnB1dFtpXSwgaSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9lYWNoRW50cnkgPSBmdW5jdGlvbihlbnRyeSwgaSkge1xyXG4gICAgICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XHJcbiAgICAgIHZhciByZXNvbHZlID0gYy5yZXNvbHZlO1xyXG5cclxuICAgICAgaWYgKHJlc29sdmUgPT09IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQpIHtcclxuICAgICAgICB2YXIgdGhlbiA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGdldFRoZW4oZW50cnkpO1xyXG5cclxuICAgICAgICBpZiAodGhlbiA9PT0gbGliJGVzNiRwcm9taXNlJHRoZW4kJGRlZmF1bHQgJiZcclxuICAgICAgICAgICAgZW50cnkuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7XHJcbiAgICAgICAgICB0aGlzLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGVuICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICB0aGlzLl9yZW1haW5pbmctLTtcclxuICAgICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IGVudHJ5O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQpIHtcclxuICAgICAgICAgIHZhciBwcm9taXNlID0gbmV3IGMobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCk7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIGVudHJ5LCB0aGVuKTtcclxuICAgICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KG5ldyBjKGZ1bmN0aW9uKHJlc29sdmUpIHsgcmVzb2x2ZShlbnRyeSk7IH0pLCBpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHJlc29sdmUoZW50cnkpLCBpKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uKHN0YXRlLCBpLCB2YWx1ZSkge1xyXG4gICAgICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcclxuXHJcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykge1xyXG4gICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XHJcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcclxuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbihwcm9taXNlLCBpKSB7XHJcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcclxuXHJcbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgZW51bWVyYXRvci5fc2V0dGxlZEF0KGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRCwgaSwgdmFsdWUpO1xyXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcclxuICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQsIGksIHJlYXNvbik7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwb2x5ZmlsbCQkcG9seWZpbGwoKSB7XHJcbiAgICAgIHZhciBsb2NhbDtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgbG9jYWwgPSBnbG9iYWw7XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBsb2NhbCA9IHNlbGY7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGxvY2FsID0gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcclxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHlmaWxsIGZhaWxlZCBiZWNhdXNlIGdsb2JhbCBvYmplY3QgaXMgdW5hdmFpbGFibGUgaW4gdGhpcyBlbnZpcm9ubWVudCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgUCA9IGxvY2FsLlByb21pc2U7XHJcblxyXG4gICAgICBpZiAoUCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUC5yZXNvbHZlKCkpID09PSAnW29iamVjdCBQcm9taXNlXScgJiYgIVAuY2FzdCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbG9jYWwuUHJvbWlzZSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0O1xyXG4gICAgfVxyXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwb2x5ZmlsbCQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwb2x5ZmlsbCQkcG9seWZpbGw7XHJcblxyXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQuUHJvbWlzZSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0O1xyXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQucG9seWZpbGwgPSBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJGRlZmF1bHQ7XHJcblxyXG4gICAgLyogZ2xvYmFsIGRlZmluZTp0cnVlIG1vZHVsZTp0cnVlIHdpbmRvdzogdHJ1ZSAqL1xyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xyXG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdDsgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSB7XHJcbiAgICAgIG1vZHVsZVsnZXhwb3J0cyddID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQ7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aGlzWydQcm9taXNlJ10gPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdDtcclxuICAgIH1cclxuXHJcbiAgICBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJGRlZmF1bHQoKTtcclxufSkuY2FsbCh0aGlzKTtcclxuIiwiKGZ1bmN0aW9uKHNlbGYpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGlmIChzZWxmLmZldGNoKSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIHZhciBzdXBwb3J0ID0ge1xyXG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxyXG4gICAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXHJcbiAgICBibG9iOiAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJiAnQmxvYicgaW4gc2VsZiAmJiAoZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbmV3IEJsb2IoKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9KSgpLFxyXG4gICAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcclxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xyXG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xyXG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpXHJcbiAgICB9XHJcbiAgICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5cXF5fYHx+XS9pLnRlc3QobmFtZSkpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlXHJcbiAgfVxyXG5cclxuICAvLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxyXG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XHJcbiAgICB2YXIgaXRlcmF0b3IgPSB7XHJcbiAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcclxuICAgICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XHJcbiAgICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gaXRlcmF0b3JcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpdGVyYXRvclxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XHJcbiAgICB0aGlzLm1hcCA9IHt9XHJcblxyXG4gICAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XHJcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxyXG4gICAgICB9LCB0aGlzKVxyXG5cclxuICAgIH0gZWxzZSBpZiAoaGVhZGVycykge1xyXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxyXG4gICAgICB9LCB0aGlzKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXHJcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxyXG4gICAgdmFyIGxpc3QgPSB0aGlzLm1hcFtuYW1lXVxyXG4gICAgaWYgKCFsaXN0KSB7XHJcbiAgICAgIGxpc3QgPSBbXVxyXG4gICAgICB0aGlzLm1hcFtuYW1lXSA9IGxpc3RcclxuICAgIH1cclxuICAgIGxpc3QucHVzaCh2YWx1ZSlcclxuICB9XHJcblxyXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxyXG4gIH1cclxuXHJcbiAgSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgdmFyIHZhbHVlcyA9IHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXHJcbiAgICByZXR1cm4gdmFsdWVzID8gdmFsdWVzWzBdIDogbnVsbFxyXG4gIH1cclxuXHJcbiAgSGVhZGVycy5wcm90b3R5cGUuZ2V0QWxsID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgcmV0dXJuIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldIHx8IFtdXHJcbiAgfVxyXG5cclxuICBIZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcclxuICB9XHJcblxyXG4gIEhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XHJcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IFtub3JtYWxpemVWYWx1ZSh2YWx1ZSldXHJcbiAgfVxyXG5cclxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcclxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMubWFwKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgdGhpcy5tYXBbbmFtZV0uZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsdWUsIG5hbWUsIHRoaXMpXHJcbiAgICAgIH0sIHRoaXMpXHJcbiAgICB9LCB0aGlzKVxyXG4gIH1cclxuXHJcbiAgSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGl0ZW1zID0gW11cclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKG5hbWUpIH0pXHJcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXHJcbiAgfVxyXG5cclxuICBIZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpdGVtcyA9IFtdXHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHsgaXRlbXMucHVzaCh2YWx1ZSkgfSlcclxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcclxuICB9XHJcblxyXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpdGVtcyA9IFtdXHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKSB9KVxyXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxyXG4gIH1cclxuXHJcbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcclxuICAgIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XHJcbiAgICBpZiAoYm9keS5ib2R5VXNlZCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXHJcbiAgICB9XHJcbiAgICBib2R5LmJvZHlVc2VkID0gdHJ1ZVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxyXG4gICAgICB9XHJcbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XHJcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXHJcbiAgICByZXR1cm4gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcclxuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxyXG4gICAgcmV0dXJuIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBCb2R5KCkge1xyXG4gICAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXHJcblxyXG4gICAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XHJcbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxyXG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XHJcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcclxuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcclxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XHJcbiAgICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxyXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xyXG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXHJcbiAgICAgIH0gZWxzZSBpZiAoIWJvZHkpIHtcclxuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXHJcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xyXG4gICAgICAgIC8vIE9ubHkgc3VwcG9ydCBBcnJheUJ1ZmZlcnMgZm9yIFBPU1QgbWV0aG9kLlxyXG4gICAgICAgIC8vIFJlY2VpdmluZyBBcnJheUJ1ZmZlcnMgaGFwcGVucyB2aWEgQmxvYnMsIGluc3RlYWQuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnN1cHBvcnRlZCBCb2R5SW5pdCB0eXBlJylcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xyXG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcclxuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xyXG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3VwcG9ydC5ibG9iKSB7XHJcbiAgICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXHJcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xyXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcclxuICAgICAgICBpZiAocmVqZWN0ZWQpIHtcclxuICAgICAgICAgIHJldHVybiByZWplY3RlZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXHJcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkID8gcmVqZWN0ZWQgOiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xyXG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIC8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxyXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXHJcblxyXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcclxuICAgIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcclxuICAgIHJldHVybiAobWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEpID8gdXBjYXNlZCA6IG1ldGhvZFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cclxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XHJcbiAgICBpZiAoUmVxdWVzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihpbnB1dCkpIHtcclxuICAgICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybFxyXG4gICAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcclxuICAgICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcclxuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXHJcbiAgICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcclxuICAgICAgaWYgKCFib2R5KSB7XHJcbiAgICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxyXG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnVybCA9IGlucHV0XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnb21pdCdcclxuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xyXG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXHJcbiAgICB9XHJcbiAgICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcclxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxyXG4gICAgdGhpcy5yZWZlcnJlciA9IG51bGxcclxuXHJcbiAgICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcclxuICAgIH1cclxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpXHJcbiAgfVxyXG5cclxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkZWNvZGUoYm9keSkge1xyXG4gICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgYm9keS50cmltKCkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XHJcbiAgICAgIGlmIChieXRlcykge1xyXG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcclxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcclxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcclxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gZm9ybVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGVhZGVycyh4aHIpIHtcclxuICAgIHZhciBoZWFkID0gbmV3IEhlYWRlcnMoKVxyXG4gICAgdmFyIHBhaXJzID0gKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJykudHJpbSgpLnNwbGl0KCdcXG4nKVxyXG4gICAgcGFpcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcclxuICAgICAgdmFyIHNwbGl0ID0gaGVhZGVyLnRyaW0oKS5zcGxpdCgnOicpXHJcbiAgICAgIHZhciBrZXkgPSBzcGxpdC5zaGlmdCgpLnRyaW0oKVxyXG4gICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc6JykudHJpbSgpXHJcbiAgICAgIGhlYWQuYXBwZW5kKGtleSwgdmFsdWUpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGhlYWRcclxuICB9XHJcblxyXG4gIEJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcclxuXHJcbiAgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcclxuICAgIGlmICghb3B0aW9ucykge1xyXG4gICAgICBvcHRpb25zID0ge31cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcclxuICAgIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXNcclxuICAgIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcclxuICAgIHRoaXMuc3RhdHVzVGV4dCA9IG9wdGlvbnMuc3RhdHVzVGV4dFxyXG4gICAgdGhpcy5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycyA/IG9wdGlvbnMuaGVhZGVycyA6IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcclxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcclxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxyXG4gIH1cclxuXHJcbiAgQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcclxuXHJcbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XHJcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXHJcbiAgICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcclxuICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcclxuICAgICAgdXJsOiB0aGlzLnVybFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxyXG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcclxuICAgIHJldHVybiByZXNwb25zZVxyXG4gIH1cclxuXHJcbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXHJcblxyXG4gIFJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcclxuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcclxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxyXG4gIH1cclxuXHJcbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xyXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcclxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2VcclxuXHJcbiAgc2VsZi5mZXRjaCA9IGZ1bmN0aW9uKGlucHV0LCBpbml0KSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgIHZhciByZXF1ZXN0XHJcbiAgICAgIGlmIChSZXF1ZXN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGlucHV0KSAmJiAhaW5pdCkge1xyXG4gICAgICAgIHJlcXVlc3QgPSBpbnB1dFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcblxyXG4gICAgICBmdW5jdGlvbiByZXNwb25zZVVSTCgpIHtcclxuICAgICAgICBpZiAoJ3Jlc3BvbnNlVVJMJyBpbiB4aHIpIHtcclxuICAgICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VVUkxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEF2b2lkIHNlY3VyaXR5IHdhcm5pbmdzIG9uIGdldFJlc3BvbnNlSGVhZGVyIHdoZW4gbm90IGFsbG93ZWQgYnkgQ09SU1xyXG4gICAgICAgIGlmICgvXlgtUmVxdWVzdC1VUkw6L20udGVzdCh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpKSB7XHJcbiAgICAgICAgICByZXR1cm4geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLVJlcXVlc3QtVVJMJylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXHJcbiAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcclxuICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMoeGhyKSxcclxuICAgICAgICAgIHVybDogcmVzcG9uc2VVUkwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxyXG4gICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXHJcblxyXG4gICAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XHJcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcclxuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxyXG4gICAgfSlcclxuICB9XHJcbiAgc2VsZi5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcclxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMpOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHByb21pc2VQb2x5IGZyb20gXCIuL2VzNi1wcm9taXNlXCI7XG5cbnZhciAkZG9tJFNVUFBPUlRTX0FEREVWRU5UTElTVEVORVIkJCA9ICEhZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcjtcblxuZnVuY3Rpb24gJGRvbSRhZGRMaXN0ZW5lciQkKCRlbGVtZW50JCQ5JCQsICRjYWxsYmFjayQkNDckJCl7XG5cdCRkb20kU1VQUE9SVFNfQURERVZFTlRMSVNURU5FUiQkID8gJGVsZW1lbnQkJDkkJC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsICRjYWxsYmFjayQkNDckJCwgITEpIDogJGVsZW1lbnQkJDkkJC5hdHRhY2hFdmVudChcInNjcm9sbFwiLCAkY2FsbGJhY2skJDQ3JCQpO1xufVxuXG5mdW5jdGlvbiAkZG9tJHdhaXRGb3JCb2R5JCQoJGNhbGxiYWNrJCQ0OCQkKSB7XG5cdGRvY3VtZW50LmJvZHkgP1xuXHRcdCRjYWxsYmFjayQkNDgkJCgpIDpcblx0XHQkZG9tJFNVUFBPUlRTX0FEREVWRU5UTElTVEVORVIkJCA/XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAkY2FsbGJhY2skJDQ4JCQpIDpcblx0XHRcdGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcImludGVyYWN0aXZlXCIgIT0gZG9jdW1lbnQucmVhZHlTdGF0ZSAmJiBcImNvbXBsZXRlXCIgIT0gZG9jdW1lbnQucmVhZHlTdGF0ZSB8fCAkY2FsbGJhY2skJDQ4JCQoKTtcblx0XHRcdH0pO1xufVxuXG5mdW5jdGlvbiAkZm9udGZhY2UkUnVsZXIkJCgkdGV4dCQkMTEkJCkge1xuXHR0aGlzLiRhJCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHRoaXMuJGEkLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcblx0dGhpcy4kYSQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJHRleHQkJDExJCQpKTtcblx0dGhpcy4kYiQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0dGhpcy4kYyQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0dGhpcy4kaCQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0dGhpcy4kZiQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0dGhpcy4kZyQgPSAtMTtcblx0dGhpcy4kYiQuc3R5bGUuY3NzVGV4dCA9IFwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG5cdHRoaXMuJGMkLnN0eWxlLmNzc1RleHQgPSBcIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xuXHR0aGlzLiRmJC5zdHlsZS5jc3NUZXh0ID0gXCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcblx0dGhpcy4kaCQuc3R5bGUuY3NzVGV4dCA9IFwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjtcblx0dGhpcy4kYiQuYXBwZW5kQ2hpbGQodGhpcy4kaCQpO1xuXHR0aGlzLiRjJC5hcHBlbmRDaGlsZCh0aGlzLiRmJCk7XG5cdHRoaXMuJGEkLmFwcGVuZENoaWxkKHRoaXMuJGIkKTtcblx0dGhpcy4kYSQuYXBwZW5kQ2hpbGQodGhpcy4kYyQpO1xufVxuXG5mdW5jdGlvbiAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX3NldEZvbnQkJCgkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX3NldEZvbnQkc2VsZiQkLCAkZm9udCQkMyQkKSB7XG5cdCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfc2V0Rm9udCRzZWxmJCQuJGEkLnN0eWxlLmNzc1RleHQgPSBcIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDtsZWZ0Oi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udDpcIiArICRmb250JCQzJCQgKyBcIjtcIjtcbn1cblxuZnVuY3Rpb24gJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19mb250ZmFjZV9SdWxlcl9wcm90b3R5cGUkcmVzZXQkJCgkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2ZvbnRmYWNlX1J1bGVyX3Byb3RvdHlwZSRyZXNldCRzZWxmJCQpIHtcblx0dmFyICRvZmZzZXRXaWR0aCQkID0gJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19mb250ZmFjZV9SdWxlcl9wcm90b3R5cGUkcmVzZXQkc2VsZiQkLiRhJC5vZmZzZXRXaWR0aCwgJHdpZHRoJCQxMyQkID0gJG9mZnNldFdpZHRoJCQgKyAxMDA7XG5cdCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZm9udGZhY2VfUnVsZXJfcHJvdG90eXBlJHJlc2V0JHNlbGYkJC4kZiQuc3R5bGUud2lkdGggPSAkd2lkdGgkJDEzJCQgKyBcInB4XCI7XG5cdCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZm9udGZhY2VfUnVsZXJfcHJvdG90eXBlJHJlc2V0JHNlbGYkJC4kYyQuc2Nyb2xsTGVmdCA9ICR3aWR0aCQkMTMkJDtcblx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19mb250ZmFjZV9SdWxlcl9wcm90b3R5cGUkcmVzZXQkc2VsZiQkLiRiJC5zY3JvbGxMZWZ0ID0gJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19mb250ZmFjZV9SdWxlcl9wcm90b3R5cGUkcmVzZXQkc2VsZiQkLiRiJC5zY3JvbGxXaWR0aCArIDEwMDtcblx0cmV0dXJuICRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZm9udGZhY2VfUnVsZXJfcHJvdG90eXBlJHJlc2V0JHNlbGYkJC4kZyQgIT09ICRvZmZzZXRXaWR0aCQkID8gKCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZm9udGZhY2VfUnVsZXJfcHJvdG90eXBlJHJlc2V0JHNlbGYkJC4kZyQgPSAkb2Zmc2V0V2lkdGgkJCwgITApIDogITE7XG59XG5cbmZ1bmN0aW9uICRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfb25SZXNpemUkJCgkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uUmVzaXplJHNlbGYkJCwgJGNhbGxiYWNrJCQ1MCQkKSB7XG5cdGZ1bmN0aW9uICRvblNjcm9sbCQkKCkge1xuXHRcdHZhciAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uU2Nyb2xsJHNlbGYkJGlubGluZV8zNCQkID0gJHRoYXQkJDtcblx0XHQkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2ZvbnRmYWNlX1J1bGVyX3Byb3RvdHlwZSRyZXNldCQkKCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfb25TY3JvbGwkc2VsZiQkaW5saW5lXzM0JCQpICYmIG51bGwgIT09ICRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfb25TY3JvbGwkc2VsZiQkaW5saW5lXzM0JCQuJGEkLnBhcmVudE5vZGUgJiYgJGNhbGxiYWNrJCQ1MCQkKCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfb25TY3JvbGwkc2VsZiQkaW5saW5lXzM0JCQuJGckKTtcblx0fVxuXHR2YXIgJHRoYXQkJCA9ICRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfb25SZXNpemUkc2VsZiQkO1xuXHQkZG9tJGFkZExpc3RlbmVyJCQoJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19vblJlc2l6ZSRzZWxmJCQuJGIkLCAkb25TY3JvbGwkJCk7XG5cdCRkb20kYWRkTGlzdGVuZXIkJCgkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uUmVzaXplJHNlbGYkJC4kYyQsICRvblNjcm9sbCQkKTtcblx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19mb250ZmFjZV9SdWxlcl9wcm90b3R5cGUkcmVzZXQkJCgkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uUmVzaXplJHNlbGYkJCk7XG59XG5cbi8vIElucHV0IDNcbmZ1bmN0aW9uICRmb250ZmFjZSRPYnNlcnZlciQkKCRmYW1pbHkkJCwgJG9wdF9kZXNjcmlwdG9ycyQkKSB7XG5cdHZhciAkZGVzY3JpcHRvcnMkJDEkJCA9ICRvcHRfZGVzY3JpcHRvcnMkJCB8fCB7fTtcblx0dGhpcy5mYW1pbHkgPSAkZmFtaWx5JCQ7XG5cdHRoaXMuc3R5bGUgPSAkZGVzY3JpcHRvcnMkJDEkJC5zdHlsZSB8fCBcIm5vcm1hbFwiO1xuXHR0aGlzLndlaWdodCA9ICRkZXNjcmlwdG9ycyQkMSQkLndlaWdodCB8fCBcIm5vcm1hbFwiO1xuXHR0aGlzLnN0cmV0Y2ggPSAkZGVzY3JpcHRvcnMkJDEkJC5zdHJldGNoIHx8IFwibm9ybWFsXCI7XG59XG5cbnZhciAkZm9udGZhY2UkT2JzZXJ2ZXIkSEFTX1dFQktJVF9GQUxMQkFDS19CVUckJCA9IG51bGwsXG5cdCRmb250ZmFjZSRPYnNlcnZlciRTVVBQT1JUU19TVFJFVENIJCQgPSBudWxsLFxuXHQkZm9udGZhY2UkT2JzZXJ2ZXIkU1VQUE9SVFNfTkFUSVZFJCQgPSAhIXdpbmRvdy5Gb250RmFjZTtcblxuZnVuY3Rpb24gJGZvbnRmYWNlJE9ic2VydmVyJHN1cHBvcnRTdHJldGNoJCQoKSB7XG5cdGlmIChudWxsID09PSAkZm9udGZhY2UkT2JzZXJ2ZXIkU1VQUE9SVFNfU1RSRVRDSCQkKSB7XG5cdFx0dmFyICRkaXYkJCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0dHJ5IHtcblx0XHRcdCRkaXYkJC5zdHlsZS5mb250ID0gXCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwiO1xuXHRcdH0gY2F0Y2ggKCRlJCQ2JCQpIHt9XG5cdFx0JGZvbnRmYWNlJE9ic2VydmVyJFNVUFBPUlRTX1NUUkVUQ0gkJCA9IFwiXCIgIT09ICRkaXYkJC5zdHlsZS5mb250O1xuXHR9XG5cdHJldHVybiAkZm9udGZhY2UkT2JzZXJ2ZXIkU1VQUE9SVFNfU1RSRVRDSCQkO1xufVxuXG5mdW5jdGlvbiAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2dldFN0eWxlJCQoJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19nZXRTdHlsZSRzZWxmJCQsICRmYW1pbHkkJDEkJCkge1xuXHRyZXR1cm4gWyRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZ2V0U3R5bGUkc2VsZiQkLnN0eWxlLCAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2dldFN0eWxlJHNlbGYkJC53ZWlnaHQsICRmb250ZmFjZSRPYnNlcnZlciRzdXBwb3J0U3RyZXRjaCQkKCkgPyAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2dldFN0eWxlJHNlbGYkJC5zdHJldGNoIDogXCJcIiwgXCIxMDBweFwiLCAkZmFtaWx5JCQxJCRdLmpvaW4oXCIgXCIpO1xufVxuXG4kZm9udGZhY2UkT2JzZXJ2ZXIkJC5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uICQkZm9udGZhY2UkT2JzZXJ2ZXIkJCQkbG9hZCQoJHRleHQkJDEyJCQsICR0aW1lb3V0JCQpIHtcblx0dmFyICR0aGF0JCQxJCQgPSB0aGlzLFxuXHRcdCR0ZXN0U3RyaW5nJCQgPSAkdGV4dCQkMTIkJCB8fCBcIkJFU2Jzd3lcIixcblx0XHQkdGltZW91dFZhbHVlJCQgPSAkdGltZW91dCQkIHx8IDNFMyxcblx0XHQkc3RhcnQkJDE2JCQgPSAobmV3IERhdGUpLmdldFRpbWUoKTtcblxuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oJHJlc29sdmUkJCwgJHJlamVjdCQkKSB7XG5cdFx0aWYgKCRmb250ZmFjZSRPYnNlcnZlciRTVVBQT1JUU19OQVRJVkUkJCkge1xuXHRcdFx0dmFyICRsb2FkZXIkJCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKCRyZXNvbHZlJCQxJCQsICRyZWplY3QkJDEkJCkge1xuXHRcdFx0XHRmdW5jdGlvbiAkY2hlY2skJCgpIHtcblx0XHRcdFx0XHQobmV3IERhdGUpLmdldFRpbWUoKSAtICRzdGFydCQkMTYkJCA+PSAkdGltZW91dFZhbHVlJCQgPyAkcmVqZWN0JCQxJCQoKSA6IGRvY3VtZW50LmZvbnRzLmxvYWQoJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19nZXRTdHlsZSQkKCR0aGF0JCQxJCQsICR0aGF0JCQxJCQuZmFtaWx5KSwgJHRlc3RTdHJpbmckJCkudGhlbihmdW5jdGlvbigkZm9udHMkJCkge1xuXHRcdFx0XHRcdFx0XHQxIDw9ICRmb250cyQkLmxlbmd0aCA/ICRyZXNvbHZlJCQxJCQoKSA6IHNldFRpbWVvdXQoJGNoZWNrJCQsIDI1KTtcblx0XHRcdFx0XHRcdH0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQkcmVqZWN0JCQxJCQoKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRjaGVjayQkKCk7XG5cdFx0XHR9KSxcblx0XHRcdCR0aW1lciQkID0gbmV3IFByb21pc2UoZnVuY3Rpb24oJHJlc29sdmUkJDIkJCwgJHJlamVjdCQkMiQkKSB7XG5cdFx0XHRcdFx0c2V0VGltZW91dCgkcmVqZWN0JCQyJCQsICR0aW1lb3V0VmFsdWUkJCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0UHJvbWlzZS5yYWNlKFskdGltZXIkJCwgJGxvYWRlciQkXSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRyZXNvbHZlJCQoJHRoYXQkJDEkJCk7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRyZWplY3QkJCgkdGhhdCQkMSQkKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGRvbSR3YWl0Rm9yQm9keSQkKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmdW5jdGlvbiAkY2hlY2skJDEkJCgpIHtcblx0XHRcdFx0XHR2YXIgJEpTQ29tcGlsZXJfdGVtcCQkMV9KU0NvbXBpbGVyX3RlbXAkJDJfbWF0Y2gkJGlubGluZV80MCQkO1xuXG5cdFx0XHRcdFx0aWYgKCRKU0NvbXBpbGVyX3RlbXAkJDFfSlNDb21waWxlcl90ZW1wJCQyX21hdGNoJCRpbmxpbmVfNDAkJCA9IC0xICE9ICR3aWR0aEEkJCAmJiAtMSAhPSAkd2lkdGhCJCQgfHwgLTEgIT0gJHdpZHRoQSQkICYmIC0xICE9ICR3aWR0aEMkJCB8fCAtMSAhPSAkd2lkdGhCJCQgJiYgLTEgIT0gJHdpZHRoQyQkKSB7XG5cdFx0XHRcdFx0XHQoJEpTQ29tcGlsZXJfdGVtcCQkMV9KU0NvbXBpbGVyX3RlbXAkJDJfbWF0Y2gkJGlubGluZV80MCQkID0gJHdpZHRoQSQkICE9ICR3aWR0aEIkJCAmJiAkd2lkdGhBJCQgIT0gJHdpZHRoQyQkICYmICR3aWR0aEIkJCAhPSAkd2lkdGhDJCQpIHx8IChudWxsID09PSAkZm9udGZhY2UkT2JzZXJ2ZXIkSEFTX1dFQktJVF9GQUxMQkFDS19CVUckJCAmJiAoJEpTQ29tcGlsZXJfdGVtcCQkMV9KU0NvbXBpbGVyX3RlbXAkJDJfbWF0Y2gkJGlubGluZV80MCQkID0gL0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLCAkZm9udGZhY2UkT2JzZXJ2ZXIkSEFTX1dFQktJVF9GQUxMQkFDS19CVUckJCA9ICEhJEpTQ29tcGlsZXJfdGVtcCQkMV9KU0NvbXBpbGVyX3RlbXAkJDJfbWF0Y2gkJGlubGluZV80MCQkICYmICg1MzYgPiBwYXJzZUludCgkSlNDb21waWxlcl90ZW1wJCQxX0pTQ29tcGlsZXJfdGVtcCQkMl9tYXRjaCQkaW5saW5lXzQwJCRbMV0sIDEwKSB8fCA1MzYgPT09IHBhcnNlSW50KCRKU0NvbXBpbGVyX3RlbXAkJDFfSlNDb21waWxlcl90ZW1wJCQyX21hdGNoJCRpbmxpbmVfNDAkJFsxXSwgMTApICYmIDExID49IHBhcnNlSW50KCRKU0NvbXBpbGVyX3RlbXAkJDFfSlNDb21waWxlcl90ZW1wJCQyX21hdGNoJCRpbmxpbmVfNDAkJFsyXSwgMTApKSksICRKU0NvbXBpbGVyX3RlbXAkJDFfSlNDb21waWxlcl90ZW1wJCQyX21hdGNoJCRpbmxpbmVfNDAkJCA9ICRmb250ZmFjZSRPYnNlcnZlciRIQVNfV0VCS0lUX0ZBTExCQUNLX0JVRyQkICYmICgkd2lkdGhBJCQgPT0gJGZhbGxiYWNrV2lkdGhBJCQgJiYgJHdpZHRoQiQkID09ICRmYWxsYmFja1dpZHRoQSQkICYmICR3aWR0aEMkJCA9PSAkZmFsbGJhY2tXaWR0aEEkJCB8fCAkd2lkdGhBJCQgPT0gJGZhbGxiYWNrV2lkdGhCJCQgJiYgJHdpZHRoQiQkID09ICRmYWxsYmFja1dpZHRoQiQkICYmICR3aWR0aEMkJCA9PSAkZmFsbGJhY2tXaWR0aEIkJCB8fCAkd2lkdGhBJCQgPT0gJGZhbGxiYWNrV2lkdGhDJCQgJiYgJHdpZHRoQiQkID09ICRmYWxsYmFja1dpZHRoQyQkICYmICR3aWR0aEMkJCA9PSAkZmFsbGJhY2tXaWR0aEMkJCkpLCAkSlNDb21waWxlcl90ZW1wJCQxX0pTQ29tcGlsZXJfdGVtcCQkMl9tYXRjaCQkaW5saW5lXzQwJCQgPSAhJEpTQ29tcGlsZXJfdGVtcCQkMV9KU0NvbXBpbGVyX3RlbXAkJDJfbWF0Y2gkJGlubGluZV80MCQkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkSlNDb21waWxlcl90ZW1wJCQxX0pTQ29tcGlsZXJfdGVtcCQkMl9tYXRjaCQkaW5saW5lXzQwJCQgJiYgKG51bGwgIT09ICRjb250YWluZXIkJC5wYXJlbnROb2RlICYmICRjb250YWluZXIkJC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCRjb250YWluZXIkJCksIGNsZWFyVGltZW91dCgkdGltZW91dElkJCQpLCAkcmVzb2x2ZSQkKCR0aGF0JCQxJCQpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uICRjaGVja0ZvclRpbWVvdXQkJCgpIHtcblx0XHRcdFx0XHRpZiAoKG5ldyBEYXRlKS5nZXRUaW1lKCkgLSAkc3RhcnQkJDE2JCQgPj0gJHRpbWVvdXRWYWx1ZSQkKSB7XG5cdFx0XHRcdFx0XHRudWxsICE9PSAkY29udGFpbmVyJCQucGFyZW50Tm9kZSAmJiAkY29udGFpbmVyJCQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCgkY29udGFpbmVyJCQpLCAkcmVqZWN0JCQoJHRoYXQkJDEkJCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHZhciAkaGlkZGVuJCQgPSBkb2N1bWVudC5oaWRkZW47XG5cdFx0XHRcdFx0XHRpZiAoITAgPT09ICRoaWRkZW4kJCB8fCB2b2lkIDAgPT09ICRoaWRkZW4kJCkge1xuXHRcdFx0XHRcdFx0XHQkd2lkdGhBJCQgPSAkcnVsZXJBJCQuJGEkLm9mZnNldFdpZHRoLCAkd2lkdGhCJCQgPSAkcnVsZXJCJCQuJGEkLm9mZnNldFdpZHRoLCAkd2lkdGhDJCQgPSAkcnVsZXJDJCQuJGEkLm9mZnNldFdpZHRoLCAkY2hlY2skJDEkJCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JHRpbWVvdXRJZCQkID0gc2V0VGltZW91dCgkY2hlY2tGb3JUaW1lb3V0JCQsIDUwKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgJHJ1bGVyQSQkID0gbmV3ICRmb250ZmFjZSRSdWxlciQkKCR0ZXN0U3RyaW5nJCQpLFxuXHRcdFx0XHRcdCRydWxlckIkJCA9IG5ldyAkZm9udGZhY2UkUnVsZXIkJCgkdGVzdFN0cmluZyQkKSxcblx0XHRcdFx0XHQkcnVsZXJDJCQgPSBuZXcgJGZvbnRmYWNlJFJ1bGVyJCQoJHRlc3RTdHJpbmckJCksXG5cdFx0XHRcdFx0JHdpZHRoQSQkID0gLTEsXG5cdFx0XHRcdFx0JHdpZHRoQiQkID0gLTEsXG5cdFx0XHRcdFx0JHdpZHRoQyQkID0gLTEsXG5cdFx0XHRcdFx0JGZhbGxiYWNrV2lkdGhBJCQgPSAtMSxcblx0XHRcdFx0XHQkZmFsbGJhY2tXaWR0aEIkJCA9IC0xLFxuXHRcdFx0XHRcdCRmYWxsYmFja1dpZHRoQyQkID0gLTEsXG5cdFx0XHRcdFx0JGNvbnRhaW5lciQkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRcdFx0XHQkdGltZW91dElkJCQgPSAwO1xuXG5cdFx0XHRcdCRjb250YWluZXIkJC5kaXIgPSBcImx0clwiO1xuXHRcdFx0XHQkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX3NldEZvbnQkJCgkcnVsZXJBJCQsICRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZ2V0U3R5bGUkJCgkdGhhdCQkMSQkLCBcInNhbnMtc2VyaWZcIikpO1xuXHRcdFx0XHQkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX3NldEZvbnQkJCgkcnVsZXJCJCQsICRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfZ2V0U3R5bGUkJCgkdGhhdCQkMSQkLCBcInNlcmlmXCIpKTtcblx0XHRcdFx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19zZXRGb250JCQoJHJ1bGVyQyQkLCAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2dldFN0eWxlJCQoJHRoYXQkJDEkJCwgXCJtb25vc3BhY2VcIikpO1xuXHRcdFx0XHQkY29udGFpbmVyJCQuYXBwZW5kQ2hpbGQoJHJ1bGVyQSQkLiRhJCk7XG5cdFx0XHRcdCRjb250YWluZXIkJC5hcHBlbmRDaGlsZCgkcnVsZXJCJCQuJGEkKTtcblx0XHRcdFx0JGNvbnRhaW5lciQkLmFwcGVuZENoaWxkKCRydWxlckMkJC4kYSQpO1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCRjb250YWluZXIkJCk7XG5cdFx0XHRcdCRmYWxsYmFja1dpZHRoQSQkID0gJHJ1bGVyQSQkLiRhJC5vZmZzZXRXaWR0aDtcblx0XHRcdFx0JGZhbGxiYWNrV2lkdGhCJCQgPSAkcnVsZXJCJCQuJGEkLm9mZnNldFdpZHRoO1xuXHRcdFx0XHQkZmFsbGJhY2tXaWR0aEMkJCA9ICRydWxlckMkJC4kYSQub2Zmc2V0V2lkdGg7XG5cblx0XHRcdFx0JGNoZWNrRm9yVGltZW91dCQkKCk7XG5cblx0XHRcdFx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19vblJlc2l6ZSQkKCRydWxlckEkJCwgZnVuY3Rpb24oJHdpZHRoJCQxNCQkKSB7XG5cdFx0XHRcdFx0JHdpZHRoQSQkID0gJHdpZHRoJCQxNCQkO1xuXHRcdFx0XHRcdCRjaGVjayQkMSQkKCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdCRKU0NvbXBpbGVyX1N0YXRpY01ldGhvZHNfc2V0Rm9udCQkKCRydWxlckEkJCwgJEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19nZXRTdHlsZSQkKCR0aGF0JCQxJCQsICdcIicgKyAkdGhhdCQkMSQkLmZhbWlseSArICdcIixzYW5zLXNlcmlmJykpO1xuXHRcdFx0XHQkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uUmVzaXplJCQoJHJ1bGVyQiQkLCBmdW5jdGlvbigkd2lkdGgkJDE1JCQpIHtcblx0XHRcdFx0XHQkd2lkdGhCJCQgPSAkd2lkdGgkJDE1JCQ7XG5cdFx0XHRcdFx0JGNoZWNrJCQxJCQoKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19zZXRGb250JCQoJHJ1bGVyQiQkLCAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2dldFN0eWxlJCQoJHRoYXQkJDEkJCwgJ1wiJyArICR0aGF0JCQxJCQuZmFtaWx5ICsgJ1wiLHNlcmlmJykpO1xuXHRcdFx0XHQkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX29uUmVzaXplJCQoJHJ1bGVyQyQkLCBmdW5jdGlvbigkd2lkdGgkJDE2JCQpIHtcblx0XHRcdFx0XHQkd2lkdGhDJCQgPSAkd2lkdGgkJDE2JCQ7XG5cdFx0XHRcdFx0JGNoZWNrJCQxJCQoKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0JEpTQ29tcGlsZXJfU3RhdGljTWV0aG9kc19zZXRGb250JCQoJHJ1bGVyQyQkLCAkSlNDb21waWxlcl9TdGF0aWNNZXRob2RzX2dldFN0eWxlJCQoJHRoYXQkJDEkJCwgJ1wiJyArICR0aGF0JCQxJCQuZmFtaWx5ICsgJ1wiLG1vbm9zcGFjZScpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0ICRmb250ZmFjZSRPYnNlcnZlciQkO1xuIiwiIWZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0XCJmdW5jdGlvblwiID09IHR5cGVvZiBkZWZpbmUgJiYgZGVmaW5lLmFtZCA/IC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZSB1bmxlc3MgYW1kTW9kdWxlSWQgaXMgc2V0XG5cdGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHJvb3Quc3ZnNGV2ZXJ5Ym9keSA9IGZhY3RvcnkoKTtcblx0fSkgOiBcIm9iamVjdFwiID09IHR5cGVvZiBleHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOiByb290LnN2ZzRldmVyeWJvZHkgPSBmYWN0b3J5KCk7XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuXHQvKiEgc3ZnNGV2ZXJ5Ym9keSB2Mi4wLjMgfCBnaXRodWIuY29tL2pvbmF0aGFudG5lYWwvc3ZnNGV2ZXJ5Ym9keSAqL1xuXHRmdW5jdGlvbiBlbWJlZChzdmcsIHRhcmdldCkge1xuXHRcdC8vIGlmIHRoZSB0YXJnZXQgZXhpc3RzXG5cdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0Ly8gY3JlYXRlIGEgZG9jdW1lbnQgZnJhZ21lbnQgdG8gaG9sZCB0aGUgY29udGVudHMgb2YgdGhlIHRhcmdldFxuXHRcdFx0dmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLCB2aWV3Qm94ID0gIXN2Zy5nZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIpICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIpO1xuXHRcdFx0Ly8gY29uZGl0aW9uYWxseSBzZXQgdGhlIHZpZXdCb3ggb24gdGhlIHN2Z1xuXHRcdFx0dmlld0JveCAmJiBzdmcuc2V0QXR0cmlidXRlKFwidmlld0JveFwiLCB2aWV3Qm94KTtcblx0XHRcdC8vIGNvcHkgdGhlIGNvbnRlbnRzIG9mIHRoZSBjbG9uZSBpbnRvIHRoZSBmcmFnbWVudFxuXHRcdFx0Zm9yICgvLyBjbG9uZSB0aGUgdGFyZ2V0XG5cdFx0XHR2YXIgY2xvbmUgPSB0YXJnZXQuY2xvbmVOb2RlKCEwKTsgY2xvbmUuY2hpbGROb2Rlcy5sZW5ndGg7ICkge1xuXHRcdFx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZChjbG9uZS5maXJzdENoaWxkKTtcblx0XHRcdH1cblx0XHRcdC8vIGFwcGVuZCB0aGUgZnJhZ21lbnQgaW50byB0aGUgc3ZnXG5cdFx0XHRzdmcuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBsb2FkcmVhZHlzdGF0ZWNoYW5nZSh4aHIpIHtcblx0XHQvLyBsaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgcmVxdWVzdFxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGlmIHRoZSByZXF1ZXN0IGlzIHJlYWR5XG5cdFx0XHRpZiAoNCA9PT0geGhyLnJlYWR5U3RhdGUpIHtcblx0XHRcdFx0Ly8gZ2V0IHRoZSBjYWNoZWQgaHRtbCBkb2N1bWVudFxuXHRcdFx0XHR2YXIgY2FjaGVkRG9jdW1lbnQgPSB4aHIuX2NhY2hlZERvY3VtZW50O1xuXHRcdFx0XHQvLyBlbnN1cmUgdGhlIGNhY2hlZCBodG1sIGRvY3VtZW50IGJhc2VkIG9uIHRoZSB4aHIgcmVzcG9uc2Vcblx0XHRcdFx0Y2FjaGVkRG9jdW1lbnQgfHwgKGNhY2hlZERvY3VtZW50ID0geGhyLl9jYWNoZWREb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudChcIlwiKSxcblx0XHRcdFx0Y2FjaGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSB4aHIucmVzcG9uc2VUZXh0LCB4aHIuX2NhY2hlZFRhcmdldCA9IHt9KSwgLy8gY2xlYXIgdGhlIHhociBlbWJlZHMgbGlzdCBhbmQgZW1iZWQgZWFjaCBpdGVtXG5cdFx0XHRcdHhoci5fZW1iZWRzLnNwbGljZSgwKS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRcdC8vIGdldCB0aGUgY2FjaGVkIHRhcmdldFxuXHRcdFx0XHRcdHZhciB0YXJnZXQgPSB4aHIuX2NhY2hlZFRhcmdldFtpdGVtLmlkXTtcblx0XHRcdFx0XHQvLyBlbnN1cmUgdGhlIGNhY2hlZCB0YXJnZXRcblx0XHRcdFx0XHR0YXJnZXQgfHwgKHRhcmdldCA9IHhoci5fY2FjaGVkVGFyZ2V0W2l0ZW0uaWRdID0gY2FjaGVkRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbS5pZCkpLFxuXHRcdFx0XHRcdC8vIGVtYmVkIHRoZSB0YXJnZXQgaW50byB0aGUgc3ZnXG5cdFx0XHRcdFx0ZW1iZWQoaXRlbS5zdmcsIHRhcmdldCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0sIC8vIHRlc3QgdGhlIHJlYWR5IHN0YXRlIGNoYW5nZSBpbW1lZGlhdGVseVxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UoKTtcblx0fVxuXHRmdW5jdGlvbiBzdmc0ZXZlcnlib2R5KHJhd29wdHMpIHtcblx0XHRmdW5jdGlvbiBvbmludGVydmFsKCkge1xuXHRcdFx0Ly8gd2hpbGUgdGhlIGluZGV4IGV4aXN0cyBpbiB0aGUgbGl2ZSA8dXNlPiBjb2xsZWN0aW9uXG5cdFx0XHRmb3IgKC8vIGdldCB0aGUgY2FjaGVkIDx1c2U+IGluZGV4XG5cdFx0XHR2YXIgaW5kZXggPSAwOyBpbmRleCA8IHVzZXMubGVuZ3RoOyApIHtcblx0XHRcdFx0Ly8gZ2V0IHRoZSBjdXJyZW50IDx1c2U+XG5cdFx0XHRcdHZhciB1c2UgPSB1c2VzW2luZGV4XSwgc3ZnID0gdXNlLnBhcmVudE5vZGU7XG5cdFx0XHRcdGlmIChzdmcgJiYgL3N2Zy9pLnRlc3Qoc3ZnLm5vZGVOYW1lKSkge1xuXHRcdFx0XHRcdHZhciBzcmMgPSB1c2UuZ2V0QXR0cmlidXRlKFwieGxpbms6aHJlZlwiKTtcblx0XHRcdFx0XHRpZiAocG9seWZpbGwgJiYgKCFvcHRzLnZhbGlkYXRlIHx8IG9wdHMudmFsaWRhdGUoc3JjLCBzdmcsIHVzZSkpKSB7XG5cdFx0XHRcdFx0XHQvLyByZW1vdmUgdGhlIDx1c2U+IGVsZW1lbnRcblx0XHRcdFx0XHRcdHN2Zy5yZW1vdmVDaGlsZCh1c2UpO1xuXHRcdFx0XHRcdFx0Ly8gcGFyc2UgdGhlIHNyYyBhbmQgZ2V0IHRoZSB1cmwgYW5kIGlkXG5cdFx0XHRcdFx0XHR2YXIgc3JjU3BsaXQgPSBzcmMuc3BsaXQoXCIjXCIpLCB1cmwgPSBzcmNTcGxpdC5zaGlmdCgpLCBpZCA9IHNyY1NwbGl0LmpvaW4oXCIjXCIpO1xuXHRcdFx0XHRcdFx0Ly8gaWYgdGhlIGxpbmsgaXMgZXh0ZXJuYWxcblx0XHRcdFx0XHRcdGlmICh1cmwubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdC8vIGdldCB0aGUgY2FjaGVkIHhociByZXF1ZXN0XG5cdFx0XHRcdFx0XHRcdHZhciB4aHIgPSByZXF1ZXN0c1t1cmxdO1xuXHRcdFx0XHRcdFx0XHQvLyBlbnN1cmUgdGhlIHhociByZXF1ZXN0IGV4aXN0c1xuXHRcdFx0XHRcdFx0XHR4aHIgfHwgKHhociA9IHJlcXVlc3RzW3VybF0gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKSwgeGhyLm9wZW4oXCJHRVRcIiwgdXJsKSwgeGhyLnNlbmQoKSxcblx0XHRcdFx0XHRcdFx0eGhyLl9lbWJlZHMgPSBbXSksIC8vIGFkZCB0aGUgc3ZnIGFuZCBpZCBhcyBhbiBpdGVtIHRvIHRoZSB4aHIgZW1iZWRzIGxpc3Rcblx0XHRcdFx0XHRcdFx0eGhyLl9lbWJlZHMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0c3ZnOiBzdmcsXG5cdFx0XHRcdFx0XHRcdFx0aWQ6IGlkXG5cdFx0XHRcdFx0XHRcdH0pLCAvLyBwcmVwYXJlIHRoZSB4aHIgcmVhZHkgc3RhdGUgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdFx0XHRcdGxvYWRyZWFkeXN0YXRlY2hhbmdlKHhocik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyBlbWJlZCB0aGUgbG9jYWwgaWQgaW50byB0aGUgc3ZnXG5cdFx0XHRcdFx0XHRcdGVtYmVkKHN2ZywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gaW5jcmVhc2UgdGhlIGluZGV4IHdoZW4gdGhlIHByZXZpb3VzIHZhbHVlIHdhcyBub3QgXCJ2YWxpZFwiXG5cdFx0XHRcdFx0KytpbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gY29udGludWUgdGhlIGludGVydmFsXG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUob25pbnRlcnZhbCwgNjcpO1xuXHRcdH1cblx0XHR2YXIgcG9seWZpbGwsIG9wdHMgPSBPYmplY3QocmF3b3B0cyksIG5ld2VySUVVQSA9IC9cXGJUcmlkZW50XFwvWzU2N11cXGJ8XFxiTVNJRSAoPzo5fDEwKVxcLjBcXGIvLCB3ZWJraXRVQSA9IC9cXGJBcHBsZVdlYktpdFxcLyhcXGQrKVxcYi8sIG9sZGVyRWRnZVVBID0gL1xcYkVkZ2VcXC8xMlxcLihcXGQrKVxcYi87XG5cdFx0cG9seWZpbGwgPSBcInBvbHlmaWxsXCIgaW4gb3B0cyA/IG9wdHMucG9seWZpbGwgOiBuZXdlcklFVUEudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSB8fCAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaChvbGRlckVkZ2VVQSkgfHwgW10pWzFdIDwgMTA1NDcgfHwgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2god2Via2l0VUEpIHx8IFtdKVsxXSA8IDUzNztcblx0XHQvLyBjcmVhdGUgeGhyIHJlcXVlc3RzIG9iamVjdFxuXHRcdHZhciByZXF1ZXN0cyA9IHt9LCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHNldFRpbWVvdXQsIHVzZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVzZVwiKTtcblx0XHQvLyBjb25kaXRpb25hbGx5IHN0YXJ0IHRoZSBpbnRlcnZhbCBpZiB0aGUgcG9seWZpbGwgaXMgYWN0aXZlXG5cdFx0cG9seWZpbGwgJiYgb25pbnRlcnZhbCgpO1xuXHR9XG5cdHJldHVybiBzdmc0ZXZlcnlib2R5O1xufSk7XG4iXX0=
