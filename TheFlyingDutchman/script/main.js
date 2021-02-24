window.tfd = {
    // =====================================================================================================
    // PUBLIC FUNCTIONS
    //
    // Creates a new module consisting of a model, view and controller.
    // The view, model and controller can be accessed globally from the
    // 'window.tfd.<view/model/controller>.<key>' namespace.
    //
    // To simplify the call and implementation of controller functions,
    // the specified model and view is automatically passed to the controller.
    add_module: function(name, module) {
        if (!name) {
            console.error('Name of module can not be undefined/null!');
            return;
        }

        if (
            !module.hasOwnProperty('model') ||
            !module.hasOwnProperty('view') ||
            !module.hasOwnProperty('controller')
        ) {
            console.error('The module must contain model, view and controller object keys!');
        }

        if (this.hasOwnProperty(name)) {
            console.error(`Could not add module. Name collides with an internal key: ${name}`);
            return;
        }

        this[name] = {
            model: module.model,
            view: {},
            controller: {},
        };

        const context = this[name];

        // Go through each defined controller function
        for (const fn_name of Object.keys(module.controller)) {
            this[name].controller[fn_name] = module.controller[fn_name].bind(context);
        }

        // Go through each defined view function
        for (const fn_name of Object.keys(module.view)) {
            this[name].view[fn_name] = module.view[fn_name].bind(context);
        }

        if (module.hasOwnProperty('ready')) {
            this.add_ready_callback(
                module.ready.bind(context)
            );
        }

        if (module.hasOwnProperty('init')) {
            module.init();
        }
    },

    // Adds a function callback to a list of functions that should run when the document
    // has loaded and is ready, i.e. the '$(document).ready' event.
    add_ready_callback: function(callback) {
        if (!callback) {
            console.error(`Could not save invalid ready callback function: ${callback}`);
            return;
        }

        this.__ready_callbacks.push(callback);
    },

    // =====================================================================================================
    // PRIVATE FIELDS
    //
    // List of functions that should be called when the document has loaded and is ready
    __ready_callbacks: [],

    // =====================================================================================================
    // PRIVATE FUNCTIONS
    //
    // Executes each added ready callback function once the document is ready.
    // Adding functions to this list can either be done using the 'add_ready_callback()' function,
    // or by adding a function to the 'ready' key in a module.
    __run_ready_callback: function() {
        if (this.__ready_callbacks.length == 0) {
            console.log('Skipped execution of load callbacks - callback list is empty');
            return;
        }

        for (const callback of this.__ready_callbacks) {
            callback();
        }
    },
};

// Register a handler for the document ready event
$(document).ready(function() {
    window.tfd.__run_ready_callback();
});
