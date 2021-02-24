window.tfd.add_module('login', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        logged_in: false,
        has_error: false,
        modal_open: false,
        user_details: null,
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
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_body: function() {
            if (this.model.logged_in) {
                $(document.body).addClass(this.model.classes.logged_in);
            } else {
                $(document.body).removeClass(this.model.classes.logged_in);
            }
        },

        update_modal: function() {
            if (!this.model.modal_open) {
                return;
            }

            const modal = $(this.model.ids.modal);

            if (this.model.logged_in) {
                // Reset input fields
                $(this.model.ids.username).val('');
                $(this.model.ids.password).val('');

                // Hide modal
                modal.removeClass(this.model.classes.show);
                return;
            }

            // TODO: Move modal hide/show to modal module
            modal.addClass(this.model.classes.show);

            if (this.model.has_error) {
                modal.addClass(this.model.classes.error);
            }
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

                if (redirect) {
                    // Checks credentials and redirects to the right page
                    if (details.credentials == 3) {
                        window.location.href = 'customer.html';
                    } else {
                        window.location.href = 'staff.html';
                    }
                }

                return;
            }


            this.model.has_error = true;
            this.view.update_modal();
        },

        // Loads the currently logged in user from sessionStorage and logs in
        load_logged_in_user: function() {
            const username = window.sessionStorage.getItem('user');

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

            window.sessionStorage.setItem('user', details.username);

            // Update model
            this.model.logged_in = true;
            this.model.has_error = false;
            this.model.user_details = details;

            this.view.update_body();
            this.view.update_modal();

            // Send signal to the customer controller and update VIP-footer
            window.tfd.controller.customer.set_logged_in();
        },

        logout: function() {
            window.sessionStorage.clear();

            this.model.logged_in = false;
            this.model.has_error = false;
            this.model.user_details = null;

            this.view.update_body();
            this.view.update_modal();

            // Send event to other modules
            $(document).trigger('login');
        },

        // TODO: Move show_modal/hide_modal to modal module
        show_modal: function() {
            this.model.modal_open = true;
            this.view.update_modal();
        },

        hide_modal: function() {
            this.model.modal_open = false;
            this.view.update_modal();
        },

        is_logged_in: function() {
            return this.model.logged_in;
        },

        get_user_details: function() {
            return this.model.user_details;
        }
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
    }
});
