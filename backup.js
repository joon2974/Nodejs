//사용할 Modules
var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}

function templateList(fileList){
  //list를 자동으로 생성후 리턴
  var i = 0;
  var list = '<ul>';
  //반복문으로 file리스트 자동 생성
  while(i < fileList.length){
    list = list + `<li><a = href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
    i++;
  }
  list = list + '</ul>';

  return list;
}

function makeTemplate(queryData, response){
  //data폴더에서 데이터를 가져온 후 function실행
  //fileList = [CSS, HTML, JavaScript]
  fs.readdir('./data', function(error, fileList){
  //data디렉토리의 querydata.id파일을 utf-8형식으로 불러와
  //description에 저장해라
  var title = queryData.id;

  //Web버튼 눌렀을 때(home)
  if(title === undefined){
    var title = 'Welcome';
    var description = "Hello, Node.js";
    var list = templateList(fileList);
    var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
    response.writeHead(200);
    //Web Page에 내용 출력
    response.end(template);
  //Home이외의 page
  }else{
    fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
      //객체의 key값으로 값을 받아옴 ex){id : HTML} -> HTML추출
      var title = queryData.id;
      var list = templateList(fileList);
      var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
      response.writeHead(200);
      //Web Page에 내용 출력
      response.end(template);
    });
  }
  });
}

var app = http.createServer(function(request,response){
  //Query String을 뽑아옴
    var _url = request.url;
    //Query String을 파싱해서 객체로 ex)query: {id : HTML}
    //.query -> {id : HTML}
    var queryData = url.parse(_url, true).query;
    //url parsing 값에서 pathname을 추출
    var pathname = url.parse(_url, true).pathname;

    //정해진 경로로 들어가면 pathname은 전부'/'
    if(pathname === '/'){
      makeTemplate(queryData, response);
    //정해진 형식 의외의 입력
    } else{
      //파일을 찾을 수 없을때는 404를 서버가 리턴 해줌
      response.writeHead(404);
      //Web Page에 내용 출력
      response.end('Not found');
    }


});
app.listen(3000);
