window.tfd.add_module('staff', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        num_tables: 9,
        table_numbering_start: 1,
        selected_table: null,
        
        current_view: 'view-orders',
        previous_view: null,
        views: {
            menu: 'view-menu',
            orders: 'view-orders',
            tables: 'view-tables',
            inventory: 'view-inventory',
        },
    },

    // =====================================================================================================
    // DOCUMENT ELEMENTS
    //
    element: {
        container: '#tables_view',
        modal_content: '#order_modal_content',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_body: function() {
            if (this.model.previous_view) {
                $(document.body).removeClass(this.model.previous_view);
            }

            $(document.body).addClass(this.model.current_view);
        },
        
        update_tables: function() {
            let html = '';
            // TODO: Cache these DOM lookups?
            
            for (let i = 0; i < this.model.num_tables; i++) {
                html += this.view.create_table(this.model.table_numbering_start + i);
            }
            
            this.element.container.append(html);
        },

        update_order_modal: function() {
            let html = '';
            
            // Only one pending order is allowed per table, 
            // which means that each each pending order will be for a unique table. 
            for (const key of Object.keys(this.global.orders)) {
                const order = this.global.orders[key];
                
                if (this.model.selected_table == order.table_id) {
                    html += this.view.create_order_details(key);
                }
            }
            
            // Check if orders was found
            if (!html) {
                html = '<span id="empty_table_text"></span>'
            }

            this.element.modal_content.html(html);
            
            // Update staff localization strings, since some of the content is dynamic
            window.tfd.localization.view.update_localization_component('staff');
        },
        
        create_order_details: function(order_id) {
            // TODO: make this work as it should
            const order = this.global.orders[order_id];
            const items = this.view.create_order_contents(order.items);
            
            return (`
                <article class="box separator-top margin-top padding-top">
                    <p>${order.table_id}</p>
                    <p>total price: ${order.total_price}</p>
                    <p>total items: ${order.total_items}</p>
                    <p>Order:</p>
                    <div class="box fill">
                        ${items} 
                    </div>
                </article>
            `);
        },
        
        create_order_contents: function(items) {
            let html = '';
            
            for (const item of Object.values(items)) {
                html += this.view.create_order_contents_item(item);
            }
            
            return html;
        },
        
        create_order_contents_item: function(item) {
            const { namn } = this.global.drinks[item.product_nr];

            return (`
                <div class="box row fill">
                    <p class="bold fill">${namn}</p>
                    <p>${item.quantity}</p>
                    <p class="bold margin-left">${item.total}</p>
                </div>
            `);
        },
        
        create_table: function (table_number) {
            return (`
                <div id="table_${table_number}" class="box center" onclick="window.tfd.staff.controller.show_order_details(${table_number})">
                    <div class="table_item">
                        <p>
                            ${table_number}
                        </p>
                    </div>
                </div>
            `);
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        set_view: function(new_view) {
            this.model.previous_view = this.model.current_view;
            this.model.current_view = this.model.views[new_view];
            this.view.update_body();
        },

        show_menu: function() {
            this.controller.set_view('menu');
        },
        
        show_tables: function() {
            this.controller.set_view('tables');
        },

        show_orders: function() {
            this.controller.set_view('orders');
        },

        show_inventory: function() {
            this.controller.set_view('inventory');
        },

        show_order_details: function(table_number) {
            // Update model with the selected table number
            this.model.selected_table = table_number;

            // Update the modal content
            this.view.update_order_modal();

            // Show order modal
            window.tfd.modal.controller.show_order();
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.trigger('render_products'); // TODO: fix so this renders in a better way?
        this.view.update_tables();
    },
    
    signal: {
        logout: function() {
            window.location.href = 'index.html'
        },
    }
});
