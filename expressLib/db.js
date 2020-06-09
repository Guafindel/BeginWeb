var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3307',
    user: 'guifindel',
    password: 'guifindel1234',
    database: 'guifindel'
});

module.exports = connection;

