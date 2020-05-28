var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');

var template = require('./lib/template.js');

var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function (err, fileList) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.List(fileList);
                var html = template.HTML(title, list, description,
                    `<a href="/create">Create</a>`);
                response.writeHead(200);
                response.end(html);
            })
        } else {
            fs.readdir('./data', function (err, fileList) {
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
                    var title = queryData.id;
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizeDescription = sanitizeHtml(description, {
                        allowedTags: ['h2'],
                    });
                    var list = template.List(fileList);
                    var html = template.HTML(sanitizedTitle, list, sanitizeDescription,
                        `<a href="/create">Create</a> 
                        <a href="/update?id=${sanitizedTitle}">Update</a> 
                        <form action="delete_process" method="post" onsubmit="checkDelete()">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="Delete">
                        </form>`);
                    response.writeHead(200);
                    response.end(html);
                })
            });
        }
    } else if (pathname === '/create') {
        fs.readdir('./data', function (err, fileList) {
            var title = 'WEB - Create';
            var list = template.List(fileList);
            var html = template.HTML(title, list, `
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
            response.end(html);
        })
    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function (data) {
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        })
        request.on('end', function () {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                response.writeHead(302, {
                    Location: `/?id=${title}`
                });
                response.end('success');
            })
        });

    } else if (pathname === '/update') {
        fs.readdir('./data', function (err, fileList) {
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
                var title = queryData.id;
                var list = template.List(fileList);
                var html = template.HTML(title, list, `
                <form action="update_process" method="post">
                <input type="hidden" name="id" value="${title}">
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
                response.end(html);
            })
        });
    } else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function (error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                    response.writeHead(302, {
                        Location: `/?id=${title}`
                    });
                    response.end();
                })
            })
        });
    } else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function (err) {
                if (err) {
                    throw err;
                }
                console.log(`data/${id} was deleted`);
                response.writeHead(302, {
                    Location: `/`
                });
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);