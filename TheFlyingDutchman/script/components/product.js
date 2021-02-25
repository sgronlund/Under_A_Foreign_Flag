window.tfd.add_module('product', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        ids: {
            container: '#menu',
            container_special: '#special_drinks',
            total_products: '#total_products_count',
        },
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_products: function(container_id, products) {
            const container = $(container_id);
            const total_products = $(this.model.ids.total_products);

            let html = "";
            let total = 0;

            // TODO: This completely fucks the performance
            for (const product of Object.values(products)) {
                // FIXME: Temporary performance fix
                if (total == 50) {
                    break;
                }

                html += this.view.create_product(product);
                total++;
            }

            container.html(html);
            total_products.text(total);

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

        create_product: function(product) {
            const { namn, prisinklmoms } = product;
            const description = this.view.create_product_description(product);
            const actions = this.view.create_product_actions(product);

            return (`
                <article class="product card box">
                    <div class="box row space-between v-center margin-bottom">
                        <h4 class="product-title">${namn}</h4>
                        <p class="product-price">${prisinklmoms} SEK</p>
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

        create_product_actions: function(product) {
            const { nr, vip } = product;

            if (vip) {
                return (`
                    <button class="extra-light small fill-width" onclick="window.tfd.modal.controller.show_special_drink(${nr})">
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
                    <input data-quantity-id="${nr}" class="product-quantity no-spinner" min="1" max="10" value="1" type="number"/>
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
            const quantity = this.controller.get_quantity(id);
            this.trigger('add_to_order', id, quantity);
            this.view.reset_product_quantity(id);
        },

        change_quantity: function(id, change) {
            const new_quantity = this.controller.get_quantity(id) + change;

            if (new_quantity < 1 || new_quantity > 10) {
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
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        // Render the default drinks list
        render_products: function() {
            this.view.update_products(
                this.model.ids.container,
                this.global.drinks,
            );
        },

        // Render the VIP drinks list
        render_special_products: function() {
            this.view.update_products(
                this.model.ids.container_special,
                this.global.special_drinks,
            );
        },
    },
});
