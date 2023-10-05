( function($) {

  'use strict';
  
  $( function() {
    
    document.querySelector( '.b-form-profile__photo-delete' ).addEventListener( 'click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      document.querySelector( 'input#PERSONAL_PHOTO' ).value="";
      document.querySelector( '.b-form-profile__fileupload' ).classList.remove( 'uploaded' );
      document.querySelector( 'input#PERSONAL_PHOTO_del' ).checked = true;
    });
        
    document.querySelector( 'input#PERSONAL_PHOTO' ).addEventListener( 'change', function(e) {
      var input = this;
      if ( input.files && input.files[0] && input.files[0].size < 3e6 && /gif|jpg|jpeg|png|tiff|webp|heic/gi.test( input.files[0].name.substr( input.files[0].name.lastIndexOf('.') + 1 ).toLowerCase())) {
        var reader = new FileReader();

        reader.onload = function (e) {
          document.querySelector( '.b-form-profile__fileupload' ).classList.add( 'uploaded' );
          $( '.b-form-profile__photo-img' ).css( 'backgroundImage', 'url("' + e.target.result + '")' );
        };

        reader.readAsDataURL( input.files[0]);
      }
    });

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