  class slr2MenuCollapse {
    constructor(element) {
      this.element = element;
	  this.element.classList.add('menu-collapse--visible');
	  this.element.classList.add('menu-collapse--ready');
	  
	  window.addEventListener('load', () => {
		  this.init();
	  });
      
      this.events();
    }

    init() {
      let menuWidth = this.element.getBoundingClientRect().width;
      const items = this.element.querySelectorAll('.menu-collapse__item');
      let itemsWidth = 0;
      let edgeIndex;

      items.forEach((item, index) => {
        itemsWidth += item.getBoundingClientRect().width;

        let summ = itemsWidth + index * 24;
        if (index != items.length - 1) {
          summ += (16 + 20);
        }

        if (summ > menuWidth && edgeIndex === undefined) {
          edgeIndex = index - 1;
        }
      });

      //more button
      const moreButton = document.createElement('div');
      moreButton.classList.add('menu-collapse__more');
      this.element.appendChild(moreButton);

      const subMenu = document.createElement('div');
      subMenu.classList.add('menu-collapse__sub');
      moreButton.appendChild(subMenu);

      let showInterval;
      moreButton.addEventListener('mouseenter', (e) => {
        clearInterval(showInterval);
        moreButton.classList.add('menu-collapse__more--show');
      });
      moreButton.addEventListener('mouseleave', () => {
        showInterval = setTimeout(() => {
          moreButton.classList.remove('menu-collapse__more--show');
        }, 200);
      });

      //append items to submenu
      if (!edgeIndex || edgeIndex === items.length) {
        this.element.classList.add('menu-collapse--no-more');
      } else {
        items.forEach((item, index) => {
          if (index > edgeIndex) {
            subMenu.appendChild(item);
          }
        });
      }
    }

    events() {
      window.addEventListener('resize', () => {
        //hide submenu
        this.element.classList.remove('menu-collapse--visible');
        //move items back
        const subMenu = this.element.querySelector('.menu-collapse__sub');
        const moreButton = this.element.querySelector('.menu-collapse__more');
        subMenu.querySelectorAll('.menu-collapse__item').forEach((item) => {
          moreButton.before(item);
        });
  
        const menuWidth = this.element.getBoundingClientRect().width;
        const items = this.element.querySelectorAll('.menu-collapse__item');
        let itemsWidth = 0;
        let edgeIndex;
  
        items.forEach((item, index) => {
          itemsWidth += item.getBoundingClientRect().width;

          let summ = itemsWidth + index * 24;
          if (index != items.length - 1) {
            summ += (16 + 20);
          }

          if (summ > menuWidth && edgeIndex === undefined) {
            edgeIndex = index - 1;
          }
        });
  
        if (!edgeIndex || edgeIndex === items.length) {
          this.element.classList.add('menu-collapse--no-more');
        } else {
          items.forEach((item, index) => {
            if (index > edgeIndex) {
              subMenu.appendChild(item);
            }
          });
          this.element.classList.remove('menu-collapse--no-more');
        }
  
        this.element.classList.add('menu-collapse--visible');
      });
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
	// to show menu as soon as possible
    new slr2MenuCollapse(document.querySelector('.b-header__menu.menu-collapse'));
  });