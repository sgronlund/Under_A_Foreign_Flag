$(function () {
    const user = window.sessionStorage.getItem('user');

    // Extract html page from current location.
    // window.location.href contains the entire URL, including the domain name
    const href = window.location.href;
    const page_index = href.lastIndexOf('/');
    const current_page = href.substring(page_index + 1, href.length);

    // Guests should only be allowed on the index and customer page
    if (!user) {
        if (current_page != 'index.html' && current_page != 'customer.html') {
            window.location.href = 'index.html';
        }

        return;
    }

    const credential = userDetails(user).credentials;

    // Redirects the user to the right page according to their credentials
    if (credential == 3) {
        if (current_page != 'customer.html') {
            window.location.href = 'customer.html';
        }
    } else {
        if (current_page != 'staff.html') {
            window.location.href = 'staff.html';
        }
    }
});

// Simple login function
function login(redirect) {
    const modal_id = 'login_modal';
    const username_element = $('#username'); // Get username from input in html
    const password_element = $('#password'); // Get password from input in html
    const details = userDetails(username_element.val()); // Get user details from DB, if username does not exist in DB will return nothing

    if (details.password === password_element.val()) { // Compares password
        hide_modal_error(modal_id);
        window.sessionStorage.setItem('user', details.username);

        // Checks credentials and redirects to the right side
        if (details.credentials == 3) {
            // Only redirect to customer page if we are on the start page
            if (redirect) {
                // Do not clear session storage on redirect.
                // Otherwise, the user will not be logged in after the redirect
                window.location.href = 'customer.html'; // Redirect
            } else {
                // If we do not redirect, we must hide the login overlay
                hide_modal(modal_id);

                // Reset input fields
                username_element.val('');
                password_element.val('');

                // Trigger event that can be handled by the page to
                // display
                $(document).trigger('login');
            }
        } else if (details.credentials < 3) {
            window.location.href = 'staff.html'; // Redirect
        }
    } else {
        show_modal_error(modal_id);
    }
}

function logout() {
    const username = window.sessionStorage.getItem('user');

    if (username) {
        window.sessionStorage.clear();
        $(document.body).removeClass('logged-in');
    }
}
