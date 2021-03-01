// =====================================================================================================
// Backend functions for the orders, inventory and menus.
// =====================================================================================================
// Authors: Namn, 2021
//
// This file contains functions which handles the stock of the items in the pubs inventory, i.e. updating the 
// inventory if an item has run out of stock, aswell as saving the orders handled by system.
//


window.tfd.add_module('backend', {
    // =====================================================================================================
    // GLOBAL MODEL
    //
    global: {
        drinks: null,
        inventory: null,
        menu: [],
        special_menu: [],
        orders: {},
        completed_orders: {},
    },

    // =====================================================================================================
    // MODEL
    //
    model: {
        next_order_id: 0,
        storage_keys: {
            order: {
                orders: 'orders',
                completed_orders: 'completed_orders',
            },
            next_order_id: 'next_order_id',
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        load: function() {
            // Load each item from localStorage and store in the global state
            for (const key of Object.keys(this.model.storage_keys.order)) {
                const state = window.localStorage.getItem(this.model.storage_keys.order[key]);
                Object.assign(this.global[key], JSON.parse(state));
            }

            // Load the next order id
            const next_order_id = window.localStorage.getItem(this.model.storage_keys.next_order_id);

            // If a saved order id exists, use it. Otherwise, default to 0.
            if (next_order_id) {
                this.model.next_order_id = parseInt(next_order_id);
            }

            // Load drinks from database and store in global model
            this.global.drinks = load_drinks(DRINKS);
            this.global.inventory = INVENTORY;
        },

        save: function() {
            // Save pending and completed orders
            for (const key of Object.keys(this.model.storage_keys.order)) {
                window.localStorage.setItem(key, JSON.stringify(this.global[key]));
            }

            // Save the next order id so that we do not create duplicate order id's after reload
            window.localStorage.setItem(this.model.storage_keys.next_order_id, this.model.next_order_id);
        },

        get_stock_of_product: function(product_id) {
            // Since orders that have been checked out decrease the stock of a product,
            // we only have to check the available stock in the inventory.
            if (!this.global.inventory.hasOwnProperty(product_id)) {
                // No stock if the product does not exist
                console.error(`Could not get stock of invalid product id: ${product_id}`);
                return 0;
            }

            return this.global.inventory[product_id].stock;
        },

        update_menus: function() {
            if (!this.global.inventory) {
                console.error('Inventory database has not been loaded!');
                return;
            }

            // Reset the menu's to account for changes to the inventory
            this.global.menu = [];
            this.global.special_menu = [];

            for (const product_id of Object.keys(this.global.inventory)) {
                const item = this.global.inventory[product_id];

                // Skip if the item is not in stock
                if (item.stock <= 0) {
                    continue;
                }

                // Add to regular menu
                if (item.on_menu) {
                    this.global.menu.push(product_id);
                }

                // Add to special menu
                if (item.on_special_menu) {
                    this.global.special_menu.push(product_id);
                }
            }

            // Trigger event so that other modules can re-render products
            this.trigger('menus_updated');
        },

        update_stock_for_product: function(product_id, change) {
            const inventory_item = this.global.inventory[product_id];

            // Update the quantity in stock.
            // For simplicity, we assume that orders are always valid
            // and do not exceed the current stock of a product.
            // This should be checked before a product is even added to the order.
            //
            // To make this function more generalized, we add the change in stock
            // to the existing stock. This way we can both increase and decrease the
            // stock by simply passing in the difference, e.g. -10.
            inventory_item.stock += change;

            // Item will no longer be available, so we must make sure to update the
            // menu to reflect this.
            if (inventory_item.stock <= 0) {
                return true;
            }

            // Product is still in stock, return false to indicate that
            // a menu update is not required for this product.
            return false;
        },

        update_inventory_for_order: function(order) {
            // We only have to update and re-render the menu iff
            // a product in the order has a stock of 0 after decreasing.
            let should_update_menus = false;

            // Iterate and remove all items from order, "simulating" paying for the items to a staff member.
            for (const product_id of Object.keys(order.items)) {
                const order_item = order.items[product_id];

                // If any of the products in the order gets a stock of 0, 'should_update_menus' will
                // be set to true.
                //
                // We must make sure to multiply the quantity with -1 to decrease the stock.
                if (this.controller.update_stock_for_product(product_id, (-1) * order_item.quantity)) {
                    should_update_menus = true;
                }
            }

            if (should_update_menus) {
                this.controller.update_menus();
            }
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

            // Update the inventory by decreasing the stock for each product in the order.
            // This is done before the order is completed since we do not want
            // multiple orders to compete for the same stock.
            this.controller.update_inventory_for_order(this.global.orders[order_id]);

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

            // Mark order as complete
            this.global.completed_orders[order_id] = this.global.orders[order_id];

            // Remove the order from the pending orders list
            delete this.global.orders[order_id];

            // Save the current state
            this.controller.save();
        },

        complete_special_drink_selection: function(product_id) {
            // Check if the stock update causes the product to be out of stock
            if (this.controller.update_stock_for_product(product_id, -1)) {
                this.controller.update_menus();
            }
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        // Loads the menu and special menu based on the inventory information
        this.controller.update_menus();
    },

    // =====================================================================================================
    // MODULE LOAD
    //
    init: function() {
        this.controller.load();
    },
});
