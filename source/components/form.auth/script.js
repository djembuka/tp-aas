window.addEventListener('load', () => {
  document.querySelectorAll('.b-validate-form').forEach((formBlock) => {
    const form = formBlock.querySelector('form'),
      loginInput = form.querySelector('input[ type="text" ]'),
      passwordInput = form.querySelector('input[ type="password" ]'),
      checkboxBlock = form.querySelector('.b-checkbox'),
      checkboxInput = form.querySelector('input[ type="checkbox" ]'),
      submitButton = form.querySelector('button[type=submit]'),
      modal = form.querySelector('#docToSignModal');

    let agreementCompletedFlag;

    form.addEventListener('submit', (e) => {
      let errorFlag = false;

      //validate inputs
      [loginInput, passwordInput, checkboxInput].forEach((input) => {
        if (!input) return;
        let isCheckbox = input.getAttribute.type === 'checkbox' ? true : false;
        let wrapper = isCheckbox
          ? checkboxBlock
          : input.closest('.b-float-label');

        if (isCheckbox ? !checkboxInput.checked : input.value.trim() === '') {
          wrapper.classList.add('invalid');
          errorFlag = true;
        } else {
          wrapper.classList.remove('invalid');
        }
      });

      //if
      if (errorFlag) {
        e.preventDefault();
        form.querySelector('.b-float-label.invalid input').focus();
      }
    });

    if (loginInput && passwordInput && checkboxInput) {
      //change checkbox - check signed docs
      checkboxInput.addEventListener('change', () => {
        if (
          loginInput.value.trim() !== '' &&
          passwordInput.value.trim() !== '' &&
          checkboxInput.checked
        ) {
          //show preloader
          checkboxBlock.classList.add('b-checkbox--loading');
          //send request
          sendRequest();
        } else if (!checkboxInput.checked) {
          //disable submit button
          submitButton.setAttribute('disabled', 'disabled');
        }
      });

      [loginInput, passwordInput].forEach((input) => {
        let value = '';
        input.addEventListener('keydown', () => {
          value = input.value;
        });
        input.addEventListener('keyup', () => {
          if (value !== input.value) {
            //change login or password - reset checkbox
            checkboxInput.checked = false;
            //disable submit button
            submitButton.setAttribute('disabled', 'disabled');
          }
        });
      });
    }

    //sign doc
    if (modal) {
      modal.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.id === 'docToSignButton') {
          //send id, login
          document
            .querySelector('.modal-body')
            .classList.add('modal-body--loading');
          sendRequest(e.target.getAttribute('data-id'));
        }
      });

      $('#docToSignModal').on('hide.bs.modal', function (event) {
        if (!agreementCompletedFlag) {
          checkboxInput.checked = false;
        }
        agreementCompletedFlag = false;
      });
    }

    function sendRequest(docId) {
      let dataObj = {
          login: loginInput.value,
          password: passwordInput.value,
        },
        method = 'chechAgreement';

      if (docId) {
        dataObj.id = docId;
        method = 'setAgreement';
      }

      BX.ajax
        .runComponentAction('twinpx:agreements', method, {
          mode: 'class',
          data: dataObj,
        })
        .then(response);
    }

    function response(response) {
      if (response.status === 'success') {
        //hide preloader
        checkboxBlock.classList.remove('b-checkbox--loading');

        if (response.data && response.data.html) {
          //open popup window
          $('#docToSignModal').modal('show');
          //set modal content
          document.querySelector('#docToSignModal .modal-dialog').innerHTML =
            response.data.html;
        } else if (response.data && response.data.errors) {
          //remove previous error
          let errorBlock = document.querySelector('.b-form-auth__error');
          if (!errorBlock) {
            //show error
            errorBlock = document.createElement('p');
            errorBlock.classList.add(
              'text-center',
              'invalid',
              'b-form-auth__error'
            );
            document.querySelector('.b-form-auth__block').prepend(errorBlock);
          }
          errorBlock.textContent = response.data.errors || 'Server error.';
          //remove checkbox
          checkboxInput.checked = false;
          //close popup window
          $('#docToSignModal').modal('hide');
        } else {
          //enable submit button
          submitButton.removeAttribute('disabled');
          //don`t remove checkbox
          agreementCompletedFlag = true;
          //close popup window
          $('#docToSignModal').modal('hide');
        }
      }
    }
  });
});
