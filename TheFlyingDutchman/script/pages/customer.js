// =====================================================================================================
//  Functions for rendering the menu and the special drinks menu
// =====================================================================================================
// Authors: Namn, 2021
//
// Theses functions render the different views/options the customer can access, i.e. the special drinks menu (if the customer is VIP),
// the ordinary drinks menu and the order.
//
window.tfd.add_module('customer', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        current_view: 'view-menu',
        current_subview: 'subview-drinks',
        previous_view: null,
        previous_subview: null,
        views: {
            menu: 'view-menu',
            order: 'view-order',
            drinks: 'subview-drinks',
            special_drinks: 'subview-special-drinks',
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

            if (this.model.previous_subview) {
                $(document.body).removeClass(this.model.previous_subview);
            }

            if (this.model.current_view == this.model.views.menu) {
                // Batch classes together to prevent multiple layout rerenders
                $(document.body).addClass([
                    this.model.current_view,
                    this.model.current_subview
                ]);
            } else {
                $(document.body).addClass(this.model.current_view);
            }
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

        set_subview: function(new_subview) {
            this.model.previous_subview = this.model.current_subview;
            this.model.current_subview = this.model.views[new_subview];

            this.view.update_body();
        },

        show_menu: function() {
            this.controller.set_view('menu');
        },

        show_order: function() {
            this.controller.set_view('order');
        },

        show_drinks: function() {
            this.controller.set_subview('drinks');
            this.trigger('show_drinks');
        },

        show_special_drinks: function() {
            this.controller.set_subview('special_drinks');
            this.trigger('show_special_drinks');
        },
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        logout: function() {
            // Special drinks can only be viewed by VIP customers
            if (this.model.current_view == this.model.views.menu) {
                this.controller.set_subview('drinks');
            }
        },
    },
});
