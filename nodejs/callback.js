// function a() {
//     console.log('A');
// }
// a();
var imgSrc = document.querySelector('#imgSrc');

var a = function () {
    console.log('A');
}

function slowFunc(callback) {
    callback();
}

slowFunc(a);