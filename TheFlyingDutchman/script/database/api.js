// =====================================================================================================
// SOme sample API functions for the Flying Dutchman data base.
// =====================================================================================================
// Author: Lars Oestreicher, 2018
//
// Adapted from a mySQL data base.
//
// We use (global) variables to store the data. This is not generally advisable, but has the
// advantage that the data is easy to access through simple APIs. Also, when storing as local storage,
// all data is stored as strings, which might be adding some complexity.
//
function allUserNames() {
    var nameCollect = [];
    for (let i = 0; i < DB.users.length; i++) {
        nameCollect.push(DB.users[i].username);
    }
    return nameCollect;
}

// =====================================================================================================
// This is an example of a file that will return an array with some specific details about a
// selected user name (not the first name/alst name). It will also add details from another "database"
// which contains the current account status for the person.
//
function userDetails(username) {
    // Will store a copy of the user details
    const details = {};

    // First we find the user ID of the selected user. We also save the index number for the record in the JSON
    // structure.
    //
    for (let i = 0; i < DB.users.length; i++) {
        if (DB.users[i].username == username) {
            // Create copy of the user object in the database and store it in 'details'
            // If we were to assign details to DB.users[i], we would actually be able to mutate
            // the object inside the DB, which could lead to unexpected behaviour.
            Object.assign(details, DB.users[i]);
        }
    }

    // We get the current account status from another table in the database, account. We store this in
    // a variable here for convenience.
    //
    for (let i = 0; i < DB.account.length; i++) {
        if (DB.account[i].user_id == details.user_id) {
            // Add key in object for the credit
            details['creditSEK'] = DB.account[i].creditSEK;
        }
    }

    return details;
}

// =====================================================================================================
// This function will change the credit amount in the user's account. Note that the amount given as argument is the new
// balance and not the changed amount (± balance).
//
function changeBalance(username, newAmount) {
    // We use this variable to store the userID, since that is the link between the two data bases.
    var userID;

    // First we find the userID in the user data base.
    //
    for (let i = 0; i < DB.users.length; i++) {
        if (DB.users[i].username == username) {
            userID = DB.users[i].user_id;
        };
    };

    // Then we match the userID with the account list.
    // and change the account balance.
    //
    for (let i = 0; i < DB.account.length; i++) {
        if (DB.account[i].user_id == userID) {
            // Convert 'newAmount' to a string to match the database type
            DB.account[i].creditSEK = newAmount;   // This changes the value in the JSON object.
        };
    };
}

// =====================================================================================================
// Converts empty or invalid strings in the database into '-' to indicate
// that the information is missing
//
function get_beverage_description_string(string) {
    if (!string || string === '') {
        return '-';
    }

    return string;
}

// =====================================================================================================
// Extracts the beverage type from the category string, e.g. Red wine
//
function get_beverage_sort(category_string) {
    const list = category_string.split(',');

    // The beverage type is defined as the second string (separated by comma)
    // in the beverage category string. If this is missing, the beverage has no type.
    if (list.length < 2) {
        return '-';
    }

    return list[1];
}

// =====================================================================================================
// Extracts the sort of beverage from the category string, e.g. Cognac
//
function get_beverage_type(category_string) {
    const list = category_string.split(' ');

    // If category_string string is empty
    if (list.length == 0) {
        return '-';
    }

    return list[0];
}

// =====================================================================================================
// Returns a list of objects containing the name and category of each beverage in the database.
// This function can be used as a recipe for similar functions.
//
function load_drinks(data) {
    // Using a local variable to collect the items.
    const collector = {};

<<<<<<< HEAD
    // The DB is stored in the variable DB2, with "spirits" as key element. If you need to select only certain
    // items, you may introduce filter functions in the loop... see the template within comments.
    //
    for (let i = 0; i < data.spirits.length; i++) {
        const product = data.spirits[i];

        // Contains all the values that describe the beverage.
        // These are different based on the type of drink.
        const description = {
            forpackning: get_beverage_description_string(product.forpackning),
            producent: get_beverage_description_string(product.producent),
            alkoholhalt: get_beverage_description_string(product.alkoholhalt),
        };

        // Extract type-specific description items
        if (product.varugrupp.toLowerCase().includes("öl")) {
            // Description for beers
            description['sort'] = get_beverage_sort(product.varugrupp);
            description['ursprunglandnamn'] = get_beverage_description_string(product.ursprunglandnamn);
        } else if (product.varugrupp.toLowerCase().includes("vin")) {
            // Description for wine
            description['typ'] = get_beverage_type(product.varugrupp);
            description['argang'] = get_beverage_description_string(product.argang);
            description['druva'] = get_beverage_description_string(product.namn2);
        } else {
            // Description for other
            description['ursprunglandnamn'] = get_beverage_description_string(product.ursprunglandnamn);
            description['sort'] = get_beverage_description_string(product.varugrupp);
        }

        collector[product.nr] = {
            nr: product.nr,
            namn: product.namn,
            prisinklmoms: parseFloat(product.prisinklmoms), // Convert to float
            description,

            // Indicates if a product is only for VIP guests
            vip: product.vip == true,
        };
=======
    // Passes to products to the filter function which formats them correctly
    for (let i = 0; i < DB2.spirits.length; i++) {
        const product = DB2.spirits[i];
        collector[product.nr] = filter(product);
>>>>>>> Added some more backend functions to filter, rewrote older ones
    }

    return collector;
}

// =====================================================================================================
// Returns a list of objects containing the name and category of each beverage in the database with
// a alcohol percentage higher than the given strength.
//
function filterBasedOnStrength(strength) {
    // Using a local variable to collect the items.
    //
    const collector = {};
    
    for (let i = 0; i < DB2.spirits.length; i++) {
        const product = DB2.spirits[i]
        
        // Checks if the alcohol content of the drink is less than the supplied strength
        if (percentToNumber(product.alkoholhalt) > strength) {
            collector[product.nr] = filter(product);
        };
    };
    return collector;
}

function filterTannins() {
    const collector = {};
    for(let i = 0; i < DB2.spirits.length; i++) {
        const product = DB2.spirits[i];
        // All wines contains tannnins therefore we check if the type of the product is wine
        if (!product.varugrupp.toLowerCase().includes("vin")) {
            collector[product.nr] = filter(product);
        }
    }
    return collector;
}


function filterKosher() {
    const collector = {};
    for(let i = 0; i < DB2.spirits.length; i++) {
        const product = DB2.spirits[i];
        // Checks if the koscher field for the drink is set to 1, i.e. the drink is koscher.
        if (product.koscher == "1") {
            collector[product.nr] = filter(product);
        }
    }
    return collector;
}

// Formats the description/content of a drink based on its type, eg. with a Wine we also include the grape variety.
function filter(product) {
    const description = {
        forpackning: get_beverage_description_string(product.forpackning),
        producent: get_beverage_description_string(product.producent),
        alkoholhalt: get_beverage_description_string(product.alkoholhalt),
    };

    // Extract type-specific description items
    if (product.varugrupp.toLowerCase().includes("öl")) {
        // Description for beers
        description['sort'] = get_beverage_sort(product.varugrupp);
        description['ursprunglandnamn'] = get_beverage_description_string(product.ursprunglandnamn);
    } else if (product.varugrupp.toLowerCase().includes("vin")) {
        // Description for wine
        description['typ'] = get_beverage_type(product.varugrupp);
        description['argang'] = get_beverage_description_string(product.argang);
        description['druva'] = get_beverage_description_string(product.namn2);
    } else {
        // Description for other
        description['ursprunglandnamn'] = get_beverage_description_string(product.ursprunglandnamn);
        description['sort'] = get_beverage_description_string(product.varugrupp);
    }

    filtered = {
        nr: product.nr,
        namn: product.namn,
        prisinklmoms: parseFloat(product.prisinklmoms), // Convert to float
        description,
    };
    return filtered;
}

// =====================================================================================================
// Lists all beverage types in the database. As you will see, there are quite a few, and you might want
// select only a few of them for your data.
//
function beverageTypes() {
    const types = [];

    for (let i = 0; i < DB2.spirits.length; i++) {
        addToSet(types, DB2.spirits[i].varugrupp);
    };

    return types;
}

// =====================================================================================================
// Adds an item to a set, only if the item is not already there.
// The set is modelled using an array.
//
function addToSet(set, item) {
    if (!set.includes(item)) {
        set.push(item);
    }

    return set;
}

// =====================================================================================================
// Convenience function to change "xx%" into the percentage in whole numbers (non-strings).
//
function percentToNumber(percentStr) {
    return Number(percentStr.slice(0,-1));
}

// =====================================================================================================
// =====================================================================================================
// END OF FILE
// =====================================================================================================
// =====================================================================================================
