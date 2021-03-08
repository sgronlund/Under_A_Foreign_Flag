// =====================================================================================================
//  Functions for apply localization and switching languages
// =====================================================================================================
// Authors: Namn, 2021
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
        text_key: 'default',
        alt_key: 'alt',
        src_key: 'src',
        placeholder_key: 'placeholder',
        storage_key: 'language',
    },

    // =====================================================================================================
    // VIEW
    //
    view: {
        update_localization_component: function(key) {
            // Contains other information, e.g. the id's and prefix
            const data = this.model.content[key];

            // Contains all the strings for the current language
            const lang_data = data[this.model.current_language];

            if (!data) {
                return;
            }

            // If the localization data uses class identifiers instead of id
            const prefix = data['use_class_identifiers'] === true ? '.' : '#';

            // Updates all ids with their specific string content
            for (const idx of data.keys) {
                $(prefix + idx).text(lang_data[this.model.text_key][idx]);
            }

            // Updates all alt-texts with their specific string content
            for (const idx of data.alt_keys) {
                $(prefix + idx).attr('alt', lang_data[this.model.alt_key][idx]);
            }

            // Updates all placeholder attributes with their specific string content
            for (const idx of data.placeholder_keys) {
                $(prefix + idx).attr('placeholder', lang_data[this.model.placeholder_key][idx]);
            }

            for (const idx of data.src_keys) {
                $(prefix + idx).attr('src', lang_data[this.model.src_key][idx]);
            }
        },

        update_localization: function() {
            for (const key of Object.keys(this.model.content)) {
                this.view.update_localization_component(key);
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

            this.controller.set(saved_language);
        },

        set: function(language) {
            window.localStorage.setItem(this.model.storage_key, language);

            this.model.current_language = language;
            this.view.update_localization();
        },

        toggle: function() {
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

            this.model.content[id] = data;
        },
    },

    // =====================================================================================================
    // DOCUMENT READY EVENT
    //
    ready: function() {
        this.controller.load();
    },
});
