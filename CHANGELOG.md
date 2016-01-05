# Changelog

# Next

* [!] Exposed the `createWidget()` method to create a supported widget ([#12][])
* [!] Switched from IDs to URLs. IDs are now deprecated. ([#13][])
* Calling `init()` multiple times don't create a widget multiple times ([#14][])
* Improved internal documentation

[#14]: https://github.com/joindin/JoindIn.js/issues/14
[#12]: https://github.com/joindin/JoindIn.js/issues/12
[#13]: https://github.com/joindin/JoindIn.js/issues/13

# 0.5.0 (03-01-2016)

* [!] The library is not executed on load anymore ([#11][])
* [!] Replaced JSONP with CORS ([#9][])
* [!] Rating image doesn't overlap the text anymore ([#8][])
* [!] Implemented the UMD pattern ([#6][])
* Updated dev dependencies
* Updated `Gruntfile.js` to split the default task in multiple, smaller tasks
* Updated `.jscsrc` to tweak the settings to check the JavaScript code style

[#11]: https://github.com/joindin/JoindIn.js/issues/11
[#9]: https://github.com/joindin/JoindIn.js/issues/9
[#8]: https://github.com/joindin/JoindIn.js/issues/8
[#6]: https://github.com/joindin/JoindIn.js/issues/6

# 0.4.0 (17-09-2015)

* [!] Added three themes to style the widgets: Grain, Picton, and Shark ([#5][])
* [!] Added the possibility to embed the currently open **call for papers** (`data-type="cfps"`) ([#4][])
* Added `grunt-compare-size` task to detect how much a change affects the size of the library
* Added a code of conduct and call out in README
* Updated `.jshintrc` to tweak the settings to check JavaScript code quality 
* Updated `.jscsrc` to tweak the settings to check the JavaScript code style
* Minor tweaks to the `joindin.css` file

[#5]: https://github.com/joindin/JoindIn.js/issues/5
[#4]: https://github.com/joindin/JoindIn.js/issues/4

# 0.3.0 (30-05-2015)

* [!] Moved the style to an external style sheet ([#1][])
* [!] Added the possibility to embed an **event** (`data-type="event"`)
* Added JSCS to improve the code style
* Added missing `grunt-contrib-watch` task
* Complete refactor of the code

[#1]: https://github.com/joindin/JoindIn.js/issues/1

# 0.2.0 (08-10-2014)

* [!] Added the possibility to embed a **speaker** profile (`data-type="speaker"`)
* [!] Changed the allowed values for the `data-type` attribute. The currently supported ones are: `speaker`, `talk`
(was `talks`), and `talk-comment` (was `talk_comments`)
* Removed unneeded `div` wrappers inside the placeholder elements

# 0.1.0 (03-08-2014)

* First public release