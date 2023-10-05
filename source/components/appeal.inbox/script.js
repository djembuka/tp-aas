window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state() {
      return window.appealIndexStore;
    },
    mutations: {
      setNew(state, payload) {
        state.numBlocks.find((block) => block.new).num = payload;
      },
      changeTableHtml(state, payload) {
        Vue.set(state.table, 'html', payload);
      },
      changeControlValue(state, payload) {
        //payload = {controlCode, controlValue}
        const control = state.filter.controls.find(
          (control) => control.code === payload.controlCode
        );
        switch (control.type) {
          case 'text':
            Vue.set(control, 'value', payload.controlValue);
            break;
          case 'select':
            Vue.set(control, 'selected', payload.controlValue);
            break;
          case 'date':
            Vue.set(control, 'value', payload.controlValue);
            break;
        }
      },
      changePage(state, payload) {
        state.table.PAGEN_1 = payload;
      },
      changeSorting(state, payload) {
        state.table.sortField = payload.sortField;
        state.table.sortType = payload.sortType;
        state.query.sortField = payload.sortField;
        state.query.sortType = payload.sortType;
      },
      setSelected(state, payload) {
        const selected = state.numBlocks.find((block) => block.selected);
        selected.num = payload.num;
        selected.link = payload.link;
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
            requestObj[q] = state.table[q];
          }
        });

        return requestObj;
      },
      isDateFilled(state) {
        return state.filter.controls.find((c) => c.type === 'date').value[0];
      },
    },
    actions: {
      renderTable({ state, commit, getters }) {
        (async () => {
          const response = await fetch(
            `${state.paths.getTable}${getQuery(getters.requestObj)}`,
            {
              headers: {
                Authentication: 'secret',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            let result = await response.json();
            //table data
            commit('changeTableHtml', result);
            //scroll
            $.scrollTo(
              document
                .querySelector('.b-num-blocks')
                .closest('article')
                .getBoundingClientRect().top +
                scrollY -
                190,
              500
            );
          }
        })();
      },
      seturl({ getters }) {
        window.history.pushState('', '', getQuery(getters.requestObj));
      },
      setSessionStorage({ getters }) {
        let string = JSON.stringify(getters.requestObj);
        window.sessionStorage.aasAppealInbox = string;
      },
      getSelected({ commit, state }) {
        (async () => {
          const response = await fetch(
            `${state.paths.getSelected}${getQuery(store.getters.requestObj)}`,
            {
              headers: {
                Authentication: 'secret',
              },
            }
          );
          const result = await response.json();
          if (result.STATUS === 'Y') {
            commit('setSelected', result.DATA);
          }
        })();
      },
    },
  });

  Vue.component('v-select', VueSelect.VueSelect);
  Vue.component('date-picker', DatePicker);

  Vue.component('numBlocks', {
    template: `<div class="b-num-blocks" v-if="$store.state.numBlocks">
      <div class="b-num-block"
        v-for="block in $store.state.numBlocks"
        :class="{'inactive': !block.new && !block.selected, 'b-num-block--counter': block.new, 'b-num-block--selected': block.selected, 'b-num-block--none':( block.selected && !Number(block.num))}"
        @click="click(block)">
        <div class="b-num-block__data">
          <i>{{ block.title }}</i>
          <b :class="{'b-num-block__b': block.new}">{{ block.num }}</b>
        </div>
        <div class="b-num-block__icon" v-if="block.selected">
          <svg xmlns="http://www.w3.org/2000/svg" width="23.177" height="32" viewBox="0 0 23.177 32">
            <g>
              <path d="M28.171,8.7V29.869a2.062,2.062,0,0,1-2.062,2.063H7.056a2.062,2.062,0,0,1-2.062-2.063V1.994A2.062,2.062,0,0,1,7.056-.068H19.407Z" transform="translate(-4.994 0.068)" fill="#288c0a"/>
            </g>
            <path d="M20.6,8.506l7.569,3.118V8.7L23.88,7.429Z" transform="translate(-4.994 0.068)" fill="#0e5429"/>
            <path d="M28.171,8.7h-6.7a2.062,2.062,0,0,1-2.062-2.063v-6.7Z" transform="translate(-4.994 0.068)" fill="#cef4ae"/>
            <g transform="translate(5.029 11.693)">
              <rect width="13.119" height="1.458" rx="0.729" transform="translate(0 2.577)" fill="#fff"/>
              <rect width="7.853" height="1.458" rx="0.729" transform="translate(0 9.089)" fill="#fff"/>
              <rect width="13.119" height="1.458" rx="0.729" transform="translate(2.511 13.119) rotate(-90)" fill="#fff"/>
              <rect width="7.288" height="1.458" rx="0.729" transform="translate(9.149 7.29) rotate(-90)" fill="#fff"/>
            </g>
          </svg>
        </div>
      </div>
    </div>`,
    data() {
      return {};
    },
    methods: {
      click(block) {
        if (block.new) {
          this.getNew(block.new);
        } else if (block.selected) {
          this.getSelected(block.link);
        } else {
          return;
        }
      },
      getNew(newFlag) {
        if (!newFlag) return;
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

        //New
        const statusControl = this.$store.state.filter.controls.find(
          (control) => control.newOptionCode
        );
        const newOption = statusControl.options.find(
          (option) => option.code === statusControl.newOptionCode
        );
        this.$store.commit('changeControlValue', {
          controlCode: statusControl.code,
          controlValue: newOption,
        });

        //set url, render table
        this.$store.commit('changePage', 1);
        //render table
        this.$store.dispatch('renderTable');
        //set URL
        this.$store.dispatch('seturl');
        //set sessionStorage
        this.$store.dispatch('setSessionStorage');
      },
      getSelected(link) {
        window.open(link);
      },
    },
  });

  Vue.component('formControlDate', {
    template: `<div class="b-float-label" data-src="${window.appealIndexStore.paths.src}calendar.svg">
      <date-picker :input-attr="{name: control.name}" :lang="lang" v-model="$store.state.filter.controls[inputIndex].value" value-type="X" range format="DD.MM.YYYY" @open="openInput" @close="closeInput" @input="inputDateRange"></date-picker>
      <label for="DATE" :class="{ active: isActive || focusFlag }">{{ control.label }}</label>
    </div>`,
    data() {
      return {
        focusFlag: false,
        inputIndex: this.$store.state.filter.controls.findIndex(
          (ctr) => ctr.code === this.control.code
        ),
        lang: {
          // the locale of formatting and parsing function
          formatLocale: {
            // MMMM
            months: [
              'Январь',
              'Февраль',
              'Март',
              'Апрель',
              'Май',
              'Июнь',
              'Июль',
              'Август',
              'Сентябрь',
              'Октябрь',
              'Ноябрь',
              'Декабрь',
            ],
            // MMM
            monthsShort: [
              'Янв',
              'Фев',
              'Мар',
              'Апр',
              'Май',
              'Июн',
              'Июл',
              'Авг',
              'Сен',
              'Окт',
              'Ноя',
              'Дек',
            ],
            // dddd
            weekdays: [
              'Воскресенье',
              'Понедельник',
              'Вторник',
              'Среда',
              'Четверг',
              'Пятница',
              'Суббота',
            ],
            // ddd
            weekdaysShort: ['Вск', 'Пнд', 'Втр', 'Сре', 'Чтв', 'Птн', 'Суб'],
            // dd
            weekdaysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            // first day of week
            firstDayOfWeek: 1,
            // first week contains January 1st.
            firstWeekContainsDate: 1,
            // format 'a', 'A'
            meridiem(h, _, isLowercase) {
              const word = h < 12 ? 'AM' : 'PM';
              return isLowercase ? word.toLocaleLowerCase() : word;
            },
            // parse ampm
            meridiemParse: /[ap]\.?m?\.?/i,
            // parse ampm
            isPM(input) {
              return `${input}`.toLowerCase().charAt(0) === 'p';
            },
          },
          // the calendar header, default formatLocale.weekdaysMin
          days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          // the calendar months, default formatLocale.monthsShort
          months: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
          ],
          // the calendar title of year
          yearFormat: 'YYYY',
          // the calendar title of month
          monthFormat: 'MMMM',
          // the calendar title of month before year
          monthBeforeYear: true,
        },
      };
    },
    props: {
      control: Object,
    },
    computed: {
      dateRange() {
        return this.$store.state.filter.controls[this.inputIndex].value;
      },
      isActive() {
        return !!this.dateRange[0];
      },
    },
    methods: {
      openInput() {
        this.focusFlag = true;
      },
      closeInput() {
        this.focusFlag = false;
      },
      inputDateRange() {
        //get selected
        if (this.dateRange[0]) {
          store.dispatch('getSelected');
        } else {
          store.commit('setSelected', { num: null, link: null });
        }
        //reset page
        store.commit('changePage', 1);
        //render table
        this.$store.dispatch('renderTable');
        //set URL
        this.$store.dispatch('seturl');
        //set sessionStorage
        this.$store.dispatch('setSessionStorage');
      },
    },
  });

  Vue.component('formControlSelect', {
    data() {
      return {
        options: this.control.options,
        inputIndex: this.$store.state.filter.controls.findIndex(
          (ctr) => ctr.code === this.control.code
        ),
      };
    },
    template: `<div class="form-control-wrapper">
      <v-select :searchable="false" :options="options" :value="options[0]" class="form-control-select" @input="onSelect()" v-model="$store.state.filter.controls[inputIndex].selected">
      </v-select>
      <label>{{ control.label }}</label>
    </div>`,
    props: {
      control: Object,
    },
    methods: {
      onSelect() {
        //get selected
        if (store.getters.isDateFilled) {
          store.dispatch('getSelected');
        }
        //reset page
        store.commit('changePage', 1);
        //render table
        this.$store.dispatch('renderTable');
        //set URL
        this.$store.dispatch('seturl');
        //set sessionStorage
        this.$store.dispatch('setSessionStorage');
      },
    },
  });

  Vue.component('formControlText', {
    data() {
      return {
        hover: false,
        inputIndex: this.$store.state.filter.controls.findIndex(
          (ctr) => ctr.code === this.control.code
        ),
      };
    },
    props: {
      control: Object,
    },
    computed: {
      inputText() {
        return this.$store.state.filter.controls[this.inputIndex].value;
      },
      isClearable() {
        return this.inputText !== '' && this.hover ? true : false;
      },
      isActive() {
        return !!this.inputText;
      },
    },

    template: `<div class="b-float-label" @mouseover="hover=true" @mouseout="hover=false">
      <input :id="'inbox-filter-' + control.code" type="text" :name="control.name" required="" autocomplete="off" v-model="$store.state.filter.controls[inputIndex].value" @input="changeInput">
      <label :for="'inbox-filter-' + control.code" :class="{active: isActive}">{{control.label}}</label>
      <div class="b-input-clear" @click.prevent="clearInput()" v-show="isClearable"></div>
    </div>`,

    methods: {
      changeInput() {
        this.getTableData();
        //get selected
        if (store.getters.isDateFilled) {
          store.dispatch('getSelected');
        }
      },
      clearInput() {
        //clear text
        store.commit('changeControlValue', {
          controlCode: this.control.code,
          controlValue: '',
        });
        //table
        this.getTableData();
      },
      getTableData() {
        //reset page
        store.commit('changePage', 1);
        //render Table
        this.$store.dispatch('renderTable');
        //set URL
        this.$store.dispatch('seturl');
        //set sessionStorage
        this.$store.dispatch('setSessionStorage');
      },
    },
  });

  Vue.component('inboxFilter', {
    template: `
      <div id="inbox-filter">
        <div v-for="control in $store.state.filter.controls">
          <component :is="'form-control-'+control.type" :control="control" :ref="control.code"></component>
        </div>
      </div>`,
    methods: {},
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
    template: `<div id="inbox-table" class="b-registry-report">
      <div v-if="$store.state.table.html.rows">
        <table class="table table-responsive">
          <thead>
            <tr>
              <th v-for="col in tableHtml.cols" :class="col.sortType" @click="clickTh(col)">{{col.title}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableHtml.rows" :class="{'tr--new': row.new}" :data-id="row.data.id" :data-url="row.url" :title="row.title" :data-target="row.target" @click="clickTr($event)">
              <td v-for="(value, name) in row.data" v-html="value" :class="sorting.field === name ? sorting.sortType : ''"></td>
            </tr>
          </tbody>
        </table>
        <hr>
        <div v-html="tableHtml.pagination" @click="clickPagination($event)"></div>
      </div>
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
        //getting selected
        if (store.getters.isDateFilled) {
          store.dispatch('getSelected');
        }
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
        if (e.target.getAttribute('href')) {
          //reset page
          let page = parseQuery(
            e.target.getAttribute('href').split('?')[1]
          ).PAGEN_1;
          store.commit('changePage', 1 * page);
          //render Table
          this.$store.dispatch('renderTable');
          //set URL
          this.$store.dispatch('seturl');
          //set sessionStorage
          this.$store.dispatch('setSessionStorage');
        }
      },
    },
  });

  const app = new Vue({
    el: '#appealInbox',
    store,
    template: `
      <div class="b-registry-report">
        <num-blocks></num-blocks>
        <hr>
        <inbox-filter ref="filter"></inbox-filter>
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
        window.sessionStorage.aasAppealInbox
      ) {
        queryObject = JSON.parse(window.sessionStorage.aasAppealInbox);
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

              //get selected block
              store.dispatch('getSelected');
              break;
            case 'sortField' || 'sortType':
              store.commit('changeSorting', {
                field: queryObject.sortField || '',
                sortType: queryObject.sortType || '',
              });
              break;
            case 'PAGEN_1':
              store.commit('changePage', queryObject[key] || '');
              break;
          }
        }
      });
      //set URL
      this.$store.dispatch('seturl');
      //set sessionStorage
      this.$store.dispatch('setSessionStorage');
    },
    mounted() {
      const spaceStep = $.animateNumber.numberStepFactories.separator(' ');
      //get new number
      (async () => {
        do {
          //hide digit
          const digitNode = document.querySelector('.b-num-block__b');
          const currentNum = this.$store.state.numBlocks.find(
            (block) => block.new
          ).num;

          //make request
          let response = await fetch(this.$store.state.paths.getNewNum);
          if (response.ok) {
            let json = await response.json();
            if (json.STATUS === 'Y' && json.DATA) {
              //if the filter is not applied
              let filterFlag = false;
              filterFlag = this.$store.state.filter.controls.some((control) => {
                if (control.type === 'select') {
                  return control.selected.code;
                }
                if (control.type === 'date') {
                  return control.value[0] || control.value[1];
                }
                return control.value;
              });
              filterFlag =
                filterFlag ||
                Object.keys(this.$store.state.query).some(
                  (q) => this.$store.state.query[q]
                );

              if (!filterFlag && Number(json.DATA.num) !== Number(currentNum)) {
                this.$store.dispatch('renderTable');
                this.$store.commit('setNew', json.DATA.num);
              }
              $(digitNode).animateNumber({
                number: json.DATA.num,
                numberStep: spaceStep,
              });
            }
          }
          await new Promise((r) => setTimeout(r, this.$store.state.timeout));
        } while (true);
      })();

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

  //profiles
  if (document.querySelector('.b-appeal-inbox-profiles')) {
    let profilesSelect = document.querySelector(
      '.b-appeal-inbox-profiles select'
    );

    let profilesSelectValue = window.localStorage.getItem(
      'aasAppealInboxProfileSelect'
    );

    profilesSelect.addEventListener('change', (e) => {
      window.location.href = profilesSelect.value;
      window.localStorage.setItem(
        'aasAppealInboxProfileSelect',
        profilesSelect.value
      );
    });

    setTimeout(() => {
      profilesSelect
        .closest('.b-float-label')
        .querySelector('.ik-custom-class')
        .addEventListener('click', (e) => {
          window.location.href = profilesSelect.value;
          window.localStorage.setItem(
            'aasAppealInboxProfileSelect',
            profilesSelect.value
          );
        });
    }, 0);

    let profilesButton = document.querySelector(
      '.b-appeal-inbox-profiles__button'
    );

    profilesButton.addEventListener('click', (e) => {
      profilesButton
        .closest('.b-appeal-inbox-profiles')
        .classList.toggle('b-appeal-inbox-profiles--open');

      let mode = profilesButton
        .closest('.b-appeal-inbox-profiles')
        .classList.contains('b-appeal-inbox-profiles--open')
        ? 'open'
        : 'closed';

      //height
      let container = profilesButton
        .closest('.b-appeal-inbox-profiles')
        .querySelector('.b-appeal-inbox-profiles__container');
      let height = container.clientHeight;

      if (mode === 'closed') {
        container.style.height = `${height}px`;
        container.setAttribute('data-height', height);
        setTimeout(() => {
          container.style.height = 0;
        }, 0);
      } else {
        container.style.height = 0;
        setTimeout(() => {
          container.style.height = `${
            container.setAttribute('data-height', height) || 217
          }px`;
        }, 0);

        setTimeout(() => {
          container.removeAttribute('style');
        }, 500);
      }

      //storage
      window.localStorage.setItem('aasAppealInboxProfilesButton', mode);
    });

    let profilesButtonValue = window.localStorage.getItem(
      'aasAppealInboxProfilesButton'
    );
    if (profilesSelectValue) {
      profilesSelect.value = profilesSelectValue;
    }
    if (profilesButtonValue) {
      if (profilesButtonValue === 'open') {
        profilesButton
          .closest('.b-appeal-inbox-profiles')
          .classList.add('b-appeal-inbox-profiles--open');

        profilesButton
          .closest('.b-appeal-inbox-profiles')
          .querySelector('.b-appeal-inbox-profiles__container')
          .removeAttribute('style');
      } else {
        profilesButton
          .closest('.b-appeal-inbox-profiles')
          .classList.remove('b-appeal-inbox-profiles--open');

        profilesButton
          .closest('.b-appeal-inbox-profiles')
          .querySelector('.b-appeal-inbox-profiles__container').style.height =
          '0px';
      }
    }
  }
});
