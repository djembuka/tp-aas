window.addEventListener('load', () => {
  const modal = document.getElementById('docToSignModal');

  sendRequest();

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
  }

  async function sendRequest(docId) {
    let action = 'getUserAgreement';
    let data = {};

    if (docId) {
      action = 'setUserAgreement';
      data = { id: docId };
    }

    BX.ajax
      .runComponentAction('twinpx:agreements', action, {
        mode: 'class',
        data: data,
      })
      .then(function (response) {
        if (response.status === 'success') {
          if (response.data && response.data.html) {
            //open popup window
            $('#docToSignModal').modal({ backdrop: 'static', show: true });
            //set modal content
            document.querySelector('#docToSignModal .modal-dialog').innerHTML =
              response.data.html;
          } else if (response.data && response.data.errors) {
            //show error
            let errorBlock = document.createElement('p');
            errorBlock.classList.add('text-center', 'invalid');
            errorBlock.textContent = response.data.errors || 'Server error.';
            document.querySelector('.b-profile__text').prepend(errorBlock);
            //close popup window
            $('#docToSignModal').modal('hide');
          } else {
            //close popup window
            $('#docToSignModal').modal('hide');
            if (docId) {
              //if some docs were signed
              location.reload();
            }
          }
        }
      });
  }
});
