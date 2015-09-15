# 0.4.0-pre #

* Added `grunt-compare-size` task to detect how much a change affects the size of the library
* Added a code of conduct and call out in README
* Updated `.jshintrc` to tweak the settings to check JavaScript code style 
* Updated `.jscsrc` to tweak the settings to check the JavaScript code quality

# 0.3.0 (30-05-2015) #

* [!] Moved the style to an external style sheet ([#1][])
* [!] Added the possibility to embed an **event** (`data-type="event"`)
* Added JSCS to improve the code style
* Added missing `grunt-contrib-watch` task
* Complete refactor of the code

[#1]: https://github.com/joindin/JoindIn.js/issues/1

# 0.2.0 (08-10-2014) #

* [!] Added the possibility to embed a **speaker** profile (`data-type="speaker"`)
* [!] Changed the allowed values for the `data-type` attribute. The currently supported ones are: `speaker`, `talk` (was `talks`), and `talk-comment` (was `talk_comments`)
* Removed unneeded `div` wrappers inside the placeholder elements

# 0.1.0 (03-08-2014) #

* First public release