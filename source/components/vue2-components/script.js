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
      modal: false,
      error: false,
      loading: false,
      controls: [
        {
          property: 47,
          word: 'FILES[0]',
          label: 'Жалоба *',
          type: 'file',
          multy: false,
          maxSize: 102400000,
          required: true,
          filename: '',
          value: '',
          default: '<a href>Выберите файл</a> (pdf, до 100МБ)',
          ext: ['pdf'],
          completeBlock: {
            comment:
              'Жалоба в формате PDF с подписью и печатью (если печать есть)',
          },
        },
        {
          property: 'text',
          id: 'fullnameId',
          name: 'FULLNAME',
          label: 'ФИО',
          value: '',
          required: true,
          disabled: false,
          regexp: '',
          regexp_description: '',
          hint_internal: '',
          hint_external: '',
        },
        {
          property: 'tel',
          id: 'telId',
          name: 'TEL',
          label: 'Номер телефона',
          value: '',
          required: true,
          disabled: false,
          regexp: '',
          regexp_description: '',
          hint_internal: '',
          hint_external: '',
        },
        {
          property: 'email',
          id: 'emailId',
          name: 'EMAIL',
          label: 'Email',
          value: '',
          required: true,
          disabled: false,
          regexp: '',
          regexp_description: '',
          hint_internal: '',
          hint_external: '',
        },
        {
          property: 'textarea',
          id: 'messageId',
          name: 'MESSAGE',
          label: 'Цель получения выписки',
          value: '',
          required: true,
          disabled: false,
          regexp: '',
          regexp_description: '',
          hint_internal: '',
          hint_external: '',
        },
      ],
      file: {
        fileLink: '/',
        name: 'Выписка-152156-ФC/24',
        size: '654 Кб',
        date: '20 июня 2024 11:55:06',
        pdf: '/',
        sig: '/',
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
      setControlValue(state, { controlId, value }) {
        const control = state.controls.find((c) => c.id === controlId);
        if (control) {
          Vue.set(control, 'value', value);
        }
      },
      setFile(state, payload) {
        const item = state.confirmDocsBlock.items.find(
          (item) => item.id === payload.id
        );
        const control = item.controls.find(
          (control) => control.property === payload.property
        );
        if (control.multy) {
          Vue.set(control.filename, payload.controlIndex, payload.filename);
          Vue.set(control.value[payload.controlIndex], 'val', payload.value);
        } else {
          Vue.set(control, 'filename', payload.filename);
          Vue.set(control, 'value', payload.value);
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

  Vue.component('modalPopup', {
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

  Vue.component('TheLoading', {
    template: `
    <div class="vue2-component__loading">
      <div class="circle-loader">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-4"></div>
        <div class="circle circle-5"></div>
      </div>
    </div>
    `,
  });

  Vue.component('ControlText', {
    template: `
      <div
        :class="{
          'b-float-label': true,
          'active': active,
          'invalid': invalid,
          'disabled': disabled,
        }"
      >
        <img
          :src="disabled"
          class="twpx-form-control__disabled-icon"
          v-if="false"
        />
        <input
          type="text"
          :id="controlId"
          :name="controlName"
          v-model="value"
          @focus="focus"
          @blur="blur"
          :disabled="disabled"
          ref="input"
          autocomplete="off"
          :placeholder="placeholder"
          class="twpx-form-control__input"
        />
        <label :for="controlId" :class="{'active': active}">{{ control.label }}</label>
        <div
          class="twpx-form-control__warning"
          v-html="warning"
          v-if="warning"
        ></div>
        <div class="twpx-form-control__hint" v-html="hint" v-if="hint"></div>
      </div>
    `,
    data() {
      return {
        controlId: this.id || this.control.id || null,
        controlName: this.name || this.control.name || null,
        focused: false,
        blured: false,
        warning: '',
        hint: this.control.hint_external,
      };
    },
    props: ['control', 'id', 'name'],
    emits: ['input'],
    computed: {
      value: {
        get() {
          return this.control.value;
        },
        set(value) {
          this.$emit('input', { value });
        },
      },
      placeholder() {
        if (this.focused && !this.value.trim()) {
          return this.control.hint_internal;
        } else {
          return '';
        }
      },
      active() {
        return this.focused || !!this.control.value.trim();
      },
      invalid() {
        return this.blured && !this.validate();
      },
      disabled() {
        return this.control.disabled;
      },
      validateWatcher() {
        return this.control.validateWatcher;
      },
      focusWatcher() {
        return this.control.focusWatcher;
      },
    },
    watch: {
      validateWatcher() {
        this.blured = true;
      },
      focusWatcher() {
        this.$refs.input.focus();
      },
    },
    methods: {
      focus() {
        this.focused = true;
        this.blured = false;
      },
      blur() {
        this.focused = false;
        this.blured = true;
      },
      validate() {
        if (
          (this.control.required && this.value.trim()) ||
          !this.control.required
        ) {
          if (this.control.regexp) {
            const match = String(this.value.trim()).match(
              RegExp(this.control.regexp)
            );
            if (!match) {
              this.warning = this.control.regexp_description;
            } else {
              this.warning = '';
            }
            return match;
          } else {
            return true;
          }
        } else if (this.control.required && !this.value) {
          return false;
        }
        return true;
      },
    },
  });

  Vue.component('ControlTel', {
    template: `
      <div
        :class="{
          'b-float-label': true,
          'active': active,
          'invalid': invalid,
          'disabled': disabled,
        }"
      >
        <img
          :src="disabled"
          class="twpx-form-control__disabled-icon"
          v-if="false"
        />
        <input
          type="tel"
          :id="controlId"
          :name="controlName"
          v-model="value"
          @focus="focus"
          @blur="blur"
          @keydown="keydown"
          :disabled="disabled"
          ref="input"
          autocomplete="off"
          :placeholder="placeholder"
          class="twpx-form-control__input"
        />
        <label :for="controlId" :class="{'active': active}">{{ control.label }}</label>
        <div
          class="twpx-form-control__warning"
          v-html="warning"
          v-if="warning"
        ></div>
        <div class="twpx-form-control__hint" v-html="hint" v-if="hint"></div>
      </div>
    `,
    data() {
      return {
        controlId: this.id || this.control.id || null,
        controlName: this.name || this.control.name || null,
        focused: false,
        blured: false,
        warning: '',
        hint: this.control.hint_external,
      };
    },
    props: ['control', 'id', 'name'],
    emits: ['input'],
    computed: {
      value: {
        get() {
          return this.control.value;
        },
        set(value) {
          this.$emit('input', { value });
        },
      },
      placeholder() {
        if (this.focused && !this.value.trim()) {
          return this.control.hint_internal;
        } else {
          return '';
        }
      },
      active() {
        return this.focused || !!this.control.value.trim();
      },
      invalid() {
        return this.blured && !this.validate();
      },
      disabled() {
        return this.control.disabled;
      },
      validateWatcher() {
        return this.control.validateWatcher;
      },
      focusWatcher() {
        return this.control.focusWatcher;
      },
    },
    watch: {
      validateWatcher() {
        this.blured = true;
      },
      focusWatcher() {
        this.$refs.input.focus();
      },
    },
    methods: {
      focus() {
        this.focused = true;
        this.blured = false;
        if (!this.value.trim()) {
          this.value = '+7(';
        }
      },
      blur() {
        this.focused = false;
        this.blured = true;
        if (this.value.trim() === '+7(') {
          this.value = '';
        }
      },
      keydown($event) {
        this.inputphone($event);
      },
      inputphone(e) {
        let key = e.key;
        not = key.replace(/([0-9])/, 1);

        if (not == 1 || 'Backspace' === not) {
          if ('Backspace' != not) {
            if (this.value.length < 3 || this.value === '') {
              this.value = '+7(';
            }
            if (this.value.length === 6) {
              this.value = this.value + ') ';
            }
            if (this.value.length === 11) {
              this.value = this.value + '-';
            }
            if (this.value.length === 14) {
              this.value = this.value + '-';
            }
            if (this.value.length >= 17) {
              this.value = this.value.substring(0, 16);
            }
          }
        } else {
          e.preventDefault();
        }
      },
      validate() {
        if (
          (this.control.required && this.value.trim()) ||
          !this.control.required
        ) {
          if (this.control.regexp) {
            const match = String(this.value.trim()).match(
              RegExp(this.control.regexp)
            );
            if (!match) {
              this.warning = this.control.regexp_description;
            } else {
              this.warning = '';
            }
            return match;
          } else {
            return true;
          }
        } else if (this.control.required && !this.value) {
          return false;
        }
        return true;
      },
    },
  });

  Vue.component('ControlEmail', {
    template: `
      <div
        :class="{
         'b-float-label': true,
          'active': active,
          'invalid': invalid,
          'disabled': disabled,
        }"
      >
        <img
          :src="disabled"
          class="twpx-form-control__disabled-icon"
          v-if="false"
        />
        <input
          type="email"
          :id="controlId"
          :name="controlName"
          v-model="value"
          @focus="focus"
          @blur="blur"
          :disabled="disabled"
          ref="input"
          autocomplete="off"
          :placeholder="placeholder"
          class="twpx-form-control__input"
        />
        <label :for="controlId" :class="{'active': active}">{{ control.label }}</label>
        <div
          class="twpx-form-control__warning"
          v-html="warning"
          v-if="warning"
        ></div>
        <div class="twpx-form-control__hint" v-html="hint" v-if="hint"></div>
      </div>
    `,
    data() {
      return {
        controlId: this.id || this.control.id || null,
        controlName: this.name || this.control.name || null,
        focused: false,
        blured: false,
        warning: '',
        hint: this.control.hint_external,
      };
    },
    props: ['control', 'id', 'name'],
    emits: ['input'],
    computed: {
      value: {
        get() {
          return this.control.value;
        },
        set(value) {
          this.$emit('input', { value });
        },
      },
      placeholder() {
        if (this.focused && !this.value.trim()) {
          return this.control.hint_internal;
        } else {
          return '';
        }
      },
      active() {
        return this.focused || !!this.control.value.trim();
      },
      invalid() {
        return this.blured && !this.validate();
      },
      disabled() {
        return this.control.disabled;
      },
      validateWatcher() {
        return this.control.validateWatcher;
      },
      focusWatcher() {
        return this.control.focusWatcher;
      },
    },
    watch: {
      validateWatcher() {
        this.blured = true;
      },
      focusWatcher() {
        this.$refs.input.focus();
      },
    },
    methods: {
      focus() {
        this.focused = true;
        this.blured = false;
      },
      blur() {
        this.focused = false;
        this.blured = true;
      },
      validate() {
        if (
          (this.control.required && this.value.trim()) ||
          !this.control.required
        ) {
          if (this.control.regexp) {
            const match = String(this.value.trim()).match(
              RegExp(this.control.regexp)
            );
            if (!match) {
              this.warning = this.control.regexp_description;
            } else {
              this.warning = '';
            }
            return match;
          } else {
            return true;
          }
        } else if (this.control.required && !this.value) {
          return false;
        }
        return true;
      },
    },
  });

  Vue.component('ControlTextarea', {
    template: `
      <div
        :class="{
          'b-float-label': true,
          'active': active,
          'invalid': invalid,
          'disabled': disabled,
        }"
      >
        <img
          :src="disabled"
          class="twpx-form-control__disabled-icon"
          v-if="false"
        />
        <textarea
          :id="controlId"
          :name="controlName"
          v-model="value"
          @focus="focus"
          @blur="blur"
          :disabled="disabled"
          ref="textarea"
          contenteditable="true"
          class="twpx-form-control__textarea-content"
        ></textarea>
        <label :for="controlId" :class="{'active': active}">{{ control.label }}</label>
        <div
          class="twpx-form-control__warning"
          v-html="warning"
          v-if="warning"
        ></div>
        <div class="twpx-form-control__hint" v-html="hint" v-if="hint"></div>
      </div>
    `,
    data() {
      return {
        controlId: this.id || this.control.id || null,
        controlName: this.name || this.control.name || null,
        focused: false,
        blured: false,
        warning: '',
        hint: this.control.hint_external,
      };
    },
    props: ['control', 'id', 'name'],
    emits: ['input'],
    computed: {
      value: {
        get() {
          return this.control.value;
        },
        set(value) {
          this.$emit('input', { value });
          //autoheight
          this.$refs.textarea.style.height = 'auto';
          let height = this.$refs.textarea.scrollHeight;
          this.$refs.textarea.style.height = `${height > 100 ? height : 100}px`;
        },
      },
      placeholder() {
        if (this.focused && !this.value.trim()) {
          return this.control.hint_internal;
        } else {
          return '';
        }
      },
      active() {
        return this.focused || !!this.control.value.trim();
      },
      invalid() {
        return this.blured && !this.validate();
      },
      disabled() {
        return this.control.disabled;
      },
      validateWatcher() {
        return this.control.validateWatcher;
      },
      focusWatcher() {
        return this.control.focusWatcher;
      },
    },
    watch: {
      validateWatcher() {
        this.blured = true;
      },
      focusWatcher() {
        this.$refs.input.focus();
      },
    },
    methods: {
      focus() {
        this.focused = true;
        this.blured = false;
      },
      blur() {
        this.focused = false;
        this.blured = true;
      },
      validate() {
        if (
          (this.control.required && this.value.trim()) ||
          !this.control.required
        ) {
          if (this.control.regexp) {
            const match = String(this.value.trim()).match(
              RegExp(this.control.regexp)
            );
            if (!match) {
              this.warning = this.control.regexp_description;
            } else {
              this.warning = '';
            }
            return match;
          } else {
            return true;
          }
        } else if (this.control.required && !this.value) {
          return false;
        }
        return true;
      },
    },
    mounted() {
      let height = this.$refs.textarea.scrollHeight;
      this.$refs.textarea.style.height = `${height > 100 ? height : 100}px`;
    },
  });

  Vue.component('FormControlFile', {
    data() {
      return {
        minimalLoading: false,
        loading: false,
        loadCircle: false,
        percentage: 0, //%
        isFileLoaded: false,
        xhrStatus: '', //'Y', 'E'
        isActive: true,
        files: [],
        required: this.formControl.required,
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
      };
    },
    template: `
    <div>
      <div class="row align-items-center">
        <div class="col-12" :class="{'col-lg-6': !es}">
          <span class="b-float-label-file__clear" :class="{'btn--load-circle': loadCircle}" @click.prevent="clearInputFile" v-if="isClearable"></span>
          <div class="b-float-label--file" :class="{'filled': isFilled, 'progressing': isProgressing, 'deleting': loadCircle, 'invalid': !!isInvalid, 'clearable': isClearable }" ref="controlFile" >
            <span class="b-float-label-file__label">{{ formControl.label }}</span>
  
            <svg xmlns="http://www.w3.org/2000/svg" width="17.383" height="24" viewBox="0 0 17.383 24" v-html="icon"></svg>
  
            <input type="file" :data-value="fileid" :data-required="required" :name="name" :id="id" @change="uploadFile($refs.inputFile.files)" ref="inputFile" />
            <div class="b-float-label__progressbar" v-show="(isProgressing || loadCircle) && !isInvalid" ref="progressbar" :class="{'minimal': minimalLoading}">
              <span v-html="label" v-show="isFileLoaded"></span>
              <span v-show="!isFileLoaded">{{percentage}}%</span>
            </div>
            <label :for="id" class="active" v-html="label" ref="dropzone" ></label>
          </div>

          <div v-if="formControl.es">

            <hr class="hr--sl">

            <form-control-multy v-if="formControl.es.multy" :es="true" :formControl="formControl.es" fieldsetBlockIndex="0" :controlIndex="0" :controlId="formControl.es.id" @autosave="autosave"></form-control-multy>

            <form-control-es-file v-else :es="true" :formControl="formControl.es" fieldsetBlockIndex="0" :controlIndex="0" :controlId="formControl.es.id" @autosave="autosave"></form-control-es-file>

          </div>

        </div>
        <hr class="hr--xs d-block d-lg-none w-100">
        <div class="col-12 small" :class="{'col-lg-6': !es}" v-if="!formControl.multy || !controlIndex">
          <div v-if="formControl.completeBlock && formControl.completeBlock.comment" class="text-muted b-complete-comment">{{ formControl.completeBlock.comment }}</div>
        </div>
      </div>
      <hr class="hr--sl">
    </div>
    `,
    props: {
      es: {
        type: Boolean,
        default() {
          return false;
        },
      },
      formControl: Object,
      fieldsetBlockIndex: [Number, String],
      controlIndex: {
        type: [Number, String],
        required: true,
        default() {
          return 0;
        },
      },
      controlId: [Number, String],
    },
    emits: ['autosave', 'timeoutAutosave'],
    watch: {
      percentage(val) {
        setTimeout(() => {
          if (val === 100) {
            this.isFileLoaded = true;
          } else if (val === 0) {
            this.isFileLoaded = false;
          }
        }, 600);
      },
    },
    computed: {
      name() {
        return `${this.formControl.word}[${this.formControl.property}][${this.fieldsetBlockIndex}]`;
      },
      id() {
        return `${this.formControl.word}_${this.formControl.property}_${this.fieldsetBlockIndex}`;
      },
      isInvalid() {
        return !!this.invalidString;
      },
      isProgressing() {
        if (this.formControl.multy) {
          return (
            this.loading || this.formControl.value[this.controlIndex].loading
          );
        }
        return this.loading;
      },
      isClearable() {
        return this.loadCircle || (!!this.filename && !this.isProgressing);
      },
      isFilled() {
        return !!this.filename;
      },
      fileid() {
        return typeof this.formControl.value === 'object'
          ? this.formControl.value[this.controlIndex].val
          : this.formControl.value;
      },
      invalidString() {
        if (this.xhrStatus === 'E') {
          return 'Ошибка загрузки';
        } else if (this.files[0] && this.files[0].size && this.files[0].name) {
          if (this.files[0].size >= this.formControl.maxSize) {
            this.files = [];
            return `Размер файла превышает ${this.formatSize(
              this.formControl.maxSize
            )}`;
          }

          const filename = this.files[0].name;
          const lastIndex = filename.lastIndexOf('.');
          const regExp = new RegExp(this.formControl.ext.join('|'));

          if (!regExp.test(filename.substring(lastIndex + 1).toLowerCase())) {
            this.files = [];
            return `Прикладывайте файлы ${this.formControl.ext
              .map((w) => w.toUpperCase())
              .join(', ')}.`;
          }
        }
        return '';
      },
      label() {
        if (this.isProgressing) {
          return '';
        }
        if (this.isInvalid) {
          return this.invalidString;
        }
        if (this.files[0] && this.files[0].name) {
          return this.files[0].name;
        }
        if (
          this.formControl.multy &&
          this.formControl.filename[this.controlIndex]
        ) {
          return this.formControl.filename[this.controlIndex];
        } else if (!this.formControl.multy && this.formControl.filename) {
          return this.formControl.filename;
        }
        return this.formControl.default;
      },
      filename() {
        return this.formControl.multy
          ? this.formControl.filename[this.controlIndex]
          : this.formControl.filename;
      },
    },
    methods: {
      autosave() {
        this.$emit('autosave');
      },
      uploadFile(files) {
        store.commit('setFile', {
          id: this.controlId,
          property: this.formControl.property,
          filename: '',
          controlIndex: this.controlIndex,
          value: this.fileid,
        });

        this.files = files;
        this.xhrStatus = '';
        this.percentage = 0;
        //invalid and label change
        setTimeout(() => {
          if (this.isInvalid) {
            this.$refs.inputFile.value = '';
          } else {
            let data = {};
            data[this.name] = this.files[0];
            data.FILEID = this.fileid;

            this.loading = true;
            this.sendData(data);
          }
        }, 0);
      },
      clearInputFile() {
        this.loadCircle = true;
        this.percentage = 0;
        this.loading = false;
        this.files = [];
        this.$refs.inputFile.value = '';
        this.sendData({
          [this.name]: 'DELETE',
          FILEID: this.fileid,
        });
        //set value
        store.commit('setFile', {
          id: this.controlId,
          property: this.formControl.property,
          filename: '',
          controlIndex: this.controlIndex,
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
        while ((length / 1000) | 0 && i < type.length - 1) {
          length /= 1000;
          i++;
        }
        return parseInt(length) + ' ' + type[i];
      },
      progressAnimation(xhr) {
        let first = true;
        xhr.upload.addEventListener('progress', ({ loaded, total }) => {
          if (first && loaded === total) {
            //loaded too fast, show minimal animation 1s
            let counter = 0,
              minimalTime = 1000,
              intervalId;

            this.minimalLoading = true;
            this.$refs.progressbar.style.width = `100%`;

            intervalId = setInterval(() => {
              if (++counter === 11) {
                clearInterval(intervalId);
                this.dataLoaded(xhr);
                this.minimalLoading = false;
                return;
              }
              this.percentage = Math.floor((counter * 100) / 10);
            }, minimalTime / 10);
          } else {
            this.percentage = Math.floor((loaded / total) * 100);
            this.$refs.progressbar.style.width = `calc(46px + (100% - 46px ) * ${this.percentage} / 100)`;
            if (this.percentage === 100) {
              this.dataLoaded(xhr);
            }
          }
          first = false;
        });
      },
      dataLoaded(xhr) {
        let timeoutId;

        if (xhr.readyState != 4) {
          this.loadCircle = true;
          timeoutId = setTimeout(() => {
            this.dataLoaded(xhr);
          }, 100);
          return;
        } else {
          this.loadCircle = false;
          clearTimeout(timeoutId);
        }

        const fileObject = JSON.parse(xhr.response);

        if (fileObject) {
          this.xhrStatus = fileObject.STATUS;

          switch (fileObject.STATUS) {
            case 'Y':
              //set value
              store.commit('setFile', {
                id: this.controlId,
                property: this.formControl.property,
                filename: this.files[0] ? this.files[0].name : '',
                controlIndex: this.controlIndex,
                value: this.files[0] ? fileObject.ID : '',
              });

              setTimeout(() => {
                this.$refs.inputFile.value = '';
              }, 100);

              break;

            case 'E':
              break;
          }
          this.$refs.progressbar.style = '';
          this.percentage = 0;
          this.loading = false;
          this.loadCircle = false;
        }
        this.$emit('timeoutAutosave');
      },
      async sendData(data) {
        try {
          const url = this.$store.state.url.fileUpload;
          const formData = new FormData();

          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });

          let xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          //xhr.setRequestHeader('Content-Type', 'multipart/form-data');
          xhr.setRequestHeader('Authentication', 'secret');
          this.progressAnimation(xhr);
          xhr.send(formData);

          /*xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;
          };*/
        } catch (err) {
          throw err;
        }
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

  Vue.component('DocWithDots', {
    template: `
      <div class="b-docs-block b-docs-block--small b-docs-block--gray b-docs-block--with-dots">
        <div class="b-docs-block__item" :href="file.fileLink">
          <div class="b-docs-block__body">
            <a class="b-docs-block__icon" :href="file.fileLink" style="background-image: url( '/template/images/pdf.svg' );"></a>
            <span class="b-docs-block__text">
              <a :href="file.fileLink">{{ file.name }}</a>
              <span class="b-docs-block__data">
                <span class="text-muted">654 Кб .doc</span>
                <span class="text-muted">Дата создания: 20 июня 2024 11:55:06</span>
              </span>
            </span>
            <div v-if="file.pdf || file.sig" class="b-docs-block__more" @click.prevent="clickMore">
              <a class="b-docs-block__more__button" href="#" style="background-image: url('/template/images/more-btn.svg')"></a>
              <div class="b-docs-block__more__files" :class="{'b-docs-block__more__files--show': show}">
                <span>Для некоторых сервисов требуется формат PDF + .sig</span>
                <a v-if="file.pdf" :href="file.pdf" target="_blank" style="background-image: url('/template/images/pdf.svg')">pdf</a>
                <a v-if="file.sig" :href="file.sig" target="_blank" style="background-image: url('/template/images/sig.svg')">sig</a>
              </div>
            </div>
          </div>
        </div>
      </div
    `,
    data() {
      return {
        show: false,
      };
    },
    props: ['file'],
    methods: {
      clickMore() {
        this.show = true;
      },
    },
    mounted() {
      document.documentElement.addEventListener('click', (e) => {
        if (
          (!e.target.closest('.b-docs-block__more__files') &&
            e.target.className.search('b-docs-block__more__files') === -1) ||
          e.target.className.search('b-docs-block__more__button') === -1
        ) {
          this.show = false;
        }
      });
    },
  });

  Vue.component('SimpleForm', {
    template: `
      <div>
        <form :action="this.form.action" :method="this.form.method" enctype="multipart/form-data">
          <div>
            <input v-for="field in hidden" :key="field.id" type="hidden" :name="field.name" :value="field.value">
          </div>
          <div class="row">
            <div class="col-sm-6">
              <control-textarea :control="control" @input="input"></control-textarea>
              <form-control-file :formControl="$store.state.controls[0]" fieldsetBlockIndex="0" controlIndex="0" controlId="123"></form-control-file>
            </div>
            <div class="col-sm-6 text-muted small">Выберите файл, добавьте его и сохраните.</div>
          </div>

          <hr>

          <div class="row">
            <div class="col-xl-6">
              <button type="submit" class="btn btn-secondary btn-lg" :disabled="buttonDisabled">Сохранить</a>
            </div>
            <hr class="d-block d-xl-none w-100">
            <div class="col-xl-6 muted small d-flex align-items-center"></div>
          </div>
        </form>
      </div>
    `,
    data() {
      return {
        form: {
          action: '/',
          method: 'POST',
        },
        hidden: [
          {
            id: '456',
            name: 'sessid',
            value: '4561233',
          },
        ],
      };
    },
    computed: {
      buttonDisabled() {
        return !this.control.value;
      },
      control() {
        return this.$store.state.controls[4];
      },
    },
    methods: {
      input({ value }) {
        this.$store.commit('setControlValue', {
          controlId: this.control.id,
          value,
        });
      },
    },
  });

  const App = {
    el: '#vue2ComponentsApp',
    store,
    template: `
      <div>
        <div>
          <h3>Simple form</h3>
          <hr>
          <simple-form></simple-form>
          <hr class="hr--sm">
          <p></p>
        </div>
        <hr>
        <div>
          <h3>Modal popup</h3>
          <button class="btn btn-success" @click="showModal">Show modal</button>
          <modal-popup id="dcCasesModal">
            <p>Здесь может быть любой текст или компонент.</p>
          </modal-popup>
          <hr class="hr--sm">
          <p></p>
        </div>
        <hr>
        <div>
          <h3>TheErrorMessage</h3>
          <button class="btn btn-primary" @click="showError">Show error</button>
          <the-error-message></the-error-message>
          <hr class="hr--sm">
          <p>Использование: переносим компонент, стили style/the-error-message/styl. В $store.state свойство error, в мутациях showError. В приложении App добавляем компонент, как в текущем приложении - &lt;the-error-message v-if="error" :error="error"&gt;&lt;/the-error-message&gt;</p>
        </div>
        <hr>
        <div>
          <h3>TheLoading</h3>
          <button class="btn btn-secondary" @click="toggleLoading">Toggle loading</button>
          <hr class="hr--sm">
          <the-loading v-if="loading"></the-loading>
          <p>Использование: переносим компонент, стили уже есть в template_styles.css. В $store.state свойство loading, в мутациях setProp. В приложении App добавляем компонент, как в текущем приложении - &lt;the-loading v-if="loading"&gt;&lt;/the-loading&gt;, показываем и убираем при обращении к серверу, с помощью изменения $store.state.loading через setProp.</p>
        </div>
        <hr>
        <div>
          <h3>Controls</h3>
          <div v-for="control in controls" :key="control.id">
            <component :is="'control-'+control.property" :control="control" @input="({value}) => {setControlValue(control.id, value)}"></component>
            <hr>
          </div>
          <p>Использование: компоненты полей формы получают на вход объект компонента, на выходе отдают объект со свойством value. Генерируют событие input при каждом изменении значения поля. Стили полей формы находятся в template_styles.css.</p>
        </div>
        <hr>
        <div>
          <h3>DocWithDots</h3>
          <doc-with-dots :file="$store.state.file"></doc-with-dots>
        </div>
      </div>
    `,
    data() {
      return {
        controls: this.$store.state.controls,
      };
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      },
    },
    methods: {
      showModal() {
        this.$store.commit('setProp', { prop: 'modal', value: true });
      },
      showError() {
        this.$store.commit('showError', {
          error: { errors: [{ code: 1, message: 'requestExample error' }] },
          method: 'requestExample',
        });
      },
      toggleLoading() {
        this.$store.commit('setProp', {
          prop: 'loading',
          value: !this.$store.state.loading,
        });
      },
      setControlValue(controlId, value) {
        this.$store.commit('setControlValue', {
          controlId,
          value,
        });
      },
    },
  };

  const app = new Vue(App);
});
