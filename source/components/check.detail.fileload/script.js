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

  const vkkrId = 5556;

  if (!vkkrId) return;
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
      changeControl(_, { control, controlIndex, value }) {
        //multy
        if (control.multiple && controlIndex !== undefined) {
          if (!control.value) {
            control.value = [];
          }
          if (!control.value[controlIndex]) {
            control.value.push({
              id: parseInt(Math.random() * 100000, 10),
            });
          }
          Vue.set(control.value[controlIndex], 'val', value);
          Vue.set(control.filename, controlIndex, value);
        } else {
          Vue.set(control, 'value', value);
          Vue.set(control, 'filename', value);
        }
      },
      removeControl(_, { control, controlIndex }) {
        if (control.type === 'file') {
          control.filename.splice(controlIndex, 1);
        }
        control.value.splice(controlIndex, 1);
      },
      setBlockStatus(state, { blockId, status }) {
        const block = state.data.blocks.find((b) => b.id === blockId);
        block.status = status;
      },
      //collections
      addToMultipleCollection(_, { collection, collectIndex }) {
        if (!collection || !collection.multiple) return;

        if (!collection.value) {
          collection.value = [];
          collectIndex = 0;
        }

        const filenamesArray = collection.files.map((f) => {
          return { filename: f.filename };
        });

        Vue.set(collection.value, collectIndex, {
          id: parseInt(Math.random() * 100000, 10),
          files: filenamesArray,
        });
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
      async loadState({ commit }) {
        if (window.BX) {
          window.BX.ajax
            .runComponentAction(`twinpx:vkkr.api`, 'blocks', {
              mode: 'class',
              data: {
                vkkr_id: vkkrId,
                sessid: BX.bitrix_sessid(),
              },
              dataType: 'json',
            })
            .then(
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
      setControlValue({ commit }, { control, controlIndex, value }) {
        commit('changeControl', {
          control,
          controlIndex,
          value,
        });
      },
      setCollectionValue({ commit }, { collection, collectIndex }) {
        commit('addToMultipleCollection', {
          collection,
          collectIndex,
        });
      },
      async saveBlock({ commit }, { blockId }) {
        if (window.BX) {
          return window.BX.ajax
            .runComponentAction(`twinpx:aas.api.methods.saveBlock`, 'formData')
            .then(
              (r) => {
                if (r.status === 'success' && r.data) {
                  commit('setBlockStatus', { blockId, status: r.data.status });
                }
                return { status: r.status };
              },
              (error) => {
                return { error };
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
            {{ block.name }}
          </a>
          <div class="b-collapse-vc__right">
            <div v-if="block.status" v-html="status" class="b-collapse-vc__status"></div>
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

              <div v-if="block.permissions.write">
                <fileload-form :collections="block.items" :block="block"></fileload-form>
              </div>
              <div v-else-if="block.permissions.moderation">
                <files-collection-info v-for="(collection, index) in block.items" :block="block" :collection="collection" :last="index === block.items.length-1"></files-collection-info>
              </div>
            </div>
          </div>
        </transition>
      </div>
    `,
    computed: {
      status() {
        if (!this.block.status) return;

        const status = this.$store.state.data.statuses.find(
          (s) => s.id === this.block.status
        );
        return `<div class="label-default"><span style="color:${status['text-color']}; background-color:${status['bg-color']}">${status.name}</span></div>`;
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
        <div class="b-files-collection__hint" v-html="collection.hint"></div>
        
        <hr>

        <div v-for="formControl in collection.files" :key="formControl.id">
            <hr>

            <form-control-multy v-if="formControl.multiple" :formControl="formControl"></form-control-multy>

            <form-control-cols v-else :formControl="formControl"></form-control-cols>
        </div>
      </div>
    `,
  });

  Vue.component('filesCollectionInfo', {
    data() {
      return {};
    },
    props: ['block', 'collection', 'last'],
    template: `
      <div class="b-files-collection-info">
        <div class="b-files-collection__name">{{ collection.name }}</div>
        <div class="b-files-collection__description" v-html="collection.description"></div>
        <div class="b-files-collection__hint" v-html="collection.hint"></div>

        <hr>

        <div v-if="block.state==='moderating'">

          <file-info v-for="file in collection.files" :key="file.id" :block="block" :file="file"></file-info>

          <hr v-if="!last">

        </div>
        <div v-else-if="block.state==='empty'">

          <file-info-empty></file-info-empty>

        </div>
      </div>
    `,
  });

  Vue.component('fileInfo', {
    data() {
      return {
        ext: this.file.filename.split('.').reverse()[0],
      };
    },
    props: ['block', 'file'],
    template: `
      <div class="b-docs-block__item" :href="file.filelink">
        <div class="b-docs-block__body">
          <a class="b-docs-block__icon" :href="file.filelink" :style="icon"></a>
          <span class="b-docs-block__text">
            <a :href="file.filelink">{{ name }}</a>
            <span class="b-docs-block__data">
              <span class="text-muted">{{ file.filesize }} .{{ ext }}</span>
              <span class="text-muted">Дата публикации: {{ block.date_added }}</span>
              <span class="text-muted">Автор: <a :href="block.author_id">{{ block.author_name }}</a></span>
            </span>
          </span>
        </div>
        <div v-if="block.status" v-html="status"></div>
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
        if (!this.block.status) return;

        const status = this.$store.state.data.statuses.find(
          (s) => s.id === this.block.status
        );
        return `<div class="label-default"><span style="color:${status['text-color']}; background-color:${status['bg-color']}">${status.name}</span></div>`;
      },
    },
    methods: {},
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

  Vue.component('filesCollectionMulty', {
    data() {
      return {
        val: 'value',
      };
    },
    props: ['block', 'collection'],
    template: `
      <div>
      {{ val }}
        <hr class="hr--md" style="margin-top: 0;">
        <transition-group name="list" tag="div" >
          <div v-for="(valueObject, idx) in collection.value" :key="valueObject.id" class="multy-collection-wrapper">
          
            <div v-if="collection.value.length > 1" @click="remove(idx)" class="multy-collection-wrapper__remove btn-delete"></div>

            <files-collection v-for="(collect, idx) in collection.value" :key="collect.id" :collection="collection" :collectIndex="idx" :block="block"></files-collection>
          </div>
        </transition-group>
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
        this.val = this.val + 'new value';
        this.$store.dispatch('setCollectionValue', {
          collection: this.collection,
          collectIndex: this.collection.value.length,
        });
      },
      remove(idx) {
        this.$store.commit('removeControl', {
          control: this.formControl,
          controlIndex: idx,
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
              <div v-if="formControl.value.length > 1" @click="remove(idx)" class="multy-control-wrapper__remove btn-delete"></div>
              <form-control-cols :formControl="formControl" :controlIndex="idx"></form-control-cols>
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
        if (
          this.formControl.maxfiles &&
          typeof this.formControl.maxfiles === 'number'
        ) {
          return this.formControl.value.length >= this.formControl.maxfiles;
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
        this.$store.dispatch('setControlValue', {
          control: this.formControl,
          controlIndex: this.formControl.value.length,
          value: '',
        });
      },
      remove(idx) {
        this.$store.commit('removeControl', {
          control: this.formControl,
          controlIndex: idx,
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

  Vue.component('formControlCols', {
    template: `
        <div class="b-form-control-cols">
            <div class="b-form-control-cols__control">
                <form-control-file :formControl="formControl" :controlIndex="controlIndex"></form-control-file>
            </div>
            <div class="b-form-control-cols__desc" v-if="formControl.description" v-html="formControl.description"></div>
        </div>
    `,
    props: ['formControl', 'controlIndex'],
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
    },
    computed: {
      id() {
        if (this.formControl.multiple && this.formControl.value.length) {
          return `id${this.formControl.value[this.controlIndex].id}`;
        } else if (!this.formControl.multiple) {
          return `id${this.formControl.id}`;
        }
      },
      name() {
        if (this.formControl.multiple && this.controlIndex !== undefined) {
          return `${this.formControl.name}[${this.controlIndex}]`;
        } else if (!this.formControl.multiple) {
          return this.formControl.name;
        }
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
        if (
          this.formControl.multiple &&
          this.formControl.filename[this.controlIndex]
        ) {
          return this.formControl.filename[this.controlIndex];
        } else if (!this.formControl.multiple && this.formControl.filename) {
          return this.formControl.filename;
        }
        return this.formControl.default;
      },
      filename() {
        return this.formControl.multiple
          ? this.formControl.filename[this.controlIndex]
          : this.formControl.filename;
      },
    },
    methods: {
      uploadFile(files) {
        this.$store.dispatch('setControlValue', {
          control: this.formControl,
          controlIndex: this.controlIndex,
          value: files[0].name,
        });

        this.files = files;
      },
      clearInputFile() {
        this.files = [];
        this.$refs.inputFile.value = '';
        //set value
        this.$store.dispatch('setControlValue', {
          control: this.formControl,
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
    template: `
      <div>
        <div v-for="collection in collections" :key="collection.id">
          <files-collection-multy v-if="collection.multiple" :collection="collection" :block="block"></files-collection-multy>

          <files-collection v-else :collection="collection" :block="block"></files-collection>
        </div>

        <hr>

        <div class="btn btn-secondary btn-lg" href="" @click="submit">Отправить</div>
      </div>`,
    props: ['collections', 'block'],
    methods: {
      submit() {
        //loading
        const promise = this.$store.dispatch('saveBlock', {
          blockId: this.blockId,
        });
        promise
          .then((res) => {
            if (res.error) {
              //show error
            } else if (res.status && res.status === 'success') {
              return this.$store.dispatch('getHistory', {
                blockId: this.blockId,
              });
            }
          })
          .then((res) => {
            //remove loading
          });
      },
    },
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
