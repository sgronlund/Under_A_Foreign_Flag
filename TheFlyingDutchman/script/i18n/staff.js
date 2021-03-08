window.tfd.localization.controller.add('staff', {
    keys: [
        'btn_pending_orders',
        'btn_completed_orders',
        'btn_tables_text',
        'btn_inventory_text',
        'btn_orders_text',
        'pending_orders_title',
        'completed_orders_title',
        'edit_modal_title',
        'edit_order_contents_label',
        'add_products_label',
        'btn_edit_order_undo',
        'btn_edit_order_redo',
        'btn_inventory_add_product'
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
            btn_pending_orders: 'Pending orders',
            btn_completed_orders: 'Completed orders',
            btn_tables_text: 'Tables',
            btn_inventory_text: 'Inventory',
            btn_orders_text: 'Orders',
            completed_orders_title: 'Completed orders',
            pending_orders_title: 'Pending orders',
            edit_modal_title: 'Edit',
            edit_order_contents_label: 'Order contents',
            add_products_label: 'Add product',
            btn_edit_order_undo: 'Undo',
            btn_edit_order_redo: 'Redo',
            btn_inventory_add_product: 'Add product',
        }
    },
    sv : {
        default: {
            btn_pending_orders: 'Väntande ordrar',
            btn_completed_orders: 'Färdiga ordrar',
            btn_tables_text: 'Bordsplacering',
            btn_inventory_text: 'Lager',
            btn_orders_text: 'Beställningar',
            completed_orders_title: 'Avslutade beställningar',
            pending_orders_title: 'Väntande beställningar',
            edit_modal_title: 'Redigera',
            edit_order_contents_label: 'Innehåll',
            add_products_label: 'Lägg till produkt',
            btn_edit_order_undo: 'Ångra',
            btn_edit_order_redo: 'Gör om',
            empty_order_list: 'Den här listan är tom!',
            btn_inventory_add_product: 'Lägg till vara',
        }
    }
});
