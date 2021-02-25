window.tfd.add_module('product', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        ids: {
            container: '#menu',
            total_products: '#total_products_count'
        },
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_products: function() {
            const container = $(this.model.ids.container);
            const total_products = $(this.model.ids.total_products);

            let html = "";
            let total = 0;

            // TODO: This completely fucks the performance
            for (const product of Object.values(this.global.products)) {
                html += this.view.create_product(product);
                total++;
                if (total === 50) break;
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
            const { nr, namn, prisinklmoms } = product;
            const description = this.view.create_product_description(product);

            return (`
                <article class="product card box">
                    <div class="box row space-between v-center margin-bottom">
                        <h4 class="product-title">${namn}</h4>
                        <p class="product-price">${prisinklmoms} SEK</p>
                    </div>
                    <div class="box v-start fill padding-bottom">
                        <div class="box">${description}</div>
                    </div>
                    <div class="product-actions box row space-between padding-top">
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
                        <button class="extra-light small product-add-to-order" onclick="window.tfd.product.controller.add_to_order(${nr})">
                            <span class="product_add_to_order_label">Add to order</span>
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                </article>
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

            if (new_quantity < 0 || new_quantity > 10) {
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
        render_products: function() {
            this.view.update_products();
        },
    },
});
