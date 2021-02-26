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
                <div id="table_1" class="table_item padding">
                    <p>
                        ${table_number}
                    </p>
                    <div class="table_order"></div>
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

            container.html(html);
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {},

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.trigger('render_products');
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
