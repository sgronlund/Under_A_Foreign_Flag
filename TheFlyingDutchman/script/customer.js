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

$(document).on('login', function () {
    greet();  
});

$(document).ready(function() {
    greet();
});