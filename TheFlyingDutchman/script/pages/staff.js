// =====================================================================================================
// Functions specific to the staff page
// =====================================================================================================
// Authors: Fredrik Engstrand, 2021
//          Dante Grenholm, 2021
//          Sebastian Grönlund, 2021
//          Hampus Sandqvist, 2021
//          Kevin Hormiz, 2021    
//
// This file registers the available routes that can be navigated to using the menu, as well as 
// triggering signals that will render the data that is needed by the page. 
//
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
    // ELEMENT
    //
    element: {
        balance_input: '#balance_input',
        username_input: '#username_input',
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
        
        add_to_balance: function() {
            const user = userDetails($(this.element.username_input).val());
            const new_balance = $(this.element.balance_input).val();
            
            // If the user is not found, it will be an empty object ({})
            if (Object.keys(user).length <= 0 || !new_balance) {
                // Show error notification
                window.tfd.notification.controller.show_balance_update_failure_notification();
            } else {
                // Update the users balance
                window.tfd.vip.controller.update_balance(user, new_balance);
                
                // Show success notification
                window.tfd.notification.controller.show_balance_update_success_notification()
            }
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
        
        // In the inventory, items that are low in stock will have a tag applied to them 
        // with a class. Doing this element-lookup after rendering the inventory will
        // tell us if there are any items low in stock or not without going through the
        // inventory again. 
        if ($('.inventory_item_no_stock').length > 0){
            // Show notification that there are products with no stock
            window.tfd.notification.controller.show_inventory_no_stock();
        } else if ($('.inventory_item_low_stock').length > 0) {
            // Show notification that there are products with low stock
            window.tfd.notification.controller.show_inventory_low_stock();
        }
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        logout: function() {
            // Only logged in users are allowed on the staff page
            window.location.href = 'index.html'
        },
    }
});
