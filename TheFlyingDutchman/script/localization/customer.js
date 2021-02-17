const content = {
    // Element ids for text elements
    keys: ['title', 'btn_food', 'btn_drinks', 'slogan', 'total-products', 'btn-filter'],

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

        default: {
            title: 'The Flying Dutchman - Customer',
            btn_food: 'Food',
            btn_drinks: 'Drinks',
            slogan: 'Pub and restaurant',
            'total-products' : '107 items',
            'btn-filter' : 'Filter',
        },

        alt: {
            flag: 'English',
        },


        img_src: {
            flag: 'bilder/eng.svg'
        }
    },
    sv : {

        default: {
            title: 'The Flying Dutchman - Kund',
            btn_food: 'Mat',
            btn_drinks: 'Dryck',
            slogan: 'Pub och restaurang',
            'total-products' : '107 varor',
            'btn-filter' : 'Filtrera',
        },

        alt: {
            flag: 'Svenska',
        },

        img_src: {
            flag: 'bilder/sv.svg'
        }
    }
};
