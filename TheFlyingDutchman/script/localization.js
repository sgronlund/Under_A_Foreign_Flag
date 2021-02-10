// The actual contents is loaded in from another file based on the current page
// These files are located in script/localization/<page name>.js
// Each localization file exports a 'content' variable with the same format

// The current language
var language = 'en';

// Updates the elements based on the current language
function update_view() {
    for (const idx in content.keys) { // updates all ids with their specific string content
        const key = content.keys[idx];
        $('#' + key).text(get_string(key)); // jQuery function to update any attribute given its name and a value
    }

    for (const idx in content.img_keys) { // updates all alt-texts with their specific string content
        const key = content.img_keys[idx];
        $('#' + key).attr('alt', get_alt_string(key)); // jQuery function to update any attribute given its name and a value
    }

    for (const idx in content.placeholder_keys) { // updates all placeholder attributes with their specific string content
        const key = content.placeholder_keys[idx];
        $('#' + key).attr('placeholder', get_placeholder_string(key)); // jQuery function to update any attribute given its name and a value
    }
}

// Get the actual string content of a specific id.
function get_string(key) {
    return content[language]['default'][key]; //Returns the string content of an id based on the currently chosen language, i.e. Swedish or English
}

// Get the alt text of an image
function get_alt_string(key) {
    return content[language]['alt'][key]; //Returns the string content of an alt-text based on the currently chosen language, i.e. Swedish or English
}

// Get the placeholder text for an input element
function get_placeholder_string(key) {
    return content[language]['placeholder'][key]; // Returns the string content of a placeholder based on the currently chose language, i.e. Swedish or English
}

// Switches between english and swedish and updates the view.
function change_lang() {
    if (language == 'en') {
        language = 'sv'; // Updates the variable to the other available language
    } else {
        language = 'en'; // Updates the variable to the other available language
    }
    update_view(); // Updates all the elements with the newly chosen languages string contents
}

// Calls the function update_view() when loading the page.
$(document).ready(function() {
    update_view(); 
});