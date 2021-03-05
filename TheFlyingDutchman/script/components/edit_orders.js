window.tfd.add_module('edit_orders', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        changes_undo: [],
        changes_redo: [],
        order: null,
        order_id: null,
        orders: null,
    },

    // =====================================================================================================
    // DOM ELEMENTS
    //
    element: {
        dropdown: '#add_products',
        order_content: '#edit_order_contents',
        order_modal_id: '#edit_modal_order_id',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_edit_modal: function() {
            let html = '';
            const contents = this.model.order.items;

            for (const item of Object.values(contents)) {
                html += this.view.create_order_item(item);
            }

            this.element.order_modal_id.text(`- Order #${this.model.order_id}`);

            this.element.order_content.html(html);

            // We must make sure the localization when editing the order,
            // since content is dynamically added and removed.
            window.tfd.localization.view.update_localization_component('orders');
        },

        update_dropdown: function() {
            let html = '';
            const items = this.global.inventory;

            for(const key of Object.keys(items)) {
                const product = this.global.drinks[key];
                html += this.view.create_dropdown_option(product);
            }

            this.element.dropdown.html(html);
        },

        create_dropdown_option: function(product) {
            return (`
                <option value="${product.nr}">${product.namn}</option>
            `);
        },

        create_order_item: function(item) {
            const { namn } = this.global.drinks[item.product_nr];

            return (`
                <li>
                    <div class="box row v-center fill-width margin-bottom-sm">
                        <p class="fill">${namn}</p>
                        <p>
                            <span class="bold">${item.quantity}</span>
                            <span class="order_item_pcs_text"></span>
                        </p>

                        <button class="gray square extra-small no-icon-spacing margin-left" onclick="window.tfd.edit_orders.controller.remove(${item.product_nr})">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
                                         4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                </li>
            `);
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        edit: function(order_id, list_name) {
            // Save the order that we are currently editing
            if (list_name === 'orders') {
                this.model.orders = this.global.orders;
                this.model.order = this.global.orders[order_id];
            } else {
                this.model.orders = this.global.completed_orders;
                this.model.order = this.global.completed_orders[order_id];
            }

            this.model.order_id = order_id;

            // Reset the changes of any previous edits
            this.model.changes_redo = [];
            this.model.changes_undo = [];

            // Render modal contents
            this.view.update_edit_modal();

            // Show edit modal
            window.tfd.modal.controller.show_edit();
        },

        add: function() {
            const product_id = this.element.dropdown.val();
            const price = window.tfd.inventory.controller.get_price_of_product(product_id);

            // Maximum of 10 items in the order
            if (this.model.order.total_items == 10) {
                console.log('Could not add product to order - order is full');
                return;
            }

            if (this.model.order.items.hasOwnProperty(product_id)) {
                // Update the quantity and total price of the order item
                const { quantity, total } = this.model.order.items[product_id];
                const product_price = parseFloat(total);
                const stock = window.tfd.inventory.controller.get_stock_of_product(product_id);

                // Can not exceed existing stock
                // We have already updated the stock when creating the initial order.
                // Therefore, we must only compare the updated order item quantity
                if (stock < 0) {
                    console.log("couldnt add, now in stock");
                    return;
                }

                this.model.order.items[product_id] = {
                    product_nr: product_id,
                    total: price + product_price,
                    quantity: 1 + quantity,
                };
            } else {
                // Add new product
                this.model.order.items[product_id] = {
                    product_nr: product_id,
                    total: price,
                    quantity: 1,
                };
            }
            window.tfd.inventory.controller.update_stock_for_product(
                product_id,
                (-1),
                0
            );
            this.model.order.total_items += 1;
            this.model.order.total_price += price;

            // Push changes to undo-redo stack
            this.model.changes_redo.push({
                product_id: product_id,
                quantity: 1,
                type: 'add',
            });

            this.model.changes_undo.push({
                product_id: product_id,
                quantity: 1,
                type: 'remove',
            });

            this.controller.save();
        },

        remove: function(product_id) {
            if (!this.model.order.items.hasOwnProperty(product_id)) {
                console.error(`Could not remove invalid product from order: ${product_id}`);
                return;
            }

            const { quantity, total } = this.model.order.items[product_id];
            window.tfd.inventory.controller.update_stock_for_product(
                product_id,
                quantity,
                0
            );
            this.model.order.total_items -= quantity;
            this.model.order.total_price -= total;

            delete this.model.order.items[product_id];

            // TODO: Add to undo/redo stack
            // TODO: Should the order be removed if it's empty?

            this.controller.save();
        },

        undo: function() {
            const change = this.model.changes_undo.pop();

            if (!change) {
                return;
            }

            if (change.type === 'add') {
                window.tfd.inventory.controller.update_stock_for_product(
                    change.product_id,
                    change.quantity,
                    0
                );
            } else {
                window.tfd.inventory.controller.update_stock_for_product(
                    change.product_id,
                    change.quantity * (-1),
                    0
                );
            }

            this.controller.save();
        },

        redo: function() {
            const change = this.model.changes_redo.pop()

            if (!change) {
                return;
            }

            if (change.type === 'add') {
                    window.tfd.inventory.controller.update_stock_for_product(
                        change.product_id,
                        change.quantity * (-1),
                        0
                    );
                } else {
                    window.tfd.inventory.controller.update_stock_for_product(
                        change.product_id,
                        change.quantity,
                        0
                    );
                }

            this.controller.save();
        },

        save: function() {
            // Update inventory with updated stock
            this.trigger('render_inventory');

            // Update the orders
            this.trigger('render_orders');

            // Save the edited order
            window.tfd.backend.controller.save();

            this.view.update_edit_modal();
        },
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        render_product_dropdown: function() {
            this.view.update_dropdown();
        },
    },
});
