(function (window, document) {
   'use strict';

   // Maps the data type defined as attributes to the corresponding type used by the API
   var dataTypeMap = {
      event: 'events',
      speaker: 'users',
      talk: 'talks',
      'talk-comment': 'talk_comments'
   };

   // Defines the class the serves as a hook to select elements
   var joindInClass = '.joindin-embed';

   // Contains the callbacks to execute, one for each JoindIn embedded element defined in the page
   var callbacks = [];

   // Defines the base URL to call the JoindIn API
   var urlAPI = 'http://api.joind.in/v2.1/';

   // Defines the URL to show the rating image
   var ratingImageUrl = 'https://joind.in/inc/img/rating-RATING.gif';

   // Stores the createElement function to improve the effect of the minification
   var createElement = document.createElement.bind(document);

   /**
    * Sets the attributes of the passed HTMLElement to the given values.
    *
    * @param {HTMLElement} element
    * @param {Array} attributes
    * @param {Array} values
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
    * Sets the properties of the passed HTMLElement to the given values.
    *
    * @param {HTMLElement} element
    * @param {Array} properties
    * @param {Array} values
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
    * Appends the provided children to the specified HTMLElement.
    *
    * @param {HTMLElement} element
    * @param {HTMLElement[]} children
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
    * Calculates the average of the values provided.
    *
    * @param {number[]} values
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
    * Creates an img element representing the rate of a given element.
    *
    * @param {number} rate
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
    * Creates a definition list element based on the key-value pairs provided.
    *
    * @param {Object} map
    *
    * @returns {HTMLElement}
    */
   function createDefinitionListElement(map) {
      var definitionTerm, definitionDescription;
      var definitionList = createElement('dl');

      for(var term in map) {
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
    * Creates the elements for an event based on the provided data and
    * append them to the passed element.
    *
    * @param {HTMLElement} element
    * @param {Object} data
    */
   function createEvent(element, data) {
      var event, icon, name, nameWrapper, website, dateStart, dateEnd, description, additionalInfo;
      var iconPath = 'https://joind.in/inc/img/event_icons/';

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
    * @param {HTMLElement} element
    * @param {Object} data
    */
   function createSpeaker(element, data) {
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
    * @param {HTMLElement} element
    * @param {Object} data
    */
   function createTalkComment(element, data) {
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
    * @param {HTMLElement} element
    * @param {Object} data
    */
   function createTalk(element, data) {
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
    * Adds a new callback to the queue for the element provided.
    *
    * @param {HTMLElement} element
    */
   function createCallback(element) {
      // Use getAttribute() instead of the Dataset API to support IE 9-10
      var type = dataTypeMap[element.getAttribute('data-type')];
      var id = element.getAttribute('data-id');
      var url = urlAPI;

      if (type === 'events') {
         url += type + '/' + id;
         callbacks.push(createEvent.bind(null, element));
      } else if (type === 'talk_comments') {
         url += type + '/' + id;
         callbacks.push(createTalkComment.bind(null, element));
      } else if (type === 'talks') {
         url += type + '/' + id;
         callbacks.push(createTalk.bind(null, element));
      } else if (type === 'users') {
         url += type + '/' + id + '/talks';
         callbacks.push(createSpeaker.bind(null, element));
      } else {
         throw new Error('Data type not recognized');
      }

      var script = createElement('script');

      script.src = url + '?format=json&callback=JoindIn.callbacks[' + (callbacks.length - 1) + ']';
      document.head.appendChild(script);
      document.head.removeChild(script);
   }

   // Adds a callback for every embedded element
   [].forEach.call(
      document.querySelectorAll(joindInClass),
      createCallback
   );

   // Exposes the callbacks outside the IIFE
   window.JoindIn = {
      callbacks: callbacks
   };
})(window, document);