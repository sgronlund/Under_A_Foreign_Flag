var products = null;

function render_products(id) {
    const container = $('#' + id);
    
    if (!container) {
        console.error(`Could not load products into non-existant element: #${id}`);
        return;
    }
    
    if (!products) {
        console.error('Database has not been loaded, use $(document).on("db-loaded")')
        return;
    }
    
    let html = "";
    
    for (let i = 0; i < 100; i++) {
        html += `<article class="card">${products[i].namn}</article>`;
    }
    
    container.html(html);
}

$(document).ready(function () {
    $('#db-script').on('load', () => {
        products = allBeverages();
        $(document).trigger('db-loaded');
    });
});
