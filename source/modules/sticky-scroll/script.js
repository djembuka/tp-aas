class twpxStickyScroll {
  /*
  this.content - таблица
  this.ss - .twpx-sticky-scroll
  this.contentWrapper - .twpx-sticky-scroll-content-wrapper
  this.scrollbar - .twpx-sticky-scroll-scrollbar
  this.thumb - .twpx-sticky-scroll-scrollbar-thumb

  this.spaceLeft - .twpx-sticky-scroll-space-left
  this.spaceRight - .twpx-sticky-scroll-space-right

  this.arrowLeft - .twpx-sticky-scroll-arrow-left
  this.arrowRight - .twpx-sticky-scroll-arrow-right

  this.thumbClickedFlag - нажат ли thumb на скроллбаре
  this.thumbClickedCoords - расстояние от левого края thumb до точки нажатия мышью на thumb
  this.scrollbarDelta - разница между шириной скроллбара и thumb
  this.contentDelta - разница между шириной таблицы и видимой областью на странице (container)
  this.hoverSpaceIntervalId - хранит интервал для setInterval при наведении на боковые области (space)
  this.clickThumbStep = 100 - на сколько пикселей перемещать thumb при клике на скроллбак
  this.hoverSpaceStep = 10 - на сколько пикселей перемещать таблицу при  наведении на space
  this.hoverSpaceInterval = 30 - через какое количество милисекунд повторять движение таблицы
  */

  constructor(elem, options = {}) {
    this.elem = elem;
    this.options = options;

    this.clickThumbStep = options.clickThumbStep || 100;
    this.hoverSpaceStep = options.hoverSpaceStep || 10;
    this.hoverSpaceInterval = options.hoverSpaceInterval || 30;
    this.hoverSpaceIntervalId;
    this.thumbClickedFlag = false;
    this.thumbClickedCoords = 0;
    this.initialized = false;
    this.resizeTimeoutId = undefined;

    this.mounted();
  }

  mounted() {
    window.addEventListener('resize', () => {
      this.setContentWidth();
    });

    this.createHtml();
    this.createCss();

    this.initContentWidth();

    //document mouseup
    document.addEventListener('mouseup', () => {
      if (this.thumbClickedFlag) {
        this.ss.classList.remove('twpx-sticky-scroll--mousemove');
        this.thumbClickedFlag = false;
      }
    });

    //document mousemove
    document.addEventListener('mousemove', (e) => {
      if (this.thumbClickedFlag) {
        e.preventDefault();
        this.ss.classList.add('twpx-sticky-scroll--mousemove');
        let left =
          e.clientX -
          this.scrollbar.getBoundingClientRect().x -
          this.thumbClickedCoords;

        this.moveThumbAndContent(left);
      }
    });
  }

  init() {
    if (!this.initialized) {
      this.scrollbarEvents();
      this.scrollSpaceEvents();
      this.arrowEvents();
      this.initialized = true;
    }
    if (window.matchMedia('(min-width: 768px)').matches) {
      this.setThumbWidth();
    } else {
      this.ss.classList.add('twpx-sticky-scroll--invisible');
    }
  }

  createHtml() {
    this.ss = document.createElement('div');
    this.ss.className = 'twpx-sticky-scroll';
    this.ss.innerHTML = `
    <div class="twpx-sticky-scroll-space-right"></div>
      <div class="twpx-sticky-scroll-space-left"></div>

      <div class="twpx-sticky-scroll-arrows">
        <div class="twpx-sticky-scroll-arrow-right"></div>
        <div class="twpx-sticky-scroll-arrow-left"></div>
      </div>

      <div class="twpx-sticky-scroll-content-wrapper"></div>

      <div class="twpx-sticky-scroll-scrollbar">
        <div class="twpx-sticky-scroll-scrollbar-thumb"></div>
      </div>
    `;

    this.contentWrapper = this.ss.querySelector(
      '.twpx-sticky-scroll-content-wrapper'
    );
    this.scrollbar = this.ss.querySelector('.twpx-sticky-scroll-scrollbar');
    this.thumb = this.ss.querySelector('.twpx-sticky-scroll-scrollbar-thumb');

    this.spaceLeft = this.ss.querySelector('.twpx-sticky-scroll-space-left');
    this.spaceRight = this.ss.querySelector('.twpx-sticky-scroll-space-right');

    this.arrowLeft = this.ss.querySelector('.twpx-sticky-scroll-arrow-left');
    this.arrowRight = this.ss.querySelector('.twpx-sticky-scroll-arrow-right');

    this.elem.parentNode.insertBefore(this.ss, this.elem);

    this.contentWrapper.append(this.elem);

    this.content = this.elem;
  }

  createCss() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .twpx-sticky-scroll {
        position: relative;
      }
      .twpx-sticky-scroll-content-wrapper {
        overflow: hidden;
      }

      @media(max-width: 767px) {
        .twpx-sticky-scroll-content-wrapper {
          overflow-x: scroll;
        }
      }

      .twpx-sticky-scroll-scrollbar {
        height: 16px;
        background-color: ${this.options.scrollbarColor || '#f2f2f2'};
        border-radius: 8px;
        position: sticky;
        bottom: 10px;
        opacity: 0;
        -webkit-transition: opacity 0.3s ease;
        transition: opacity 0.3s ease;
        z-index: 50;
      }
      .twpx-sticky-scroll:hover .twpx-sticky-scroll-scrollbar {
        opacity: 1;
      }
      .twpx-sticky-scroll-scrollbar-thumb {
        width: 150px;
        height: 16px;
        background-color: ${this.options.thumbColor || '#ea5e21'};
        border-radius: 8px;
        cursor: default;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
      }
      .twpx-sticky-scroll-space-left,
      .twpx-sticky-scroll-space-right {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 50px;
        height: 100%;
        z-index: 10;
      }
      .twpx-sticky-scroll-space-right {
        right: 0;
        left: auto;
      }
      .twpx-sticky-scroll-arrows {
        position: sticky;
        top: 50%;
        left: 0;
        opacity: 0;
        -webkit-transition: opacity 0.3s ease;
        transition: opacity 0.3s ease;
        z-index: 60;
      }
      .twpx-sticky-scroll:hover .twpx-sticky-scroll-arrows {
        opacity: 1;
      }
      .twpx-sticky-scroll-arrow-left,
      .twpx-sticky-scroll-arrow-right {
        content: '';
        position: absolute;
        top: -32px;
        left: -32px;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0px 3px 6px #00000029;
        cursor: pointer;
        -webkit-transform: translateX(20px);
        transform: translateX(20px);
        -webkit-transition: background-color 0.3s ease, -webkit-transform 0.3s ease;
        transition: background-color 0.3s ease, transform 0.3s ease;
        z-index: 20;
      }
      .twpx-sticky-scroll-arrow-right {
        right: -32px;
        left: auto;
        -webkit-transform: translateX(-20px);
        transform: translateX(-20px);
      }
      .twpx-sticky-scroll-arrow-left:after,
      .twpx-sticky-scroll-arrow-right:after {
        content: '';
        position: absolute;
        top: 24px;
        right: 28px;
        width: 15px;
        height: 15px;
        border: 2px solid ${this.options.arrowColor || '#074b84'};
        border-bottom-color: transparent;
        border-left-color: transparent;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        z-index: 30;
      }
      .twpx-sticky-scroll-arrow-left:after {
        -webkit-transform: rotate(-135deg);
        transform: rotate(-135deg);
        left: 28px;
        right: auto;
      }
      .twpx-sticky-scroll-arrow-right:hover,
      .twpx-sticky-scroll-arrow-left:hover {
        background-color: ${this.options.arrowHoverColor || '#f2762e'};
      }
      .twpx-sticky-scroll-arrow-right:hover:after,
      .twpx-sticky-scroll-arrow-left:hover:after {
        border-top-color: #fff;
        border-right-color: #fff;
      }
      .twpx-sticky-scroll:hover .twpx-sticky-scroll-arrow-right,
      .twpx-sticky-scroll:hover .twpx-sticky-scroll-arrow-left {
        transform: translateX(0);
        -webkit-transform: translateX(0);
      }
      .twpx-sticky-scroll--invisible .twpx-sticky-scroll-space-right,
      .twpx-sticky-scroll--invisible .twpx-sticky-scroll-space-left,
      .twpx-sticky-scroll--invisible .twpx-sticky-scroll-arrows,
      .twpx-sticky-scroll--invisible .twpx-sticky-scroll-scrollbar {
        display: none;
      }

      .twpx-sticky-scroll--mousemove,
      .twpx-sticky-scroll--mousemove * {
        user-select: none;
      }

      @media(max-width 767px) {
      .twpx-sticky-scroll-scrollbar,
        .twpx-sticky-scroll-space-left,
        .twpx-sticky-scroll-space-right,
        .twpx-sticky-scroll-arrows {
          display: none !important;
        }
      }
    `;
    document.querySelector('head').appendChild(styleElement);
  }

  setContentWidth() {
    this.content.style.width = 'auto';

    if (this.resizeTimeoutId) {
      clearInterval(this.resizeTimeoutId);
    }

    this.resizeTimeoutId = setTimeout(() => {
      if (this.content) {
        if (this.content.querySelector('table.table')) {
          this.content.style.width = `${
            this.content.querySelector('table.table').clientWidth
          }px`;
        } else if (this.content.firstElementChild) {
          this.content.style.width = `${this.content.firstElementChild.clientWidth}px`;
        }

        setTimeout(() => {
          this.init();
        }, 0);
      }
    }, 200);
  }

  async initContentWidth() {
    do {
      if (
        !this.content ||
        (!this.content.querySelector('table.table') &&
          !this.content.firstElementChild)
      ) {
        await new Promise((r) => setTimeout(r, 500));
      } else {
        this.setContentWidth();
        break;
      }
    } while (true);
  }

  setThumbWidth() {
    const ratio = this.contentWrapper.clientWidth / this.content.clientWidth;

    if (ratio >= 1) {
      this.ss.classList.add('twpx-sticky-scroll--invisible');
    } else {
      this.ss.classList.remove('twpx-sticky-scroll--invisible');

      setTimeout(() => {
        this.thumb.style.width = `${this.scrollbar.clientWidth * ratio}px`;

        this.setDelta();
      }, 0);
    }
  }

  setDelta() {
    this.scrollbarDelta = this.scrollbar.clientWidth - this.thumb.clientWidth;
    this.contentDelta =
      this.content.clientWidth - this.contentWrapper.clientWidth;
  }

  scrollbarEvents() {
    //thumb mousedown
    this.thumb.addEventListener('mousedown', (e) => {
      this.thumbClickedFlag = true;
      this.thumbClickedCoords =
        e.clientX - this.thumb.getBoundingClientRect().x;
    });

    //thumb mouseup
    document.addEventListener('mouseup', (e) => {
      if (this.thumbClickedFlag) {
        this.thumbClickedFlag = false;
      }
    });

    //thumb click
    this.thumb.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    //thumb mousemove
    document.addEventListener('mousemove', (e) => {
      e.preventDefault();

      if (this.thumbClickedFlag) {
        let left =
          e.clientX -
          this.scrollbar.getBoundingClientRect().x -
          this.thumbClickedCoords;

        this.moveThumbAndContent(left);
      }
    });

    //scrollbar click
    this.scrollbar.addEventListener('click', (e) => {
      e.preventDefault();

      const scrollbarX = this.scrollbar.getBoundingClientRect().x;
      const thumbX = this.thumb.getBoundingClientRect().x;
      let step = this.clickThumbStep;

      if (e.clientX - thumbX < 0) {
        step = -1 * this.clickThumbStep;
      }

      let left = thumbX - scrollbarX + step;
      this.moveThumbAndContent(left);
    });
  }

  scrollSpaceEvents() {
    //space left mouseover
    this.spaceLeft.addEventListener('mouseover', () => {
      this.hoverSpaceIntervalId = setInterval(() => {
        let left = this.contentWrapper.scrollLeft - this.hoverSpaceStep;
        this.moveContentAndThumb(left);
      }, this.hoverSpaceInterval);
    });

    //space left mouseout
    this.spaceLeft.addEventListener('mouseout', () => {
      clearInterval(this.hoverSpaceIntervalId);
    });

    //space right mouseover
    this.spaceRight.addEventListener('mouseover', () => {
      this.hoverSpaceIntervalId = setInterval(() => {
        let left = this.contentWrapper.scrollLeft + this.hoverSpaceStep;
        this.moveContentAndThumb(left);
      }, this.hoverSpaceInterval);
    });

    //space right mouseout
    this.spaceRight.addEventListener('mouseout', () => {
      clearInterval(this.hoverSpaceIntervalId);
    });
  }

  arrowEvents() {
    //arrow left mouseover
    this.arrowLeft.addEventListener('mouseover', () => {
      this.hoverSpaceIntervalId = setInterval(() => {
        let left = this.contentWrapper.scrollLeft - this.hoverSpaceStep;
        this.moveContentAndThumb(left);
      }, this.hoverSpaceInterval);
    });

    //arrow left mouseout
    this.arrowLeft.addEventListener('mouseout', () => {
      clearInterval(this.hoverSpaceIntervalId);
    });

    //arrow right mouseover
    this.arrowRight.addEventListener('mouseover', () => {
      this.hoverSpaceIntervalId = setInterval(() => {
        let left = this.contentWrapper.scrollLeft + this.hoverSpaceStep;
        this.moveContentAndThumb(left);
      }, this.hoverSpaceInterval);
    });

    //arrow right mouseout
    this.arrowRight.addEventListener('mouseout', () => {
      clearInterval(this.hoverSpaceIntervalId);
    });
  }

  moveThumbAndContent(left) {
    if (left > this.scrollbarDelta) {
      left = this.scrollbarDelta;
    } else if (left < 0) {
      left = 0;
    }

    this.thumb.style.left = `${left}px`;

    //move content
    let contentDelta;

    if (left === this.scrollbarDelta) {
      contentDelta = this.contentDelta;
    } else if (left === 0) {
      contentDelta = 0;
      left = 0;
    } else {
      contentDelta = (left / this.scrollbarDelta) * this.contentDelta;
    }

    this.contentWrapper.scrollTo(contentDelta, 0);
  }

  moveContentAndThumb(left) {
    if (left > this.contentDelta) {
      left = this.contentDelta;
      clearInterval(this.hoverSpaceIntervalId);
    } else if (left < 0) {
      left = 0;
      clearInterval(this.hoverSpaceIntervalId);
    }

    this.contentWrapper.scrollTo(left, 0);

    //move content
    let scrollDelta;

    if (left === this.contentDelta) {
      scrollDelta = this.scrollbarDelta;
    } else if (left === 0) {
      scrollDelta = 0;
      left = 0;
    } else {
      scrollDelta = (left / this.contentDelta) * this.scrollbarDelta;
    }

    this.thumb.style.left = `${scrollDelta}px`;
  }
}

document.querySelectorAll('.sticky-scroll').forEach((elem) => {
  new twpxStickyScroll(elem);
});
