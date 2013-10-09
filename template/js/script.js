// Constants
var SCRIPT_STATUS_PLAYING = 'playing';
var SCRIPT_STATUS_PAUSED = 'paused';

// Classes
var scripts = {};

function Script () {
    this.id = '';
    this.name = '';
    this.status = '';
    this.path = '';
}

//noinspection UnterminatedStatementJS
Script.prototype.saveScript = function() {
    // Save...
};

(function($, undefined) {
    $(document).ready(function() {
        console.log('asda');

        // Events
        $('.nfg-button-script-name-edit').on('click', function(e) {
            toggleEditableFieldState($(e.target));
        });
        $('.nfg-button-script-name-save').on('click', function(e) {
            toggleEditableFieldState($(e.target));
        });
    });

    // Event handlers
    function toggleEditableFieldState(buttonEl) {
        var scriptID = buttonEl.closest('tr').attr('id');
        var container = buttonEl.closest('.nfg-editable-field');

        // Get the width of the content that is being edited. The input box will use this width.
        var contentWidth = container.find('.nfg-editable-field-content').width();
        contentWidth = contentWidth + 20;

        // Switch state
        container.toggleClass('nfg-editable-field-edit-state');

        // If edit state is On, fill the input with the script name.
        // If edit state is Off, save the new name and start.
        if (container.hasClass('nfg-editable-field-edit-state')) {
            // Transfer the value from the content to the input field
            var currentValue = container.find('.nfg-editable-field-content').html();
            var inputElement = container.find('.nfg-editable-field-input-element');
            inputElement.val(currentValue);

            // Set input field width
            inputElement.css({ "width" : contentWidth });
        } else {
            // Get the new content from the input field and replace in content
            var newContent = container.find('.nfg-editable-field-input-element').val();
            container.find('.nfg-editable-field-content').html(newContent);

            // Save script
            scripts[scriptID].saveScript();
        }
    }
})(jQuery);