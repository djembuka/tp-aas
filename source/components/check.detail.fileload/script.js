window.addEventListener('load', () => {
  function bitrixLogs(id, message) {
    //AJAX Bitrix
    if (window.BX) {
      BX.ajax.post(
        '/local/ajax/logs.php',
        {
          id,
          el: document.querySelector('input[name = "APPEAL_ID"]').value,
          message,
          level: 1,
        },
        (result) => {}
      );
    }
  }

  if (!window.Vue && !window.Vuex) return;

  let velocity = window.Velocity || jQuery.Velocity;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      data: undefined,
    },
    mutations: {
      setState(state, payload) {
        state.data = payload;
      },
      changeControl(state, payload) {
        let control;
        if (state.data.blocks[0].controls) {
          control = state.controls.find(
            (control) => control.property === payload.property
          );
        }

        //multy
        if (control.multy && payload.index !== undefined) {
          if (!control.value) {
            control.value = [];
          }
          if (!control.value[payload.index]) {
            control.value.push({
              id: parseInt(Math.random() * 100000, 10),
            });
          }
          Vue.set(control.value[payload.index], 'val', payload.value);
        } else {
          Vue.set(control, 'value', payload.value);
        }
      },
      removeControl(state, payload) {
        if (payload.control.type === 'file') {
          payload.control.filename.splice(payload.index, 1);
        }
        payload.control.value.splice(payload.index, 1);
      },
    },
    actions: {
      async loadState({ commit }) {
        if (window.BX) {
          window.BX.ajax.runAction(`twinpx:aas.api.methods.blocks`).then(
            (r) => {
              if (r.status === 'success' && r.data) {
                commit('setState', r.data);
              }
            },
            (error) => {
              rej(error);
            }
          );
        }
      },
    },
  });

  Vue.component('collapseBlock', {
    data() {
      return {
        slide: false,
        open: false,
      };
    },
    props: ['block'],
    template: `
      <div class="b-collapse-vc" :class="{slide: slide, open: open}" id="collapse2">
        <div class="b-collapse-vc__head" @click.stop.prevent="toggleBody()">
          <a href="" @click.prevent>
            {{ block.title }}
          </a>
          <div class="b-collapse-vc__right">
            <div v-if="block.status" v-html="block.status" class="b-collapse-vc__status"></div>
            <span class="b-collapse-vc__icon"></span>
          </div>
        </div>
        <transition @enter="enter" @leave="leave" :css="false">
          <div class="b-collapse-vc__body" v-if="slide">
            <div class="b-check-detail-fileload__block">
              <div class="b-check-detail-fileload__history-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g transform="translate(-108 -188)">
                        <path d="M9.749,0H3.269c-3.76,0-4.05,3.38-2.02,5.22l10.52,9.56C13.8,16.62,13.509,20,9.749,20H3.269c-3.76,0-4.05-3.38-2.02-5.22l10.52-9.56C13.8,3.38,13.509,0,9.749,0Z" transform="translate(113.491 190)" fill="none" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                        <path d="M0,0H24V24H0Z" transform="translate(108 188)" fill="none" opacity="0"/>
                    </g>
                </svg>
              </div>
              <div class="b-check-detail-fileload__heading" v-if="block.heading" v-html="block.heading"></div>
              <div class="b-check-detail-fileload__text" v-if="block.text" v-html="block.text"></div>
              <fileload-form :controls="block.controls"></fileload-form>
            </div>
          </div>
        </transition>
      </div>
    `,
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
    },
  });

  Vue.component('formControlMulty', {
    data() {
      return {};
    },
    props: ['formControl'],
    template: `
      <div>
        <hr class="hr--md" style="margin-top: 0;">
        <div v-if="formControl.type==='file'">
          <transition-group name="list" tag="div" >
            <div v-for="(valueObject, idx) in formControl.value" :key="valueObject.id" class="multy-control-wrapper">
              <form-control-file :formControl="formControl" :controlIndex="idx"></form-control-file>
              <div v-if="formControl.value.length > 1" @click="remove(idx)" class="multy-control-wrapper__remove btn-delete"></div>
              <hr class="hr--sl">
            </div>
          </transition-group>
        </div>
        <button class="btn btn-success btn-md" :class="{disabled: isBtnDisabled}" @click.prevent="add">Добавить еще</button>
        <hr class="hr--sl">
      </div>
    `,
    computed: {
      isBtnDisabled() {
        if (typeof this.formControl.multy === 'number') {
          return this.formControl.value.length >= this.formControl.multy;
        } else {
          return false;
        }
      },
    },
    methods: {
      validate() {
        if (this.formControl.required && !this.controlValue) {
          this.isInvalid = true;
        } else {
          this.isInvalid = false;
        }
      },
      add() {
        this.$store.commit('changeControl', {
          property: this.formControl.property,
          index: this.formControl.value.length,
          value: '',
        });
      },
      remove(idx) {
        this.$store.commit('removeControl', {
          control: this.formControl,
          index: idx,
        });
      },
    },
    beforeMount() {
      const newValue = this.formControl.value.map((val) => {
        return {
          id: parseInt(Math.random() * 100000, 10),
          val,
        };
      });
      this.formControl.value = newValue;
    },
  });

  Vue.component('formControlFile1', {
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
    <div style="position: relative;">
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
    </div>
    `,
    props: {
      formControl: Object,
    },
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
        return this.formControl.name;
      },
      id() {
        return this.formControl.name;
      },
      isInvalid() {
        return !!this.invalidString;
      },
      isProgressing() {
        return this.loading;
      },
      isClearable() {
        return this.loadCircle || (!!this.filename && !this.isProgressing);
      },
      isFilled() {
        return !!this.filename;
      },
      fileid() {
        return this.formControl.value;
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
        if (this.formControl.filename) {
          return this.formControl.filename;
        }
        return this.formControl.default;
      },
      filename() {
        return this.formControl.filename;
      },
    },
    methods: {
      uploadFile(files) {
        // this.$emit('setFile', {
        //   filename: '',
        //   value: this.fileid,
        // });

        this.files = files;
        // this.xhrStatus = '';
        // this.percentage = 0;
        //invalid and label change
        setTimeout(() => {
          if (this.isInvalid) {
            this.$refs.inputFile.value = '';
          } else {
            this.formControl.filename = this.files[0] ? this.files[0].name : '';
            //   let data = {};
            //   data[this.name] = this.files[0];
            //   data.FILEID = this.fileid;
            //   this.loading = true;
            //   this.sendData(data);
          }
        }, 0);
      },
      clearInputFile() {
        // this.loadCircle = true;
        // this.percentage = 0;
        // this.loading = false;
        this.files = [];
        this.$refs.inputFile.value = '';
        this.formControl.filename = this.files[0] ? this.files[0].name : '';
        // this.sendData({
        //   [this.name]: 'DELETE',
        //   FILEID: this.fileid,
        // });
        // //set value
        // this.$emit('setFile', {
        //   filename: '',
        //   value: '',
        // });
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
              this.$emit('setFile', {
                filename: this.files[0] ? this.files[0].name : '',
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
      },
      async sendData(data) {
        try {
          const url = window.appealDetailData.form.fileUpload;
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

  Vue.component('formControlFile', {
    data() {
      return {
        disabled: this.formControl.disabled,
        loading: false,
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
    ></span>
    <div
      class="b-float-label--file"
      :class="{
        filled: isFilled,
        clearable: isClearable,
      }"
      ref="controlFile"
    >
      <span class="b-float-label-file__label">{{
        formControl.label
      }}</span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17.383"
        height="24"
        viewBox="0 0 17.383 24"
        v-html="icon"
      ></svg>

      <input
        type="file"
        :name="formControl.name"
        :id="formControl.id"
        @change="uploadFile($refs.inputFile.files)"
        ref="inputFile"
      />
      <label
        :for="formControl.id"
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
    },
    computed: {
      invalid() {
        return !!this.invalidString;
      },
      isClearable() {
        return !!this.filename;
      },
      isFilled() {
        return !!this.filename;
      },
      fileid() {
        return this.formControl.value;
      },
      invalidString() {
        if (this.files[0] && this.files[0].size && this.files[0].name) {
          if (this.files[0].size >= this.formControl.maxSize) {
            //this.files = [];
            return `Размер файла превышает ${this.formatSize(
              this.formControl.maxSize
            )}`;
          }

          const filename = this.files[0].name;
          const lastIndex = filename.lastIndexOf('.');
          const regExp = new RegExp(this.formControl.ext.join('|'));

          if (!regExp.test(filename.substring(lastIndex + 1).toLowerCase())) {
            //this.files = [];
            return `Прикладывайте файлы ${this.formControl.ext
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
      uploadFile(files) {
        this.$store.commit('setControlValue', {
          blockId: this.$store.getters.isEditedBlock.id,
          variantId: this.variantId,
          controlId: this.formControl.id,
          value: files[0].name,
        });

        this.files = files;
      },
      clearInputFile() {
        this.loading = false;
        this.files = [];
        this.$refs.inputFile.value = '';
        //set value
        this.$store.commit('setControlValue', {
          blockId: this.$store.getters.isEditedBlock.id,
          variantId: this.variantId,
          controlId: this.formControl.id,
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
    template: `<div>
        <div v-for="formControl in controls" :key="formControl.id">
        
            <hr>

            <form-control-multy v-if="formControl.multy" :formControl="formControl"></form-control-multy>

            <div v-else-if="formControl.type==='textarea'" class="b-float-label" :class="{invalid: formControl.invalid}">
            <textarea :name="formControl.name" autocomplete="off" required="required" v-model="formControl.value" @input="autoHeight"></textarea>
            <label :class="{active: textareaActive}">{{formControl.label}}</label>
            </div>
        </div>
    </div>`,
    props: ['controls'],
  });

  const App = {
    el: '#checkDetailFileload',
    store,
    template: `
        <div v-f="loaded">
            <collapse-block v-for="block in blocks" :block="block" :key="block.id"></collapse-block>
        </div>`,
    computed: {
      loaded() {
        return !!this.$store.state.data;
      },
      blocks() {
        if (this.loaded) return this.$store.state.data.blocks;
      },
    },
    methods: {},
    beforeMount() {
      this.$store.dispatch('loadState');
    },
    mounted() {},
  };

  const app = new Vue(App);
});
