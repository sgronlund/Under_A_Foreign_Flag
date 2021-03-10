// =====================================================================================================
//  Functions for rendering the menu and the special drinks menu
// =====================================================================================================
// Authors: Namn, 2021
//
// Theses functions render the different views/options the customer can access, i.e. the special drinks menu (if the customer is VIP),
// the ordinary drinks menu and the order.
//
window.tfd.add_module('customer', {
    global: {
        table_id: null, 
    },
    
    model: {
        max_table_id: 18,
    },
    
    // =====================================================================================================
    // PAGE ROUTES/VIEWS
    //
    route: {
        menu: {
            body_class: 'view-menu',
            subview: {
                drinks: {
                    default: true,
                    body_class: 'subview-drinks',
                },

                special_drinks: {
                    body_class: 'subview-special-drinks',
                },
            },
        },

        order: {
            body_class: 'view-order',
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        show_menu: function() {
            this.set_route(this.route.menu);
        },

        show_order: function() {
            this.set_route(this.route.order);
        },

        show_drinks: function() {
            this.set_route(this.route.drinks);
        },

        show_special_drinks: function() {
            this.set_route(this.route.special_drinks);
        },
        
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.controller.show_menu();
        
        // Create a unique table id for this session
        this.global.table_id = Math.floor(Math.random() * this.model.max_table_id);
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        logout: function() {
            // When we logout, we must make sure to hide the "VIP" section of the menu
            // by switching to the regular menu. This will not change the current view,
            // since the drinks and special drinks tab is a subview of the menu view.
            this.controller.show_drinks();
        },
    },
});
