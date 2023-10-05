document.querySelectorAll('.b-switch-button').forEach(function (switchElem) {
  switchElem.querySelectorAll('span').forEach(function (elem, index) {
    if (index === 0) {
      elem.addEventListener('click', function () {
        elem.parentNode.classList.remove('inverse');
      });
    } else {
      elem.addEventListener('click', function () {
        elem.parentNode.classList.add('inverse');
      });
    }
  });
});
