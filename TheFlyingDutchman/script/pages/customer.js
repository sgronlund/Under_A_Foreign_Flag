window.tfd.add_module('customer', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        current_view: 'menu',
        ids: {
            user_name: '#welcome_name',
            user_credit: '#vip_credit',
        },
        classes: {
            view_menu: 'view-menu',
            view_order: 'view-order',
        },
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        // Renders the VIP footer when logged in
        update_vip_footer: function() {
            if (!window.tfd.controller.login.is_logged_in()) {
                return;
            }

            const {
                first_name,
                last_name,
                creditSEK
            } = window.tfd.controller.login.get_user_details();

            const fullname = first_name + " " + last_name;
            const balance = creditSEK ? creditSEK : 0;

            $(this.model.ids.user_name).text(fullname);
            $(this.model.ids.user_credit).text(balance + " SEK");
        },

        update_body: function() {
            if (this.model.current_view == 'menu') {
                $(document.body).addClass(this.model.classes.view_menu);
                $(document.body).removeClass(this.model.classes.view_order);
            } else {
                $(document.body).removeClass(this.model.classes.view_menu);
                $(document.body).addClass(this.model.classes.view_order);
            }
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        set_logged_in: function() {
            this.view.update_vip_footer();
        },

        set_view: function(new_view) {
            this.model.current_view = new_view;
            this.view.update_body();
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        render_products();
    },

    // =====================================================================================================
    // MODULE LOAD
    //
    init: function() {
        $(document).on('login', this.view.update_vip_footer);
        products = allBeverages();
    }
});
