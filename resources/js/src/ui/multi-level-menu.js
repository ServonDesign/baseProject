import createSlideIn from './dismissible-slidein';

'use strict';

const animationEndEventName = ['animationend'];//, 'webkitAnimationEnd', 'MSAnimationEnd', 'oAnimationEnd'];

const util = {
	onEndAnimation: function(el, callback){
		const onEndCallbackFn = function(evt){
			if(evt.target !== this){
				return;
			}
			for (let i = 0; i < animationEndEventName.length; i++) {
				this.removeEventListener(animationEndEventName[i], onEndCallbackFn);
			}
			if(callback && typeof callback === 'function'){
				callback.call();
			}
		};
		for (let i = 0; i < animationEndEventName.length; i++) {
			el.addEventListener(animationEndEventName[i], onEndCallbackFn);
		}
	},
	extend: function(){
		const objects = arguments;
		if(objects.length < 2){
			return objects[0];
		}
		const combinedObject = objects[0];

		for(let i = 1; i < objects.length; i++){
			if(!objects[i]){
				continue;
			}
			for(let key in objects[i]){
				combinedObject[key] = objects[i][key];
			}
		}

		return combinedObject;
	}
};

const MlMenu = {
	init: init,

	back: back,
	linkClick: linkClick,

	openSubMenu: openSubMenu,
	menuOut: menuOut,
	menuIn: menuIn,
	addBreadcrumb: addBreadcrumb,
	breadcrumbClick: breadcrumbClick,
	appendBreadCrumb: appendBreadCrumb,

	addEventListeners: addEventListeners,
	removeEventListeners: removeEventListeners
}

function createMlMenu(el, options){
	const menu = Object.create(MlMenu);
	menu.init(el, options);
	return menu;
}

function init(el, options){
	if(!el){
		return;
	}

	this.menuEl = el;
	if(typeof this.menuEl === "string"){
		this.menuEl = document.querySelector(this.menuEl);
	}

	if(!this.menuEl){
		return;
	}

	this.defaultOptions = {
		breadcrumbsCtrl: true,
		initialBreadcrumb: 'all',
		breadcrumbMaxLength: 15,
		backCtrl: true,
		itemsDelayInterval: 60,
		onItemClick: null,
		side: 'left',
		isRight: false,
		clone: false
	};

	this.options = util.extend({}, this.defaultOptions, this.options, options);

	if(this.options.side == 'right'){
		this.options.isRight = true;
	}else{
		this.options.isRight = false;
	}

	cloneNav.call(this);

	if(!this.menuEl.classList.contains('ml-menu')){
		this.menuEl.classList.add('ml-menu');
	}

	if(typeof createSlideIn !== "undefined"){
		this.slideInController = createSlideIn(this.menuEl, this.options);
		this.menuContainer = this.slideInController.container;
	}else{
		this.menuContainer = this.menuEl;
	}

	this.breadcrumbsToPrepend = [];
	this.breadcrumbSiblingsToRemove = null;
	this.current = 0;

	this.back 				= this.back.bind(this);
	this.linkClick			= this.linkClick.bind(this);
	this.breadcrumbClick 	= this.breadcrumbClick.bind(this);
	this.appendBreadCrumb	= this.appendBreadCrumb.bind(this);

	build.call(this);

	this.menusArr[this.current].menuEl.classList.add('ml-menu__level--current');

	this.addEventListeners();
}

function cloneNav(){
	if(!this.options.clone){
		return;
	}

	const clonedNode = this.menuEl.cloneNode(true);
	const body = document.querySelector('body');
	body.insertBefore(clonedNode, body.firstElementChild);
	clonedNode.className = "";
	this.menuEl = clonedNode;
}

function build(){
	function init(){
		sortMenus.call(this);
		flattenAndWrapMenus.call(this);
		createBackButton.call(this);
		createBreadCrumbs.call(this);
		createSubNavLinks.call(this);
	}

	function sortMenus(){
		const setLinkData = function(element){
			const links = Array.prototype.slice.call(element.parentNode.querySelectorAll('.ml-menu__level > li > a:not(.ml-menu__link)'));
			let pos = 0;
			for (let i = 0; i < links.length; i++, pos++) {
				if(links[i].classList.contains('ml-menu__link')){
					pos--;
					continue;
				}
				links[i].classList.add('ml-menu__link');
				links[i].setAttribute('data-pos', pos + 1);
			}
			return links;
		};

		let setMenus = function(menu, parentPositionName){
			menu.className = "ml-menu__level";
			const linkSibling = menu.parentNode.querySelector('[data-pos]');
			let currentPosition = linkSibling.getAttribute('data-pos');

			let menuName = "";
			if(parentPositionName){
				menuName = parentPositionName + '-';
			}
			menuName += currentPosition;

			menu.setAttribute('data-menu', "menu-"+menuName);
			linkSibling.setAttribute('data-submenu', "menu-"+menuName);
			const menuItems = setLinkData(menu);

			this.menus.push(menu);
			this.menusArr.push({
				menuEl: menu,
				menuItems: menuItems
			});

			const subMenus = Array.prototype.slice.call(menu.parentNode.querySelectorAll('.ml-menu__level > li > ul:not(.ml-menu__level)'));
			for (let i = 0; i < subMenus.length; i++) {
				if(subMenus[i].classList.contains('ml-menu__level')){
					continue;
				}
				setMenus(subMenus[i], menuName);
			}
		};
		setMenus = setMenus.bind(this);

		this.menus = [];
		this.menusArr = [];

		const mainMenu = this.menuEl.querySelector('ul');
		mainMenu.setAttribute('data-menu', 'main');
		mainMenu.className = "ml-menu__level ml-menu__level--current";
		const mainMenuItems = setLinkData(mainMenu);

		this.menus.push(mainMenu);
		this.menusArr.push({
			menuEl: mainMenu,
			menuItems: mainMenuItems
		});

		const subMenus = Array.prototype.slice.call(mainMenu.parentNode.querySelectorAll('.ml-menu__level > li > ul'));
		for (let i = 0; i < subMenus.length; i++) {
			setMenus(subMenus[i]);
		}
	}

	function flattenAndWrapMenus(){
		const wrapper = document.createElement('div');
		wrapper.className = 'ml-menu__wrap';
		for (let i = 0; i < this.menusArr.length; i++) {
			wrapper.appendChild(this.menusArr[i].menuEl);
		}
		this.menuContainer.appendChild(wrapper);
	}

	function createBackButton(){
		if(this.options.backCtrl){
			this.backCtrl = document.createElement('button');
			this.backCtrl.className = 'ml-menu__action ml-menu__action--back ml-menu__action--hide';
			this.backCtrl.setAttribute('aria-label', 'Go back');
			this.backCtrl.innerHTML = '<';
			this.menuContainer.insertBefore(this.backCtrl, this.menuContainer.firstChild);
		}
	}

	function createBreadCrumbs(){
		if(this.options.breadcrumbsCtrl){
			this.breadcrumbsCtrl = document.createElement('nav');
			this.breadcrumbsCtrl.className = 'ml-menu__breadcrumbs';
			this.menuContainer.insertBefore(this.breadcrumbsCtrl, this.menuContainer.firstChild);
			// add initial breadcrumb
			this.addBreadcrumb(0);
		}
	}

	function createSubNavLinks(){
		const subNavLinks = Array.prototype.slice.call(this.menuContainer.querySelectorAll('[data-submenu]'));
		subNavLinks.forEach(function(link){
			const subNavLink = document.createElement('a');
			subNavLink.className = 'ml-menu__link--subnav';
			subNavLink.href = '#';
			link.parentNode.appendChild(subNavLink);
		}.bind(this));
	}

	init.call(this);
}

function addEventListeners(){
	this.menuContainer.addEventListener('click', this.linkClick);

	if(this.options.breadcrumbsCtrl){
		this.breadcrumbsCtrl.addEventListener('click', this.breadcrumbClick);
	}

	if(this.options.backCtrl){
		this.backCtrl.addEventListener('click', this.back);
	}
}

function removeEventListeners(){
	this.menuContainer.removeEventListener('click', this.linkClick);

	if(this.options.breadcrumbsCtrl){
		this.breadcrumbsCtrl.addEventListener('click', this.breadcrumbClick);
	}

	if(this.options.backCtrl){
		this.backCtrl.removeEventListener('click', this.back);
	}
}

function linkClick(evt){
	if(
		!evt.target.classList.contains('ml-menu__link') &&
		!evt.target.classList.contains('ml-menu__link--subnav')
	){
		return;
	}

	const submenuTarget = evt.target.previousElementSibling,
		submenu = submenuTarget ? submenuTarget.getAttribute('data-submenu') : '',
		itemName = submenuTarget ? submenuTarget.innerHTML : evt.target.innerHTML,
		pos = submenuTarget ? submenuTarget.getAttribute('data-pos') : evt.target.getAttribute('data-pos'),
		subMenuEl = this.menuEl.querySelector('ul[data-menu="' + submenu + '"]');

	if(submenu && subMenuEl){
		evt.preventDefault();

		this.openSubMenu(subMenuEl, pos, itemName);
	}else{
		const currentLink = this.menuEl.querySelector('.ml-menu__link--current');
		if(currentLink){
			currentLink.classList.remove('ml-menu__link--current');
		}

		evt.target.classList.add('ml-menu__link--current');

		if(this.options.onItemClick){
			this.options.onItemClick(evt, itemName);
		}
	}
}

function back(){
	if(this.isBackAnimating){
		return false;
	}
	this.isBackAnimating = true;
	// current menu slides out
	this.menuOut();
	// next menu (previous menu) slides in
	const backMenu = this.menusArr[this.menusArr[this.current].backIdx].menuEl;
	this.menuIn(backMenu);

	// remove last breadcrumb
	if(this.options.breadcrumbsCtrl){
		this.breadcrumbsCtrl.removeChild(this.breadcrumbsCtrl.lastElementChild);
	}
}

function openSubMenu(subMenuEl, clickPosition, subMenuName){
	if(this.isAnimating){
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

function breadcrumbClick(evt){
	evt.preventDefault();

	const breadcrumb = evt.target;
	const index = breadcrumb.getAttribute('data-index');
	if(!index){
		return false;
	}
	// do nothing if this breadcrumb is the last one in the list of breadcrumbs
	if(!breadcrumb.nextSibling || this.isAnimating){
		return false;
	}
	this.isAnimating = true;

	// current menu slides out
	this.menuOut();
	// next menu slides in
	const nextMenu = this.menusArr[index].menuEl;
	this.menuIn(nextMenu);

	// remove breadcrumbs that are ahead
	let siblingNode = breadcrumb.nextSibling;
	while(siblingNode){
		this.breadcrumbsCtrl.removeChild(siblingNode);
		siblingNode = breadcrumb.nextSibling;
	}
}

function menuOut(clickPosition){
	const currentMenu = this.menusArr[this.current].menuEl,
		isBackNavigation = typeof clickPosition === "undefined" ? true : false,
		menuItems = this.menusArr[this.current].menuItems,
		menuItemsTotal = menuItems.length,
		farthestIdx = clickPosition <= menuItemsTotal/2 || isBackNavigation ? menuItemsTotal - 1 : 0;

	menuItems.forEach(function(link, pos) {
		let itemPos = link.getAttribute('data-pos');
		let item = link.parentNode;
		item.style.WebkitAnimationDelay = item.style.animationDelay = isBackNavigation ? parseInt(itemPos * this.options.itemsDelayInterval) + 'ms' : parseInt(Math.abs(clickPosition - itemPos) * this.options.itemsDelayInterval) + 'ms';
	}.bind(this));

	util.onEndAnimation(menuItems[farthestIdx].parentNode, function(){
		this.isBackAnimating = false;
	}.bind(this));

	currentMenu.classList.add(!(!isBackNavigation ^ !this.options.isRight) ? 'animate-outToRight' : 'animate-outToLeft');
}

function menuIn(nextMenuEl, clickPosition){
	// the current menu
	const currentMenu = this.menusArr[this.current].menuEl,
		isBackNavigation = typeof clickPosition === 'undefined' ? true : false,
		// index of the nextMenuEl
		nextMenuIdx = this.menus.indexOf(nextMenuEl),

		nextMenuItems = this.menusArr[nextMenuIdx].menuItems,
		nextMenuItemsTotal = nextMenuItems.length,

		// we need to reset the classes once the last item animates in
		// the "last item" is the farthest from the clicked item
		// let's calculate the index of the farthest item
		farthestIdx = clickPosition <= nextMenuItemsTotal/2 || isBackNavigation ? nextMenuItemsTotal - 1 : 0;

	// slide in next menu items - first, set the delays for the items
	nextMenuItems.forEach(function(link, pos) {
		let itemPos = link.getAttribute('data-pos');
		let item = link.parentNode;
		item.style.WebkitAnimationDelay = item.style.animationDelay = isBackNavigation ? parseInt(itemPos * this.options.itemsDelayInterval) + 'ms' : parseInt(Math.abs(clickPosition - itemPos) * this.options.itemsDelayInterval) + 'ms';
	}.bind(this));

	util.onEndAnimation(nextMenuItems[farthestIdx].parentNode, function(){
		currentMenu.classList.remove(!(!isBackNavigation ^ !this.options.isRight) ? 'animate-outToRight' : 'animate-outToLeft');
		currentMenu.classList.remove('ml-menu__level--current');
		nextMenuEl.classList.remove(!(!isBackNavigation ^ !this.options.isRight) ? 'animate-inFromLeft' : 'animate-inFromRight');
		nextMenuEl.classList.add('ml-menu__level--current');

		//reset current
		this.current = nextMenuIdx;

		// control back button and breadcrumbs navigation elements
		if(!isBackNavigation){
			// show back button
			if(this.options.backCtrl){
				this.backCtrl.classList.remove('ml-menu__action--hide');
			}

			// add breadcrumb
			this.addBreadcrumb(nextMenuIdx);
		}else if(this.current === 0 && this.options.backCtrl){
			// hide back button
			this.backCtrl.classList.add('ml-menu__action--hide');
		}

		// we can navigate again..
		this.isAnimating = false;
	}.bind(this));

	// animation class
	nextMenuEl.classList.add(!(!isBackNavigation ^ !this.options.isRight) ? 'animate-inFromLeft' : 'animate-inFromRight')
}

function addBreadcrumb(index){
	if(!this.options.breadcrumbsCtrl){
		return false;
	}

	const bc = document.createElement('a');
	let breadcrumbName = index ? this.menusArr[index].name : this.options.initialBreadcrumb;
	if(breadcrumbName.length > this.options.breadcrumbMaxLength){
		breadcrumbName = breadcrumbName.substring(0, this.options.breadcrumbMaxLength).trim()+'...';
	}
	bc.innerHTML = breadcrumbName;
	bc.setAttribute('data-index', index);
	this.breadcrumbsToPrepend.push(bc);
	requestAnimationFrame(this.appendBreadCrumb);
}

function appendBreadCrumb(){
	for (var i = 0; i < this.breadcrumbsToPrepend.length; i++) {
		this.breadcrumbsCtrl.appendChild(this.breadcrumbsToPrepend[i]);
	}
	this.breadcrumbsToPrepend = [];
}

export default createMlMenu;
