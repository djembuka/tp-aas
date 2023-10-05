window.onload = function () {
  if (!window.Vue && !window.Vuex) return;

  let velocity = window.Velocity || jQuery.Velocity;

  window.moderationSrcPath = '/template/images/';

  Vue.use(Vuex);
  Vue.use(VueScrollTo);

  const store = new Vuex.Store({
    state: {
      ...window.studyCourseStore,
      taskEditingId: undefined,
      modal: {
        hidden: [],
        controls: [],
      },
      loading: false,
      error: '',
    },
    mutations: {
      changeTask(state, payload) {
        state.blocks.forEach((block) => {
          block.tasks.forEach((task, i) => {
            if (String(payload.id) === String(task.id)) {
              Vue.set(block.tasks, i, payload);
            }
          });
        });
      },
      changeModal(state, payload) {
        Vue.set(state.modal, 'hidden', payload.hidden);
        Vue.set(state.modal, 'controls', payload.controls);
      },
      changeProp(state, payload) {
        state[payload.prop] = payload.value;
      },
      changeSelect(state, payload) {
        state.modal.controls[payload.controlIndex].selected = payload.selected;
      },
      changeDate(state, payload) {
        state.modal.controls[payload.controlIndex].value = payload.value;
      },
      changeTextControl(state, payload) {
        if (
          state.modal.controls[payload.controlIndex].type === 'time' &&
          payload.time
        ) {
          switch (payload.time) {
            case 'start':
              state.modal.controls[payload.controlIndex].controls[0].value =
                payload.value;
              break;
            case 'end':
              state.modal.controls[payload.controlIndex].controls[1].value =
                payload.value;
              break;
          }
        } else {
          state.modal.controls[payload.controlIndex].value = payload.value;
        }
      },
      setInvalid(state, payload) {
        switch (payload) {
          case '#collapse1':
            state.formBlocks[0].invalid = true;
            break;
          case '#collapse2':
            state.formBlocks[1].invalid = true;
            break;
          case '#agreement':
            state.agreement.invalid = true;
            break;
        }
      },
    },
    getters: {
      fields(state) {
        return JSON.stringify(state.modal);
      },
    },
  });

  Vue.component('v-select', VueSelect.VueSelect);
  Vue.component('date-picker', DatePicker);

  //hidden fields
  Vue.component('hiddenFields', {
    data() {
      return {};
    },
    template: `
      <div>
        <input v-for="field in $store.state.modal.hidden" :key="generateKey()" type="hidden" :name="field.name" :value="field.value">
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

  //collapse block 2
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
            <b class="b-scd-form-programm">{{ block.programm }}</b>
          </a>
          <span></span>
        </div>
        <transition @enter="enter" @leave="leave" :css="false">
          <div class="b-collapse-vc__body" v-if="slide">
            <div class="b-scd-form" v-for="task in block.tasks">
              <div class="b-scd-form-text">
                <div class="b-scd-form-info">
                  <div class="b-scd-form-date">{{ task.date }}<br>{{ task.start }}−{{ task.end }}</div>
                  <div class="b-scd-form-time">{{ task.hours }} {{ getHoursString(task.hours) }}</div>
                  <div class="b-scd-form-type">{{ task.type }}</div>
                </div>
                <div class="b-scd-form-about">
                  <div class="b-scd-form-description">{{ task.description }}</div>
                  <div class="b-scd-form-subject">{{ task.subject }}</div>
                  <div class="b-scd-form-lecturer">{{ task.teacher }}</div>
                  <div class="b-scd-form-biography" v-if="task.biography">{{ task.biography }}</div>
                </div>
              </div>
              <div class="b-scd-form-icon" v-if="$store.state.editable">
                <button class="btn-edit" @click.prevent="clickEdit(task.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g>
                      <path d="M9.263,1.439l-8.21,8.69a3.05,3.05,0,0,0-.67,1.43L.013,14.8a1.527,1.527,0,0,0,1.87,1.77l3.22-.55a2.871,2.871,0,0,0,1.39-.75l8.21-8.69c1.42-1.5,2.06-3.21-.15-5.3C12.353-.791,10.683-.061,9.263,1.439Z" transform="translate(4.002 3.701)"></path>
                      <path d="M0,0A6.126,6.126,0,0,0,5.45,5.15" transform="translate(11.895 6.59)"></path>
                      <path d="M0,0H24V24H0Z" fill="none" opacity="0"></path>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    `,
    methods: {
      getHoursString(hours) {
        if (/(10|11|12|13|14|15|16|17|18|19)$/.test(+hours)) {
          return 'часов';
        } else if (/.*1$/.test(+hours)) {
          return 'час';
        } else if (/[2-4]$/.test(+hours)) {
          return 'часа';
        } else {
          return 'часов';
        }
      },
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
      generateKey(index) {
        return Date.now() * Math.random() + index;
      },
      clickEdit(taskId) {
        //open modal
        $('#editStudyCourseModal').modal('show');
        store.commit('changeProp', { prop: 'loading', value: true });
        store.commit('changeProp', { prop: 'taskEditingId', value: taskId });
        this.loadData(taskId);
      },
      async loadData(taskId) {
        let formData = new FormData(),
          controller = new AbortController(),
          response,
          result;

        formData.set('id', taskId);

        setTimeout(() => {
          if (!response) {
            controller.abort();
          }
        }, 20000);

        try {
          response = await fetch(
            this.$store.state.editURL /*, {
              method: 'POST',
              body: formData,
              signal: controller.signal,
            }*/
          );

          result = await response.json();

          if (result && typeof result === 'object') {
            if (result.status === 'success') {
              store.commit('changeModal', result.data.modal);
              store.commit('changeProp', { prop: 'loading', value: false });
              store.commit('changeProp', { prop: 'error', value: '' });
            } else {
              if (
                typeof result.data === 'object' &&
                result.errors &&
                result.errors[0]
              ) {
                store.commit('changeProp', { prop: 'loading', value: false });
                store.commit('changeProp', {
                  prop: 'error',
                  value: result.errors[0].message,
                });
              }
            }
          }
        } catch (err) {
          store.commit('changeProp', { prop: 'loading', value: false });
          store.commit('changeProp', {
            prop: 'error',
            value: err,
          });
          throw err;
        }
      },
    },
  });

  //form control
  Vue.component('formControl', {
    data() {
      return {
        controlValue: this.formControl.value,
        isActive: this.formControl.value === '' ? false : true,
        isInvalid: false,
      };
    },
    props: ['formControl', 'formControlIndex', 'time'],
    template: `
      <div class="b-float-label" :class="{invalid: isInvalid}">
        <input :id="'PROPERTY_'+formControl.name" type="text" :name="'PROPERTY['+formControl.name+']'" autocomplete="off" required="required" @blur="blurControl()" @input="inputControl()" v-model="controlValue" ref="input">
        <label :for="'PROPERTY_'+formControl.name" :class="{active: isActive}">{{formControl.label}} *</label>
      </div>
    `,
    methods: {
      inputControl() {
        if (this.time) {
          setTimeout(() => {
            this.controlValue = this.$refs.input.value;
            this.setValue();
          }, 100);
        } else {
          this.setValue();
        }
      },
      setValue() {
        //validate
        if (!!this.controlValue) {
          this.isInvalid = false;
        }
        //set value
        store.commit('changeTextControl', {
          controlIndex: this.formControlIndex,
          value: this.controlValue,
          time: this.time,
        });
      },
      blurControl() {
        if (this.controlValue !== '') {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
        //validate
        if (this.required && !this.controlValue) {
          this.isInvalid = true;
        } else {
          this.isInvalid = false;
        }
        this.inputControl();
      },
    },
    mounted() {
      if (this.time) {
        IMask(this.$refs.input, {
          mask: '00:00',
        });
      }
    },
  });

  //form control number
  Vue.component('formControlNumber', {
    data() {
      return {
        controlValue: this.formControl.value,
        isActive: this.formControl.value === '' ? false : true,
        isInvalid: false,
      };
    },
    props: ['formControl', 'formControlIndex'],
    template: `
      <div class="b-float-label" :class="{invalid: isInvalid}">
        <input :id="'PROPERTY_'+formControl.name" type="number" :name="'PROPERTY['+formControl.name+']'" autocomplete="off" required="required" @blur="blurControl()" @input="inputControl()" v-model="controlValue">
        <label :for="'PROPERTY_'+formControl.name" :class="{active: isActive}">{{formControl.label}} *</label>
      </div>
    `,
    methods: {
      inputControl() {
        //validate
        if (!!this.controlValue) {
          this.isInvalid = false;
        }
        //set value
        store.commit('changeTextControl', {
          controlIndex: this.formControlIndex,
          value: this.controlValue,
          time: this.time,
        });
      },
      blurControl() {
        if (this.controlValue !== '') {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
        //validate
        if (this.required && !this.controlValue) {
          this.isInvalid = true;
        } else {
          this.isInvalid = false;
        }
      },
    },
  });

  //form control textarea
  Vue.component('formControlTextarea', {
    data() {
      return {
        controlValue: this.formControl.value,
        isActive: this.formControl.value === '' ? false : true,
        isInvalid: false,
      };
    },
    props: ['formControl', 'formControlIndex'],
    template: `
      <div class="b-float-label" :class="{invalid: isInvalid}">
        <textarea :id="'PROPERTY_'+formControl.name" :name="'PROPERTY['+formControl.name+']'" autocomplete="off" required="required" @blur="blurControl()" @input="inputControl()" v-model="controlValue"></textarea>
        <label :for="'PROPERTY_'+formControl.name" :class="{active: isActive}">{{formControl.label}} *</label>
      </div>
    `,
    methods: {
      inputControl() {
        //validate
        if (!!this.controlValue) {
          this.isInvalid = false;
        }
        //set value
        store.commit('changeTextControl', {
          controlIndex: this.formControlIndex,
          value: this.controlValue,
        });
      },
      blurControl() {
        if (this.controlValue !== '') {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
        //validate
        if (this.required && !this.controlValue) {
          this.isInvalid = true;
        } else {
          this.isInvalid = false;
        }
      },
    },
  });

  //form control select
  Vue.component('formControlSelect', {
    data() {
      return {
        options: this.formControl.value || [
          {
            label: '',
            code: '',
          },
        ],
        selectedOption: this.formControl.selected || {
          label: '',
          code: '',
        },
      };
    },
    template: `<div class="b-float-label-select-vc" ref="selectTemplate">
      <label class="active">{{formControl.label}} *</label>
      <v-select :searchable="false" :options="options" :value="options[0]" class="form-control-select" @input="onSelect()" v-model="selectedOption"></v-select>
      <input type="hidden" :name="'PROPERTY['+formControl.name+']'" :value="selectedOption.code" ref="hiddenInput">
    </div>`,
    props: ['formControl', 'formControlIndex'],
    methods: {
      onSelect() {
        //set select
        store.commit('changeSelect', {
          controlIndex: this.formControlIndex,
          selected: this.selectedOption,
        });
        this.$refs.hiddenInput.value = this.selectedOption.code;
      },
    },
  });

  //form control date
  Vue.component('formControlDate', {
    template: `<div class="b-float-label" data-src="${window.moderationSrcPath}calendar.svg" :class="{invalid: isInvalid}">
      <date-picker :lang="lang" :input-attr="inputAttr" valueType="format" v-model="date" value-type="X" format="DD.MM.YYYY" @open="openInput" @close="closeInput" @clear="closeInput" @input="inputDate" @blur="blurInput"></date-picker>
      <label :for="'PROPERTY_'+formControl.name" :class="{ active: isActive }">{{formControl.label}}</label>
    </div>`,
    data() {
      return {
        inputAttr: {
          id: `PROPERTY_${this.formControl.name}`,
          name: `PROPERTY[${this.formControl.name}]`,
        },
        isActive: !!this.formControl.value,
        isInvalid: false,
        date: this.formControl.value,
        lang: {
          // the locale of formatting and parsing function
          formatLocale: {
            // MMMM
            months: [
              'Январь',
              'Февраль',
              'Март',
              'Апрель',
              'Май',
              'Июнь',
              'Июль',
              'Август',
              'Сентябрь',
              'Октябрь',
              'Ноябрь',
              'Декабрь',
            ],
            // MMM
            monthsShort: [
              'Янв',
              'Фев',
              'Мар',
              'Апр',
              'Май',
              'Июн',
              'Июл',
              'Авг',
              'Сен',
              'Окт',
              'Ноя',
              'Дек',
            ],
            // dddd
            weekdays: [
              'Воскресенье',
              'Понедельник',
              'Вторник',
              'Среда',
              'Четверг',
              'Пятница',
              'Суббота',
            ],
            // ddd
            weekdaysShort: ['Вск', 'Пнд', 'Втр', 'Сре', 'Чтв', 'Птн', 'Суб'],
            // dd
            weekdaysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            // first day of week
            firstDayOfWeek: 1,
            // first week contains January 1st.
            firstWeekContainsDate: 1,
            // format 'a', 'A'
            meridiem(h, _, isLowercase) {
              const word = h < 12 ? 'AM' : 'PM';
              return isLowercase ? word.toLocaleLowerCase() : word;
            },
            // parse ampm
            meridiemParse: /[ap]\.?m?\.?/i,
            // parse ampm
            isPM(input) {
              return `${input}`.toLowerCase().charAt(0) === 'p';
            },
          },
          // the calendar header, default formatLocale.weekdaysMin
          days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          // the calendar months, default formatLocale.monthsShort
          months: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
          ],
          // the calendar title of year
          yearFormat: 'YYYY',
          // the calendar title of month
          monthFormat: 'MMMM',
          // the calendar title of month before year
          monthBeforeYear: true,
        },
      };
    },
    props: ['formControl', 'formControlIndex'],
    methods: {
      openInput() {
        this.isActive = true;
      },
      closeInput() {
        if (!this.date) {
          this.isActive = false;
          this.isInvalid = true;
        }
      },
      blurInput() {
        //validate
        if (!this.date) {
          this.isInvalid = true;
        } else {
          this.isInvalid = false;
        }
      },
      inputDate() {
        if (this.date) {
          this.isInvalid = false;
        }
        store.commit('changeDate', {
          controlIndex: this.formControlIndex,
          value: this.date,
        });
      },
    },
  });

  //submit button
  Vue.component('submitButton', {
    data() {
      return {};
    },
    template: `
      <div class="b-edit-study-course-modal__submit row">
        <div class="col-sm-6">
          <div name="iblock_submit" class="btn btn-secondary btn-lg" :disabled="isDisabled" @click="submit()">Сохранить</div>
        </div>
        <div class="col-sm-6">
          <div class="btn btn-lg btn-light" data-dismiss="modal">Отменить</div>
        </div>
      </div>
    `,
    computed: {
      isDisabled() {
        let requireds = true;

        requireds = this.$store.state.modal.controls.every((control) => {
          if (control.type === 'time') {
            return control.controls.every((c) => !!c.value);
          }
          return !!control.value;
        });

        return !requireds;
      },
    },
    methods: {
      async submit() {
        store.commit('changeProp', { prop: 'loading', value: true });

        let formData = new FormData(),
          controller = new AbortController(),
          response,
          result;

        formData.set('id', this.$store.state.taskEditingId);
        formData.set('fields', this.$store.getters.fields);

        setTimeout(() => {
          if (!response) {
            controller.abort();
          }
        }, 20000);

        try {
          response = await fetch(
            this.$store.state.submitURL /*, {
              method: 'POST',
              body: formData,
              signal: controller.signal,
            }*/
          );

          result = await response.json();

          if (result && typeof result === 'object') {
            if (result.status === 'success') {
              $('#editStudyCourseModal').modal('hide');
              store.commit('changeProp', { prop: 'loading', value: false });
              store.commit('changeProp', { prop: 'error', value: '' });

              if (result.data && result.data.task) {
                store.commit('changeTask', result.data.task);
              }
            } else {
              if (
                typeof result.data === 'object' &&
                result.errors &&
                result.errors[0]
              ) {
                store.commit('changeProp', { prop: 'loading', value: false });
                store.commit('changeProp', {
                  prop: 'error',
                  value: result.errors[0].message,
                });
              }
            }
          }
        } catch (err) {
          store.commit('changeProp', { prop: 'loading', value: false });
          store.commit('changeProp', {
            prop: 'error',
            value: err,
          });
          throw err;
        }
      },
    },
  });

  //modal
  Vue.component('editStudyCourseModal', {
    data() {
      return {};
    },
    template: `
      <div class="modal--text modal fade show" id="editStudyCourseModal" tabindex="-1" aria-labelledby="editStudyCourseModalLabel" aria-modal="true" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <button class="close" type="button" data-dismiss="modal" aria-label="Close" style="background-image: url( '/template/images/cancel.svg' );"></button>
            <div class="modal-body">
              <h3 class="text-center">Изменить данные о занятии</h3>
              <hr>
              <edit-study-course-form></edit-study-course-form>
            </div>
          </div>
        </div>
      </div>`,
  });

  //form
  Vue.component('editStudyCourseForm', {
    data() {
      return {};
    },
    template: `
    <div>

      <div :class="{'b--hidden': $store.state.loading || $store.state.error}">

        <hidden-fields></hidden-fields>

        <div v-for="(formControl, formControlIndex) in $store.state.modal.controls" :key="formControlIndex + Math.floor(Math.random() * 100000)">

          <form-control-date v-if="formControl.type==='date'" :formControl="formControl" :formControlIndex="formControlIndex"></form-control-date>

          <form-control-textarea v-else-if="formControl.type==='textarea'" :formControl="formControl" :formControlIndex="formControlIndex"></form-control-textarea>

          <form-control-select v-else-if="formControl.type==='select'" :formControl="formControl" :formControlIndex="formControlIndex"></form-control-select>

          <div class="row" v-else-if="formControl.type==='time'">
            <div class="col-sm-4">
              <form-control :formControl="formControl.controls[0]" :formControlIndex="formControlIndex" time="start"></form-control>
            </div>
            <div class="col-sm-4">
              <form-control :formControl="formControl.controls[1]" :formControlIndex="formControlIndex" time="end"></form-control>
            </div>
          </div>

          <form-control-number v-else-if="formControl.type==='number'" :formControl="formControl" :formControlIndex="formControlIndex"></form-control-number>

          <form-control-textarea v-else-if="formControl.type==='textarea'" :formControl="formControl" :formControlIndex="formControlIndex"></form-control-textarea>

          <form-control v-else :formControl="formControl" :formControlIndex="formControlIndex"></form-control>
        </div>

        <hr>

        <submit-button></submit-button>

      </div>

      <div :class="{'progress-indicator': true, 'b--hidden': !$store.state.loading}">
        <div class="item item-1"></div>
        <div class="item item-2"></div>
        <div class="item item-3"></div>
        <div class="item item-4"></div>
        <div class="item item-5"></div>
      </div>

      <div :class="{'b-edit-study-course-form-error': true, 'b--hidden': !$store.state.error}">
        {{$store.state.error}}
      </div>

    </div>
  `,
  });

  const App = {
    el: '#editStudyCourseBlocks',
    store,
    template: `
      <div :class="{'b-scd--editable': $store.state.editable}">
        <edit-study-course-modal></edit-study-course-modal>
        <collapse-block v-for="block in $store.state.blocks" :block="block"></collapse-block>
      </div>
    `,
    methods: {},
    mounted() {},
  };

  const app = new Vue(App);
};
