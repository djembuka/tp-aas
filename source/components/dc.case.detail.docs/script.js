window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      controls: [
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
    },
    mutations: {
      setControlValue(state, { controlId, value }) {
        const control = state.controls.find((c) => c.id === controlId);
        if (control) {
          Vue.set(control, 'value', value);
        }
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
        return this.$store.state.controls[0];
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
    el: '#dcCaseDetailDocs',
    store,
    template: `
      <div class="bg-fa p-32">
        <h3 class="mt-0">Добавление файла</h3>
        <p>Каждый файл или архив загружается отдельно, вы сможете удалить файл после загрузки.</p>
        <hr class="hr--sl">
        <simple-form></simple-form>
      </div>
    `,
    computed: {},
    methods: {},
  };

  const app = new Vue(App);
});
