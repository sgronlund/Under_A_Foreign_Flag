var products = null;

function item_dom(product){
    let description = ``;
    
    console.log(product);
    
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

    // Test data
    // TODO: remove this
    const wine = {
        "nr": "10001",
        "namn": "Jättegott vin",
        "prisinklmoms": "442.00",
        "description": {
            "argang": "1700",
            "typ": "Rött",
            "druva": "Tin babaroca",
            "forpackning": "Flaska",
            "producent": "Tiffon",
        },
    };
    
    const pure =  {
        "nr": "1001",
        "namn": "Vanlig Vodka",
        "prisinklmoms": "195.00",
        "description": {
            "ursprunglandnamn": "Sverige",
            "sort": "Okryddad sprit",
            "alkoholhalt": "37.5%",
            "producent": "Svensk Export Vodka AB",
            "forpackning": "Flaska",
        },
    };
    
    const beer =  {
        "nr": "420",
        "namn": "Braastad XO",
        "prisinklmoms": "442.0",
        "description": {
            "ursprunglandnamn": "Frankrike",
            "sort": "Okryddad sprit",
            "alkoholhalt": "37.5%",
            "producent": "Svensk Export Vodka AB",
            "forpackning": "Flaska",
        },
    };

    products = { "10001": wine, "1001": pure, "420": beer};

    for (const key of Object.keys(products)) {
        html += item_dom(products[key]);
        total++;
    }

    container.html(html);
    total_products.text(total);
    
    // Localization is set directly on load and must be updated 
    // after we have added the products
    update_localization();
}

$(document).ready(function () {
    $('#db-script').on('load', () => {
        products = allBeverages();
        $(document).trigger('db-loaded');
    });
    
    // Cloud9 fix 
    if (window.location.host.length >= 13 && window.location.host.substr(-13) == "amazonaws.com") {
        console.log('Detected cloud9 environment, overriding db-load event');
        products = [];
        $(document).trigger('db-loaded');
    }
});
