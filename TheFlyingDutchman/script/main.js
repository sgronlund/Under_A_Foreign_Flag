window.tfd = {
    // =====================================================================================================
    // PUBLIC FIELDS
    //
    model: {},
    view: {},
    controller: {},

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

        if (this.model.hasOwnProperty(name)) {
            console.error(`You are trying to replace an existing model: ${name}`);
            return;
        }

        if (this.view.hasOwnProperty(name)) {
            console.error(`You are trying to replace an existing view handler: ${name}`);
            return;
        }

        if (this.controller.hasOwnProperty(name)) {
            console.error(`You are trying to replace an existing controller: ${name}`);
            return;
        }

        const { model, view, controller } = module;

        // Save the model and view in the global collections
        this.model[name] = model;

        // Create empty controller and view function collections.
        // These will be populated in the for-loops below.
        this.view[name] = {};
        this.controller[name] = {};

        // Create a context consisting of the view, model and controller.
        // This will be bound to the 'this' keyword in every function of the module.
        const context = {
            model: this.model[name],
            view: this.view[name],
            controller: this.controller[name],
        };

        // Go through each defined controller function
        for (const fn_name of Object.keys(controller)) {
            this.controller[name][fn_name] = controller[fn_name].bind(context);
        }

        // Go through each defined view function
        for (const fn_name of Object.keys(view)) {
            this.view[name][fn_name] = view[fn_name].bind(context);
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
