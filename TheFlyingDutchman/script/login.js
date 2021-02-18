function save_user_details(details) {
    // Save the user details so that they can be used on the customer pages
    localStorage.setItem('user_details', JSON.stringify(details));
}

// Shows or hides the login menu
function show_login(arg) {
    if (arg === 'show') {
        $(".login").addClass("show"); // jQuery function for updating CSS declaration of a specific element based on the rule and the value
    } else {
        $(".login").removeClass("show"); // jQuery function for updating CSS declaration of a specific element based on the rule and the value
    }
}

// Simple login function
function login() {
    let user_in = $('#username').val(); // Get username from input in html
    let password_in = $('#password').val(); // Get password from input in html
    let details = userDetails(user_in); // Get user details from DB, if username does not exist in DB will return nothing 
    if (details.password === password_in) { // Compares password
    login_error('hide');
    ///myWindow = window.sessionStorage;
    window.sessionStorage.setItem('user', details.username);
    // Checks credentials and redirects to the right side
    if (details.credentials == 3) {
      window.location.href = 'vipcustom.html'; // Redirect
    } else if (details.credentials < 3) {
      window.location.href = 'staff.html'; // Redirect
    } else {
        login_error('show');
    }
}

function login_error(arg) {
    if (arg == 'show') {
        $('#login_background').addClass('error');
    } else {
        $('#login_background').removeClass('error');
    }
}
