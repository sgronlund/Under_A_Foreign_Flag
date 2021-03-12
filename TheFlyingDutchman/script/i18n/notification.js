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
        'notification_exceed_quantity',
        'notification_inventory_no_stock',
    ],
    alt_keys: [],
    placeholder_keys: [],
    src_keys: [],

    
    en: {
        default: {
            notification_order_full: 'Could not add product - order is full',
            notification_order_empty: 'Could not checkout - order is empty',
            notification_out_of_stock: 'Could not add product - out of stock',
            notification_insufficent_funds: 'Could not checkout - insufficient funds',
            notification_order_success: 'Thank you for your order!',
            notification_inventory_low_stock: 'One or more products are low in stock!',
            notification_inventory_no_stock: 'One or more products are out of stock!',
            notification_user_not_found: 'User does not exist!',
            notification_balance_update_success: 'Balance updated!',
            notification_exceed_quantity: 'Cannot increase above max quantity!',
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
            notification_inventory_no_stock: 'En eller flera produkter är slut i lager!',
            notification_user_not_found: 'Användare finns ej!',
            notification_balance_update_success: 'Saldo uppdaterat!',
            notification_exceed_quantity: 'Du kan ha max 10 produkter!',
            
        },
    }
});
