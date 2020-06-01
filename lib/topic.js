var connection = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var url = require('url');

exports.home = function (request, response) {
    connection.query('SELECT * FROM topic', function (error, topics) {
        if (error) {
            console.log(error);
        }
        var title = 'Welcome';
        var description = 'Hello, Nodejs & MySQL';

        var list = template.List(topics);
        var html = template.HTML(title, list, description, `<a href="/create">Create</a>`);
        response.writeHead(200);
        response.end(html);
    })
}
exports.page = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    connection.query('SELECT * FROM topic', function (error1, topics) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM topic a LEFT JOIN author b ON a.author_id = b.id WHERE a.id=?`, [queryData.id], function (error2, topic) {
            if (error2) {
                throw error2;
            }
            var title = sanitizeHtml(topic[0].title);
            var description = sanitizeHtml(topic[0].description);
            var writer = sanitizeHtml(topic[0].name);

            var list = template.List(topics);
            var html = template.HTML(title, list,
                `<div>${description}</div>
                <p>by ${writer}</p>`,
                `<a href="/create">Create</a> 
                <a href="/update?id=${queryData.id}">Update</a> 
                <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <input type="submit" value="Delete">
                </form>`);
            response.writeHead(200);
            response.end(html);
        })
    })
}
exports.create = function (request, response) {
    connection.query(`SELECT * FROM topic`, function (error, topics) {
        if (error) {
            throw error;
        }
        connection.query(`SELECT * FROM author`, function (error2, authors) {
            if (error2) {
                throw error2;
            }
            var title = 'WEB - Create';
            var authorSelect = template.authorSelect(authors);
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
                    ${authorSelect}
                </p>
                <p>
                    <input type="submit" value="submit">
                </p>
                </form>
                `, '');
            response.writeHead(200);
            response.end(html);
        })
    })
}
exports.create_process = function (request, response) {
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
        var author = post.author;

        connection.query(`INSERT INTO topic(title, description, created, author_id) VALUES(?, ?, now(), ?)`, [
            title,
            description,
            author
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
}
exports.update = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    connection.query(`SELECT * FROM topic`, function (error1, topics) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], function (error2, topic) {
            if (error2) {
                throw error2;
            }
            connection.query(`SELECT * FROM author`, function (error3, authors) {
                if (error3) {
                    throw error3;
                }
                var title = sanitizeHtml(topic[0].title);
                var description = sanitizeHtml(topic[0].description);
                var id = sanitizeHtml(topic[0].id);
                var author_id = sanitizeHtml(topic[0].author_id);

                var authorSelect = template.authorSelect(authors, author_id);
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
                        ${authorSelect}
                    </p>
                    <p>
                        <input type="submit" value="submit">
                    </p>
                    </form>
                    `, `<a href="/create">Create</a> <a href="/update?id=${id}">Update</a>`);
                response.writeHead(200);
                response.end(html);
            });
        })
    })
}
exports.update_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        var author_id = post.author;

        connection.query(`UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?`, [
            title,
            description,
            author_id,
            id
        ], function (error, results) {
            if (error) {
                throw error;
            }
            console.log(results);
            response.writeHead(302, {
                Location: `/?id=${id}`
            });
            response.end();
        })
    });
}
exports.delete = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;

        connection.query(`DELETE FROM topic WHERE id = ?`, [
            id
        ], function (error, results) {
            if (error) {
                throw error;
            }
            response.writeHead(302, {
                Location: `/`
            });
            response.end();
        })

    });
}