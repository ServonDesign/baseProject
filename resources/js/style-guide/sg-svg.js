(function(){
	"use strict";

	var copyarea,
		svgList,
		spriteUrl,
		output;

	function init(){
		svgList = document.querySelector('.svg-list');
		copyarea = document.querySelector('.js-copyarea');
		output = document.querySelector('.js-output');

		spriteUrl = svgList.getAttribute('data-sprite-url');

		svgList.addEventListener('click', handleSvgNameCopy);
	}

	function handleSvgNameCopy(evt){
		if(!evt.target.classList.contains('svg-item')){
			return;
		}
		var target = evt.target.querySelector('.js-svg-name');
		var name = target.innerHTML;
		copyarea.innerHTML = '<svg><use xlink:href="'+spriteUrl+name+'" /></svg>';
		copyarea.select();
		var success = document.execCommand('copy');
		if(success){
			output.innerHTML = 'copied: '+name;
		}else{
			output.innerHTML = 'failed';
		}
	}

	window.addEventListener('load', init);
})();
