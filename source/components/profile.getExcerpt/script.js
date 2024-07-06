window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      ornz: 54321,
      types: [
        { id: 123, name: 'Стандартная выписка', selected: true },
        { id: 456, name: 'Расширенная выписка' },
      ],
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
          property: 'text',
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
          property: 'text',
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
    },
    actions: {
      requestDocumentBX({ state, getters, commit }) {
        commit('setProp', { prop: 'loading', value: true });
        if (window.BX) {
          window.BX.ajax
            .runAction(`requestDocument`, {
              data: {
                ornz: state.ornz,
                typeId: getters.selectedTypeId,
              },
            })
            .then(
              (r) => {
                commit('setProp', { prop: 'loading', value: false });
                if (r.status === 'success' && r.data && r.data.id) {
                  commit('setProp', { prop: 'documentId', value: r.data.id });
                }
              },
              (error) => {
                commit('setProp', { prop: 'loading', value: false });
                console.log(error);
                //showError(error)
              }
            );
        }
      },
      generateCodeBX({ state, commit }) {
        commit('setProp', { prop: 'loading', value: true });
        if (window.BX) {
          window.BX.ajax
            .runAction(`generateCode`, {
              data: {
                documentId: state.documentId,
                fullName: state.fullName,
                phone: state.phone,
                email: state.email,
                message: state.message,
              },
            })
            .then(
              (r) => {
                commit('setProp', { prop: 'loading', value: false });
                if (r.status === 'success') {
                  //success
                } else {
                  //showErrorMessage
                }
              },
              (error) => {
                commit('setProp', { prop: 'loading', value: false });
                console.log(error);
                //showError(error)
              }
            );
        }
      },
      getFileLinkBX({ state, commit }, { code }) {
        commit('setProp', { prop: 'loading', value: true });
        if (window.BX) {
          return window.BX.ajax.runAction(`getFileLink`, {
            data: {
              documentId: state.documentId,
              code,
            },
          });
        }
      },
    },
  });

  Vue.component('TheLoading', {
    template: `
    <div class="b-get-excerpt__loading">
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

  Vue.component('StepOne', {
    template: `
      <div class="b-get-excerpt__one">
        <h3>Выберите тип выписки</h3>
        <p>Вы можете заказать выписки следующих типов:</p>
        <hr class="hr--sl">
        <div class="b-get-excerpt__types">
          <div
            class="b-get-excerpt__type"
            v-for="type in $store.state.types"
            :key="type.id"
          >
            <span>{{ type.name }}</span>
            <button class="btn btn-secondary btn-md" @click="selectType(type.id)">
              Получить выписку
            </button>
          </div>
        </div>
      </div>
    `,
    methods: {
      selectType(typeId) {
        this.$store.commit('setSelectedType', { typeId });
        this.$store.dispatch('requestDocumentBX');
        this.$store.commit('setProp', { prop: 'step', value: 2 });
      },
    },
  });

  Vue.component('StepTwo', {
    template: `
      <div class="b-get-excerpt__two">
        <h3>Заказать выписку</h3>

        <form @submit.prevent="submitForm">
  {{$store.state.fullName}}
          <div v-for="control in $store.state.controls" :key="control.id">
            <component :is="'control-'+control.property" :control="control" @input="({value}) => {setControlValue(control.id, value)}"></component>
            <hr>
          </div>
          <button class="btn btn-secondary btn-lg" type="sumbit">Получить выписку</button>
        </form>
      </div>
    `,
    data() {
      return {};
    },
    methods: {
      submitForm() {
        this.$store.dispatch('generateCodeBX');
        this.$store.commit('setProp', { prop: 'step', value: 3 });
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
        <h3>Подтверждение</h3>
        <p>
          На вашу почту отправлено письмо с кодом подтверждения, введите его для
          получения доступа к выпискам.
        </p>
        <hr>
        <div class="b-get-excerpt__count">
          {{ $store.state.count + 1 }}/{{ all }}
        </div>
        <hr>
        <control-text :control="control" @input="({value}) => {control.value = value}"></control-text>
        <hr>
        <button class="btn btn-secondary btn-lg" @click="sendCode">
          Отправить
        </button>
      </div>
    `,
    data() {
      return {
        all: 3,
        invalid: false,
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
              console.log(error);
              //showError(error)
            }
          );
      },
    },
  });

  Vue.component('StepFour', {
    template: `
      <div class="b-get-excerpt__four">
        <h3>Отправьте код повторно</h3>
        <p>
          Вы 3 раза ввели неверный код.<br />Получите новый код для входа повторив
          попытку.
        </p>
        <hr>
        <button class="btn btn-secondary btn-lg" @click="repeat">
          Повторить попытку
        </button>
      </div>
    `,
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
        <h3>Ваша выписка создана</h3>
        <p>
          Скачайте выписку, она будет доступна,<br />пока у вас открыто данное окно.
        </p>
        <a :href="$store.state.file.fileLink">{{ $store.state.file.name }}</a>
      </div>
    `,
  });

  Vue.component('controlText', {
    template: `
      <div
        :class="{
          'twpx-form-control': true,
          'twpx-form-control--text': true,
          'twpx-form-control--active': active,
          'twpx-form-control--invalid': invalid,
          'twpx-form-control--disabled': disabled,
        }"
      >
        <img
          :src="disabled"
          class="twpx-form-control__disabled-icon"
          v-if="false"
        />
        <div class="twpx-form-control__label">{{ control.label }}</div>
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
          'twpx-form-control': true,
          'twpx-form-control--text': true,
          'twpx-form-control--active': active,
          'twpx-form-control--invalid': invalid,
          'twpx-form-control--disabled': disabled,
        }"
      >
        <img
          :src="disabled"
          class="twpx-form-control__disabled-icon"
          v-if="false"
        />
        <div class="twpx-form-control__label">{{ control.label }}</div>
        <input
          type="tel"
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

  Vue.component('controlEmail', {
    template: `
      <div
        :class="{
          'twpx-form-control': true,
          'twpx-form-control--text': true,
          'twpx-form-control--active': active,
          'twpx-form-control--invalid': invalid,
          'twpx-form-control--disabled': disabled,
        }"
      >
        <img
          :src="disabled"
          class="twpx-form-control__disabled-icon"
          v-if="false"
        />
        <div class="twpx-form-control__label">{{ control.label }}</div>
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
          'twpx-form-control': true,
          'twpx-form-control--textarea': true,
          'twpx-form-control--active': active,
          'twpx-form-control--focused': focused,
          'twpx-form-control--invalid': invalid,
          'twpx-form-control--disabled': disabled,
        }"
      >
        <img
          :src="disabled"
          class="twpx-form-control__disabled-icon"
          v-if="false"
        />
        <div class="twpx-form-control__label">{{ control.label }}</div>
        <div class="twpx-form-control__textarea">
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
        </div>
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

  const App = {
    el: '#getExcerptApp',
    store,
    template: `
      <div class="b-get-excerpt">
        <TheLoading v-if="$store.state.loading"></TheLoading>
        <component v-else :is="currentStep" />
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
    },
  };

  const app = new Vue(App);
});
