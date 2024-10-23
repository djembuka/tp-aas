document.querySelectorAll('.b-docs-block__data .btn').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    $(btn)
      .closest('.b-docs-block__item')
      .find('.b-docs-block__collapsed')
      .slideToggle()
      .toggleClass('active');
    $(btn).toggleClass('active');
  });
});

document
  .querySelectorAll('.b-docs-block__collapsed .btn')
  .forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      $(btn)
        .closest('.b-docs-block__collapsed')
        .slideUp()
        .removeClass('active');
      $(btn)
        .closest('.b-docs-block__item')
        .find('.b-docs-block__data .btn')
        .removeClass('active');
    });
  });

document.querySelectorAll('.b-docs-block__more__button').forEach((b) => {
  b.addEventListener('click', (e) => {
    e.preventDefault();
    e.target
      .closest('.b-docs-block')
      .querySelector('.b-docs-block__more__files')
      .classList.add('b-docs-block__more__files--show');
  });
});

document.documentElement.addEventListener('click', (e) => {
  if (
    e.target.closest('.b-docs-block__more__files') ||
    e.target.className.search('b-docs-block__more__files') !== -1 ||
    e.target.className.search('b-docs-block__more__button') !== -1
  ) {
    return;
  }
  document.querySelectorAll('.b-docs-block__more__files').forEach((f) => {
    f.classList.remove('b-docs-block__more__files--show');
  });
});
