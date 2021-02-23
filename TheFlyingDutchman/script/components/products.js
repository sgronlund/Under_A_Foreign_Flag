var products = null;

function item_dom(product){
    let description = ``;

    for (const key of Object.keys(product.description)){
        description += `
            <p class="product-description-item">
                <span class="product_${key}_label"></span>
                <span>${product.description[key]}</span>
            </p>
        `;
    }

    let item = `
        <article class="product card box">
            <div class="box row space-between v-center margin-bottom">
                <h4 class="product-title">${product.namn}</h4>
                <p class="product-price">${product.prisinklmoms} SEK</p>
            </div>
            <div class="box v-start fill padding-bottom">
                <div class="box">${description}</div>
            </div>
            <div class="product-actions box row space-between padding-top">
                <div class="box row v-center">
                    <button class="gray small square no-icon-spacing" onclick="decrease_quantity(${product.nr})">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                    </button>
                    <input data-quantity-id="${product.nr}" class="product-quantity no-spinner" min="1" max="10" value="1" type="number"/>
                    <button class="gray small square no-icon-spacing" onclick="increase_quantity(${product.nr})">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
                <button class="extra-light small product-add-to-order" onclick="add_to_order(${product.nr})">
                    <span class="product_add_to_order_label">Add to order</span>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>
        </article>
    `;

    return item;
}

function render_products() {
    const container = $('#menu');
    const total_products = $('#total_products_count');

    if (!container) {
        console.error(`Could not load products into non-existant element: #${id}`);
        return;
    }

    if (!products) {
        console.error('Database has not been loaded, use $(document).on("db-loaded")')
        return;
    }

    let html = "";
    let total = 0;

    for (const key of Object.keys(products)) {
        console.log('asdasd');
        html += item_dom(products[key]);
        total++;
    }

    container.html(html);
    total_products.text(total);

    // Localization is set directly on load and must be updated
    // after we have added the products
    update_localization();
}
