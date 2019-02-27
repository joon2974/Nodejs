/*var M = {
  v: 'v',
  f:function(){
    console.log(this.v);
  }
}
*/

var part = require('./mpart.js')
console.log(part);
//part = {v: 'v', f: [Function: f]}
part.f();
//=M.f();
