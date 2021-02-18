add_localization_data('login', {
    // Element ids for text elements
    keys: ['login','guest', 'login_form_text', 'close', 'submit', 'username_label', 'password_label'],

    // Element ids for images and their alt-text
    img_keys: [],

    // Element ids for input elements (e.g placeholders)
    placeholder_keys: ['username', 'password'],

    img_src: [],

    // We use one JSON substructure for each language. If we have
    // many different languages and a large set of strings we might
    // need to store a JSON file for each language to be loaded on
    // request.
    //
    en: {
        default: {
            close: 'Close',
            submit: 'Login',
            login_form_text: 'Login',
            username_label: 'Username',
            password_label: 'Password',
        },
        alt: {},
        placeholder: {
            username: 'Username',
            password: 'Password',
        },
        img_src: {},
    },
    sv : {
        default: {
            close: 'Stäng',
            submit: 'Logga in',
            login_form_text: 'Logga in',
            username_label: 'Användarnamn',
            password_label: 'Lösenord',
        },
        alt: {},
        placeholder: {
            username: 'Användarnamn',
            password: 'Lösenord',
        },
        img_src: {}
    }
});