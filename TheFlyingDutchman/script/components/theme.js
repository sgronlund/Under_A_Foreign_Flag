var theme = 'light';

function toggle_theme() {
    if (theme == 'light') {
        $(document.body).addClass('dark');
        theme = 'dark';
    } else {
        $(document.body).removeClass('dark');
        theme = 'light';
    }
}
