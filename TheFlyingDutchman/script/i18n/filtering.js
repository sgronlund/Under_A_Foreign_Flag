add_localization_data('login', {
    keys: [
        'filtering_modal_title',
    ],
    img_keys: [],
    placeholder_keys: [],
    img_src: [],

    // We use one JSON substructure for each language. If we have
    // many different languages and a large set of strings we might
    // need to store a JSON file for each language to be loaded on
    // request.
    //
    en: {
        default: {
            filtering_modal_title: 'Filtering',
        },
    },
    sv : {
        default: {
            filtering_modal_title: 'Filtrering',
        },
    }
});
