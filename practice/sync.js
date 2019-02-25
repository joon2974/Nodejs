var fs = require('fs');

/*
//readFileSync -> return 값을 준다
console.log('A');
var result = fs.readFileSync('practice/sample1.txt', 'utf-8');
console.log(result);
console.log('C');
//결과값 : A B C
*/

//readFile -> return 값이 없다
console.log('A');
//function의 err는 에러가 있다면 에러가 들어가고
//result에는 결과값을 전달해준다
fs.readFile('practice/sample1.txt', 'utf-8', function(err, result){
  console.log(result);
});
console.log('C');
//결과값 : A C B
