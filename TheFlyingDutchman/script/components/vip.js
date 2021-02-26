window.tfd.add_module('vip', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        ids: {
            user_name: '#welcome_name',
            user_credit: '#vip_credit',
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
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
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
