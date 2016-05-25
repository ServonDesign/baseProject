import {sum, square, variable, MyClass} from "./import";

console.log(sum(1));

console.log(square(variable));

var test = new MyClass({
	name: 'hello name',
	enrollmentNo: '123'
});

console.log(test.getName());
