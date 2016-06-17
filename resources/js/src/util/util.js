"use strict";

const animationEndEventName = ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oAnimationEnd'];

function onEndAnimation(el, callback){
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

	if(!el){
		return;
	}

	for (let i = 0; i < animationEndEventName.length; i++) {
		el.addEventListener(animationEndEventName[i], onEndCallbackFn);
	}
}

function extend(){
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


export {onEndAnimation, extend};
