window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex || !window.VueSelect) return;

  let velocity = window.Velocity || jQuery.Velocity;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      data: undefined,
      modal: { show: false, blockId: null, loading: false, status_comment: '' },
    },
    mutations: {
      setModalStatusComment(state, { status_comment }) {
        Vue.set(state.modal, 'status_comment', status_comment);
      },
      changeModalState(state, { show, blockId, loading }) {
        if (show !== undefined) {
          Vue.set(state.modal, 'show', show === 'show' ? true : false);
        }
        if (blockId !== undefined) {
          Vue.set(state.modal, 'blockId', blockId);
        }
        if (loading !== undefined) {
          Vue.set(state.modal, 'loading', loading);
        }
      },
      showError(state, { error, method }) {
        if (typeof error === 'boolean') {
          Vue.set(state, 'error', error);
        } else if (typeof error === 'object') {
          if (
            error.errors &&
            typeof error.errors === 'object' &&
            error.errors[0] &&
            error.errors[0].code
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
      changeBlockLoad(state, { blockId, load }) {
        const block = state.data.blocks.find(
          (b) => String(b.id) === String(blockId)
        );
        Vue.set(block, 'load', load);
        // block.load = load;
      },
      setVkkrId(state, { vkkrId }) {
        Vue.set(state, 'vkkrId', vkkrId);
      },
      setState(state, { data }) {
        Vue.set(state, 'data', data);
      },
      setStatuses(state, { statuses }) {
        Vue.set(state, 'statuses', statuses);
      },
      createControlMultyProps(_, { control }) {
        //make filename an array
        const filename = [control.filename];
        Vue.set(control, 'filename', filename);

        //create value array
        const value = filename.map((val) => {
          return {
            id: parseInt(Math.random() * 100000, 10),
            val,
          };
        });

        Vue.set(control, 'value', value);
      },
      changeControl(
        _,
        { control, controlIndex, collection, collectIndex, value }
      ) {
        //multiple collection
        if (collection.multiple && collectIndex !== undefined) {
          if (!collection.value || !collection.value[collectIndex]) return;

          if (control.multiple && controlIndex !== undefined) {
            if (!collection.value[collectIndex].files[`id${control.id}`]) {
              //first init
              Vue.set(
                collection.value[collectIndex].files,
                `id${control.id}`,
                []
              );
              Vue.set(
                collection.value[collectIndex].files[`id${control.id}`],
                controlIndex,
                {
                  id: parseInt(Math.random() * 100000, 10),
                  val: value,
                }
              );
            } else {
              //existing file input
              if (
                collection.value[collectIndex].files[`id${control.id}`][
                  controlIndex
                ]
              ) {
                Vue.set(
                  collection.value[collectIndex].files[`id${control.id}`][
                    controlIndex
                  ],
                  'val',
                  value
                );
              } else {
                //add file input
                Vue.set(
                  collection.value[collectIndex].files[`id${control.id}`],
                  controlIndex,
                  {
                    id: parseInt(Math.random() * 100000, 10),
                    val: value,
                  }
                );
              }
            }
          } else {
            Vue.set(
              collection.value[collectIndex].files,
              `id${control.id}`,
              value
            );
          }
        } else {
          //multy
          if (control.multiple && controlIndex !== undefined) {
            if (!control.value) {
              Vue.set(control, 'value', []);
            }
            if (!control.value[controlIndex]) {
              control.value.push({
                id: parseInt(Math.random() * 100000, 10),
              });
            }
            Vue.set(control.value[controlIndex], 'val', value);
            Vue.set(control.filename, controlIndex, value.name);
          } else {
            Vue.set(control, 'value', value);
            Vue.set(control, 'filename', value.name);
          }
        }
      },
      removeControl(_, { control, controlIndex, collection, collectIndex }) {
        if (collection.multiple && collectIndex !== undefined) {
          if (!collection.value || !collection.value[collectIndex]) return;

          if (collection.value[collectIndex].files[`id${control.id}`]) {
            collection.value[collectIndex].files[`id${control.id}`].splice(
              controlIndex,
              1
            );
          }
        } else {
          if (control.type === 'file') {
            control.filename.splice(controlIndex, 1);
          }
          control.value.splice(controlIndex, 1);
        }
      },
      //blocks
      setNewBlock(state, { blockId, newBlock }) {
        const index = state.data.blocks.findIndex((b) => b.id === blockId);
        Vue.set(state.data.blocks, index, newBlock);
      },
      setBlockStatus(state, { blockId, status }) {
        const block = state.data.blocks.find((b) => b.id === blockId);
        if (block) {
          block.status = status;
        }
      },
      //collections
      addToMultipleCollection(_, { collection, collectIndex }) {
        if (!collection || !collection.multiple) return;

        if (!collection.value) {
          Vue.set(collection, 'value', []);
          collectIndex = 0;
        }

        Vue.set(collection.value, collectIndex, {
          id: parseInt(Math.random() * 100000, 10),
        });

        Vue.set(collection.value[collectIndex], 'files', {});

        collection.files.forEach((f) => {
          if (f.multiple) {
            Vue.set(collection.value[collectIndex].files, `id${f.id}`, [
              {
                id: parseInt(Math.random() * 100000, 10),
                val: '',
              },
            ]);
          } else {
            Vue.set(collection.value[collectIndex].files, `id${f.id}`, '');
          }
        });
      },
      removeFromMultipleCollection(_, { collection, collectIndex }) {
        if (!collection || !collection.multiple || !collection.value) return;

        const value = collection.value.slice(0);
        value.splice(collectIndex, 1);
        Vue.set(collection, 'value', value);
      },
      changeControld(_, { collection, collectIndex }) {
        if (collection.multiple && collectIndex !== undefined) {
          if (!collection.value) {
            collection.value = [];
            collectIndex = 0;
          }
          if (!collection.value[controlIndex]) {
            collection.value.push({
              id: parseInt(Math.random() * 100000, 10),
            });
          }
          Vue.set(control.value[controlIndex], 'val', value);
          Vue.set(control.filename, controlIndex, value);
        }
      },
    },
    actions: {
      changeModalState({ commit }, { show, blockId, loading }) {
        commit('changeModalState', { show, blockId, loading });
      },
      async resetBlock(
        { dispatch, commit },
        { vkkr_id, block_id, status_comment }
      ) {
        if (window.BX) {
          window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'resetBlock', {
              mode: 'class',
              data: {
                vkkr_id,
                block_id,
                status_comment,
              },
              dataType: 'json',
            })
            .then(
              (r) => {
                return dispatch('blockBX', {
                  blockId: block_id,
                });
              },
              (error) => {
                commit('showError', { error, method: 'resetBlock' });
              }
            )
            .then((r) => {
              //close modal popup, remove load
              dispatch('changeModalState', {
                show: 'hide',
                blockId: null,
                loading: false,
              });
              //scroll window to the block
              const blockElem = document.querySelector(
                `div[data-id="${block_id}"]`
              );
              if (blockElem) {
                window.scrollTo({
                  top:
                    blockElem.getBoundingClientRect().top -
                    100 +
                    window.scrollY,
                });
              }
            });
        }
      },
      async loadState({ state, commit }) {
        if (window.BX) {
          window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'blocks', {
              mode: 'class',
              data: {
                vkkr_id: state.vkkrId,
                sessid: BX.bitrix_sessid(),
              },
              dataType: 'json',
            })
            .then(
              (r) => {
                commit('setState', { data: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'blocks' });
              }
            );
        }
      },
      async loadStatuses({ commit }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'statuses', {
              mode: 'class',
              data: {
                sessid: BX.bitrix_sessid(),
              },
              dataType: 'json',
            })
            .then(
              (r) => {
                commit('setStatuses', { statuses: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'statuses' });
              }
            );
        }
      },
      async setBlockStatusBX(
        { state, commit },
        { blockId, statusId, statusComment }
      ) {
        commit('changeBlockLoad', { blockId, load: true });
        if (window.BX) {
          return window.BX.ajax.runComponentAction(
            'twinpx:vkkr.api',
            'setBlockStatus',
            {
              mode: 'class',
              data: {
                vkkr_id: state.vkkrId,
                block_id: blockId,
                status: {
                  status_id: statusId,
                  status_comment: statusComment,
                },
                sessid: BX.bitrix_sessid(),
              },
              dataType: 'json',
            }
          );
        }
      },
      async saveBlockBX({ commit }, { formData }) {
        if (window.BX) {
          return window.BX.ajax.runComponentAction(
            `twinpx:vkkr.api`,
            'saveBlock',
            {
              mode: 'class',
              data: formData,
              dataType: 'json',
            }
          );
        }
      },
      async blockBX({ state, commit }, { blockId }) {
        commit('changeBlockLoad', { blockId, load: true });
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'block', {
              mode: 'class',
              data: {
                vkkr_id: state.vkkrId,
                block_id: blockId,
              },
              dataType: 'json',
            })
            .then(
              (r) => {
                commit('changeBlockLoad', { blockId, load: false });
                commit('setNewBlock', { blockId, newBlock: r.data });
              },
              (error) => {
                commit('showError', { error, method: 'block' });
              }
            );
        }
      },
      async historyBX({ state, commit }, { blockId }) {
        if (window.BX) {
          commit('changeBlockLoad', { blockId, load: true });
          return window.BX.ajax.runComponentAction(
            `twinpx:vkkr.api`,
            'history',
            {
              mode: 'class',
              data: {
                vkkr_id: state.vkkrId,
                block_id: blockId,
              },
              dataType: 'json',
            }
          );
        }
      },
      async downloadBX({ commit }, { vkkr_id, block_id, history }) {
        if (window.BX) {
          const data = {
            vkkr_id,
          };

          if (block_id !== undefined) {
            data.block_id = block_id;
          }

          if (history !== undefined) {
            data.history = history;
          }

          BX.ajax
            .runComponentAction('twinpx:vkkr.api', 'download', {
              mode: 'class',
              data: data,
            })
            .then(
              (r) => {
                if (r.data.url) {
                  window.open(r.data.url, '_blank');
                }
              },
              (error) => {
                commit('showError', { error, method: 'download' });
              }
            );
        }
      },
      setControlValue(
        { commit },
        { control, controlIndex, collection, collectIndex, value }
      ) {
        commit('changeControl', {
          control,
          controlIndex,
          collection,
          collectIndex,
          value,
        });
      },
      setCollectionValue({ commit }, { collection, collectIndex }) {
        commit('addToMultipleCollection', {
          collection,
          collectIndex,
        });
      },
      removeCollectionValue({ commit }, { collection, collectIndex }) {
        commit('removeFromMultipleCollection', {
          collection,
          collectIndex,
        });
      },
    },
  });

  Vue.component('v-select', VueSelect.VueSelect);

  Vue.component('collapseBlock', {
    data() {
      return {
        slide: false,
        open: false,
        state: 'content', //'history', 'loader'
        history: [],
        historyIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g transform="translate(-108 -188)">
            <path d="M9.749,0H3.269c-3.76,0-4.05,3.38-2.02,5.22l10.52,9.56C13.8,16.62,13.509,20,9.749,20H3.269c-3.76,0-4.05-3.38-2.02-5.22l10.52-9.56C13.8,3.38,13.509,0,9.749,0Z" transform="translate(113.491 190)" fill="none" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
            <path d="M0,0H24V24H0Z" transform="translate(108 188)" fill="none" opacity="0"/>
          </g>
        </svg>`,
      };
    },
    props: ['block'],
    template: `
      <div class="b-collapse-vc" :class="{slide: slide, open: open}">
        <div class="b-collapse-vc__head" @click.stop.prevent="toggleBody()">
          <a href="" @click.prevent>
            {{ block.name }}
          </a>
          <div class="b-collapse-vc__right">
            <div v-if="block.status" v-html="status" class="b-collapse-vc__status"></div>
            <span class="b-collapse-vc__icon"></span>
          </div>
        </div>
        <transition @enter="enter" @leave="leave" :css="false">
          <div class="b-collapse-vc__body" v-if="slide">

            <div :class="{'b-check-detail-fileload__block': true, 'b-check-detail-fileload__block--load': block.load}" v-if="state==='content' || block.load">

              <div v-if="!block.load">

                <div class="b-check-detail-fileload__history-icon" v-html="historyIcon" v-if="status" @click.prevent="showHistory"></div>

                <div v-if="block.permissions.moderation">
                  <files-collection-info v-for="(collection, index) in block.items" :block="block" :collection="collection" :last="index === block.items.length-1"></files-collection-info>

                  <moderation-form :blockId="block.id" v-if="block.state==='moderating'"></moderation-form>
                </div>
                <div v-else-if="block.permissions.write">
                  <fileload-form v-if="block.state==='empty'" :collections="block.items" :block="block"></fileload-form>

                  <div v-else-if="block.state==='moderating' || block.state==='filled'">
                    <files-collection-info v-for="(collection, index) in block.items" :block="block" :collection="collection" :last="index === block.items.length-1"></files-collection-info>
                  </div>
                </div>
                <div v-else-if="block.permissions.monitoring">
                  <files-collection-info v-for="(collection, index) in block.items" :block="block" :collection="collection" :last="index === block.items.length-1"></files-collection-info>
                </div>
                <div v-else-if="block.permissions.supervisor">
                  <files-collection-info v-for="(collection, index) in block.items" :block="block" :collection="collection" :last="index === block.items.length-1"></files-collection-info>

                  <div v-if="block.state === 'filled' || block.state === 'moderating'">
                    <reset-form :blockId="block.id"></reset-form>
                  </div>
                </div>
                <div v-else-if="block.permissions.read">
                  <files-collection-info v-for="(collection, index) in block.items" :block="block" :collection="collection" :last="index === block.items.length-1"></files-collection-info>
                </div>

              </div>
            </div>

            <div v-else-if="state === 'history'">
              <history-attempt v-for="(attempt, index) in history" :attempt="attempt" :attemptIndex="history.length - index" @toContent="toContent"></history-attempt>

              <attempts-archive :block="block"></attempts-archive>
            </div>
          </div>
        </transition>
      </div>
    `,
    computed: {
      status() {
        if (!this.block.status || this.block.status === '0') return;

        const status = this.$store.state.statuses.find(
          (s) => String(s.id) === String(this.block.status)
        );
        return `<div class="label-default"><span style="color:${status['text-color']}; background-color:${status['bg-color']}">${status.name}</span></div>`;
      },
      blockState() {
        return this.block.state;
      },
    },
    methods: {
      //transition
      enter: function (el, done) {
        if (!velocity) return;
        velocity(el, 'slideDown', {
          easing: 'ease',
          duration: 500,
        });
      },
      leave: function (el, done) {
        if (!velocity) return;
        velocity(el, 'slideUp', {
          easing: 'ease',
          duration: 500,
        });
      },
      toggleBody() {
        //set slide class for the main div
        this.slide = !this.slide;
        //slide body
        this.open = !this.open;
      },
      showHistory() {
        const blockId = this.block.id;
        //get history
        const pr = this.$store.dispatch('historyBX', {
          blockId,
        });

        pr.then(
          (r) => {
            this.state = 'history';
            if (r.data) {
              this.$store.commit('changeBlockLoad', {
                blockId,
                load: false,
              });
              this.history = this.splitToAttempts(r.data);
            }
          },
          (error) => {
            this.$store.commit('showError', { error, method: 'history' });
          }
        );
      },
      splitToAttempts(historyArray) {
        const result = [];
        historyArray.reverse().forEach((item) => {
          if (item.type === 'uploaded_files') {
            result.push([item]);
          } else if (item.type === 'changed_status') {
            result[result.length - 1].push(item);
          }
        });

        return result.reverse();
      },
      toContent() {
        this.state = 'content';
      },
    },
  });

  Vue.component('resetForm', {
    data() {
      return {
        heading: 'Сброс статуса файла',
        textarea: {
          label: 'Комментарий для сотрудников СРО ААС',
          name: 'RESET_COMMENT',
        },
        textareaValue: '',
        button: {
          text: 'Сбросить',
          message: 'Для отправки необходимо заполнить все поля.',
          disabled: true, //!textareaValue,
        },
      };
    },
    template: `
      <div>
        <h3>{{ heading }}</h3>
        <hr>
        <form enctype="multipart/form-data">
          <div class="row">
            <div class="col-sm-6">

              <div>
                <div class="b-float-label" :class="{invalid: textarea.invalid}">
                  <textarea :name="textarea.name" autocomplete="off" required="required" v-model="textareaValue" :class="{active: textareaActive}"></textarea>
                  <label>{{textarea.label}}</label>
                </div>
                <hr>
              </div>

              <div class="b-reset-form__button">
                <div class="btn btn-danger btn-lg" @click="showModalPopup" :disabled="disabled">{{button.text}}</div>

                <div class="text-muted">{{button.message}}</div>
              </div>

            </div>
            <div class="col-sm-6 b-reset-form__text">
              <p>Вы имеете право возвращать статус документа к состоянию «Ничего не добавлено», при этом сохраняется история со всеми версиями файла. Применяйте эту функцию только в исключительных случаях, когда пользователь, проверяющий документ, допустил ошибку.</p>
            </div>
          </div>
          
        </form>
      </div>
    `,
    props: ['blockId'],
    computed: {
      textareaActive() {
        return !!this.textareaValue;
      },
      disabled() {
        return !this.textareaValue;
      },
    },
    methods: {
      showModalPopup() {
        this.$store.commit('setModalStatusComment', {
          status_comment: this.textareaValue,
        });
        this.$store.dispatch('changeModalState', {
          show: 'show',
          blockId: this.blockId,
        });
      },
    },
  });

  Vue.component('filesCollectionMulty', {
    data() {
      return {};
    },
    props: ['block', 'collection'],
    template: `
      <div>
        <hr class="hr--md" style="margin-top: 0;">
        <transition-group name="list" tag="div" >
          <div v-for="(valueObject, idx) in collection.value" :key="valueObject.id" class="multy-collection-wrapper">
          
            <div v-if="collection.value.length > 1" @click="remove(idx)" class="multy-collection-wrapper__remove btn-delete"></div>

            <files-collection :collection="collection" :collectIndex="idx" :block="block"></files-collection>

            <hr>
          </div>
        </transition-group>

        <hr class="hr--xxxl hr--line" style="margin-top: 0;">

        <button class="btn btn-success btn-md" :class="{disabled: isBtnDisabled}" @click.prevent="add">Добавить еще</button>
        <hr class="hr--sl">
      </div>
    `,
    computed: {
      isBtnDisabled() {
        if (
          this.collection.maxcollections &&
          typeof this.collection.maxcollections === 'number'
        ) {
          return this.collection.value.length >= this.collection.maxcollections;
        } else {
          return false;
        }
      },
    },
    methods: {
      add() {
        this.$store.dispatch('setCollectionValue', {
          collection: this.collection,
          collectIndex: this.collection.value.length,
        });
      },
      remove(idx) {
        this.$store.dispatch('removeCollectionValue', {
          collection: this.collection,
          collectIndex: idx,
        });
      },
    },
    beforeMount() {
      this.$store.dispatch('setCollectionValue', {
        collection: this.collection,
        collectIndex: null,
      });
    },
  });

  Vue.component('filesCollection', {
    data() {
      return {};
    },
    props: ['block', 'collection', 'collectIndex'],
    template: `
      <div class="b-files-collection">
        <div class="b-files-collection__name">{{ collection.name }}</div>
        <div class="b-files-collection__description" v-html="collection.description"></div>
        
        <hr>

        <div v-for="formControl in collection.files" :key="formControl.id">
            <hr>

            <form-control-multy v-if="formControl.multiple" :formControl="formControl" :collection="collection" :collectIndex="collectIndex"></form-control-multy>

            <form-control-cols v-else :formControl="formControl" :collection="collection" :collectIndex="collectIndex"></form-control-cols>
        </div>
      </div>
    `,
  });

  Vue.component('filesCollectionInfo', {
    data() {
      return {};
    },
    props: ['block', 'collection', 'last', 'status', 'history'],
    template: `
      <div class="b-files-collection-info">
        <div class="b-files-collection__name">{{ collection.name }}</div>
        <div class="b-files-collection__description" v-html="collection.description"></div>

        <hr>

        <div v-if="showInfo">

          <file-info v-for="file in collection.files" :key="file.id" :block="block" :file="file" :statusCode="status"></file-info>

          <hr>

          <files-archive v-if="last" :block="block" :history="history"></files-archive>

        </div>
        <div v-else-if="showInfoEmpty">

          <file-info-empty></file-info-empty>

          <hr v-if="!last">

        </div>
      </div>
    `,
    computed: {
      showInfo() {
        let result = false;
        if (this.block.type === 'uploaded_files') {
          result = true;
        } else if (
          this.block.permissions.moderation &&
          (this.block.state === 'moderating' || this.block.state === 'filled')
        ) {
          result = true;
        } else if (
          this.block.permissions.write &&
          (this.block.state === 'moderating' || this.block.state === 'filled')
        ) {
          result = true;
        } else if (
          this.block.permissions.monitoring &&
          (this.block.state === 'moderating' || this.block.state === 'filled')
        ) {
          result = true;
        } else if (
          this.block.permissions.supervisor &&
          (this.block.state === 'moderating' || this.block.state === 'filled')
        ) {
          result = true;
        } else if (
          this.block.permissions.read &&
          this.block.state === 'filled'
        ) {
          result = true;
        }

        return result;
      },
      showInfoEmpty() {
        let result = false;

        if (
          (this.block.permissions.moderation ||
            this.block.permissions.monitoring ||
            this.block.permissions.supervisor) &&
          this.block.state === 'empty'
        ) {
          result = true;
        }

        return result;
      },
    },
  });

  Vue.component('fileInfo', {
    data() {
      return {
        ext: this.file.filename.split('.').reverse()[0],
      };
    },
    props: ['block', 'file', 'statusCode'],
    template: `
      <div class="b-docs-block__item" :href="file.filelink">
        <div class="b-docs-block__body">
          <a class="b-docs-block__icon" :href="file.filelink" :style="icon"></a>
          <span class="b-docs-block__text">
            <a :href="file.filelink">{{ name }}</a>
            <span class="b-docs-block__data">
              <span class="text-muted" v-if="filesize">{{ filesize }} .{{ ext }}</span>
              <span class="text-muted" v-if="date">Дата публикации: {{ date }}</span>
              <span class="text-muted" v-if="block.author_name">Автор: <a :href="'/person/'+block.author_id+'/'">{{ block.author_name }}</a></span>
            </span>
          </span>
        </div>
        <div v-if="status" v-html="status"></div>
      </div>
    `,
    computed: {
      name() {
        const index = this.file.filename.lastIndexOf('.');
        return this.file.filename.substring(0, index);
      },
      icon() {
        return `background-image: url( '/template/images/${this.ext}.svg' );`;
      },
      status() {
        const status = this.$store.state.statuses.find((s) => {
          return (
            String(s.id) === String(this.statusCode) ||
            (!this.statusCode && String(s.id) === String(this.block.status))
          );
        });
        if (!status) return '';

        return `<div class="label-default"><span style="color:${status['text-color']}; background-color:${status['bg-color']}">${status.name}</span></div>`;
      },
      filesize() {
        return this.formatSize(this.file.filesize);
      },
      date() {
        return this.block.date || this.block.date_added || '';
      },
    },
    methods: {
      formatSize(length) {
        var i = 0,
          type = ['б', 'Кб', 'Мб', 'Гб', 'Тб', 'Пб'];
        while ((length / 1024) | 0 && i < type.length - 1) {
          length /= 1024;
          i++;
        }
        return parseInt(length) + ' ' + type[i];
      },
    },
  });

  Vue.component('fileInfoEmpty', {
    template: `
      <div class="b-docs-block__item b-docs-block__item--empty">
        <div class="b-docs-block__body">
          <span class="b-docs-block__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
              <g transform="translate(-364.5 -186.5)">
                <path d="M11.2,32h9.6c8,0,11.2-3.2,11.2-11.2V11.2C32,3.2,28.8,0,20.8,0H11.2C3.2,0,0,3.2,0,11.2v9.6C0,28.8,3.2,32,11.2,32Z" transform="translate(366 188)" fill="none" stroke="#c6c6c6" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                <path d="M0,.01H6.018A3.725,3.725,0,0,1,8.883,1.12l1.425,1.79a3.756,3.756,0,0,0,2.881,1.1h5.65A3.725,3.725,0,0,0,21.7,2.9l1.425-1.79A3.725,3.725,0,0,1,25.994,0H31.98" transform="translate(366 207.238)" fill="none" stroke="#c6c6c6" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
              </g>
            </svg>
          </span>
          <span class="b-docs-block__text">
            <span class="b-docs-block__data">
              <span>Ничего не добавлено</span>
            </span>
          </span>
        </div>
      </div>
    `,
  });

  Vue.component('formControlMulty', {
    data() {
      return {};
    },
    props: ['formControl', 'collection', 'collectIndex'],
    template: `
      <div>
        <div v-if="formControl.type==='file'">
          <transition-group name="list" tag="div" >

            <div v-for="(valueObject, idx) in values" :key="valueObject.id" class="multy-control-wrapper">

              <div v-if="btnDeleteVisible" @click="remove(idx)" class="multy-control-wrapper__remove btn-delete"></div>

              <form-control-cols :formControl="formControl" :controlIndex="idx" :collection="collection" :collectIndex="collectIndex"></form-control-cols>

              <hr >
            </div>
          </transition-group>
        </div>
        <button class="btn btn-success btn-md" :class="{disabled: isBtnDisabled}" @click.prevent="add">Добавить еще</button>
        <hr class="hr--sl">
      </div>
    `,
    computed: {
      btnDeleteVisible() {
        if (this.collection.multiple) {
          return (
            this.collection.value[this.collectIndex].files[
              `id${this.formControl.id}`
            ].length > 1
          );
        } else {
          return this.formControl.value.length > 1;
        }
      },
      values() {
        if (this.collection.multiple) {
          return this.collection.value[this.collectIndex].files[
            `id${this.formControl.id}`
          ];
        } else {
          return this.formControl.value;
        }
      },
      isBtnDisabled() {
        if (
          this.formControl.maxfiles &&
          typeof this.formControl.maxfiles === 'number'
        ) {
          if (this.collection.multiple) {
            return (
              this.collection.value[this.collectIndex].files[
                `id${this.formControl.id}`
              ].length >= this.formControl.maxfiles
            );
          } else {
            return this.formControl.value.length >= this.formControl.maxfiles;
          }
        } else {
          return false;
        }
      },
    },
    methods: {
      validate() {
        if (this.required && !this.controlValue) {
          this.isInvalid = true;
        } else {
          this.isInvalid = false;
        }
      },
      add() {
        let controlIndex = this.formControl.value.length;

        if (this.collection && this.collection.multiple) {
          controlIndex =
            this.collection.value[this.collectIndex].files[
              `id${this.formControl.id}`
            ].length;
        }

        this.$store.dispatch('setControlValue', {
          control: this.formControl,
          controlIndex,
          collection: this.collection,
          collectIndex: this.collectIndex,
          value: '',
        });
      },
      remove(idx) {
        this.$store.commit('removeControl', {
          control: this.formControl,
          controlIndex: idx,
          collection: this.collection,
          collectIndex: this.collectIndex,
        });
      },
    },
    beforeMount() {
      if (
        this.formControl.filename === null ||
        typeof this.formControl.filename !== 'object'
      ) {
        this.$store.commit('createControlMultyProps', {
          control: this.formControl,
        });
      }
    },
  });

  Vue.component('formControlCols', {
    template: `
        <div class="b-form-control-cols">
            <div class="b-form-control-cols__control">
                <form-control-file :formControl="formControl" :controlIndex="controlIndex" :collection="collection"  :collectIndex="collectIndex"></form-control-file>
            </div>
            <div class="b-form-control-cols__desc" v-if="formControl.hint" v-html="formControl.hint"></div>
        </div>
    `,
    props: ['formControl', 'controlIndex', 'collection', 'collectIndex'],
  });

  Vue.component('formControlFile', {
    data() {
      return {
        disabled: this.formControl.disabled,
        isFileLoaded: false,
        isActive: true,
        files: [],
        icon: `<g transform="translate(-4.461)">
            <g transform="translate(4.461)">
              <g>
                <path d="M21.844,6.573v15.88A1.547,1.547,0,0,1,20.3,24H6.008a1.546,1.546,0,0,1-1.547-1.547V1.547A1.546,1.546,0,0,1,6.008,0H15.27Z" transform="translate(-4.461)" class="a"/>
              </g>
              <path d="M20.036,8.289l5.677,2.339v-2.2l-3.218-.951Z" transform="translate(-8.33 -1.858)" class="b"/>
              <path d="M25.416,6.573H20.389a1.546,1.546,0,0,1-1.547-1.547V0Z" transform="translate(-8.033)" class="c"/>
            </g>
            <path d="M18.117,19.012l-2.85-2.85a.555.555,0,0,0-.785,0l-2.85,2.85a.555.555,0,0,0,.785.784l1.9-1.9v5.024a.555.555,0,1,0,1.109,0V17.894l1.9,1.9a.555.555,0,0,0,.785-.784Z" transform="translate(-1.741 -3.974)" class="d"/>
          </g>`,

        labelName: this.formControl.name || '',
        required: this.formControl.required || true,
      };
    },
    template: `<div
        class="b-float-label--file"
        :class="{
        'invalid': invalid,
        'slr2-page-settings__control--disabled': disabled,
        }"
      >
        <span
          class="b-float-label-file__clear"
          @click.prevent="clearInputFile"
          v-if="isClearable"
          >
        </span>
        <div
          class="b-float-label--file"
          :class="{
            filled: isFilled,
            clearable: isClearable,
          }"
          ref="controlFile"
        >
          <span class="b-float-label-file__label">{{labelName}}</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17.383"
            height="24"
            viewBox="0 0 17.383 24"
            v-html="icon"
          ></svg>

          <input
            type="file"
            :name="name"
            :id="id"
            @change="uploadFile($refs.inputFile.files)"
            ref="inputFile"
          />
          <label
            :for="id"
            class="active"
            v-html="label"
            ref="dropzone"
          ></label>
        </div>
      </div>`,
    props: {
      formControl: Object,
      controlIndex: {
        type: [Number, String],
        required: true,
        default() {
          return 0;
        },
      },
      collection: Object,
      collectIndex: {
        type: [Number, String],
        required: true,
        default() {
          return 0;
        },
      },
    },
    computed: {
      id() {
        const cId = this.collection.id,
          cIndex = this.collectIndex !== undefined ? this.collectIndex : '',
          fId = this.formControl.id,
          fIndex = this.controlIndex !== undefined ? this.controlIndex : '';

        return `id_${cId}_${cIndex}_${fId}_${fIndex}`;
      },
      name() {
        const cId = this.collection.id,
          cIndex = this.collectIndex !== undefined ? this.collectIndex : '',
          fId = this.formControl.id,
          fIndex = this.controlIndex !== undefined ? this.controlIndex : '';

        return `${cId}|${cIndex}|${fId}|${fIndex}`;
      },
      invalid() {
        return !!this.invalidString;
      },
      isClearable() {
        return !!this.filename || this.invalid;
      },
      isFilled() {
        return !!this.filename;
      },
      fileid() {
        return this.formControl.value;
      },
      invalidString() {
        if (this.files[0] && this.files[0].size && this.files[0].name) {
          if (this.files[0].size >= this.formControl.maxfilesize) {
            //this.files = [];
            return `Размер файла превышает ${this.formatSize(
              this.formControl.maxfilesize
            )}`;
          }

          const filename = this.files[0].name;
          const lastIndex = filename.lastIndexOf('.');
          const regExp = new RegExp(this.formControl.accept.join('|'));

          if (!regExp.test(filename.substring(lastIndex + 1).toLowerCase())) {
            //this.files = [];
            return `Прикладывайте файлы ${this.formControl.accept
              .map((w) => w.toUpperCase())
              .join(', ')}.`;
          }
        }
        return '';
      },
      label() {
        if (this.invalid) {
          return this.invalidString;
        }
        if (this.files[0] && this.files[0].name) {
          return this.files[0].name;
        }

        let result = '';
        if (this.collection.multiple) {
          result =
            this.collection.value[this.collectIndex].files[
              `id${this.formControl.id}`
            ];
          if (this.formControl.multiple) {
            result = result[this.controlIndex].val;
          }
        } else {
          result = this.formControl.filename;
          if (this.formControl.multiple) {
            result = result[this.controlIndex];
          }
        }
        if (result) return result;

        return this.default;
      },
      filename() {
        let result;

        if (this.collection.multiple) {
          result =
            this.collection.value[this.collectIndex].files[
              `id${this.formControl.id}`
            ];
          if (this.formControl.multiple) {
            result = result[this.controlIndex].val;
          }
        } else {
          result = this.formControl.filename;
          if (this.formControl.multiple) {
            result = result[this.controlIndex];
          }
        }
        return result;
      },
      default() {
        let result = '';
        if (this.formControl.accept && this.formControl.maxfilesize) {
          result = `<a href>Выберите файл</a> (${this.formControl.accept.join(
            ', '
          )}, до ${this.formatSize(this.formControl.maxfilesize)})`;
        } else {
          result = '<a href>Выберите файл</a> или перетащить в поле';
        }
        return result;
      },
    },
    methods: {
      uploadFile(files) {
        this.files = files;

        this.$store.dispatch('setControlValue', {
          control: this.formControl,
          controlIndex: this.controlIndex,
          collection: this.collection,
          collectIndex: this.collectIndex,
          value: this.invalid ? '' : files[0],
        });
      },
      clearInputFile() {
        this.files = [];
        this.$refs.inputFile.value = '';
        //set value
        this.$store.dispatch('setControlValue', {
          control: this.formControl,
          controlIndex: this.controlIndex,
          collection: this.collection,
          collectIndex: this.collectIndex,
          value: '',
        });
      },
      cancelEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      getCoords(elem) {
        let box = elem.getBoundingClientRect();

        return {
          top: box.top + scrollY,
          left: box.left + scrollX,
        };
      },
      formatSize(length) {
        var i = 0,
          type = ['б', 'Кб', 'Мб', 'Гб', 'Тб', 'Пб'];
        while ((length / 1024) | 0 && i < type.length - 1) {
          length /= 1024;
          i++;
        }
        return parseInt(length) + ' ' + type[i];
      },
    },
    mounted() {
      //drag&drop file
      const dropZone = this.$refs.dropzone;
      const controlFile = this.$refs.controlFile;
      if (!dropZone) {
        return;
      }
      dropZone.addEventListener('drag', this.cancelEvent);
      dropZone.addEventListener('dragstart', this.cancelEvent);
      dropZone.addEventListener('dragend', this.cancelEvent);
      dropZone.addEventListener('dragover', this.cancelEvent);
      dropZone.addEventListener('dragenter', this.cancelEvent);
      dropZone.addEventListener('dragleave', this.cancelEvent);
      dropZone.addEventListener('drop', this.cancelEvent);

      dropZone.addEventListener('dragover', () => {
        controlFile.classList.add('dragover');
      });
      dropZone.addEventListener('dragenter', () => {
        controlFile.classList.add('dragover');
      });
      dropZone.addEventListener('dragleave', (e) => {
        let dx = e.pageX - this.getCoords(dropZone).left;
        let dy = e.pageY - this.getCoords(dropZone).top;
        if (
          dx < 0 ||
          dx > dropZone.clientWidth ||
          dy < 0 ||
          dy > dropZone.clientHeight
        ) {
          controlFile.classList.remove('dragover');
        }
      });

      dropZone.addEventListener('drop', (e) => {
        controlFile.classList.remove('dragover');
        controlFile.classList.add('filled');
        this.uploadFile(e.dataTransfer.files);
      });
    },
  });

  Vue.component('FileloadForm', {
    data() {
      return {
        formData: null,
      };
    },
    template: `
      <div>
        <form ref="fileload-form" action="" method="" enctype= multipart/form-data>
          <div v-for="collection in collections" :key="collection.id">
            <files-collection-multy v-if="collection.multiple" :collection="collection" :block="block"></files-collection-multy>

            <files-collection v-else :collection="collection" :block="block"></files-collection>

            <hr>
          </div>
        </form>

        <hr>

        <div class="b-check-detail-fileload-savebutton muted small d-flex align-items-center">
          <div class="btn btn-secondary btn-lg" href="" @click="submit" :disabled="isBtnDisabled">Отправить</div>
          <div class="b-check-detail-fileload-savetext" v-if="isBtnDisabled">Кнопка останется неактивной до тех пор, пока не будут заполнены все поля в каждой секции.
          Пожалуйста, убедитесь, что все обязательные поля заполнены.</div>
        </div>
        
      </div>`,
    props: ['collections', 'block'],
    computed: {
      isBtnDisabled() {
        let result;
        result = this.collections.every((c) => {
          if (c.multiple) {
            if (c.value) {
              return c.value.every((cObj) => {
                return Object.values(cObj.files).every((v) => {
                  if (typeof v === 'object' && v.every) {
                    return v.every((obj) => !!obj.val);
                  } else {
                    return !!v;
                  }
                });
              });
            } else {
              return false;
            }
          } else {
            return c.files.every((f) => {
              if (
                f.multiple &&
                typeof f.filename === 'object' &&
                f.filename !== null &&
                f.filename.every((n) => n)
              ) {
                return true;
              } else if (!f.multiple && f.filename) {
                return true;
              } else {
                return false;
              }
            });
          }
        });

        return !result;
      },
    },
    methods: {
      getFilesData() {
        this.collections.forEach((c) => {
          if (c.multiple) {
            //multiple conllection
            if (c.value) {
              c.value.forEach((vObj, cIdx) => {
                Object.entries(vObj.files).forEach((fArr) => {
                  const f = fArr[1];
                  if (typeof f === 'object') {
                    if (f.forEach) {
                      //multiple control
                      f.forEach((obj, fIdx) => {
                        const id = fArr[0].substring(2);
                        this.formData.append(
                          `${c.id}|${cIdx}|${id}|${fIdx}`,
                          obj.val,
                          obj.val ? obj.val.name : ''
                        );
                      });
                    } else {
                      //single control
                      const id = fArr[0].substring(2);
                      this.formData.append(
                        `${c.id}|${cIdx}|${id}|0`,
                        fArr[1],
                        fArr[1].name
                      );
                    }
                  }
                });
              });
            }
          } else {
            //single collection
            c.files.forEach((f) => {
              if (
                f.multiple &&
                typeof f.value === 'object' &&
                f.value.forEach
              ) {
                //multiple control
                f.value.forEach((obj, fIdx) => {
                  this.formData.append(
                    `${c.id}|0|${f.id}|${fIdx}`,
                    obj.val,
                    obj.val ? obj.val.name : ''
                  );
                });
              } else if (!f.multiple && f.value) {
                //single control
                this.formData.append(
                  `${c.id}|0|${f.id}|0`,
                  f.value,
                  f.value.name
                );
              }
            });
          }
        });
      },
      submit() {
        const blockId = this.block.id;
        this.formData = new FormData(); //(this.$refs['fileload-form']);
        this.formData.append('vkkr_id', this.$store.state.vkkrId);
        this.formData.append('block_id', blockId);
        this.formData.append('sessid', window.BX.bitrix_sessid());

        this.getFilesData();

        this.$store.commit('changeBlockLoad', {
          blockId,
          load: true,
        });

        const pr = this.$store.dispatch('saveBlockBX', {
          formData: this.formData,
        });

        window.scrollTo({
          top:
            this.$refs['fileload-form']
              .closest('.b-collapse-vc')
              .getBoundingClientRect().top +
            window.scrollY -
            100,
          behavior: 'smooth',
        });

        pr.then(
          (r) => {
            this.$store.commit('changeBlockLoad', {
              blockId,
              load: false,
            });
            return this.$store.dispatch('blockBX', {
              blockId,
            });
          },
          (error) => {
            this.$store.commit('changeBlockLoad', {
              blockId,
              load: false,
            });
            this.$store.commit('showError', { error, method: 'saveBlock' });
          }
        );
      },
    },
  });

  Vue.component('ModerationForm', {
    data() {
      return {
        heading: 'Изменение статуса документа',
        required: true,
        isLoading: false,
        select: {
          label: 'Статус документа',
          name: 'MODERATION_STATUS',
        },
        selectedOption: { label: '', code: '' },
        textarea: {
          label: 'Комментарий для сотрудников СРО ААС',
          name: 'MODERATION_COMMENT',
        },
        textareaValue: '',
        button: {
          text: 'Сохранить',
          message: 'Для отправки необходимо заполнить все поля.',
          disabled: false, //this.!textareaValue
        },
      };
    },
    template: `
    <div>
      <h3>{{ heading }}</h3>
      <hr>
      <form enctype="multipart/form-data">
        <div class="row">
          <div class="col-sm-6">

            <div class="form-control-wrapper">

              <v-select :searchable="false" :options="options" class="form-control-select"  @input="onSelect" v-model="selectedOption"></v-select>

              <label>{{select.label}}</label>

              <input type="hidden" :name="select.name" v-model="selectedOption.code">
            </div>

            <hr>

            <div>
              <div class="b-float-label" :class="{invalid: textarea.invalid}">
                <textarea :name="textarea.name" autocomplete="off" required="required" v-model="textareaValue" :class="{active: textareaActive}"></textarea>
                <label>{{textarea.label}}</label>
              </div>
              <hr>
            </div>

            <div class="b-moderation-form__button">
              <a href="" class="btn btn-secondary btn-lg" :class="{'btn--load-circle': isLoading}" :disabled="button.disabled" @click.prevent="changeStatus">{{button.text}}</a>

              <div class="text-muted">{{button.message}}</div>
            </div>

          </div>
          <div class="col-sm-6 b-moderation-form__text">
            <p>Перед вами последняя версия документа. Пожалуйста, тщательно оцените, соответствует ли она критериям для дальнейшей работы. Если документ не подходит, укажите причины отклонения как можно более подробно. Это поможет автору исправить ошибки и предоставить обновленную версию, соответствующую всем требованиям.</p>
            <p>Обратите внимание: после установки статуса документа изменить его будет невозможно. Убедитесь в обоснованности вашего решения перед его принятием.</p>
          </div>
        </div>
        
      </form>
    </div>`,
    props: ['blockId'],
    computed: {
      textareaActive() {
        return !!this.textareaValue;
      },
      options() {
        const statuses = this.$store.state.statuses;
        if (!statuses) return;

        return statuses
          .filter((s) => s.active)
          .map((s) => {
            return {
              label: s.name,
              code: s.id,
            };
          });
      },
    },
    methods: {
      onSelect(selected) {
        this.select.selectedOption = selected;
      },
      changeStatus() {
        const pr = this.$store.dispatch('setBlockStatusBX', {
          blockId: this.blockId,
          statusId: this.selectedOption.code,
          statusComment: this.textareaValue,
        });

        pr.then(
          (r) => {
            this.$store.commit('changeBlockLoad', {
              blockId: this.blockId,
              load: false,
            });
            return this.$store.dispatch('blockBX', {
              blockId: this.blockId,
            });
          },
          (error) => {
            this.$store.commit('changeBlockLoad', {
              blockId: this.blockId,
              load: false,
            });
            this.$store.commit('showError', {
              error,
              method: 'setBlockStatus',
            });
          }
        ).then(
          (r) => {
            window.scrollTo({
              top:
                document
                  .querySelector(`[data-id="${this.blockId}"]`)
                  .getBoundingClientRect().top +
                window.scrollY -
                100,
              behavior: 'smooth',
            });
          },
          (error) => {}
        );
      },
    },
    beforeMount() {
      this.selectedOption = this.options[0];
    },
  });

  Vue.component('HistoryAttempt', {
    data() {
      return {
        backIcon: `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g transform="translate(-108 -316)">
              <path d="M3,10h8A5,5,0,0,0,11,0H0" transform="translate(112.13 324.31)" fill="none" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
              <path d="M2.56,5.12,0,2.56,2.56,0" transform="translate(111.87 321.69)" fill="none" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
              <path d="M0,0H24V24H0Z" transform="translate(132 340) rotate(180)" fill="none" opacity="0"/>
            </g>
        </svg>`,
      };
    },
    template: `
      <div class="b-check-detail-fileload__history">
        <div class="b-check-detail-fileload__back-icon" v-html="backIcon" @click.prevent="$emit('toContent')"></div>

        <div class="b-check-detail-fileload__history-heading">Попытка {{ attemptIndex }}</div>

        <files-collection-info v-for="(collection, index) in attempt[0].items" :block="attempt[0]" :collection="collection" :status="status" :last="index === attempt[0].items.length-1" :history="true"></files-collection-info>

        <hr>

        <div class="b-check-detail-fileload__history-comment">
          <div class="b-check-detail-fileload__history-comment-heading">История</div>
          <div class="b-check-detail-fileload__history-comment-grid">
            <span v-for="text in comment" v-html="text"></span>
          </div>
        </div>
      </div>
    `,
    props: ['attempt', 'attemptIndex'],
    emits: ['toContent'],
    computed: {
      status() {
        let statusObject = this.attempt[this.attempt.length - 1];
        if (statusObject && statusObject.type === 'changed_status') {
          return statusObject.status;
        }
      },
      comment() {
        const result = [];
        this.attempt.forEach((item) => {
          if (item.type === 'uploaded_files') {
            result.push(item.date);
            result.push(item.author_name);
            result.push('Добавлены файлы.');
          } else if (item.type === 'changed_status') {
            const statusObject = this.$store.state.statuses.find(
              (s) => s.id === item.status
            );

            result.push(item.date);
            result.push(item.author_name);
            result.push(
              `${
                statusObject
                  ? 'Статус изменён на &laquo;' +
                    statusObject.name +
                    '&raquo;<br>'
                  : ''
              }${item.status_comment}`
            );
          }
        });

        return result;
      },
    },
    methods: {},
  });

  Vue.component('modalPopup', {
    data() {
      return {};
    },
    props: ['blockId'],
    template: `
    <div class="modal--text modal fade" id="checkDetailSignModal" tabindex="-1" aria-labelledby="checkDetailSignModalLabel" aria-hidden="true">
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
                    <h3 class="text-center">Сброс статуса файла</h3>
                    <hr>
                    <p class="text-center">Вы хотите сбросить статус файла до «Ничего не добавлено»? Пользователь, создавший файл, снова сможет добавить файл.
                    </p>
                    <hr class="hr--sl">
                    <div class="text-center modal-buttons">
                        <a class="btn btn-secondary btn-lg" @click="reset">Сбросить</a>
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
      loading() {
        return this.$store.state.modal.loading;
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
      reset() {
        console.log(this.$store.state.modal['status_comment']);
        this.$store.dispatch('resetBlock', {
          vkkr_id: this.$store.state.vkkrId,
          block_id: this.$store.state.modal.blockId,
          status_comment: this.$store.state.modal['status_comment'],
        });
        this.$store.dispatch('changeModalState', {
          loading: true,
        });
      },
      close() {
        this.$store.dispatch('changeModalState', { show: 'hide' });
        this.$store.dispatch('changeModalState', {
          loading: false,
        });
      },
    },
  });

  Vue.component('fullArchive', {
    template: `
        <div class="b-check-detail-fileload__full-archive" v-if="show">
            <h3>Архив всех документов проверки</h3>
            <div class="b-files-collection-archive">
                <div class="b-files-collection-archive__title">Архив всех документов проверки</div>
                <div class="b-docs-block__item">
                    <div class="b-docs-block__body">
                    <a class="b-docs-block__icon" href="#" @click.prevent="click" style="background-image: url( '/template/images/zip.svg' );"></a>
                    <span class="b-docs-block__text">
                        <a href="#" @click.prevent="click">Проверка {{ $store.state.vkkrId }} (Архив всех файлов)</a>
                        <span class="b-docs-block__data">
                        <span class="text-muted">.zip</span>
                        </span>
                    </span>
                    </div>
                </div>
            </div>
        </div>
    `,
    computed: {
      show() {
        const blocks = this.$store.state.data.blocks.filter(
          (b) => b.state === 'filled' || b.state === 'moderating'
        );

        return !!blocks.length;
      },
    },
    methods: {
      click() {
        this.$store.dispatch('downloadBX', {
          vkkr_id: this.$store.state.vkkrId,
        });
      },
    },
  });

  Vue.component('filesArchive', {
    template: `
    <div class="b-files-collection-archive" v-if="show">
      <div class="b-files-collection-archive__title">Архив документов из последней попытки</div>
      <div class="b-docs-block__item">
        <div class="b-docs-block__body">
          <a class="b-docs-block__icon" href="#" @click.prevent="click" style="background-image: url( '/template/images/zip.svg' );"></a>
          <span class="b-docs-block__text">
            <a href="#" @click.prevent="click">{{ block.name }}, попытка {{ block.iterations }}</a>
            <span class="b-docs-block__data">
              <span class="text-muted">.zip</span>
            </span>
          </span>
        </div>
      </div>
    </div>
    `,
    props: ['block', 'history'],
    computed: {
      show() {
        return !this.history;
      },
    },
    methods: {
      click() {
        this.$store.dispatch('downloadBX', {
          vkkr_id: this.$store.state.vkkrId,
          block_id: this.block.id,
        });
      },
    },
  });

  Vue.component('AttemptsArchive', {
    template: `
        <div class="b-check-detail-fileload__full-archive">
            <h3>Архив всех попыток добавления документа</h3>
            <div class="b-files-collection-archive">
                <div class="b-files-collection-archive__title">Архив всех попыток добавления докумнета</div>
                <div class="b-docs-block__item">
                    <div class="b-docs-block__body">
                    <a class="b-docs-block__icon" href="#" @click.prevent="click" style="background-image: url( '/template/images/zip.svg' );"></a>
                    <span class="b-docs-block__text">
                        <a href="#" @click.prevent="click">{{ block.name }} (архив)</a>
                        <span class="b-docs-block__data">
                        <span class="text-muted">.zip</span>
                        </span>
                    </span>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['block'],
    methods: {
      click() {
        this.$store.dispatch('downloadBX', {
          vkkr_id: this.$store.state.vkkrId,
          block_id: this.block.id,
          history: true,
        });
      },
    },
  });

  const App = {
    el: '#checkDetailFileload',
    store,
    template: `
    <div :class="{'b-check-detail-fileload-loader': !loaded}">
      <div v-if="error" class="b-check-detail-fileload-error" @click="clickError($event)">
        <div class="b-check-detail-fileload-error__content">
          <div class="b-check-detail-fileload-error__text">
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

      <div v-else-if="loaded">
        <div v-for="block in blocks" :data-id="block.id">
          <collapse-block v-if="blockVisible(block)" :block="block" :key="block.id"></collapse-block>
        </div>
        <hr>
        <full-archive></full-archive>
      </div>
      <div v-else>
        <div class="circle-loader">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
          <div class="circle circle-4"></div>
          <div class="circle circle-5"></div>
        </div>
      </div>
      <modal-popup></modal-popup>
    </div>`,
    computed: {
      loaded() {
        return !!this.$store.state.data && !!this.$store.state.statuses;
      },
      error() {
        return this.$store.state.error;
      },
      blocks() {
        if (this.loaded) return this.$store.state.data.blocks;
      },
    },
    methods: {
      blockVisible(block) {
        return (
          block.permissions.moderation ||
          block.permissions.write ||
          block.permissions.monitoring ||
          block.permissions.supervisor ||
          (block.permissions.read && block.state === 'filled')
        );
      },
      clickError(event) {
        if (
          event.target.classList.contains('b-check-detail-fileload-error') ||
          event.target.classList.contains('btn')
        ) {
          this.$store.commit('showError', { error: false });
        }
      },
    },
    beforeMount() {
      const vkkrId = this.$el.getAttribute('data-vkkrid');
      if (!vkkrId) return;

      this.$store.commit('setVkkrId', { vkkrId });
      this.$store.dispatch('loadStatuses');
      this.$store.dispatch('loadState');
    },
    mounted() {},
  };

  const app = new Vue(App);
});
