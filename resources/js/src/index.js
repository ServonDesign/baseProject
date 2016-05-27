import poly from "./util/polyfills";
import {sum} from "./import";

import curry from "../vendor/ramda/curry";
import Bricks from "../vendor/brick";

//const add = (a, b) => a + b;

const add = curry(sum);
var increment = add(1);

console.log(increment(10));

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

const sizes = [
  { columns: 2, gutter: 10 },                   // assumed to be mobile, because of the missing mq property
  { mq: '768px', columns: 3, gutter: 25 },
  { mq: '1024px', columns: 4, gutter: 50 }
]

// create an instance

const instance = Bricks({
  container: '.container',
  packed:    'data-packed',        // if not prefixed with 'data-', it will be added
  sizes:     sizes
})

// bind callbacks

instance
  .on('pack',   () => console.log('ALL grid items packed.'))
  .on('update', () => console.log('NEW grid items packed.'))
  .on('resize', size => console.log('The grid has be re-packed to accommodate a new BREAKPOINT.'))

// start it up, when the DOM is ready
// note that if images are in the grid, you may need to wait for document.readyState === 'complete'

document.addEventListener('DOMContentLoaded', event => {
  instance
    .resize(true)     // bind resize handler
    .pack()           // pack initial items
})
