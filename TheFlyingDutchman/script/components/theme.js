const THEME_MODES = {
    DARK: 'dark',
    LIGHT: 'light',
};

var theme = 'light';

function load_theme() {
    const saved_theme = window.localStorage.getItem('theme');

    if (!saved_theme) {
        // Use default theme
        set_theme(THEME_MODES.LIGHT);
        return;
    }

    set_theme(saved_theme);
}

function set_theme(new_theme) {
    if (new_theme == THEME_MODES.DARK) {
        $(document.body).addClass(THEME_MODES.DARK);
    } else if (new_theme == THEME_MODES.LIGHT) {
        $(document.body).removeClass(THEME_MODES.DARK);
    } else {
        console.error(`Could not enable invalid theme mode: ${new_theme}`);
        return;
    }

    theme = new_theme;
    window.localStorage.setItem('theme', theme);
}

function toggle_theme() {
    if (theme == THEME_MODES.LIGHT) {
        set_theme(THEME_MODES.DARK);
    } else {
        set_theme(THEME_MODES.LIGHT);
    }
}

$(document).ready(function() {
    load_theme();
});
