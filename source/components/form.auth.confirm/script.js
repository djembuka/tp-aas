( function($) {

  'use strict';
  
  $( function() {

    $( '.b-validate-form' ).each( function() {
      
      var $this = $( this ),
          $form = $this.find( 'form' ),
          $submitButton = $form.find( '.btn[ type=submit ]' );
          
      $submitButton.click( function(e) {
        var errorFlag = false;
        
        //validate text input
        $form.find( 'input[ type="text" ]' ).each( function() {
          var $textInput = $( this );
          
          if ( $.trim( $textInput.val()) === '' ) {
            $textInput.closest( '.b-float-label' ).addClass( 'invalid' );
            errorFlag = true;
          } else {
            $textInput.closest( '.b-float-label' ).removeClass( 'invalid' );
          }
          
        });
        
        //validate password input
        $form.find( 'input[ type="password" ]' ).each( function() {
          var $textInput = $( this );
          
          if ( $.trim( $textInput.val()) === '' ) {
            $textInput.closest( '.b-float-label' ).addClass( 'invalid' );
            errorFlag = true;
          } else {
            $textInput.closest( '.b-float-label' ).removeClass( 'invalid' );
          }
          
        });
        
        if ( errorFlag ) {
          e.preventDefault();
          $form.find( '.b-float-label.invalid:eq(0) input' ).focus();
        }
      });
    });
    
  });

}( jQuery ));