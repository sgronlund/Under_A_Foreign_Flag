var products = null;

function render_products(id) {
    const container = $('#' + id);
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
    
    const template_product = {
        "nr": "10001",
        "artikelid": "25053",
        "varnummer": "100",
        "namn": "Braastad XO",
        "namn2": "",
        "prisinklmoms": "442.00",
        "volymiml": null,
        "prisperliter": null,
        "saljstart": "2000-08-07",
        "slutlev": " ",
        "varugrupp": "Cognac",
        "forpackning": "Flaska",
        "forslutning": "Naturkork",
        "ursprung": "Cognac, Fine Champagne",
        "ursprunglandnamn": "Frankrike",
        "producent": "Tiffon",
        "leverantor": "Arcus Sweden AB",
        "argang": "",
        "provadargang": "",
        "alkoholhalt": "40%",
        "modul": "",
        "sortiment": "FS",
        "ekologisk": "0",
        "koscher": "0",
    };
    
    products = { "10001": template_product };

    for (let i = 0; i < 100; i++) {
        html += `
            <article class="product card">
                <h4 class="margin-bottom">${template_product.namn}</h4>
                <div class="product-description padding-bottom">
                    <p class="product-description-item">
                        <span class="product_producer_label">Producer:</span>
                        <span class="product_producer_value">${template_product.producent}</span>
                    </p>
                    <p class="product-description-item">
                        <span class="product_country_label">Country:</span>
                        <span class="product_country_value">${template_product.ursprunglandnamn}</span>
                    </p>
                    <p class="product-description-item">
                        <span class="product_category_label">Category:</span>
                        <span class="product_category_value">${template_product.varugrupp}</span>
                    </p>
                    <p class="product-description-item">
                        <span class="product_alcohol_label">Alcohol:</span>
                        <span class="product_alcohol_value">${template_product.alkoholhalt}</span>
                    </p>
                    <p class="product-description-item">
                        <span class="product_type_label">Serving:</span>
                        <span class="product_type_value">${template_product.forpackning}</span>
                    </p>
                </div>
                <div class="product-actions box row space-between padding-top">
                    <div class="box row v-center">
                        <button class="gray small no-icon-spacing" onclick="decrease_quantity(${template_product.nr})">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <input data-quantity-id="${template_product.nr}" class="product-quantity no-spinner" min="1" max="10" value="1" type="number"/>
                        <button class="gray small no-icon-spacing" onclick="increase_quantity(${template_product.nr})">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg> 
                        </button>
                    </div>
                    <button class="extra-light small product-add-to-order" onclick="add_to_order(${template_product.nr})">
                        <span class="product-add-to-order-label">Add to order</span>
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg> 
                    </button>
                </div>
            </article>
        `;
        total++;
    }

    container.html(html);
    total_products.text(total);
}

$(document).ready(function () {
    $('#db-script').on('load', () => {
        products = allBeverages();
        $(document).trigger('db-loaded');
    });
});
