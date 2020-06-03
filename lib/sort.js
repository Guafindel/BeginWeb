var connection = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var url = require('url');

exports.sortHome = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var sql = 'SELECT A.id, A.title, A.description, A.created, A.author_id, B.name, B.profile FROM topic A LEFT JOIN author B ON A.author_id = B.id';
    var sqlQuery = '';

    connection.query(`SELECT * FROM filter`, function (error1, filters) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM filter WHERE id = ?`, [queryData.sort], function (error2, filter) {
            if (error2) {
                throw error2;
            }
            sqlQuery = `${sql} ${filter[0].order}`;
            connection.query(sqlQuery, function (error3, topics) {
                if (error3) {
                    console.log(error3);
                }
                var filterId = filter[0].id;
                var title = sanitizeHtml(`Welcome Sorting Page`);
                var description = sanitizeHtml('Hello, Nodejs & MySQL');
                var filterBox = template.Filter(filters, queryData.sort);
                var list = template.FilterList(topics, filterId);
                var html = template.HTML(title, list, description, `<a href="/sort/create?sort=${queryData.sort}">Create</a>`, filterBox);
                response.writeHead(200);
                response.end(html);
            })
        })
    })
}
exports.sortPage = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var sql = 'SELECT A.id, A.title, A.description, A.created, A.author_id, B.name, B.profile FROM topic A LEFT JOIN author B ON A.author_id = B.id';
    var sqlQuery = '';

    connection.query(`SELECT * FROM filter`, function (error1, filters) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM filter WHERE id = ?`, [queryData.sort], function (error2, filter) {
            if (error2) {
                throw error2;
            }
            sqlQuery = `${sql} ${filter[0].order}`;
            connection.query(sqlQuery, function (error3, topics) {
                if (error3) {
                    throw error3;
                }
                connection.query(`SELECT a.id, a.title, a.description, a.created, a.author_id, b.name, b.profile FROM topic a LEFT JOIN author b ON a.author_id = b.id WHERE a.id = ?`, [queryData.id], function (error4, topic) {
                    if (error4) {
                        throw error4;
                    }
                    var title = sanitizeHtml(topic[0].title);
                    var description = sanitizeHtml(topic[0].description);
                    var writer = sanitizeHtml(topic[0].name);
                    var filterId = sanitizeHtml(filter[0].id)

                    var filterBox = template.Filter(filters, filterId);
                    var list = template.FilterList(topics, filterId);
                    var html = template.HTML(title, list,
                        `<div>${description}</div>
                            <p>by ${writer}</p>`,
                        `<a href="/sort/create?sort=${queryData.sort}">Create</a> 
                            <a href="/sort/update?sort=${queryData.sort}&id=${queryData.id}">Update</a> 
                            <form action="/sort/delete_process" method="post">
                                <input type="hidden" name="sort" value="${queryData.sort}">
                                <input type="hidden" name="id" value="${queryData.id}">
                                <input type="submit" value="Delete">
                            </form>`, filterBox);
                    response.writeHead(200);
                    response.end(html);
                })
            })
        })
    })
}
exports.sortCreate = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var sql = 'SELECT A.id, A.title, A.description, A.created, A.author_id, B.name, B.profile FROM topic A LEFT JOIN author B ON A.author_id = B.id';
    var sqlQuery = '';

    connection.query(`SELECT * FROM filter`, function (error1, filters) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM filter WHERE id = ?`, [queryData.sort], function (error2, filter) {
            if (error2) {
                throw error2;
            }
            sqlQuery = `${sql} ${filter[0].order}`;
            connection.query(sqlQuery, function (error3, topics) {
                if (error3) {
                    throw error3;
                }
                connection.query(`SELECT * FROM author`, function (error4, authors) {
                    if (error4) {
                        throw error4;
                    }
                    var title = sanitizeHtml('WEB - Create');
                    var filterId = filter[0].id;

                    var filterBox = template.Filter(filters, filterId)
                    var authorSelect = template.authorSelect(authors);
                    var list = template.FilterList(topics, filterId);
                    var html = template.HTML(title, list, `
                        <form action="/sort/create_process" method="post">
                        <p>
                            <input type="hidden" name="sort" value="${queryData.sort}">
                        </p>
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
                        `, '', filterBox);
                    response.writeHead(200);
                    response.end(html);
                })
            })
        })
    })
}
exports.sortCreate_process = function (request, response) {
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
        var sort = post.sort;

        connection.query(`INSERT INTO topic(title, description, created, author_id) VALUES(?, ?, now(), ?)`, [
            title,
            description,
            author
        ], function (error, results) {
            if (error) {
                throw error;
            }
            response.writeHead(302, {
                Location: `/sort?sort=${sort}&id=${results.insertId}`
            });
            response.end();
        })
    });
}
exports.sortUpdate = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var sql = 'SELECT A.id, A.title, A.description, A.created, A.author_id, B.name, B.profile FROM topic A LEFT JOIN author B ON A.author_id = B.id';
    var sqlQuery = '';

    connection.query(`SELECT * FROM filter`, function (error1, filters) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM filter WHERE id = ?`, [queryData.sort], function (error2, filter) {
            if (error2) {
                throw error2;
            }
            sqlQuery = `${sql} ${filter[0].order}`;
            connection.query(sqlQuery, function (error3, topics) {
                if (error3) {
                    throw error3;
                }
                connection.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], function (error4, topic) {
                    if (error4) {
                        throw error4;
                    }
                    connection.query(`SELECT * FROM author`, function (error5, authors) {
                        if (error5) {
                            throw error5;
                        }
                        var title = sanitizeHtml(topic[0].title);
                        var description = sanitizeHtml(topic[0].description);
                        var id = sanitizeHtml(topic[0].id);
                        var author_id = sanitizeHtml(topic[0].author_id);
                        var filterId = sanitizeHtml(filter[0].id);

                        var filterBox = template.Filter(filters, filterId);
                        var authorSelect = template.authorSelect(authors, author_id);
                        var list = template.FilterList(topics, filterId);
                        var html = template.HTML(title, list, `
                            <form action="/sort/update_process" method="post">
                            <input type="hidden" name="sort" value="${queryData.sort}">
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
                            `, `<a href="/create">Create</a> <a href="/update?id=${id}">Update</a>`, filterBox);
                        response.writeHead(200);
                        response.end(html);
                    });
                })
            })
        })
    })
}
exports.sortUpdate_process = function (request, response) {
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
        var sort = post.sort;

        connection.query(`UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?`, [
            title,
            description,
            author_id,
            id
        ], function (error, results) {
            if (error) {
                throw error;
            }
            response.writeHead(302, {
                Location: `/sort?sort=${sort}&id=${id}`
            });
            response.end();
        })
    });
}
exports.sortDelete = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;
        var sort = post.sort;

        connection.query(`DELETE FROM topic WHERE id = ?`, [
            id
        ], function (error, results) {
            if (error) {
                throw error;
            }
            response.writeHead(302, {
                Location: `/sort?sort=${sort}`
            });
            response.end();
        })
    });
}