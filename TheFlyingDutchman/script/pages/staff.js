window.tfd.add_module('staff', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        ids: {
            container: '#tables_view',
        },
        tables: DB_tables.tables,
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        create_table: function (table_number) {
            return (`
                <div id="table_${table_number}" class="table_item padding" onclick="window.tfd.staff.view.view_order(${table_number});">
                    <p>
                        ${table_number}
                    </p>
                </div>
            `);
        },

        update_tables: function () {
            const container = $(this.model.ids.container);

            let html = '';
            const num_tables = $(this.model.tables.num_tables);
            const start_number = $(this.model.tables.table_numbering_start);

            for (let i = 0; i < num_tables[0]; i++) {
                html += this.view.create_table(start_number[0] + i);
            }

            container.append(html);
        },

        view_order: function (table_number) {
            let order_view = $(".table_order_view");


            if (order_view.css("display") === "none") {
                let order = $(".table_order");
                let html = this.view.get_order(table_number);

                order.html(html);
                order_view.css("display", "initial");
            } else {
                order_view.css("display", "none");
            }
        },
        // ligger antagligen på fel ställe
        get_order: function (table_number) {
            // TODO: make this work as it should
            return (`
                <div>
                    <p>
                        test item ${table_number}
                    </p>
                </div>
            `);
        }
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {},

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.trigger('render_products'); // TODO: fix so this renders in a better way?
        this.trigger('render_tables');
    },

    // =====================================================================================================
    // MODULE LOAD
    //
    init: function() {
        this.global.products = allBeverages();
    },

    // =====================================================================================================
    // CUSTOM SIGNAL HANDLERS
    //
    signal: {
        render_tables: function() {
            this.view.update_tables();
        },
    },
});
