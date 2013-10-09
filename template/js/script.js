// Constants
var SCRIPT_STATUS_PLAYING = 'playing';
var SCRIPT_STATUS_PAUSED = 'paused';

// Classes
var scripts = {};
var communicator = new APICommunicator();

function APICommunicator () {
    this.serverURL = document.URL;
}

APICommunicator.prototype.fetchAllScripts = function(callback) {
    console.log('Fetching scripts from server');

    // TEST DATA
    var script1 = new Script();
    script1.id = 'script-54534';
    script1.name = 'My script 1';
    script1.status = SCRIPT_STATUS_PLAYING;
    script1.path = 'path/to/my/script.js';

    var script2 = new Script();
    script2.id = 'script-3421423';
    script2.name = 'My script 2';
    script2.status = SCRIPT_STATUS_PAUSED;
    script2.path = 'path/to/my/other/script.js';

    var script1ID = script1.id;
    var script2ID = script2.id;

    var fetchedScripts = {
        script1ID : script1,
        script2ID : script2
    }

    // (END) TEST DATA

    callback(fetchedScripts);
}

function Script () {
    this.id = '';
    this.name = '';
    this.status = '';
    this.path = '';
}

Script.prototype.saveScript = function() {
    console.log('Saving scripts to server');
    // Save...
};

(function($, undefined) {
    $(document).ready(function() {
        init();

        // Events
        $('.nfg-button-script-name-edit').on('click', function(e) {
            toggleEditableFieldState($(e.target));
        });
        $('.nfg-button-script-name-save').on('click', function(e) {
            toggleEditableFieldState($(e.target));
        });
    });

    function init() {
        communicator.fetchAllScripts(function(fetchedScripts) {
            scripts = fetchedScripts;
            displayScripts();
        });
    }
    function displayScripts() {
        for (var key in scripts) {
            var script = scripts[key];

            // Prepare the template object with the real data
            insertInScriptTemplateDataFromScript(scripts[key]);

            // Generate actual HTML content to be inserted in the table
            var htmlContent = htmlContentForScript(scripts[key]);

            // Insert the finished HTML code in the table
            $('#nfg-script-container').find('tbody').append(htmlContent);
        }
    }
    function insertInScriptTemplateDataFromScript(script) {
        var templateContainer = $('#nfg-script-template');

        templateContainer.find('#nfg-script-template-col1').find('.nfg-editable-field-content').html(script.name);
        templateContainer.find('#nfg-script-template-col3').find('.nfg-editable-field-content').html(script.path);

        if (script.status == SCRIPT_STATUS_PLAYING) {
            templateContainer.find('#nfg-script-template-col2').find('button').removeClass('btn-default');
            templateContainer.find('#nfg-script-template-col2').find('.glyphicon').removeClass('glyphicon-pause');

            templateContainer.find('#nfg-script-template-col2').find('button').addClass('btn-success');
            templateContainer.find('#nfg-script-template-col2').find('.glyphicon').addClass('glyphicon-play');
        } else {
            templateContainer.find('#nfg-script-template-col2').find('button').removeClass('btn-success');
            templateContainer.find('#nfg-script-template-col2').find('.glyphicon').removeClass('glyphicon-play');

            templateContainer.find('#nfg-script-template-col2').find('button').addClass('btn-default');
            templateContainer.find('#nfg-script-template-col2').find('.glyphicon').addClass('glyphicon-pause');
        }
    }
    function htmlContentForScript(script) {
        var content = '';

        content += '<tr id="' + script.id + '">';

        content += '<td>' + $('#nfg-script-template-col1').html() + '</td>';
        content += '<td>' + $('#nfg-script-template-col2').html() + '</td>';
        content += '<td>' + $('#nfg-script-template-col3').html() + '</td>';
        content += '<td>' + $('#nfg-script-template-col4').html() + '</td>';
        content += '<td>' + $('#nfg-script-template-col5').html() + '</td>';

        content += '</tr>';

        return content;
    }

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