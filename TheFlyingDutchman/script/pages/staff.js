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
            tables: 'view-tables',
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

        show_tables: function() {
            this.controller.set_view('tables');
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
        this.trigger('render_products');
        this.trigger('render_tables');
    },

    signal: {
        logout: function() {
            window.location.href = 'index.html'
        },
    }
});
