// =====================================================================================================
// Backend functions for the orders, inventory and menus.
// =====================================================================================================
// Authors: Fredrik Engstrand, 2021
//          Dante Grenholm, 2021
//          Sebastian Grönlund, 2021
//          Hampus Sandqvist, 2021
//          Kevin Hormiz, 2021  
//
// This file contains functions for doing most of the backend actions which store different type of structure
// in localStorage to be able to save changes done in different views
//
window.tfd.add_module('backend', {
    // =====================================================================================================
    // GLOBAL MODEL
    //
    global: {
        drinks: null,
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
        balances: {},
        storage_keys: {
            order: {
                orders: 'orders',
                completed_orders: 'completed_orders',
            },
            next_order_id: 'next_order_id',
            balances: 'balances',
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
            
            // Load user balances
            const balances = window.localStorage.getItem(this.model.storage_keys.balances);
            
            // Checks if any balance has been updated from staff, i.e. we've stored a object in localStorage
            if (balances) {
                this.model.balances = JSON.parse(balances);
            }
            
            // When updating the user balance from the staff view we store this change in localStorage
            // Iterates through all the stored balance changes and update each balance for the corresponding user
            for (const user_id of Object.keys(this.model.balances)) {
                const user = DB.account.find(function(user) {
                    return user.user_id == user_id;
                });
                
                if (!user) {
                    continue;
                }
                
                user.creditSEK = this.model.balances[user_id];
            }

            // Load drinks from database and store in global model
            this.global.drinks = load_drinks(DRINKS);
        },

        save: function() {
            // Save pending and completed orders
            for (const key of Object.keys(this.model.storage_keys.order)) {
                window.localStorage.setItem(key, JSON.stringify(this.global[key]));
            }

            // Save the next order id so that we do not create duplicate order id's after reload
            window.localStorage.setItem(this.model.storage_keys.next_order_id, this.model.next_order_id);
            
            // Save custom balances
            window.localStorage.setItem(this.model.storage_keys.balances, JSON.stringify(this.model.balances));
        },

        update_menus: function() {
            if (!this.global.inventory) {
                console.error('Inventory database has not been loaded!');
                return;
            }

            // Reset the menu's to account for changes to the inventory
            // The menu arrays might have saved references in other variables
            // which means that they won't get the updated menu unless the read
            // from the global variable again. By setting the length property,
            // we mutate the original array (and therefore any other references).
            this.global.menu.length = 0;
            this.global.special_menu.length = 0;

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
                if (window.tfd.inventory.controller.update_stock_for_product(product_id, (-1) * order_item.quantity), 1) {
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

        // Undo a order completion
        uncomplete_order: function(order_id) {
            // If no order with the specified table_id and order_id exists
            if (!this.global.completed_orders.hasOwnProperty(order_id)) {
                console.error(`Could not uncomplete order with order id: ${order_id} - invalid order id`);
                return;
            }

            // Mark order as complete
            this.global.orders[order_id] = this.global.completed_orders[order_id];

            // Remove the order from the pending orders list
            delete this.global.completed_orders[order_id];

            // Save the current state
            this.controller.save();
        },

        complete_special_drink_selection: function(product_id) {
            // Check if the stock update causes the product to be out of stock
            if (window.tfd.inventory.controller.update_stock_for_product(product_id, -1), 1) {
                this.controller.update_menus();
            }
        },
        
        change_balance: function(user_details, new_balance) {
            changeBalance(user_details.username, new_balance); //Updates the database
            
            this.model.balances[user_details.user_id] = new_balance;
            
            // Save the update model to localStorage
            this.controller.save();
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
