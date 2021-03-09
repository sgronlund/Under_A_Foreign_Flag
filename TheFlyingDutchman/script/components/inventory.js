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
        stock_warning_limit: 5,
        current_product_add_type: 'beer',
        custom_products: {},
        menu_keys: {
            regular: 'on_menu',
            special: 'on_special_menu',
        },
        product_types: {
            beer: 'beer',
            wine: 'wine',
            other: 'other',
        },
        storage_keys: {
            inventory: 'inventory',
            custom_products: 'custom_products',
        },
    },

    // =====================================================================================================
    // DOM ELEMENTS
    //
    element: {
        inventory_container: '#inventory_view',
        inventory_forpackning_input: '#inventory_forpackning_input',
        inventory_add_type_select: '#inventory_add_type_select',
        inventory_alkoholhalt_input: '#inventory_alkoholhalt_input',
        inventory_koscher_input: '#inventory_koscher_input',
        inventory_producent_input: '#inventory_producent_input',
        inventory_name_input: '#inventory_name_input',
        inventory_price_input: '#inventory_price_input',
        inventory_add_dynamic_inputs: '#inventory_add_dynamic_inputs',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
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

        update_inventory_add_modal: function() {
            const inputs = this.view.create_type_inputs();

            this.element.inventory_add_dynamic_inputs.html(inputs);

            // Update translations for labels of input boxes
            window.tfd.localization.view.update_localization_component('staff');
        },

        create_type_inputs: function() {
            if (this.model.current_product_add_type === this.model.product_types.wine) {
                return (`
                    <div class="box row fill-width margin-top">
                        <div class="box fill-width margin-right">
                            <label for="inventory_grape_input" id="inventory_grape_input_label"></label>
                            <input type="text" id="inventory_grape_input" />
                        </div>

                        <div class="box">
                            <label for="inventory_year_input" id="inventory_year_input_label"></label>
                            <input type="number" step="1" min="1800" max="${new Date().getFullYear()}" id="inventory_year_input" />
                        </div>
                    </div>

                    <label for="inventory_type_input" id="inventory_type_input_label"></label>
                    <input type="text" id="inventory_type_input" />
                `);
            }

            return (`
                <label for="inventory_sort_input" id="inventory_sort_input_label"></label>
                <input type="text" id="inventory_sort_input" />

                <label for="inventory_origin_input" id="inventory_origin_input_label"></label>
                <input type="text" id="inventory_origin_input" />
            `);
        },

        create_inventory_item: function(product_id, stock, price, on_menu, on_special_menu) {
            const { nr, namn } = this.global.drinks[product_id];
            const low_stock = stock <= this.model.stock_warning_limit;

            return (`
                <article class="card box space-between margin-bottom">
                    <div class="box row space-between">
                        <div class="box row v-center">
                            <p class="card-title-tag inventory-item-id">ID: ${nr}</p>
                            ${low_stock ? '<p class="card-title-tag inventory_item_low_stock"></p>' : ''}
                            <h4>${namn}</h4>
                        </div>

                        ${this.global.is_manager ? `
                            <button class="extra-light small margin-left" onclick="window.tfd.inventory.controller.remove(${product_id})">
                                <span class="inventory_item_remove_text">Remove</span>
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
                                             4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                            ` : ''
                        }
                    </div>
                    <div class="inventory-item-data box row v-center fill-width margin-top-lg">
                        <div class="inventory-item-description">
                            <div class="input-container unit-spacing fill">
                                <label class="inventory_item_stock_text fill margin-right"></label>
                                <input
                                    type="number"
                                    onchange="window.tfd.inventory.controller.update_stock(this, ${product_id})"
                                    value="${stock}"
                                    min="0"
                                />
                                <p class="input-value-unit inventory_item_stock_pcs_text"></p>
                            </div>
                        </div>
                        <div class="inventory-item-description">
                            <div class="input-container fill">
                                <label class="inventory_item_price_text">Price:</label>
                                <input type="number" min="0" value="${price}" step="0.01"
                                       class="inventory-item-price-input no-spinner"
                                       onchange="window.tfd.inventory.controller.update_price(event, ${product_id})"
                                />
                                <p class="input-value-unit">SEK</p>
                            </div>
                        </div>
                        <div class="inventory-item-description">
                            <div class="input-container fill">
                                <label class="inventory_item_menu_text">On menu:</label>
                                <input type="checkbox" ${on_menu && 'checked'}
                                       onchange="window.tfd.inventory.controller.change_on_menu(event, ${product_id})"
                                />
                            </div>
                        </div>
                        <div class="inventory-item-description">
                            <div class="input-container fill">
                                <label class="inventory_item_special_menu_text">On special menu:</label>
                                <input type="checkbox" ${on_special_menu && 'checked'}
                                       onfocusout="window.tfd.inventory.controller.change_on_special_menu(event, ${product_id})"
                                />
                            </div>
                        </div>
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
            const custom_products = window.localStorage.getItem(this.model.storage_keys.custom_products);

            if (!inventory) {
                // If no inventory is saved, use the default inventory
                this.global.inventory = INVENTORY;
            } else {
                this.global.inventory = JSON.parse(inventory);
            }

            if (custom_products) {
                this.model.custom_products = JSON.parse(custom_products);
                Object.assign(this.global.drinks, this.model.custom_products);
            }
        },

        save: function() {
            // Save the current inventory
            window.localStorage.setItem(this.model.storage_keys.inventory, JSON.stringify(this.global.inventory));

            // Save any added custom products
            window.localStorage.setItem(this.model.storage_keys.custom_products, JSON.stringify(this.model.custom_products));
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
                return parseFloat(price);
            }

            return parseFloat(this.global.drinks[product_id].prisinklmoms);
        },

        add: function() {
            const type = this.element.inventory_add_type_select.val();

            const largest_id = parseInt(Object.keys(this.global.drinks).reduce((x, y) => x.length > y.length ? x : y));
            const new_id = largest_id + 1;

            const new_product = {
                nr: new_id.toString(),
                namn: this.element.inventory_name_input.val(),
                prisinklmoms: parseFloat(this.element.inventory_price_input.val()),
                koscher: this.element.inventory_koscher_input.prop('checked') ? '1' : '0',
                description: {
                    forpackning: this.element.inventory_forpackning_input.val(),
                    producent: this.element.inventory_producent_input.val(),
                    alkoholhalt: this.element.inventory_alkoholhalt_input.val() + '%',
                },
            };

            if (type === this.model.product_types.wine) {
                new_product.description['typ'] = $('#inventory_type_input').val();
                new_product.description['argang'] = $('#inventory_year_input').val();
                new_product.description['druva'] = $('#inventory_grape_input').val();
            } else {
                new_product.description['ursprunglandnamn'] = $('#inventory_origin_input').val();
                new_product.description['sort'] = $('#inventory_sort_input').val();
            }

            console.log(new_product);

            // Add to list of custom products that should be saved
            this.model.custom_products[new_id] = new_product;

            // Save to global drinks list
            this.global.drinks[new_id] = new_product;

            // Save to inventory so that it can be displayed
            this.global.inventory[new_id] = {
                stock: 0,
                on_menu: false,
                on_special_menu: false,
            };

            // Re-render inventory
            this.view.update_inventory();

            // Hide the modal
            window.tfd.modal.controller.hide();

            // Save new product to localStorage
            this.controller.save();
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

        update_stock: function(input, product_id) {
            // TODO: Debounce this shit
            if (!input) {
                console.error('Could not update stock of product - invalid input element');
                return;
            }

            const previous_stock = this.controller.get_stock_of_product(product_id);
            const change = parseInt($(input).val()) - previous_stock;

            if (!this.controller.update_stock_for_product(product_id, change, 0)) {
                this.view.update_inventory();

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

        set_product_add_type: function() {
            const selected_type = this.element.inventory_add_type_select.val();

            if (!selected_type) {
                this.model.current_product_add_type = this.model.product_types.beer;
            } else {
                this.model.current_product_add_type = selected_type;
            }

            this.view.update_inventory_add_modal();
        },
    },

    // =====================================================================================================
    // MODULE INIT
    //
    init: function() {
        this.controller.load();
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        render_inventory: function() {
            this.view.update_inventory();
        },

        render_inventory_modal: function() {
            this.controller.set_product_add_type();
        },
    },
});
