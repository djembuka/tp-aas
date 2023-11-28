window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state() {
      return {
        ...window.paymentStore,
        renderingTable: null,
      };
    },
    mutations: {
      changeTableHtml(state, payload) {
        Vue.set(state.table, 'html', payload);
      },
      changeRenderingTable(state, payload) {
        state.renderingTable = payload;
      },
      changeControlValue(state, { controlCode, controlValue }) {
        const control = state.filter.controls.find(
          (control) => control.code === controlCode
        );
        switch (control.type) {
          case 'text':
            Vue.set(control, 'value', controlValue);
            break;
          case 'select':
            Vue.set(control, 'selected', controlValue);
            break;
          case 'date':
            Vue.set(control, 'value', controlValue);
            break;
        }
      },
      changePage(state, payload) {
        state.table.PAGEN_1 = payload;
      },
      changeLocationSearch(state, payload) {
        state.table.locationSearch = payload;
      },
      changeSorting(state, payload) {
        state.table.sortField = payload.sortField;
        state.table.sortType = payload.sortType;
        state.query.sortField = payload.sortField;
        state.query.sortType = payload.sortType;
      },
    },
    getters: {
      requestObj(state) {
        const requestObj = {};

        state.filter.controls.forEach((control) => {
          switch (control.type) {
            case 'text':
              if (
                control.value &&
                control.count &&
                control.value.length >= control.count
              ) {
                requestObj[control.code] = control.value;
              }
              break;
            case 'select':
              if (control.selected.code) {
                requestObj[control.code] = control.selected.code;
              }
              break;
            case 'date':
              if (control.value[0]) {
                requestObj.start = control.value[0];
              }
              if (control.value[1]) {
                requestObj.end = control.value[1];
              }
          }
        });

        Object.keys(state.query).forEach((q) => {
          if (state.table[q]) {
            if (q === 'locationSearch') {
              Object.assign(requestObj, parseQuery(state.table[q]));
            } else {
              requestObj[q] = state.table[q];
            }
          }
        });

        return requestObj;
      },
      isDateFilled(state) {
        return state.filter.controls.find((c) => c.type === 'date').value[0];
      },
    },
    actions: {
      renderTable({ state, commit, getters }, href) {
        (async () => {
          const a = state.paths.getTable.split('?')[1];
          const b = href
            ? href.split('?')[1]
            : getQuery(getters.requestObj).split('?')[1];

          let url = state.paths.getTable.split('?')[0];

          if (a || b) {
            url += '?';
          }

          if (a) {
            url += a;
            if (b) {
              url += '&';
            }
          }

          if (b) {
            url += b;
          }

          commit('changeRenderingTable', true);

          const response = await fetch(url, {
            headers: {
              Authentication: 'secret',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            let result = await response.json();
            //table data
            commit('changeTableHtml', result);
            commit('changeRenderingTable', false);
            //scroll
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        })();
      },
      seturl({ getters }) {
        window.history.pushState('', '', getQuery(getters.requestObj));
      },
      setSessionStorage({ getters }) {
        let string = JSON.stringify(getters.requestObj);
        window.sessionStorage.aasPayment = string;
      },
    },
  });

  Vue.component('quickFilterBlocks', {
    template: `<div class="b-num-blocks" v-if="$store.state.quickFilterBlocks">
      <div class="b-num-block" :class="{'b-num-block--balance': block.code === 'balance'}" v-for="block in $store.state.quickFilterBlocks" @click="click(block)">
        <div class="b-num-block__data">
          <i>{{ block.title }}</i>
          <b>{{ block.num }}</b>
          <span>{{ block.text }}</span>
        </div>
      </div>
    </div>`,
    data() {
      return {};
    },
    methods: {
      numFormatted(block) {
        return block.num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
      },
      click(block) {
        let { start, end } = this.getStartEnd(block);
        this.getPeriod(start, end);
      },
      getStartEnd(block) {
        let current = new Date(),
          start,
          end;

        switch (block.code) {
          case 'all':
            start = null;
            end = null;
            break;

          case 'current-year':
            start = new Date(current.getFullYear(), 0, 1, 0, 0, 0);
            end = new Date(current.getFullYear(), 11, 31, 23, 59, 59);
            break;

          case 'current-month':
            start = new Date(
              current.getFullYear(),
              current.getMonth(),
              1,
              0,
              0,
              0
            );
            end = new Date(
              current.getFullYear(),
              current.getMonth() + 1,
              0,
              23,
              59,
              59
            );
            break;

          case 'current-week':
            start = new Date(
              current.getFullYear(),
              current.getMonth(),
              current.getDate() - current.getDay() + 1,
              0,
              0,
              0
            );
            end = new Date(
              current.getFullYear(),
              current.getMonth(),
              current.getDate() + (7 - current.getDay()),
              23,
              59,
              59
            );
            break;

          case 'today':
            start = new Date(
              current.getFullYear(),
              current.getMonth(),
              current.getDate(),
              0,
              0,
              0
            );
            end = new Date(
              current.getFullYear(),
              current.getMonth(),
              current.getDate(),
              23,
              59,
              59
            );
            break;

          case 'last-month':
            start = new Date(
              current.getFullYear(),
              current.getMonth() - 1,
              1,
              0,
              0,
              0
            );
            end = new Date(
              current.getFullYear(),
              current.getMonth(),
              0,
              23,
              59,
              59
            );
            break;

          case 'last-week':
            start = new Date(
              current.getFullYear(),
              current.getMonth(),
              current.getDate() - current.getDay() + 1 - 7,
              0,
              0,
              0
            );
            end = new Date(
              current.getFullYear(),
              current.getMonth(),
              current.getDate() + (7 - current.getDay()) - 7,
              23,
              59,
              59
            );
            break;
        }

        return {
          start: start !== null ? this.getSeconds(start) : start,
          end: end !== null ? this.getSeconds(end) : null,
        };
      },
      getSeconds(number) {
        return Math.floor(number / 1000);
      },
      getPeriod(start, end) {
        //reset values
        this.$store.state.filter.controls.forEach((control) => {
          if (control.newOptionCode) return;
          //control value
          let controlValue = '';
          if (control.type === 'select' && control.options) {
            controlValue = control.options[0];
          }
          //commit reset
          this.$store.commit('changeControlValue', {
            controlCode: control.code,
            controlValue: controlValue,
          });
        });

        //set date value
        this.$store.commit('changeControlValue', {
          controlCode: 'date',
          controlValue:
            start !== null && end !== null
              ? [String(start), String(end)]
              : [null, null],
        });

        //set url, render table
        //this.$store.commit('changePage', 1);
        //render table
        this.$store.dispatch('renderTable');
        //set URL
        this.$store.dispatch('seturl');
        //set sessionStorage
        this.$store.dispatch('setSessionStorage');
      },
    },
  });

  Vue.component('inboxTable', {
    data() {
      return {
        sorting: {
          field: '',
          sortType: '',
        },
      };
    },
    template: `<div id="inbox-table">
      <div class="b-payment-table-heading d-flex align-items-center justify-content-between">
        <h2>{{ $store.state.table.heading }}</h2>
        <div v-html="$store.state.table.link"></div>
      </div>
      <hr>
      <div v-if="$store.state.table.html.rows">
        <table class="table table-responsive">
          <tbody v-if="tableHtml.new">
            <tr v-for="row in tableHtml.new" class="tr--new" :data-id="row.data.id" :data-url="row.url" :title="row.title" :data-target="row.target" @click="clickTr($event)">
              <td v-for="(value, name) in row.data" v-html="value" :class="sorting.field === name ? sorting.sortType : ''"></td>
            </tr>
          </tbody>
          <tbody>
            <tr v-for="row in tableHtml.rows" :data-id="row.data.id" :data-url="row.url" :title="row.title" :data-target="row.target" @click="clickTr($event)">
              <td v-for="(value, name) in row.data" v-html="value" :class="sorting.field === name ? sorting.sortType : ''"></td>
            </tr>
          </tbody>
        </table>
        <hr>
        <div v-html="tableHtml.pagination" @click="clickPagination($event)"></div>
      </div>
      <div v-else-if="$store.state.renderingTable">Загрузка данных.</div>
      <div v-else>Нет данных.</div>
    </div>`,
    computed: {
      tableHtml() {
        const tableHtml = store.state.table.html;
        if (typeof tableHtml === 'object') {
          const sortedCol = tableHtml.cols.filter((col) => col.sortType);
          if (sortedCol.length) {
            this.sorting = {
              field: sortedCol[0].field,
              sortType: sortedCol[0].sortType,
            };
          }
        }
        return tableHtml;
      },
    },
    methods: {
      clickTh(col) {
        //sorting
        this.sortTable(col.field, col.sortType);
      },
      sortTable(sortField, sortType) {
        sortType = sortType === 'asc' ? 'desc' : 'asc';
        store.commit('changeSorting', { sortField, sortType });

        //render table
        this.$store.dispatch('renderTable');
        //set url
        this.$store.dispatch('seturl');
        //set sessionStorage
        this.$store.dispatch('setSessionStorage');
      },
      clickTr(event) {
        event.preventDefault();
        let url = event.target.closest('tr').getAttribute('data-url');
        let target = event.target.closest('tr').getAttribute('data-target');
        if (!url) return;
        if (target === '_self') {
          window.location.href = url;
        } else if (target === '_blank') {
          window.open(url, 'new');
        }
      },
      clickPagination(e) {
        e.preventDefault();

        let href = e.target.getAttribute('href');

        if (href) {
          //reset page
          store.commit('changeLocationSearch', href.split('?')[1]);
          //render Table
          this.$store.dispatch('renderTable', href);
          //set URL
          this.$store.dispatch('seturl');
          //set sessionStorage
          this.$store.dispatch('setSessionStorage');
        }
      },
    },
  });

  const app = new Vue({
    el: '#paymentApp',
    store,
    template: `
      <div>
        <quick-filter-blocks></quick-filter-blocks>
        <div class="b-payment-warning" v-if="$store.state.warning" v-html="$store.state.warning"></div>
        <hr>
        <inbox-table></inbox-table>
      </div>
    `,
    methods: {},
    beforeMount() {
      //set store variables
      let queryObject = parseQuery(window.location.search);

      if (
        !Object.entries(queryObject).length &&
        window.sessionStorage.aasPayment
      ) {
        queryObject = JSON.parse(window.sessionStorage.aasPayment);
      }

      Object.keys(queryObject).forEach((key) => {
        let control = store.state.filter.controls.find((c) => c.code === key);

        if (control) {
          switch (control.type) {
            case 'text':
              store.commit('changeControlValue', {
                controlCode: control.code,
                controlValue: queryObject[key] || '',
              });
              break;
            case 'select':
              store.commit('changeControlValue', {
                controlCode: control.code,
                controlValue: control.options.find(
                  (option) => option.code === queryObject[key]
                ) || { label: '', code: '' },
              });
              break;
          }
        } else {
          switch (key) {
            case 'start':
              store.commit('changeControlValue', {
                controlCode: this.$store.state.filter.controls.find(
                  (control) => control.type === 'date'
                ).code,
                controlValue: [queryObject.start || '', queryObject.end || ''],
              });

              break;
            case 'sortField' || 'sortType':
              store.commit('changeSorting', {
                field: queryObject.sortField || '',
                sortType: queryObject.sortType || '',
              });
              break;
            /*case 'PAGEN_1':
              store.commit('changePage', queryObject[key] || '');
              break;*/
          }
        }
      });
      //set URL
      this.$store.dispatch('seturl');
      //set sessionStorage
      this.$store.dispatch('setSessionStorage');
    },
    mounted() {
      //render the table
      this.$store.dispatch('renderTable');
    },
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
    var pairs = (
      queryString[0] === '?' ? queryString.substr(1) : queryString
    ).split('&');
    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i] !== '') {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }
    }
    return query;
  }
});
