document.querySelectorAll( '.b-content-gallery .swiper-container' ).forEach( function( elem ) {
  new Swiper( elem, {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
    },
    navigation: {
      nextEl: elem.parentNode.querySelector( '.swiper-button-next' ),
      prevEl: elem.parentNode.querySelector( '.swiper-button-prev' ),
    },
    lazy: {
      loadPrevNext: true,
    },
  });
});