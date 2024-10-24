window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      controls: [
        {
          property: 'file',
          id: 'id0',
          name: 'FILE',
          label: 'Файл доказательств',
          value: '',
          required: true,
          disabled: false,
          accept: ['pdf', 'exe', 'jpg'],
          image: true,
          maxsize: 10000000,
          hint_external: '',
          dependency: 'id6',
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

  Vue.component('ControlFile', {
    data() {
      return {
        active: true,
        files: [],
        default: '<a href="">Выберите файл</a>&nbsp;или перетащите в поле',
        hint: this.control.hint_external,
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
    <div
      :class="{
        'twpx-form-control': true,
        'twpx-form-control--file': true,
        'twpx-form-control--active': active,
        'twpx-form-control--invalid': invalid,
        'twpx-form-control--disabled': disabled,
      }"
    >
      <img
        :src="disabled"
        class="twpx-form-control__file__disabled-icon"
        v-if="false"
      />
      <span
        class="twpx-form-control__file__clear"
        @click.prevent="clearInputFile"
        v-if="isClearable"
      ></span>
      <div
        class="twpx-form-control__file"
        :class="{
          filled: isFilled,
          clearable: isClearable,
        }"
        ref="controlFile"
      >
        <span class="twpx-form-control__file__label">{{ control.label }}</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17.383"
          height="24"
          viewBox="0 0 17.383 24"
          v-html="icon"
        ></svg>

        <input
          type="file"
          :name="control.name"
          :id="control.id"
          @change="uploadFile($refs.inputFile.files)"
          ref="inputFile"
        />
        <label
          :for="control.id"
          class="active"
          v-html="label"
          ref="dropzone"
        ></label>
      </div>
      <div class="twpx-form-control__hint" v-html="hint" v-if="hint"></div>
    </div>
    `,
    props: ['control'],
    emits: ['input'],
    computed: {
      disabled() {
        return this.control.disabled;
      },
      invalid() {
        return !!this.invalidString;
      },
      isClearable() {
        return !!this.filename;
      },
      isFilled() {
        return !!this.filename;
      },
      invalidString() {
        if (this.files[0] && this.files[0].size && this.files[0].name) {
          if (this.files[0].size >= this.control.maxsize) {
            //this.files = [];
            return `Размер файла превышает ${this.formatSize(
              this.control.maxsize
            )}`;
          }

          const filename = this.files[0].name;
          const lastIndex = filename.lastIndexOf('.');
          const regExp = new RegExp(this.control.accept.join('|'));

          if (!regExp.test(filename.substring(lastIndex + 1).toLowerCase())) {
            return `Прикладывайте файлы ${this.control.accept
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
        if (this.control.value) {
          return this.control.value;
        }
        return this.default;
      },
      filename() {
        return this.control.value;
      },
      clearWatcher() {
        return this.control.clearWatcher;
      },
    },
    watch: {
      clearWatcher() {
        this.clearInputFile();
      },
    },
    methods: {
      uploadFile(files) {
        this.files = files;
        if (!this.invalidString) {
          this.$emit('input', { value: files[0].name, file: files[0] });
        }
      },
      clearInputFile() {
        this.files = [];
        this.$refs.inputFile.value = '';
        this.$emit('input', { value: '' });
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
        this.uploadFile(e.dataTransfer.files);
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
              <control-file :control="control" @input="input"></control-file>
            </div>
            <hr class="hr--xs d-block d-xl-none d-md-none w-100">
            <div class="col-sm-6 text-muted small">Выберите файл, добавьте его и сохраните.</div>
          </div>

          <hr>

          <div class="row">
            <div class="col-xl-6">
              <button type="submit" class="btn btn-secondary btn-lg" :disabled="buttonDisabled">Сохранить</a>
            </div>
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
