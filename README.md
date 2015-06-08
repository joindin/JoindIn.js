# JoindIn.js #

[JoindIn.js](https://github.com/AurelioDeRosa/JoindIn.js) is the official JavaScript library to embed [Joind.in](http://joind.in)
comments, talks, and more. The library is written in plain JavaScript, so it has no dependencies.

## Compatibility ##

JoindIn.js has been tested on the following browsers: Internet Explorer 9+, Chrome, Opera, Firefox, and Safari.

## Demo ##
A live demo is available [here](http://htmlpreview.github.io/?https://github.com/AurelioDeRosa/JoindIn.js/blob/master/demo/index.html).

## Elements supported ##

The library supports the following elements:

* Speaker (`data-type="speaker"`)
* Talk (`data-type="talk"`)
* Comment (`data-type="talk-comment"`)
* Event (`data-type="event"`)

More elements will be integrated soon.

## Installation ##

You can install JoindIn.js using [Bower](http://bower.io):

```shell
bower install joindin-js
```

Then, include the CSS file in your web page as shown below:

```html
<link rel="stylesheet" href="bower_components/joindin-js/dist/joindin.min.css" />
```

And also the JavaScript file:

```html
<script src="bower_components/joindin-js/dist/joindin.min.js" defer async></script>
```

**Note**: the `defer` (for Internet Explorer 9) and the `async` (for modern browsers) attributes aren't necessary but [can improve the performance of your website](https://www.igvita.com/2014/05/20/script-injected-async-scripts-considered-harmful/).

If you don't have or you don't want to use Bower, you can clone this repository running the command:

```shell
git clone https://github.com/AurelioDeRosa/JoindIn.js.git
```

and copy the files contained in the `dist` folder into your project.

The last option you have is to manually download the library.

## Usage ##

Once you have the CSS and the JavaScript file in place, you have to create one or more DOM elements for every element 
you want to embed: talk, comment, or any other of the [elements supported](#elements-supported). The DOM elements you
create must use the class `joindin-embed` and define two `data-*` attributes:

* `data-id`: the ID of the element you want to embed. To know how to retrieve the ID of an element read the
section [How to retrieve the ID of the element to embed](#how-to-retrieve-the-id-of-the-element-to-embed);
* `data-type`: [the type of the element](#elements-supported) to embed.

### Embedding a speaker ###

To embed [my profile](https://joind.in/user/view/25190), you have to add the following element to your page:

```html
<div class="joindin-embed" data-id="25190" data-type="speaker"></div>
```

### Embedding a talk ###

To embed my talk "[Modern front-end with the eyes of a PHP developer](https://joind.in/talk/view/10889)",
you have to add the following element to your page:

```html
<div class="joindin-embed" data-id="10889" data-type="talk"></div>
```

### Embedding a comment of a talk ###

To embed a specific comment published on the same talk, you have to add the following element instead:

```html
<div class="joindin-embed" data-id="44197" data-type="talk-comment"></div>
```

Note that in this case the ID refers to the comment, not the talk.

### Embedding an event ###

To embed the [jsDay 2015](https://joind.in/event/view/3094) event,
you have to add the following element to your page:

```html
<div class="joindin-embed" data-id="3094" data-type="event"></div>
```

### How to retrieve the ID of the element to embed ##

Retrieving the ID of the element you want to embed is a bit tricky.

The ID of a **speaker** can be found in the URL of the website. For example, the URL of my profile
is [https://joind.in/user/view/25190](https://joind.in/user/view/25190), so the ID is 25190.

The ID of a **talk** can be found in the URL of the website. For example, the URL of my talk
"[Modern front-end with the eyes of a PHP developer](https://joind.in/talk/view/10889)" is
[https://joind.in/talk/view/10889](https://joind.in/talk/view/10889), so the ID is 10889.

To retrieve the ID of a **comment** you have to look at the source code of the page. It's written as part of the class
name set to the element wrapping each comment. For example, you can find a class name like `comment-43964` where
43964 is the ID of the comment.

The ID of an **event** can be found in the URL of the website. For example, the URL of the jsDay 2015
is [https://joind.in/event/view/3094](https://joind.in/event/view/3094), so the ID is 3094.

## Contribute ##

I'd love the contribution of anyone who is keen to help. Report a bug, fix a issue, suggest a feature:
any contribution to improve the project is highly appreciated. If you're uncertain whether an addition should be
made, feel free to open up an issue so we can discuss it.

## License ##

JoindIn.js is dual licensed under [MIT](http://www.opensource.org/licenses/MIT) and
[GPL-3.0](http://opensource.org/licenses/GPL-3.0)

## Author ##

[Aurelio De Rosa](http://www.audero.it) ([@AurelioDeRosa](https://twitter.com/AurelioDeRosa))