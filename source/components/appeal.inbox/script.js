window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state() {
      return {
        ...window.appealIndexStore,
        renderingTable: null,
        startIndex: 0,
      };
    },
    mutations: {
      setPredefinedFilters(state, { predefinedFilters }) {
        Vue.set(state, 'predefinedFilters', predefinedFilters);
      },
      setFilters(state, { filters }) {
        Vue.set(state, 'filters', filters);
      },
      setUserId(state, { id }) {
        Vue.set(state, 'userId', id);
      },
      setSessId(state, { id }) {
        Vue.set(state, 'sessId', id);
      },
      setProfiles(state, { profiles }) {
        Vue.set(state, 'profiles', profiles);
      },
      setDeafultProfile(state, { id }) {
        if (!state.profiles) return;

        state.profiles.forEach((p) => {
          if (String(p.id) === String(id)) {
            Vue.set(p, 'default', true);
          } else if (p.default) {
            Vue.set(p, 'default', undefined);
          }
        });
      },
      setColumnsNames(state, { columnsNames }) {
        Vue.set(state, 'columnsNames', columnsNames);
      },
      setAppeals(state, { appeals }) {
        Vue.set(state, 'appeals', appeals);
      },
      setDefaultSort(state, { defaultSortObject }) {
        Vue.set(state, 'defaultSort', defaultSortObject);
      },
      setNew(state, payload) {
        state.numBlocks.find((block) => block.new).num = payload;
      },
      changeTableHtml(state, payload) {
        Vue.set(state.table, 'html', payload);
      },
      changeRenderingTable(state, payload) {
        state.renderingTable = payload;
      },
      changeControlValue(state, payload) {
        //payload = {controlCode, controlValue}
        const control = state.filters.find(
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
      defaultProfile(state) {
        if (state.profiles) {
          return state.profiles.find((p) => p.default);
        }
        return {};
      },
    },
    actions: {
      async profilesBX({ state, commit }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'profiles', {
              mode: 'class',
              data: {
                userid: state.userId,
                sessionid: state.sessId,
              },
              dataType: 'json',
            })
            .then(
              (r) => {
                commit('setProfiles', { profiles: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'profiles' });
              }
            );
        }
      },
      async setDeafultProfileBX({ state, commit }, { id }) {
        commit('setDeafultProfile', { id });
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'setDeafultProfile', {
              mode: 'class',
              data: {
                userid: state.userId,
                sessionid: state.sessId,
                profileid: id,
              },
              dataType: 'json',
            })
            .then(
              () => {},
              (error) => {
                commit('showError', { error, method: 'setDeafultProfile' });
              }
            );
        }
      },
      async columnsNamesBX({ state, commit }, { id }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'columnsNames', {
              mode: 'class',
              data: {
                userid: state.userId,
                sessionid: state.sessId,
                profileid: id,
              },
              dataType: 'json',
            })
            .then(
              (r) => {
                commit('setColumnsNames', { columnsNames: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'columnsNames' });
              }
            );
        }
      },
      async appealsBX({ state, commit }, { id }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'appeals', {
              mode: 'class',
              data: {
                userid: state.userId,
                sessionid: state.sessId,
                profileid: id,
                startIndex: state.startIndex,
                // maxCountPerRequest: 100,
                filters: state.filters,
                columnSort: state.defaultSort.columnSort,
                sortType: state.defaultSort.sortType,
              },
              dataType: 'json',
            })
            .then(
              (r) => {
                commit('setAppeals', { appeals: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'appeals' });
              }
            );
        }
      },
      async defaultSortBX({ state, commit }, { id }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'defaultSort', {
              mode: 'class',
              data: {
                userid: state.userId,
                sessionid: state.sessId,
                profileid: id,
              },
              dataType: 'json',
            })
            .then(
              (r) => {
                commit('setDefaultSort', { defaultSortObject: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'defaultSort' });
              }
            );
        }
      },
      async setDefaultSortBX({ state, commit }, { id, columnSort, sortType }) {
        commit('setDefaultSort', {
          defaultSortObject: { columnSort, sortType },
        });

        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'setDefaultSort', {
              mode: 'class',
              data: {
                userid: state.userId,
                sessionid: state.sessId,
                profileid: id,
                columnSort,
                sortType,
              },
              dataType: 'json',
            })
            .then(
              (r) => {},
              (error) => {
                commit('showError', { error, method: 'setDefaultSort' });
              }
            );
        }
      },
      async predefinedFiltersBX({ state, commit }, { id }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'predefinedFilters', {
              mode: 'class',
              data: {
                userid: state.userId,
                sessionid: state.sessId,
                profileid: id,
              },
              dataType: 'json',
            })
            .then(
              (r) => {
                commit('setPredefinedFilters', { predefinedFilters: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'setDefaultSort' });
              }
            );
        }
      },
      async filtersBX({ state, commit }, { id }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'filters', {
              mode: 'class',
              data: {
                userid: state.userId,
                sessionid: state.sessId,
                profileid: id,
              },
              dataType: 'json',
            })
            .then(
              (r) => {
                commit('setFilters', { filters: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'setDefaultSort' });
              }
            );
        }
      },
      renderTable({ state, commit, getters }) {
        commit('changeRenderingTable', true);
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

            commit('changeRenderingTable', false);
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

  Vue.component('profileMenu', {
    template: `
      <div class="b-appeal-inbox-profiles">
        <div class="twpx-scroll-menu" :class="{'twpx-scroll-menu--no-right': !arrows.right, 'twpx-scroll-menu--no-left': !arrows.left}" @mouseenter="hover" ref="sm">
          <div class="twpx-scroll-menu-overflow">
            <div class="twpx-scroll-menu-wrapper" :style="'margin-left: ' + margin + 'px;'" ref="wrapper">
              <a href="/pages/appeal-inbox/" class="twpx-scroll-menu__item" :class="{'active': profile.default}" v-for="profile in profiles" :key="profile.id" @click.prevent='click(profile.id)'>
                <i v-if="profile.newAppealsCount">{{ profile.newAppealsCount }}</i>
                <span>{{ profile.name }}</span>
              </a>
            </div>
          </div>
          <div class="twpx-scroll-menu-arrows">
            <div class="twpx-scroll-menu-arrow-right" @click="moveTo(-1 * $refs.sm.clientWidth)"></div>
            <div class="twpx-scroll-menu-arrow-left" @click="moveTo($refs.sm.clientWidth)"></div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        initialized: false,
        itemMarginRight: 20,
        margin: 0,
        arrows: {
          right: false,
          left: true,
        },
      };
    },
    computed: {
      profiles() {
        return this.$store.state.profiles;
      },
    },
    methods: {
      click(id) {
        this.$store.dispatch('setDeafultProfileBX', { id });
        this.$store.dispatch('columnsNamesBX', { id });
        this.$store.dispatch('appealsBX', { id });
      },
      hover() {
        if (this.calculateWidth() <= this.$refs.sm.clientWidth) {
          this.arrows.right = false;
          this.arrows.left = false;
        } else {
          this.moveTo(0);
        }
      },
      moveTo(dist) {
        this.arrows.right = true;
        this.arrows.left = true;
        let left = this.margin || 0;
        left = left + dist;

        let width = this.calculateWidth();

        if (left >= 0) {
          left = 0;
          this.arrows.right = false;
        } else if (left <= -1 * (width - this.$refs.sm.clientWidth)) {
          left = -1 * (width - this.$refs.sm.clientWidth);
          this.arrows.left = false;
        }

        this.margin = left;
      },
      calculateWidth() {
        let result = 0;
        this.$refs.wrapper.childNodes.forEach((item) => {
          if (item.classList) {
            result += item.clientWidth;
            result += this.itemMarginRight;
          }
        });

        result -= this.itemMarginRight;

        return result;
      },
    },
    mounted() {
      this.initialized = true;
    },
  });

  Vue.component('inboxTable', {
    template: `
      <div id="inbox-table" class="b-registry-report">
        <div v-if="$store.state.columnsNames">
          <table class="table table-responsive">
            <thead>
              <tr>
                <th v-for="col in $store.state.columnsNames" :key="col.id" :class="thClass(col)" @click="clickTh(col)">{{col.name}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="appeal in appeals.items" :class="{'tr--new': appeal.new}" :data-id="appeal.id" :data-url="appeal.url" :title="appeal.name" :data-target="appeal.url ? '_blank' : ''" @click="clickTr.prevent({url: appeal.url, target: appeal.target})">
                <td v-for="cell in appeal.cells" v-html="cell.value" :class="tdClass(cell)"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="$store.state.loading">Загрузка данных.</div>
        <div v-else>Нет данных.</div>
      </div>
    `,
    data() {
      return {};
    },
    computed: {
      columnsNames() {
        return this.$store.state.columnsNames;
      },
      appeals() {
        return this.$store.state.appeals;
      },
      defaultSort() {
        return this.$store.state.defaultSort;
      },
    },
    methods: {
      thClass(col) {
        return {
          asc:
            String(this.defaultSort.columnSort) === String(col.id) &&
            String(this.defaultSort.sortType) === '0',
          desc:
            String(this.defaultSort.columnSort) === String(col.id) &&
            String(this.defaultSort.sortType) === '1',
        };
      },
      tdClass(cell) {
        return {
          asc:
            String(this.defaultSort.columnSort) === String(cell.id) &&
            String(this.defaultSort.sortType) === '0',
          desc:
            String(this.defaultSort.columnSort) === String(cell.id) &&
            String(this.defaultSort.sortType) === '1',
        };
      },
      clickTh(col) {
        //sorting
        // this.sortTable(col.field, col.sortType);
        this.$store.dispatch('setDefaultSortBX', {
          id: this.$store.getters.defaultProfile.id,
          columnSort: col.id,
          sortType:
            String(this.defaultSort.columnSort) === String(col.id)
              ? Number(!this.defaultSort.sortType)
              : 0,
        });

        //getting selected ???
        // if (store.getters.isDateFilled) {
        //   store.dispatch('getSelected');
        // }
      },
      clickTr({ url, target }) {
        if (!url) return;
        if (target === '_self') {
          window.location.href = url;
        } else {
          window.open(url, 'new');
        }
      },
    },
  });

  // predefined filters
  Vue.component('numBlocks', {
    template: `
    <div class="b-predefined-filters">
      <h3>Заявки на изменения в реестре</h3>
      <div class="b-num-blocks" v-if="numBlocks">
        <div class="b-num-block"
          v-for="block in numBlocks"
          :class="{'inactive': !block.selectable, 'b-num-block--counter': block.selectable, 'b-num-block--none': false}"
          @click="click(block)">
          <div class="b-num-block__data">
            <i>{{ block.name }}</i>
            <b :class="{'b-num-block__b': block.new}">{{ block.value }}</b>
          </div>
        </div>
        <div class="b-num-block b-num-block--selected"
          v-if="$store.getters.defaultProfile.excelExportSupport"
          @click="click(block)">
          <div class="b-num-block__data">
            <i>Выбрано</i>
            <b>15</b>
          </div>
          <div class="b-num-block__icon">
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
      </div>
    </div>`,
    data() {
      return {};
    },
    computed: {
      numBlocks() {
        if (this.$store.state.predefinedFilters) {
          return this.$store.state.predefinedFilters.predefinedFiltersList;
        }
        return [];
      },
    },
    methods: {
      click(block) {
        if (block.selectable) {
          this.setFilters(block);
        } else if (block.selected) {
          this.getSelected(block.link);
        } else {
          return;
        }
      },
      setFilters(block) {
        //reset
        this.$store.state.filters.forEach((control) => {
          if (block.filters.find((f) => f.id === control.id)) return;

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

        //set filter
        block.filters.forEach((f) => {
          const control = this.$store.state.filters.find((c) => c.id === f.id);
          if (control) {
            let controlValue = f.value;
            if (control.type === 'select' && control.options) {
              controlValue = control.options.find((o) => o.code === f.value);
            }

            this.$store.commit('changeControlValue', {
              controlCode: control.code,
              controlValue,
            });
          }
        });
      },
      getSelected(link) {
        window.open(link);
      },
    },
  });

  Vue.component('formControlDate', {
    data() {
      return {
        focusFlag: false,
        controlObject: this.control,
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
    template: `<div class="b-float-label" data-src="${window.appealIndexStore.paths.src}calendar.svg">
      <date-picker :input-attr="{name: control.name}" :lang="lang" v-model="controlObject.value" value-type="X" range format="DD.MM.YYYY" @open="openInput" @close="closeInput" @input="inputDateRange"></date-picker>
      <label for="DATE" :class="{ active: isActive || focusFlag }">{{ control.label }}</label>
    </div>`,
    props: {
      control: Object,
    },
    watch: {
      controlObject(val) {
        this.$store.commit('changeControlValue', {
          controlCode: val.code,
          controlValue: val.value,
        });
      },
    },
    computed: {
      dateRange() {
        return this.controlObject.value;
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
        let defaultP = this.$store.getters.defaultProfile;
        if (!defaultP) return;
        this.$store.dispatch('appealsBX', { id: defaultP.id });
        //get selected
        // if (this.dateRange[0]) {
        //   store.dispatch('getSelected');
        // } else {
        //   store.commit('setSelected', { num: null, link: null });
        // }
      },
    },
  });

  Vue.component('formControlSelect', {
    data() {
      return {
        options: this.control.options,
        controlObject: this.control,
      };
    },
    template: `<div class="form-control-wrapper">
      <v-select :searchable="false" :options="options" :value="options[0]" class="form-control-select" @input="onSelect()" v-model="controlObject.selected">
      </v-select>
      <label>{{ control.label }}</label>
    </div>`,
    props: {
      control: Object,
    },
    watch: {
      controlObject(val) {
        this.$store.commit('changeControlValue', {
          controlCode: val.code,
          controlValue: val.selected,
        });
      },
    },
    methods: {
      onSelect() {
        let defaultP = this.$store.getters.defaultProfile;
        if (!defaultP) return;
        this.$store.dispatch('appealsBX', { id: defaultP.id });
        //get selected
        // if (store.getters.isDateFilled) {
        //   store.dispatch('getSelected');
        // }
      },
    },
  });

  Vue.component('formControlText', {
    data() {
      return {
        hover: false,
        controlObject: this.control,
      };
    },
    template: `<div class="b-float-label" @mouseover="hover=true" @mouseout="hover=false">
      <input :id="'inbox-filter-' + control.code" type="text" :name="control.name" required="" autocomplete="off" v-model="controlObject.value" @input="changeInput">
      <label :for="'inbox-filter-' + control.code" :class="{active: isActive}">{{control.label}}</label>
      <div class="b-input-clear" @click.prevent="clearInput()" v-show="isClearable"></div>
    </div>`,
    props: {
      control: Object,
    },
    watch: {
      controlObject() {
        this.$store.commit('changeControlValue', {
          controlCode: val.code,
          controlValue: val.value,
        });
      },
    },
    computed: {
      inputText() {
        return this.controlObject.value;
      },
      isClearable() {
        return this.inputText !== '' && this.hover ? true : false;
      },
      isActive() {
        return !!this.inputText;
      },
    },
    methods: {
      changeInput() {
        let defaultP = this.$store.getters.defaultProfile;
        if (!defaultP) return;
        this.$store.dispatch('appealsBX', { id: defaultP.id });
        //get selected
        // if (store.getters.isDateFilled) {
        //   store.dispatch('getSelected');
        // }
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
      },
    },
  });

  Vue.component('inboxFilter', {
    template: `
      <div id="inbox-filter">
        <div v-for="control in $store.state.filters">
          <component :is="'form-control-'+control.type" :control="control" :ref="control.code"></component>
        </div>
      </div>`,
    methods: {},
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
    el: '#appealInbox',
    store,
    template: `
      <div class="b-registry-report">
      {{$store.state.filters}}
        <profile-menu></profile-menu>
        <hr>
        <num-blocks></num-blocks>
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
      if (window.BX) {
        this.$store.commit('setUserId', { id: BX.bitrix_userid() });
        this.$store.commit('setSessId', { id: BX.bitrix_sessid() });
      }

      //get profiles
      let profiles = this.$store.dispatch('profilesBX');
      profiles
        .then(() => {
          let defaultP = this.$store.getters.defaultProfile;

          if (!defaultP) return;

          this.$store.dispatch('predefinedFiltersBX', { id: defaultP.id });
          this.$store.dispatch('filtersBX', { id: defaultP.id });
          this.$store.dispatch('columnsNamesBX', { id: defaultP.id });
          return this.$store.dispatch('defaultSortBX', { id: defaultP.id });
        })
        .then(() => {
          let defaultP = this.$store.getters.defaultProfile;

          if (!defaultP) return;
          this.$store.dispatch('appealsBX', { id: defaultP.id });
        });
    },
    mounted() {
      // const spaceStep = $.animateNumber.numberStepFactories.separator(' ');
      // //get new number
      // (async () => {
      //   do {
      //     //hide digit
      //     const digitNode = document.querySelector('.b-num-block__b');
      //     const currentNum = this.$store.state.numBlocks.find(
      //       (block) => block.new
      //     ).num;
      //     //make request
      //     let response = await fetch(this.$store.state.paths.getNewNum);
      //     if (response.ok) {
      //       let json = await response.json();
      //       if (json.STATUS === 'Y' && json.DATA) {
      //         //if the filter is not applied
      //         let filterFlag = false;
      //         filterFlag = this.$store.state.filters.some((control) => {
      //           if (control.type === 'select') {
      //             return control.selected.code;
      //           }
      //           if (control.type === 'date') {
      //             return control.value[0] || control.value[1];
      //           }
      //           return control.value;
      //         });
      //         filterFlag =
      //           filterFlag ||
      //           Object.keys(this.$store.state.query).some(
      //             (q) => this.$store.state.query[q]
      //           );
      //         if (!filterFlag && Number(json.DATA.num) !== Number(currentNum)) {
      //           this.$store.dispatch('renderTable');
      //           this.$store.commit('setNew', json.DATA.num);
      //         }
      //         $(digitNode).animateNumber({
      //           number: json.DATA.num,
      //           numberStep: spaceStep,
      //         });
      //       }
      //     }
      //     await new Promise((r) => setTimeout(r, this.$store.state.timeout));
      //   } while (true);
      // })();
      //render the table
      // this.$store.dispatch('renderTable');
    },
  });

  function getQuery(queryObject) {
    var result = [];
    for (var k in queryObject) {
      result.push(k + '=' + queryObject[k]);
    }
    return '?' + result.join('&');
  }
});
