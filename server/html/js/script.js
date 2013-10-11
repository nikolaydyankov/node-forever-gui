function l(msg) {
    console.log(msg);
}

// Constants
var SCRIPT_STATUS_PLAYING = 1;
var SCRIPT_STATUS_PAUSED = 0;

// Vars
var scripts = [];
var service = new Service();
var shouldRespondToEvents = true;

// Classes
function Service () {
    this.serverURL = document.URL;
}
Service.prototype.fetchAllScripts = function(callback) {
    $.ajax({
        type : "POST",
        url : this.serverURL + 'fetch_all',
        success : function(data) {
            var scriptsArray = JSON.parse(data);
            var scriptsObjs = [];
            var len = scriptsArray.length;

            for (var i = 0; i < len; i++) {
                var id = scriptsArray[i].id;
                var script = new Script();

                script.id = id;
                script.name = scriptsArray[i].name;
                script.sysname = scriptsArray[i].sysname;
                script.status = (scriptsArray[i].status == 1) ? SCRIPT_STATUS_PLAYING : SCRIPT_STATUS_PAUSED;
                script.path = scriptsArray[i].path;
                script.logPath = scriptsArray[i].logPath;

                scriptsObjs.push(script);
            }

            callback(scriptsObjs);
        }
    });
};
Service.prototype.addScript = function(script, callback) {
    var plainScript = script.getPlainObject();

    $.ajax({
        type : "POST",
        url : service.serverURL + 'add_script',
        data : {
            "script" : plainScript
        },
        success : function(error) {
            callback(error);
        }
    });
}
Service.prototype.removeScript = function(script, callback) {
    // remove the script from db, script.id
    callback();
}
Service.prototype.startAllScripts = function(callback) {
    // Start all scripts that exist in the database
    $.ajax({
        type : "POST",
        url : this.serverURL + 'start_all',
        success : function() {
            callback();
        }
    });
};
Service.prototype.stopAllScripts = function(callback) {
    // Stop all scripts that exist in the database
    $.ajax({
        type : "POST",
        url : this.serverURL + 'stop_all',
        success : function() {
            callback();
        }
    });
};

function Script () {
    this.id = '';
    this.name = '';
    this.sysname = '';
    this.status = '';
    this.path = '';
    this.logPath = '';
}
Script.prototype.getPlainObject = function() {
    var script = {
        "id" : this.id,
        "name" : this.name,
        "sysname" : this.sysname,
        "status" : this.status,
        "path" : this.path,
        "logPath" : this.logPath
    };

    return script;
};
Script.prototype.saveScript = function(callback) {
    // Save...
    $.ajax({
        type : "POST",
        url : service.serverURL + 'update_script',
        data : {
            "script" : this.getPlainObject()
        },
        success : function() {
            callback();
        }
    });
};
Script.prototype.startScript = function(callback) {
    // Start...
    $.ajax({
        type : "POST",
        url : service.serverURL + 'start_script',
        data : {
            "script" : this.getPlainObject()
        },
        success : function() {
            callback();
        }
    });
};
Script.prototype.stopScript = function(callback) {
    // Stop...
    $.ajax({
        type : "POST",
        url : service.serverURL + 'stop_script',
        data : {
            "script" : this.getPlainObject()
        },
        success : function() {
            callback();
        }
    });
};
Script.prototype.startFetchingLog = function(callback, updatedLogCallback) {
    callback('Current log');

    setTimeout(function() {
        updatedLogCallback('\nLog update');
    }, 1000);
};
Script.prototype.finishFetchingLog = function() {

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
        $('#nfg-log-modal-close-button').on('click', function() {
            if (shouldRespondToEvents) {
                closeLogButtonClicked();
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
    // Tells Service to load scripts and calls functions to display the fetched scripts
    function refreshScripts(callback) {
        service.fetchAllScripts(function(fetchedScripts) {
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
        shouldRespondToEvents = true;
        $('#nfg-script-container').css('opacity', 1.0);
    }
    // Iterate over each script in the "scripts" global var and insert generated HTML in the table
    function displayScripts() {
        var scriptContainer = $('#nfg-script-container');
        scriptContainer.find('tbody').html('');

        var len = scripts.length;
        for (var i=0; i<len; i++) {
            var script = scripts[i];
            // Prepare the template object with the real data
            insertInScriptTemplateDataFromScript(script);

            // Generate actual HTML content to be inserted in the table
            var htmlContent = htmlContentForScript(script);

            // Insert the finished HTML code in the table
            scriptContainer.find('tbody').append(htmlContent);
        }
    }
    // Modify the template object with the data from the script (prepare for insertion in the table)
    function insertInScriptTemplateDataFromScript(script) {
        var templateContainer = $('#nfg-script-template');

        templateContainer.find('#nfg-script-template-col1').find('.nfg-editable-field-content').html(script.name);
        templateContainer.find('#nfg-script-template-col3').html(script.path);
        templateContainer.find('#nfg-script-template-col4').html(script.logPath);

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

        // Log button
        $('#nfg-display-log-button').off('click').on('click', function(e) {
            if (shouldRespondToEvents) {
                logButtonClicked($(e.target));
            }
        });
    }

    // Event handlers

    // Start/Stop functionality for individual scripts
    function startStopButtonClicked(button) {
        var scriptID = button.closest('tr').attr('id');

        indicateScriptTableLoading();

        if (scriptForID(scriptID).status == SCRIPT_STATUS_PLAYING) {
            scriptForID(scriptID).stopScript(function() {
                refreshScripts(function() {
                    indicateScriptTableNotLoading();
                });
            });
        } else {
            scriptForID(scriptID).startScript(function() {
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
            if (container.hasClass('nfg-editable-field-name')) {
                scriptForID(scriptID).name = newContent;
            }

            // Save script
            indicateScriptTableLoading();

            scriptForID(scriptID).saveScript(function(success) {
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

        if (scriptForID(scriptID).status == SCRIPT_STATUS_PLAYING) {
            modalBox.removeClass('nfg-remove-script-modal-state-not-running');
            modalBox.addClass('nfg-remove-script-modal-state-running');
        } else {
            modalBox.removeClass('nfg-remove-script-modal-state-running');
            modalBox.addClass('nfg-remove-script-modal-state-not-running');
        }
    }
    // Log Button
    function logButtonClicked(buttonEl) {
        var scriptID = buttonEl.closest('tr').attr('id');
        var logBody = $('#nfg-log-body');
        var modal = $('#nfg-log-modal').data('script-id', scriptID);

        scriptForID(scriptID).startFetchingLog(function(log) {
            logBody.html(log);
        }, function(logUpdate) {
            logBody.append(logUpdate);
        });
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

        service.startAllScripts(function() {
            refreshScripts(function() {
                indicateScriptTableNotLoading();
            });
        });
    }

    // Modal buttons
    function addScriptModalButtonClicked() {
        var scriptName = $('#nfg-add-script-modal-input-name').val();
        var scriptPath = $('#nfg-add-script-modal-input-path').val();

        var newScript = new Script();
        newScript.name = scriptName;
        newScript.path = scriptPath;
        newScript.status = SCRIPT_STATUS_PAUSED;

        indicateScriptTableLoading();

        service.addScript(newScript, function(error) {
            if (error) {
                alert(error);
            }

            refreshScripts(function() {
                indicateScriptTableNotLoading();
            });
        });
    }
    function removeScriptModalButtonClicked() {
        var modalBox = $('#nfg-remove-script-modal');
        var scriptID = modalBox.data('script-id');

        indicateScriptTableLoading();

        service.removeScript(scriptForID(scriptID), function() {
            refreshScripts(function() {
                indicateScriptTableNotLoading();
            });
        });
    }
    function removeAndStopModalButtonClicked() {
        var modalBox = $('#nfg-remove-script-modal');
        var scriptID = modalBox.data('script-id');

        indicateScriptTableLoading();

        scriptForID(scriptID).stopScript(function() {
            service.removeScript(scriptForID(scriptID), function() {
                refreshScripts(function() {
                    indicateScriptTableNotLoading();
                });
            });
        });
    }
    function stopAllButtonClicked() {
        indicateScriptTableLoading();

        service.stopAllScripts(function() {
            refreshScripts(function() {
                indicateScriptTableNotLoading();
            });
        });
    }
    function closeLogButtonClicked() {
        var scriptID = $('#nfg-log-modal').data('script-id');
        scriptForID(scriptID).finishFetchingLog();
    }

    // Utility
    function scriptForID(id) {
        var len = scripts.length;
        for (var i=0; i<len; i++) {
            if (scripts[i].id == id) {
                return scripts[i];
            }
        }
    };
})(jQuery);