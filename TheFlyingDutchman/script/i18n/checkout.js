window.tfd.localization.controller.add('checkout', {
    keys: [
        'checkout_modal_title',
        'checkout_pay_at_table_label',
        'checkout_pay_at_bar_label',
        'checkout_pay_with_credit_label',
        'insufficient'
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
            checkout_modal_title: 'Checkout',
            checkout_pay_at_table_label: 'Pay at table',
            checkout_pay_at_bar_label: 'Pay at bar',
            checkout_pay_with_credit_label: 'Pay with credit',
            insufficient: 'Insufficient funds!'
        },
    },
    sv : {
        default: {
            checkout_modal_title: 'Kassa',
            checkout_pay_at_table_label: 'Betala vid bordet',
            checkout_pay_at_bar_label: 'Betala vid baren',
            checkout_pay_with_credit_label: 'Betala med saldo',
            insufficient: 'För lågt saldo!'
        },
    }
});
