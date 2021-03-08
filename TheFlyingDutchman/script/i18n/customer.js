window.tfd.localization.controller.add('customer', {
    keys: [
        'title',
        'btn_drinks',
        'btn_special_drinks',
        'btn_checkout_text',
        'slogan',
        'total_products_label',
        'table_id_label',
        'btn_filter_text',
        'welcome_text',
        'btn_order_text',
        'btn_menu_text',
        'btn_vip_login_text',
        'btn_vip_logout_text',
        'vip_credit_text',
        'order_empty_label',
        'order_total_label',
        'order_total_products_label',
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
            btn_drinks: 'Drinks',
            btn_special_drinks: 'Special drinks',
            btn_checkout_text: 'Checkout',
            slogan: 'Pub and restaurant',
            total_products_label: 'items',
            table_id_label: 'Table',
            btn_filter_text: 'Filter',
            welcome_text: 'Welcome,',
            btn_order_text: 'My order',
            btn_menu_text: 'Menu',
            btn_vip_login_text: 'Login',
            btn_vip_logout_text: 'Logout',
            vip_credit_text: 'Available credits:',
            order_total_label: 'Total:',
            order_total_products_label: 'items',
            order_empty_label: 'Your order is empty!',
        },
    },
    sv : {
        default: {
            title: 'The Flying Dutchman - Kund',
            btn_drinks: 'Dryck',
            btn_special_drinks: 'Speciella drycker',
            btn_checkout_text: 'Till kassan',
            slogan: 'Pub och restaurang',
            total_products_label: 'varor',
            table_id_label: 'Bord',
            btn_filter_text: 'Filtrera',
            welcome_text: 'Välkommen,',
            btn_order_text: 'Min beställning',
            btn_menu_text: 'Meny',
            btn_vip_login_text: 'Logga in',
            btn_vip_logout_text: 'Logga ut',
            vip_credit_text: 'Nuvarande saldo:',
            order_total_label: 'Totalt:',
            order_total_products_label: 'varor',
            order_empty_label: 'Din beställning är tom!',
        },
    }
});
