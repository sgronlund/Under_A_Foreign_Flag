window.tfd.add_module('modal', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        current_modal: null,
        has_error: false,
        ids: {
            login_modal: '#login_modal',
            filter_modal: '#filter_modal',
            checkout_modal: '#checkout_modal',
        },
        classes: {
            show: 'show',
            error: 'error',
        },
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_current_modal: function() {
            if (!this.model.current_modal) {
                // Hide all modals
                $(this.model.ids.login_modal).removeClass(this.model.classes.show);
                $(this.model.ids.filter_modal).removeClass(this.model.classes.show);
                $(this.model.ids.checkout_modal).removeClass(this.model.classes.show);

                return;
            }

            // Show the selected modal
            $(this.model.current_modal).addClass(this.model.classes.show);
        },

        update_current_modal_error: function() {
            // If no modal is open, do not set the error class
            if (!this.model.current_modal) {
                return;
            }

            if (!this.model.has_error) {
                $(this.model.current_modal).removeClass(this.model.classes.error);
                return;
            }

            $(this.model.current_modal).addClass(this.model.classes.error);
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        hide: function() {
            this.model.current_modal = null;
            this.view.update_current_modal();
        },

        show_login: function() {
            this.model.current_modal = this.model.ids.login_modal;
            this.view.update_current_modal();
        },

        show_filter: function() {
            this.model.current_modal = this.model.ids.filter_modal;
            this.view.update_current_modal();
        },

        show_checkout: function() {
            this.model.current_modal = this.model.ids.checkout_modal;
            this.view.update_current_modal();
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
