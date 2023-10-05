( function($) {

  'use strict';
  
  $( function() {
    
    document.querySelectorAll( '.b-comission-tabs' ).forEach( function( elem ) {

      //all slide
      var slideAll = elem.querySelectorAll( '.b-comission-tabs__block .swiper-slide' )[0];

      elem.querySelectorAll( '.b-comission-tabs__block .swiper-slide' ).forEach( function( slide, index ) {
        if ( index === 0 ) {
          return;
        }
        $( slideAll ).append( slide.innerHTML );
        $( slideAll ).append( '<hr>' );
      });

      slideAll.querySelectorAll( '.b-collapse-block__head' ).forEach( function( elem ) {

        //hide on load
        if ( elem.closest( '.b-collapse-block' ).getAttribute( 'class' ).search( 'open' ) === -1 && elem.closest( '.b-collapse-block' ).getAttribute( 'class' ).search( 'show-on-load' ) !== -1 ) {
          $( elem ).closest( '.b-collapse-block' ).find( '.b-collapse-block__body' ).slideUp( 1000 );
        }
      
        elem.querySelector( 'a' ).addEventListener( 'click', function(e) {
          e.preventDefault();
          return false;
        });
      
        elem.addEventListener( 'click', function(e) {
          e.preventDefault();
          e.stopPropagation();
      
          $( elem ).closest( '.b-collapse-block' ).toggleClass( 'slide' ).find( '.b-collapse-block__body' ).slideToggle();
        });
      });

      var menuLinks = elem.querySelectorAll( '.b-comission-tabs__tabs a' );

      //swiper menu
      if ( window.matchMedia( "(max-width: 600px)" ).matches ) {

        var slidesPerView = 2.5;
    
        if ( window.matchMedia( "(min-width: 500px)" ).matches ) {
          slidesPerView = 3;
        }

        //init swiper
        new Swiper( elem.querySelector( '.b-comission-tabs__tabs .swiper-container' ), {
          slidesPerView: slidesPerView,
          spaceBetween: 30,
          freeMode: true
        });
      }

      //decor line
      var decorLine = elem.querySelector( '.b-comission-tabs__decor' );
      setTimeout( function() {
        decorLine.style.left =  menuLinks[0].offsetLeft + 'px';
        decorLine.style.width =  menuLinks[0].offsetWidth + 'px';
      }, 500);

      var comissionSwiper = new Swiper( elem.querySelector( '.b-comission-tabs__block .swiper-container' ), {
        loop: true,
        effect: 'fade',
        autoHeight: true
      });

      comissionSwiper.on( 'slideChange', function () {

        if ( comissionSwiper.realIndex === 0 ) {
          elem.classList.add( 'all' );
        } else {
          elem.classList.remove( 'all' );
        }

        var tabLink = menuLinks[ comissionSwiper.realIndex ];

        //highlight
        menuLinks.forEach( function( tabLinkElem ) {
          tabLinkElem.classList.remove( 'active' );
          tabLink.classList.add( 'active' );
        });

        //decor line
        decorLine.style.left = tabLink.offsetLeft + 'px';
        decorLine.style.width = tabLink.offsetWidth + 'px';
      });

      menuLinks.forEach( function( tabLink, index ) {
        tabLink.addEventListener( 'click', function(e) {
          e.preventDefault();

          //slide
          comissionSwiper.slideToLoop( index );
          if ( index === 0 ) {
            elem.classList.add( 'all' );
          } else {
            elem.classList.remove( 'all' );
          }
        });
      });
      
    });

  });

}( jQuery ));