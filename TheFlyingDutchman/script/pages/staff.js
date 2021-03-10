window.tfd.add_module('staff', {
    // =====================================================================================================
    // PAGE ROUTES/VIEWS
    //
    route: {
        users: {
            body_class: 'view-users'
        },
        inventory: {
            body_class: 'view-inventory',
        },
        orders: {
            body_class: 'view-orders',
            subview: {
                pending_orders: {
                    default: true,
                    body_class: 'subview-pending-orders',
                },

                completed_orders: {
                    body_class: 'subview-completed-orders',
                },
            },
        },
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        security_notification: function() {
            window.alert("Security has been notified!");
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        show_orders: function() {
            this.set_route(this.route.orders);
        },

        show_pending_orders: function() {
            this.set_route(this.route.pending_orders);
        },

        show_completed_orders: function() {
            this.set_route(this.route.completed_orders);
        },

        show_users: function() {
            this.set_route(this.route.users);
        },

        show_inventory: function() {
            this.set_route(this.route.inventory);
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        // Render orders first since it is the default view.
        // (Probably makes the initial render a few ms faster)
        this.trigger('render_orders');
        this.trigger('render_inventory');
        this.trigger('render_users');
        this.trigger('render_inventory_modal');
        this.trigger('render_product_dropdown');

        this.controller.show_orders();

        // Products in inventory that are low will be rendered with a tag with
        // this class. If any such element exist, we know that there are items
        // low in stock. This is faster than looping through every item again.
        if ($('.inventory_item_low_stock').length > 0) {
            // Show notification that there are products with low stock
            window.tfd.notification.controller.show_inventory_low_stock();
        }
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        logout: function() {
            window.location.href = 'index.html'
        },
    }
});
