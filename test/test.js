(function(){

function inDaHouseCheckStructure(container, options){
  options = options || {};
  var validations = {
      container_size: 1,
      input_size: 1,
      submit_size: 1,
      editable_size: 1,
      editable_html: $.in_da_house.defaults.defaultEditableText + 'bar_baz'
  };
  var structure = {
      container: container,
      input: container.find('.editor.input'),
      submit: container.find('.editor.submit'),
      editable: container.find('.editable')
  };
  $.extend(validations, options);

  ok(container.hasClass('bar_baz'), "attribute class is set on container");
  equals( container.size(), validations.container_size, "we found one container" );
  equals( structure.input.size(), validations.input_size, "we found one input" );
  equals( structure.submit.size(), validations.submit_size, "we found one submit" );
  equals( structure.editable.size(), validations.editable_size, "we found one editable" );
  equals( structure.editable.html(), validations.editable_html, "Editable html is correct");

  return structure;
}

module('Basic setup');

jasmine.getFixtures().fixturesPath = 'test/fixtures';

test("basic setup with valid form and no option", function() {
  loadFixtures('minimum_valid_form.html');

  var container = $('.edit_in_da_house').in_da_house();
  inDaHouseCheckStructure(container);
});

test("basic setup with a form with already editor submit as a link in the container and no option", function() {
  loadFixtures('minimum_valid_form_with_link.html');

  var container = $('.edit_in_da_house').in_da_house();
  inDaHouseCheckStructure(container);
});

test("basic setup with a more complex html structure and options", function() {
  loadFixtures('complex_form.html');

  var container = $('.other_edit_in_da_house').in_da_house({ initialSwitch: 'editor' });
  var structure = inDaHouseCheckStructure(container, { editable_html: $('#complex_editable').html() });

  equals(structure.editable.attr('style'), 'display: none;', "Structure starts in editor mode as stated in initialize");
});

module('Features');

test("Setup with a more complex html structure and options, local update value and validate", function() {
  loadFixtures('complex_form.html');

  var container = $('.other_edit_in_da_house').in_da_house({ initialSwitch: 'editor', remoteUpdate: false });
  var structure = inDaHouseCheckStructure(container, { editable_html: $('#complex_editable').html() });

  structure.input.val('2');
  structure.submit.click();
  equals(structure.editable.attr('style'), 'display: block;', "Click on submit should show editable elements");
  equals(structure.editable.html(), '2', 'Editable inner HTML is updated');
});

// TODO test callback calls through the interface $('selector').in_da_house('callback');

module('Methods');

function setupMethod(options, fixture){
    fixture = fixture || 'minimum_valid_form.html';
    loadFixtures(fixture);
    $.in_da_house.houses = {};
    var container = $('.edit_in_da_house').in_da_house(options);
    return $.in_da_house.houses[container.attr('class')];
}

test("initialize method", function() {
    var da_house = setupMethod();

    equals(da_house.el.get(0), $('.edit_in_da_house').get(0));
    ok(da_house._options);
    // TODO test remoteUpdate option setting
    ok(da_house._editor.size() == 2, "Two elements found in the editor");
    ok(da_house._editable.size() == 1, "One element found in the editable");
    // TODO test events and callbacks
});
test("updateEditableAndSwitch method", function() {
    var da_house = setupMethod();
    da_house._resource[da_house._attribute] = 2;

    da_house.switchEditor();
    da_house.updateEditableAndSwitch();

    equals(da_house._editable.attr('style'), 'display: inline;', "Editable elements should be visible");
    equals(da_house._editable.html(), '2', 'Editable inner HTML is updated');

    var da_house_two = setupMethod({
        remoteUpdate: false,
        updateEditable: function(that){ that._editable.find('#editable_value').html(that.getValue()); }
    }, 'minimum_valid_form_with_editable.html');
    da_house_two._resource[da_house_two._attribute] = 2;

    da_house_two.switchEditor();
    da_house_two.updateEditableAndSwitch();

    equals(da_house_two._editable.attr('style'), 'display: block;', "Editable elements should be visible");
    equals(da_house_two._editable.children().size(), 2, 'Editable should have children and not only a value');
    equals(parseInt( $('#editable_value').html() ), da_house_two.getValue(), 'The value in the Editable value place holder is updated');
});
test("updateResource method", function() {
    var da_house = setupMethod({ remoteUpdate: false });
    ok(!da_house._resource[da_house._attribute], "input has no set value");
    da_house._input.val('2');
    da_house.updateResource();
    equals(da_house._resource[da_house._attribute], '2', "input has now value");
});
test("setResource method", function() {
    // value update is covered by "updateResource method" test. Nevertheless
    var da_house = setupMethod({ remoteUpdate: false });
    ok(!da_house._resource[da_house._attribute], "input has no set value");
    da_house.setResource({ bar_baz: '2'});
    equals(da_house._resource[da_house._attribute], '2', "input has now value");
    // TODO : test event triggering
});
test("remoteUpdate method pending", function() {
    ok(true, "Test pending");
});
test("localUpdate method pending", function() {
    // value update is covered by "updateResource method" and "setResource method" tests.
    // Will see later if there's anything specific to be done here.
    ok(true, "Test pending");
});
test("setAttribute method", function() {
    var da_house_one = setupMethod({ remoteUpdate: false });
    equals(da_house_one._attribute, 'bar_baz', "We found bar_baz as the attribute");
    ok(da_house_one.el.hasClass('bar_baz'), "bar_baz class was set on container");

    var da_house_two = setupMethod({ remoteUpdate: false }, 'minimum_valid_form_with_other_attribute.html');
    equals(da_house_two._attribute, 'other', "We found 'other' as the attribute");
    ok(da_house_two.el.hasClass('other'), "'other' class was set on container");

    var da_house_three = setupMethod({ remoteUpdate: false }, 'minimum_valid_form_with_data.html');
    equals(da_house_three._attribute, 'foo_bar_baz', "We found foo_bar_baz as the attribute");
    ok(da_house_three.el.hasClass('foo_bar_baz'), "foo_bar_baz class was set on container");
});
test("setEditable method", function() {
    var da_house_one = setupMethod({ remoteUpdate: false });
    equals(da_house_one._editable.html(), da_house_one.setDefaultEditableText(), "We found the right editable");

    var da_house_two = setupMethod({ remoteUpdate: false }, 'minimum_valid_form_with_editable.html');
    equals(da_house_two._editable.html(), $('#set_editable').html(), "We found the right editable");
});
test("setEditor method pending", function() {
    ok(true, "Test pending");
});
test("setDefautSubmit method", function() {
    loadFixtures('minimum_valid_form.html');
    ok($('.edit_in_da_house').find('.editor.submit').size() == 0, "No submit trigger should be found in basic HTML structure");

    $('.edit_in_da_house').in_da_house();
    ok($('.edit_in_da_house').find('.editor.submit').size() == 1, "Submit trigger should be created after calling edit_in_da_house() on container");
});
test("setDefaultEditable method", function() {
    // This is covered by the "setEditable method" test. Yet...
    loadFixtures('minimum_valid_form.html');
    ok($('.edit_in_da_house').find('.editable').size() == 0, "No editable element(s) should be found at this point");

    var da_house = setupMethod({ remoteUpdate: false });
    ok(da_house._editable.size() == 1, "We found editable element(s)");
    equals(da_house._editable.html(), da_house.setDefaultEditableText(), "We found the default editable inner HTML");
});
test("setDefaultEditableText method", function() {
    var da_house = setupMethod({ remoteUpdate: false });
    equals(da_house._editable.html(), $.in_da_house.defaults.defaultEditableText + 'bar_baz', "Default editable text found in editable");
});
test("getUrl method", function() {
    var da_house_one = setupMethod();
    equals(da_house_one.getUrl(), '/foo/bar/baz', "Remote update will be performed with hitting /foo/bar/baz");

    var da_house_two = setupMethod({ findUrl: function(that){ return '/another/version/of/foo/bar/baz'; } });
    equals(da_house_two.getUrl(), '/another/version/of/foo/bar/baz', "Remote update will be performed with hitting /another/version/of/foo/bar/baz");
});
test("switchOnAndOff method", function() {
    var da_house_one = setupMethod();
    equals(da_house_one._input.attr('style'), 'display: none;', "Structure displays editable at startup (default)");
    ok( !da_house_one._editable.attr('style'), "Structure displays editable at startup (default)");

    var da_house_two = setupMethod({ initialSwitch: 'editor' });
    ok( !da_house_two._input.attr('style'), "Structure displays editor at startup");
    equals(da_house_two._editable.attr('style'), 'display: none;', "Structure displays editor at startup");

    var da_house_three = setupMethod();
    da_house_three.switchOnAndOff('editor');
    equals(da_house_three._input.attr('style'), 'display: inline;', "Structure displays editor after method call");
    equals(da_house_three._editable.attr('style'), 'display: none;', "Structure displays editor after method call");

    var da_house_four = setupMethod({ initialSwitch: 'editor' });
    da_house_four.switchOnAndOff('editor');
    ok(!da_house_four._input.attr('style'), "Structure still displays editor after method call");
    equals(da_house_four._editable.attr('style'), 'display: none;', "Structure still displays editor after method call");
});
test("switchEditor method", function() {
    // Switch usage is covered by tests of "switchOnAndOff method"
    // Will see later if there's anything specific to be done here.
    ok(true, "Test pending");
});
test("getForm method", function() {
    var da_house = setupMethod();
    ok(!da_house._form, "No form is set yet");
    equals(da_house.getForm().get(0), $('#minimum_form').get(0), "Form is found");
    ok(da_house._form, "Form is set now");
});
test("ajaxParams method", function() {
    var da_house = setupMethod( {ajaxOptions: {type: 'get', requestHeader: ['doTHisWith', 'thisHeader']}} );
    var myAjaxParams = da_house.ajaxParams();

    equals(myAjaxParams.type, 'get', "We change the HTTP verb to get");
    equals(typeof myAjaxParams.beforeSend, 'function', "A callback to alter the request headers is set");
});

})();
