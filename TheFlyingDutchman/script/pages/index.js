window.tfd.add_module('index', {
    init: function() {
        //Cleans the sessionStorage in which we store the currently logged in user
        window.sessionStorage.clear();
    },
});
