String.prototype.deformat = function () {
  return Number(this.toString().replace(/\D/g, '').split(' ').join(''));
};

window.onload = function () {
  if (
    window.jQuery &&
    document.querySelectorAll('.b-poll-result .b-poll-result__tabs').length
  ) {
    //tabs
    document.querySelectorAll('.b-poll-result').forEach(function (elem) {
      var nav = elem.querySelector('.b-poll-result__tabs');
      var menuLinks = nav.querySelectorAll('a');
      var tabsItems = elem.querySelectorAll('.b-poll-result__item');

      //swiper menu
      if (window.matchMedia('(max-width: 600px)').matches) {
        var slidesPerView = 2.5;

        if (window.matchMedia('(min-width: 500px)').matches) {
          slidesPerView = 3;
        }

        //init swiper
        new Swiper(
          elem.querySelector('.b-poll-result__tabs .swiper-container'),
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
              .querySelector('.b-poll-result__tabs')
              .className.search('animate') !== -1
          ) {
            return;
          }

          if (
            $(elem).offset().top <=
            window.scrollY + window.outerHeight - 250
          ) {
            elem.querySelector('.b-poll-result__tabs').classList.add('animate');
          }
        });

        setTimeout(function () {
          window.dispatchEvent(new Event('scroll'));
        }, 500);
      }

      //decor line
      var decorLine = elem.querySelector('.b-poll-result__decor');
      var swiperWrapper = elem.querySelector(
        '.b-poll-result__tabs .swiper-wrapper'
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

          let tab = menuLink.getAttribute('data-tab');

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
            .querySelector(`.b-poll-result__item[data-tab=${tab}]`)
            .classList.add('active');

          //underline
          decorLine.style.width = `${menuLink.clientWidth}px`;
          decorLine.style.left = `${
            menuLink.getBoundingClientRect().left -
            nav.getBoundingClientRect().left
          }px`;

          //url
          let query = parseQuery(window.location.search);
          query.tab = tab;
          history.replaceState({}, '', getQuery(query));
        });
      });

      //on load
      let tab = parseQuery(window.location.search).tab;
      if (tab) {
        setTimeout(function () {
          nav.querySelector(`[data-tab=${tab}]`).click();
        }, 500);
      }
    });

    //th click, sorting
    $('.b-poll-result th').click(function () {
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
            var $pagination = $('.b-study-courses-list .b-pagination-block');
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
  }

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

  //set ordernum and percentage to the answers
  window.pollResultStore.groups.forEach((group) => {
    group.questions.forEach((question) => {
      let numArray = [];
      question.answers.forEach(function (answer) {
        numArray.push(String(answer.votes).deformat());
      });

      //get maximum
      const maxNum = Math.max.apply(null, numArray);

      question.answers.forEach(function (answer, index) {
        answer.ordernum = index;
        answer.percentage =
          Math.round((String(answer.votes).deformat() * 100) / maxNum) + '%';
      });
    });
  });

  //observers
  let callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        let event = new Event('showeffect');
        entry.target.dispatchEvent(event);
      }
    });
  };

  let observer = new IntersectionObserver(callback, { threshold: 1 });

  //poll vue application
  if (!window.Vue && !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: window.pollResultStore,
    mutations: {
      changeChecked(state, payload) {
        state.groups[payload.groupIndex].questions[
          payload.questionIndex
        ].answers[payload.answerIndex].checked = payload.checked;
      },
    },
  });

  Vue.component('switchButton', {
    data() {
      return {};
    },
    props: ['answers'],
    template: `
      <div class="b-switch-button inverse"><span @click="clickLeft()">По рейтингу</span><span @click="clickRight()">По порядку</span></div>
    `,
    methods: {
      clickLeft() {
        //slide switch button
        this.$el.classList.remove('inverse');
        //sort the answers by votes
        this.answers.sort((a, b) => {
          return String(b.votes).deformat() - String(a.votes).deformat();
        });
        //show effect
        this.showAnswersEffect();
      },
      clickRight() {
        //slide switch button
        this.$el.classList.add('inverse');
        //sort the answers by ordernum
        this.answers.sort((a, b) => {
          return Number(a.ordernum) - Number(b.ordernum);
        });
        //show effect
        this.showAnswersEffect();
      },
      showAnswersEffect() {
        let event = new Event('showeffect');
        this.$el
          .closest('.b-poll-result__questions__item')
          .querySelectorAll('.b-poll-result__answers__item')
          .forEach((answer) => {
            answer.dispatchEvent(event);
          });
      },
    },
  });

  Vue.component('pollQuestion', {
    data() {
      return {};
    },
    props: ['question'],
    template: `
      <div class="b-poll-result__questions__item">
        <div class="d-block d-sm-flex justify-content-between">
          <div class="b-poll-result__questions__header">
            <h3>{{question.title}}</h3>
            <p v-html="question.description"></p>
          </div>
          <hr class="d-block d-sm-none">
          <switch-button :answers="question.answers"></switch-button>
        </div>
        <hr class="d-block d-sm-none">
        <div class="b-poll-result__answers">
          <poll-answer v-for="(answer, index) in question.answers" :index="index" :answer="answer"></poll-answer>
        </div>
      </div>
    `,
    methods: {},
  });

  Vue.component('pollAnswer', {
    data() {
      return {};
    },
    props: ['answer', 'index'],
    template: `
      <div class="b-poll-result__answers__item" :data-percentage="answer.percentage" @showeffect="showEffect()">
        <div class="b-poll-result__answer-title" v-html="'<span>'+(index+1)+'. </span>'+answer.title"></div>
        <div class="b-poll-result__answer-graph b-graph">
          <div class="b-graph__wrapper">
            <div class="b-graph__img"></div>
            <div class="b-graph__num">{{answer.votes}}</div>
          </div>
        </div>
      </div>
    `,
    methods: {
      showEffect() {
        const wrapper = this.$el.querySelector('.b-graph__wrapper');
        wrapper.style.width = 0;
        setTimeout(() => {
          wrapper.style.width = this.$el.getAttribute('data-percentage');
        }, 0);
      },
    },
  });

  let pollResultApp = new Vue({
    el: '#pollResult',
    store,
    data() {
      return {
        pollData: store.state,
      };
    },
    methods: {},
    beforeMount() {
      window.pollResultStore.groups[0].questions.forEach((q) => {
        if (q.sort === 'rating') {
          q.answers.sort((a, b) => {
            return String(b.votes).deformat() - String(a.votes).deformat();
          });
        }
      });
    },
    mounted() {
      document
        .querySelectorAll('.b-poll-result__answers__item')
        .forEach(function (answer) {
          observer.observe(answer);
        });
    },
  });
};
