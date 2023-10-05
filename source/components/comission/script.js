( function($) {

  'use strict';
  
  $( function() {
    
    document.querySelectorAll( '.b-comission-tabs' ).forEach( function( elem ) {

      var menuLinks = elem.querySelectorAll( '.b-comission-tabs__tabs a' );

      //swiper menu
      if ( window.matchMedia( "(max-width: 650px)" ).matches ) {

        var slidesPerView = 4;
    
        if ( window.matchMedia( "(min-width: 550px)" ).matches ) {
          slidesPerView = 5;
        }

        //init swiper
        new Swiper( elem.querySelector( '.b-comission-tabs__tabs .swiper-container' ), {
          slidesPerView: slidesPerView,
          spaceBetween: 30,
          freeMode: true
        });

        setTimeout( function() {
          document.querySelector( '.b-comission-tabs__tabs' ).classList.add( 'animate' );
        }, 1000);
      }

      //decor line
      var decorLine = elem.querySelector( '.b-comission-tabs__decor' );
      var swiperWrapper = elem.querySelector( '.b-comission-tabs__tabs .swiper-wrapper' );
      var trans = swiperWrapper.style.transform;
      var pos = trans.indexOf( '(' );
      
      setTimeout( function() {
        decorLine.style.left =  menuLinks[0].offsetLeft + parseInt( trans.substr( pos + 1 ) || 0, 10) + 'px';
        decorLine.style.width =  menuLinks[0].offsetWidth + 'px';
      }, 500);
      
      elem.classList.add( 'all' );

      menuLinks.forEach( function( tabLink, index ) {
        tabLink.addEventListener( 'click', function(e) {
          e.preventDefault();

          //highlight
          menuLinks.forEach( function( tabLinkElem ) {
            tabLinkElem.classList.remove( 'active' );
            tabLink.classList.add( 'active' );
          });

          //decor line
          trans = swiperWrapper.style.transform;
          pos = trans.indexOf( '(' );
          decorLine.style.left = tabLink.offsetLeft + parseInt( trans.substr( pos + 1 ) || 0, 10) + 'px';
          decorLine.style.width = tabLink.offsetWidth + 'px';

          //show all
          if ( index === 0 ) {
            elem.classList.add( 'all' );
          } else {
            elem.classList.remove( 'all' );

            //slide
            elem.querySelectorAll( '.b-comission-tabs__item' ).forEach( function( el ) {
              el.classList.remove( 'active' );
            });
            elem.querySelectorAll( '.b-comission-tabs__item' )[ index ].classList.add( 'active' );
            
          }
        });
      });
      
    });

  });

}( jQuery ));