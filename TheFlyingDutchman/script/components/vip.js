window.tfd.add_module('vip', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        selected_drink: null,
        generated_code: null,
        code_length: 4,
        ids: {
            user_name: '#welcome_name',
            user_credit: '#vip_credit',
            special_drink_code: '#special_drink_code',
            special_drink_name: '#special_drink_product_name',
            special_drink_price: '#special_drink_product_price',
            special_drink_container: '#special_drink_container',
        },
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

            const { first_name, last_name, creditSEK } = this.global.user_details;
            const fullname = first_name + " " + last_name;
            const balance = creditSEK ? creditSEK : 0;

            $(this.model.ids.user_name).text(fullname);
            $(this.model.ids.user_credit).text(balance + " SEK");
        },

        update_special_drink_modal: function() {
            if (!this.model.selected_drink) {
                window.tfd.modal.controller.hide();
                return;
            }

            const { namn, prisinklmoms } = this.model.selected_drink;

            $(this.model.ids.special_drink_name).text(namn);
            $(this.model.ids.special_drink_price).text(prisinklmoms + ' SEK');

            if (this.model.generated_code) {
                // Set and show the generated code
                console.log(this.model.generated_code);
                $(this.model.ids.special_drink_code).text(this.model.generated_code);
                $(this.model.ids.special_drink_container).addClass('show-code');
            } else {
                $(this.model.ids.special_drink_container).removeClass('show-code');
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

            const { nr, prisinklmoms } = this.model.selected_drink;

            if (this.controller.update_balance(prisinklmoms)) {
                this.controller.generate_special_drink_code();

                // Decrease stock of the selected drink
                window.tfd.backend.controller.complete_special_drink_selection(nr);
            };
        },

        update_balance: function(price) {
            const current_balance = this.global.user_details.creditSEK;
            const updated_balance = current_balance - price;
            if (updated_balance < 0) {
                return false;;
            }
            else {
                changeBalance(this.global.user_details.username, updated_balance); //Updates the database temporarily
                this.global.user_details = userDetails(this.global.user_details.username); //Fetches new data

                this.view.update_footer(); //Updates the view, showing the new balance
                return true;
            }

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
        }
    }
});
