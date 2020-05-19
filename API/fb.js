var authBtn = document.querySelector('#authBtn');

//authBtn.addEventListener('click', fbAuth);
authBtn.addEventListener("click", fbAuth);

function fbAuth() {
    if (authBtn.value === 'Login') {
        FB.login(function (response) {
            //now login
            console.log('login =>', response);
            checkLoginStatus(response);
        });
    } else {
        FB.logout(function (response) {
            //now logout
            console.log('logout =>', response);
            checkLoginStatus(response);
        });
    }
}

var checkLoginStatus = function (response) {
    //statusChangeCallback(respnse);
    console.log(response);
    if (response.status === 'connected') {
        document.querySelector('#authBtn').value = 'Logout';

        /* make the API call */
        FB.api("/me", function (response) {
            if (response && !response.error) {
                /* handle the result */
                document.querySelector('.fbName').textContent = response.name;
            }
        });
    } else {
        document.querySelector('#authBtn').value = 'Login';
        document.querySelector('.fbName').textContent = '';
    }
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '278340849994848',
        cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: 'v7.0' // Use this Graph API version for this call.
    });

    // Called after the JS SDK has been initialized.
    // Returns the login status.

    FB.getLoginStatus(checkLoginStatus);

};

(function (d, s, id) { // Load the SDK asynchronously
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));