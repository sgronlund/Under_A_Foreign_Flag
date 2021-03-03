window.tfd.add_module('orders', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        num_tables: 9,
        table_numbering_start: 1,
        selected_table: null,
    },

    // =====================================================================================================
    // DOCUMENT ELEMENTS
    //
    element: {
        pending_orders_container: '#pending_orders',
        completed_orders_container: '#completed_orders',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_orders: function(container, orders) {
            let html = '';

            // Only one pending order is allowed per table,
            // which means that each each pending order will be for a unique table.
            for (const key of Object.keys(orders)) {
                html += this.view.create_order_details(orders, key);
            }

            container.html(html);

            // Update order localization strings, since the content is dynamic
            window.tfd.localization.view.update_localization_component('orders');
        },

        create_order_details: function(orders, order_id) {
            const order = orders[order_id];
            const items = this.view.create_order_contents(order.items);

            return (`
                <article id=${order_id} draggable="true" ondragstart="window.tfd.staff.controller.drag(event)" class="order card box separator-top margin-top padding-top">
                    <div class="box row v-center fill-width space-between">
                        <div class="box row v-center">
                            <h4 class="order-item-id">
                                Order #${order_id}
                            </h4>
                            <p class="order-item-table-id">
                                <span class="order_item_table_label"></span>
                                ${order.table_id}
                            </p>
                        </div>
                        <button class="extra-light small">
                            <span class="order_item_edit">Edit</span>
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2
                                         0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div class="box fill margin-top">
                        <ol class="order-item-contents padding-top separator-top">
                            ${items}
                        </ol>
                    </div>
                    <div class="box row fill space-between separator-top padding-top">
                        <p>
                            <span class="order_item_total_items"></span>
                            <span class="bold">${order.total_items}</span>
                        </p>
                        <p>
                            <span class="order_item_total_price"></span>
                            <span class="bold product-price">${order.total_price.toFixed(2)} SEK</span>
                        </p>
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
                <li>
                    <div class="box row margin-left">
                        <p class="bold fill">${namn}</p>
                        <p class="margin-right padding-right separator-right">
                            <span>${item.quantity}</span>
                            <span class="order_item_pcs_text"></span>
                        </p>
                        <p class="order-item-price bold">${item.total} SEK</p>
                    </div>
                </li>
            `);
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {},

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        render_orders: function() {
            // Render pending orders
            this.view.update_orders(
                this.element.pending_orders_container,
                this.global.orders
            );

            // Render completed orders
            this.view.update_orders(
                this.element.completed_orders_container,
                this.global.completed_orders
            );
        },
    }
});
