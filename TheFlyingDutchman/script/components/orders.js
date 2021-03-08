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
            let count = 0;

            // Only one pending order is allowed per table,
            // which means that each each pending order will be for a unique table.
            for (const key of Object.keys(orders)) {
                html += this.view.create_order_details(orders, key);
                count++;
            }

            if (count == 0) {
                container.html(this.view.create_empty_message());
            } else {
                container.html(html);
            }

            // Update order localization strings, since the content is dynamic
            window.tfd.localization.view.update_localization_component('orders');
        },

        create_order_details: function(orders, order_id) {
            const list_name = orders === this.global.orders ? 'orders' : 'completed_orders';

            const order = orders[order_id];
            const items = this.view.create_order_contents(order.items);

            return (`
                <article
                    id=${order_id}
                     class="order card box separator-top margin-top padding-top"
                     draggable="true"
                     ondragstart="window.tfd.orders.controller.drag(event)"
                >
                    <div class="box row v-center fill-width space-between">
                        <div class="box row v-center">
                            <h4 class="order-item-id">
                                Order #${order_id}
                            </h4>
                            <p class="card-title-tag order-item-table-id">
                                <span class="order_item_table_label"></span>
                                ${order.table_id}
                            </p>
                        </div>
                        <div class="box row v-center">
                            <button
                                class="extra-light small margin-right"
                                onclick="window.tfd.edit_orders.controller.edit(${order_id}, '${list_name}')"
                            >
                                <span class="order_item_edit">Edit</span>
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2
                                             0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </button>
                            ${this.view.create_move_button(order_id, list_name)}
                        </div>
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
                            <span class="order_item_pcs_text"></span>
                        </p>
                        <p>
                            <span class="order_item_total_price"></span>
                            <span class="bold product-price">${order.total_price.toFixed(2)} SEK</span>
                        </p>
                    </div>
                </article>
            `);
        },

        create_move_button: function(order_id, list_name) {
            if (list_name === 'orders') {
                return (`
                    <button
                        class="success small btn-order-move"
                        onclick="window.tfd.orders.controller.move(${order_id}, '${list_name}')"
                    >
                        <span class="order_item_move_completed">Set completed</span>
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                `);
            }

            return (`
                <button
                    class="gray small icon-left btn-order-move"
                    onclick="window.tfd.orders.controller.move(${order_id}, '${list_name}')"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span class="order_item_move_pending">Set pending</span>
                </button>
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
                    <div class="box row v-center margin-left">
                        <p class="bold fill">${namn}</p>
                        <p class="margin-right padding-right separator-right">
                            <span>${item.quantity}</span>
                            <span class="order_item_pcs_text"></span>
                        </p>
                        <p class="order-item-price bold">${item.total.toFixed(2)} SEK</p>
                    </div>
                </li>
            `);
        },

        create_empty_message: function() {
            return (`
                <p class="order_empty_list_message margin-top-sm"></p>
            `);
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        render_all_orders: function() {
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

        move: function(order_id, list_name) {
            // Move the order to the correct list
            if (list_name === 'orders') {
                window.tfd.backend.controller.complete_order(order_id);
            } else {
                window.tfd.backend.controller.uncomplete_order(order_id);
            }

            // Re-render all orders
            this.controller.render_all_orders();
        },

        // Drag and drop
        allowDrop: function(ev) {
            ev.preventDefault();
        },

        drag: function(ev) {
            ev.dataTransfer.setData("text/plain", ev.target.id);
        },

        drop: function(ev) {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            ev.currentTarget.prepend(document.getElementById(data));

            if(ev.currentTarget.id == "pending_orders"){
                window.tfd.backend.controller.uncomplete_order(data);
            } else {
                window.tfd.backend.controller.complete_order(data);
            }
            
            this.controller.render_all_orders();
        },
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        render_orders: function() {
            this.controller.render_all_orders();
        },
    }
});
