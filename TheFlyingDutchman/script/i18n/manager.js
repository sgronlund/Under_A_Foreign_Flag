window.tfd.localization.controller.add('manager', {
    use_class_identifiers: true,
    keys: [
        'inventory_item_stock_text',
        'inventory_item_menu_text',
        'inventory_item_special_menu_text',
        'inventory_item_remove_text',
        'inventory_item_price_text',
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
            inventory_item_menu_text: 'On menu:',
            inventory_item_special_menu_text: 'On VIP menu:',
            inventory_item_remove_text: 'Remove',
    
        }
    },
    sv : {
        default: {
            inventory_item_price_text: 'Pris:',
            inventory_item_stock_text: 'I lager:',
            inventory_item_menu_text: 'På menyn:',
            inventory_item_special_menu_text: 'På VIP menyn:',
            inventory_item_remove_text: 'Ta bort',
        }
    }
});
