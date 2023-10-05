(function ($) {
  'use strict';

  $(function () {
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
        .querySelectorAll('.b-study-courses-detail table.table td')
        .forEach((td) => {
          td.addEventListener('click', () => {
            copyToClipboard(td.textContent, td);
          });
        });
    }

    //tabs
    document
      .querySelectorAll('.b-study-courses-detail')
      .forEach(function (elem) {
        var nav = elem.querySelector('.b-study-courses-detail__tabs');
        var menuLinks = nav.querySelectorAll('a');
        var tabsItems = elem.querySelectorAll('.b-study-courses-detail__item');

        //swiper menu
        if (window.matchMedia('(max-width: 600px)').matches) {
          var slidesPerView = 2.5;

          if (window.matchMedia('(min-width: 500px)').matches) {
            slidesPerView = 3;
          }

          //init swiper
          new Swiper(
            elem.querySelector(
              '.b-study-courses-detail__tabs .swiper-container'
            ),
            {
              slidesPerView: slidesPerView,
              spaceBetween: 30,
              freeMode: true,
            }
          );

          //scroll
          window.addEventListener('scroll', function () {
            if (
              elem
                .querySelector('.b-study-courses-detail__tabs')
                .className.search('animate') !== -1
            ) {
              return;
            }

            if (
              $(elem).offset().top <=
              window.scrollY + window.outerHeight - 250
            ) {
              elem
                .querySelector('.b-study-courses-detail__tabs')
                .classList.add('animate');
            }
          });

          setTimeout(function () {
            window.dispatchEvent(new Event('scroll'));
          }, 500);
        }

        //decor line
        var decorLine = elem.querySelector('.b-study-courses-detail__decor');
        var swiperWrapper = elem.querySelector(
          '.b-study-courses-detail__tabs .swiper-wrapper'
        );
        var trans = swiperWrapper.style.transform;
        var pos = trans.indexOf('(');
        setTimeout(function () {
          decorLine.style.left =
            menuLinks[0].offsetLeft +
            parseInt(trans.substr(pos + 1) || 0, 10) +
            'px';
          decorLine.style.width = menuLinks[0].offsetWidth + 'px';
        }, 500);

        menuLinks.forEach(function (menuLink) {
          menuLink.addEventListener('click', function (e) {
            e.preventDefault();

            var tab = menuLink.getAttribute('data-tab');

            //highlight nav
            menuLinks.forEach(function (m) {
              m.classList.remove('active');
            });
            menuLink.classList.add('active');

            //highlight tabs
            tabsItems.forEach(function (t) {
              t.classList.remove('active');
            });
            elem
              .querySelector(`.b-study-courses-detail__item[data-tab=${tab}]`)
              .classList.add('active');

            //underline
            decorLine.style.width = `${menuLink.clientWidth}px`;
            decorLine.style.left = `${
              menuLink.getBoundingClientRect().left -
              nav.getBoundingClientRect().left
            }px`;

            //url
            var query = parseQuery(window.location.search);
            query.tab = tab;
            history.replaceState({}, '', getQuery(query));
          });
        });

        //on load
        var tab = parseQuery(window.location.search).tab;
        if (tab) {
          setTimeout(function () {
            nav.querySelector(`[data-tab=${tab}]`).click();
          }, 500);
        }
      });

    //table
    if (window.studyCoursesListReady) return;
    window.studyCoursesListReady = true;
    //on load hightlight the sorted column
    var urlQuery = parseQuery(window.location.search);
    if (urlQuery.field && urlQuery.sort) {
      var $thElements = $('.b-study-courses-detail th');
      var $th = $('[data-field=' + urlQuery.field + ']');

      $th.data({ sort: urlQuery.sort });

      var index = $thElements.index($th);
      $thElements.removeClass('asc').removeClass('desc');
      $th.addClass(urlQuery.sort);
      $('.b-study-courses-detail tbody')
        .find('tr')
        .each(function () {
          $(this)
            .find('td:eq(' + index + ')')
            .removeClass('asc')
            .removeClass('desc')
            .addClass(urlQuery.sort);
        });
    }

    //tr click
    // $( '.b-study-courses-detail' ).delegate( 'tbody tr', 'click', function() {
    //   window.location = $( this ).data( 'url' );
    // });

    //th click, sorting
    $('.b-study-courses-detail th').click(function () {
      var $th = $(this);
      var $table = $th.closest('table');
      var $thElements = $table.find('th');
      var $tbody = $table.find('tbody');
      var url = $table.data('result');

      //set field and sort variables
      var field = $th.data('field'),
        sort;

      //set sort
      if (!$th.data('sort')) {
        $thElements.data({ sort: undefined });
        $th.data({ sort: 'asc' });
      } else {
        if ($th.data('sort') === 'asc') {
          $thElements.data({ sort: undefined });
          $th.data({ sort: 'desc' });
        } else {
          $thElements.data({ sort: undefined });
          $th.data({ sort: 'asc' });
        }
      }

      sort = $th.data('sort');

      //send ajax
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        data: { field: field, sort: sort },
        success: function (json) {
          if (typeof json === 'object' && json.TBODY && json.PAGINATION) {
            //set tbody
            $tbody.html(json.TBODY);

            //set pagination
            var $pagination = $('.b-study-courses-detail .b-pagination-block');
            $pagination.after(json.PAGINATION);
            $pagination.remove();

            //hightlight column
            var index = $table.find('th').index($th);
            $thElements.removeClass('asc').removeClass('desc');
            $th.addClass(sort);
            $tbody.find('tr').each(function () {
              $(this)
                .find('td:eq(' + index + ')')
                .removeClass('asc')
                .removeClass('desc')
                .addClass(sort);
            });

            //set URL
            var urlQuery = parseQuery(window.location.search);
            urlQuery.field = field;
            urlQuery.sort = sort;
            delete urlQuery.PAGEN_1;
            window.history.replaceState({}, '', getQuery(urlQuery));
          }
        },
        error: function (a, b, c) {
          if (window.console) {
            console.log(a);
            console.log(b);
            console.log(c);
          }
        },
      });
    });

    function getQuery(queryObject) {
      var result = [];
      for (var k in queryObject) {
        result.push(k + '=' + queryObject[k]);
      }
      return '?' + result.join('&');
    }

    function parseQuery(queryString) {
      var query = {};
      var pairs = [];
      if (queryString) {
        pairs = (
          queryString[0] === '?' ? queryString.substr(1) : queryString
        ).split('&');
      }
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }
      return query;
    }
  });
})(jQuery);
