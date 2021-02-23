add_localization_data('product', {
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
            product_producent_label: 'Producer:',
            product_ursprunglandnamn_label: 'Country:',
            product_sort_label: 'Category:',
            product_alkoholhalt_label: 'Alcohol:',
            product_forpackning_label: 'Packaging:',
            product_druva_label: 'Grape:',
            product_argang_label: 'Year:',
            product_typ_label: 'Type:',
            product_add_to_order_label: 'Add to order',
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
        },
    }
});
