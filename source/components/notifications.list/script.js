/*The script works only on production*/

window.addEventListener('load', () => {
  function getQuery(queryObject) {
    var result = [];
    for (var k in queryObject) {
      result.push(k + '=' + queryObject[k]);
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

  if (!window.Vue || !window.Vuex || !window.BX) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      notifications: [],
      pagination: {
        perPage: 20,
        currentPage: 0,
      },
      bx: {
        sessid: window.BX.bitrix_sessid(),
        USER_ID: window.BX.message('USER_ID'),
        url: `${window.location.origin}/api/`,
      },
      subjectid: window.subjectid,
    },
    mutations: {
      setList(state, payload) {
        Vue.set(state, 'notifications', payload);
      },
      setNotifications(state, payload) {
        let i = state.notifications.findIndex((n) => n.ID === payload.ID);
        Vue.set(state.notifications, i, payload);
        //state.notifications.splice(state.pagination.currentPage * state.pagination.perPage, payload.length, ...payload);
      },
      setCurrentPage(state, payload) {
        Vue.set(state.pagination, 'currentPage', payload);
      },
    },
    getters: {
      currentPageNotifications(state) {
        return state.notifications.slice(
          state.pagination.currentPage * state.pagination.perPage,
          state.pagination.currentPage * state.pagination.perPage +
            state.pagination.perPage
        );
      },
    },
    actions: {
      async getList({ state, commit, dispatch }) {
        const formData = new FormData();

        let method = 'notifications.getList';
        if (this.$store.state.subjectid) {
          method = 'notifications.getListForSubject';
          formData.append('subjectid', this.$store.state.subjectid);
        }

        formData.append('sessid', state.bx.sessid);
        formData.append('userid', state.bx.USER_ID);
        formData.append('method', method);
        formData.append('popup_status', 2);
        formData.append('read_status', 2);
        formData.append('confirm_status', 2);
        formData.append('delete_status', 0);

        let res = await fetch(state.bx.url, {
          method: 'POST',
          body: formData,
        });
        let { response } = await res.json();
        if (!response || !response.length) return;

        commit('setList', response);
        dispatch('getNotifications');
      },
      async getNotifications({ state, commit, getters }) {
        const formData = new FormData();

        formData.append('sessid', state.bx.sessid);
        formData.append('userid', state.bx.USER_ID);
        formData.append('method', 'notifications.getNotification');

        getters.currentPageNotifications.forEach(async (item, i) => {
          if (item.UF_ACTIVE) return;

          //loader
          document
            .querySelector('.b-notifications-list .ph-content')
            .classList.add('content--load-circle');
          formData.set('id', item.ID);

          let res = await fetch(state.bx.url, {
            method: 'POST',
            body: formData,
          });

          let { response } = await res.json();
          if (!response) return;

          commit('setNotifications', response);

          if (i === getters.currentPageNotifications.length - 1) {
            document
              .querySelector('.b-notifications-list .ph-content')
              .classList.remove('content--load-circle');
          }
        });
      },
    },
  });

  //table
  Vue.component('notificationsListTable', {
    data() {
      return {};
    },
    template: `
      <table class="table table-responsive" data-result="/components/registry/result.json">
        <thead>
          <tr>
            <th data-field="title">Заголовок уведомления</th>
            <th data-field="status">Статус</th>
            <th data-field="date">Создано</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="notification in $store.getters.currentPageNotifications" :class="{'b-notifications-list--tainted': isTainted(notification)}" @click.prevent="window.location=window.notificationsDetailURL + '?ID=' + notification.ID" data-target="_self">
            <td> 
              <div :class="{'font-weight-bold': unread(notification)}">{{ notification.UF_HEADER || '&nbsp;' }}</div>
            </td>
            <td v-html="notification.UF_READ_STATUS ? getReadStatus(notification) : '&nbsp;'"></td>
            <td>{{ notification.UF_DATE_CREATION ? getDateString(notification.UF_DATE_CREATION) : '&nbsp;' }}</td>
          </tr>
        </tbody>
      </table>
    `,
    methods: {
      isTainted(notification) {
        let InAYearTimestamp =
          notification.UF_DATE_CREATION + 365 * 24 * 60 * 60;
        let currentTimestamp = parseInt(new Date().getTime() / 1000, 10);
        return (
          InAYearTimestamp - currentTimestamp < 0 && this.unread(notification)
        );
      },
      unread(notification) {
        return !Number(notification.UF_READ_STATUS);
      },
      getDateString(date) {
        let created = new Date(date * 1000);
        let day = String('0' + created.getDate());
        day = day.substring(day.length - 2);
        let month = '0' + (created.getMonth() + 1);
        month = month.substring(month.length - 2);

        return `${day}.${month}.${created.getFullYear()}`;
      },
      getReadStatus(notification) {
        return Number(notification.UF_READ_STATUS)
          ? 'Прочитано<br>' + this.getDateString(notification.UF_DATE_READ)
          : 'Не прочитано';
      },
    },
  });

  Vue.component('paginationBlock', {
    data() {
      return {
        visibleNum: 2,
      };
    },
    template: `<div class="b-pagination-block text-right ph-block" v-if="isVisible">
      <a href="#" v-for="(page, i) in startPagesNum" @click.prevent="click(i)" :class="{'b-pagination-block__current': i === $store.state.pagination.currentPage}">{{ i+1 }}</a>
      <span v-if="ellipsisContent" v-html="ellipsisContent"></span>
      <a href="#" v-for="(page, i) in endPagesNum" @click.prevent="click(pagesNum - endPagesNum + i)" :class="{'b-pagination-block__current': (pagesNum - endPagesNum + i) === $store.state.pagination.currentPage}">{{ pagesNum - endPagesNum + i+1 }}</a>
      <a href="" @click.prevent="prev" v-if="prevVisible">Предыдущая</a>
      <a href="" @click.prevent="next" v-if="nextVisible">Следующая</a>
    </div>`,
    computed: {
      isVisible() {
        return (
          this.$store.state.notifications.length /
            this.$store.state.pagination.perPage >
          1
        );
      },
      prevVisible() {
        return this.$store.state.pagination.currentPage !== 0;
      },
      nextVisible() {
        return (
          this.$store.state.pagination.currentPage !==
          Math.ceil(
            this.$store.state.notifications.length /
              this.$store.state.pagination.perPage
          ) -
            1
        );
      },
      pagesNum() {
        return Math.ceil(
          this.$store.state.notifications.length /
            this.$store.state.pagination.perPage
        );
      },
      startPagesNum() {
        if (this.pagesNum <= this.visibleNum) {
          return this.pagesNum;
        } else if (
          this.$store.state.pagination.currentPage >=
          this.pagesNum - this.visibleNum
        ) {
          return 1;
        } else {
          return this.visibleNum;
        }
      },
      endPagesNum() {
        if (this.pagesNum <= this.visibleNum) {
          return 0;
        } else if (
          this.$store.state.pagination.currentPage <
          this.pagesNum - this.visibleNum
        ) {
          return 1;
        } else {
          return this.visibleNum;
        }
      },
      ellipsisContent() {
        if (this.pagesNum <= this.visibleNum + 1) {
          return false;
        } else if (
          this.$store.state.pagination.currentPage + 1 > this.visibleNum &&
          this.$store.state.pagination.currentPage <
            this.pagesNum - this.visibleNum
        ) {
          return `... <b style="margin: 0 30px; font-weight: normal;">${
            this.$store.state.pagination.currentPage + 1
          }</b> ...`;
        } else {
          return '...';
        }
      },
    },
    methods: {
      click(i) {
        this.$store.commit('setCurrentPage', i);
        this.move();
      },
      prev() {
        if (this.$store.state.pagination.currentPage === 0) return;
        this.$store.commit(
          'setCurrentPage',
          this.$store.state.pagination.currentPage - 1
        );
        this.move();
      },
      next() {
        if (
          this.$store.state.pagination.currentPage ===
          Math.ceil(
            this.$store.state.notifications.length /
              this.$store.state.pagination.perPage
          ) -
            1
        )
          return;
        this.$store.commit(
          'setCurrentPage',
          this.$store.state.pagination.currentPage + 1
        );
        this.move();
      },
      move() {
        this.$store.dispatch('getNotifications');
        history.replaceState(
          {},
          '',
          getQuery({ page: this.$store.state.pagination.currentPage + 1 })
        );
      },
    },
  });

  const App = {
    el: '#notificationsList',
    store,
    template: `<div>
      <notifications-list-table></notifications-list-table>
      <hr class="hr--xl">
      <pagination-block></pagination-block>
    </div>`,
    methods: {},
    mounted() {
      this.$store.dispatch('getList');
      //page
      let page = parseQuery(window.location.search).page;
      if (page) {
        this.$store.commit(
          'setCurrentPage',
          parseQuery(window.location.search).page - 1
        );
      }
    },
  };

  const app = new Vue(App);
});
