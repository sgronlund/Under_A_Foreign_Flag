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

    for (let i = 0; i < 100; i++) {
        html += `<article class="card">${products[i].namn}</article>`;
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
