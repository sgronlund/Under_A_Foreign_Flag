window.tfd.localization.controller.add('index', {
    keys: ['login','guest'],
    alt_keys: ['beer', 'boat'],
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
            beer: 'Two glasses of beer',
            boat: 'A boat in the sunset',
        },
    },
    sv : {
        default: {
            guest : 'Gäst',
            login: 'Logga in',
        },
        alt: {
            beer: 'Två glas med öl',
            boat: 'En båt i solnedgången',
        },
    }
});
