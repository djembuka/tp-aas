if (document.querySelectorAll('.b-tab-links').length) {
  document.querySelectorAll('.b-tab-links').forEach(function (elem) {
    const activeLink = elem.querySelector('a.active'),
      decorLine = elem.querySelector('.b-tab-links__decor');

    setTimeout(() => {
      decorLine.style.left = `${activeLink.offsetLeft}px`;
      decorLine.style.width = `${activeLink.offsetWidth}px`;
    }, 500);
  });
}
