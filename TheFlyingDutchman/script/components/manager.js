// =====================================================================================================
//  Functions for rendering and handling the pubs inventory
// =====================================================================================================
// Authors: Namn, 2021
//
// These function allow the manager to see which items are in the different menus, remove and add different
// items from the inventory and update the stock on items currently in inventory

window.tfd.add_module('manager', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        menu_keys: {
            regular: 'on_menu',
            special: 'on_special_menu',
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
                html += this.view.create_inventory_item(key, stock, on_menu, on_special_menu);
            }

            this.element.inventory_container.html(html);

            window.tfd.localization.view.update_localization_component('manager');
        },

        create_inventory_item: function(product_id, stock, on_menu, on_special_menu) {
            const { nr, namn, prisinklmoms } = this.global.drinks[product_id];

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
                                <span class="product-price">${prisinklmoms} SEK</span>
                            </p>
                            <p class="inventory-item-availability separator-right">
                                <span class="inventory_item_menu_text">On menu:</span>
                                <input type="checkbox" ${on_menu && 'checked'}
                                       onchange="window.tfd.manager.controller.change_on_menu(event, ${product_id})"
                                />
                            </p>
                            <p class="inventory-item-availability separator-right">
                                <span class="inventory_item_special_menu_text">On special menu:</span>
                                <input type="checkbox" ${on_special_menu && 'checked'}
                                       onchange="window.tfd.manager.controller.change_on_special_menu(event, ${product_id})"
                                />
                            </p>
                        </div>
                    </div>
                    <div class="box row v-center">
                        <button class="gray small square no-icon-spacing" onclick="window.tfd.manager.controller.decrease_stock(${product_id})">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <input type="number" class="product-quantity no-spinner" data-stock-input-id="${product_id}" value="${stock}" min="0" />
                        <button class="gray small square no-icon-spacing" onclick="window.tfd.manager.controller.increase_stock(${product_id})">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button class="extra-light small margin-left" onclick="window.tfd.manager.controller.remove(${product_id})">
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
            window.tfd.backend.controller.save();
        },

        decrease_stock: function(product_id) {
            if (!window.tfd.backend.controller.update_stock_for_product(product_id, -1, 0)) {
                this.view.update_stock(product_id);

                // Save the updated inventory
                window.tfd.backend.controller.save();
            }
        },

        increase_stock: function(product_id) {
            if (!window.tfd.backend.controller.update_stock_for_product(product_id, 1, 0)) {
                this.view.update_stock(product_id);

                // Save the updated inventory
                window.tfd.backend.controller.save();
            }
        },

        change_availability: function(product_id, menu_key, available) {
            const inventory_item = this.global.inventory[product_id];

            // Update the availability on one of the menus
            inventory_item[menu_key] = available;

            // Save the updated inventory
            window.tfd.backend.controller.save();
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
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.view.update_inventory();
    },
});
