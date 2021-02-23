add_localization_data('product', {
    // This makes sure that the localization script locates each key
    // using a class, rather than id.
    use_class_identifiers: true,
    keys: [
        'product_producer_label',
        'product_country_label',
        'product_category_label',
        'product_alcohol_label',
        'product_type_label',
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
            product_producer_label: 'Producer:',
            product_country_label: 'Country:',
            product_category_label: 'Category:',
            product_alcohol_label: 'Alcohol:',
            product_type_label: 'Type:',
            product_add_to_order_label: 'Add to order',
        },
    },
    sv : {
        default: {
            product_producer_label: 'Producent:',
            product_country_label: 'Land:',
            product_category_label: 'Kategori:',
            product_alcohol_label: 'Alkohol:',
            product_type_label: 'Typ:',
            product_add_to_order_label: 'Lägg i varukorg',
        },
    }
});
