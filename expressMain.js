const express = require('express');
const topic = require('./expressLib/topic');
const author = require('./expressLib/author');
const sort = require('./expressLib/sort');
const search = require('./expressLib/search');
const app = express();
const port = 4000;

// app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', function (request, response) {
    // res.send('get home');
    topic.home(request, response);
});

app.get('/page/:pageId', (request, response) => {
    //response.send(request.params);
    topic.page(request, response);
})

app.create('/create', function (request, response) {
    // res.send('Get Page')
    topic.create(request, response);
})

app.create('/create_process', (request, response) => {

})

app.update('/update', (request, response) => {
    
})

app.update('/update_process', (request, response) => {
    
})

app.delete('/delete_process', (request, response) => {
    topic.delete(request, response);
})

// app.get('', (request, response) => {
    
// })

// app.get('', (request, response) => {
    
// })

// app.get('', (request, response) => {
    
// })

app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`);
});

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))