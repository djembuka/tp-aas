window.addEventListener('load', () => {
  //icon copy
  const copyToClipboard = (e, str, elem) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      str = str.trim();
      navigator.clipboard.writeText(str);
      if (elem) {
        let span = document.createElement('span');
        span.classList.add('b-copy-icon__note');
        span.innerText = 'Скопировано в буфер';
        span.style.top = `${
          e.clientY - elem.getBoundingClientRect().top - 50
        }px`;
        span.style.left = `${
          e.clientX - elem.getBoundingClientRect().left - 70
        }px`;
        elem.appendChild(span);
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

  document.querySelectorAll('.b-widget-code-block').forEach((block) => {
    block.addEventListener('click', (e) => {
      let pre = block.querySelector('pre');
      copyToClipboard(e, pre.textContent, block);
    });
  });
});
