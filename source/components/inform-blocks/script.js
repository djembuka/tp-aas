( function($) {

  'use strict';
  
  $( function() {

    //click
    document.querySelectorAll( '.b-inform-blocks__item' ).forEach( function( elem, index ) {
      elem.addEventListener( 'click', function() {
        window.location = elem.querySelector( '.b-inform-blocks__title a' ).getAttribute( 'href' );
      });
    });
    
    setTimeout( function() {
      $( '.b-inform-blocks' ).addClass( 'i-show' );
    }, 500);

    //scroll
    var space = 150;
    
    if ( window.matchMedia( '(min-width: 576px)' ).matches ) {
      space = 150;
    }
    
    setTimeout( function() {

      window.addEventListener( 'scroll', function(e) {
  
        document.querySelectorAll( '.b-inform-blocks__item' ).forEach( function( elem, index ) {
  
          if ( elem.className.search( 'b-inform-blocks--shown' ) !== -1 ) {
            return;
          }
          
          if ( $( elem ).offset().top <= window.scrollY + window.outerHeight - space ) {
            elem.classList.add( 'b-inform-blocks--shown' );
          }
        });
        
      });

      window.dispatchEvent( new Event( 'scroll' ) );

    }, 600);
    
  });

}( jQuery ));