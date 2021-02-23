add_localization_data('customer', {
    keys: [
        'title',
        'btn_food',
        'btn_drinks',
        'btn_checkout_text',
        'slogan',
        'total_products_label',
        'total_products_order_label',
        'table_id_label',
        'order_total_label',
        'btn_filter_text',
        'welcome_text',
        'btn_order_text',
        'btn_menu_text',
        'btn_vip_login_text',
        'btn_vip_logout_text',
        'vip_credit_text',
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
            title: 'The Flying Dutchman - Customer',
            btn_food: 'Food',
            btn_drinks: 'Drinks',
            btn_checkout_text: 'Checkout',
            slogan: 'Pub and restaurant',
            total_products_label: 'items',
            total_products_order_label: 'items',
            table_id_label: 'Table',
            order_total_label: 'Total:',
            btn_filter_text: 'Filter',
            welcome_text: 'You are logged in as',
            btn_order_text: 'My order',
            btn_menu_text: 'Menu',
            btn_vip_login_text: 'Login',
            btn_vip_logout_text: 'Logout',
            vip_credit_text: 'Available credits:'
        },
    },
    sv : {
        default: {
            title: 'The Flying Dutchman - Kund',
            btn_food: 'Mat',
            btn_drinks: 'Dryck',
            btn_checkout_text: 'Till kassan',
            slogan: 'Pub och restaurang',
            total_products_label: 'varor',
            total_products_order_label: 'varor',
            table_id_label: 'Bord',
            order_total_label: 'Totalt:',
            btn_filter_text: 'Filtrera',
            welcome_text: 'Du är inloggad som',
            btn_order_text: 'Min beställning',
            btn_menu_text: 'Meny',
            btn_vip_login_text: 'Logga in',
            btn_vip_logout_text: 'Logga ut',
            vip_credit_text: 'Nuvarande saldo:'
        },
    }
});
