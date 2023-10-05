( function($) {

  'use strict';
  
  $( function() {

    //scroll
    var spaceStep = $.animateNumber.numberStepFactories.separator( ' ' );
    window.addEventListener( 'scroll', function(e) {
      
      document.querySelectorAll( '.b-statistics b' ).forEach( function( elem, index ) {
        if ( elem.className.search( 'b-statistics--shown' ) !== -1 ) {
          return;
        }
        
        if ( $( elem ).offset().top <= window.scrollY + window.outerHeight - 150 ) {
          $( elem ).animateNumber({
            number: elem.getAttribute( 'data-num' ),
            numberStep: spaceStep
          }).addClass( 'b-statistics--shown' );
        }
      });
      
    });
    
    setTimeout( function() {
      window.dispatchEvent( new Event( 'scroll' ) );
    }, 500);
    
  });

}( jQuery ));