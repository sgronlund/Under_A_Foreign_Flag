window.tfd.add_module('customer', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        current_view: 'view-menu',
        current_subview: 'subview-drinks',
        previous_view: null,
        previous_subview: null,
        ids: {
            user_name: '#welcome_name',
            user_credit: '#vip_credit',
        },
        views: {
            menu: 'view-menu',
            order: 'view-order',
            drinks: 'subview-drinks',
            special_drinks: 'subview-special-drinks',
        },
        classes: {
        },
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        // Renders the VIP footer when logged in
        update_vip_footer: function() {
            if (!this.global.logged_in) {
                return;
            }

            const { first_name, last_name, creditSEK } = this.global.user_details;
            const fullname = first_name + " " + last_name;
            const balance = creditSEK ? creditSEK : 0;

            $(this.model.ids.user_name).text(fullname);
            $(this.model.ids.user_credit).text(balance + " SEK");
        },

        update_body: function() {
            if (this.model.previous_view) {
                $(document.body).removeClass(this.model.previous_view);
            }

            if (this.model.previous_subview) {
                $(document.body).removeClass(this.model.previous_subview);
            }

            // Update the current main view
            switch (this.model.current_view) {
                case this.model.views.menu:
                    $(document.body).addClass(this.model.views.menu);
                    break;

                case this.model.views.order:
                    $(document.body).addClass(this.model.views.order);
                    break;
            }

            // Update the current subview inside the main view
            switch (this.model.current_subview) {
                case this.model.views.drinks:
                    $(document.body).addClass(this.model.views.drinks);
                    break;

                case this.model.views.special_drinks:
                    $(document.body).addClass(this.model.views.special_drinks);
                    break;
            }
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        set_view: function(new_view) {
            this.model.previous_view = this.model.current_view;
            this.model.current_view = new_view;
            this.view.update_body();
        },

        set_subview: function(new_subview) {
            this.model.previous_subview = this.model.current_subview;
            this.model.current_subview = new_subview;
            this.view.update_body();
        },

        show_menu: function() {
            this.controller.set_view(
                this.model.views.menu
            );
        },

        show_order: function() {
            this.controller.set_view(
                this.model.views.order
            );
        },

        show_drinks: function() {
            this.controller.set_subview(
                this.model.views.drinks
            );
        },

        show_special_drinks: function() {
            this.controller.set_subview(
                this.model.views.special_drinks
            );
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.trigger('render_products');
    },

    // =====================================================================================================
    // MODULE LOAD
    //
    init: function() {
        // Load products into global state
        this.global.products = allBeverages();
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        login: function() {
            this.view.update_vip_footer();
        },
    },
});
