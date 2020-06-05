var connection = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var url = require('url');

exports.home = function (request, response) {
    connection.query(`SELECT COUNT(*) as totalCnt FROM topic LEFT JOIN author ON topic.author_id = author.id;`, function (error6, count) {
        if (error6) {
            throw error6;
        }
        connection.query('SELECT * FROM topic', function (error, topics) {
            if (error) {
                console.log(error);
            }
            connection.query(`SELECT * FROM filter`, function (error3, filters) {
                if (error3) {
                    throw error3;
                }
                connection.query(`SELECT * FROM searchfilter`, function (error4, searchfilters) {
                    if (error4) {
                        throw error4;
                    }
                    //paging
                    var totalNum = count[0].totalCnt;
                    var countNum = 10;
                    var totalPage = Math.ceil(totalNum / countNum);
                    var countPage = 10;
                    var pageArray = [];
                    var page = 21;

                    if(totalPage < page) {
                        page = totalPage;
                    }

                    var startPage = (Math.floor((page - 1) / 10)) * 10 + 1;
                    var endPage = startPage + countPage - 1;
                    
                    if(endPage > totalPage) {
                        endPage = totalPage;
                    }

                    if(startPage > 1) {
                        pageArray.push('처음');
                    }

                    if(page > 1) {
                        pageArray.push('이전');
                    }
                    
                    for(var i = startPage; i <= endPage; i++) {
                        if(i == page) {
                            pageArray.push(`${i}`);
                        } else {
                            pageArray.push(`${i}`);
                        }
                    }

                    if(page < totalPage) {
                        pageArray.push(`다음`);
                    }

                    if(endPage < totalPage) {
                        pageArray.push(`끝`);
                    }
                    console.log(pageArray);

                    var title = sanitizeHtml('Welcome');
                    var description = sanitizeHtml('Hello, Nodejs & MySQL');
                    var searchBox = template.searchFilter(searchfilters);
                    var filterBox = template.Filter(filters);
                    var list = template.List(topics);
                    var html = template.HTML(title, list, description, `<a href="/create">Create</a>`, filterBox, searchBox);
                    response.writeHead(200);
                    response.end(html);
                })
            })
        })
    })

}
exports.page = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    connection.query(`SELECT * FROM filter`, function (error1, filters) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM topic`, function (error3, topics) {
            if (error3) {
                throw error3;
            }
            connection.query(`SELECT a.id, a.title, a.description, a.created, b.name, b.profile FROM topic a LEFT JOIN author b ON a.author_id = b.id WHERE a.id = ?`, [queryData.id], function (error4, topic) {
                if (error4) {
                    throw error4;
                }
                connection.query(`SELECT * FROM searchfilter`, function (error5, searchfilters) {
                    if (error5) {
                        throw error5;
                    }
                    var title = sanitizeHtml(topic[0].title);
                    var description = sanitizeHtml(topic[0].description);
                    var writer = sanitizeHtml(topic[0].name);
                    var filterBox = template.Filter(filters);
                    var searchBox = template.searchFilter(searchfilters);
                    var list = template.List(topics);
                    var html = template.HTML(title, list,
                        `<div>${description}</div>
                        <p>by ${writer}</p>`,
                        `<a href="/create">Create</a> 
                        <a href="/update?id=${queryData.id}">Update</a> 
                        <form action="delete_process" method="post" onsubmit="return deleteCheck();">
                            <input type="hidden" name="id" value="${queryData.id}">
                            <input type="submit" value="Delete">
                        </form>`, filterBox, searchBox);
                    response.writeHead(200);
                    response.end(html);
                })
            })
        })
    })
}
exports.create = function (request, response) {
    connection.query(`SELECT * FROM filter`, function (error1, filters) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM topic`, function (error2, topics) {
            if (error2) {
                throw error2;
            }
            connection.query(`SELECT * FROM author`, function (error3, authors) {
                if (error3) {
                    throw error3;
                }
                connection.query(`SELECT * FROM searchfilter`, function (error4, searchfilters) {
                    if (error4) {
                        throw error4;
                    }
                    var title = sanitizeHtml('WEB - Create');

                    var searchBox = template.searchFilter(searchfilters);
                    var filterBox = template.Filter(filters)
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
                    `, '', filterBox, searchBox);
                    response.writeHead(200);
                    response.end(html);
                })
            })
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

    connection.query(`SELECT * FROM filter`, function (error1, filters) {
        if (error1) {
            throw error1;
        }
        connection.query(`SELECT * FROM topic`, function (error2, topics) {
            if (error2) {
                throw error2;
            }
            connection.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], function (error3, topic) {
                if (error3) {
                    throw error3;
                }
                connection.query(`SELECT * FROM author`, function (error4, authors) {
                    if (error4) {
                        throw error4;
                    }
                    connection.query(`SELECT * FROM searchfilter`, function (error5, searchfilters) {
                        if (error5) {
                            throw error5;
                        }
                        var title = sanitizeHtml(topic[0].title);
                        var description = sanitizeHtml(topic[0].description);
                        var id = sanitizeHtml(topic[0].id);
                        var author_id = sanitizeHtml(topic[0].author_id);


                        var searchBox = template.searchFilter(searchfilters);
                        var filterBox = template.Filter(filters);
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
                            `, `<a href="/create">Create</a> <a href="/update?id=${id}">Update</a>`, filterBox, searchBox);
                        response.writeHead(200);
                        response.end(html);
                    })
                });
            })
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