( function($) {

  'use strict';
  
  $( function() {
    
    //block
    $( '.b-committee .col-12 > .b-structure__block > .b-structure__block' )
      .hover(
        function() {
          var $block = $( this );
          $block.addClass( 'hover' );
          $block.closest( '.col-12' ).find( '> .b-structure__block > .b-committee__item' ).addClass( 'hover-head' );
        },
        function() {
          var $block = $( this );
          $block.removeClass( 'hover' );
          $block.closest( '.col-12' ).find( '> .b-structure__block > .b-committee__item' ).removeClass( 'hover-head' );
        })
      .click( function() {
        var $block = $( this );
        if ( $block.hasClass( 'click' ) || $block.parent().hasClass( 'click-block' )) {
          clearAll();
        } else {
          clearAll();
          $block.addClass( 'click' );
          $block.closest( '.col-12' ).find( '> .b-structure__block > .b-committee__item' ).addClass( 'click-head' );
        }
      });

    //main item
    $( '.b-committee .col-12 > .b-structure__block > .b-committee__item' )
    .hover(
      function() {
        $( this ).parent().addClass( 'hover-block' );
      },
      function() {
        $( this ).parent().removeClass( 'hover-block' );
      })
    .click( function() {
      var $item = $( this );
      if ( $item.hasClass( 'click-head' ) || $item.parent().hasClass( 'click-block' )) {
        clearAll();
      } else {
        clearAll();
        $item.parent().addClass( 'click-block' );
      }
    });

    function clearAll() {
      $( '.b-committee .click' ).removeClass( 'click' );
      $( '.b-committee .click-head' ).removeClass( 'click-head' );
      $( '.b-committee .click-block' ).removeClass( 'click-block' );
    }
    
  });

}( jQuery ));