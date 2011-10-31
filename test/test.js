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

module('Methods');

function setupMethod(options, fixture){
    fixture = fixture || 'minimum_valid_form.html';
    loadFixtures(fixture);
    return $.in_da_house.houses[$('.edit_in_da_house').in_da_house(options).attr('class')];
}

test("initialize method", function() {
    var da_house = setupMethod();

    equals(da_house.el.get(0), $('.edit_in_da_house').get(0));
    ok(da_house._options);
    // TODO test remoteUpdate option setting
    ok(da_house._editor);
    ok(da_house._editable);
    // TODO test events and callbacks
});
test("updateEditableAndSwitch method", function() {
    var da_house = setupMethod();
    da_house._resource[da_house._attribute] = 2;

    da_house.switchEditor();
    da_house.updateEditableAndSwitch();

    equals(da_house._editable.attr('style'), 'display: inline;', "Editable elements should be visible");
    equals(da_house._editable.html(), '2', 'Editable inner HTML is updated');
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
    var da_house = setupMethod({ remoteUpdate: false });
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
test("setDefautSubmit method pending", function() {
    ok(true, "Test pending");
});
test("setDefaultEditable method pending", function() {
    ok(true, "Test pending");
});
test("setDefaultEditableText method pending", function() {
    ok(true, "Test pending");
});
test("getUrl method pending", function() {
    ok(true, "Test pending");
});
test("switchOnAndOff method pending", function() {
    ok(true, "Test pending");
});
test("switchEditor method pending", function() {
    ok(true, "Test pending");
});
test("getForm method pending", function() {
    ok(true, "Test pending");
});
test("ajaxDefaults method pending", function() {
    ok(true, "Test pending");
});

})();
