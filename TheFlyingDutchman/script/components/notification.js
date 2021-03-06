// =====================================================================================================
//  Functions for showing notifications
// =====================================================================================================
// Authors: Namn, 2021
//
// This functionality is resused on every page. Notifications are used to notify the user of when something
// goes wrong, e.g. when an add to order failed. On the staff-page, notifications are e.g. used to show when a
// product is low on stock.
//
window.tfd.add_module('notification', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        current_message_key: null,
        previous_message_key: null,
        is_error: false,
        classes: {
            body: 'show-notification',
            animate_in: 'show',
            error: 'error',
        },
        message_keys: {
            order_full: 'notification_order_full',
            order_empty: 'notification_order_empty',
            out_of_stock: 'notification_out_of_stock',
            insufficient_funds: 'notification_insufficent_funds',
        },
        hide_delay: 3000, // ms
        hide_timeout: null,
    },

    // =====================================================================================================
    // DOM ELEMENTS
    //
    element: {
        notification: '#notification',
        message: '#notification_message',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_notification: function() {
            if (!this.model.current_message_key) {
                return;
            }

            if (this.model.previous_message_key) {
                // Remove the previous localization id
                this.element.message.removeClass(this.model.previous_message_key);
            }

            // Add the localization id to display the message
            this.element.message.addClass(this.model.current_message_key);

            // Apply animation class to fade in notification
            this.element.notification.addClass(this.model.classes.animate_in);

            if (this.model.is_error) {
                this.element.notification.addClass(this.model.classes.error);
            } else {
                this.element.notification.removeClass(this.model.classes.error);
            }

            // If we have a running timeout that has not yet ran,
            // clear it and create a new one.
            if (this.model.hide_timeout) {
                clearTimeout(this.model.hide_timeout);
            }

            // Hide notification after the delay
            this.model.hide_timeout = setTimeout(function() {
                this.element.notification.removeClass(this.model.classes.animate_in);
            }.bind(this), this.model.hide_delay);

            // Set the notification message
            window.tfd.localization.view.update_localization_component('notification');
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        show: function(message_key, error) {
            this.model.is_error = error;
            this.model.previous_message_key = this.model.current_message_key;
            this.model.current_message_key = message_key;

            this.view.update_notification();
        },

        show_order_full_notification: function() {
            this.controller.show(this.model.message_keys.order_full, true);
        },

        show_out_of_stock_notification: function() {
            this.controller.show(this.model.message_keys.out_of_stock, true);
        },

        show_order_empty_notification: function() {
            this.controller.show(this.model.message_keys.order_empty, true);
        },

        show_insufficent_funds_notification: function() {
            this.controller.show(this.model.message_keys.insufficient_funds, true);
        },
    },
});
