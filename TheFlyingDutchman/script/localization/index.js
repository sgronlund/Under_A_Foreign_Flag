const content = {
    // Element ids for text elements
    keys: ['login','guest', 'close', 'submit'],

    // Element ids for images and their alt-text
    img_keys: ['start'],

    // Element ids for input elements (e.g placeholders)
    placeholder_keys: ['username', 'password'],

    img_src: ['flag'],

    // We use one JSON substructure for each language. If we have
    // many different languages and a large set of strings we might
    // need to store a JSON file for each language to be loaded on
    // request.
    //
    en: {
        default: {
            guest: 'Guest',
            login: 'Log in',
            close: 'Close',
            submit: 'Log in',
        },
        alt: {
            start: 'Two sausages on a plate',
        },
        placeholder: {
            username: 'Username',
            password: 'Password',
        },
        img_src: {
            flag: 'bilder/eng.svg'
        }
    },
    sv : {
        default: {
            guest : 'Gäst',
            login: 'Logga in',
            close: 'Stäng',
            submit: 'Logga in',
        },
        alt: {
            start: 'Två korvar på en tallrik',
        },
        placeholder: {
            username: 'Användarnamn',
            password: 'Lösenord',
        },
        img_src: {
            flag: 'bilder/sv.svg'
        }
    }
};
