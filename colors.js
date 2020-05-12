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

function init() {
    fetch('list').then(function (response) {
        return response.text().then(function (text) {
            console.log(text);
            //<li><a class=""></a></li>
            document.querySelector('.menu').innerHTML = text;
        })
    }).then(function() {
        const info = document.querySelectorAll(".main, .who, .guest, .welcome");

        info.forEach(element => {
            getPage(element, element.className);
            element.href = "#!" + element.className;
        });
    })
    
    getHash();

    


}

init();