window.BX = {
  message() {
    return 456789;
  },
};

window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      error: false,
      loading: false,
    },
    mutations: {
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
    },
    actions: {
      requestExapmpleBX({ commit }) {
        commit('setProp', { prop: 'loading', value: true });
        if (window.BX) {
          window.BX.ajax
            .runAction(`requestDocument`, {
              data: {},
            })
            .then(
              (r) => {
                if (r.status === 'success' && r.data && r.data.id) {
                }
              },
              (error) => {
                commit('showError', { error, method: 'requestDocument' });
              }
            );
        }
      },
    },
  });

  Vue.component('TheErrorMessage', {
    template: `
      <div v-if="error" class="b-get-excerpt-error" @click="clickError($event)">
        <div class="b-get-excerpt-error__content">
          <div class="b-get-excerpt-error__text">
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
    props: ['error'],
    methods: {
      clickError(event) {
        if (
          event.target.classList.contains('b-get-excerpt-error') ||
          event.target.classList.contains('btn')
        ) {
          this.$store.commit('showError', { error: false });
        }
      },
    },
  });

  const App = {
    el: '#vue2ComponentsApp',
    store,
    template: `
      <div>
        <button class="btn btn-primary" @click="showError">Show error</button>
        <the-error-message v-if="error" :error="error"></the-error-message>
      </div>
    `,
    data() {},
    computed: {
      error() {
        return this.$store.state.error;
      },
    },
    methods: {
      showError() {
        this.$store.commit('showError', {
          error: { errors: [{ code: 1, message: 'requestExample error' }] },
          method: 'requestExample',
        });
      },
    },
  };

  const app = new Vue(App);
});
