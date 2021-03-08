window.tfd.localization.controller.add('orders', {
    use_class_identifiers: true,
    keys: [
        'order_item_table_label',
        'order_item_total_items',
        'order_item_total_price',
        'order_item_edit',
        'order_item_order_contents',
        'order_item_pcs_text',
        'order_item_move_pending',
        'order_item_move_completed',
        'order_empty_list_message',
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
            order_item_pcs_text: 'pcs',
            order_item_move_pending: 'Set pending',
            order_item_move_completed: 'Set completed',
            order_empty_list_message: 'No orders in this list!',
        },
    },
    sv : {
        default: {
            order_item_table_label: 'Bord',
            order_item_total_items: 'Antal artiklar',
            order_item_total_price: 'Summa:',
            order_item_edit: 'Ändra',
            order_item_order_contents: 'Orderns innehåll',
            order_item_pcs_text: 'st',
            order_item_move_pending: 'Sätt pågående',
            order_item_move_completed: 'Sätt klar',
            order_empty_list_message: 'Inga ordrar i denna lista!',
        },
    },
});
