// =====================================================================================================
//  Functions for rendering the content of the orders in the staff view
// =====================================================================================================
// Authors: Fredrik Engstrand, 2021
//          Dante Grenholm, 2021
//          Sebastian Grönlund, 2021
//          Hampus Sandqvist, 2021
//          Kevin Hormiz, 2021  
//
//
// These function allow the user to add and or remove products from a order in the system as well as
// undoing or redoing these actions.
//

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
        classes: {
            is_gift: 'is-gift',
        },
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

            // Loop through each product in the order
            for (const item of Object.values(contents)) {
                html += this.view.create_order_item(item);
            }

            this.element.order_modal_id.text(`- Order #${this.model.order_id}`);

            this.element.order_content.html(html);

            // We must make sure the localization when editing the order,
            // since content is dynamically added and removed.
            window.tfd.localization.controller.update_component('orders');
        },

        update_dropdown: function() {
            let html = '';
            const items = this.global.inventory;

            // Loop through each product key in inventory
            for(const key of Object.keys(items)) {
                // Get the product data for the product key
                const product = this.global.drinks[key];
                html += this.view.create_dropdown_option(product);
            }

            // Update the dropdown menu with all product names in inventory
            this.element.dropdown.html(html);
        },

        toggle_gift_button: function(btn) {
            // Toggles the state of the gift button based on whether or not
            // it is on the house
            $(btn).toggleClass(this.model.classes.is_gift);
        },

        create_dropdown_option: function(product) {
            // Creates a dropdown option containing the product name
            return (`
                <option value="${product.nr}">${product.namn}</option>
            `);
        },

        create_order_item: function(item) {
            const { namn } = this.global.drinks[item.product_nr];

            // Creates an item in an order in the edit modal
            return (`
                <li>
                    <div class="box row v-center fill-width margin-bottom-sm">
                        <p class="fill">${namn}</p>
                        <p>
                            <span class="bold">${item.quantity}</span>
                            <span class="order_item_pcs_text"></span>
                        </p>

                        <button
                            class="gray square extra-small no-icon-spacing margin-left ${item.gift ? 'is-gift' : ''}"
                            onclick="window.tfd.edit_orders.controller.gift(this, ${item.product_nr})"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2
                                         0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                />
                            </svg>
                        </button>

                        <button
                            class="error square extra-small no-icon-spacing margin-left"
                            onclick="window.tfd.edit_orders.controller.remove(${item.product_nr})"
                        >
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
            // Save the order that we are currently editing and
            // update the model so that we render the correct order(s)
            if (list_name === 'orders') {
                this.model.orders = this.global.orders;
                this.model.order = this.global.orders[order_id];
            } else {
                this.model.orders = this.global.completed_orders;
                this.model.order = this.global.completed_orders[order_id];
            }

            // Update the selected order
            this.model.order_id = order_id;

            // Reset the changes of any previous edits
            this.model.changes_redo = [];
            this.model.changes_undo = [];

            // Render modal contents
            this.view.update_edit_modal();

            // Show edit modal
            window.tfd.modal.controller.show_edit();
        },

        add: function(product_id, change, change_stack_name) {
            // If no product id is specified, use the dropdown value.
            // This is because we might want to redo/undo changes.
            if (!product_id) {
                product_id = this.element.dropdown.val();
            }
            
            // Make sure that the change is not 0 or undefined
            if (!change) {
                change = 1;
            }

            // Get the price of a product
            const price = window.tfd.inventory.controller.get_price_of_product(product_id);

            // Maximum of 10 items in the order
            if (this.model.order.total_items == 10) {
                console.log('Could not add product to order - order is full');
                return;
            }

            // Make sure that the order contains the selected product id
            if (this.model.order.items.hasOwnProperty(product_id)) {
                // Update the quantity and total price of the order item
                const { quantity, total } = this.model.order.items[product_id];
                const product_price = parseFloat(total);
                const stock = window.tfd.inventory.controller.get_stock_of_product(product_id);

                // Can not exceed existing stock
                // We have already updated the stock when creating the initial order.
                // Therefore, we must only compare the updated order item quantity
                if (stock == 0) {
                    console.log("couldnt add, now in stock");
                    return;
                }

                // Update the currently selected order
                this.model.order.items[product_id] = {
                    product_nr: product_id,
                    total: price + product_price,
                    quantity: change + quantity,
                };
            } else {
                // Add new product
                this.model.order.items[product_id] = {
                    product_nr: product_id,
                    total: price,
                    quantity: change,
                };
            }

            // Update the stock for the selected product
            window.tfd.inventory.controller.update_stock_for_product(
                product_id,
                (-1) * (change),
                0
            );

            this.model.order.total_items += change;
            this.model.order.total_price += price * change;

            // Changes should be pushed to different lists depending on the caller.
            // If we call this function from an undo, we should not push a change
            // to the undo stack, only the redo stack. The same goes for redo.
            // If no list is specified, we assume that it is not called by an undo, nor redo.
            if (change_stack_name === 'undo') {
                this.model.changes_redo.push({
                    product_id: product_id,
                    quantity: change,
                    type: 'add',
                });
            } else if (change_stack_name === 'redo') {
                this.model.changes_undo.push({
                    product_id: product_id,
                    quantity: (-1) * change,
                    type: 'remove',
                });
            } else {
                this.model.changes_redo.push({
                    product_id: product_id,
                    quantity: change,
                    type: 'add',
                });

                this.model.changes_undo.push({
                    product_id: product_id,
                    quantity: (-1) * change,
                    type: 'remove',
                });
            }

            this.controller.save();
        },

        gift: function(btn, product_id) {
            if (!this.model.order.items.hasOwnProperty(product_id)) {
                console.error(`Could not gift invalid product from order: ${product_id}`);
                return;
            }

            const order_item = this.model.order.items[product_id];

            // The gift button works as a toggle, so we check if the product that we clicked 
            // the gift button on is already a gift. If it is, we reapply the price of the product to
            // the order total. If not, we remove the product total from the order total.
            if (order_item.gift) {
                const price = window.tfd.inventory.controller.get_price_of_product(product_id);
                const total = order_item.quantity * price;

                // Update the total price of the order
                this.model.order.total_price += total;
                
                // Update the product in the order
                order_item.total = total;
                order_item.gift = false;
            } else {
                // Update order total
                this.model.order.total_price -= order_item.total;

                // Update product total
                order_item.total = 0;
                order_item['gift'] = true;
            }

            //Renders the updated order
            this.controller.save()

            // Change color of gift button to indicate that the product is a gift
            this.view.toggle_gift_button(btn);
        },

        remove: function(product_id, change, change_stack_name) {
            if (!this.model.order.items.hasOwnProperty(product_id)) {
                console.error(`Could not remove invalid product from order: ${product_id}`);
                return;
            }
    
            // Get the current product quantity in the order
            const { quantity } = this.model.order.items[product_id];

            // Make sure that the change is not 0 or undefined
            if (!change) {
                change = quantity;
            }

            // Increase product stock
            window.tfd.inventory.controller.update_stock_for_product(
                product_id,
                change,
                0
            );

            // Update the order total
            this.model.order.total_items -= change;
            this.model.order.total_price -= this.model.order.items[product_id].total;

            // Delete the product from the order
            delete this.model.order.items[product_id];

            // Changes should be pushed to different lists depending on the caller.
            // If we call this function from an undo, we should not push a change
            // to the undo stack, only the redo stack. The same goes for redo.
            // If no list is specified, we assume that it is not called by an undo, nor redo.
            if (change_stack_name === 'undo') {
                this.model.changes_redo.push({
                    product_id: product_id,
                    quantity: (-1) * quantity,
                    type: 'remove',
                });
            } else if (change_stack_name === 'redo') {
                this.model.changes_undo.push({
                    product_id: product_id,
                    quantity: quantity,
                    type: 'add',
                });
            } else {
                //Was not called from pop
                this.model.changes_redo.push({
                    product_id: product_id,
                    quantity: (-1) * quantity,
                    type: 'remove',
                });

                this.model.changes_undo.push({
                    product_id: product_id,
                    quantity: quantity,
                    type: 'add',
                });
            }

            // Save the order to localStorage
            this.controller.save();
        },

        // Removes a change object from either the undo or redo stack.
        // Every action that alters the order in the edit modal will produce a "change"
        // that is pushed to both the undo and redo stack and contains the data needed to
        // reverse the action. This function simply removes the latest undo/redo change from a 
        // stack and applies the changes to reverse/reapply the action.
        pop_change: function(changes, value) {
            // Pop the first change of the stack on the changes list
            const change = changes.pop();

            // Make sure that we had at least one change in the stack
            if (!change) {
                return;
            }

            // Check the type of change. Add means that applying the change should increase (add) 
            // to the order
            if (change.type === 'add') {
                this.controller.add(change.product_id, change.quantity, value);
            } else {
                // Item is already removed
                if (!this.model.order.items.hasOwnProperty(change.product_id)) {
                    return;
                }

                const item = this.model.order.items[change.product_id];
                const price = window.tfd.inventory.controller.get_price_of_product(change.product_id);
                
                // If the change will remove more quantity than there currently is in the order,
                // we can simply remove the product (you can not have negative quantities or 0)
                if (item.quantity <= Math.abs(change.quantity)) {
                    this.controller.remove(change.product_id, (-1) * change.quantity, value);
                } else {
                    // Update the product total 
                    item.quantity += change.quantity;
                    item.total += change.quantity * price;

                    this.model.order.total_items += change.quantity;
                    this.model.order.total_price += change.quantity * price;

                    // Update the stock for product
                    window.tfd.inventory.controller.update_stock_for_product(
                        change.product_id,
                        (-1) * change.quantity,
                        0
                    );
                }
            }
            
            // Update the order in localStorage with the new changes
            this.controller.save();
        },

        undo: function() {
            // Undo the previous action
            this.controller.pop_change(this.model.changes_undo, 'undo');
        },

        redo: function() {
            // Redo the previous action
            this.controller.pop_change(this.model.changes_redo, 'redo');
        },

        save: function() {
            // Update inventory with updated stock
            this.trigger('render_inventory');

            // Update the orders
            this.trigger('render_orders');

            // Save the edited order
            window.tfd.backend.controller.save();
            window.tfd.inventory.controller.save();

            // Render the edit modal with the update order
            this.view.update_edit_modal();
        },
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        // Triggered when the inventory updates to make sure
        // that the dropdown contains the latest product names. 
        // E.g. when a product is added to inventory or a product goes out of stock
        render_product_dropdown: function() {
            // Update the dropdown contents
            this.view.update_dropdown();
        },
    },
});
