const article = document.querySelector('.article');
const menu = document.querySelector('.menu');

const Links = {
    setColor: function (color) {
        //     var alist = document.querySelectorAll('a');
        //     var i = 0;
        //     while (i < alist.length) {
        //         alist[i].style.color = color;
        //         i++;
        //     }

        $('a').css('color', color);
    }
}

const Body = {
    setColor: function (color) {
        //document.querySelector('body').style.color = color;
        $('body').css('color', color);
    },
    setBackgroundColor: function (color) {
        //document.querySelector('body').style.backgroundColor = color;
        $('body').css('backgroundColor', color);
    }
}

function nightDayHandler(self) {
    //var target = document.querySelector('body');
    if (self.value === 'NIGHT') {
        Body.setColor('white');
        Body.setBackgroundColor('black');
        self.value = 'DAY';

        Links.setColor('powderblue');
    } else {
        Body.setColor('black');
        Body.setBackgroundColor('white');
        self.value = 'NIGHT';

        Links.setColor('blue');
    }
}

function fetchPage(name) {
    fetch(name).then(function (response) {
        return response.text().then(function (text) {
            article.innerHTML = text;
        });
    });
}

function getPage(dom, domClassName) {
    dom.addEventListener("click", function (event) {
        fetch(domClassName).then(function (response) {
            return response.text().then(function (text) {
                article.innerHTML = text;
            });
        });
    });
}

function getHash() {
    if (location.hash) {
        fetchPage(location.hash.substring(2));
    } else {
        fetchPage('welcome');
    }
}

function checkSubmit() {
    if (confirm('삭제하시겠어요?')) {
        return true;
    } else {
        return false;
    }
}

function divCheck() {
    var totalNum = 25;
    var countNum = 10;
    var totalPage = Math.ceil(totalNum / countNum);

    var page = 2;
    var countPage = 10;

    var startPage = Math.floor(((page - 1) / 10)) * 10 + 1;

    var endPage = startPage + countPage - 1;

    if (totalPage < page) {
        page = totalPage;
    }
    if (endPage > totalPage) {
        endPage = totalPage;
    }

    if (startPage > 1) {
        console.log('처음');
    }
    if (page > 1) {
        console.log('이전');
    }
    for (var iCount = startPage; iCount <= endPage; iCount++) {
        if (iCount == page) {
            console.log(iCount);
        } else {
            console.log(iCount);
        }
    }
}

function init() {
    fetch('list').then(function (response) {
        return response.text().then(function (text) {
            const textArr = text.split(',');

            textArr.forEach(function (element) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.className = element;
                let upperElement = element.substring(0, 1);
                let lowerElement = element.substring(1);
                upperElement = upperElement.toUpperCase();
                const tagContent = upperElement + lowerElement;
                a.textContent = tagContent;
                li.appendChild(a);
                menu.appendChild(li);
                //document.querySelector('.menu').innerHTML = ('<li class="'+ element +'">'+ element +'</li>');
                //var li = document.createElement('li');
                //li.className = element;
                //document.querySelector('.menu').appendChild(li);
            })
        })
    }).then(function () {
        const info = document.querySelectorAll(".main, .who, .guest");

        info.forEach(element => {
            getPage(element, element.className);
            element.href = "#!" + element.className;
        });
    })
    getHash();
    divCheck();
}

init();