var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require('./lib/author');
var sort = require('./lib/sort');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            topic.home(request, response);
        } else {
            topic.page(request, response);
        }
    } else if (pathname === '/create') {
        topic.create(request, response);
    } else if (pathname === '/create_process') {
        topic.create_process(request, response);
    } else if (pathname === '/update') {
        topic.update(request, response);
    } else if (pathname === '/update_process') {
        topic.update_process(request, response);
    } else if (pathname === '/delete_process') {
        topic.delete(request, response);
    } else if (pathname === '/author') {
        author.authorList(request, response);
    } else if (pathname === '/author/create_process') {
        author.authorCreateProcess(request, response);
    } else if (pathname === '/author/update') {
        author.authorUpdate(request, response);
    } else if (pathname === '/author/update_process') {
        author.authorUpdateProcess(request, response);
    } else if (pathname === '/author/delete_process') {
        author.authorDeleteProcess(request, response);
    } else if (pathname === '/sort') {
        if(queryData.id === undefined) {
            sort.sortHome(request, response);
        } else {
            sort.sortPage(request, response);
        }
    } else if (pathname === '/sort/create') {
        sort.sortCreate(request, response);
    } else if (pathname === '/sort/create_process') {
        sort.sortCreate_process(request, response);
    } else if (pathname === '/sort/update') {
        sort.sortUpdate(request, response);
    } else if (pathname === '/sort/update_process') {
        sort.sortUpdate_process(request, response);
    } else if (pathname === '/sort/delete_process') {
        sort.sortDelete(request, response);
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);