const order = {};

function increase_quantity(product_number) {
    var quant = $("[data-quantity-id='" + product_number + "']").val();
    if (quant != 10) {
        var newQuant = parseInt(quant, 10) + 1;
        $("[data-quantity-id='" + product_number + "']").val(newQuant);
    }
}


function decrease_quantity(product_number) {
    var quant = $("[data-quantity-id='" + product_number + "']").val();
    if(quant != 1){
        var newQuant = parseInt(quant, 10) - 1;
        $("[data-quantity-id='" + product_number + "']").val(newQuant);
    }
}

function add_to_order(product_number) {
    const product = products[product_number];
    const quant = parseInt($("[data-quantity-id='" + product_number + "']").val());
    const total_price = parseFloat(product.prisinklmoms) * quant;
    
    // If the item already exists in the order, simply update the quantity
    if (order.hasOwnProperty(product_number)) {
        if (order[product_number].quantity + quant <= 10) {
            order[product_number].quantity += quant;
            order[product_number].total += total_price;
        }
    } else {
        order[product_number] = {
            product: product,
            quantity: quant,
            total: total_price,
        };
    }
    
    console.log('Order:', order[product_number]);
}


function remove_from_order(product_number) {
    if (order.hasOwnProperty(product_number)) {
        delete order[product_number];
    }
}

function increase_quantity_in_order(product_number){
    if (order.hasOwnProperty(product_number)){
        let current_quant = order[product_number].quantity;
        const price = products[product_number].prisinklmoms;
        
        if (current_quant != 10){
            let current_total = order[product_number].total;
            order[product_number].total += current_total / current_quant;
            order[product_number].quantity += 1;
        }
    }
}

function decrease_quantity_in_order(product_number){
    if (order.hasOwnProperty(product_number)){
        let current_quant = order[product_number].quantity;
        const price = products[product_number].prisinklmoms;
        
        if (current_quant != 1){
            let current_total = order[product_number].total;
            order[product_number].total -= current_total / current_quant;
            order[product_number].quantity -= 1;
        }
    }
}