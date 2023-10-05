(function ($) {
  'use strict';

  $(function () {
    if (
      document.getElementById('cookie-alert') &&
      window.Cookies &&
      Cookies.get('cookie-allowed') !== 'Y'
    ) {
      setTimeout(function () {
        document.getElementById('cookie-alert').classList.add('i-show');
      }, 200);

      var cookieAlertIntervalId = setInterval(function () {
        document
          .getElementById('cookie-alert')
          .classList.add('animate__animated', 'animate__shakeX');
        setTimeout(function () {
          document
            .getElementById('cookie-alert')
            .classList.remove('animate__shakeX');
        }, 1000);
      }, 4000);

      //click button
      document
        .querySelector('#cookie-alert .btn')
        .addEventListener('click', function (e) {
          e.preventDefault();
          //set cookie
          Cookies.set('cookie-allowed', 'Y', {
            expires: 183,
            domain: window.location.hostname,
          });
          //hide alert
          document.getElementById('cookie-alert').classList.add('i-hide');
          //remove alert from the page
          setTimeout(function () {
            document.getElementById('cookie-alert').remove();
          }, 500);
          //clear interval
          clearInterval(cookieAlertIntervalId);
        });
    }
  });
})(jQuery);
