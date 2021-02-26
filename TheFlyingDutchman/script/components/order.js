window.tfd.add_module('order', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        items: {},
        total_items: 0,
        total_price: 0,
        ids: {
            container: '#order',
            total_items: '#btn_order_count',
            total_amount: '#order_total_amount',
            total_items_header: '#order_total_products_count',
            insufficient_funds: '#insufficient',
        },
        body_classes: {
            order_empty: 'order-empty',
        },
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_body: function() {
            // Show/hide order empty text
            if (this.model.total_items === 0) {
                $(document.body).addClass(this.model.body_classes.order_empty);
            } else {
                $(document.body).removeClass(this.model.body_classes.order_empty);
            }
        },

        update_checkout_error: function(show) {
            // Displays text for insufficient funds
            if (show) {
                $(this.model.ids.insufficient_funds).addClass('show')
            } else {
                $(this.model.ids.insufficient_funds).removeClass('show');
            }
        },

        update_order: function() {
            const container = $(this.model.ids.container);
            let html = "";

            if (this.model.total_items === 0) {
                container.html('');
                return;
            }

            for (const item of Object.values(this.model.items)) {
                html += this.view.create_order_item(item);
            }

            container.html(html);
            window.tfd.localization.view.update_localization_component('product');
        },

        update_order_details: function() {
            const total_items = $(this.model.ids.total_items);
            const total_amount = $(this.model.ids.total_amount);
            const total_items_header = $(this.model.ids.total_items_header);

            if (this.model.total_items === 0) {
                total_amount.text('0 SEK');
                total_items.text('0');
                total_items_header.text('0');
                return;
            }

            total_amount.text(this.model.total_price + " SEK");
            total_items.text(this.model.total_items);
            total_items_header.text(this.model.total_items);
        },

        update_item_quantity: function(id) {
            const { quantity } = this.model.items[id];
            $("[data-order-quantity-id='" + id + "']").val(quantity);
        },

        create_order_item: function(item) {
            const { nr, namn, prisinklmoms } = item.product;
            const description = window.tfd.product.view.create_product_description(item.product);

            return (`
                <article class="product card">
                    <div class="box row space-between v-center margin-bottom">
                        <h4 class="product-title">${namn}</h4>
                        <p class="order-product-price-each">
                            <span>${prisinklmoms} SEK /</span>
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
            const total = product.prisinklmoms * quantity;

            if (this.model.total_items + quantity > 10) {
                console.log('Could not add item to order - order is full');
                return;
            }

            this.model.total_price += total;
            this.model.total_items += quantity;

            if (this.model.items.hasOwnProperty(id)) {
                // If the item already exists in the order, simply update the quantity
                this.model.items[id].total += total;
                this.model.items[id].quantity += quantity;

                console.log(`Updated quantity of ${id} in order to: ${quantity}`);

                // Update the order item quantity only
                this.view.update_item_quantity(id);
            } else {
                // Add new item to order
                this.model.items[id] = {
                    product,
                    quantity,
                    total,
                };

                console.log(`Added new product ${id} to order with quantity: ${quantity}`);

                // Only reapply body classes and order items if we add new items
                this.view.update_body();
                this.view.update_order();
            }

            // Update the total items and amount
            this.view.update_order_details();
        },

        remove: function(id) {
            if (!this.model.items.hasOwnProperty(id)) {
                console.error(`Could not remove product not in order: ${id}`);
                return;
            }

            const { quantity, total } = this.model.items[id];

            // Update order totals
            this.model.total_items -= quantity;
            this.model.total_price -= total;

            // Remove key from order items
            delete this.model.items[id];

            console.log(`Removed product ${id} from order`);

            this.view.update_body();
            this.view.update_order();
            this.view.update_order_details();
        },

        change_quantity: function(id, change) {
            if (!this.model.items.hasOwnProperty(id)) {
                console.error(`Could not change quantity of product not in order: ${id}`);
                return;
            }

            const item = this.model.items[id];

            // Only allow a total of 10 items (and at least 1) in the order
            if (this.model.total_items + change > 10 || item.quantity + change < 1) {
                console.log('Could not change quantity - new total out of bounds (0 <= n <= 10)');
                return;
            }

            // If the new quantity is 0, remove the item
            if (this.model.total_items + change == 0) {
                this.controller.remove(id);
                return;
            }

            const price_change = item.product.prisinklmoms * change;

            // Increase the total item price in order
            item.total += price_change
            item.quantity += change;

            // Update the total order items and price
            this.model.total_items += change;
            this.model.total_price += price_change;

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

        // TODO: discuss design, whether this should be one or two functions
        checkout_bar_or_table: function() {
            if (this.model.total_price > 0) {
                // Hide any previous display of errors
                this.view.update_checkout_error(false);
                window.tfd.modal.controller.hide_error();

                // Iterate and remove all items from order, "simulating" paying for the items to a staff member.
                var items = this.model.items;
                for (const key of Object.keys(items)) {
                    this.controller.remove(key);
                    //TODO : Update stock after removing, check each individuals items quantity and decrement from stock
                    // What should happen if we don't have a item in stock? Should that be handled when adding to our order?
                }
                window.tfd.modal.controller.hide(); //Closes popout window for checkout.
            }
        },

        checkout_balance: function() {
            const total_amount = this.model.total_price;
            if (this.global.logged_in && total_amount > 0) { //Checks if user is logged in and we have items to checkout

                // TODO: We could move the balance update code to the VIP module instead
                // Get users details
                const user = this.global.user_details.username;
                const details = this.global.user_details;

                // Compute the new balance by subtracting the value of the order
                var current_balance = parseFloat(details.creditSEK);
                const updated_balance = current_balance - total_amount;

                // Checks if user can make the purchase with its current balance.
                if (updated_balance > 0 ) {
                    //Hides previous display of errors
                    this.view.update_checkout_error(false);
                    window.tfd.modal.controller.hide_error();

                    changeBalance(user, updated_balance); //Updates the database temporarily
                    this.global.user_details = userDetails(user); //Fetches new data

                    window.tfd.vip.view.update_footer(); //Updates the view, showing the new balance
                    this.controller.checkout_bar_or_table(); //Removes the products from the order

                    window.tfd.modal.controller.hide(); // Close the checkout windoow
                } else {
                    console.log("Not sufficient funds");

                    // Style elements to tell user this action was not allowed.
                    window.tfd.modal.controller.show_error();
                    this.view.update_checkout_error(true);
                }

            }
        },
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        // Signal for adding a product to the current order
        add_to_order: function(id, quantity) {
            this.controller.add(id, quantity);
        },
    },
});
