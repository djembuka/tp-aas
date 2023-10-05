window.addEventListener('load', () => {
  document.querySelectorAll('.b-switch-block__switch').forEach(function (sw) {
    sw.addEventListener('click', function (e) {
      e.preventDefault();

      let json = sw.getAttribute('data-json');

      if (!window.BX) return;

      window.BX.ajax
        .runComponentAction('twinpx:vacancy.add', 'set', {
          mode: 'class', //это означает, что мы хотим вызывать действие из class.php
          data: {
            json: json, //данные будут автоматически замаплены на параметры метода
          },
        })
        .then(
          function (response) {
            sw.classList.toggle('i-active');
            if (response && typeof response === 'object' && response.data) {
              sw.setAttribute('data-json', response.data);
            }
          },
          function (response) {}
        );
    });
  });
});
