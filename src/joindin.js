/* jshint browser: true */
/* exported JoindIn */
var JoindIn = (function (document) {
   'use strict';

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

   // Defines the function to create the element for a talk comment
   function createTalkComment(data, element) {
      data = data.comments[0];

      var wrapper = createElement('blockquote');
      wrapper.cite = data.talk_uri;
      wrapper.setAttribute('itemprop', 'review');
      wrapper.setAttribute('itemscope', '');
      wrapper.setAttribute('itemtype', 'http://schema.org/Review');
      wrapper.style.padding = '10px';
      wrapper.style.background = '#fff';
      wrapper.style.borderRadius = '5px';
      wrapper.style.border = '1px solid #ddd';

      var ratingWrapper = createElement('div');
      var rating = createElement('img');
      rating.src = ratingImageUrl.replace(/RATING/, data.rating);
      rating.alt = 'Rate ' + data.rating + ' of 5';
      ratingWrapper.style.width = '140px';
      ratingWrapper.style.float = 'left';
      ratingWrapper.appendChild(rating);

      var textWrapper = createElement('div');
      textWrapper.style.width = 'auto';
      textWrapper.style.overflow = 'hidden';
      var text = createElement('p');
      text.setAttribute('itemprop', 'description');
      text.textContent = data.comment;
      text.style.marginTop = '0';
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

      var clearer = createElement('div');
      clearer.style.clear = 'both';

      wrapper.appendChild(ratingWrapper);
      wrapper.appendChild(textWrapper);
      wrapper.appendChild(clearer);

      element.appendChild(wrapper);
   }

   // Defines the function to create the element for a talk
   function createTalk(data, element) {
      data = data.talks[0];

      var wrapper = createElement('div');
      wrapper.style.border = '1px solid #d7dcdf';
      wrapper.style.background = '#f0f4f8';
      wrapper.style.borderRadius = '6px';
      wrapper.style.padding = '10px 15px';
      wrapper.style.marginBottom = '10px';

      var titleWrapper = createElement('a');
      titleWrapper.href = data.website_uri;
      titleWrapper.style.color = '#2368af';
      var title = createElement('h1');
      title.textContent = data.talk_title;
      title.style.marginTop = '0';
      title.style.marginBottom = '5px';
      titleWrapper.appendChild(title);

      var description = createElement('p');
      description.textContent = data.talk_description;

      var author = createElement('span');
      author.textContent = data.speakers.map(function(element) {
         return element.speaker_name;
      }).join(' , ');

      var rating = createElement('img');
      rating.src = ratingImageUrl.replace(/RATING/, data.average_rating);
      rating.style.display = 'block';
      rating.style.marginTop = '10px';

      wrapper.appendChild(titleWrapper);
      wrapper.appendChild(author);
      wrapper.appendChild(rating);
      wrapper.appendChild(description);

      element.appendChild(wrapper);
   }

   var elements = document.querySelectorAll(joindInClass);
   [].forEach.call(elements, function(element, index) {
      // Use getAttribute() instead of dataset to support IE9-10
      var type = element.getAttribute('data-type');
      var id = element.getAttribute('data-id');

      if (type === 'talk_comments') {
         callbacks[index] = function(data) {
            createTalkComment(data, element);
         };
      } else if (type === 'talks') {
         callbacks[index] = function(data) {
            createTalk(data, element);
         };
      } else {
         throw new Error('Data type not recognized');
      }

      var script = createElement('script');
      script.src = urlAPI + type + '/' + id + '?format=json&callback=JoindIn.callbacks[' + index + ']';
      document.head.appendChild(script);
      document.head.removeChild(script);
   });

   // Exposes the callbacks outside the IIFE
   return {
      callbacks: callbacks
   };
})(document);