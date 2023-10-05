window.addEventListener('load', () => {
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
      .querySelectorAll('.b-check-detail-out table.table td')
      .forEach((td) => {
        td.addEventListener('click', () => {
          copyToClipboard(td.textContent, td);
        });
      });
  }

  //instruction
  let form = document.querySelector('.b-inst form');
  document.querySelectorAll('.b-inst__form-control').forEach((control) => {
    control.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') {
        return;
      }
      e.preventDefault();
      control.classList.toggle('i-active');
      control.querySelector('input').toggleAttribute('checked');
      //fetch data
      let formData = new FormData(form);
      fetch(form.getAttribute('action'), {
        method: form.getAttribute('method'),
        body: formData,
      });
    });
  });
});
