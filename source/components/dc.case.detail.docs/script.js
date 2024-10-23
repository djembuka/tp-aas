window.addEventListener('load', () => {
  if (!window.Vue || !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
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

  Vue.component('SimpleForm', {
    template: `
      <div>
        <form :action="this.form.action" :method="this.form.method" enctype="multipart/form-data">
          <div>
            <input v-for="field in hidden" :key="field.id" type="hidden" :name="field.name" :value="field.value">
          </div>
          <div class="row">
            <div class="col-sm-6">
              <form-control-file :formControl="control" @input="input"></form-control-file>
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
