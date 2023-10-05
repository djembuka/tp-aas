( function($) {

  'use strict';
  
  $( function() {
    
    document.querySelectorAll( '.b-gallery .swiper-container' ).forEach( function( elem ) {
      var autoplay = {
        delay: 1*elem.getAttribute( 'data-delay' ) || 3500,
        disableOnInteraction: false,
      };
      if ( elem.querySelectorAll( '.swiper-slide' ).length <= 1 ) {
        autoplay = false;
      }
      new Swiper( '.b-gallery .swiper-container', {
        loop: true,
        autoplay: autoplay,
        effect: 'fade',
        lazy: {
          loadPrevNext: true,
        },
      });
    });
    
    
  });

}( jQuery ));