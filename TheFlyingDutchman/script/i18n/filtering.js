window.tfd.localization.controller.add('filtering', {
    keys: [
        'filtering_modal_title',
        'btn_filter_apply_text',
        'btn_filter_restore_text',
        'filter_non_alcoholic',
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
            filtering_modal_title: 'Filtering',
            btn_filter_apply_text: 'Apply filter',
            btn_filter_restore_text: 'Remove filter',
            filter_non_alcoholic: 'Non-alcoholic drinks',
        },
    },
    sv : {
        default: {
            filtering_modal_title: 'Filtrering',
            btn_filter_apply_text: 'Filtrera',
            btn_filter_restore_text: 'Ta bort filter',
            filter_non_alcoholic: 'Alkoholfria drycker',
        },
    }
});
