String.prototype.deformat = function () {
  return Number(this.toString().replace(/\D/g, '').split(' ').join(''));
};

window.addEventListener('load', () => {
  if (window.jQuery) {
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
        numArray.push(
          typeof answer.votes === 'object'
            ? answer.votes[0] + answer.votes[1]
            : answer.votes
        );
      });

      //get maximum
      const maxNum = Math.max.apply(null, numArray);

      question.answers.forEach(function (answer, index) {
        answer.ordernum = index;
        answer.percentage =
          Math.round(
            ((typeof answer.votes === 'object'
              ? answer.votes[0] + answer.votes[1]
              : answer.votes) *
              100) /
              maxNum
          ) + '%';
      });

      //sort by default
      question.answers.sort((a, b) => {
        return (
          (typeof b.votes === 'object' ? b.votes[0] + b.votes[1] : b.votes) -
          (typeof a.votes === 'object' ? a.votes[0] + a.votes[1] : a.votes)
        );
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
      <div class="b-switch-button"><span @click="clickLeft()">По рейтингу</span><span @click="clickRight()">По порядку</span></div>
    `,
    methods: {
      clickLeft() {
        //slide switch button
        this.$el.classList.remove('inverse');
        //sort the answers by votes
        this.answers.sort((a, b) => {
          return (
            (typeof b.votes === 'object' ? b.votes[0] + b.votes[1] : b.votes) -
            (typeof a.votes === 'object' ? a.votes[0] + a.votes[1] : a.votes)
          );
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
          <div v-for="(answer, index) in question.answers">
            <poll-answer-two-counts v-if="typeof answer.votes === 'object'" :index="index" :answer="answer"></poll-answer-two-counts>
            <poll-answer v-else :index="index" :answer="answer"></poll-answer>
          </div>
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
      <div class="b-poll-result__answers__item" @showeffect="showEffect()">
        <div class="b-poll-result__answer-title" v-html="'<span>'+(index+1)+'. </span>'+answer.title"></div>
        <div class="b-poll-result__answer-graph b-graph">
          <div class="b-graph__wrapper">
            <div class="b-graph__img"></div>
            <div class="b-graph__num">{{Number(answer.votes).toLocaleString()}}</div>
          </div>
        </div>
      </div>
    `,
    methods: {
      showEffect() {
        const wrapper = this.$el.querySelector('.b-graph__wrapper');
        wrapper.style.width = 0;
        console.log(wrapper);
        setTimeout(() => {
          wrapper.style.width = this.answer.percentage;
        }, 0);
      },
    },
  });

  Vue.component('pollAnswerTwoCounts', {
    data() {
      return {};
    },
    props: ['answer', 'index'],
    template: `
      <div class="b-poll-result__answers__item" @showeffect="showEffect()">
        <div class="b-poll-result__answer-title" v-html="'<span>'+(index+1)+'. </span>'+answer.title"></div>
        <div class="b-poll-result__answer-graph b-graph">
          <div class="b-graph__wrapper">
            <div class="b-graph__counts">
              <span :style="width1 + (answer.votes[0] ? '' : 'visibility: hidden;')">{{answer.votes[1] ? answer.votes[0] : ''}}</span>
              <span :style="width2 + (answer.votes[1] ? '' : 'display: none;')">{{answer.votes[0] ? answer.votes[1] : ''}}</span>
            </div>
            <div class="b-graph__num">{{Number(answer.votes[0] + answer.votes[1]).toLocaleString()}}</div>
          </div>
        </div>
      </div>
    `,
    computed: {
      width1() {
        const x = this.answer.votes[0];
        const y = this.answer.votes[1];
        return `width:calc(${(100 * x) / (x + y)}% ${y ? '- 18px' : ''});`;
      },
      width2() {
        const x = this.answer.votes[0];
        const y = this.answer.votes[1];
        return `width:calc(${(100 * y) / (x + y)}% ${x ? '+ 18px' : ''});`;
      },
    },
    methods: {
      showEffect() {
        const wrapper = this.$el.querySelector('.b-graph__wrapper');
        wrapper.style.width = 0;
        console.log(wrapper);
        setTimeout(() => {
          wrapper.style.width = this.answer.percentage;
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
});
