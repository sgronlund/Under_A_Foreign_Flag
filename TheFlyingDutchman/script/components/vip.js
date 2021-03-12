window.tfd.add_module('vip', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        selected_drink: null,
        generated_code: null,
        code_length: 4,
    },

    // =====================================================================================================
    // DOM ELEMENTS
    //
    element: {
        user_name: '#welcome_name',
        user_credit: '#vip_credit',
        special_drink_code: '#special_drink_code',
        special_drink_name: '#special_drink_product_name',
        special_drink_price: '#special_drink_product_price',
        special_drink_container: '#special_drink_container',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        // Renders the VIP footer when logged in
        update_footer: function() {
            if (!this.global.logged_in) {
                return;
            }

            // Gets all details of the currently logged in VIP user
            const { first_name, last_name, creditSEK } = this.global.user_details;
            const fullname = first_name + " " + last_name;
            const balance = creditSEK ? parseFloat(creditSEK) : 0;

            // Add details of user to the footer
            this.element.user_name.text(fullname);
            this.element.user_credit.text(balance.toFixed(2) + " SEK");
        },

        update_special_drink_modal: function() {
            if (!this.model.selected_drink) {
                window.tfd.modal.controller.hide();
                return;
            }

            // Get details of the selected special drink
            const { namn } = this.model.selected_drink;
            const price = window.tfd.inventory.controller.get_price_of_product(this.model.selected_drink.nr);

            // Renders the name and price of the special drink when the drink is selected
            this.element.special_drink_name.text(namn);
            this.element.special_drink_price.text(price + ' SEK');

            if (this.model.generated_code) {
                // Set and show the generated code
                console.log(this.model.generated_code);
                this.element.special_drink_code.text(this.model.generated_code);
                this.element.special_drink_container.addClass('show-code');
            } else {
                this.element.special_drink_container.removeClass('show-code');
            }
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        generate_special_drink_code: function() {
            this.model.generated_code = "";

            for (let i = 0; i < this.model.code_length; i++) {
                // Add random number between 0-9 to the generated code
                this.model.generated_code += Math.floor(Math.random() * 9);
            }

            this.view.update_special_drink_modal();
        },

        select_special_drink: function(id) {
            // Reset generated code
            this.model.generated_code = null;
            this.model.selected_drink = this.global.drinks[id];
            this.view.update_special_drink_modal();
            window.tfd.modal.controller.show_special_drink();
        },

        confirm_special_drink: function() {
            if (!this.model.selected_drink) {
                console.error('Could not confirm special drink selection - no selected drink');
                return;
            }

            const { nr } = this.model.selected_drink;
            const price = window.tfd.inventory.controller.get_price_of_product(this.model.selected_drink.nr);

            if (this.controller.update_balance(this.global.user_details, (-1) * price)) {
                this.controller.generate_special_drink_code();

                // Update the global user details and the VIP footer
                this.controller.update_current_user();

                // Decrease stock of the selected drink
                window.tfd.backend.controller.complete_special_drink_selection(nr);
            } else {
                window.tfd.notification.controller.show_insufficent_funds_notification();
            }
        },

        update_current_user: function() {
            if (!this.global.logged_in) {
                return;
            }

            this.global.user_details = userDetails(this.global.user_details.username); // Fetches new data from database

            this.view.update_footer(); //Updates the view, showing the new balance
        },

        update_balance: function(user_details, change) {
            //Calculates the new balanced based on a price, this price can be any form of transaction
            const current_balance = user_details.creditSEK;
            const updated_balance = parseFloat(current_balance) + parseFloat(change);

            if (updated_balance < 0) {
                return false;
            }

            window.tfd.backend.controller.change_balance(user_details, updated_balance);

            return true;
        },
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        login: function() {
            this.view.update_footer();
        },

        logout: function() {
            this.view.update_footer();
        },
    }
});
