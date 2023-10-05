(function ($) {
  'use strict';

  $(function () {
    $('#bx-panel-hider').bind('click', function () {
      var $headerPanel = $('.b-header-panel');
      $header.data('topBorder', $header.offset().top);
    });

    $('.b-events__menu-title').click(function () {
      $('.b-events__menu').slideToggle();
    });
  });
})(jQuery);
