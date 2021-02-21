add_localization_data('flag', {
    keys: [],
    alt_keys: ['flag'],
    placeholder_keys: [],
    src_keys: ['flag'],

    // We use one JSON substructure for each language. If we have
    // many different languages and a large set of strings we might
    // need to store a JSON file for each language to be loaded on
    // request.
    //
    en: {
        alt: {
            flag: 'The english flag',
        },
        img_src: {
            flag: 'img/eng.svg'
        },
    },
    sv : {
        alt: {
            flag: 'Den svenska flaggan',
        },
        img_src: {
            flag: 'img/sv.svg'
        },
    }
});
