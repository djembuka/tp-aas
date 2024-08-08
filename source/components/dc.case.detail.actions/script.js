window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      modal: false,
      error: false,
      count: 3,
      cols: ['150px', 'auto'],
      actions: {
        th: [
          {
            id: 1,
            title: 'Дата',
          },
          {
            id: 2,
            title: 'Мера',
          },
        ],
        tr: [
          {
            id: 1,
            data: [
              {
                id: 1,
                text: '18 июля 2024',
              },
              {
                id: 2,
                text: 'Рекомендовать Правлению СРО ААС применить к аудитору [ОРНЗ] [ФИО] меру дисциплинарного воздействия в виде исключения из СРО ААС за нарушение требований Федерального закона №307-ФЗ «Об аудиторской деятельности».',
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
      addAction(state, { action }) {
        state.actions.tr.push(action);
      },
    },
    getters: {
      actionsCount(state) {
        return state.actions.tr.length;
      },
    },
    actions: {
      async addBX({ commit }, { data }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:dc.api`, 'add', data)
            .then(
              (r) => {
                commit('addAction', { action: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'add' });
              }
            );
        }
      },
    },
  });

  Vue.component('AddActionForm', {
    template: `
      <button class="btn btn-secondary" @click.prevent="addAction">Add action</button>
    `,
    methods: {
      addAction() {
        this.$store.dispatch('addBX', {
          data: {
            mode: 'class',
            data: {
              id: 4,
              data: [
                {
                  id: 1,
                  text: '18 июля 2024',
                },
                {
                  id: 2,
                  text: 'Рекомендовать Правлению СРО ААС применить к аудитору [ОРНЗ] [ФИО] меру дисциплинарного воздействия в виде исключения из СРО ААС за нарушение требований Федерального закона №307-ФЗ «Об аудиторской деятельности».',
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

  Vue.component('ActionsTable', {
    template: `
      <div class="b-dc-case-detail-actions">
        <h3>Меры<span class="text-muted">&nbsp;{{ $store.getters.actionsCount }}</span></h3>
        <button class="btn btn-primary" @click="showModal">Show modal</button>
        <table class="table table-responsive">
          <colgroup> 
            <col v-for="(action, index) in actions.th" :key="index * Math.floor(Math.random() * 100000)" :style="'width:' +  ($store.state.cols[index] || 'auto') + ';'">
          </colgroup>
          <thead>
            <tr>
              <th v-for="th in actions.th" :key="th.id">{{ th.title }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tr in actions.tr" :key="tr.id" :data-url="tr.url" :data-target="tr.target">
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
      actions() {
        return this.$store.state.actions;
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
    el: '#dcCaseDetailActions',
    store,
    template: `
      <div>
        <the-error-message></the-error-message>
        
        <modal-popup id="dcCaseDetailActionsModal">
          <add-action-form></add-action-form>
        </modal-popup>

        <actions-table></actions-table>
      </div>
    `,
    computed: {},
    methods: {},
  };

  const app = new Vue(App);
});
