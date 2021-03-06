window.tfd.localization.controller.add('login', {
    keys: [
        'login',
        'guest',
        'login_modal_title',
        'submit',
        'username_label',
        'password_label',
        'login_error_text',
    ],
    alt_keys: [],
    placeholder_keys: ['username', 'password'],
    src_keys: [],

    // We use one JSON substructure for each language. If we have
    // many different languages and a large set of strings we might
    // need to store a JSON file for each language to be loaded on
    // request.
    //
    en: {
        default: {
            submit: 'Login',
            login_modal_title: 'Login',
            username_label: 'Username',
            password_label: 'Password',
            login_error_text: 'Invalid username and/or password',
        },
        placeholder: {
            username: 'Username',
            password: 'Password',
        },
    },
    sv : {
        default: {
            submit: 'Logga in',
            login_modal_title: 'Logga in',
            username_label: 'Användarnamn',
            password_label: 'Lösenord',
            login_error_text: 'Fel användarnamn och/eller lösenord',
        },
        placeholder: {
            username: 'Användarnamn',
            password: 'Lösenord',
        },
    }
});
