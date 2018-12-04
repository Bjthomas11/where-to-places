"use strict"

function onPageLoad(){
    $(".sign-up-form").submit(onSignUpSubmit);
    $(".login-form").submit(onLoginSubmit);
}

function onSignUpSubmit(e){
    e.preventDefault();
    const userData = {
        name: $(".name-txt").val(),
        email: $(".email-txt").val(),
        username: $(".username-txt").val(),
        password: $(".password-txt").val()
    }
    signUpUser({
        userData,
        onSuccess: user => {
            alert(`User "${user.username}" created, you may now log in.`);
            window.open("/auth/login.html", "_self");
        },
        onError: err => {
            alert("Password must be at least 3 characters long, Username must be at lease 5 characters long");
        }
    });
}

function onLoginSubmit(e){
    e.preventDefault();
    const userData = {
        username: $(".username-txt").val(),
        password: $(".password-txt").val()
    }
    loginUser({
        userData,
        onSuccess: res => {
            const authenticatedUser = res.user;
            authenticatedUser.jwtToken = res.jwtToken;
            alert("Login successful, redirecting you to home..");
        },
        onError: err => {
            alert("Incorrect username and/or password, Try Again.");
        }
    });
}
