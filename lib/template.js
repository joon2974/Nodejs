module.exports = {
  HTML: function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB2 - ${title}</title>
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
  },
  list: function(fileList){
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
}

//module.exports = template;
