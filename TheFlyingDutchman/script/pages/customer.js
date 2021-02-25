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
        show_menu: function() {
            this.model.current_view = 'menu';
            this.view.update_body();
        },

        show_order: function() {
            this.model.current_view = 'order';
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
        $(document).on('login', window.tfd.customer.view.update_vip_footer);
        products = allBeverages();
    }
});
