//change frames
document
  .querySelectorAll('.modal-frame .btn[ data-to-frame ]')
  .forEach(function (btn) {
    btn.addEventListener('click', function () {
      var frameNum = btn.getAttribute('data-to-frame');
      goToFrame(frameNum, btn.closest('.modal'));
    });
  });

function goToFrame(frameNum, modal) {
  var activeFrame = modal.querySelector('.modal-frame--active');
  activeFrame.classList.remove('modal-frame--active');
  activeFrame.classList.remove('modal-frame--animate');

  var activeFrameNew = modal.querySelector('.modal-frame--' + frameNum);
  activeFrameNew.classList.add('modal-frame--active');
  setTimeout(function () {
    activeFrameNew.classList.add('modal-frame--animate');
  }, 100);
}

document.querySelectorAll('#preappealModal form').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    var email = document.querySelector('#preappealModalEmailControl').value;
    e.preventDefault();
    //check controls
    var invalidControl;
    form.querySelectorAll('.b-float-label input').forEach(function (control) {
      if (!control.value.trim()) {
        control.closest('.b-float-label').classList.add('invalid');
        if (!invalidControl) {
          invalidControl = control;
        }
      } else {
        control.closest('.b-float-label').classList.remove('invalid');
      }
    });
    if (invalidControl) {
      invalidControl.focus();
      return;
    }
    //fetch data
    $.ajax({
      url: form.getAttribute('action'),
      type: form.getAttribute('method'), //GET
      dataType: 'json',
      data: {
        name: document.querySelector('#preappealModalNameControl').value,
        email: document.querySelector('#preappealModalEmailControl').value,
      },
      beforeSend: function () {
        form.querySelector('.btn').classList.add('btn--load-circle');
      },
      success: function (data) {
        if (data && typeof data === 'object') {
          switch (data.STATUS) {
            case 'Y':
              if (window.ym && window.ymId) {
                ym(window.ymId, 'reachGoal', 'PREAPPEAL_POPUP_SUCCESS');
              }
              document.querySelector('#preappealModalEmail').textContent =
                email;
              goToFrame(4, document.querySelector('#preappealModal'));
              break;
            case 'N':
              goToFrame(3, document.querySelector('#preappealModal'));
              break;
          }
          form.querySelector('.btn').classList.remove('btn--load-circle');
        }
      },
      error: function (a, b, c) {
        if (window.console) {
          console.log(a);
          console.log(b);
          console.log(c);
        }
      },
    });
  });
});

$('#preappealModal').on('hidden.bs.modal', function () {
  goToFrame(1, document.querySelector('#preappealModal'));
  document
    .querySelectorAll('#preappealModal input')
    .forEach(function (control) {
      control.value = '';
    });
  if (document.querySelector('#preappealModal .btn--load-circle')) {
    document
      .querySelector('#preappealModal .btn--load-circle')
      .classList.remove('btn--load-circle');
  }
});
