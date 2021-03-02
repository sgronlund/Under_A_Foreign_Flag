window.tfd.localization.controller.add('orders', {
    use_class_identifiers: true,
    keys: [
        'order_item_table_label',
        'order_item_total_items',
        'order_item_total_price',
        'order_item_edit',
        'order_item_order_contents',
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
            order_item_table_label: 'Table',
            order_item_total_items: 'Number of items:',
            order_item_total_price: 'Total:',
            order_item_edit: 'Edit',
            order_item_order_contents: 'Contents',
        }
    },
    sv : {
        default: {
            order_item_table_label: 'Bord',
            order_item_total_items: 'Antal artiklar',
            order_item_total_price: 'Summa:',
            order_item_edit: 'Ändra',
            order_item_order_contents: 'Orderns innehåll',
        }
    }
});
