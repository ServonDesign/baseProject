import {extend} from './../util/util';

'use strict';

const transitionEndName = ['webkitTransitionEnd', 'transitionend', 'msTransitionEnd', 'oTransitionEnd'];

const DismissibleSlideIn = {
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

function createSlideIn(el, options){
	const slideIn = Object.create(DismissibleSlideIn);
	slideIn.init(el, options);
	return slideIn;
}

function init(el, options){
	if(!el){
		return;
	}

	this.defaultOptions = {
		isRight: false,
		closeButtonClass: 'ds-slidein__action ds-slidein__action--close',
		closeButtonHtml: 'x'
	};

	this.options = extend({}, this.defaultOptions, this.options, options);

	this.el = el;
	if(typeof this.el === "string"){
		this.el = document.querySelector(this.el);
	}

	if(!this.el.classList.contains('ds-slidein')){
		this.el.classList.add('ds-slidein');
	}

	this.isRight = this.options.isRight;
	if(this.isRight){
		this.el.classList.add('ds-slidein--right');
	}

	this.container = this.el.querySelector('.ds-slidein__container');
	if(!this.container){
		buildContainer.call(this);
	}

	this.hideButtonEl = this.el.querySelector('.ds-slidein__action--close');
	if(!this.hideButtonEl){
		buildHideButton.call(this);
	}

	this.show 				= this.show.bind(this);
	this.hide 				= this.hide.bind(this);
	this.blockClicks 		= this.blockClicks.bind(this);
	this.onStart 			= this.onStart.bind(this);
	this.onMove 			= this.onMove.bind(this);
	this.onEnd 				= this.onEnd.bind(this);
	this.onTransitionEnd 	= this.onTransitionEnd.bind(this);
	this.update 			= this.update.bind(this);
	this.destroy 			= this.destroy.bind(this);

	this.startX = 0;
	this.currentX = 0;
	this.touchingNav = false;

	this.addEventListeners();
}

function buildContainer(){
	const wrapContent = this.el.firstElementChild;
	const container = document.createElement('div');
	container.className = "ds-slidein__container";
	wrapContent.parentNode.insertBefore(container, wrapContent);
	container.appendChild(wrapContent);
	this.container = container;
}

function buildHideButton(){
	const button = document.createElement('button');
	button.className = this.options.closeButtonClass;
	button.innerHTML = this.options.closeButtonHtml;
	this.container.insertBefore(button, this.container.firstElementChild);
	this.hideButtonEl = button;
}

function addEventListeners(){
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

function removeEventListeners(){
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

function onStart(evt){
	if(!this.el.classList.contains('ds-slidein--visible') || this.destroyed){
		return;
	}

	this.startX =evt.touches[0].pageX;
	//this.startX = evt.pageX || evt.touches[0].pageX;
	this.currentX = this.startX;

	this.touchingNav = true;
	requestAnimationFrame(this.update);
}

function onMove(evt){
	if(!this.touchingNav){
		return;
	}

	this.currentX =evt.touches[0].pageX;
	//this.currentX = evt.pageX || evt.touches[0].pageX;
	let translateX = this.currentX - this.startX;
	if(
		(this.isRight && Math.max(0, translateX) > 0) ||
		(!this.isRight && Math.min(0,translateX) < 0)
	){
		evt.preventDefault();
	}
}

function onEnd(){
	if(!this.touchingNav){
		return;
	}

	this.touchingNav = false;

	let translateX = this.currentX - this.startX;
	if(
		(this.isRight && Math.max(0, translateX) > 0) ||
		(!this.isRight && Math.min(0, translateX) < 0)
	){
		this.hide();
	}
	this.container.style.transform = '';
}

function update(){
	if(!this.touchingNav){
		return;
	}

	requestAnimationFrame(this.update);
	let translateX = this.currentX - this.startX;
	if(this.isRight){
		translateX = Math.max(0, translateX);
	}else{
		translateX = Math.min(0, translateX);
	}

	this.container.style.transform = `translateX(${translateX}px)`;
}

function destroy(){
	if(this.isRight){
		this.el.classList.remove('ds-slidein--right');
	}
	this.removeEventListeners();
	this.destroyed = true;
}

function blockClicks(evt){
	evt.stopPropagation();
}

function onTransitionEnd(){
	this.el.classList.remove('ds-slidein--animatable');
	for (let i = 0; i < transitionEndName.length; i++) {
		this.el.removeEventListener(transitionEndName[i], this.onTransitionEnd);
	}

}

function show(){
	if(this.destroyed){
		return;
	}
	this.el.classList.add('ds-slidein--animatable');
	this.el.classList.add('ds-slidein--visible');
	for (let i = 0; i < transitionEndName.length; i++) {
		this.el.addEventListener(transitionEndName[i], this.onTransitionEnd);
	}
}

function hide(){
	if(this.destroyed){
		return;
	}
	this.el.classList.add('ds-slidein--animatable');
	this.el.classList.remove('ds-slidein--visible');
	for (let i = 0; i < transitionEndName.length; i++) {
		this.el.addEventListener(transitionEndName[i], this.onTransitionEnd);
	}
}

export default createSlideIn;
