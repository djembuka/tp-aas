document.querySelectorAll( '.b-docs-block__data .btn' ).forEach( function( btn ) {
  btn.addEventListener( 'click', function(e) {
    e.preventDefault();
    $( btn ).closest( '.b-docs-block__item' ).find( '.b-docs-block__collapsed' ).slideToggle().toggleClass( 'active' );
    $( btn ).toggleClass( 'active' );
  });
});

document.querySelectorAll( '.b-docs-block__collapsed .btn' ).forEach( function( btn ) {
  btn.addEventListener( 'click', function(e) {
    e.preventDefault();
    $( btn ).closest( '.b-docs-block__collapsed' ).slideUp().removeClass( 'active' );
    $( btn ).closest( '.b-docs-block__item' ).find( '.b-docs-block__data .btn' ).removeClass( 'active' );
  });
});