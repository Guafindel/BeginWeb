const express = require('express');
const topic = require('./expressLib/topic');
const author = require('./expressLib/expressLib');
const sort = require('./expressLib/sort');
const search = require('./expressLib/search');
const app = express();
const port = 4000;

// app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', function (req, res) {
    topic.home(req, res);
    res.send('get home');
});

app.get('/page', function(req, res) {
    res.send('Get Page')
})

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`);
});