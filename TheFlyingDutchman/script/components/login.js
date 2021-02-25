window.tfd.add_module('login', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        ids: {
            modal: '#login_modal',
            username: '#username',
            password: '#password',
        },
        classes: {
            logged_in: 'logged-in',
            error: 'error',
            show: 'show',
        },
        storage_key: 'user',
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
            $(this.model.ids.username).val('');
            $(this.model.ids.password).val('');
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        login: function(redirect) {
            const username_element = $(this.model.ids.username);
            const password_element = $(this.model.ids.password);

            // Fetch details from database
            const details = userDetails(username_element.val());

            // Compare password of user with the entered password
            if (details && details.password === password_element.val()) {
                this.controller.set_logged_in_user(details);
                window.tfd.modal.controller.hide_error();

                if (redirect) {
                    // Checks credentials and redirects to the right page
                    if (details.credentials == 3) {
                        window.location.href = 'customer.html';
                    } else {
                        window.location.href = 'staff.html';
                    }
                } else {
                    this.view.reset_input_fields();
                    window.tfd.modal.controller.hide();
                }

                return;
            }

            window.tfd.modal.controller.show_error();
        },

        // Loads the currently logged in user from sessionStorage and logs in
        load_logged_in_user: function() {
            const username = window.sessionStorage.getItem(this.model.storage_key);

            if (!username) {
                console.log('User is not logged in');
                this.controller.logout();
                return;
            }

            const details = userDetails(username);

            this.controller.set_logged_in_user(details);
        },

        set_logged_in_user: function(details) {
            if (!details) {
                console.log('User is logged in, but not as a valid user');
                this.controller.logout();
                return;
            }

            window.sessionStorage.setItem(this.model.storage_key, details.username);

            // Update model
            this.global.logged_in = true;
            this.global.user_details = details;

            this.view.update_body();
            this.controller.signal();
        },

        logout: function() {
            window.sessionStorage.clear();

            this.global.logged_in = false;
            this.global.user_details = null;

            this.view.update_body();
            this.controller.signal();
        },

        // Send event to other modules
        signal: function() {
            $(document).trigger('login');
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.controller.load_logged_in_user();
    },

    // =====================================================================================================
    // MODULE LOAD
    //
    init: function() {
        const user = window.sessionStorage.getItem(this.model.storage_key);

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
    },
});
