function greet() {
    var username = window.sessionStorage.getItem('user');
    if (username) {
        const details = userDetails(username);
        const fullname = details.first_name + " " + details.last_name;
        
        $(document.body).addClass('logged-in');
        $("#welcome_name").text(fullname);
    }
}

$(document).ready(function() {
    greet();
});

function logout() {
    var username = window.sessionStorage.getItem('user');
    if (username) {
        // const details = userDetails(username);
        // const fullname = details.first_name + " " + details.last_name;
        
        // $("#goodbye").css('display', 'flex');
        // $("#goodbye_name").text(fullname);
        window.sessionStorage.removeItem('user');
        $(document.body).removeClass('logged-in');
    }
    
}