//Yandex browser <= 17
if (document.getElementById('ieAlertModal') && isYabrowserLT18()) {
  $('#ieAlertModal').modal('show');
  // $('#ieAlertModal').on('hide.bs.modal', function (event) {
  //   window.location.href = window.backUrl;
  // });
}

function isYabrowserLT18() {
  const matches = navigator.userAgent.match(/YaBrowser\/(\d*)/);
  return matches && 1 * matches[1] <= 18 ? true : false;
}

//h1
/*var elem = document.querySelector('h1');
if (elem) {
  elem.classList.add('no-transition');
  var fontSize = parseInt(window.getComputedStyle(elem)['font-size']);
  var i = 0;
  do {
    i++;
    elem.setAttribute('style', 'font-size: ' + (1 * fontSize - i) + 'px');
  } while (
    elem.clientHeight >
    Math.floor(parseInt(window.getComputedStyle(elem)['line-height'])) * 4
  );
}*/

//change&edit info
(function () {
  if (window.changeEditInfo) {
    var h1 = document.querySelector('h1');

    if (!h1) return;

    h1.classList.add('h1--margin-right');
    var elem = document.createElement('div');
    elem.className = 'b-change-edit-info';
    elem.innerHTML = `<div class="b-change-edit-info-text">${window.changeEditInfo}</div>`;

    if (window.matchMedia('(max-width: 767px)').matches) {
      h1.after(elem);
    } else {
      h1.before(elem);
    }
  }
})();

//select
$('select:not(.select--link)').ikSelect({
  equalWidths: true,
  ddCustomClass: 'ik-custom-class',
});

//price format
Number.prototype.format = function () {
  return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
};
// Number(4546546).format(); //'4 546 546'

String.prototype.deformat = function () {
  var result = this.toString().replace(/\D/g, '').split(' ').join('');
  return result === '' ? result : Number(result);
};
// String('2 150 000').deformat(); //2150000

//phone mask
document.querySelectorAll('[type=tel]').forEach(function (input) {
  if (input.classList.contains('twpx-form-control__input')) return;
  var phoneMask = IMask(input, {
    mask: '+{7} (000) 000 00 00',
  });
});

//input--num
document.querySelectorAll('.input--num').forEach(function (input) {
  var mask = IMask(input, {
    mask: Number,
    scale: 3,
    signed: false,
    radix: '.',
    mapToRadix: [','],
  });
  var spanNum = input.parentNode.querySelector('.span--num');
  if (spanNum) {
    input.addEventListener('keyup', function (e) {
      spanNum.classList.add('show--num');
    });
    input.addEventListener('blur', function (e) {
      if (input.value === '') {
        spanNum.classList.remove('show--num');
      }
    });
  }
});

//td click
document.querySelectorAll('.table').forEach(function (table) {
  table.addEventListener('click', function (e) {
    if (
      e.target.matches('td') &&
      e.target.closest('tr').getAttribute('data-url')
    ) {
      e.preventDefault();
      e.stopPropagation();
      var target =
        e.target.closest('tr').getAttribute('data-target') || '_blank';
      window.open(e.target.closest('tr').getAttribute('data-url'), target);
    }
  });
});

setTimeout(function () {
  document.querySelectorAll('textarea').forEach(function (textarea) {
    textarea.addEventListener('input', function () {
      //this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
  });
}, 3000);

//dropdown columns
/*if (window.matchMedia('(min-width: 768px)').matches) {
  //desktop

  setTimeout(function () {
    document
      .querySelectorAll('.b-header__menu-dropdown')
      .forEach(function (dropdown) {
        var headerTest = dropdown;
        var headerTestHeight = headerTest.offsetHeight;
        var columnsNum = 4;
        var headerTestColumnHeight = headerTestHeight / columnsNum;
        var headerTestItems = headerTest.querySelectorAll(
          '.b-header__menu-dropdown__item'
        );

        //count column height
        var headerTestHeightTemp = headerTestHeight;
        headerTestItems.forEach(function (item) {
          var itemHeight = item.offsetHeight;
          if (itemHeight > headerTestColumnHeight && columnsNum > 0) {
            headerTestHeightTemp -= itemHeight;
            headerTestColumnHeight = headerTestHeightTemp / --columnsNum;
          }
        });

        //put items into columns
        columnsNum = 4;
        var startIndex = -1;
        var column;
        var headerTestWrapper = document.createElement('div');
        headerTestWrapper.classList.add('b-header__menu-dropdown__wrap');
        headerTest.classList.add('wide');
        headerTest.appendChild(headerTestWrapper);

        for (var i = 0; i < columnsNum; i++) {
          column = document.createElement('div');
          column.classList.add('b-header__menu-dropdown__column');
          headerTestWrapper.appendChild(column);

          for (var j = ++startIndex; j < headerTestItems.length; j++) {
            column.appendChild(headerTestItems[j]);
            startIndex = j;
            if (column.offsetHeight > headerTestColumnHeight && i !== 3) {
              if (
                column.querySelectorAll('.b-header__menu-dropdown__item')
                  .length > 1
              ) {
                startIndex = --j;
              } else {
                startIndex = j;
              }
              break;
            }
          }
        }
        headerTest.classList.add('ready');
      });
  }, 1000);
}*/

//not authorized
if (document.querySelector('.b-header__profile .btn')) {
  document.querySelector('body').classList.add('not-authorized');
}

//placeholders
setTimeout(function () {
  $('.ph-block, .b-breadcrumbs').addClass('ph-block--animated');
}, 500);

//header menu items width
if (window.matchMedia('(min-width: 768px)').matches) {
  //desktop
  var menuItemsWidthArray = [];
  document
    .querySelectorAll('.b-header__menu-item')
    .forEach(function (menuItem) {
      menuItemsWidthArray.push(menuItem.offsetWidth);
    });

  setMenuItemsVisibility();

  window.addEventListener('resize', function (e) {
    setMenuItemsVisibility();
  });
}

function setMenuItemsVisibility() {
  var menuItemsWidth = 0;
  var space = document.querySelector('.b-header__menu').offsetWidth - 50;
  var hiddenIndex = menuItemsWidthArray.length;

  var i = 0;
  while (menuItemsWidth < space) {
    if (menuItemsWidthArray[i]) {
      menuItemsWidth += menuItemsWidthArray[i] + 30;
      i++;
    } else {
      i++;
      break;
    }
  }
  hiddenIndex = i - 1;

  if (hiddenIndex < 0) {
    hiddenIndex = 0;
  }

  for (var j = 0; j < hiddenIndex; j++) {
    document
      .querySelectorAll('.b-header__menu-item')
      [j].removeAttribute('style');
  }

  for (var k = hiddenIndex; k < menuItemsWidthArray.length; k++) {
    document.querySelectorAll('.b-header__menu-item')[k].style.display = 'none';
  }
}

//header search
document
  .querySelector('.b-header__search-icon')
  .addEventListener('click', function (e) {
    e.preventDefault();
    document
      .querySelector('.b-header__bottom')
      .classList.toggle('b-header__bottom--search');
    document.querySelector('.b-header__search input').focus();
    return false;
  });

document
  .querySelector('.b-header__search input')
  .addEventListener('blur', function () {
    document
      .querySelector('.b-header__bottom')
      .classList.remove('b-header__bottom--search');
  });

document
  .querySelector('.b-header__cancel-icon')
  .addEventListener('click', function (e) {
    e.preventDefault();
    document
      .querySelector('.b-header__bottom')
      .classList.remove('b-header__bottom--search');
    //document.querySelector( '.b-header__search input' ).value = '';
    return false;
  });

//header dropdown
var headerDropdownId = [];
document
  .querySelectorAll('.b-header__menu-item')
  .forEach(function (elem, index) {
    if (window.matchMedia('(min-width: 768px)').matches) {
      //desktop
      if (elem.querySelector('.b-header__menu-dropdown')) {
        //dropdown

        elem.addEventListener('mouseenter', function (e) {
          e.stopPropagation();
          clearTimeout(headerDropdownId[index]);
          headerDropdownId[index] = setTimeout(function () {
            $(elem).find('.b-header__menu-dropdown').slideDown(400);
          }, 100);
        });

        elem.addEventListener('mouseleave', function (e) {
          e.stopPropagation();
          clearTimeout(headerDropdownId[index]);
          headerDropdownId[index] = setTimeout(function () {
            $(elem).find('.b-header__menu-dropdown').slideUp(200);
          }, 300);
        });
      }
    } else {
      //mobile

      if (elem.querySelector('.b-header__menu-dropdown')) {
        elem.addEventListener('click', function (e) {
          e.preventDefault();
          $(this).find('.b-header__menu-dropdown').slideToggle(300);
          elem.classList.toggle('open');
        });
      }
    }
  });

if (window.matchMedia('(max-width: 767px)').matches) {
  //mobile
  document
    .querySelectorAll('.b-header__menu-item span a')
    .forEach(function (elem) {
      //link
      elem.addEventListener('click', function (e) {
        e.stopPropagation();
        return true;
      });
    });

  document
    .querySelectorAll('.b-header__menu-dropdown a')
    .forEach(function (elem) {
      elem.addEventListener('click', function (e) {
        e.stopPropagation();
        return true;
      });
    });
}

//header dropdown sandwich
(function() {
  const icon = document
  .querySelector('.b-header__menu-icon');
  
  icon.addEventListener('click', function (e) {
    e.preventDefault();

    if ($('.b-header__bottom').is(':visible')) {
      document.querySelector('body').classList.remove('shutter');
    } else {
      document.querySelector('body').classList.add('shutter');
    }

    $('.b-header__bottom').stop().slideToggle().toggleClass('open-sandwich');
    $('.b-header__profile-menu').hide().removeClass('open-sandwich');
  });
})();

  

//profile dropdown
(function() {
  const icon = document
  .querySelector('.b-header__profile-icon');
  
  icon.addEventListener('click', function (e) {
    e.preventDefault();

    if ($('.b-header__profile-menu').is(':visible')) {
      document.querySelector('body').classList.remove('shutter');
    } else {
      document.querySelector('body').classList.add('shutter');
    }

    $('.b-header__profile-menu')
      .stop()
      .slideToggle()
      .toggleClass('open-sandwich');
    $('.b-header__bottom').hide().removeClass('open-sandwich');
  });
})();

//shutter
document
  .querySelector('.b-body-shutter')
  .addEventListener('click', function (e) {
    e.preventDefault();
    $('.b-header__bottom').stop().slideUp().removeClass('open-sandwich');
    $('.b-header__profile-menu').stop().slideUp().removeClass('open-sandwich');
    document.querySelector('body').classList.remove('shutter');
  });

//header scroll
var widthTimeoutId;
var menuWidthTimeoutId;
if (window.matchMedia('(min-width: 768px)').matches) {
  var height = document.querySelector('.b-header').offsetHeight - 86;
  window.addEventListener('scroll', function (e) {
    if (window.scrollY >= height) {
      document.querySelector('body').classList.add('header-fixed');
      //profile width
      clearTimeout(widthTimeoutId);
      widthTimeoutId = setTimeout(function () {
        $('.b-header__profile').addClass('width');
      }, 500);
      //menu width
      document.querySelector('.b-header__menu').classList.add('nowrap');
      setMenuItemsVisibility();
      clearTimeout(menuWidthTimeoutId);
      menuWidthTimeoutId = setTimeout(function () {
        setMenuItemsVisibility();
        document.querySelector('.b-header__menu').classList.remove('nowrap');
      }, 300);
    } else {
      document.querySelector('body').classList.remove('header-fixed');
      //profile width
      clearTimeout(widthTimeoutId);
      $('.b-header__profile').removeClass('width');
      //menu width
      document.querySelector('.b-header__menu').classList.add('nowrap');
      setMenuItemsVisibility();
      clearTimeout(menuWidthTimeoutId);
      menuWidthTimeoutId = setTimeout(function () {
        setMenuItemsVisibility();
        document.querySelector('.b-header__menu').classList.remove('nowrap');
      }, 300);
    }
  });

  window.dispatchEvent(new Event('scroll'));
}
