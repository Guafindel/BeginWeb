var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var path = url.parse(_url, true).path;
    var title = queryData.id;
    
    if(pathname === '/') {
        if(path === '/') {
            title = 'welcome'
            onTitle = title.substring(0, 1).toUpperCase() + title.substring(1);
            fs.readFile(`data/${title}`, 'utf8', function (err, description) {
                var title = 'welcome';
                var template = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>WEB1 - ${onTitle}</title>
                    <meta charset="utf-8" />
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    <ul>
                        <li><a href="/?id=main">Main</a></li>
                        <li><a href="/?id=who">Who</a></li>
                        <li><a href="/?id=guest">Guest</a></li>
                    </ul>
                    <h2>${onTitle}</h2>
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