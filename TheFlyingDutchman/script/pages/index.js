window.tfd.add_module('index', {
    init: function() {
        // Cleans the sessionStorage in which we store the currently logged in user
        // Essentially, going to the index page is the same as logging out
        window.sessionStorage.clear();
    },
});
