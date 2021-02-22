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
            DB.account[i].creditSEK = newAmount.toString();   // This changes the value in the JSON object.
        };
    };
}

// =====================================================================================================
// Returns a list of objects containing the name and category of each beverage in the database.
// This function can be used as a recipe for similar functions.
//
function allBeverages() {
    // Using a local variable to collect the items.
    const collector = {};

    // The DB is stored in the variable DB2, with "spirits" as key element. If you need to select only certain
    // items, you may introduce filter functions in the loop... see the template within comments.
    //
    for (let i = 0; i < DB2.spirits.length; i++) {
        let product = DB2.spirits[i];
        collector[product.nr] = Object.assign({}, product);
    };

    return collector;
}

// =====================================================================================================
// Returns a list of objects containing the name and category of each beverage in the database with
// a alcohol percentage higher than the given strength.
//
function allStrongBeverages(strength) {
    // Using a local variable to collect the items.
    //
    const collector = [];

    // The DB is stored in the variable DB2, with "spirits" as key element. If you need to select only certain
    // items, you may introduce filter functions in the loop... see the template within comments.
    //
    for (let i = 0; i < DB2.spirits.length; i++) {

        // We check if the percentage alcohol strength stored in the data base is lower than the
        // given limit strength. If the limit is set to 14, also liqueuers are listed.
        //
        if (percentToNumber(DB2.spirits[i].alkoholhalt) > strength) {

            // The key for the beverage name is "namn", and beverage type is "varugrupp".
            //
            collector.push({ namn: DB2.spirits[i].namn, varugrupp: DB2.spirits[i].varugrupp });
        };
    };

    // Don't forget to return the result.
    //
    return collector;
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
