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

function setupMethod(){
    loadFixtures('minimum_valid_form.html');
    return $.in_da_house.houses[$('.edit_in_da_house').in_da_house().attr('class')];
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
test("updateEditableAndSwitch method pending", function() {
  ok(true, "Test pending");
});
test("updateResource method pending", function() {
  ok(true, "Test pending");
});
test("setResource method pending", function() {
  ok(true, "Test pending");
});
test("remoteUpdate method pending", function() {
  ok(true, "Test pending");
});
test("localUpdate method pending", function() {
  ok(true, "Test pending");
});
test("setAttribute pending", function() {
  ok(true, "Test pending");
});
test("setEditable method pending", function() {
  ok(true, "Test pending");
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
