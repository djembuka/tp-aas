window.addEventListener('load', () => {
  function init() {
    const div = document.getElementById('sroaasPollWidget');
    const script = document.getElementById('sroaasPollWidgetJS');
    const id = parseQuery(script.getAttribute('src').split('?')[1]).id;

    fetch(`https://sroaas.ru/api/widget/widget.php?CODE=${id}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject();
        }
        return response.text();
      })
      .then((text) => (div.innerHTML = text))
      .catch(() => {
        throw Error('Ошибка получения контента');
      });
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

  init();
});
