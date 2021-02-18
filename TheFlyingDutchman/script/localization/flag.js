add_localization_data('flag', {
    // Element ids for text elements
    keys: [],

    // Element ids for images and their alt-text
    img_keys: ['flag'],

    // Element ids for input elements (e.g placeholders)
    placeholder_keys: [],

    img_src: ['flag'],

    // We use one JSON substructure for each language. If we have
    // many different languages and a large set of strings we might
    // need to store a JSON file for each language to be loaded on
    // request.
    //
    en: {
        default: {},
        alt: {
            flag: 'The english flag',
        },
        placeholder: {},
        img_src: {
            flag: 'bilder/eng.svg'
        },
    },
    sv : {
        default: {},
        alt: {
            start: 'Två korvar på en tallrik',
        },
        placeholder: {},
        img_src: {
            flag: 'bilder/sv.svg'
        },
    }
});