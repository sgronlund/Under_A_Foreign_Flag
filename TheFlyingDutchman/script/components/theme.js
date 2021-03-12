// =====================================================================================================
// Functions for switching and rendering between color schemes
// =====================================================================================================
// Authors: Fredrik Engstrand, 2021
//          Dante Grenholm, 2021
//          Sebastian Grönlund, 2021
//          Hampus Sandqvist, 2021
//          Kevin Hormiz, 2021  
//
// This file contains functions switching color scheme, currently the options are dark or light mode. 
// To change press the sun/moon button in any view to swtich between them.
//
window.tfd.add_module('theme', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        current_theme: 'light',
        themes: {
            dark: 'dark',
            light: 'light',
        },
        classes: {
            show: 'show',
            error: 'error',
        },
        storage_key: 'theme',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        // Checks which color scheme class is currentyl present and changes to the other available one
        update_body: function() {
            if (this.model.current_theme == this.model.themes.light) {
                $(document.body).removeClass(this.model.themes.dark);
            } else {
                $(document.body).addClass(this.model.themes.dark);
            }
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        load: function() {
            const saved_theme = window.localStorage.getItem(this.model.storage_key);

            if (!saved_theme) {
                // Use default theme
                this.controller.set(this.model.themes.light);
                return;
            }

            this.controller.set(saved_theme);
        },

        set: function(theme) {
            // Stores the current chosen theme in localStorage
            window.localStorage.setItem(this.model.storage_key, theme);
            
            this.model.current_theme = theme;
            this.view.update_body();
        },

        // Function to toggle between the two color schemes, also stores the current color scheme in localStorage
        toggle: function() {
            if (this.model.current_theme == this.model.themes.light) {
                this.controller.set(this.model.themes.dark);
            } else {
                this.controller.set(this.model.themes.light);
            }
        }
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.controller.load();
    },
});
