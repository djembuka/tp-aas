window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      ornz: '',
      types: [],
      step: 1,
      loading: false,
      count: 0,
      controls: [
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
      file: {},
    },
    getters: {
      selectedTypeId(state) {
        const selectedType = state.types.find((t) => t.selected);
        if (selectedType) {
          return selectedType.id;
        }
        return undefined;
      },
      invalidControl(state) {
        return state.controls.find((c) =>
          c.required ? !c.value.trim() : false
        );
      },
    },
    mutations: {
      setProp(state, { prop, value }) {
        Vue.set(state, prop, value);
      },
      setSelectedType(state, { typeId }) {
        state.types.forEach((t) => {
          Vue.set(t, 'selected', t.id === typeId);
        });
      },
      setControlValue(state, { controlId, value }) {
        const control = state.controls.find((c) => c.id === controlId);
        if (control) {
          Vue.set(control, 'value', value);
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
                    ${
                      window.BX.message(
                        'ERROR_' + error.data.ajaxRejectData.data
                      ) || window.BX.message('ERROR_SERVER')
                    }`
                  );
                }
              } else if (window.BX.message) {
                Vue.set(
                  state,
                  'error',
                  `${window.BX.message('ERROR_SUPPORT')}
                  <br>
                  <br>
                  ${window.BX.message('ERROR_OFFLINE')}`
                );
              }
            } else {
              Vue.set(
                state,
                'error',
                `${window.BX.message('ERROR_SUPPORT')}
                <br>
                <br>
                ${error.errors[0].message ? error.errors[0].message : ''}`
              );
            }
          }
        }
      },
    },
    actions: {
      requestDocumentBX({ state, getters, commit }) {
        commit('setProp', { prop: 'loading', value: true });
        if (window.BX) {
          window.BX.ajax
            .runComponentAction('twinpx:excerpt.external', 'requestDocument', {
              mode: 'class',
              data: {
                ornz: state.ornz,
                type: getters.selectedTypeId,
                sessid: state.sessid,
                signedParameters: state.signedParameters,
              },
            })
            .then(
              (r) => {
                commit('setProp', { prop: 'loading', value: false });
                commit('setProp', { prop: 'step', value: 2 });
                if (r.status === 'success' && r.data && r.data.id) {
                  commit('setProp', { prop: 'documentId', value: r.data.id });
                }
              },
              (error) => {
                commit('setProp', { prop: 'loading', value: false });
                commit('showError', { error, method: 'requestDocument' });
              }
            );
        }
      },
      generateCodeBX({ state, commit }, { formdata }) {
        commit('setProp', { prop: 'loading', value: true });
        if (window.BX) {
          formdata.append('xml_id', state.documentId);
          formdata.append('sessid', state.sessid);
          formdata.append('signedParameters', state.signedParameters);

          window.BX.ajax
            .runComponentAction('twinpx:excerpt.external', 'generateCode', {
              mode: 'class',
              data: formdata,
            })
            .then(
              (r) => {
                commit('setProp', { prop: 'loading', value: false });
                if (r.status === 'success') {
                  commit('setProp', { prop: 'step', value: 3 });
                } else {
                  //showErrorMessage
                }
              },
              (error) => {
                commit('setProp', { prop: 'loading', value: false });
                commit('showError', { error, method: 'generateCode' });
              }
            );
        }
      },
      getFileLinkBX({ state, commit }, { code }) {
        commit('setProp', { prop: 'loading', value: true });
        if (window.BX) {
          return new Promise((res, rej) => {
            window.BX.ajax
              .runComponentAction('twinpx:excerpt.external', 'getFileLink', {
                mode: 'class',
                data: {
                  xml_id: state.documentId,
                  code,
                  sessid: state.sessid,
                  signedParameters: state.signedParameters,
                },
              })
              .then(res)
              .error(rej);
          });
        }
      },
    },
  });

  Vue.component('TheLoading', {
    template: `
    <div class="b-get-excerpt__loading">
      <div class="progress-indicator">
        <div class="item item-1"></div>
        <div class="item item-2"></div>
        <div class="item item-3"></div>
        <div class="item item-4"></div>
        <div class="item item-5"></div>
      </div>
    </div>
    `,
  });

  Vue.component('StepOne', {
    template: `
      <div class="b-get-excerpt__one">
        <h3>{{ h3 }}</h3>
        <p v-html="text"></p>
        <hr class="hr--sl">
        <div class="b-get-excerpt__types">
          <div
            class="b-get-excerpt__type"
            v-for="type in $store.state.types"
            :key="type.id"
          >
            <span>{{ type.name }}</span>
            <button class="btn btn-secondary btn-md" @click="selectType(type.id)">{{ button }}</button>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        h3: window.BX.message('STEP_ONE_HEADING') || 'Выберите тип выписки',
        text:
          window.BX.message('STEP_ONE_TEXT') ||
          'Вы можете заказать выписки следующих типов:',
        button: window.BX.message('STEP_ONE_BUTTON') || 'Получить выписку',
      };
    },
    methods: {
      selectType(typeId) {
        this.$store.commit('setSelectedType', { typeId });
        this.$store.dispatch('requestDocumentBX');
      },
    },
  });

  Vue.component('StepTwo', {
    template: `
      <div class="b-get-excerpt__two">
        <h3>{{ h3 }}</h3>
        <hr>
        <form @submit.prevent="submitForm" ref="form">
          {{$store.state.fullName}}
          <div v-for="control in $store.state.controls" :key="control.id">
            <component :is="'control-'+control.property" :control="control" @input="({value}) => {setControlValue(control.id, value)}"></component>
            <hr>
          </div>
          <button class="btn btn-secondary btn-lg" type="sumbit" :class="{'btn-disabled': !valid}">{{ button }}</button>
        </form>
      </div>
    `,
    data() {
      return {
        h3: window.BX.message('STEP_TWO_HEADING') || 'Заказать выписку',
        button: window.BX.message('STEP_TWO_BUTTON') || 'Получить выписку',
      };
    },
    computed: {
      valid() {
        return !this.$store.getters.invalidControl;
      },
    },
    methods: {
      submitForm() {
        if (!this.valid) {
          return;
        }

        this.$store.dispatch('generateCodeBX', {
          formdata: new FormData(this.$refs.form),
        });
      },
      setControlValue(controlId, value) {
        this.$store.commit('setControlValue', {
          controlId,
          value,
        });
      },
    },
  });

  Vue.component('StepThree', {
    template: `
      <div class="b-get-excerpt__three">
        <h3>{{ h3 }}</h3>
        <p v-html="text"></p>
        <hr>
        <div class="b-get-excerpt__count">
          {{ $store.state.count + 1 }}/{{ all }}
        </div>
        <hr>
        <control-text :control="control" @input="input"></control-text>
        <hr>
        <button class="btn btn-secondary btn-lg" :class="{'btn-disabled': disabled}" @click="sendCode">
          {{ button }}
        </button>
      </div>
    `,
    data() {
      return {
        h3: window.BX.message('STEP_THREE_HEADING') || 'Подтверждение',
        text:
          window.BX.message('STEP_THREE_TEXT') ||
          'На вашу почту отправлено письмо с кодом подтверждения, введите его для          получения доступа к выпискам.',
        button: window.BX.message('STEP_THREE_BUTTON') || 'Отправить',

        all: 3,
        invalid: false,
        disabled: true,
        control: {
          property: 'text',
          id: 'codeId',
          name: 'CODE',
          label: 'Код',
          value: '',
          required: true,
          disabled: false,
          regexp: '',
          regexp_description: '',
          hint_internal: '',
          hint_external: '',
        },
      };
    },
    methods: {
      input({ value }) {
        this.control.value = value;
        if (value.length >= 6) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      },
      sendCode() {
        if (this.control.value.length < 6) {
          this.invalid = true;
          return;
        }

        this.$store
          .dispatch('getFileLinkBX', {
            code: this.control.value,
          })
          .then(
            (r) => {
              this.$store.commit('setProp', { prop: 'loading', value: false });
              if (r.status === 'success') {
                if (r.data) {
                  //go to the next step
                  this.$store.commit('setProp', { prop: 'step', value: 5 });
                  this.$store.commit('setProp', {
                    prop: 'file',
                    value: r.data.file,
                  });
                }
              } else if (r.status === 'error' && r.errors[0]) {
                const newCount = this.$store.state.count + 1;
                if (newCount < 3) {
                  this.$store.commit('setProp', {
                    prop: 'count',
                    value: newCount,
                  });
                  this.invalid = true;
                } else {
                  this.$store.commit('setProp', { prop: 'count', value: 0 });
                  this.$store.commit('setProp', { prop: 'step', value: 4 });
                }
                //show next attempt if less of equal to 3
                //show button if grosser then 3
              }
            },
            (error) => {
              this.$store.commit('setProp', { prop: 'loading', value: false });
              this.$store.commit('showError', { error, method: 'getFileLink' });
            }
          );
      },
    },
  });

  Vue.component('StepFour', {
    template: `
      <div class="b-get-excerpt__four">
        <h3>{{ h3 }}</h3>
        <p v-html="text"></p>
        <hr>
        <button class="btn btn-secondary btn-lg" @click="repeat">{{ button }}</button>
      </div>
    `,
    data() {
      return {
        h3: window.BX.message('STEP_FOUR_HEADING') || 'Отправьте код повторно',
        text:
          window.BX.message('STEP_FOUR_TEXT') ||
          'Вы 3 раза ввели неверный код.<br />Получите новый код для входа повторив попытку.',
        button: window.BX.message('STEP_FOUR_BUTTON') || 'Повторить попытку',
      };
    },
    methods: {
      repeat() {
        this.$store.dispatch('generateCodeBX');
        this.$store.commit('setProp', { prop: 'step', value: 3 });
      },
    },
  });

  Vue.component('StepFive', {
    template: `
      <div class="b-get-excerpt__five">
        <h3>{{ h3 }}</h3>
        <p v-html="text"></p>
        <hr>
        <div class="b-docs-block b-docs-block--small b-docs-block--gray b-docs-block--with-dots">
          <div class="b-docs-block__item" :href="$store.state.file.fileLink">
            <div class="b-docs-block__body">
              <a class="b-docs-block__icon" :href="$store.state.file.fileLink" style="background-image: url( '/template/images/pdf.svg' );"></a>
              <span class="b-docs-block__text">
                <a :href="$store.state.file.fileLink">{{ $store.state.file.name }}</a>
                <span class="b-docs-block__data">
                  <span class="text-muted">{{ formatSize($store.state.file.size) }} .pdf</span>
                  <span class="text-muted">Дата создания: {{ $store.state.file.date }}</span>
                </span>
              </span>
              <div v-if="$store.state.file.pdf || $store.state.file.sig" class="b-docs-block__more" @click.prevent="clickMore">
                <a class="b-docs-block__more__button" href="#" style="background-image: url('/template/images/more-btn.svg')"></a>
                <div class="b-docs-block__more__files" :class="{'b-docs-block__more__files--show': show}">
                  <span>Для некоторых сервисов требуется формат PDF + .sig</span>
                  <a v-if="$store.state.file.pdf" :href="$store.state.file.pdf" target="_blank" style="background-image: url('/template/images/pdf.svg')">pdf</a>
                  <a v-if="$store.state.file.sig" :href="$store.state.file.sig" target="_blank" style="background-image: url('/template/images/sig.svg')">sig</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        h3: window.BX.message('STEP_FIVE_HEADING') || 'Ваша выписка создана',
        text:
          window.BX.message('STEP_FIVE_TEXT') ||
          'Скачайте выписку, она будет доступна,<br />пока у вас открыто данное окно.',

        show: false,
      };
    },
    methods: {
      clickMore() {
        this.show = true;
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
      document.documentElement.addEventListener('click', (e) => {
        if (
          e.target.closest('.b-docs-block__more__files') ||
          e.target.className.search('b-docs-block__more__files') !== -1 ||
          e.target.className.search('b-docs-block__more__button') !== -1
        ) {
          return;
        }
        this.show = false;
      });
    },
  });

  Vue.component('controlText', {
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

  Vue.component('controlTel', {
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

        if (not == 1 || 'Backspace' === not || 'Tab' === not) {
          if ('Backspace' != not || 'Tab' != not) {
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

  Vue.component('controlEmail', {
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

  Vue.component('controlTextarea', {
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
    el: '#getExcerptApp',
    store,
    template: `
      <div class="b-get-excerpt" id="getExcerptApp" ref="app">
        <the-loading v-if="$store.state.loading"></the-loading>
        <component v-else :is="currentStep" />
        <the-error-message v-if="error" :error="error"></the-error-message>
      </div>
    `,
    data() {
      return {
        currentStepIndex: 0,
        steps: ['StepOne', 'StepTwo', 'StepThree', 'StepFour', 'StepFive'],
      };
    },
    computed: {
      currentStep() {
        return this.steps[this.$store.state.step - 1];
      },
      error() {
        return this.$store.state.error;
      },
    },
    beforeCreate() {
      if (!window.getExcerptVars) {
        return;
      }

      this.$store.commit('setProp', {
        prop: 'ornz',
        value: window.getExcerptVars.ornz,
      });

      this.$store.commit('setProp', {
        prop: 'types',
        value: window.getExcerptVars.types,
      });

      this.$store.commit('setProp', {
        prop: 'sessid',
        value: window.getExcerptVars.sessid,
      });

      this.$store.commit('setProp', {
        prop: 'signedParameters',
        value: window.getExcerptVars.signedParameters,
      });
    },
    mounted() {
      this.$refs.app.addEventListener('getExcerptModalHidden', () => {
        this.$store.commit('setProp', { prop: 'step', value: 1 });
        this.$store.commit('setProp', { prop: 'loading', value: false });
        this.$store.commit('setProp', { prop: 'error', value: false });
      });
    },
  };

  const app = new Vue(App);
});
