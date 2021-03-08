// =====================================================================================================
//  Functions for logging in and out
// =====================================================================================================
// Authors: Namn, 2021
//
// This functionality is resused on every page where a user can login. At the moment redirection is also handled here,
// however at some point we'll only have a single html-page and no redirection can be done
//
window.tfd.add_module('login', {
    // =====================================================================================================
    // GLOBAL MODEL
    //
    global: {
        logged_in: false,
        is_manager: false,
        user_details: null,
    },

    // =====================================================================================================
    // MODEL
    //
    model: {
        current_href: null,
        storage_key: 'user',
        classes: {
            logged_in: 'logged-in',
            error: 'error',
            show: 'show',
        },
        pages: {
            index: 'index.html',
            customer: 'customer.html',
            staff: 'staff.html',
        },
        permissions: {
            manager: 0,
            staff: 2,
            vip: 3,
        },
    },

    // =====================================================================================================
    // DOM ELEMENTS
    //
    element: {
        username: '#username',
        password: '#password',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_body: function() {
            if (this.global.logged_in) {
                $(document.body).addClass(this.model.classes.logged_in);
            } else {
                $(document.body).removeClass(this.model.classes.logged_in);
            }
        },

        reset_input_fields: function() {
            this.element.username.val('');
            this.element.password.val('');
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        // Loads the currently logged in user from sessionStorage
        load: function() {
            const username = window.sessionStorage.getItem(this.model.storage_key);

            if (!username) {
                this.controller.logout();
                return;
            }

            const details = userDetails(username);

            this.controller.set_user_data(details);
        },

        // Updates the global model with the user data for a logged in user
        set_user_data: function(details) {
            this.global.logged_in = true;
            this.global.user_details = details;
            this.global.is_manager = details.credentials == this.model.permissions.manager;
        },

        redirect: function() {
            // Guests should only be allowed on the index and customer page
            if (!this.global.logged_in) {
                // The staff page should only be available for logged in users
                if (this.model.current_href == this.model.pages.staff) {
                    window.location.href = this.model.pages.index;
                }

                return;
            }

            const { credentials } = this.global.user_details;

            // Redirects the user to the right page according to their credentials
            if (credentials == this.model.permissions.vip) {
                if (this.model.current_href != this.model.pages.customer) {
                    window.location.href = this.model.pages.customer;
                }
            } else {
                if (this.model.current_href != this.model.pages.staff) {
                    window.location.href = this.model.pages.staff;
                }
            }

        },

        login: function() {
            const username_element = this.element.username;
            const password_element = this.element.password;

            // Fetch details from database
            const details = userDetails(username_element.val());

            // Compare password of user with the entered password
            if (details && details.password === password_element.val()) {
                this.controller.set_logged_in_user(details);
                window.tfd.modal.controller.hide_error();

                // Redirect if needed
                this.controller.redirect();

                this.view.reset_input_fields();
                window.tfd.modal.controller.hide();
                return;
            }

            window.tfd.modal.controller.show_error();
        },

        set_logged_in_user: function(details) {
            if (!details) {
                console.log('User is logged in, but not as a valid user');
                this.controller.logout();
                return;
            }

            window.sessionStorage.setItem(this.model.storage_key, details.username);

            // Update model
            this.controller.set_user_data(details);

            this.view.update_body();
            this.trigger('login');
        },

        logout: function() {
            window.sessionStorage.clear();

            this.global.logged_in = false;
            this.global.user_details = null;

            this.view.update_body();
            this.trigger('logout');
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        if (this.global.logged_in) {
            // If the user is logged in and has not been redirected, apply body classes and show
            // user-specific elements.
            this.controller.set_logged_in_user(this.global.user_details);
        }
    },

    // =====================================================================================================
    // MODULE LOAD
    //
    init: function() {
        // Extract html page from current location.
        // window.location.href contains the entire URL, including the domain name
        const href = window.location.href;
        const page_index = href.lastIndexOf('/');
        const current_href = href.substring(page_index + 1, href.length);

        this.model.current_href = current_href;

        // Load user details
        this.controller.load();

        // Redirect if needed
        this.controller.redirect();
    },

});
