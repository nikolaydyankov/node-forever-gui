// Constants
var SCRIPT_STATUS_PLAYING = 'playing';
var SCRIPT_STATUS_PAUSED = 'paused';

// Vars
var scripts = {};
var communicator = new APICommunicator();
var shouldRespondToEvents = true;

// Classes
function APICommunicator () {
    this.serverURL = document.URL;
}
APICommunicator.prototype.fetchAllScripts = function(callback) {
    $.post(this.serverURL + 'command', {
        "cmd" : "list",
        "args" : ""
    }, function(data) {
        console.log(JSON.parse(data));
    });

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

    var fetchedScripts = {};

    fetchedScripts[script1.id] = script1;
    fetchedScripts[script2.id] = script2;

    // (END) TEST DATA

    callback(fetchedScripts);
};
APICommunicator.prototype.doesScriptExistWithPath = function(scriptPath, callback) {
    // fetch all scripts and check if a script with this path is already running
    callback(false);
};
APICommunicator.prototype.removeScript = function(script, callback) {
    // remove the script from db, script.id
    callback();
}
APICommunicator.prototype.startAllScripts = function(callback) {
    // Start all scripts that exist in the database
    callback();
};
APICommunicator.prototype.stopAllScripts = function(callback) {
    // Stop all scripts that exist in the database
    callback();
};

function Script () {
    this.id = '';
    this.name = '';
    this.status = '';
    this.path = '';
}
Script.prototype.saveScript = function(callback) {
    // Save...
    callback();
};
Script.prototype.startScript = function(callback) {
    // Start...
    callback();
};
Script.prototype.stopScript = function(callback) {
    // Stop...
    callback();
};

(function($, undefined) {
    $(document).ready(function() {
        init();

        // Main buttons
        $('#nfg-button-add-script').on('click', function() {
            if (shouldRespondToEvents) {
                addScriptButtonClicked();
            }
        });
        $('#nfg-button-refresh').on('click', function() {
            if (shouldRespondToEvents) {
                refreshButtonClicked();
            }
        });
        $('#nfg-button-start-all').on('click', function() {
            if (shouldRespondToEvents) {
                startAllButtonClicked();
            }
        });

        // Modal buttons
        $('#nfg-add-script-modal-add-script-button').on('click', function() {
            if (shouldRespondToEvents) {
                addScriptModalButtonClicked();
            }
        });
        $('#nfg-remove-script-modal-remove-script-button').on('click', function() {
            if (shouldRespondToEvents) {
                removeScriptModalButtonClicked();
            }
        });
        $('#nfg-remove-script-modal-stop-and-remove-script-button').on('click', function() {
            if (shouldRespondToEvents) {
                removeAndStopModalButtonClicked();
            }
        });
        $('#nfg-stop-all-scripts-modal-button').on('click', function() {
            if (shouldRespondToEvents) {
                stopAllButtonClicked();
            }
        });
    });

    // Launched on page load
    function init() {
        indicateScriptTableLoading();

        refreshScripts(function() {
            indicateScriptTableNotLoading();
        });
    }
    // Tells APICommunicator to load scripts and calls functions to display the fetched scripts
    function refreshScripts(callback) {
        communicator.fetchAllScripts(function(fetchedScripts) {
            scripts = fetchedScripts;
            displayScripts();
            addEventsForDynamicallyGeneratedContent();
            callback();
        });
    }
    // Table will fade and loading text/animation will appear. For now it will only become empty.
    function indicateScriptTableLoading() {
        shouldRespondToEvents = false;
        $('#nfg-script-container').css('opacity', 0.5);
    }
    // Table will fade and loading text/animation will appear. For now it will only become empty.
    function indicateScriptTableNotLoading() {
        setTimeout(function() {
            shouldRespondToEvents = true;
            $('#nfg-script-container').css('opacity', 1.0);
        }, 1000);
    }
    // Iterate over each script in the "scripts" global var and insert generated HTML in the table
    function displayScripts() {
        var scriptContainer = $('#nfg-script-container');
        scriptContainer.find('tbody').html('');

        for (var key in scripts) {
            var script = scripts[key];

            // Prepare the template object with the real data
            insertInScriptTemplateDataFromScript(scripts[key]);

            // Generate actual HTML content to be inserted in the table
            var htmlContent = htmlContentForScript(scripts[key]);

            // Insert the finished HTML code in the table
            scriptContainer.find('tbody').append(htmlContent);
        }
    }
    // Modify the template object with the data from the script (prepare for insertion in the table)
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
    // Takes the template object and generates a ready-to-insert HTML code
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
    // Adds events for the dynamically added buttons
    function addEventsForDynamicallyGeneratedContent() {
        // Start/Stop buttons
        $('.nfg-button-start-stop').off('click').on('click', function(e) {
            if (shouldRespondToEvents) {
                startStopButtonClicked($(e.target));
            }
        });

        // Edit buttons
        $('.nfg-button-script-name-edit').off('click').on('click', function(e) {
            if (shouldRespondToEvents) {
                toggleEditableFieldState($(e.target));
            }
        });
        $('.nfg-button-script-name-save').off('click').on('click', function(e) {
            if (shouldRespondToEvents) {
                toggleEditableFieldState($(e.target));
            }
        });

        // Trash Button
        $('.nfg-button-trash').off('click').on('click', function(e) {
            if (shouldRespondToEvents) {
                trashButtonClicked($(e.target));
            }
        });
    }

    // Event handlers

    // Start/Stop functionality for individual scripts
    function startStopButtonClicked(button) {
        var scriptID = button.closest('tr').attr('id');

        indicateScriptTableLoading();

        if (scripts[scriptID].status == SCRIPT_STATUS_PLAYING) {
            scripts[scriptID].stopScript(function() {
                refreshScripts(function() {
                    indicateScriptTableNotLoading();
                });
            });
        } else {
            scripts[scriptID].startScript(function() {
                refreshScripts(function() {
                    indicateScriptTableNotLoading();
                });
            });
        }
    }
    // Editing functionality for script name & script path
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

            // Find out what which property is being edited
            if (container.hasClass('nfg-editable-field-path')) {
                scripts[scriptID].path = newContent;
            }
            if (container.hasClass('nfg-editable-field-name')) {
                scripts[scriptID].name = newContent;
            }

            // Save script
            indicateScriptTableLoading();

            scripts[scriptID].saveScript(function() {
                refreshScripts(function() {
                    indicateScriptTableNotLoading();
                });
            });
        }
    }
    // Trash Button
    function trashButtonClicked(buttonEl) {
        var scriptID = buttonEl.closest('tr').attr('id');
        var modalBox = $('#nfg-remove-script-modal');

        // save the ID of the script that is being edited
        modalBox.data('script-id', scriptID);

        if (scripts[scriptID].status == SCRIPT_STATUS_PLAYING) {
            modalBox.removeClass('nfg-remove-script-modal-state-not-running');
            modalBox.addClass('nfg-remove-script-modal-state-running');
        } else {
            modalBox.removeClass('nfg-remove-script-modal-state-running');
            modalBox.addClass('nfg-remove-script-modal-state-not-running');
        }
    }
    // Main Buttons
    function addScriptButtonClicked() {

    }
    function refreshButtonClicked() {
        indicateScriptTableLoading();

        refreshScripts(function() {
            indicateScriptTableNotLoading();
        });
    }
    function startAllButtonClicked() {
        indicateScriptTableLoading();

        communicator.startAllScripts(function() {
            refreshScripts(function() {
                indicateScriptTableNotLoading();
            });
        });
    }
    function stopAllButtonClicked() {
        indicateScriptTableLoading();

        communicator.stopAllScripts(function() {
            refreshScripts(function() {
                indicateScriptTableNotLoading();
            });
        });
    }
    // Modal buttons
    function addScriptModalButtonClicked() {
        var scriptName = $('nfg-add-script-modal-input-name').val();
        var scriptPath = $('nfg-add-script-modal-input-path').val();

        communicator.doesScriptExistWithPath(scriptPath, function(scriptExists) {
            if (scriptExists) {
                alert('This script is already running! The scripts list will refresh.');

                indicateScriptTableLoading();

                refreshScripts(function() {
                    indicateScriptTableNotLoading()
                });
            } else {
                var newScript = new Script();
                newScript.name = scriptName;
                newScript.path = scriptPath;
                newScript.status = SCRIPT_STATUS_PAUSED;

                indicateScriptTableLoading();

                newScript.saveScript(function() {
                    refreshScripts(function() {
                        indicateScriptTableNotLoading();
                    });
                });
            }
        });
    }
    function removeScriptModalButtonClicked() {
        var modalBox = $('#nfg-remove-script-modal');
        var scriptID = modalBox.data('script-id');

        indicateScriptTableLoading();

        communicator.removeScript(scripts[scriptID], function() {
            refreshScripts(function() {
                indicateScriptTableNotLoading();
            });
        });
    }
    function removeAndStopModalButtonClicked() {
        var modalBox = $('#nfg-remove-script-modal');
        var scriptID = modalBox.data('script-id');

        indicateScriptTableLoading();

        scripts[scriptID].stopScript(function() {
            communicator.removeScript(scripts[scriptID], function() {
                refreshScripts(function() {
                    indicateScriptTableNotLoading();
                });
            });
        });
    }
})(jQuery);