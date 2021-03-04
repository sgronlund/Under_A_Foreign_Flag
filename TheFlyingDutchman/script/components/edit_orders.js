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
        modal_content: '#edit_order_contents',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_edit_modal: function(order_id) {
            let html = '';
            let contents = this.model.order.items;
            
            for (const item of Object.values(contents)) {
                html += this.view.create_order_item(item);
            }
               
            this.element.modal_content.html(html);
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
            return (`
                <div class="box row">
                    <p>${item.product_nr}</p> 
                    <p>${item.quantity}</p> 
                    <p>${item.total.toFixed(2)}</p> 
                </div>
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
        
        add_product: function(order_id) {
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
                // TODO: Shit no worky
                if (stock < quantity) {
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
