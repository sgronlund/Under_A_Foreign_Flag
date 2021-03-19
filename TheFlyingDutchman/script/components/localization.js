// =====================================================================================================
//  Functions for apply localization and switching languages
// =====================================================================================================
// Authors: Fredrik Engstrand, 2021
//          Dante Grenholm, 2021
//          Sebastian Grönlund, 2021
//          Hampus Sandqvist, 2021
//          Kevin Hormiz, 2021  
//
//
// The actual contents is loaded in from another file based on the current page
// These files are located in script/localization/<page name>.js
// Each localization file exports a 'content' variable with the same format
window.tfd.add_module('localization', {
    // =====================================================================================================
    // MODEL
    //
    model: {
        current_language: 'en',
        content: {},
        languages: {
            english: 'en',
            swedish: 'sv',
        },
        type_keys: {
            text: 'default',
            alt: 'alt',
            src: 'src',
            placeholder: 'placeholder',
        },
        storage_key: 'language',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_component: function(id) {
            // Contains other information, e.g. the id's and prefix
            const data = this.model.content[id];

            // Contains all the strings for the current language
            const lang_data = data[this.model.current_language];

            if (!data || !lang_data) {
                return;
            }

            // If the localization data uses class identifiers instead of id
            const prefix = data['use_class_identifiers'] === true ? '.' : '#';

            // Updates all ids with their specific string content
            for (const idx of data.keys) {
                $(prefix + idx).text(lang_data[this.model.type_keys.text][idx]);
            }

            // Updates all alt-texts with their specific string content
            for (const idx of data.alt_keys) {
                $(prefix + idx).attr('alt', lang_data[this.model.type_keys.alt][idx]);
            }

            // Updates all placeholder attributes with their specific string content
            for (const idx of data.placeholder_keys) {
                $(prefix + idx).attr('placeholder', lang_data[this.model.type_keys.placeholder][idx]);
            }

            for (const idx of data.src_keys) {
                $(prefix + idx).attr('src', lang_data[this.model.type_keys.src][idx]);
            }
        },

        update: function() {
            // Loop through each localization component and update the strings defined 
            // by the component. All of these components can be seen in the 'script/i18n' directory.
            for (const id of Object.keys(this.model.content)) {
                this.view.update_component(id);
            }
        },
    },

    // =====================================================================================================
    // CONTROLLER
    //
    controller: {
        load: function() {
            const saved_language = window.localStorage.getItem(this.model.storage_key);

            if (!saved_language) {
                // Use default language
                this.controller.set(this.model.languages.english);
                return;
            }

            // Update the selected language and render the strings
            this.controller.set(saved_language);
        },

        save: function() {
            // Save the selected language to localStorage
            window.localStorage.setItem(this.model.storage_key, this.model.current_language);
        },

        set: function(language) {
            this.model.current_language = language;

            // Save current language to localStorage
            this.controller.save();

            // Update the page localization strings
            this.view.update();
        },

        toggle: function() {
            // Switches between the two available languages
            if (this.model.current_language == this.model.languages.english) {
                this.controller.set(this.model.languages.swedish);
            } else {
                this.controller.set(this.model.languages.english);
            }
        },

        add: function(id, data) {
            if (this.model.content.hasOwnProperty(id)) {
                console.error(`Could not replace existing localization data with id: ${id}`);
                return;
            }

            // Save the localization data into the model so that it can be used when setting
            // the language
            this.model.content[id] = data;
        },

        // This function is used to update the strings of just a certain component,
        // i.e. one of the files in the 'script/i18n' directory. We do this since the
        // performance of finding and changing all strings is slow and generally we only want to
        // update a small subset of the available translation strings
        update_component: function(id) {
            if (!id) {
                return;
            }

            // Check if we have a registered component with that id
            if (!this.model.content.hasOwnProperty(id)) {
                console.error(`Could not find localization component: ${id} - did you forget to import it?`);
                return;
            }

            this.view.update_component(id);
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        // Load the selected language from localStorage
        this.controller.load();
    },
});
