add_localization_data('customer', {
    // Element ids for text elements
    keys: [
        'title',
        'btn_food',
        'btn_drinks',
        'slogan',
        'total_products',
        'btn_filter_text',
        'welcome_text',
        'btn_order_text',
        'btn_menu_text',
        'btn_vip_login_text',
        'btn_vip_logout_text',
        'vip_credit_text',
    ],

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
            total_products: '107 items',
            btn_filter_text: 'Filter',
            welcome_text: 'You are logged in as',
            btn_order_text: 'My order',
            btn_menu_text: 'Menu',
            btn_vip_login_text: 'Login',
            btn_vip_logout_text: 'Logout',
            vip_credit_text: 'Available credits:'
        },
        alt: {
            flag: 'The english flag',
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
            total_products: '107 varor',
            btn_filter_text: 'Filtrera',
            welcome_text: 'Du är inloggad som',
            btn_order: 'Min beställning',
            btn_menu: 'Meny',
            btn_vip_login: 'Logga in',
            btn_vip_logout: 'Logga ut',
            vip_credit_text: 'Nuvarande saldo:'
        },
        alt: {
            flag: 'Den svenska flaggan',
        },
        img_src: {
            flag: 'bilder/sv.svg'
        }
    }
});
