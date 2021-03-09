window.tfd.add_module('staff', {
    // =====================================================================================================
    // PAGE ROUTES/VIEWS
    //
    route: {
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

        inventory: {
            body_class: 'view-inventory',
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

        show_inventory: function() {
            this.set_route(this.route.inventory);
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.trigger('render_inventory');
        this.trigger('render_inventory_modal');
        this.trigger('render_orders');
        this.trigger('render_product_dropdown');

        this.controller.show_orders();
        
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
