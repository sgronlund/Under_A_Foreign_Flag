// =====================================================================================================
// Functions specific to the start page
// =====================================================================================================
// Authors: Fredrik Engstrand, 2021
//          Dante Grenholm, 2021
//          Sebastian Grönlund, 2021
//          Hampus Sandqvist, 2021
//          Kevin Hormiz, 2021    
//
window.tfd.add_module('index', {
    init: function() {
        // Cleans the sessionStorage in which we store the currently logged in user
        // Essentially, going to the index page is the same as logging out
        window.sessionStorage.clear();
    },
});
