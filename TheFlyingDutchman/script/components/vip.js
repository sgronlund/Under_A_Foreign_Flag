window.tfd.add_module('vip', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        selected_drink: null,
        ids: {
            user_name: '#welcome_name',
            user_credit: '#vip_credit',
            special_drink_name: '#special_drink_product_name',
            special_drink_price: '#special_drink_product_price',
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
                return;
            }

            const { namn, prisinklmoms } = this.model.selected_drink;

            $(this.model.ids.special_drink_name).text(namn);
            $(this.model.ids.special_drink_price).text(prisinklmoms + ' SEK');
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        select_special_drink: function(id) {
            this.model.selected_drink = this.global.special_drinks[id];
            this.view.update_special_drink_modal();
            window.tfd.modal.controller.show_special_drink();
        },
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        login: function() {
            this.trigger('render_special_products');
            this.view.update_footer();
        },

        logout: function() {
            this.view.update_footer();
        }
    }
});
