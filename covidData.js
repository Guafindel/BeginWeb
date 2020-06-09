var request = require('request'),
    cheerio = require('cheerio');

var url = "http://www.seoul.go.kr/coronaV/coronaStatus.do#route_page_top";
 

request(url, function (err, res, html) {
    if (!err) {
        var $ = cheerio.load(html);
    }
    console.log($);
})