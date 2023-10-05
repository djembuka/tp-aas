//tabs
document.querySelectorAll('.b-tabs').forEach(function (tabsBlock) {
  var nav = tabsBlock.querySelector('.b-tabs__nav');
  var urlTab = parseQuery(window.location.search).tab;
  var navFirstItem = tabsBlock.querySelector(
    `.b-tabs__nav__item${urlTab ? '[data-tab=' + urlTab + ']' : ''}`
  );
  var navItems = tabsBlock.querySelectorAll('.b-tabs__nav__item');
  var underline = tabsBlock.querySelector('.b-tabs__nav__underline');
  var tabsItems = tabsBlock.querySelectorAll('.b-tabs__tabs__item');

  navItems.forEach(function (navItem) {
    navItem.addEventListener('click', function (e) {
      e.preventDefault();

      var tab = navItem.getAttribute('data-tab');

      //highlight nav
      navItems.forEach(function (n) {
        n.classList.remove('b-tab__nav__item--active');
      });
      navItem.classList.add('b-tab__nav__item--active');

      //highlight tabs
      tabsItems.forEach(function (t) {
        t.classList.remove('b-tabs__tabs__item--active');
      });
      tabsBlock
        .querySelector(`.b-tabs__tabs__item[data-tab=${tab}]`)
        .classList.add('b-tabs__tabs__item--active');

      //underline
      underline.style.width = `${navItem.clientWidth}px`;
      underline.style.left = `${
        navItem.getBoundingClientRect().left - nav.getBoundingClientRect().left
      }px`;

      //url
      var query = parseQuery(window.location.search);
      query.tab = tab;
      history.replaceState({}, '', getQuery(query));
    });
  });

  //first load
  navFirstItem.click();
});

function getQuery(queryObject) {
  var result = [];
  for (var k in queryObject) {
    if (k) {
      result.push(k + '=' + queryObject[k]);
    }
  }
  return '?' + result.join('&');
}

function parseQuery(queryString) {
  var query = {};
  var pairs = (
    queryString[0] === '?' ? queryString.substr(1) : queryString
  ).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}
