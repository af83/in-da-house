# In-Da-House

A JQuery plugin to implement a flexible "edit in place" mechanism


## Usage

It's a JQuery plugin, so... It needs JQuery. But nothing else.

### Browser

Include and invoke *in-da-house.js* in your app as usual.

So far, the basic expected HTML structure is a container, let's say a *div*, containing some sort of user input element (input, textarea, select).

```html
<div class="edit_in_da_house">
<input type="text" name="name">
</div>
```

Also, have a look at the HTML snippets in *test/fixtures*, to get a better glimpse of what the library expects and is capable of.

That's all, yet that's mandatory, in-da-house won't create the user input element.
Why ? Because most of the time the user input will come with additionnal classes, a value coming from a database, and would be much more handily rendered by a framework related templating system.

## API

A container, on which *in_da_house(options)* has already being called, can call *in_da_house('method')* again, with *method* being one of *$.in_da_house* prototype.
This will be more thoroughly specified later.

```javascript
$('.selector').in_da_house({that: 'option'}); // may have already been called by the library if the default class was set on the container
$('.selector').in_da_house('switchEditor'); // this will "manually" set the editor elements as visible, and the editable hidden
```

## Why?

Because I already had snippets dealing out with this feature before i looked at what already existed and i wanted to further the concept.
Because, despite what other libraries stated, i found them not enough flexible and easy to integrate with the use of framework.

## License

MIT License

Copyright (C) 2011 by af83
