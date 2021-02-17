const content = {
    // Element ids for text elements
    keys: [],

    // Element ids for images and their alt-text
    img_keys: [],

    // Element ids for input elements (e.g placeholders)
    placeholder_keys: [],

    img_src: ['flag'],

    // We use one JSON substructure for each language. If we have
    // many different languages and a large set of strings we might
    // need to store a JSON file for each language to be loaded on
    // request.
    //
    en: {
        img_src: {
            flag: 'bilder/eng.svg'
        }
    },
    sv : {
        img_src: {
            flag: 'bilder/sv.svg'
        }
    }
};
