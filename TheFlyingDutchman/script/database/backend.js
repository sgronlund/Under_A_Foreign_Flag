window.tfd.add_module('backend', {
    // =====================================================================================================
    // GLOBAL MODEL
    //
    global: {
        drinks: null,
        special_drinks: null,
        menu: {},
        special_menu: {},
        orders: {},
        completed_orders: {},
    },

    // =====================================================================================================
    // MODEL
    //
    model: {
        next_order_id: 0,
        storage_keys: {
            menu: 'menu',
            special_menu: 'special_menu',
            orders: 'orders',
            completed_orders: 'completed_orders',
        },
        order_id_key: 'next_order_id',
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        load: function() {
            // Load each item from localStorage and store in the global state
            for (const key of Object.keys(this.model.storage_keys)) {
                const state = window.localStorage.getItem(this.model.storage_keys[key]);
                Object.assign(this.global[key], JSON.parse(state));
            }

            // Load the next order id
            const order_id_key = window.localStorage.getItem(this.model.order_id_key);

            // If a saved order id exists, use it. Otherwise, default to 0.
            if (order_id_key) {
                this.model.next_order_id = parseInt(order_id_key);
            }

            // Load drinks from database and store in global model
            this.global.drinks = load_drinks(DRINKS);
            this.global.special_drinks = load_drinks(SPECIAL_DRINKS);

            console.log(this.global);
        },

        save: function() {
            for (const key of Object.keys(this.model.storage_keys)) {
                window.localStorage.setItem(key, JSON.stringify(this.global[key]));
            }

            window.localStorage.setItem(this.model.order_id_key, this.model.next_order_id);
        },

        get_unique_order_id: function() {
            return this.model.next_order_id;
        },

        // Marks an order as pending and must be completed manually using
        // the 'complete_order()' function.
        //
        // If the user is logged in as VIP and decides to pay with credit,
        // the 'complete_order()' function should be called directly after.
        checkout_order: function(table_id, order) {
            const order_id = this.model.next_order_id;

            // Save the order with the order_id as key
            this.global.orders[order_id] = {
                table_id,
                order: {},
            },

            // Create copy of order and save in global model
            Object.assign(this.global.orders[order_id], order);

            // Increase the order id
            this.model.next_order_id += 1;

            // Save the order
            this.controller.save();

            return order_id;
        },

        complete_order: function(order_id) {
            // If no order with the specified table_id and order_id exists
            if (!this.global.orders.hasOwnProperty(order_id)) {
                console.error(`Could not complete order with order id: ${order_id} - invalid order id`);
                return;
            }

            this.global.completed_orders[order_id] = this.global.orders[order_id];

            // Remove the order from the pending orders list
            delete this.global.orders[order_id];

            // TODO: Remove products from stock
            // Iterate and remove all items from order, "simulating" paying for the items to a staff member.
            //const items = this.model.order.items;

            //for (const key of Object.keys(items)) {
            //    // What should happen if we don't have a item in stock? Should that be handled when adding to our order?
            //}

            // Save the current state
            this.controller.save();
        },
    },

    // =====================================================================================================
    // MODULE LOAD
    //
    init: function() {
        this.controller.load();
    },
});
