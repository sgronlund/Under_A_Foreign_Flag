window.tfd.localization.controller.add('special_drink', {
    keys: [
        'special_drink_modal_title',
        'special_drink_product_label',
        'special_drink_info',
        'btn_special_drink_label',
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
            special_drink_modal_title: 'Special drink',
            special_drink_product_label: 'Selected drink',
            special_drink_info: `
                The product price will be deducted from your current balance.
                After confirmation, you will receieve a unique code that can be used to fetch
                your drink.
            `,
            btn_special_drink_label: 'Confirm selection',
        },
    },
    sv : {
        default: {
            special_drink_modal_title: 'Speciell dricka',
            special_drink_product_label: 'Vald dricka',
            special_drink_info: `
                Den valda produktens pris kommer att dras av från din kredit.
                När du har bekräftat ditt val kommer du du få en unik kod som kan användas
                för att hämta din dricka.
            `,
            btn_special_drink_label: 'Bekräfta val',
        },
    }
});
