// Shows or hides the login menu
function show_login(arg) {
    if (arg === "show") {
        $("#login-form").css("display", "flex"); // jQuery function for updating CSS declaration of a specific element based on the rule and the value
    } else {
        $("#login-form").css("display", "none"); // jQuery function for updating CSS declaration of a specific element based on the rule and the value
    }
}

// Simple login function
function login(){
    let user_in = $('#username').val(); // Get username from input in html
    let password_in = $('#password').val(); // Get password from input in html
    let details = userDetails(user_in); // Get user details from DB, if username does not exist in DB will return nothing

    if(details.password === password_in){ // Compares password
        window.location.href = "vipcustom.html"; // Redirect
    }
}
