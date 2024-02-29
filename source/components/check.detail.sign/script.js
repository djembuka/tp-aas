window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      ...window.checkDetailSignStore,
      modal: {
        show: false,
        file: {},
      },
    },
    mutations: {
      showError(state, { error }) {
        Vue.set(state, 'error', error);
      },
      setModalProp(state, { prop, value }) {
        Vue.set(state.modal, prop, value);
      },
      setFileData(state, { file }) {
        if (!state.files) return;
        const changedFile = state.files.find(
          (f) => String(f.id) === String(file.id)
        );
        if (!changedFile) return;

        for (key in file) {
          if (file.hasOwnProperty(key)) {
            Vue.set(changedFile, key, file[key]);
          }
        }
        Vue.set(changedFile, 'signed', true);
      },
    },
    actions: {
      showModal({ commit }, { file }) {
        commit('setModalProp', { prop: 'show', value: true });
        commit('setModalProp', { prop: 'file', value: file });
      },
      hideModal({ commit }) {
        commit('setModalProp', { prop: 'show', value: false });
        commit('setModalProp', { prop: 'file', value: {} });
      },
      signAjax({ state, commit }) {
        if (window.BX) {
          return window.BX.ajax.runComponentAction('twinpx:vkd.act', 'sign', {
            mode: 'class',
            data: {
              vkkrId: state.vkkrid,
              id: state.modal.file.id,
              fileId: state.modal.file.fileid,
              userId: BX.message('USER_ID'),
            },
            dataType: 'json',
          });
        }
      },
    },
  });

  Vue.component('modalPopup', {
    data() {
      return {
        loading: false,
      };
    },
    template: `
    <div class="modal--text modal fade" id="checkDetailSignModal" tabindex="-1" aria-labelledby="checkDetailSignModalLabel" aria-hidden="true" style="display: none;">
      <div class="modal-dialog">
        <div class="modal-content">
            <button class="close" type="button" @click="close" aria-label="Close" style="background-image: url( '/template/images/cancel.svg' );"></button>
            <div class="modal-body">
                <div class="progress-indicator" v-if="loading">
                    <div class="item item-1"></div>
                    <div class="item item-2"></div>
                    <div class="item item-3"></div>
                    <div class="item item-4"></div>
                    <div class="item item-5"></div>
                </div>
                <div v-else>
                    <h3 class="text-center">Вы подписываете документ простой цифровой подписью</h3>
                    <hr>
                    <p class="text-center">
                    Обратите внимание, что вы подписываете документы, <b>«{{ $store.state.modal.file.filename }}»</b> с использованием простой цифровой подписи.
                    </p>
                    <hr class="hr--sl">
                    <div class="text-center modal-buttons">
                        <a class="btn btn-secondary btn-lg" @click="sign">Подписать</a>
                        <a class="btn btn-light btn-lg" @click="close">Отменить</a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    `,
    computed: {
      show() {
        return this.$store.state.modal.show;
      },
    },
    watch: {
      show(val) {
        if (val) {
          $('#checkDetailSignModal').modal('show');
        } else {
          $('#checkDetailSignModal').modal('hide');
        }
      },
    },
    methods: {
      sign() {
        this.loading = true;
        const pr = this.$store.dispatch('signAjax');
        pr.then(
          (r) => {
            this.close();
            if (r.status === 'success' && r.data) {
              this.$store.commit('setFileData', { file: r.data.file });
            } else {
              this.$store.commit('showError', { error: r.errors[0] });
            }
          },
          (error) => {
            this.close();
            this.$store.commit('showError', { error });
          }
        );
      },
      close() {
        this.loading = false;
        this.$store.dispatch('hideModal');
      },
    },
  });

  Vue.component('fileInfo', {
    data() {
      return {
        ext: this.file.filelink.split('.').reverse()[0],
      };
    },
    props: ['file'],
    template: `
      <div class="b-docs-block__item">
        <div class="b-docs-block__body">
          <a class="b-docs-block__icon" :href="file.filelink" :style="icon"></a>
          <span class="b-docs-block__text">
            <a :href="file.filelink" target="_blank">{{ name }}</a>
          </span>
        </div>
        <div v-if="file.readonly || file.signed" class="b-docs-block__signed">
            <div v-if="file.date" v-html="file.date"></div>
            <div v-if="status" v-html="status"></div>
        </div>
        <div v-else class="b-docs-block__button">
            <button class="btn btn-secondary btn-md" @click.prevent="click">Подписать</button>
        </div>
      </div>
    `,
    computed: {
      name() {
        return this.file.filename;
      },
      icon() {
        return `background-image: url( '/template/images/${this.ext}.svg' );`;
      },
      status() {
        const status = this.file.status;
        return `<div class="label-default"><span style="color:${status['text-color']}; background-color:${status['bg-color']}">${status.name}</span></div>`;
      },
    },
    methods: {
      click() {
        this.$store.dispatch('showModal', { file: this.file });
      },
    },
  });

  const App = {
    el: '#checkDetailSign',
    store,
    template: `
      <div>
        <div v-if="error" class="b-check-detail-sign-error" @click="clickError">
          <div class="b-check-detail-sign-error__content">
            {{ error }}
          </div>
        </div>
        <div v-for="file in files" :data-id="file.id">
          <file-info :file="file" :key="file.id"></file-info>
        </div>
        <modal-popup></modal-popup>
      </div>
    `,
    computed: {
      files() {
        return this.$store.state.files;
      },
      error() {
        return this.$store.state.error;
      },
    },
    methods: {
      clickError() {
        this.$store.commit('showError', { error: false });
      },
    },
  };

  const app = new Vue(App);
});
