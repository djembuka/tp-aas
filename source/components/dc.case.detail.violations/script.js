window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      modal: false,
      error: false,
      count: 3,
      cols: ['auto', '100px', '100px', '200px'],
      violations: {
        th: [
          {
            id: 1,
            title: 'Название',
          },
          {
            id: 2,
            title: 'Добавлено',
          },
          {
            id: 3,
            title: 'Основание',
          },
          {
            id: 4,
            title: 'Автор',
          },
        ],
        tr: [
          {
            id: 1,
            url: '/pages/dc-violation-detail/',
            target: '_self',
            data: [
              {
                id: 1,
                text: 'Несоблюдение требования о запрете заниматься иными видами предпринимательской деятельности, кроме аудиторской деятельности и прочих связанных с аудиторской деятельностью услуг',
              },
              {
                id: 2,
                text: '19.01.2022',
              },
              {
                id: 3,
                text: 'Жалоба',
              },
              {
                id: 4,
                text: 'Петрушина Татьяна Сергеевна',
              },
            ],
          },
          {
            id: 2,
            url: '/pages/dc-violation-detail/',
            target: '_self',
            data: [
              {
                id: 1,
                text: 'Неучастие аудитора в осуществлении аудиторской деятельности (неосуществление индивидуальным аудитором аудиторской деятельности) в течении двух последовательных календарных лет',
              },
              {
                id: 2,
                text: '22.03.2024',
              },
              {
                id: 3,
                text: 'Решение ДК',
              },
              {
                id: 4,
                text: 'Савельева Мария Евгеньевна',
              },
            ],
          },
          {
            id: 3,
            url: '/pages/dc-violation-detail/',
            target: '_self',
            data: [
              {
                id: 1,
                text: 'Несоблюдение требований Федерального закона от 30 декабря 2008 г. № 307-ФЗ «Об аудиторской деятельности»',
              },
              {
                id: 2,
                text: '22.03.2024',
              },
              {
                id: 3,
                text: 'Жалоба',
              },
              {
                id: 4,
                text: 'Петрушина Татьяна Сергеевна',
              },
            ],
          },
        ],
      },
    },
    mutations: {
      setProp(state, { prop, value }) {
        Vue.set(state, prop, value);
      },
      showError(state, { error, method }) {
        if (typeof error === 'boolean') {
          Vue.set(state, 'error', error);
        } else if (typeof error === 'object') {
          if (
            error.errors &&
            typeof error.errors === 'object' &&
            error.errors[0] &&
            error.errors[0].code !== undefined
          ) {
            if (error.errors[0].code === 'NETWORK_ERROR') {
              if (error.data && error.data.ajaxRejectData) {
                if (error.data.ajaxRejectData.data) {
                  Vue.set(
                    state,
                    'error',
                    `${window.BX.message('ERROR_SUPPORT')}
                    <br>
                    <br>
                    Метод: ${method}. Код ошибки: ${
                      error.data.ajaxRejectData.data
                    }. Описание: ${
                      window.BX.message(
                        'ERROR_' + error.data.ajaxRejectData.data
                      ) || window.BX.message('ERROR_SERVER')
                    }.`
                  );
                }
              } else if (window.BX.message) {
                Vue.set(
                  state,
                  'error',
                  `${window.BX.message('ERROR_SUPPORT')}
                  <br>
                  <br>
                  Метод: ${method}. Код ошибки: NETWORK_ERROR. Описание: ${window.BX.message(
                    'ERROR_OFFLINE'
                  )}.`
                );
              }
            } else {
              Vue.set(
                state,
                'error',
                `${window.BX.message('ERROR_SUPPORT')}
                <br>
                <br>
                Метод: ${method}.${
                  error.errors[0].code
                    ? ' Код ошибки: ' + error.errors[0].code + '.'
                    : ''
                } ${
                  error.errors[0].message
                    ? ' Описание: ' + error.errors[0].message + '.'
                    : ''
                }`
              );
            }
          }
        }
      },
      addViolation(state, { violation }) {
        console.log(violation);
        state.violations.tr.push(violation);
      },
    },
    getters: {
      violationsCount(state) {
        return state.violations.tr.length;
      },
    },
    actions: {
      async addBX({ commit }, { data }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:dc.api`, 'addViolation', data)
            .then(
              (r) => {
                commit('addViolation', { violation: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'add' });
              }
            );
        }
      },
    },
  });

  Vue.component('AddViolationForm', {
    template: `
      <button class="btn btn-secondary" @click.prevent="addViolation">Add violation</button>
    `,
    methods: {
      addViolation() {
        this.$store.dispatch('addBX', {
          data: {
            mode: 'class',
            data: {
              id: 4,
              url: '/pages/dc-violation-detail/',
              target: '_self',
              data: [
                {
                  id: 1,
                  text: 'Добавлено',
                },
                {
                  id: 2,
                  text: '20.08.2024',
                },
                {
                  id: 3,
                  text: 'Жалоба',
                },
                {
                  id: 4,
                  text: 'Петрушина Татьяна Сергеевна',
                },
              ],
            },
            dataType: 'json',
          },
        });
        this.$store.commit('setProp', { prop: 'modal', value: false });
      },
    },
  });

  Vue.component('ViolationsTable', {
    template: `
      <div class="b-dc-case-detail-violations">
        <h3>Нарушения<span class="text-blue">&nbsp;&nbsp;{{ $store.getters.violationsCount }}</span></h3>
        <!--<button class="btn btn-primary" @click="showModal">Show modal</button>-->
        <table class="table table-responsive">
          <colgroup> 
            <col v-for="(violation, index) in violations.th" :key="index * Math.floor(Math.random() * 100000)" :style="'width:' +  ($store.state.cols[index] || 'auto') + ';'">
          </colgroup>
          <thead>
            <tr>
              <th v-for="th in violations.th" :key="th.id">{{ th.title }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tr in violations.tr" :key="tr.id" :data-url="tr.url" :data-target="tr.target">
              <td v-for="data in tr.data" :key="data.id">{{ data.text }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    methods: {
      showModal() {
        this.$store.commit('setProp', { prop: 'modal', value: true });
      },
    },
    computed: {
      violations() {
        return this.$store.state.violations;
      },
    },
  });

  Vue.component('ModalPopup', {
    template: `
    <div class="modal--text modal fade" :id="id" tabindex="-1" :aria-labelledby="id + 'Label'" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
            <button class="close" type="button" @click="close" aria-label="Close" style="background-image: url( '/template/images/cancel.svg' );"></button>
            <div class="modal-body">
                <slot></slot>
            </div>
        </div>
      </div>
    </div>
    `,
    props: ['id'],
    computed: {
      show() {
        return this.$store.state.modal;
      },
    },
    watch: {
      show(val) {
        if (val) {
          $(`#${this.id}`).modal('show');
        } else {
          $(`#${this.id}`).modal('hide');
        }
      },
    },
    methods: {
      close() {
        this.$store.commit('setProp', { prop: 'modal', value: false });
      },
    },
    mounted() {
      $(`#${this.id}`).on('hide.bs.modal', () => {
        this.$store.commit('setProp', { prop: 'modal', value: false });
      });
    },
  });

  Vue.component('TheErrorMessage', {
    template: `
      <div v-if="error" class="vue2-component-error" @click="clickError($event)">
        <div class="vue2-component-error__content">
          <div class="vue2-component-error__text">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M0,0V5" transform="translate(12 9)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
              <path d="M10,18.817H3.939c-3.47,0-4.92-2.48-3.24-5.51l3.12-5.62,2.94-5.28c1.78-3.21,4.7-3.21,6.48,0l2.94,5.29,3.12,5.62c1.68,3.03.22,5.51-3.24,5.51H10Z" transform="translate(2 2.592)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
              <path d="M0,0H.009" transform="translate(11.995 17)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path d="M0,0H24V24H0Z" fill="none" opacity="0"/>
            </svg>
            <span v-html="error"></span>
          </div>
          <div class="btn btn-md" @click="clickError">Понятно</div>
        </div>
      </div>
    `,
    computed: {
      error() {
        return this.$store.state.error;
      },
    },
    methods: {
      clickError(event) {
        if (
          event.target.classList.contains('vue2-component-error') ||
          event.target.classList.contains('btn')
        ) {
          this.$store.commit('showError', { error: false });
        }
      },
    },
  });

  const App = {
    el: '#dcCaseDetailViolations',
    store,
    template: `
      <div>
        <the-error-message></the-error-message>
        
        <modal-popup id="dcCaseDetailViolationsModal">
          <add-violation-form></add-violation-form>
        </modal-popup>

        <violations-table></violations-table>
      </div>
    `,
    computed: {},
    methods: {},
  };

  const app = new Vue(App);
});
