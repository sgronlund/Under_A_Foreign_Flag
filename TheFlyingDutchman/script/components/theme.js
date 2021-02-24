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
            window.localStorage.setItem(this.model.storage_key, theme);

            this.model.current_theme = theme;
            this.view.update_body();
        },

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
