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
    let num = document.querySelector('.b-payment-requisites-detail__num');
    if (num) {
      num.addEventListener('click', (e) => {
        copyToClipboard(num.textContent, num);
      });
    }
  }

  document
    .querySelector('.b-payment-requisites-detail__print .btn-icon')
    .addEventListener('click', (e) => {
      window.print();
    });
});
