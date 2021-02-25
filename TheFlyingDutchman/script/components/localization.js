// The actual contents is loaded in from another file based on the current page
// These files are located in script/localization/<page name>.js
// Each localization file exports a 'content' variable with the same format

// The available languages
const LANGUAGES = {
    ENGLISH: 'en',
    SWEDISH: 'sv',
};

// The current language
var language = LANGUAGES.ENGLISH;
const content = {};

function add_localization_data(id, data) {
    if (content.hasOwnProperty(id)) {
        console.warn(`Replacing localization data with id: ${id}`);
    }

    content[id] = data;
}

function set_localization_string(key) {
    const data = content[key];
    let prefix = '#';

    // If the localization data uses class identifiers instead of id
    if (data.hasOwnProperty('use_class_identifiers') && data.use_class_identifiers === true) {
        prefix = '.';
    }

    for (const idx of data.keys) { // updates all ids with their specific string content
        $(prefix + idx).text(get_string(data, idx));
    }

    for (const idx of data.alt_keys) { // updates all alt-texts with their specific string content
        $(prefix + idx).attr('alt', get_alt_string(data, idx));
    }

    for (const idx of data.placeholder_keys) { // updates all placeholder attributes with their specific string content
        $(prefix + idx).attr('placeholder', get_placeholder_string(data, idx));
    }

    for (const idx of data.src_keys) {
        $(prefix + idx).attr('src', get_src_string(data, idx));
    }
}

// Updates the elements based on the current language
function update_localization() {
    for (const key of Object.keys(content)) {
        set_localization_string(key);
    }
}

// Get the actual string content of a specific id.
function get_string(data, key) {
    return data[language]['default'][key]; //Returns the string content of an id based on the currently chosen language, i.e. Swedish or English
}

// Get the alt text of an image
function get_alt_string(data, key) {
    return data[language]['alt'][key]; //Returns the string content of an alt-text based on the currently chosen language, i.e. Swedish or English
}

// Get the placeholder text for an input element
function get_placeholder_string(data, key) {
    return data[language]['placeholder'][key]; // Returns the string content of a placeholder based on the currently chose language, i.e. Swedish or English
}

function get_src_string(data, key) {
    return data[language]['src'][key];
}

function load_language() {
    const saved_language = window.localStorage.getItem('language');

    if (!saved_language) {
        // Use default language
        set_language(language);
        return;
    }

    set_language(saved_language);
}

function set_language(new_language) {
    if (new_language == LANGUAGES.ENGLISH) {
        language = LANGUAGES.ENGLISH
    } else if (new_language == LANGUAGES.SWEDISH) {
        language = LANGUAGES.SWEDISH;
    } else {
        console.error(`Could not set invalid language: ${new_language}`);
        return;
    }

    window.localStorage.setItem('language', language);

    // Updates all the elements with the newly chosen languages string contents
    update_localization();
}

// Switches between english and swedish and updates the view.
function toggle_language() {
    if (language == LANGUAGES.ENGLISH) {
        set_language(LANGUAGES.SWEDISH);
    } else {
        set_language(LANGUAGES.ENGLISH);
    }
}

// Calls the function update_view() when loading the page.
$(document).ready(function() {
    load_language();
});
