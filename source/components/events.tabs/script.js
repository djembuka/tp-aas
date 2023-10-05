( function($) {

  'use strict';
  
  $( function() {

    document.querySelectorAll( '.b-events-tabs' ).forEach( function( elem ) {

      var menuLinks = elem.querySelectorAll( '.b-events-tabs__tabs a' );

      //swiper menu
      if ( window.matchMedia( "(max-width: 600px)" ).matches ) {

        var slidesPerView = 2.5;
    
        if ( window.matchMedia( "(min-width: 500px)" ).matches ) {
          slidesPerView = 3;
        }

        //init swiper
        new Swiper( elem.querySelector( '.b-events-tabs__tabs .swiper-container' ), {
          slidesPerView: slidesPerView,
          spaceBetween: 30,
          freeMode: true
        });

        //scroll
        window.addEventListener( 'scroll', function() {
          if ( elem.querySelector( '.b-events-tabs__tabs' ).className.search( 'animate' ) !== -1 ) {
            return;
          }
          
          if ( $( elem ).offset().top <= window.scrollY + window.outerHeight - 250 ) {
            elem.querySelector( '.b-events-tabs__tabs' ).classList.add( 'animate' );
          }
        });
        
        setTimeout( function() {
          window.dispatchEvent( new Event( 'scroll' ) );
        }, 500);
      }

      //decor line
      var decorLine = elem.querySelector( '.b-events-tabs__decor' );
      var swiperWrapper = elem.querySelector( '.b-events-tabs__tabs .swiper-wrapper' );
      var trans = swiperWrapper.style.transform;
      var pos = trans.indexOf( '(' );
      setTimeout( function() {
        decorLine.style.left =  menuLinks[0].offsetLeft + parseInt( trans.substr( pos + 1 ) || 0, 10) + 'px';
        decorLine.style.width =  menuLinks[0].offsetWidth + 'px';
      }, 500);

      var eventsSwiper = new Swiper( elem.querySelector( '.b-events-tabs__block .swiper-container' ), {
        loop: true,
        effect: 'fade',
      });

      eventsSwiper.on( 'slideChange', function () {
        var tabLink = menuLinks[ eventsSwiper.realIndex ];

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
      });

      menuLinks.forEach( function( tabLink, index ) {
        tabLink.addEventListener( 'click', function(e) {
          e.preventDefault();

          //slide
          eventsSwiper.slideToLoop( index );
        });
      });
      
    });

  });

}( jQuery ));