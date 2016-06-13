'use strict';

const modals = [],
	modalIDs = [];

let	visibleClass = "modal--visible";

function init(toInitModals){
	if(toInitModals){
		initModals();
	}
	addEventListeners();
}

function initModals(){
	getModals();
}

function addEventListeners(){
	document.addEventListener('click', show.bind(this));
	document.addEventListener('click', hide.bind(this));
}

function getModals(){
	const modals = Array.prototype.slice.call(document.querySelectorAll('.js-modal'));
	for (var i = 0; i < modals.length; i++) {
		addModal(modals[i]);
	}
}

function addModal(el){
	modals.push(el);
	const modalID = el.getAttribute('id') || el.getAttribute('data-id');
	modalIDs.push(modalID);
}

function setVisibleClass(visClass){
	visibleClass = visClass;
}

function isNotModalLink(el){
	return !el.classList.contains('js-modal-link') && !el.getAttribute('data-modal-id');
}

function show(evt){
	if(isNotModalLink(evt.target) || !modals.length){
		return;
	}

	evt.preventDefault();

	let modalID;
	if(evt.target.getAttribute('href')){
		modalID = evt.target.getAttribute('href').replace('#', '');
	}else{
		modalID = evt.target.getAttribute('data-modal-id');
	}
	const index = modalIDs.indexOf(modalID);
	const modal = modals[index];
	if(modal){
		modal.classList.add(visibleClass);
	}
}

function hide(evt){
	if(!evt.target.classList.contains('modal__close-btn') &&
		!evt.target.classList.contains('modal') &&
		!evt.target.classList.contains('modal__container')
		){
		return;
	}

	if(evt.target.classList.contains('modal__container')){
		evt.stopPropagation();
		return;
	}

	evt.preventDefault();

	let modal;

	if(evt.target.classList.contains('modal__close-btn')){
		modal = evt.target.closest('.modal');
	}else{
		modal = evt.target;
	}

	modal.classList.remove(visibleClass);
}

export default {
	init: init,
	initModals: initModals,
	addModal: addModal,
	setVisibleClass: setVisibleClass
};
