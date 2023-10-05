window.addEventListener('load', () => {
  //header panel
  if (document.getElementById('bx-panel-hider')) {
    document.getElementById('bx-panel-hider').addEventListener('click', () => {
      const headerPanel = document.querySelector('.b-header-panel');
      headerPanel.setAttribute('data-topBorder', headerPanel.offset().top);
    });
  }

  //slide menu
  document.querySelectorAll('.b-left-menu').forEach((leftMenu) => {
    leftMenu.querySelectorAll('.b-left-menu__title').forEach((title) => {
      title.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'a') {
          return;
        }
        e.preventDefault();
        slideToggle(title);
      });
    });
  });

  function slideToggle(title) {
    const block = title.closest('.b-left-menu__item');
    const wrapper = block.querySelector('.b-left-menu__sub');

    block.classList.toggle('b-left-menu__item--show');

    if (!wrapper.classList.contains('b-left-menu__sub--show')) {
      wrapper.classList.add('b-left-menu__sub--show');
      wrapper.style.height = 'auto';

      var height = wrapper.clientHeight + 'px';

      wrapper.style.height = '0px';

      setTimeout(() => {
        wrapper.style.height = height;
      }, 0);
    } else {
      //if the menu is open on load
      if (!wrapper.getAttribute('style')) {
        wrapper.style.height = wrapper.clientHeight + 'px';

        setTimeout(() => {
          wrapper.style.height = '0px';
        }, 0);
      } else {
        wrapper.style.height = '0px';
      }

      wrapper.addEventListener(
        'transitionend',
        () => {
          wrapper.classList.remove('b-left-menu__sub--show');
        },
        {
          once: true,
        }
      );
    }
  }
});
