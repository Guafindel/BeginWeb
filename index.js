const dayNight = document.querySelector('.dayNight');
let dayOrNight = false;

function changeBackground() {
    if(dayOrNight === false) {
        document.querySelector('body').style.background = 'white';
        document.querySelector('body').style.color = 'black';
    } else {
        document.querySelector('body').style.background = 'black';
        document.querySelector('body').style.color = 'white';
    }
}

function getChange() {
    if(dayOrNight === false) {
        dayOrNight = true;
        dayNight.textContent = 'DAY';
        changeBackground();
    } else {
        dayOrNight = false;
        changeBackground();
        dayNight.textContent = 'NIGHT';
    }
}

function selectBackground() {
   
    dayNight.addEventListener("click", getChange);
}

function init() {
    selectBackground();
}

init();