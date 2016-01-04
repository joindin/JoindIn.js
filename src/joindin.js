(function(root, factory) {
   'use strict';

   if (typeof define === 'function' && define.amd) {
      define(factory);
   } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
   } else {
      root.JoindIn = factory();
   }
}(this, function() {
   /**
    * @typedef DataHash
    * @type {Object}
    * @property {string} type The type of the widget
    * @property {(number|string)} [id] The ID of the widget
    * @property {string} [theme] The theme to use
    */
   'use strict';

   /**
    * The callback called in case of success or failure of the HTTP request
    *
    * @callback requestCallback
    *
    * @param {XMLHttpRequest} xhr
    */

   /**
    * The callback called after the creation of the widget
    *
    * @callback userCallback
    *
    * @param {HTMLElement} element
    */

   // Maps the data type defined as attributes to the corresponding type used by the API
   var dataTypeMap = {
      cfps: 'cfps',
      event: 'events',
      speaker: 'users',
      talk: 'talks',
      'talk-comment': 'talk_comments'
   };

   // Defines the class the serves as a hook to select elements
   var joindInClass = '.joindin-embed';

   // Defines the base URL to call the JoindIn API
   var urlAPI = 'http://api.joind.in/v2.1/';

   // Defines the URL to show the rating image
   var ratingImageUrl = 'https://joind.in/inc/img/rating-RATING.gif';

   // Defines the base URL for the icons of the events
   var iconPath = 'https://joind.in/inc/img/event_icons/';

   // Stores the createElement function to improve the effect of the minification
   var createElement = document.createElement.bind(document);

   /**
    * Sets the attributes of the passed element to the given values
    *
    * @param {HTMLElement} element The element in which the attributes will be set
    * @param {string[]} attributes The attributes to set
    * @param {string[]} values The values of the attributes to set
    *
    * @returns {HTMLElement}
    */
   function setAttributes(element, attributes, values) {
      for(var i = 0; i < attributes.length; i++) {
         element.setAttribute(attributes[i], values[i]);
      }

      return element;
   }

   /**
    * Sets the properties of the passed element to the given values
    *
    * @param {HTMLElement} element The element in which the properties will be set
    * @param {string[]} properties The properties to set
    * @param {string[]} values The values of the properties to set
    *
    * @returns {HTMLElement}
    */
   function setProperties(element, properties, values) {
      for(var i = 0; i < properties.length; i++) {
         element[properties[i]] = values[i];
      }

      return element;
   }

   /**
    * Appends the provided children to the specified element
    *
    * @param {HTMLElement} element The element used as the parent
    * @param {HTMLElement[]} children The elements to append
    *
    * @returns {HTMLElement}
    */
   function appendChildren(element, children) {
      for(var i = 0; i < children.length; i++) {
         element.appendChild(children[i]);
      }

      return element;
   }

   /**
    * Calculates the average of the values provided
    *
    * @param {number[]} values The values to use to calculate the average
    *
    * @returns {number}
    */
   function average(values) {
      var average = 0;

      if (values.length === 0) {
         return average;
      }

      for(var i = 0; i < values.length; i++) {
         average += values[i];
      }

      return Math.round(average / values.length);
   }

   /**
    * Performs a GET request on the specified URL
    *
    * @param {string} url The URL to reach
    * @param {requestCallback} [callback] A callback to execute on success or failure
    */
   function get(url, callback) {
      if (!callback) {
         callback = function() {};
      }

      var xhr = new XMLHttpRequest();

      xhr.addEventListener('readystatechange', function() {
         if (xhr.readyState < 4) {
            return;
         }

         if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            callback(xhr);

            return;
         }

         callback(xhr);
      });

      xhr.open('GET', url, true);
      xhr.send();
   }

   /**
    * Creates an img element representing the rate of a given element
    *
    * @param {number} rate The rate of the element
    *
    * @returns {HTMLElement}
    */
   function createRateElement(rate) {
      return setProperties(
         createElement('img'),
         [
            'src',
            'alt'
         ],
         [
            ratingImageUrl.replace(/RATING/, rate),
            'Rate ' + rate + ' of 5'
         ]
      );
   }

   /**
    * Creates a definition list element based on the key-value pairs provided
    *
    * @param {Object} map The key-value pairs to use
    *
    * @returns {HTMLElement}
    */
   function createDefinitionListElement(map) {
      var definitionTerm, definitionDescription;
      var definitionList = createElement('dl');

      for(var term in map) {
         if (!map.hasOwnProperty(term)) {
            continue;
         }

         definitionTerm = setProperties(
            createElement('dt'),
            ['textContent'],
            [term + ': ']
         );

         definitionDescription = setProperties(
            createElement('dd'),
            ['textContent'],
            [map[term]]
         );

         appendChildren(
            definitionList,
            [
               definitionTerm,
               definitionDescription
            ]
         );
      }

      return definitionList;
   }

   /**
    * Injects into the element provided the information of the call
    * for paper for a given event
    *
    * @param {HTMLElement} element The element in which the CFP element will be created
    * @param {Object} data The data about the event
    */
   function createCFPElement(element, data) {
      var icon, iconWrapper, infoWrapper, name, nameWrapper, website;

      iconWrapper = createElement('div');
      iconWrapper.className = 'icon-wrapper';

      if (data.icon) {
         icon = setAttributes(
            createElement('img'),
            ['src'],
            [iconPath + data.icon]
         );

         iconWrapper.appendChild(icon);
      }

      infoWrapper = createElement('div');
      infoWrapper.className = 'info-wrapper';

      name = setProperties(
         createElement('h1'),
         ['textContent'],
         [data.name]
      );

      nameWrapper = setProperties(
         createElement('a'),
         [
            'href',
            'innerHTML'
         ],
         [
            data.website_uri,
            name.outerHTML
         ]
      );

      website = setProperties(
         createElement('a'),
         [
            'href',
            'textContent'
         ],
         [
            data.href,
            data.href
         ]
      );

      appendChildren(
         infoWrapper,
         [
            nameWrapper,
            website
         ]
      );

      appendChildren(
         element,
         [
            iconWrapper,
            infoWrapper
         ]
      );
   }

   /**
    * Creates the elements for the event having the call for papers currently open
    * based on the provided data and append them to the passed element
    *
    * @param {HTMLElement} element The element in which the widget will be created
    * @param {Object} data The data about the widget retrieved from the API
    */
   function createCFPsElement(element, data) {
      var list = createElement('ul');
      var cfps = data.events.map(function(conference) {
         var element = createElement('li');

         createCFPElement(element, conference);

         return element;
      });

      element.className += ' joindin-cfps';
      appendChildren(list, cfps);
      element.appendChild(list);
   }

   /**
    * Creates the elements for an event based on the provided data and
    * append them to the passed element
    *
    * @param {HTMLElement} element The element in which the widget will be created
    * @param {Object} data The data about the widget retrieved from the API
    */
   function createEventElement(element, data) {
      var event, icon, name, nameWrapper, website, dateStart, dateEnd, description, additionalInfo;

      event = data.events[0];

      if (event.icon) {
         icon = setAttributes(
            createElement('img'),
            ['src'],
            [iconPath + event.icon]
         );
      } else {
         icon = document.createTextNode('');
      }

      name = setProperties(
         createElement('h1'),
         ['textContent'],
         [event.name]
      );

      nameWrapper = setProperties(
         createElement('a'),
         [
            'href',
            'innerHTML'
         ],
         [
            event.website_uri,
            name.outerHTML
         ]
      );

      website = setProperties(
         createElement('a'),
         [
            'href',
            'textContent'
         ],
         [
            event.href,
            event.href
         ]
      );

      dateStart = setProperties(
         createElement('time'),
         ['textContent'],
         [new Date(event.start_date).toDateString()]
      );

      setAttributes(
         dateStart,
         ['datetime'],
         [event.start_date]
      );

      dateEnd = setProperties(
         createElement('time'),
         ['textContent'],
         [new Date(event.end_date).toDateString()]
      );

      setAttributes(
         dateEnd,
         ['datetime'],
         [event.end_date]
      );

      description = setProperties(
         createElement('p'),
         ['textContent'],
         [event.description]
      );

      additionalInfo = createDefinitionListElement({
         Attendees: event.attendee_count,
         Tracks: event.tracks_count,
         Talks: event.talks_count
      });

      element.className += ' joindin-event';
      appendChildren(
         element,
         [
            icon,
            nameWrapper,
            website,
            dateStart,
            document.createTextNode(' - '),
            dateEnd,
            description,
            document.createTextNode('Other info about the event:'),
            additionalInfo
         ]
      );
   }

   /**
    * Creates the elements for a speaker based on the provided data and
    * append them to the passed element.
    *
    * @param {HTMLElement} element The element in which the widget will be created
    * @param {Object} data The data about the widget retrieved from the API
    */
   function createSpeakerElement(element, data) {
      var name, nameWrapper, rating, speaker, talks;
      var speakerUrl = 'http://joind.in/user/view/';

      if (data.talks.length === 0) {
         return;
      }

      speaker = data.talks[0].speakers[0];

      name = setProperties(
         createElement('h1'),
         ['textContent'],
         [speaker.speaker_name]
      );

      nameWrapper = setProperties(
         createElement('a'),
         [
            'href',
            'innerHTML'
         ],
         [
            speakerUrl + speaker.speaker_uri.slice(speaker.speaker_uri.lastIndexOf('/') + 1),
            name.outerHTML
         ]
      );

      rating = createRateElement(
         average(
            data.talks.map(function(element) {
               return element.average_rating;
            })
         )
      );

      talks = setProperties(
         createElement('span'),
         ['textContent'],
         ['(' + data.talks.length + ' talks)']
      );

      element.className += ' joindin-speaker';
      appendChildren(
         element,
         [
            nameWrapper,
            rating,
            talks
         ]
      );
   }

   /**
    * Creates the elements for a talk comment based on the provided data and
    * append them to the passed element.
    *
    * @param {HTMLElement} element The element in which the widget will be created
    * @param {Object} data The data about the widget retrieved from the API
    */
   function createTalkCommentElement(element, data) {
      var comment, blockquote, footer, ratingWrapper, text, textWrapper, user, date, rating;

      comment = data.comments[0];

      blockquote = setProperties(
         createElement('blockquote'),
         ['cite'],
         [comment.talk_uri]
      );

      setAttributes(
         blockquote,
         [
            'itemprop',
            'itemscope',
            'itemtype'
         ],
         [
            'review',
            '',
            'http://schema.org/Review'
         ]
      );

      textWrapper = setProperties(
         createElement('div'),
         ['className'],
         ['text-wrapper']
      );

      text = setAttributes(
         createElement('p'),
         ['itemprop'],
         ['description']
      );

      setProperties(
         text,
         ['textContent'],
         [comment.comment]
      );

      user = setAttributes(
         createElement('cite'),
         ['itemprop'],
         ['author']
      );

      setProperties(
         user,
         ['textContent'],
         [comment.user_display_name]
      );

      date = setAttributes(
         createElement('time'),
         [
            'datetime',
            'itemprop'
         ],
         [
            comment.created_date,
            'datePublished'
         ]
      );

      setProperties(
         date,
         ['textContent'],
         [new Date(comment.created_date).toLocaleString()]
      );

      rating = createRateElement(comment.rating);

      ratingWrapper = setProperties(
         createElement('div'),
         [
            'className',
            'innerHTML'
         ],
         [
            'rating-wrapper',
            rating.outerHTML
         ]
      );

      footer = appendChildren(
         createElement('footer'),
         [
            document.createTextNode('— '),
            user,
            document.createTextNode(' on '),
            date
         ]
      );

      appendChildren(
         textWrapper,
         [
            text,
            footer
         ]
      );

      appendChildren(
         blockquote,
         [
            ratingWrapper,
            textWrapper
         ]
      );

      element.className += ' joindin-talk-comment';
      element.appendChild(blockquote);
   }

   /**
    * Creates the elements for a talk based on the provided data and
    * append them to the passed element.
    *
    * @param {HTMLElement} element The element in which the widget will be created
    * @param {Object} data The data about the widget retrieved from the API
    */
   function createTalkElement(element, data) {
      var talk, title, titleWrapper, description, author, rating;

      talk = data.talks[0];

      title = setProperties(
         createElement('h1'),
         ['textContent'],
         [talk.talk_title]
      );

      titleWrapper = setProperties(
         createElement('a'),
         [
            'href',
            'innerHTML'
         ],
         [
            talk.website_uri,
            title.outerHTML
         ]
      );

      description = setProperties(
         createElement('p'),
         ['textContent'],
         [talk.talk_description]
      );

      author = setProperties(
         createElement('span'),
         ['textContent'],
         [
            talk.speakers.map(function(element) {
               return element.speaker_name;
            }).join(' , ')
         ]
      );

      rating = createRateElement(talk.average_rating);

      element.className += ' joindin-talk';
      appendChildren(
         element,
         [
            titleWrapper,
            author,
            rating,
            description
         ]
      );
   }

   /**
    * Creates a new element that contains the information shown by a widget
    *
    * @param {DataHash} data The data of the widget
    *
    * @returns {HTMLElement}
    */
   function createWidgetElement(data) {
      return setAttributes(
         createElement('div'),
         [
            'className',
            'data-id',
            'data-type',
            'data-theme'
         ],
         [
            'joindin-embed joindin-' + data.type,
            data.id,
            data.type,
            data.theme
         ]
      );
   }

   /**
    * Retrieves the information of the widget and inject them into the provided element
    *
    * @param {HTMLElement} element The element in which the widget will be created
    * @param {DataHash} data The data of the widget to create
    * @param {userCallback} [callback] The callback executed when the widget is created
    */
   function widget(element, data, callback) {
      var url = urlAPI;
      var createWidgetFunction;

      if (data.type === 'cfps') {
         url += 'events?filter=cfp';
         createWidgetFunction = createCFPsElement;
      } else if (data.type === 'events') {
         url += data.type + '/' + data.id;
         createWidgetFunction = createEventElement;
      } else if (data.type === 'talk_comments') {
         url += data.type + '/' + data.id;
         createWidgetFunction = createTalkCommentElement;
      } else if (data.type === 'talks') {
         url += data.type + '/' + data.id;
         createWidgetFunction = createTalkElement;
      } else if (data.type === 'users') {
         url += data.type + '/' + data.id + '/talks';
         createWidgetFunction = createSpeakerElement;
      } else {
         throw new Error('Data type not recognized');
      }

      get(url + '?format=json', function(xhr) {
         if (!callback) {
            callback = function() {};
         }

         createWidgetFunction(element, JSON.parse(xhr.response));
         callback(element);
      });
   }

   /**
    * Creates a widget based on the data provided
    *
    * @param {DataHash} data The data of the widget to create
    * @param {userCallback} [callback] The callback executed when the widget is created
    */
   function createWidget(data, callback) {
      var widgetElement = createWidgetElement(data);

      data.type = dataTypeMap[data.type];
      widget(widgetElement, data, callback);
   }

   /**
    * Searches for elements of the page to turn into their relevant widget
    */
   function init() {
      [].forEach.call(
         document.querySelectorAll(joindInClass),
         function(element) {
            // Use getAttribute() instead of the Dataset API to support IE 9-10
            widget(
               element,
               {
                  id: element.getAttribute('data-id'),
                  type: dataTypeMap[element.getAttribute('data-type')]
               }
            );
         }
      );
   }

   return {
      createWidget: createWidget,
      init: init
   };
}));