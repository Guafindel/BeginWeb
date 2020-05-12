const main = document.querySelector(".main"),
who = document.querySelector('.who'),
guest = document.querySelector('.guest');

const info = document.querySelectorAll(".main, .who, .guest");

const article = document.querySelector('.article');

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
    fetch(name).then(function(response) {
        return response.text().then(function(text) {
            article.innerHTML = text;
        });
    });
}

function getPage(dom, domClassName) {
    dom.addEventListener("click", function(event) {
        fetch(domClassName + '.html').then(function(response) {
            return response.text().then(function(text) {
                article.innerHTML = text;
            });
        });
    });
}

function getHash() {
    if (location.hash) {
        //console.log(location.hash.substr(1));
    } else {
        console.log("doesn`t exish");
    }
}

function init() {
    info.forEach(element => {
        getPage(element, element.className);
        element.href = "#!" + element.className;
    });
}

init();

console.log("체크");
