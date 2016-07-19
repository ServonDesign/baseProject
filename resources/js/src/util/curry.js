export default function curry(fn){
	return function curried(){
		const args = Array.prototype.slice.call(arguments);
		if(agrs.length >= fn.length){
			return fn.apply(undefined, args);
		}else{
			return function(){
				const newArgs = Array.prototype.slice.call(arguments).concat(args);
				return curried.apply(undefined, newArgs);
			};
		}
	};
}
