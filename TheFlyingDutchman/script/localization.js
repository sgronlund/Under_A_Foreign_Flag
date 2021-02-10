// The actual contents is loaded in from another file based on the current page
// These files are located in script/localization/<page name>.js
// Each localization file exports a 'content' variable with the same format

// The current language
var language = 'en';

// Updates the elements based on the current language
function update_view() {
    for (const idx in content.keys) {
        const key = content.keys[idx];
        $('#' + key).text(get_string(key));
    }

    for (const idx in content.img_keys) {
        const key = content.img_keys[idx];
        $('#' + key).attr('alt', get_alt_string(key));
    }

    for (const idx in content.placeholder_keys) {
        const key = content.placeholder_keys[idx];
        $('#' + key).attr('placeholder', get_placeholder_string(key));
    }
}

// Get the actual string content of a specific id.
function get_string(key) {
    return content[language]['default'][key]; //Returns the string content of an id based on the currently chosen language
}

// Get the alt text of an image
function get_alt_string(key) {
    return content[language]['alt'][key]; //Returns the string content of an alt-text based on the currently chosen language
}

// Get the placeholder text for an input element
function get_placeholder_string(key) {
    return content[language]['placeholder'][key];
}

// Switches between english and swedish and updates the view.
function change_lang() {
    if (language == 'en') {
        language = 'sv';
    } else {
        language = 'en';
    }

    update_view();
}

// Loads in all the string contents based on the default language
$(document).ready(function() {
    update_view();
});