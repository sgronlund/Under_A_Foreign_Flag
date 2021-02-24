const order = {
    items: {},
    total_items: 0,
    total_price: 0,
};

function increase_quantity(product_number) {
    var quant = parseInt($("[data-quantity-id='" + product_number + "']").val());

    if (order.total_items + quant < 10) {
        var newQuant = parseInt(quant, 10) + 1;
        $("[data-quantity-id='" + product_number + "']").val(newQuant);
    }
}

function decrease_quantity(product_number) {
    var quant = parseInt($("[data-quantity-id='" + product_number + "']").val());
    if(quant !== 1){
        var newQuant = parseInt(quant, 10) - 1;
        $("[data-quantity-id='" + product_number + "']").val(newQuant);
    }
}

function add_to_order(product_number) {
    const product = products[product_number];
    const quantity_element = $("[data-quantity-id='" + product_number + "']");
    const quant = parseInt(quantity_element.val());
    const total_price = parseFloat(product.prisinklmoms) * quant;

    if (order.total_items + quant > 10) {
        return;
    }

    // If the item already exists in the order, simply update the quantity
    if (order.items.hasOwnProperty(product_number)) {
        order.items[product_number].quantity += quant;
        order.items[product_number].total += total_price;

    } else {
        order.items[product_number] = {
            product: product,
            quantity: quant,
            total: total_price,
        };
    }

    order.total_price += total_price;
    order.total_items += quant;
    render_order();
    // Reset quantity element value
    quantity_element.val(1);

    console.log('Order:', order);
}

function remove_from_order(product_number) {
    if (order.items.hasOwnProperty(product_number)) {
        const product = order.items[product_number];
        order.total_items -= product.quantity;
        order.total_price -= product.total;
        delete order.items[product_number];
        render_order();
    }
}

function increase_quantity_in_order(product_number){
    if (order.items.hasOwnProperty(product_number)){
        let current_quant = order.items[product_number].quantity;
        const price = parseInt(products[product_number].prisinklmoms);

        if (order.total_items != 10){
            let current_total = order.items[product_number].total;
            order.items[product_number].total += current_total / current_quant;
            order.items[product_number].quantity += 1;

            // Update the total order items and price
            order.total_items += 1;
            order.total_price += price;
            render_order();
        }
    }
}

function decrease_quantity_in_order(product_number){
    if (order.items.hasOwnProperty(product_number)){
        let current_quant = order.items[product_number].quantity;
        const price = products[product_number].prisinklmoms;

        if (current_quant != 1){
            let current_total = order.items[product_number].total;
            order.items[product_number].total -= current_total / current_quant;
            order.items[product_number].quantity -= 1;
            // Update the total order items and price

            order.total_items -= 1;
            order.total_price -= price;
            render_order();
        }
    }
}

function render_order() {
    const container = $('#order');
    const total_amount = $("#order_total_amount");
    const total_items = $("#btn_order_count");
    const total_items_header = $("#total_products_order_count");
    let html = "";

    if (order.total_items == 0) {
        // TODO: Show message?
        container.html('');
        total_amount.text('0 SEK');
        total_items.text('0');
        total_items_header.text('0');
        return;
    }

    total_amount.text(order.total_price + " SEK");
    total_items.text(order.total_items);
    total_items_header.text(order.total_items);

    for (const item of Object.values(order.items)) {
        const description = item_description_dom(item.product);

        html += `
            <article class="product card">
                <div class="box margin-bottom">
                    <h4 class="product-title">${item.product.namn}</h4>
                </div>
                <div class="box v-start fill padding-bottom">
                    <div class="product-description-order">${description}</div>
                </div>
                <div class="product-actions box row space-between v-center padding-top">
                    <div class="box row v-center">
                        <button class="extra-light small margin-right" onclick="remove_from_order(${item.product.nr})">
                            <span class="order_remove_product_label">Remove</span>
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                        </button>
                        <button class="gray small square no-icon-spacing" onclick="decrease_quantity_in_order(${item.product.nr})">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <input data-order-quantity-id="${item.product.nr}" class="product-quantity no-spinner" min="1" max="10" value="${item.quantity}" type="number"/>
                        <button class="gray small square no-icon-spacing" onclick="increase_quantity_in_order(${item.product.nr})">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                    <h3 class="product-price-order">${item.total} SEK</h3>
                </div>
            </article>
        `;
    }

    container.html(html);
    update_localization();
}
