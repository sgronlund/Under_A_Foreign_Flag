window.tfd.add_module('staff', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        current_view: 'view-orders',
        previous_view: null,
        views: {
            menu: 'view-menu',
            orders: 'view-orders',
            inventory: 'view-inventory',
        },
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_body: function() {
            if (this.model.previous_view) {
                $(document.body).removeClass(this.model.previous_view);
            }

            $(document.body).addClass(this.model.current_view);
        },

        security_notification: function() {
            window.alert("Security has been notified!");
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        set_view: function(new_view) {
            this.model.previous_view = this.model.current_view;
            this.model.current_view = this.model.views[new_view];
            this.view.update_body();
        },

        show_menu: function() {
            this.controller.set_view('menu');
        },

        show_orders: function() {
            this.controller.set_view('orders');
        },

        show_inventory: function() {
            this.controller.set_view('inventory');
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.trigger('render_orders');
        this.trigger('render_product_dropdown');
    },

    signal: {
        logout: function() {
            window.location.href = 'index.html'
        },
    }
});
