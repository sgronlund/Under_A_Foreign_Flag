window.tfd.localization.controller.add('inventory', {
    use_class_identifiers: true,
    keys: [
        'inventory_item_stock_text',
        'inventory_item_stock_pcs_text',
        'inventory_item_menu_text',
        'inventory_item_special_menu_text',
        'inventory_item_remove_text',
        'inventory_item_price_text',
        'inventory_item_low_stock',
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
            inventory_item_price_text: 'Price:',
            inventory_item_stock_text: 'Stock:',
            inventory_item_stock_pcs_text: 'pcs',
            inventory_item_menu_text: 'Regular menu:',
            inventory_item_special_menu_text: 'VIP menu:',
            inventory_item_remove_text: 'Remove',
            inventory_item_low_stock: 'Low stock',

        }
    },
    sv : {
        default: {
            inventory_item_price_text: 'Pris:',
            inventory_item_stock_text: 'Lager:',
            inventory_item_stock_pcs_text: 'st',
            inventory_item_menu_text: 'Vanliga menyn:',
            inventory_item_special_menu_text: 'VIP menyn:',
            inventory_item_remove_text: 'Ta bort',
            inventory_item_low_stock: 'Få kvar i lager',
        }
    }
});
