(function ($) {
  'use strict';

  $(function () {
    //on load hightlight the sorted column
    var urlQuery = parseQuery(window.location.search);
    if (urlQuery.field && urlQuery.sort) {
      var $thElements = $('.b-registry-excerpt th');
      var $th = $('[data-field=' + urlQuery.field + ']');

      $th.data({ sort: urlQuery.sort });

      var index = $thElements.index($th);
      $thElements.removeClass('asc').removeClass('desc');
      $th.addClass(urlQuery.sort);
      $('.b-registry-excerpt tbody')
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
    // $( '.b-registry-excerpt' ).delegate( 'tbody tr', 'click', function() {
    //   window.location = $( this ).data( 'url' );
    // });

    //th click, sorting
    $('.b-registry-excerpt th').click(function () {
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
            var $pagination = $('.b-registry-excerpt .b-pagination-block');
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
