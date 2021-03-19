// =====================================================================================================
// Functions for creating modules
// =====================================================================================================
// Authors: Fredrik Engstrand, 2021
//          Dante Grenholm, 2021
//          Sebastian Grönlund, 2021
//          Hampus Sandqvist, 2021
//          Kevin Hormiz, 2021    
//
// To prevent large and unorganized files we created a module system 
// where each feature/functionality is a "module". Theses modules serve as both separation of concers 
// as well as enforcing a MVC approach. It also gives us a few helper functions that makes the managment of
// multiple modules easier.
//
// Some of the features that will be available to all modules is:
// - Custom signal handling using 'this.trigger'
// - A shared document ready event handler
// - An easy way to register views and subviews to render specific content based on navigation menu selection
// - Cached element lookups 
// - Functions registered by the module will be available using the 'window.tfd.<module>' namespace
// - Create global shared model data 
//
window.tfd = {
    // =====================================================================================================
    // PUBLIC FIELDS
    //
    // Contains model state that is shared between modules.
    // Modules can make use of this by specifying the 'global' key in their module, similiar to the regular model.
    global: {},

    // =====================================================================================================
    // PRIVATE FIELDS
    //
    // List of functions that should be called when the document has loaded and is ready
    __ready_callbacks: [],

    // Object containing all registered signals by modules and a list of all functions that
    // has been registered as callback for that signal.
    __signals: {},

    // Array containing all the registered module names
    __registered_modules: [],

    // Object containing all registered routes, i.e. views and subviews.
    __routes: {},

    // Private model
    // Contains helper variables for changing views
    __model: {
        current_view: null,
        current_subview: null,
        previous_view: null,
        previous_subview: null,
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

        if (this.hasOwnProperty(name)) {
            console.error(`Could not add module. Name collides with an internal key: ${name}`);
            return;
        }

        // Save the current context so that we can bind it to functions
        // inside the module context
        const self = this;

        // Save the module to the global namespace
        this[name] = {
            model: module.model,
            view: {},
            controller: {},
            signal: {},

            // Selectors for elements in the DOM to find and cache
            element: module.element,

            // Routes that can be "navigated" to
            route: window.tfd.__routes,

            // Helper function for triggering signals
            trigger: window.tfd.__trigger_signal.bind(self),

            // Alias to remove the need for the "window.tfd" prefix
            set_route: window.tfd.set_route.bind(self),

            // Shared model state
            global: window.tfd.global,
        };

        const context = this[name];

        if (module.hasOwnProperty('controller')) {
            // Go through each defined controller function
            for (const fn_name of Object.keys(module.controller)) {
                // Save the controller function to the global module namespace
                this[name].controller[fn_name] = module.controller[fn_name].bind(context);
            }
        }

        if (module.hasOwnProperty('view')) {
            // Go through each defined view function
            for (const fn_name of Object.keys(module.view)) {
                // Save the view function to the global module namespace
                this[name].view[fn_name] = module.view[fn_name].bind(context);
            }
        }

        // Check if module has registered a global model
        if (module.hasOwnProperty('global')) {
            // Assign the global model to the global model state,
            // overwriting any existing values.
            Object.assign(this.global, module.global);
        }

        // Check if the module has registered a document ready event handler
        if (module.hasOwnProperty('ready')) {
            this.add_ready_callback(
                // Make sure to bind the context so that 'this' works as expected.
                // Since events are handled using jQuery, the context will be overwritten
                module.ready.bind(context)
            );
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

        // Check if the module has registered any routes
        if (module.hasOwnProperty('route')) {
            for (const key of Object.keys(module.route)) {
                const route = module.route[key];

                // Add new route
                this.__routes[key] = {
                    path: key,
                    body_class: route.body_class,
                    has_subviews: !!route.subview,
                };

                // Parse any subviews of the route
                if (route.hasOwnProperty('subview')) {
                    for (const subkey of Object.keys(route.subview)) {
                        const subroute = route.subview[subkey];

                        // Check if the subview is the default view for the view
                        if (subroute.default) {
                            this.__routes[key]['default_subview'] = subkey;
                        }

                        // Save the subview in the list of all routes for fast lookups
                        this.__routes[subkey] = {
                            path: subkey,
                            parent_path: key,
                            body_class: subroute.body_class,
                            is_subview: true,
                        };
                    }
                }
            }
        }

        // Save the registered module name
        this.__registered_modules.push(name);

        // Check if the module has registered a module init event handler
        if (module.hasOwnProperty('init')) {
            // The init function should be called when the module is created, i.e. now
            module.init.bind(context)();
        }
    },

    // Adds a function callback to a list of functions that should run when the document
    // has loaded and is ready, i.e. the '$(document).ready' event.
    add_ready_callback: function(callback) {
        if (!callback) {
            console.error(`Could not save invalid ready callback function: ${callback}`);
            return;
        }

        // Save the callback
        this.__ready_callbacks.push(callback);
    },

    // "Navigates" to the selected route by applying the specified body class.
    // The actual view is rendered using CSS selectors. Each route is registered
    // from within the module using the "route" key. The format of a route can be seen in the
    // "add_module()" function.
    //
    // This function takes one argument which is the name of the registered route, i.e. the key
    // in the "route" object of the module. Modules can handle any route changes using the signal
    // with the same name as the key, prefixed with "route_".
    set_route: function(route) {
        if (!route) {
            console.error(`Could not set non-existing route: ${route}`);
            return;
        }

        // Every view needs at least a body class to be applied
        if (!route.hasOwnProperty('body_class')) {
            console.error(`Routes must define the 'body_class' property`);
            return;
        }

        // If the selected route is a subview
        if (route.is_subview) {
            // Update the current subview
            this.__model.previous_subview = this.__model.current_subview;
            this.__model.current_subview = route.body_class;

            const parent_body_class = this.__routes[route.parent_path].body_class;

            // Check if the current view is the parent of the subview.
            // If not, we must also update the current view to the parent.
            if (this.__model.current_view !== parent_body_class) {
                this.__model.previous_view = this.__model.current_view;
                this.__model.current_view = parent_body_class;
            }
        } else {
            this.__model.previous_view = this.__model.current_view;
            this.__model.current_view = route.body_class;

            // If we switch views, we must check if it has a default subview.
            // If so, we should set the current subview as well.
            if (route.default_subview) {
                this.__model.previous_subview = this.__model.current_subview;
                this.__model.current_subview = this.__routes[route.default_subview].body_class;
            }
        }

        // Trigger event so that other modules can handle the route change
        this.__trigger_signal(`route_${route.path}`);

        // Apply body classes
        this.__update_body_classes();
    },

    // =====================================================================================================
    // PRIVATE FUNCTIONS
    //
    // Finds and caches elements in the DOM based on the specified module selectors.
    // Each element can be accessed using the 'this.element.<element name>' namespace.
    __find_elements: function() {
        for (const name of this.__registered_modules) {
            const module = this[name];

            // Skip modules without the element key
            if (!module.element) {
                continue;
            }

            // Replace the value of each element key in the module
            // with the actual jQuery element lookup result.
            // This way, elements can be accessed using 'this.element.<name>'.
            for (const key of Object.keys(module.element)) {
                this[name].element[key] = $(this[name].element[key]);
            }
        }
    },

    // Executes each added ready callback function once the document is ready.
    // Adding functions to this list can either be done using the 'add_ready_callback()' function,
    // or by adding a function to the 'ready' key in a module.
    __run_ready_callback: function() {
        if (this.__ready_callbacks.length == 0) {
            console.log('Skipped execution of load callbacks - callback list is empty');
            return;
        }

        // Execute each ready callback
        for (const callback of this.__ready_callbacks) {
            callback();
        }
    },

    // Creates the event handler for each registered signal and executes all signal handlers
    __register_signal_handlers: function() {
        for (const key of Object.keys(this.__signals)) {
            // Create a callback for the signal
            $(document).on(key, function(_, ...args) {
                // Execute each signal callback
                for (const fn of window.tfd.__signals[key]) {
                    // Run the event handler with all (if any) arguments
                    // passed into it
                    fn(...args);
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
            return;
        }

        // Trigger the signal with the specified args as separate function parameters
        $(document).trigger(signal, [ ...args ]);
    },

    // Updates the current route by removing previous route body classes
    // and applying new ones.
    __update_body_classes: function() {
        // Remove the previous view class
        if (this.__model.previous_view) {
            $(document.body).removeClass(this.__model.previous_view);
        }

        // Remove the previous subview class
        if (this.__model.previous_subview) {
            $(document.body).removeClass(this.__model.previous_subview);
        }

        // Check if we have a subview for the currently selected view
        if (this.__model.current_subview) {
            // Batch classes together to prevent multiple layout rerenders
            $(document.body).addClass([
                this.__model.current_view,
                this.__model.current_subview,
            ]);
        } else {
            // The current view has no subview, add only view body class
            $(document.body).addClass(this.__model.current_view);
        }
    },
};

// Register a handler for the document ready event
$(document).ready(function() {
    // Find all specified elements based on the selectors in the 'selector' object of each module
    window.tfd.__find_elements();

    // Make sure to register signal handlers before executing the ready function callbacks.
    // This is because functions that run on ready might trigger signals themselves.
    window.tfd.__register_signal_handlers();
    window.tfd.__run_ready_callback();
});
