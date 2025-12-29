window.addEventListener('load', () => {
  //icon print
  if (document.getElementById('iconPrint')) {
    document.getElementById('iconPrint').addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  }

  //icon copy
  const copyToClipboard = (str, elem) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      str = str.trim();
      navigator.clipboard.writeText(str);
      if (elem) {
        let span = document.createElement('span');
        span.classList.add('b-copy-icon__note');
        span.innerText = 'Скопировано в буфер';
        elem.querySelector('.b-copy-icon').appendChild(span);
        setTimeout(() => {
          span.classList.add('b-copy-icon__note--show');
        }, 0);
        setTimeout(() => {
          span.classList.remove('b-copy-icon__note--show');
        }, 1000);
        setTimeout(() => {
          span.remove();
        }, 1500);
      }
      return;
    }
    return Promise.reject('The Clipboard API is not available.');
  };

  if (window.matchMedia('(min-width: 768px)').matches) {
    //table
    document
      .querySelectorAll('.b-appeal-detail table.table td')
      .forEach((td) => {
        td.addEventListener('click', () => {
          copyToClipboard(td.textContent, td);
        });
      });

    //data
    document.querySelectorAll('.b-appeal-detail__data-item').forEach((item) => {
      item.addEventListener('click', () => {
        let span = item.querySelector('span');
        copyToClipboard(span.textContent, item);
      });
    });
  }

  //Vue app form
  if (!window.Vue && !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: window.explanationData,
    mutations: {
      changeControl(state, payload) {
        let control;
        if (state.controls) {
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
      setFile(state, payload) {
        const control = state.controls.find(
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
  });

  Vue.component('v-select', VueSelect.VueSelect);

  //form control file without Vuex
  Vue.component('formControlFile', {
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

  //form control file with Vuex
  Vue.component('formControlFileStore', {
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
      controlIndex: {
        type: [Number, String],
        required: true,
        default() {
          return 0;
        },
      },
      controlId: [Number, String],
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
        return `${this.formControl.word}[${this.formControl.property}][${this.controlIndex}]`;
      },
      id() {
        return `${this.formControl.word}_${this.formControl.property}_${this.controlIndex}`;
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
      uploadFile(files) {
        this.files = files;
        // this.xhrStatus = '';
        // this.percentage = 0;
        //invalid and label change
        setTimeout(() => {
          if (this.isInvalid) {
            this.$refs.inputFile.value = '';
          } else {
            store.commit('setFile', {
              property: this.formControl.property,
              filename: this.files[0] ? this.files[0].name : '',
              controlIndex: this.controlIndex,
              value: this.files[0],
            });
            // this.formControl.filename = this.files[0] ? this.files[0].name : '';
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
        // this.formControl.filename = this.files[0] ? this.files[0].name : '';
        // this.sendData({
        //   [this.name]: 'DELETE',
        //   FILEID: this.fileid,
        // });
        // //set value

        store.commit('setFile', {
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

  //hidden fields
  Vue.component('hiddenFields', {
    data() {
      return {};
    },
    template: `
      <div>
        <input v-for="field in $store.state.hidden" :key="generateKey()" type="hidden" :name="field.name" :value="field.value">
      </div>
    `,
    methods: {
      toggleBody() {
        //set slide class for the main div
        this.slide = !this.slide;
        //slide body
        this.open = !this.open;
      },
      generateKey() {
        return Date.now() * Math.random();
      },
    },
  });

  //form control multy
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
              <form-control-file-store :formControl="formControl" :controlIndex="idx"></form-control-file-store>
              <div v-if="formControl.value.length > 1" @click="remove(idx)" class="multy-control-wrapper__remove btn-delete"></div>
              <hr class="hr--sl">
            </div>
          </transition-group>
        </div>
        <button class="btn btn-success btn-md" :class="{disabled: isBtnDisabled}" :disabled="isBtnDisabled" @click.prevent="add">Добавить еще</button>
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

  if (document.getElementById('changeStatusForm')) {
    new Vue({
      el: '#changeStatusForm',
      data() {
        return {
          file: undefined,
          ...window.appealDetailData,
          isLoading: false,
          initialCode: null,
        };
      },
      computed: {
        textareaActive() {
          return !!this.textarea.value;
        },
        buttonDisabled() {
          return this.textarea.showForStatus.find(
            (elem) => elem === this.select.selectedOption.code
          )
            ? !this.textarea.value
            : false;
        },
      },
      template: `
      <div>
        <form :action="this.form.action" :method="this.form.method" enctype="multipart/form-data">
          <div>
            <input v-for="field in hidden" :key="Date.now() * Math.random()" type="hidden" :name="field.name" :value="field.value">
          </div>
          <div class="form-control-wrapper">
            <v-select :searchable="false" :options="select.options" :value="select.options[0]" class="form-control-select" @input="onSelect()" v-model="select.selectedOption"></v-select>
            <label>{{select.label}}</label>
            <input type="hidden" :name="select.name" v-model="select.selectedOption.code">
          </div>
          <hr>
          <div v-if="textarea.showForStatus.find((elem) => elem === select.selectedOption.code)">
            <div class="b-float-label" :class="{invalid: textarea.invalid}">
              <textarea :name="textarea.name" autocomplete="off" required="required" v-model="textarea.value"></textarea>
              <label :class="{active: textareaActive}">{{textarea.label}}</label>
            </div>
            <hr>
          </div>

          <div v-if="files && files.length > 0">
            <div v-for="file in files">
              <div v-if="file.showForStatus.find((elem) => elem === select.selectedOption.code)">
                <form-control-file :formControl="file"></form-control-file>
                <hr>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-xl-6">
              <a href="" class="btn btn-secondary btn-lg" :class="{'btn--load-circle': isLoading}" :disabled="buttonDisabled" @click.prevent="changeStatus">{{button.text}}</a>
            </div>
            <hr class="d-block d-xl-none w-100">
            <div class="col-xl-6 muted small d-flex align-items-center">{{button.message}}</div>
          </div>
          <div class="modal--text modal fade" id="changeStatusConfirmModal" tabindex="-1" aria-labelledby="changeStatusConfirmModalLabel" aria-hidden="true" style="display: none;">
            <div class="modal-dialog">
              <div class="modal-content">
                <button class="close" type="button" data-dismiss="modal" aria-label="Close" style="background-image: url( '/template/images/cancel.svg' );"></button>
                <div class="modal-body">
                  <div v-html="modal.html"></div>
                  <div class="text-center modal-buttons">
                    <button class="btn btn-lg btn-light" data-dismiss="modal">{{button.dismiss}}</button>
                    <button :name="button.name" class="btn btn-lg btn-secondary" type="submit">{{button.confirm}}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div class="modal--text modal fade" id="changeStatusAlertModal" tabindex="-1" aria-labelledby="changeStatusAlertModalLabel" aria-hidden="true" style="display: none;">
          <div class="modal-dialog">
            <div class="modal-content">
              <button class="close" type="button" data-dismiss="modal" aria-label="Close" style="background-image: url( '/template/images/cancel.svg' );"></button>
              <div class="modal-body">
                <div v-html="alert.html"></div>
                <div class="text-center modal-buttons">
                  <button class="btn btn-lg btn-secondary" @click.prevent="reload">{{alert.button}}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`,
      methods: {
        onSelect() {},
        reload() {
          window.location.href = window.location.href;
        },
        async changeStatus() {
          try {
            this.isLoading = true;
            const response = await fetch(this.form.fetchCurrentStatus);
            const result = await response.json();
            if (
              result &&
              result.STATUS === 'Y' &&
              (result.CURRENT || result.CURRENT === '')
            ) {
              this.isLoading = false;
              if (
                this.initialCode === '' ||
                result.CURRENT === this.initialCode
              ) {
                //show confirm modal
                $('#changeStatusConfirmModal').modal('show');
              } else {
                //show alert modal
                $('#changeStatusAlertModal').modal('show');
              }
            }
          } catch (err) {
            throw err;
          }
        },
      },
      mounted() {
        this.initialCode = this.select.selectedOption.code;
      },
    });
  }

  if (document.getElementById('explanationForm')) {
    new Vue({
      el: '#explanationForm',
      store,
      data() {
        return {
          file: undefined,
          isLoading: false,
          isSubmitting: false,
        };
      },
      computed: {
        textareaActive() {
          return !!this.$store.state.controls[0].value;
        },
        buttonDisabled() {
          return (
            (this.$store.state.controls[0].required &&
              !this.$store.state.controls[0].value) ||
            (this.$store.state.controls[1].required &&
              this.$store.state.controls[1].value.some((obj) => !obj.val))
          );
        },
      },
      template: `
        <div>
          <form :action="$store.state.form.action" :method="$store.state.form.method" enctype="multipart/form-data">

            <hidden-fields></hidden-fields>
  
            <div v-for="formControl in $store.state.controls">
  
              <hr>
  
              <form-control-multy v-if="formControl.multy" :formControl="formControl"></form-control-multy>
  
              <div v-else-if="formControl.type==='textarea'" class="b-float-label" :class="{invalid: formControl.invalid}">
                <textarea :name="formControl.name" autocomplete="off" required="required" v-model="formControl.value" @input="autoHeight"></textarea>
                <label :class="{active: textareaActive}">{{formControl.label}}</label>
              </div>
            </div>
  
            <hr>
  
            <div class="row">
              <div class="col-xl-6">
                <a href="" class="btn btn-secondary btn-lg" :class="{'btn--load-circle': isLoading}" :disabled="buttonDisabled" @click.prevent="sendForm">{{$store.state.button.text}}</a>
              </div>
              <hr class="d-block d-xl-none w-100">
              <div class="col-xl-6 muted small d-flex align-items-center" v-if="buttonDisabled">{{$store.state.button.message}}</div>
            </div>

            <div class="modal--text modal fade" id="explanationConfirmModal" tabindex="-1" aria-labelledby="explanationConfirmModalLabel" aria-hidden="true" style="display: none;">
              <div class="modal-dialog">
                <div class="modal-content">
                  <button class="close" type="button" data-dismiss="modal" aria-label="Close" style="background-image: url( '/template/images/cancel.svg' );"></button>
                  <div class="modal-body">

                    <div v-if="!isSubmitting">
                      <div v-if="$store.state.modal.html" v-html="$store.state.modal.html"></div>
                      <div class="text-center modal-buttons">
                        <button class="btn btn-lg btn-light" data-dismiss="modal">{{$store.state.button.dismiss}}</button>
                        <button :name="$store.state.button.name" class="btn btn-lg btn-secondary" type="submit" @click="submit">{{$store.state.button.confirm}}</button>
                      </div>
                    </div>

                    <div v-else>
                      <div v-if="$store.state.modal.htmlSubmitting" v-html="$store.state.modal.htmlSubmitting"></div>
                      <div class="progress-indicator">
                        <div class="item item-1"></div>
                        <div class="item item-2"></div>
                        <div class="item item-3"></div>
                        <div class="item item-4"></div>
                        <div class="item item-5"></div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            
          </form>
        </div>`,
      methods: {
        autoHeight(e) {
          e.target.style.height = `${e.target.scrollHeight}px`;
        },
        reload() {
          window.location.href = window.location.href;
        },
        sendForm() {
          $('#explanationConfirmModal').modal('show');
        },
        submit(e) {
          this.isSubmitting = true;
          e.target.closest('form').submit();
        },
      },
      mounted() {
        $('#explanationConfirmModal').on('hidden.bs.modal', function (e) {
          this.isSubmitting = false;
        });
      },
    });
  }
});
