var connection = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var url = require('url');

exports.searchHome = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var searchId = post.searchId;
        var searchWord = post.searchWord;

        var sql = `SELECT a.id, a.title, a.description, a.created, b.name, b.profile FROM topic a LEFT JOIN author b ON a.author_id = b.id WHERE`;
        var sqlQuery = '';

        connection.query(`SELECT * FROM searchfilter`, function (error1, searchFilters) {
            if (error1) {
                throw error1;
            }
            connection.query(`SELECT * FROM searchfilter WHERE id = ?`, [searchId], function (error2, searchFilter) {
                if (error2) {
                    throw error2;
                }
                sqlQuery = `${sql} ${searchFilter[0].columnname} Like '%${searchWord}%'`;
                connection.query(`SELECT * FROM filter`, function (error3, filters) {
                    if (error3) {
                        throw error3;
                    }
                    connection.query(sqlQuery, function (error4, topics) {
                        if (error4) {
                            throw error4;
                        }
                        var title = 'Search Page';
                        var description = 'this page will show you search result';

                        var searchBox = template.searchFilter(searchFilters, searchId);
                        var filterBox = template.Filter(filters);
                        var list = template.List(topics);
                        console.log(list.length);
                        if(list.length < 10) {
                            list = `<p>검색결과가 없습니다</p>`
                        }
                        var html = template.HTML(title, list, description, '', filterBox, searchBox);

                        response.writeHead(200);
                        response.end(html);
                    })
                })
            })
        })
    });
}