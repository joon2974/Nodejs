var testFolder = './data';
//File system 모듈 사용
var fs = require('fs');

//testFolser의 파일들을 fileList에 배열로 정리
fs.readdir(testFolder, function(error, fileList){
  console.log(fileList);
});
