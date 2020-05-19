var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function (err, fileList) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                // var list = `
                // <ul>
                //     <li><a href="/?id=main">Main</a></li>
                //     <li><a href="/?id=who">Who</a></li>
                //     <li><a href="/?id=guest">Guest</a></li>
                // </ul>
                // `;

                var list = '<ul>'
                // fileList.forEach(element => {
                //     console.log(element);
                //     var onTitle = element.substring(0, 1).toUpperCase() + element.substring(1);
                //     list = list + '<li><a href="?/id=' + element + '>'+ onTitle +'</a></li>';
                //     list = list + `<li><a href="?/id="${element}">${onTitle}</a></li>`
                // });

                var i = 0;
                while(i < fileList.length) {
                    list = list + `<li><a href="?/id=">${fileList[i]}</a></li>`;
                    i = i + 1;  
                }
                list = list + '</ul>';

                var template = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8" />
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/4JJFrjkRxmo" frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </p>
                    <p>${description}</p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            })
        } else {
            fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                var title = queryData.id;
                var template = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8" />
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    <ul>
                        <li><a href="/?id=main">Main</a></li>
                        <li><a href="/?id=who">Who</a></li>
                        <li><a href="/?id=guest">Guest</a></li>
                    </ul>
                    <h2>${title}</h2>
                    <p>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/4JJFrjkRxmo" frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </p>
                    ${description}
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            })
        }

    } else {
        response.writeHead(404);
        response.end('Not found');
    }

});
app.listen(3000);