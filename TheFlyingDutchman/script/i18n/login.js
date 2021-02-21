add_localization_data('login', {
    keys: [
        'login',
        'guest',
        'login_modal_title',
        'submit',
        'username_label',
        'password_label'
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
        },
        placeholder: {
            username: 'Användarnamn',
            password: 'Lösenord',
        },
    }
});
