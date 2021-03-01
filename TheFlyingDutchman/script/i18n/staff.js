window.tfd.localization.controller.add('staff', {
    keys: [
        'btn_tables_text',
        'btn_inventory_text',
        'btn_orders_text',
        'empty_table_text',
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
            empty_table_text: 'No orders for this table!'
        }
    },
    sv : {
        default: {
            btn_tables_text: 'Bordsplacering',
            btn_inventory_text: 'Lager',
            btn_orders_text: 'Beställningar',
            empty_table_text: 'Finns inga beställningar för detta bord!'
            
        }
    }
});
