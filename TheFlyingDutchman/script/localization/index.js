add_localization_data('index', {
    // Element ids for text elements
    keys: ['login','guest'],

    // Element ids for images and their alt-text
    img_keys: ['start' , 'flag'],

    // Element ids for input elements (e.g placeholders)
    placeholder_keys: [],

    img_src: ['flag'],

    // We use one JSON substructure for each language. If we have
    // many different languages and a large set of strings we might
    // need to store a JSON file for each language to be loaded on
    // request.
    //
    en: {
        default: {
            guest: 'Guest',
            login: 'Login',
        },
        alt: {
            start: 'Two sausages on a plate',
            flag: 'The english flag',
        },
        placeholder: {},
        img_src: {
            flag: 'bilder/eng.svg'
        },
    },
    sv : {
        default: {
            guest : 'Gäst',
            login: 'Logga in',
        },
        alt: {
            start: 'Två korvar på en tallrik',
            flag: 'Den svenska flaggan',
        },
        placeholder: {},
        img_src: {
            flag: 'bilder/sv.svg'
        },
    }
});