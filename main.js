var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3307',
    user: 'guifindel',
    password: 'guifindel1234',
    database: 'guifindel'
});

connection.connect();

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            connection.query('SELECT * FROM topic', function (error, topics) {
                if (error) {
                    console.log(error);
                }
                var title = 'Welcome';
                var description = 'Hello, Nodejs & MySQL';

                // var titleArray = [];
                // topics.forEach(element => {
                //     titleArray.push(element.title);
                // });
                // topics.forEach(function(element) {
                //     titleArray.push(element.title);
                // })

                var list = template.List(topics);
                var html = template.HTML(title, list, description, `<a href="/create">Create</a>`);
                response.writeHead(200);
                response.end(html);
            })
        } else {
            connection.query('SELECT * FROM topic', function (error1, topics) {
                if (error1) {
                    throw error1;
                }
                connection.query(`SELECT * FROM topic WHERE id=?`, [
                    queryData.id
                ], function (error2, topic) {
                    if (error2) {
                        throw error2;
                    }
                    var title = sanitizeHtml(topic[0].title);
                    var description = sanitizeHtml(topic[0].description);

                    var list = template.List(topics);
                    var html = template.HTML(title, list, description,
                        `<a href="/create">Create</a> 
                        <a href="/update?id=${queryData.id}">Update</a> 
                        <form action="delete_process" method="post" onsubmit="checkDelete()">
                            <input type="hidden" name="id" value="${queryData.id}">
                            <input type="submit" value="Delete">
                        </form>`);
                    response.writeHead(200);
                    response.end(html);
                })
            })
        }
    } else if (pathname === '/create') {
        connection.query(`SELECT * FROM topic`, function (error, topics) {
            if (error) {
                throw error;
            }
            var title = 'WEB - Create';
            var list = template.List(topics);
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

            connection.query(`INSERT INTO topic(title, description, created, author_id) VALUES(?, ?, now(), ?)`, [
                title,
                description,
                1
            ], function (error, results) {
                if (error) {
                    throw error;
                }
                response.writeHead(302, {
                    Location: `/?id=${results.insertId}`
                });
                response.end();
            })
        });
    } else if (pathname === '/update') {
        connection.query(`SELECT * FROM topic`, function (error1, topics) {
            if (error1) {
                throw error1;
            }
            connection.query(`SELECT * FROM topic WHERE id = ?`, [
                queryData.id
            ], function (error2, topic) {
                if (error2) {
                    throw error2;
                }
                var title = sanitizeHtml(topic[0].title);
                var description = sanitizeHtml(topic[0].description);
                var id = sanitizeHtml(topic[0].id);

                var list = template.List(topics);
                var html = template.HTML(title, list, `
                <form action="update_process" method="post">
                <input type="hidden" name="id" value="${id}">
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
                `, `<a href="/create">Create</a> <a href="/update?id=${id}">Update</a>`);
                response.writeHead(200);
                response.end(html);
            })

        })
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

            // fs.rename(`data/${id}`, `data/${title}`, function (error) {
            //     fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            //         response.writeHead(302, {
            //             Location: `/?id=${title}`
            //         });
            //         response.end();
            //     })
            // })

            connection.query(`UPDATE SET topic(title, description, created, author_id) VALUES(?, ?, now(), ?)`, [
                title,
                description,
                1
            ], function (error, results) {
                if (error) {
                    throw error;
                }
                response.writeHead(302, {
                    Location: `/?id=${results.insertId}`
                });
                response.end();
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