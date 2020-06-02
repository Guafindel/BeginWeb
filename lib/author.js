var connection = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var url = require('url');

exports.authorList = function (request, response) {
    connection.query(`SELECT * FROM topic`, function (error1, topics) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM author`, function (error2, authors) {
            if (error2) {
                throw error2;
            }
            var title = 'Author List';
            var list = template.List(topics);
            var authorTable = template.authorTable(authors);
            var authorForm = template.authorForm('create', '');

            var html = template.HTML(title, list, authorForm, authorTable , '');
            response.writeHead(200);
            response.end(html);
        })
    })
}
exports.authorCreateProcess = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    })
    request.on('end', function () {
        var post = qs.parse(body);
        var name = sanitizeHtml(post.name);
        var profile = sanitizeHtml(post.profile);

        connection.query(`INSERT INTO author(name, profile) VALUES(?, ?)`, [
            name,
            profile
        ], function (error, results) {
            if (error) {
                throw error;
            }
            response.writeHead(302, {
                Location: `/author`
            });
            response.end();
        })
    });
}
exports.authorUpdate = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    connection.query(`SELECT * FROM topic`, function (error1, topics) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM author`, function (error2, authors) {
            if (error2) {
                throw error2;
            }
            connection.query(`SELECT * FROM author WHERE id = ?`, [queryData.id], function (error3, author) {
                if (error3) {
                    throw error3;
                }
                var title = sanitizeHtml('Author List');
                var list = template.List(topics);
                var authorTable = template.authorTable(authors);
                var authorForm = template.authorForm('update', author);

                var html = template.HTML(title, list, authorForm, authorTable, '');
                response.writeHead(200);
                response.end(html);
            })
        })
    })
}
exports.authorUpdateProcess = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;
        var name = post.name;
        var profile = post.profile;

        connection.query(`UPDATE author SET name = ?, profile = ? WHERE id = ?`, [
            name,
            profile,
            id
        ], function (error, results) {
            if (error) {
                throw error;
            }
            response.writeHead(302, {
                Location: `/author`
            });
            response.end();
        })
    });
}
exports.authorDeleteProcess = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        console.log(body);
        var post = qs.parse(body);
        var id = post.id;
        connection.query(`DELETE FROM topic WHERE author_id = ?`, [id], function (error1, results) {
            if (error1) {
                throw error1;
            }
            connection.query('DELETE FROM author WHERE id = ?', [id], function (error2, results2) {
                if (error2) {
                    throw error2;
                }
                response.writeHead(302, {
                    Location: '/author'
                });
                response.end();
            })
        })

    })
}