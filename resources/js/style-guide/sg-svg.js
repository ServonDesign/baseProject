(function(){
	"use strict";
	
	var copyarea,
		svgname,
		output;

	function init(){
		svgname = $('.svg-item');
		copyarea = $('.js-copyarea');
		output = $('.js-output');

		svgname.on('click', handleSvgNameCopy);
	}

	function handleSvgNameCopy(e){
		var target = $(e.target).closest('.svg-item').find('.js-svg-name');
		var name = target.html();
		copyarea.val('<svg><use xlink:href="'+name+'" /></svg>');
		copyarea.select();
		var success = document.execCommand('copy');
		if(success){
			output.html('copied: '+name);
		}else{
			output.html('failed');
		}
	}

	$(document).ready(init);
})();