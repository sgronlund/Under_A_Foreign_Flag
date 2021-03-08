// =====================================================================================================
// Functions for handling and rendering orders.
// =====================================================================================================
// Authors: Namn, 2020
//
//

window.tfd.add_module('order', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        max_order_items: 10,
        order: {
            items: {},
            total_items: 0,
            total_price: 0,
        },
        body_classes: {
            order_empty: 'order-empty',
        },
    },

    // =====================================================================================================
    // DOM ELEMENTS
    //
    element: {
        container: '#order',
        total_items: '#btn_order_count',
        total_amount: '#order_total_amount',
        total_items_header: '#order_total_products_count',
        insufficient_funds: '#insufficient',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_body: function() {
            // Show/hide order empty text
            if (this.model.order.total_items === 0) {
                $(document.body).addClass(this.model.body_classes.order_empty);
            } else {
                $(document.body).removeClass(this.model.body_classes.order_empty);
            }
        },

        update_order: function() {
            let html = "";

            if (this.model.order.total_items === 0) {
                this.element.container.html('');
                return;
            }

            for (const item of Object.values(this.model.order.items)) {
                html += this.view.create_order_item(item);
            }

            this.element.container.html(html);
            window.tfd.localization.view.update_localization_component('product');
        },

        update_order_details: function() {
            const total_items = this.element.total_items;
            const total_amount = this.element.total_amount;
            const total_items_header = this.element.total_items_header;

            if (this.model.order.total_items === 0) {
                total_amount.text('0 SEK');
                total_items.text('0');
                total_items_header.text('0');
                return;
            }

            total_amount.text(this.model.order.total_price + " SEK");
            total_items.text(this.model.order.total_items);
            total_items_header.text(this.model.order.total_items);
        },

        update_item_quantity: function(id) {
            const item = this.model.order.items[id];
            const { quantity } = this.global.drinks[item.product_nr];

            $("[data-order-quantity-id='" + id + "']").val(quantity);
        },

        create_order_item: function(item) {
            const product = this.global.drinks[item.product_nr];
            const { nr, namn } = product;
            const price = window.tfd.inventory.controller.get_price_of_product(product.nr);
            const description = window.tfd.product.view.create_product_description(product);

            return (`
                <article class="product card">
                    <div class="box row space-between v-center margin-bottom">
                        <h4 class="product-title">${namn}</h4>
                        <p class="order-product-price-each">
                            <span>${price} SEK /</span>
                            <span class="order_product_price_each_label"></span>
                        </p>
                    </div>
                    <div class="box v-start fill padding-bottom">
                        <div class="product-description-order">${description}</div>
                    </div>
                    <div class="product-actions box row space-between v-center padding-top">
                        <div class="box row v-center">
                            <button class="extra-light small margin-right" onclick="window.tfd.order.controller.remove(${nr})">
                                <span class="order_remove_product_label">Remove</span>
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                            </button>
                            <button class="gray small square no-icon-spacing" onclick="window.tfd.order.controller.decrease_quantity(${nr})">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                </svg>
                            </button>
                            <input data-order-quantity-id="${nr}" class="product-quantity no-spinner" min="1" max="10" value="${item.quantity}" type="number"/>
                            <button class="gray small square no-icon-spacing" onclick="window.tfd.order.controller.increase_quantity(${nr})">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                        </div>
                        <h3 class="order-product-price">${item.total} SEK</h3>
                    </div>
                </article>
            `);
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        add: function(id, quantity) {
            if (!id) {
                console.error(`Could not add product to order with id: ${id}`);
                return;
            }

            const product = this.global.drinks[id];
            const price = window.tfd.inventory.controller.get_price_of_product(product.nr);
            const total = price * quantity;
            const max_quantity = window.tfd.inventory.controller.get_stock_of_product(id);

            // Makes sure that the quantity of the order cannot exceed 10 total items
            if (this.model.order.total_items + quantity > this.model.max_order_items) {
                console.log('Could not add item to order - order is full');
                window.tfd.notification.controller.show_order_full_notification();
                return false;
            }

            if (this.model.order.items.hasOwnProperty(id)) {
                // Make sure that the total quantity in cart and new quantity is in stock
                if (this.model.order.items[id].quantity + quantity > max_quantity) {
                    console.log('Could not add product to order - exceeds available stock');
                    window.tfd.notification.controller.show_out_of_stock_notification();
                    return false;
                }

                // If the item already exists in the order, simply update the quantity
                this.model.order.items[id].total += total;
                this.model.order.items[id].quantity += quantity;

                console.log(`Updated quantity of ${id} in order to: ${quantity}`);

                this.model.order.total_price += total;
                this.model.order.total_items += quantity;

                // Update the order item quantity only
                this.view.update_item_quantity(id);
            } else {
                // Make sure that there is enough stock of the product
                if (quantity > max_quantity) {
                    console.log('Could not add product to order - exceeds available stock');
                    window.tfd.notification.controller.show_out_of_stock_notification();
                    return false;
                }

                // Add new item to order
                this.model.order.items[id] = {
                    product_nr: product.nr,
                    quantity,
                    total,
                };

                console.log(`Added new product ${id} to order with quantity: ${quantity}`);

                this.model.order.total_price += total;
                this.model.order.total_items += quantity;

                // Only reapply body classes and order items if we add new items
                this.view.update_body();
                this.view.update_order();
            }

            // Update the total items and amount
            this.view.update_order_details();

            return true;
        },

        remove: function(id) {
            if (!this.model.order.items.hasOwnProperty(id)) {
                console.error(`Could not remove product not in order: ${id}`);
                return;
            }

            const { quantity, total } = this.model.order.items[id];

            // Update order totals
            this.model.order.total_items -= quantity;
            this.model.order.total_price -= total;

            // Remove key from order items
            delete this.model.order.items[id];

            console.log(`Removed product ${id} from order`);

            this.view.update_body();
            this.view.update_order();
            this.view.update_order_details();
        },

        change_quantity: function(id, change) {
            if (!this.model.order.items.hasOwnProperty(id)) {
                console.error(`Could not change quantity of product not in order: ${id}`);
                return;
            }

            const item = this.model.order.items[id];
            const product = this.global.drinks[item.product_nr];

            // Only allow a total of 10 items (and at least 1) in the order
            if (this.model.order.total_items + change > this.model.max_order_items || item.quantity + change < 1) {
                console.log(`Could not change quantity - new total out of bounds (0 <= n <= ${this.model.max_order_items})`);
                window.tfd.notification.controller.show_order_full_notification();
                return;
            }

            // If the new quantity is 0, remove the item
            if (this.model.order.total_items + change == 0) {
                this.controller.remove(id);
                return;
            }

            const price = window.tfd.inventory.controller.get_price_of_product(product.nr);
            const price_change = price * change;

            // Increase the total item price in order
            item.total += price_change;
            item.quantity += change;

            // Update the total order items and price
            this.model.order.total_items += change;
            this.model.order.total_price += price_change;

            console.log(`Updated quantity of product ${id} in order to: ${item.quantity}`);

            this.view.update_body();
            this.view.update_order();
            this.view.update_order_details();
        },

        increase_quantity: function(id) {
            this.controller.change_quantity(id, 1);
        },

        decrease_quantity: function(id) {
            this.controller.change_quantity(id, -1);
        },

        checkout: function() {
            if (!this.model.order.total_price > 0) {
                console.error('Could not checkout - order is empty');
                window.tfd.notification.controller.show_order_empty_notification();
                return;
            }

            // Checkout the order and mark as pending for the staff
            const order_id = window.tfd.backend.controller.checkout_order(this.global.table_id, this.model.order);

            // Clear order
            this.model.order.items = {};
            this.model.order.total_price = 0;
            this.model.order.total_items = 0;

            // Update order
            this.view.update_body();
            this.view.update_order();
            this.view.update_order_details();

            // Hide the modal and remove any errors
            window.tfd.modal.controller.hide_error();
            window.tfd.modal.controller.hide();

            window.tfd.notification.controller.show_order_success_notification();

            return order_id;
        },

        checkout_balance: function() {
            const total_amount = this.model.order.total_price;

            // Must be logged in as VIP to pay with credit
            if (!this.global.logged_in) {
                console.error('Could not checkout with balance - not logged in');
                return;
            }

            // Can not checkout when the order is empty
            if (this.model.order.total_price <= 0) {
                console.error('Could not checkout with balance - order is empty');
                window.tfd.notification.controller.show_order_empty_notification();
                return;
            }

            // Checks if user can make the purchase with its current balance.
            if (window.tfd.vip.controller.update_balance(total_amount)) {
                // Get the generated order id
                const order_id = this.controller.checkout();

                // Complete the order directly, since the payment has already been made using credit
                window.tfd.backend.controller.complete_order(order_id);
            } else {
                console.log("Insufficient funds");
                window.tfd.notification.controller.show_insufficent_funds_notification();
            }
        },
    },
});
