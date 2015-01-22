/* jshint browser: true */
/* exported JoindIn */
var JoindIn = (function (document) {
   'use strict';

   // Maps the data type defined as attributes to the corresponding type used by the API
   var dataTypeMap = {
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

   // Defines the function to create the element for a speaker
   function createSpeaker(data, element) {
      var speakerUrl = 'http://joind.in/user/view/';
      if (data.talks.length === 0 ) {
         return;
      }

      element.className += ' joindin-speaker';

      var speaker = data.talks[0].speakers[0];
      var averageRate = 0;

      for (var i = 0; i < data.talks.length; i++) {
         averageRate += data.talks[i].average_rating;
      }
      averageRate = Math.round(averageRate / data.talks.length);

      var name = createElement('h1');
      name.textContent = speaker.speaker_name;

      var nameWrapper = createElement('a');
      nameWrapper.href = speakerUrl + speaker.speaker_uri.slice(speaker.speaker_uri.lastIndexOf('/') + 1);
      nameWrapper.appendChild(name);

      var rating = createElement('img');
      rating.src = ratingImageUrl.replace(/RATING/, averageRate);
      rating.alt = 'Rate ' + averageRate + ' of 5';

      var talks = createElement('span');
      talks.textContent = '(' + data.talks.length + ' talks)';

      element.appendChild(nameWrapper);
      element.appendChild(rating);
      element.appendChild(talks);
   }

   // Defines the function to create the element for a talk comment
   function createTalkComment(data, element) {
      data = data.comments[0];

      element.className += ' joindin-talk-comment';

      var blockquote = createElement('blockquote');
      blockquote.cite = data.talk_uri;
      blockquote.setAttribute('itemprop', 'review');
      blockquote.setAttribute('itemscope', '');
      blockquote.setAttribute('itemtype', 'http://schema.org/Review');

      var ratingWrapper = createElement('div');
      var rating = createElement('img');
      rating.src = ratingImageUrl.replace(/RATING/, data.rating);
      rating.alt = 'Rate ' + data.rating + ' of 5';
      ratingWrapper.className = 'rating-wrapper';
      ratingWrapper.appendChild(rating);

      var textWrapper = createElement('div');
      textWrapper.className = 'text-wrapper';
      var text = createElement('p');
      text.setAttribute('itemprop', 'description');
      text.textContent = data.comment;
      textWrapper.appendChild(text);

      var footer = createElement('footer');

      var user = createElement('cite');
      user.setAttribute('itemprop', 'author');
      user.textContent = data.user_display_name;

      var date = createElement('time');
      date.setAttribute('datetime', data.created_date);
      date.setAttribute('itemprop', 'datePublished');
      date.textContent = new Date(data.created_date).toLocaleString();

      footer.appendChild(document.createTextNode('— '));
      footer.appendChild(user);
      footer.appendChild(document.createTextNode(' on '));
      footer.appendChild(date);
      textWrapper.appendChild(footer);

      blockquote.appendChild(ratingWrapper);
      blockquote.appendChild(textWrapper);

      element.appendChild(blockquote);
   }

   // Defines the function to create the element for a talk
   function createTalk(data, element) {
      data = data.talks[0];

      element.className += ' joindin-talk';

      var titleWrapper = createElement('a');
      titleWrapper.href = data.website_uri;
      var title = createElement('h1');
      title.textContent = data.talk_title;
      titleWrapper.appendChild(title);

      var description = createElement('p');
      description.textContent = data.talk_description;

      var author = createElement('span');
      author.textContent = data.speakers.map(function(element) {
         return element.speaker_name;
      }).join(' , ');

      var rating = createElement('img');
      rating.src = ratingImageUrl.replace(/RATING/, data.average_rating);
      rating.alt = 'Rate ' + data.average_rating + ' of 5';

      element.appendChild(titleWrapper);
      element.appendChild(author);
      element.appendChild(rating);
      element.appendChild(description);
   }

   var elements = document.querySelectorAll(joindInClass);
   [].forEach.call(elements, function(element, index) {
      // Use getAttribute() instead of dataset API to support IE 9-10
      var type = dataTypeMap[element.getAttribute('data-type')];
      var id = element.getAttribute('data-id');
      var url = urlAPI;

      if (type === 'talk_comments') {
         url += type + '/' + id;
         callbacks[index] = function(data) {
            createTalkComment(data, element);
         };
      } else if (type === 'talks') {
         url += type + '/' + id;
         callbacks[index] = function(data) {
            createTalk(data, element);
         };
      } else if (type === 'users') {
         url += type + '/' + id + '/talks';
         callbacks[index] = function(data) {
            createSpeaker(data, element);
         };
      } else {
         throw new Error('Data type not recognized');
      }

      var script = createElement('script');
      script.src = url + '?format=json&callback=JoindIn.callbacks[' + index + ']';
      document.head.appendChild(script);
      document.head.removeChild(script);
   });

   // Exposes the callbacks outside the IIFE
   return {
      callbacks: callbacks
   };
})(document);