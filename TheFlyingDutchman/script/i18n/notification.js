window.tfd.localization.controller.add('notification', {
    use_class_identifiers: true,
    keys: [
        'notification_order_full',
        'notification_order_empty',
        'notification_out_of_stock',
        'notification_insufficent_funds',
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
        },
    },
    sv : {
        default: {
            notification_order_full: 'Kunde inte lägga till produkt - din order är full',
            notification_order_empty: 'Kunde inte lägga order - din order är tom',
            notification_out_of_stock: 'Kunde inte lägga till produkt - slut i lager',
            notification_insufficent_funds: 'Kunde inte lägga order - din balans är för låg',
        },
    }
});
