window.tfd.localization.controller.add('staff', {
    keys: [
        'btn_tables_text',
        'btn_inventory_text',
        'btn_orders_text',
        'pending_orders_title',
        'completed_orders_title',
        'edit_modal_title'
    ],
    alt_keys: [],
    placeholder_keys: [],
    src_keys: [],

    // We use one JSON substructure for each language. If we have
    // many different languages and a large set of strings we might
    // need to store a JSON file for each language to be loaded on
    // request.
    //
    en: {
        default: {
            btn_tables_text: 'Tables',
            btn_inventory_text: 'Inventory',
            btn_orders_text: 'Orders',
            completed_orders_title: 'Completed orders',
            pending_orders_title: 'Pending orders',
            edit_modal_title: 'Edit',
        }
    },
    sv : {
        default: {
            btn_tables_text: 'Bordsplacering',
            btn_inventory_text: 'Lager',
            btn_orders_text: 'Beställningar',
            completed_orders_title: 'Avslutade beställningar',
            pending_orders_title: 'Väntande beställningar',
            edit_modal_title: 'Redigera',
        }
    }
});
