# JoindIn.js

[JoindIn.js](https://github.com/joindin/JoindIn.js) is the official JavaScript library to embed
[Joind.in](http://joind.in) comments, talks, and more.

## Welcome

Joind.in welcomes all contributors regardless of your ability or experience. We especially welcome you if you are new
to Open Source development and will provide a helping hand. To ensure that everyone understands what we expect from
our community, our projects have a [Contributor Code of Conduct](CODE_OF_CONDUCT.md) and by participating in the 
development of joind.in you agree to abide by its terms.

## Compatibility

JoindIn.js has been tested on the following browsers: Internet Explorer 9+, Chrome, Opera, Firefox, and Safari.

The library follows the [UMD (Universal Module Definition)](https://github.com/umdjs/umd) pattern to work
seamlessly with module systems such as AMD and CommonJS, and the browser.

## Demo

A live demo is available
[here](http://htmlpreview.github.io/?https://github.com/joindin/JoindIn.js/blob/master/demo/index.html).

## Installation

You can install JoindIn.js by using [npm](https://www.npmjs.com):

```
npm install joindin-js
```

Alternatively, you can install it via [Bower](http://bower.io):

```
bower install joindin-js
```

The last options you have to download the library are to clone the repository and copy the files contained in the 
`dist` folder into your project and to manually download the files.

## Usage

Once you have obtained the library, you have to include in your web pages one or more DOM elements for every element 
you want to embed: talk, comment, or any other of the [elements supported](#elements-supported). The DOM elements you
include must have the class `joindin-embed` and define at least two `data-*` attributes:

* `data-url`: the URL to use to fetch the data of the element to embed. This attribute is required for all the widgets.
* `data-type`: [the type of the element](#elements-supported) to embed. This attribute is required for all the widgets.
* `data-id`: the ID of the element you want to embed. This attribute isn't required for all the widgets (e.g. the 
call for papers widget). To know how to retrieve the ID of an element read the section
[How to retrieve the ID of the element to embed](#how-to-retrieve-the-id-of-the-element-to-embed).
**This attribute is deprecated as of version 0.6.0 and its support will be removed in an upcoming version. Please use 
`data-url` instead.**
* `data-theme`: specify the theme of the widget between [the themes available](#themes-available). This attribute is 
optional.

An example of element that meets these requirements is the following:

```html
<div class="joindin-embed" data-url="https://api.joind.in/v2.1/users/25190" data-type="speaker"></div>
```

These HTML elements can be obtained by visiting the [Joind.in](https://joind.in/) website. In each page of a supported
element, you'll find a section with the code to copy and paste in your website to embed it.

With the element(s) in place, you have to include the CSS file provided. It should be placed in the `head` of your web 
page. If you used Bower, you can include it as shown below:

```html
<head>
   <link rel="stylesheet" href="bower_components/joindin-js/dist/joindin.min.css" />
```

At this point, you have to include the JavaScript file.

If the library has been downloaded with Bower, you can include it as shown below:
                                    
```html
   <script src="bower_components/joindin-js/dist/joindin.min.js"></script>
</body>
```

For those that obtained the library via npm, how you include it depends on the module system in use, if any.

### Browserify

```js
var JoindIn = require('joindin-js');
// Call JoindIn methods
```

### RequireJS

```js
require(['joindin-js'], function(JoindIn) {
	// Call JoindIn methods
});
```

### No module system

```html
   <script src="node_modules/joindin-js/dist/joindin.min.js"></script>
   <script>
      // Call JoindIn methods
   </script>
</body>
```

## Methods

JoindIn.js provides the methods described in the following sections.

### `init()`

The `init()` method parses the DOM to find all the elements of the type described in the [Usage](#usage) section and 
transform them into the relevant widget.

### `createWidget(data[, callback])`

The `createWidget()` method allows you to create one or more widgets that you can further process before adding to 
the DOM. It creates a widget based on the data provided and it optionally accept a callback executed when the widget 
is created. The callback is passed the element containing the created widget. The data to pass are the same described
in the [Usage](#usage) section, expect that they don't need the `data-` prefix.

For example, to create a speaker widget with the default theme, containing my profile, and inside an element having as
its ID `target`, you have to write:

```js
JoindIn.createWidget(
   {
      url: 'https://api.joind.in/v2.1/users/25190',
      type: 'speaker'
   },
   function(widget) {
      // Do something with widget
   
      document.getElementById('target').appendChild(widget);
   }
);
```

## Elements supported

The library supports the following elements:

* Speaker (`data-type="speaker"`)
* Talk (`data-type="talk"`)
* Comment (`data-type="talk-comment"`)
* Event (`data-type="event"`)
* Call for papers (`data-type="cfps"`)

More elements will be integrated soon.

## Themes available

The library provides the following themes:

* Grain (`data-theme="grain"`)
* Picton (`data-theme="picton"`)
* Shark (`data-theme="shark"`)

To see them in action, take a look at the
[demo](http://htmlpreview.github.io/?https://github.com/joindin/JoindIn.js/blob/master/demo/index.html).

## License

JoindIn.js is dual licensed under [MIT](http://www.opensource.org/licenses/MIT) and
[GPL-3.0](http://opensource.org/licenses/GPL-3.0)

## Author

[Aurelio De Rosa](http://www.audero.it) ([@AurelioDeRosa](https://twitter.com/AurelioDeRosa))