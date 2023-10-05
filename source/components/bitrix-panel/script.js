window.addEventListener('load', () => {
  const bxPanel = document.getElementById('bx-panel');
  const fixedWrapper = document.querySelector('.b-header-fixed-wrapper');

  if (bxPanel) {
    document.getElementById('bx-panel-hider').addEventListener('click', (e) => {
      let header = document.querySelector('header');
      header.setAttribute('data-topBorder', header.getBoundingClientRect().top);
    });

    fixedWrapper.style.top = bxPanel.offsetHeight + 'px';

    window.addEventListener('scroll', (e) => {
      if (bxPanel.className.search('bx-panel-fixed') === -1) {
        //the panel is not fixed
        if (bxPanel.offsetHeight - window.scrollY >= 0) {
          fixedWrapper.style.top = bxPanel.offsetHeight - window.scrollY + 'px';
        } else {
          fixedWrapper.style.top = 0;
        }
      } else {
        //the panel is fixed
        fixedWrapper.style.top = bxPanel.offsetHeight + 'px';
        /*if (window.scrollY < 58) {
          fixedWrapper.style.top = bxPanel.offsetHeight - window.scrollY + 'px';
        } else {
          fixedWrapper.style.top = bxPanel.offsetHeight - 58 + 'px';
        }*/
      }
    });

    window.dispatchEvent(new Event('scroll'));
  }
});
