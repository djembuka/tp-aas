window.addEventListener('load', () => {
  //docs
  let docRemoveId;
  $('.b-dc-case-detail__docs .b-docs-block__item .btn-remove').click((e) => {
    e.preventDefault();
    $('#removeDocConsent').modal('show');
    docRemoveId = e.target.data('id');
  });

  document
    .querySelector('#removeDocConsent .btn-danger')
    .addEventListener('click', (e) => {
      e.preventDefault();

      if (window.BX) {
        window.BX.ajax
          .runAction(`removeDoc`, {
            data: {
              id: docRemoveId,
            },
          })
          .then(
            () => {
              //res
            },
            (error) => {
              //rej
            }
          );
      }

      $('#removeDocConsent').modal('hide');
    });

  //icon copy
  const copyToClipboard = (str, elem) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      str = str.trim();
      navigator.clipboard.writeText(str);
      if (elem) {
        let span = document.createElement('span');
        span.classList.add('b-copy-icon__note');
        span.innerText = 'Скопировано в буфер';
        elem.querySelector('.b-copy-icon').appendChild(span);
        setTimeout(() => {
          span.classList.add('b-copy-icon__note--show');
        }, 0);
        setTimeout(() => {
          span.classList.remove('b-copy-icon__note--show');
        }, 1000);
        setTimeout(() => {
          span.remove();
        }, 1500);
      }
      return;
    }
    return Promise.reject('The Clipboard API is not available.');
  };

  if (window.matchMedia('(min-width: 768px)').matches) {
    //table
    document
      .querySelectorAll('.b-dc-case-detail table.table td')
      .forEach((td) => {
        td.addEventListener('click', () => {
          copyToClipboard(td.textContent, td);
        });
      });
  }
});
