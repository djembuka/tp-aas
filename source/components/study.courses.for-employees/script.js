window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state() {
      return window.studyCoursesForEmployeesStore;
    },
    mutations: {
      changeTableHtml(state, payload) {
        Vue.set(state.table, 'html', payload);
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
        window.sessionStorage.aasStudyCoursesForEmployees = string;
      },
    },
  });

  Vue.component('v-select', VueSelect.VueSelect);
  Vue.component('date-picker', DatePicker);

  Vue.component('quickFilterBlocks', {
    template: `<div class="b-num-blocks" v-if="$store.state.quickFilterBlocks">
      <div class="b-num-block b-num-block--counter" v-for="block in $store.state.quickFilterBlocks" @click="click(block)">
        <div class="b-num-block__data">
          <i>{{ block.title }}</i>
          <b :class="{'b-num-block__b': block.new}">{{ numFormatted(block) }}</b>
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

  Vue.component('formControlDate', {
    template: `<div class="b-float-label" data-src="${window.studyCoursesForEmployeesStore.paths.src}calendar.svg">
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
        //reset page
        store.commit('changeLocationSearch', '');
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
      <v-select :searchable="false" :options="options" :value="options[0]" class="form-control-select" @input="onSelect()" v-model="$store.state.filter.controls[inputIndex].selected"></v-select>
      <label>{{ control.label }}</label>
    </div>`,
    props: {
      control: Object,
    },
    methods: {
      onSelect() {
        //reset page
        store.commit('changeLocationSearch', '');
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
        store.commit('changeLocationSearch', '');
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
        <table class="table">
          <thead>
            <tr>
              <th v-for="col in tableHtml.cols" :class="col.sortType" @click="clickTh(col)">{{col.title}}</th>
            </tr>
          </thead>
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
      <div v-else>Загрузка данных.</div>
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

  Vue.component('stickyScroll', {
    data() {
      return {
        visible: true,
        clickThumbStep: 100,
        hoverSpaceStep: 10,
        hoverSpaceInterval: 30,
        hoverSpaceIntervalId: undefined,
        thumbClickedFlag: false,
        thumbClickedCoords: 0,
        resizeTimeoutId: undefined,
      };
    },
    template: `
      <div class="twpx-sticky-scroll">
        <div class="twpx-sticky-scroll-space-right" ref="spaceRight" @mouseover="spaceAndArrowMouseover('right')" @mouseout="spaceAndArrowMouseout" v-show="visible"></div>
        <div class="twpx-sticky-scroll-space-left" ref="spaceLeft" @mouseover="spaceAndArrowMouseover('left')" @mouseout="spaceAndArrowMouseout" v-show="visible"></div>

        <div class="twpx-sticky-scroll-arrows" v-show="visible">
          <div class="twpx-sticky-scroll-arrow-right" ref="arrowRight" @mouseover="spaceAndArrowMouseover('right')" @mouseout="spaceAndArrowMouseout"></div>
          <div class="twpx-sticky-scroll-arrow-left" ref="arrowLeft" @mouseover="spaceAndArrowMouseover('left')" @mouseout="spaceAndArrowMouseout"></div>
        </div>

        <div class="twpx-sticky-scroll-content-wrapper" ref="contentWrapper">
          <div ref="content">
            <slot></slot>
          </div>
        </div>

        <div class="twpx-sticky-scroll-scrollbar" ref="scrollbar" @click="scrollbarClick($event)" v-show="visible">
          <div class="twpx-sticky-scroll-scrollbar-thumb" ref="thumb" @mousedown="thumbMousedown($event)" @click="thumbClick($event)"></div>
        </div>
      </div>
    `,
    methods: {
      init() {
        if (window.matchMedia('(min-width: 768px)').matches) {
          this.setThumbWidth();
        }
      },
      setThumbWidth() {
        const ratio =
          this.$refs.contentWrapper.clientWidth /
          this.$refs.content.clientWidth;

        this.visible = ratio < 1;

        if (this.visible) {
          setTimeout(() => {
            this.$refs.thumb.style.width = `${
              this.$refs.scrollbar.clientWidth * ratio
            }px`;

            this.setDelta();
          }, 0);
        }
      },
      setDelta() {
        this.scrollbarDelta =
          this.$refs.scrollbar.clientWidth - this.$refs.thumb.clientWidth;
        this.contentDelta =
          this.$refs.content.clientWidth -
          this.$refs.contentWrapper.clientWidth;
      },
      thumbMousedown(e) {
        this.thumbClickedFlag = true;
        this.thumbClickedCoords =
          e.clientX - this.$refs.thumb.getBoundingClientRect().x;
      },
      thumbClick(e) {
        e.stopPropagation();
      },
      scrollbarClick(e) {
        e.preventDefault();

        const scrollbarX = this.$refs.scrollbar.getBoundingClientRect().x;
        const thumbX = this.$refs.thumb.getBoundingClientRect().x;
        let step = this.clickThumbStep;

        if (e.clientX - thumbX < 0) {
          step = -1 * this.clickThumbStep;
        }

        let left = thumbX - scrollbarX + step;
        this.moveThumbAndContent(left);
      },
      spaceAndArrowMouseover(type) {
        let step = this.hoverSpaceStep;
        if (type === 'left') {
          step = -1 * this.hoverSpaceStep;
        }
        this.hoverSpaceIntervalId = setInterval(() => {
          let left = this.$refs.contentWrapper.scrollLeft + step;
          this.moveContentAndThumb(left);
        }, this.hoverSpaceInterval);
      },
      spaceAndArrowMouseout() {
        clearInterval(this.hoverSpaceIntervalId);
      },
      moveThumbAndContent(left) {
        if (left > this.scrollbarDelta) {
          left = this.scrollbarDelta;
        } else if (left < 0) {
          left = 0;
        }

        this.$refs.thumb.style.left = `${left}px`;

        //move content
        let contentDelta;

        if (left === this.scrollbarDelta) {
          contentDelta = this.contentDelta;
        } else if (left === 0) {
          contentDelta = 0;
          left = 0;
        } else {
          contentDelta = (left / this.scrollbarDelta) * this.contentDelta;
        }

        this.$refs.contentWrapper.scrollTo(contentDelta, 0);
      },
      moveContentAndThumb(left) {
        if (left > this.contentDelta) {
          left = this.contentDelta;
          clearInterval(this.hoverSpaceIntervalId);
        } else if (left < 0) {
          left = 0;
          clearInterval(this.hoverSpaceIntervalId);
        }

        this.$refs.contentWrapper.scrollTo(left, 0);

        //move content
        let scrollDelta;

        if (left === this.contentDelta) {
          scrollDelta = this.scrollbarDelta;
        } else if (left === 0) {
          scrollDelta = 0;
          left = 0;
        } else {
          scrollDelta = (left / this.contentDelta) * this.scrollbarDelta;
        }

        this.$refs.thumb.style.left = `${scrollDelta}px`;
      },
      setContentWidth() {
        this.$refs.content.style.width = 'auto';

        if (this.resizeTimeoutId) {
          clearInterval(this.resizeTimeoutId);
        }
        this.resizeTimeoutId = setTimeout(() => {
          this.$refs.content.style.width = `${
            this.$refs.content.querySelector('table.table').clientWidth
          }px`;
          setTimeout(() => {
            this.init();
          }, 0);
        }, 200);
      },
      async initContentWidth() {
        do {
          if (!this.$refs.content.querySelector('table.table')) {
            await new Promise((r) => setTimeout(r, 500));
          } else {
            this.setContentWidth();
            break;
          }
        } while (true);
      },
    },
    mounted() {
      window.addEventListener('resize', () => {
        this.setContentWidth();
      });

      this.initContentWidth();

      //document mouseup
      document.addEventListener('mouseup', () => {
        if (this.thumbClickedFlag) {
          this.thumbClickedFlag = false;
        }
      });

      //document mousemove
      document.addEventListener('mousemove', (e) => {
        if (this.thumbClickedFlag) {
          e.preventDefault();
          let left =
            e.clientX -
            this.$refs.scrollbar.getBoundingClientRect().x -
            this.thumbClickedCoords;

          this.moveThumbAndContent(left);
        }
      });
    },
  });

  const app = new Vue({
    el: '#studyCoursesForEmployees',
    store,
    template: `
      <div class="b-registry-report">
        <quick-filter-blocks></quick-filter-blocks>
        <hr>
        <inbox-filter ref="filter"></inbox-filter>
        <hr>
        <sticky-scroll>
          <inbox-table></inbox-table>
        </sticky-scroll>
      </div>
    `,
    methods: {},
    beforeMount() {
      //set store variables
      let queryObject = parseQuery(window.location.search);

      if (
        !Object.entries(queryObject).length &&
        window.sessionStorage.aasStudyCoursesForEmployees
      ) {
        queryObject = JSON.parse(
          window.sessionStorage.aasStudyCoursesForEmployees
        );
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
