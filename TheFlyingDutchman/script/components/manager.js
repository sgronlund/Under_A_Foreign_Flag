// =====================================================================================================
//  Functions for rendering and handling the pubs inventory
// =====================================================================================================
// Authors: Namn, 2021
// 
// These function allow the manager to see which items are in the different menus, remove and add different
// items from the inventory and update the stock on items currently in inventory

window.tfd.add_module('manager', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        
    },
    
    // =====================================================================================================
    // DOM ELEMENTS
    //
    element: {
        inventory_container: '#inventory_view',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_inventory: function() {
            let html = ''
            const inventory = this.global.inventory;
            
            for (const key of Object.keys(inventory)) {
                const { stock, on_menu, on_special_menu } = inventory[key];
                html += this.view.create_inventory_item(key, stock, on_menu, on_special_menu);
            }
            
            this.element.inventory_container.html(html);
        },
        
        create_inventory_item: function(product_id, stock, on_menu, on_special_menu) {
            const { namn } = this.global.drinks[product_id];
            
            return (`
                <article class="card box row space-between margin-bottom">
                    <div class="box">
                        <h4>${namn}</h4>
                        <div class="inventory-item-data box row margin-top-sm">
                            <p class="margin-right">
                                <span class="inventory_item_stock_text bold">Stock:</span>
                                <span>${stock}</span>
                            </p> 
                            <p class="margin-right">
                                <span class="inventory_item_stock_text bold">On menu:</span>
                                <span>${on_menu}</span>
                            </p>
                            <p class="margin-right">
                                <span class="inventory_item_stock_text bold">On special menu:</span>
                                <span>${on_special_menu}</span>
                            </p>
                        </div>
                    </div>
                    <div class="box row v-center">
                        <button class="gray small square no-icon-spacing">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <input type="number" class="product-quantity no-spinner" value="0" min="0" />
                        <button class="gray small square no-icon-spacing">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button class="extra-light small margin-left">
                            <span class="inventory_item_remove_text">Remove</span>
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </article>
           `);
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        
    },
    
    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.view.update_inventory(); 
    },
});
