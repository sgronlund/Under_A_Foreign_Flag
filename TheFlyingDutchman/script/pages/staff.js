window.tfd.add_module('staff', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        selected_table: null,
        tables: DB_tables.tables,
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
        update_tables: function() {
            let html = '';
            // TODO: Cache these DOM lookups?
            const num_tables = $(this.model.tables.num_tables);
            const start_number = $(this.model.tables.table_numbering_start);

            for (let i = 0; i < num_tables[0]; i++) {
                html += this.view.create_table(start_number[0] + i);
            }

            this.element.container.append(html);
        },

        update_order_modal: function() {
            const order_details = this.view.create_order_details();

            this.element.modal_content.html(order_details);
        },

        create_order_details: function() {
            // TODO: make this work as it should
            return (`
                <p>test item ${this.model.selected_table}</p>
            `);
        },

        create_table: function (table_number) {
            return (`
                <div id="table_${table_number}" class="box center" onclick="window.tfd.staff.controller.show_order(${table_number})">
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
        show_order: function(table_number) {
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
});
