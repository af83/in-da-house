/*
* Edit in da house
* Edit in place jquery plugin
* 
* Basic HTML structure to be provided is
*  - a container (div, section, whatever) with edit_in_da_house class
*  - a user input inside the container in the shape of a select, an input or a textarea
* More complex HTML structure should be easily contrived with the use of 
*  - editable class on the value display element(s)
*  - editor and input class on the user input element(s)
*  - editor and submit classes on the triggering (value submit) element(s)
*/

$(document).ready(function(){
    // if nothing special is done
    // triggers the mechanism for each container
    // with the default plugin class
    $('.edit_in_da_house').in_da_house();
    // if you need more, you can trigger the whole
    // thing the same way :
    // $('your selector, class or ids').in_da_house();
});

(function($){
    $.in_da_house = function (edit_in_da_house, options) {
        this.initialize(edit_in_da_house, options);
    };
    $.in_da_house.houses = {};
    $.in_da_house.defaults = {
        defaultEditableText: 'Please fill-in field ',
        initialSwitch: 'editable',
        remoteUpdate: true,
        ajaxOptions: {},
        updateResource: this.remoteUpdate,

        findUrl: function (that){
            return that.getForm().attr('action');
        },

        updateEditable: function (that){
            that._editable.html( that.getValue() );
        }
    };
    $.in_da_house.prototype = {
        // initialize and setup
        // Maybe too big, yet, everything that's in here
        // belongs here. AFAIAC.
        initialize: function (edit_in_da_house, options) {
            this.el = edit_in_da_house;
            this._resource = edit_in_da_house.data('edit-in-da-house') || {};
            this._initial_options = options || {};
            this._switch = {
                editable: 'editor',
                editor: 'editable'
            };
            this._options = $.extend({}, $.in_da_house.defaults, this._initial_options);
            // if remoteUpdate is set as false and no callback for the resource
            // update is given, set the default local update callback
            if(!this._options.remoteUpdate && !this._initial_options.updateResource){
                this._options.updateResource = this.localUpdate;
            }
            this._ajax_options = null;

            // Setup, find, display (or not) everything, 
            //~ this.setAttribute();
            this.setEditor();
            this.setEditable();
            this.switchOnAndOff();

            // Events and callbacks
            var self = this;
            this._editable.live('click', function(e) {
                e.preventDefault();
                self.switchOnAndOff('editor');
            });
            this._submit.live('click', function(e) {
                e.preventDefault();
                self.updateResource();
            });
            this._submit.live('resourceUpdated', function(e) {
                e.preventDefault();
                self.updateEditableAndSwitch();
            });
        },

        // Plain as plain. The value display is updated with what
        // serves as model in this plugin
        // Then the switch 'editable' is pressed
        updateEditableAndSwitch: function (){
            (this._options.updateEditable)(this);
            this.switchOnAndOff('editable');
        },
            
        // (sort of) Model sync with the set (default or conf')
        // callback
        updateResource: function (){
            (this._options.updateResource)(this);
        },

        // Value(s) of the (sort of) Model assignment here
        // Handy to always have it done here to make sure
        // the related event is triggered
        setResource: function (resource){
            $.extend(this._resource, resource);
            this._editor.trigger('resourceUpdated');
        },

        // Default callback for the ajax update
        // of the resource
        remoteUpdate: function (that){
            $.ajax( that.ajaxParams() );
        },

        // Default callback for the local-only 
        // of the resource
        // (no update of the resource on the server)
        localUpdate: function (that){
            var update = {};
            update[that._attribute] = that._input.val();
            that.setResource(update);
        },

        // Setup method
        // Finds the attribute name according to editor input name attribute
        // By design (good idea ?), only the name elements inside square brackets are
        // taken, if any
        // Otherwise, the name attribute is taken as such
        setAttribute: function (){
            var that = this;
            $.each(this._resource, function(k, v){ that._attribute = k; });            
            if(!this._attribute){
                this._attribute = this._input.attr('name').replace(/^(.*?)\[/, '').replace(/\]\[/g, '_').replace(/\]/, '')
            }
            this.el.addClass(this._attribute);
        },

        // Setup method
        // Finds the value display element as the one
        // in the container with the editable class
        // Creates it if there's none
        setEditable: function (){
            this._editable = this.el.find('.editable');
            if(!this._editable.get(0)){
                this.setDefaultEditable();
            }
        },

        // Setup method
        // Finds the value editor elements as the ones
        // in the container with both the editor and input classes
        // or both the editor and submit classes
        // Has to find an input somehow (does not create it)
        // Otherwise, creates the submit if none found
        setEditor: function (){
            this._input = this.el.find('.editor.input');
            this._submit = this.el.find('.editor.submit');

            var that = this;
            if(!this._input.get(0)){
                $.each(['input', 'select', 'textarea'], function(index, value){
                    if(!that._input.get(0)){
                        that._input = that.el.find(value);
                        that._input.attr('class', 'input editor');
                    }
                });
            }
            this.setAttribute();
            if(!this._submit.get(0)){
                this._submit = this.el.find('a');
                if(!this._submit.get(0)){
                    this.setDefautSubmit();
                }
                this._submit.addClass('editor submit');
            }

            if(!this._resource[this._attribute]){
                this._resource[this._attribute] = this._input.val() || '';
            }
            // Raise my finger if we don't find submit and input ?
            this._editor = this.el.find('.editor');
        },

        // Helper method
        // Creates a submit element for the editor elements set
        setDefautSubmit: function (){
            this.el.append('<a href="#" class="editor submit" style="display: none;">Ok</a>');
            this._submit = this.el.find('.editor.submit');
        },

        // Helper method
        // Creates a value display element with editable class
        setDefaultEditable: function (){
            this.el.append(
                '<span class="editable">' +
                this.setDefaultEditableText() +
                '</span>'
            );
            this._editable = this.el.find('.editable');
        },

        // Helper method
        // Gives away the editable text and knonw how to default
        setDefaultEditableText: function (){
            return this._resource[this._attribute] || (this._options.defaultEditableText + this._attribute);
        },

        // Remote update URL getter
        // Alternate calls can be contrived by specifying
        // a different findUrl callback in the options
        getUrl: function (){
            return (this._options.findUrl)(this);
        },

        // A switch.
        // Turns on and off one element when the other one
        // is pressed
        switchOnAndOff: function (pressed){
            if(!pressed){
                pressed = this._options.initialSwitch;
            }
            this['_' + pressed].show();
            this['_' + this._switch[pressed]].hide();
        },

        // Helper method
        // Switches on the editor, off the editable
        switchEditor: function (){
            this.switchOnAndOff('editor');
        },

        // Setup and Helper method
        // ensures to return the related form
        // if it exists
        getForm: function (){
            if(!this._form){
                this._form = this._submit.closest('form');
            }
            return this._form;
        },

        // Helper method
        // Really only to be more concise
        getValue: function (){
            return this._resource[this._attribute];
        },

        // Setup method
        // Deals with the ajax call options
        ajaxParams: function (){
            if(!this._ajax_options){
                var that = this;
                var ajax_defaults = {
                    url: that.getUrl(),
                    type: 'put',
                    data: that.getForm().serializeArray(),
                    dataType: 'json',
                    success: function(resource){ that.setResource(resource); }
                };
                this._ajax_options = $.extend(ajax_defaults, this._options.ajaxOptions);
                // Deal out the requestHeader option seperately to allow
                // a different option syntax for this option
                // Dunno if it's a good idea, it allows not to rewrite the
                // entire callback for only one value
                if(this._options.ajaxOptions.requestHeader){
                    this._ajax_options.beforeSend = function(xhr) {
                        xhr.setRequestHeader(
                            this._options.ajaxOptions.requestHeader[0],
                            this._options.ajaxOptions.requestHeader[1]
                        ); 
                    };
                }
            }

            return this._ajax_options;
        }
    };

    $.in_da_house.prototype.extend = $.fn.extend;

    $.fn.extend({
        in_da_house: function(options) {
            return this.each(function() {
                var house_class = $(this).attr('class');
                // Finds the right element with its classes set
                // in the instances pool
                var edit_in_da_house = $.in_da_house.houses[house_class];
                if(!edit_in_da_house){
                    // didn't find it, creates it
                    edit_in_da_house = new $.in_da_house($(this), options);
                    house_class = $(this).attr('class');
                    $.in_da_house.houses[house_class] = edit_in_da_house;
                }
                else if(typeof options == 'string'){
                    // if the instance was already created
                    // and a callback (as a string) is passed
                    // we call it
                    edit_in_da_house[options].call(edit_in_da_house);
                }
            });
        }
    });
})(jQuery);
