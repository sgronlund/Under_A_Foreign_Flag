window.tfd.localization.controller.add('notification', {
    use_class_identifiers: true,
    keys: [
        'notification_order_full',
        'notification_order_empty',
        'notification_out_of_stock',
        'notification_insufficent_funds',
        'notification_order_success',
        'notification_inventory_low_stock',
        'notification_user_not_found',
        'notification_balance_update_success',
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
            notification_order_full: 'Could not add product - order is full',
            notification_order_empty: 'Could not checkout - order is empty',
            notification_out_of_stock: 'Could not add product - out of stock',
            notification_insufficent_funds: 'Could not checkout - insufficient funds',
            notification_order_success: 'Thank you for your order!',
            notification_inventory_low_stock: 'One or more products are low in stock!',
            notification_user_not_found: 'User does not exist!',
            notification_balance_update_success: 'Balance updated!',
        },
    },
    sv : {
        default: {
            notification_order_full: 'Kunde inte lägga till produkt - din order är full',
            notification_order_empty: 'Kunde inte lägga order - din order är tom',
            notification_out_of_stock: 'Kunde inte lägga till produkt - slut i lager',
            notification_insufficent_funds: 'Kunde inte lägga order - din balans är för låg',
            notification_order_success: 'Tack för din order!',
            notification_inventory_low_stock: 'En eller fler produkter börjar ta slut i lager!',
            notification_user_not_found: 'Användare finns ej!',
            notification_balance_update_success: 'Saldo uppdaterat!',
        },
    }
});
