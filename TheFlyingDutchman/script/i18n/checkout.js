add_localization_data('checkout', {
    keys: [
        'checkout_modal_title',
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
            checkout_modal_title: 'Checkout',
        },
    },
    sv : {
        default: {
            checkout_modal_title: 'Kassa',
        },
    }
});
