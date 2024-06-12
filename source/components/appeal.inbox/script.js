window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state() {
      return {
        ...window.appealIndexStore,
        renderingTable: null,
      };
    },
    mutations: {
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
      setProfiles(state, { profiles }) {
        Vue.set(state, 'profiles', profiles);
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
      async profilesBX({ _, commit }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'profiles', {
              mode: 'class',
              data: {
                userid: BX.bitrix_sessid,
                sessionid: BX.bitrix_sessid,
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
      async setDeafultProfileBX({ _, commit }, { id }) {
        commit('setDeafultProfile', { id });
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'setDeafultProfile', {
              mode: 'class',
              data: {
                userid: BX.bitrix_sessid,
                sessionid: BX.bitrix_sessid,
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
        <profile-menu></profile-menu>
        <hr>
        <h3>Заявки на изменения в реестре</h3>
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

      //get profiles
      this.$store.dispatch('profilesBX');
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
