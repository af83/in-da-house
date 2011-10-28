module("in da house");

jasmine.getFixtures().fixturesPath = 'test/fixtures';

test("basic setup with valid form and no option", function() {
  loadFixtures('minimum_valid_form.html');

  var container = $('.edit_in_da_house').in_da_house();
  var input = container.find('.editor.input');
  var submit = container.find('.editor.submit');
  var editable = container.find('.editable');

  equals( container.size(), 1, "we found one container" );
  ok(container.hasClass('bar_baz'), "attribute class is set on container");
  equals( input.size(), 1, "we found one input" );
  equals( submit.size(), 1, "we found one submit" );
  equals( editable.size(), 1, "we found one editable" );
  equals( editable.html(), $.in_da_house.defaults.defaultEditableText + 'bar_baz');
});
