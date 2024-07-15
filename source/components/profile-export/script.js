window.addEventListener('load', function () {
  const $body = $('#profileExportModal .modal-body');
  $('#profileExportModal').on('show.bs.modal', async function () {
    let response = await fetch($body.data('url'));
    let result = await response.text();

    $body.html(result);

    document
      .querySelector('#profileExportModal .b-docs-block__more__button')
      .addEventListener('click', (e) => {
        e.preventDefault();
        e.target
          .closest('.b-docs-block')
          .querySelector('.b-docs-block__more__files')
          .classList.add('b-docs-block__more__files--show');
      });
  });
});
