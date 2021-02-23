function greet() {
    var username = window.sessionStorage.getItem('user');
    
    if (username) {
        const details = userDetails(username);
        const fullname = details.first_name + " " + details.last_name;
        let balance = details['creditSEK'];
        
        $(document.body).addClass('logged-in');
        $("#welcome_name").text(fullname);
        
        // If the user for some reason does not have a balance
        if (balance == null && balance == undefined) {
            balance = 0;  
        }
        
        $("#vip_credit").text(balance + " SEK");
    }
}

function show_order() {
    $(document.body).removeClass('view-menu');
    $(document.body).addClass('view-order');
    render_order();
}

function show_menu() {
    $(document.body).removeClass('view-order');
    $(document.body).addClass('view-menu');
}

$(document).on('login', function () {
    greet();  
});

$(document).on('db-loaded', function() {
    render_products();
});

$(document).ready(function() {
    greet();
});