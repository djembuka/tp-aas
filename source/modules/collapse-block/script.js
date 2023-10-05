document.querySelectorAll('.b-collapse-block__head').forEach(function (elem) {
  //hide on load
  if (
    elem.closest('.b-collapse-block').className.search('open') === -1 &&
    elem.closest('.b-collapse-block').className.search('show-on-load') !== -1
  ) {
    $(elem)
      .closest('.b-collapse-block')
      .find('.b-collapse-block__body')
      .slideUp(1000);
  }

  elem.querySelector('a').addEventListener('click', function (e) {
    e.preventDefault();
    return false;
  });

  //open collapsed
  elem.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    $(elem)
      .closest('.b-collapse-block')
      .toggleClass('slide')
      .find('.b-collapse-block__body')
      .slideToggle();

    //ik select init
    setTimeout(function () {
      if (elem.closest('.b-collapse-block').className.search('slide') >= 0) {
        elem
          .closest('.b-collapse-block')
          .querySelectorAll('select')
          .forEach(function (select) {
            $(select).ikSelect('redraw');
          });
      }
    }, 1000);
  });
});
