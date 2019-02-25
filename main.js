//사용할 Modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
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
    ${control}
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

//request: 요청할때 보낸 정보, response: 응답할때 들어오는 정보
var app = http.createServer(function(request,response){
  //Query String을 뽑아옴
    var _url = request.url;
    //Query String을 파싱해서 객체로 ex)query: {id : HTML}
    //.query -> {id : HTML}
    var queryData = url.parse(_url, true).query;
    //url parsing 값에서 pathname을 추출
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      //Web을 눌렀을 때(home)
      if(queryData.id === undefined){
        //data폴더에서 데이터를 가져온 후 function실행
        //fileList = [CSS, HTML, JavaScript]
        fs.readdir('./data', function(error, fileList){
          var title = 'Welcome';
          var description = "Hello, Node.js";
          var list = templateList(fileList);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
          response.writeHead(200);
          //Web Page에 내용 출력
          response.end(template);
        })
        //home 이외의 page
      }else{
        fs.readdir('./data', function(error, fileList){
        //data디렉토리의 querydata.id파일을 utf-8형식으로 불러와
        //description에 저장해라
          fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
            //객체의 key값으로 값을 받아옴 ex){id : HTML} -> HTML추출
            var title = queryData.id;
            var list = templateList(fileList);
            //일반 page에는 create, update, delete 세 버튼이 다 있어야 함
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>
            `);
            //delete 작업의 경우 url로 넘겨주면 보안문제때문에 form으로 바로 넘겨줘서 처리
            response.writeHead(200);
            //Web Page에 내용 출력
            response.end(template);
          });
        });
      }
  //create 버튼 눌렀을 때
  } else if(pathname === '/create'){
    fs.readdir('./data', function(error, fileList){
      var title = 'WEB - create';
      var list = templateList(fileList);
      var template = templateHTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `, '');
      response.writeHead(200);
      //Web Page에 내용 출력
      response.end(template);
    })
  //create_process 처리 (위에서 입력내용을 post로 전송한 곳)
  } else if(pathname === '/create_process'){
    var body = '';
    //data들어올때마가 function 콜백하며 body에다가 data를 추가
    request.on('data', function(data){
      body = body + data;
    });
    //더이상 들어올 data가 없으면 밑의 function을 콜백, 수신끝
    request.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      //file을 생성 : data dir에 title이라는 이름, description이라는 내용으로
      fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
        //file생성후 callback 들어오면 생성된 파일로 redirection 시킴
        //302는 리디렉션 코드
        response.writeHead(302, {Location : `/?id=${title}`});
        response.end();
      });
    });
  //update버튼 눌렀을 때
  } else if(pathname === '/update'){
    //list목록 구현
    fs.readdir('./data', function(error, fileList){
    //data디렉토리의 querydata.id파일을 utf-8형식으로 불러와
    //description에 저장해라
      fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
        //객체의 key값으로 값을 받아옴 ex){id : HTML} -> HTML추출
        var title = queryData.id;
        var list = templateList(fileList);
        var template = templateHTML(title, list, `
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
          //form action -> 이 폼을 action에서 지정한 곳으로 보내라
          //hidden은 타이틀을 바꿔버리면 어떤것을 바꾸는건지 지정이 어렵기 때문에 id를 부여
        response.writeHead(200);
        //Web Page에 내용 출력
        response.end(template);
      });
    });
  } else if(pathname === '/update_process'){
    var body = '';
    //data들어올때마가 function 콜백하며 body에다가 data를 추가
    request.on('data', function(data){
      body = body + data;
    });
    //더이상 들어올 data가 없으면 밑의 function을 콜백, 수신끝
    request.on('end', function(){
      //querystring모듈 사용하여 전송받은 body를 파싱
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      //원래 id로 돼있던 파일명을 title로 변경
      fs.rename(`data/${id}`, `data/${title}`, function(err){
        //전송 받은 file내용 변경
        fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
          //data폴더의 title파일내용을 description으로 바꾸고 밑의 함수 callback
          response.writeHead(302, {Location : `/?id=${title}`});
          response.end();
        });
      })
    });
  } else if(pathname === '/delete_process'){
    var body = '';
    //data들어올때마가 function 콜백하며 body에다가 data를 추가
    request.on('data', function(data){
      body = body + data;
    });
    //더이상 들어올 data가 없으면 밑의 function을 콜백, 수신끝
    request.on('end', function(){
      var post = qs.parse(body);
      //delete에서 넘긴 name="id"를 받아서
      var id = post.id;
      //unlink로 data폴더에서 id라는 이름의 파일 삭제
      //그 후 뒤의 함수 callback, 여기서는 홈으로 callback 하게 하였음
      fs.unlink(`data/${id}`, function(err){
        response.writeHead(302, {Location : `/`});
        response.end();
      })
    });
  } else{
      //파일을 찾을 수 없을때는 404를 서버가 리턴 해줌
      response.writeHead(404);
      //Web Page에 내용 출력
      response.end('Not found');
    }
});
app.listen(3000);
