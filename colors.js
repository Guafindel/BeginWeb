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


