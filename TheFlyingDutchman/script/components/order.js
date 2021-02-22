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
        }
    }
}