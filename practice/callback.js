/*
function a(){
  console.log('A');
}
//결과값 : A
*/
var a = function(){
  console.log('A');
}
//변수 뒤에 괄호를 넣음으로서 변수의 함수를 호출할 수 있다!!!
//a();
//결과값 : A

//slowfunc끝나고 callback에 콜백을 함
function slowfunc(callback){
  callback();
}
slowfunc(a);
