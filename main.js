var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>WEB - ${upperString(title)}</title>
        <meta charset="utf-8" />
        <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    </head>
    <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        <p>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/MhrFDYQK-c8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </p> 
        <h1>${upperString(title)}</h1>
        ${body}
    </body>
    </html>
    `;
}

function upperString(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function templateList(fileList) {
    var list = '<ul>'
    fileList.forEach(element => {
        if (element !== 'welcome') {
            var onTitle = upperString(element);
            list = list + `<li><a href="/?id=${element}">${onTitle}</a></li>`
        }
    });
    list = list + '</ul>';
    return list;
}

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function(err, fileList) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = templateList(fileList);
                var template = templateHTML(title, list, description,
                    `<a href="/create">Create</a>`);
                response.writeHead(200);
                response.end(template);
            })
        } else {
            fs.readdir('./data', function(err, fileList) {
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                    var title = queryData.id;
                    var list = templateList(fileList);
                    var template = templateHTML(title, list, description,
                        `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`);
                    response.writeHead(200);
                    response.end(template);
                })
            });
        }
    } else if (pathname === '/create') {
        fs.readdir('./data', function(err, fileList) {
            var title = 'WEB - Create';
            var list = templateList(fileList);
            var template = templateHTML(title, list, `
            <form action="create_process" method="post">
            <p>
                <input type="text" name="title" placeholder="create title" value="">
            </p>
            <p>
                <textarea name="description" cols="30" rows="10" placeholder="create description"></textarea>
            </p>
            <p>
                <input type="submit" value="submit">
            </p>
            </form>
            `, ``);
            response.writeHead(200);
            response.end(template);
        })
    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function(data) {
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        })
        request.on('end', function() {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                response.writeHead(302, {
                    Location: `/?id=${title}`
                });
                response.end('success');
            })
        });

    } else if (pathname === '/update') {
        fs.readdir('./data', function(err, fileList) {
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                var title = queryData.id;
                var list = templateList(fileList);
                var template = templateHTML(title, list, `
                <form action="update_process" method="post">
                <input type="text" name="id" value="${title}">
                <p>
                    <input type="text" name="title" placeholder="update title" value="${title}">
                </p>
                <p>
                    <textarea name="description" cols="30" rows="10" placeholder="update description">${description}</textarea>
                </p>
                <p>
                    <input type="submit" value="submit">
                </p>
                </form>
                `, `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`);
                response.writeHead(200);
                response.end(template);
            })
        });
    } else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                    response.writeHead(302, {
                        Location: `/?id=${title}`
                    });
                    response.end();
                })
            })
        });
    } else if(pathname === '/delete') {
          var body = '';
         request.on('data', function(data) {
            body += data;
        }
         request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.desscription;
            
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);
