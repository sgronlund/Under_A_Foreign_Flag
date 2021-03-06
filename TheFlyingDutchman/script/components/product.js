// =====================================================================================================
// Functions for handling and rendering products
// =====================================================================================================
// Authors: Namn, 2020
//
// This file contains functions for filtering the products, adding the products to the users order aswell
// as rendering all the products from the pubs inventory
//
window.tfd.add_module('product', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        current_menu: null,
        current_container: null,
        current_full_menu: null,
        has_filters: false,
        checkbox_ids: {
            gluten: '#gluten',
            koscher: '#koscher',
            tannins: '#tannins',
            alcfree: '#alcfree',
        },
        max_quantity: 10,
    },

    // =====================================================================================================
    // DOM ELEMENTS
    //
    element: {
        container: '#menu',
        container_special: '#special_drinks',
        total_products: '#total_products_count',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_current_menu: function() {
            this.view.update_products();

            // Update the total products, since products might be removed
            // from the menu if the stock is 0.
            this.view.update_total_products();

            // Reset filter checkboxes if no filters are applied
            if (!this.model.has_filters) {
                this.view.reset_filter_checkboxes();
            }
        },

        update_total_products: function() {
            const total = this.model.current_menu.length;
            this.element.total_products.text(total);
        },

        update_products: function() {
            let html = "";
            const vip = this.model.current_container === this.element.container_special;

            for (const product_id of this.model.current_menu) {
                html += this.view.create_product(this.global.drinks[product_id], vip);
            }

            this.model.current_container.html(html);

            // Reapply the localization data for the current component (and only the current component).
            // It is unnecessary to reapply all localization data.
            window.tfd.localization.view.update_localization_component('product');
        },

        update_product_quantity: function(id, quantity) {
            $("[data-quantity-id='" + id + "']").val(quantity);
        },

        reset_product_quantity: function(id) {
            $("[data-quantity-id='" + id + "']").val(1);
        },

        reset_filter_checkboxes: function() {
            // When the users restores the filter we also restore all the filter options to be checked
            $(this.model.checkbox_ids.alcfree).prop('checked', true);
            $(this.model.checkbox_ids.gluten).prop('checked', true);
            $(this.model.checkbox_ids.koscher).prop('checked', true);
            $(this.model.checkbox_ids.tannins).prop('checked', true);
        },

        create_product: function(product, vip) {
            const { namn } = product;
            const price = window.tfd.inventory.controller.get_price_of_product(product.nr);
            const description = this.view.create_product_description(product);
            const actions = this.view.create_product_actions(product, vip);

            return (`
                <article class="product card box">
                    <div class="box row space-between v-center margin-bottom">
                        <h4 class="product-title">${namn}</h4>
                        <p class="product-price">${price} SEK</p>
                    </div>
                    <div class="box v-start fill padding-bottom">
                        <div class="box">${description}</div>
                    </div>
                    <div class="product-actions box row v-center space-between padding-top">
                        ${actions}
                    </div>
                </article>
            `);
        },

        create_product_actions: function(product, vip) {
            const { nr } = product;

            // Products on the special menu is not added to an order like other products.
            // They will be simply be removed from inventory when selected, and you may only
            // purchase one at a time.
            if (vip) {
                return (`
                    <button class="extra-light small fill-width" onclick="window.tfd.vip.controller.select_special_drink(${nr})">
                        <span class="product_select_special_drink_label"></span>
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11
                                  0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </button>
                `);
            }

            return (`
                <div class="box row v-center">
                    <button class="gray small square no-icon-spacing" onclick="window.tfd.product.controller.decrease_quantity(${nr})">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                    </button>
                    <input data-quantity-id="${nr}" class="product-quantity no-spinner" min="1" max="${this.model.max_quantity}" value="1" type="number"/>
                    <button class="gray small square no-icon-spacing" onclick="window.tfd.product.controller.increase_quantity(${nr})">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
                <button class="extra-light small" onclick="window.tfd.product.controller.add_to_order(${nr})">
                    <span class="product_add_to_order_label"></span>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            `);
        },

        create_product_description: function(product) {
            let description = ``;

            for (const key of Object.keys(product.description)){
                description += `
                    <p class="product-description-item">
                        <span class="product_${key}_label"></span>
                        <span>${product.description[key]}</span>
                    </p>
                `;
            }

            return description;
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        get_quantity: function(id) {
            const input_element = $("[data-quantity-id='" + id + "']");

            if (!input_element) {
                console.error(`Could not find quantity input with id: ${id}`);
                return;
            }

            return parseInt(input_element.val());
        },

        add_to_order: function(id) {
            let quantity = this.controller.get_quantity(id);
            const max_quantity = window.tfd.inventory.controller.get_stock_of_product(id);

            if (quantity > this.model.max_quantity) {
                // Make sure that we stay below the max quantity of orders
                console.warn(`Quantity of product exceeded the max quantity, changed to: ${this.model.max_quantity}`);
                quantity = this.model.max_quantity;
            } else if (quantity > max_quantity) {
                // Make sure that we do not exceed the available stock.
                // This might happen if the user manually changes the value of the input field.
                console.warn(`Quantity of product exceeded the available stock, changed to: ${max_quantity}`);
                quantity = max_quantity;
            }

            this.trigger('add_to_order', id, quantity);
            this.view.reset_product_quantity(id);
        },

        change_quantity: function(id, change) {
            const new_quantity = this.controller.get_quantity(id) + change;
            const max_quantity = window.tfd.inventory.controller.get_stock_of_product(id);

            if (new_quantity < 1 || new_quantity > max_quantity || new_quantity > this.model.max_quantity) {
                console.log(`Could not update quantity of product to: ${new_quantity}`);
                return;
            }

            this.view.update_product_quantity(id, new_quantity);
        },

        increase_quantity: function(id) {
            this.controller.change_quantity(id, 1);
        },

        decrease_quantity: function(id) {
            this.controller.change_quantity(id, -1);
        },

        filter: function(apply_filter) {
            const filters = [];

            // Checks which filters has been unchecked and stores the coresponding functions in an array which will later will be used to filter the current menu.
            if (apply_filter) {
                for (const key of Object.keys(this.model.checkbox_ids)) {
                    // Checks which checksbox has been unchecked
                    if (!document.getElementById(key).checked) {
                        if (key === 'koscher') {
                            filters.push(is_koscher);
                        } else if (key === 'tannins') {
                            filters.push(is_tannins)
                        } else if (key === 'gluten') {
                            filters.push(is_gluten)
                        } else {
                            filters.push(is_alcohol_free);
                        }
                    }
                }
            } else {
                // If apply_filter is false it means that the user wishes to restore
                // the orignal menu and we should check all the boxes again.
                this.view.reset_filter_checkboxes();
            }

            if (filters.length > 0) {
                // Create new filtered menu based on the full menu and the applied filters
                this.model.current_menu = apply_filters(
                    this.global.drinks,
                    this.model.current_full_menu,
                    filters
                );

                this.model.has_filters = true;
            } else {
                // If no filters were chosen we simply render the original menu
                this.model.current_menu = this.model.current_full_menu;
                this.model.has_filters = false;
            }

            // Re-render the products with the applied filters
            this.view.update_current_menu();
        },

        set_current_menu: function(new_menu, container) {
            this.model.has_filters = false;
            this.model.current_menu = new_menu;
            this.model.current_full_menu = new_menu;
            this.model.current_container = container;
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.view.reset_filter_checkboxes();
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        // Triggered whenever the menu has updated, e.g. when a product
        // goes out of stock and should be removed from the menu.
        menus_updated: function() {
            if (!this.model.current_menu) {
                // The selected menu on load is the default menu
                this.controller.set_current_menu(this.global.menu, this.element.container);
            }

            // When switching menus, the new menu is automatically updated
            this.view.update_current_menu();
        },

        // Triggered when the user switches to the "Drinks" subview
        // on the customer page. These signals must be handled so that
        // we can update the total items and the filtering target list.
        route_drinks: function() {
            this.controller.set_current_menu(this.global.menu, this.element.container);
            this.view.update_current_menu();
        },

        route_special_drinks: function() {
            this.controller.set_current_menu(this.global.special_menu, this.element.container_special);
            this.view.update_current_menu();
        },
    },
});
