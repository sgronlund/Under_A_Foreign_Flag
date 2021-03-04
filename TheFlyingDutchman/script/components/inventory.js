// =====================================================================================================
//  Functions for rendering and handling the pubs inventory
// =====================================================================================================
// Authors: Namn, 2021
//
// These function allow the inventory to see which items are in the different menus, remove and add different
// items from the inventory and update the stock on items currently in inventory

window.tfd.add_module('inventory', {
    // =====================================================================================================
    // GLOBAL MODEL
    //
    global: {
        inventory: null,
    },

    // =====================================================================================================
    // MODEL
    //
    model: {
        menu_keys: {
            regular: 'on_menu',
            special: 'on_special_menu',
        },
        storage_keys: {
            inventory: 'inventory',
        },
    },

    // =====================================================================================================
    // DOM ELEMENTS
    //
    element: {
        inventory_container: '#inventory_view',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_stock: function(product_id) {
            const stock = this.global.inventory[product_id].stock;

            $(`[data-stock-id="${product_id}"]`).text(stock);
            $(`[data-stock-input-id="${product_id}"]`).val(stock);
        },

        update_inventory: function() {
            let html = ''
            const inventory = this.global.inventory;

            for (const key of Object.keys(inventory)) {
                const { stock, on_menu, on_special_menu } = inventory[key];
                const price = this.controller.get_price_of_product(key);
                html += this.view.create_inventory_item(key, stock, price, on_menu, on_special_menu);
            }

            this.element.inventory_container.html(html);

            window.tfd.localization.view.update_localization_component('inventory');
        },

        create_inventory_item: function(product_id, stock, price, on_menu, on_special_menu) {
            const { nr, namn } = this.global.drinks[product_id];

            return (`
                <article class="card box row space-between margin-bottom">
                    <div class="box fill margin-right-lg">
                        <div class="box row">
                            <p class="inventory-item-id">ID: ${nr}</p>
                            <h4>${namn}</h4>
                        </div>
                        <div class="inventory-item-data box row v-center margin-top-sm">
                            <p class="inventory-item-stock separator-right">
                                <span class="inventory_item_stock_text">Stock:</span>
                                <span data-stock-id="${product_id}" class="bold">${stock}</span>
                                <span class="inventory_item_stock_pcs_text"></span>
                            </p>
                            <p class="inventory-item-price separator-right">
                                <span class="inventory_item_price_text">Price:</span>
                                <input type="number" min="0" value="${price}" step="0.01"
                                       class="inventory-item-price-input no-spinner"
                                       onchange="window.tfd.inventory.controller.update_price(event, ${product_id})"
                                />
                                <span class="product-price">SEK</span>
                            </p>
                            <p class="inventory-item-availability separator-right">
                                <span class="inventory_item_menu_text">On menu:</span>
                                <input type="checkbox" ${on_menu && 'checked'}
                                       onchange="window.tfd.inventory.controller.change_on_menu(event, ${product_id})"
                                />
                            </p>
                            <p class="inventory-item-availability separator-right">
                                <span class="inventory_item_special_menu_text">On special menu:</span>
                                <input type="checkbox" ${on_special_menu && 'checked'}
                                       onfocusout="window.tfd.inventory.controller.change_on_special_menu(event, ${product_id})"
                                />
                            </p>
                        </div>
                    </div>
                    <div class="box row v-center">
                        <button class="gray small square no-icon-spacing" onclick="window.tfd.inventory.controller.decrease_stock(${product_id})">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <input type="number" class="product-quantity no-spinner" data-stock-input-id="${product_id}" value="${stock}" min="0" />
                        <button class="gray small square no-icon-spacing" onclick="window.tfd.inventory.controller.increase_stock(${product_id})">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button class="extra-light small margin-left" onclick="window.tfd.inventory.controller.remove(${product_id})">
                            <span class="inventory_item_remove_text">Remove</span>
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </article>
           `);
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        load: function() {
            // Load inventory from localStorage and merge with the default inventory in INVENTORY
            const inventory = window.localStorage.getItem(this.model.storage_keys.inventory);

            if (!inventory) {
                // If no inventory is saved, use the default inventory
                this.global.inventory = INVENTORY;
            } else {
                this.global.inventory = JSON.parse(inventory);
            }
        },

        save: function() {
            // Save the current inventory
            window.localStorage.setItem(this.model.storage_keys.inventory, JSON.stringify(this.global.inventory));
        },

        update_stock_for_product: function(product_id, change, min) {
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

            // Stock can not be negative
            if (inventory_item.stock < 0) {
                inventory_item.stock = 0;
            }

            // Item will no longer be available, so we must make sure to update the
            // menu to reflect this.
            if (inventory_item.stock < min) {
                return true;
            }

            // Save the updated inventory
            this.controller.save();

            // Product is still in stock, return false to indicate that
            // a menu update is not required for this product.
            return false;
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

        get_price_of_product: function(product_id) {
            if (!this.global.inventory.hasOwnProperty(product_id)) {
                console.error(`Could not get price of invalid product id: ${product_id}`);
                return 0;
            }

            // Inventory items will only have a set price if it has been updated by the staff.
            // If no price is set, we instead use the price of the product in the database.
            const { price } = this.global.inventory[product_id];

            // Check if the inventory item has a price
            if (price) {
                return parseFloat(price).toFixed(2);
            }

            return this.global.drinks[product_id].prisinklmoms.toFixed(2);
        },

        remove: function(product_id) {
            if (!this.global.inventory.hasOwnProperty(product_id)) {
                console.error('Could not remove product not in inventory: ${product_id}');
                return;
            }

            // Delete product from inventory object
            delete this.global.inventory[product_id];

            // Update the inventory product list
            this.view.update_inventory();

            // Save the updated inventory
            this.controller.save();
        },

        decrease_stock: function(product_id) {
            if (!this.controller.update_stock_for_product(product_id, -1, 0)) {
                this.view.update_stock(product_id);

                // Save the updated inventory
                this.controller.save();
            }
        },

        increase_stock: function(product_id) {
            if (!this.controller.update_stock_for_product(product_id, 1, 0)) {
                this.view.update_stock(product_id);

                // Save the updated inventory
                this.controller.save();
            }
        },

        update_price: function(ev, product_id) {
            const input = ev.target;

            if (!this.global.inventory.hasOwnProperty(product_id)) {
                console.error(`Could not update price of invalid product: ${product_id}`);
                return;
            }

            // Input did not pass the validation properties (e.g. type and min value)
            if (!input.checkValidity()) {
                return;
            }

            const new_price = parseFloat(input.value).toFixed(2);

            // Add new field to inventory product containing the updated price.
            // When rendering the menu, the renderer first checks if the inventory product
            // has a custom price set. If not, the default price in 'this.global.drinks' is used.
            this.global.inventory[product_id]['price'] = new_price;

            // Save the updated inventory
            this.controller.save();
        },

        change_availability: function(product_id, menu_key, available) {
            const inventory_item = this.global.inventory[product_id];

            // Update the availability on one of the menus
            inventory_item[menu_key] = available;

            // Save the updated inventory
            this.controller.save();
        },

        change_on_menu: function(ev, product_id) {
            this.controller.change_availability(
                product_id,
                this.model.menu_keys.regular,
                ev.target.checked
            );
        },

        change_on_special_menu: function(ev, product_id) {
            this.controller.change_availability(
                product_id,
                this.model.menu_keys.special,
                ev.target.checked
            );
        },
    },

    // =====================================================================================================
    // MODULE INIT
    //
    init: function() {
        this.controller.load();
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.view.update_inventory();
    },
});
