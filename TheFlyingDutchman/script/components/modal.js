// =====================================================================================================
// Functions for updating and rendering the modal
// =====================================================================================================
// Authors: Namn, 2020
//
// This file contains functions for handling and rendering the modal, i.e. the "popup" window, which is
// shown eg. when to user logs in or filters the products.
//


window.tfd.add_module('modal', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        previous_modal: null,
        current_modal: null,
        has_error: false,
        classes: {
            show: 'show',
            error: 'error',
        },
    },

    // =====================================================================================================
    // DOM ELEMENTS
    //
    element: {
        login_modal: '#login_modal',
        filter_modal: '#filter_modal',
        checkout_modal: '#checkout_modal',
        special_drink_modal: '#special_drink_modal',
        order_modal: '#order_modal',
        edit_modal: '#edit_modal',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_current_modal: function() {
            if (this.model.previous_modal) {
                this.model.previous_modal.removeClass(this.model.classes.show);
            }

            // Show the selected modal
            if (this.model.current_modal) {
                this.model.current_modal.addClass(this.model.classes.show);
            }
        },

        update_current_modal_error: function() {
            // If no modal is open, do not set the error class
            if (!this.model.current_modal) {
                return;
            }

            if (!this.model.has_error) {
                this.model.current_modal.removeClass(this.model.classes.error);
                return;
            }

            this.model.current_modal.addClass(this.model.classes.error);
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        show: function(new_modal) {
            //Updates the current modal with a new one and store the previous version
            this.model.previous_modal = this.model.current_modal;
            this.model.current_modal = new_modal;

            // Hide any previous errors
            this.model.has_error = false;

            this.view.update_current_modal();
            this.view.update_current_modal_error();
        },

        hide: function() {
            this.controller.show(null);
        },

        show_login: function() {
            this.controller.show(this.element.login_modal);
        },

        show_special_drink: function() {
            this.controller.show(this.element.special_drink_modal);
        },

        show_filter: function() {
            this.controller.show(this.element.filter_modal);
        },

        show_checkout: function() {
            this.controller.show(this.element.checkout_modal);
        },

        show_order: function() {
            this.controller.show(this.element.order_modal);
        },

        show_edit: function() {
            this.controller.show(this.element.edit_modal);
        },

        show_error: function() {
            this.model.has_error = true;
            this.view.update_current_modal_error();
        },

        hide_error: function() {
            this.model.has_error = false;
            this.view.update_current_modal_error();
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        // Save to variable since the 'each()' jQuery function overrides 'this'.
        const click_handler = this.controller.hide;

        // Find all elements within a modal overlay that should hide
        // the overlay on click.
        $('.modal-event-hide').each(function() {
            // Find the closest parent modal root
            const modal_root = $(this).parents('.modal-root').first();

            // Skip if no parent modal root could be found
            if (!modal_root.length) {
                console.error(`Found element with 'modal-event-hide' class with no parent modal: ${$(this)}`);
                return;
            }

            if (!modal_root.attr('id')) {
                console.error(`Modal root is missing the id attribute: ${modal_root}`);
                return;
            }

            // Add click handler to element that hides the modal
            $(this).bind('click', click_handler);
        });
    },
});
