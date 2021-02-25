window.tfd = {
    // =====================================================================================================
    // PUBLIC FIELDS
    //
    // Contains model state that is shared between modules
    global: {
        logged_in: false,
        user_details: null,
    },

    // =====================================================================================================
    // PUBLIC FUNCTIONS
    //
    // Creates a new module consisting of a model, view and controller.
    // The view, model and controller can be accessed globally from the
    // 'window.tfd.<module name>' namespace.
    //
    // To simplify the call and implementation of controller functions,
    // the specified model and view is automatically passed to the controller using the 'this' keyword.
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

        // Save the module to the global namespace
        this[name] = {
            model: module.model,
            view: {},
            controller: {},
            signal: {},

            // Helper function for triggering signals
            trigger: window.tfd.__trigger_signal,

            // Shared model state
            global: window.tfd.global,
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

        // Check if the module has registered a document ready event handler
        if (module.hasOwnProperty('ready')) {
            this.add_ready_callback(
                module.ready.bind(context)
            );
        }

        // Check if the module has registered a module init event handler
        if (module.hasOwnProperty('init')) {
            module.init();
        }

        // Check if the module has registered any custom signal handlers
        if (module.hasOwnProperty('signal')) {
            for (const key of Object.keys(module.signal)) {
                // Bind module context to signal handler
                const fn = module.signal[key].bind(context);

                if (!this.__signals.hasOwnProperty(key)) {
                    // If no previous handlers for the signal has been registered,
                    // create a new array with the handler function.
                    this.__signals[key] = [ fn ];
                } else {
                    this.__signals[key].push(fn);
                }
            }
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

    // Object containing all registered signals by modules and a list of all functions that
    // has been registered as callback for that signal.
    __signals: {},

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

    // Creates the event handler for each registered signal and executes all signal handlers
    __register_signal_handlers: function() {
        for (const key of Object.keys(this.__signals)) {
            // Create a callback for the signal
            $(document).on(key, function() {
                // Execute each signal callback
                for (const fn of window.tfd.__signals[key]) {
                    fn();
                }
            });
        }
    },

    // Triggers a custom signal on the document body.
    // These can be handled from a module by specifing a 'signal' key object
    // in the module with keys for each respective signal to handle.
    __trigger_signal: function(signal, ...args) {
        // Only trigger the event if the signal has registered handler(s)
        if (!window.tfd.__signals.hasOwnProperty(signal)) {
            console.error(`Could not trigger signal: ${signal} - No registered signal handlers`);
            return;
        }

        // Trigger the signal with the specified args as separate function parameters
        $(document).trigger(signal, [ ...args ]);
    },
};

// Register a handler for the document ready event
$(document).ready(function() {
    // Make sure to register signal handlers before executing the ready function callbacks.
    // This is because functions that run on ready might trigger signals themselves.
    window.tfd.__register_signal_handlers();
    window.tfd.__run_ready_callback();
});
