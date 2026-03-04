  class slr2MenuCollapse {
    constructor(element) {
      this.element = element;
      this.items = this.element.querySelectorAll('.menu-collapse__item');
      this.moreButton;
      this.subMenu;

      this.itemsGap = 30;
      this.moreWidth = 20;
      this.moreMargin = this.itemsGap - 8;

      this.init();
    }

    init() {
      this.element.classList.add('menu-collapse--visible');
      this.element.classList.add('menu-collapse--ready');
      this.createMoreButton();
      
      window.addEventListener('load', () => {
        this.fillSubMenu();
      });
        
      this.handleEvents();
    }

    calcSumm(itemsWidth, index) {
        let summ = itemsWidth + index * this.itemsGap;
        const isItemLast = index === this.items.length - 1;

        if (!isItemLast) {
          summ += (this.moreMargin + this.moreWidth);
        }

        return summ;
    }

    calcEdgeIndex() {
      let menuWidth = this.element.getBoundingClientRect().width;
      let itemsWidth = 0;
      let edgeIndex;

      this.items.forEach((item, index) => {
        itemsWidth += item.getBoundingClientRect().width;
        
        const summ = this.calcSumm(itemsWidth, index);

        const isSummWider = summ > menuWidth;
        const isEdgeIndexDefined = edgeIndex !== undefined

        if (isSummWider && !isEdgeIndexDefined) {
          edgeIndex = index - 1;
        }
      });

      return edgeIndex;
    }

    createMoreButton() {
      this.moreButton = document.createElement('div');
      this.moreButton.classList.add('menu-collapse__more');
      this.element.appendChild(this.moreButton);

      this.subMenu = document.createElement('div');
      this.subMenu.classList.add('menu-collapse__sub');
      this.moreButton.appendChild(this.subMenu);
    }

    fillSubMenu() {
      const edgeIndex = this.calcEdgeIndex();
      const isEdgeOnLastItem = !edgeIndex || edgeIndex === this.items.length;

      if (isEdgeOnLastItem) {
        this.element.classList.add('menu-collapse--no-more');
      } else {
        this.items.forEach((item, index) => {
          if (index > edgeIndex) {
            this.subMenu.appendChild(item);
          }
        });
        this.element.classList.remove('menu-collapse--no-more');
      }
    }

    handleEvents() {
      window.addEventListener('resize', () => {
        this.calc();
      });

      let showInterval;

      this.moreButton.addEventListener('mouseenter', (e) => {
        clearInterval(showInterval);
        this.moreButton.classList.add('menu-collapse__more--show');
      });

      this.moreButton.addEventListener('mouseleave', () => {
        showInterval = setTimeout(() => {
          this.moreButton.classList.remove('menu-collapse__more--show');
        }, 200);
      });
    }

    calc() {
      this.element.classList.remove('menu-collapse--visible');
      
      this.subMenu.querySelectorAll('.menu-collapse__item').forEach((item) => {
        this.moreButton.before(item);
      });

      this.fillSubMenu();

      this.element.classList.add('menu-collapse--visible');
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
	// to show menu as soon as possible
    window.menuCollapse = new slr2MenuCollapse(document.querySelector('.b-header__menu.menu-collapse'));
  });