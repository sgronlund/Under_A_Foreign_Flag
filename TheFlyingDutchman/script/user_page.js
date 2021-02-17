function greet() {
    var username = localStorage.getItem('user');
    if (username) {
        var details = userDetails(username);
        var fullname = details.first_name + " " + details.last_name;
        $("#welcome").text(fullname);
        console.log(fullname);
    }
}

$(document).ready(function() {
    greet();
});