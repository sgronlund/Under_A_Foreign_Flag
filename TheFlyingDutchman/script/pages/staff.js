window.tfd.add_module('staff', {
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
    view: {},

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {},

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
    signal: {},
});
