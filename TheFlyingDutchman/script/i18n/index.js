add_localization_data('index', {
    keys: ['login','guest'],
    alt_keys: ['start'],
    placeholder_keys: [],
    src_keys: [],

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
        },
    },
    sv : {
        default: {
            guest : 'Gäst',
            login: 'Logga in',
        },
        alt: {
            start: 'Två korvar på en tallrik',
        },
    }
});
