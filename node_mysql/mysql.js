var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3307',
    user: 'guifindel',
    password: 'guifindel1234',
    database: 'guifindel'
});

connection.connect();

connection.query('SELECT * FROM author', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});

connection.end();