window.tfd.localization.controller.add('product', {
    // This makes sure that the localization script locates each key
    // using a class, rather than id.
    use_class_identifiers: true,
    keys: [
        'product_producent_label',
        'product_ursprunglandnamn_label',
        'product_sort_label',
        'product_alkoholhalt_label',
        'product_forpackning_label',
        'product_druva_label',
        'product_argang_label',
        'product_typ_label',
        'product_add_to_order_label',
        'product_added_to_order_label',
        'product_select_special_drink_label',
        'order_remove_product_label',
        'order_product_price_each_label',
    ],
    alt_keys: [],
    placeholder_keys: [],
    src_keys: [],

    en: {
        default: {
            product_producent_label: 'Producer:',
            product_ursprunglandnamn_label: 'Country:',
            product_sort_label: 'Category:',
            product_alkoholhalt_label: 'Alcohol:',
            product_forpackning_label: 'Packaging:',
            product_druva_label: 'Grape:',
            product_argang_label: 'Year:',
            product_typ_label: 'Type:',
            product_add_to_order_label: 'Add to order',
            product_added_to_order_label: 'Added',
            product_select_special_drink_label: 'Select drink',
            order_remove_product_label: 'Remove',
            order_product_price_each_label: 'each',
        },
    },
    sv : {
        default: {
            product_producent_label: 'Producent:',
            product_ursprunglandnamn_label: 'Land:',
            product_sort_label: 'Kategori:',
            product_alkoholhalt_label: 'Alkohol:',
            product_forpackning_label: 'Förpackning:',
            product_druva_label: 'Druva:',
            product_argang_label: 'Årgång:',
            product_typ_label: 'Typ:',
            product_add_to_order_label: 'Lägg i varukorg',
            product_added_to_order_label: 'Lades till',
            product_select_special_drink_label: 'Välj dricka',
            order_remove_product_label: 'Ta bort',
            order_product_price_each_label: 'st',
        },
    }
});
