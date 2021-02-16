function save_user_details(details) {
    // Save the user details so that they can be used on the customer pages
    localStorage.setItem('user_details', JSON.stringify(details));
}

// Shows or hides the login menu
function show_login(arg) {
    if (arg === 'show') {
        $(".login").css("display", "flex"); // jQuery function for updating CSS declaration of a specific element based on the rule and the value
    } else {
        $(".login").css("display", "none"); // jQuery function for updating CSS declaration of a specific element based on the rule and the value
    }
}

// Simple login function
function login() {
    let user_in = $('#username').val(); // Get username from input in html
    let password_in = $('#password').val(); // Get password from input in html
    let details = userDetails(user_in); // Get user details from DB, if username does not exist in DB will return nothing

    if (details.password === password_in) { // Compares password
        login_error('hide');

        // Checks credentials and redirects to the right side
        if (details.credentials == 0) {
            save_user_details(details);
            window.location.href = 'customer.html'; // Redirect
        } else if (details.credentials > 0) {
            window.location.href = 'staff.html'; // Redirect
        }
    } else {
        login_error('show');
    }
}

function login_error(arg) {
    if (arg == 'show') {
        $('#username').addClass('login_error');
        $('#password').addClass('login_error');
    } else {
        $('#username').removeClass('login_error');
        $('#password').removeClass('login_error');
    }
}
