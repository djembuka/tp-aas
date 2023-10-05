( function($) {

  'use strict';
  
  $( function() {

    //prevent click
    document.querySelectorAll( 'article a[ href="#profile" ]' ).forEach( function( textLink ) {
      textLink.addEventListener( 'click', function(e) {
        e.preventDefault();
      });
    });

    var sidenotesArray = [];
    
    function getOffsetTop(elem) {
      var top = 0;

      while (elem && elem.tagName.toLowerCase() !== 'article' ) {
        top = top + parseInt(elem.offsetTop);
        elem = elem.offsetParent;
      }

      return top;
    }

    //sidenote
    document.querySelectorAll( 'article .b-sidenote' ).forEach( function( sidenote ) {

      //append to aside
      document.querySelector( 'aside' ).appendChild( sidenote );

      //find top of the link in the text
      var top;
      var fio = sidenote.querySelector( '.b-sidenote__title' ).textContent.replace(/\s+/g, ' ').trim();
      document.querySelectorAll( 'article a[ href="#profile" ]' ).forEach( function( textLink ) {
        var text = textLink.textContent.replace(/\s+/g, ' ').trim();
        if ( text === fio ) {
          top = getOffsetTop( textLink );
          //hover
          textLink.addEventListener( 'mouseenter', function(e) {
            openSidenote( sidenote );
          });
          textLink.addEventListener( 'mouseleave', function(e) {
            closeSidenote( sidenote );
          });
        }
      });

      //push array
      if ( top ) {
        sidenotesArray.push({ top: top, height: sidenote.offsetHeight, sidenote: sidenote });
      } else {
        sidenote.style.display = 'none';
        return;
      }

    });

    //sort sidenotes array
    sidenotesArray.sort( function( a, b ) {
      return a.top - b.top;
    });

    //change top
    sidenotesArray.forEach( function( obj, index ) {
      if ( index < sidenotesArray.length - 1 && sidenotesArray[ index + 1 ].top < obj.top + obj.height + 30 ) {
        sidenotesArray[ index + 1 ].top = obj.top + obj.height + 30;
      }
    });

    //positioning the sidenote
    sidenotesArray.forEach( function( obj ) {
      obj.sidenote.style.top = ( obj.top - 21 ) + 'px';

      //hover
      obj.sidenote.addEventListener( 'mouseenter', function() {
        openSidenote( obj.sidenote );
      });
      obj.sidenote.addEventListener( 'mouseleave', function() {
        closeSidenote( obj.sidenote );
      });
    });

    var zIndexTimeoutId;
    function openSidenote( sidenote ) {
      $( sidenote ).addClass( 'open' ).find( '.b-sidenote__description' ).stop().slideDown();
      sidenote.style.zIndex = 3;
    }

    function closeSidenote( sidenote ) {
      sidenote.style.zIndex = 2;
      $( sidenote ).removeClass( 'open' ).find( '.b-sidenote__description' ).stop().slideUp( 500, function() {
        sidenote.style.zIndex = 1;
      });
    }

  });

}( jQuery ));