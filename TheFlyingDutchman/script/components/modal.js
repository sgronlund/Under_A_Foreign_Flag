// Finds a modal by id and returns it.
// If no modal is found, an error is printed to the console and it returns null.
function get_modal(id) {
    const modal = $(`#${id}`);

    if (!modal.length) {
        console.error(`Could not find modal with id: ${id}`);
        return null;
    }

    return modal;
}

// Shows or hides a modal based on id
function show_modal(id) {
    const modal = get_modal(id);

    if (!modal) {
        return;
    }

    modal.addClass('show');
}

function hide_modal(id) {
    const modal = get_modal(id);

    if (!modal) {
        return;
    }


    modal.removeClass('show');
}

// Applies an error class to a modal by id.
// Can be used to show or style elements within based
// on the error status, e.g. invalid login attempts.
function show_modal_error(id) {
    const modal = get_modal(id);

    if (!modal) {
        return;
    }

    modal.addClass('error');
}

function hide_modal_error(id) {
    const modal = get_modal(id);

    if (!modal) {
        return;
    }

    modal.removeClass('error');
}

$(document).ready(function() {
    // Find all elements within a modal overlay that should hide
    // the overlay on click.
    $('.modal-event-hide').each(function() {
        // Find the closest parent modal root
        const modal_root = $(this).parents('.modal-root').first();

        // Skip if no parent modal root could be found
        if (!modal_root.length) {
            console.error(`Found element with 'modal-event-hide' class with no parent modal: ${$(this)}`);
            return;
        }

        if (!modal_root.attr('id')) {
            console.error(`Modal root is missing the id attribute: ${modal_root}`);
            return;
        }

        // Add click handler to element that hides the modal
        $(this).bind('click', function() { hide_modal(modal_root.attr('id')) });
    });
});
