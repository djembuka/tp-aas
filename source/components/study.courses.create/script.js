window.onload = function () {
  function parseQuery(queryString) {
    var query = {};
    var pairs = (
      queryString[0] === '?' ? queryString.substr(1) : queryString
    ).split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  function getQuery(queryObject) {
    var result = [];
    for (var k in queryObject) {
      if (k) {
        result.push(k + '=' + queryObject[k]);
      }
    }
    return '?' + result.join('&');
  }

  if (!window.Vue && !window.Vuex) return;

  window.moderationSrcPath = '/template/images/';

  let velocity = window.Velocity || jQuery.Velocity;

  Vue.use(Vuex);
  Vue.use(VueScrollTo);

  const store = new Vuex.Store({
    state: {
      courseId: undefined,
      ...window.studyCourseCreateStore,
      loading: false,
      error: '',
    },
    mutations: {
      changeBlockLoading(state, { stepIndex, blockIndex, type, value }) {
        if (type === 'add') {
          Vue.set(state.steps[stepIndex], 'addLoading', value);
        } else if (type === 'delete' && blockIndex) {
          Vue.set(
            state.steps[stepIndex].blocks[blockIndex],
            'deleteLoading',
            value
          );
        }
      },
      changeLessonLoading(
        state,
        { stepIndex, blockIndex, lessonIndex, type, value }
      ) {
        if (type === 'add') {
          Vue.set(
            state.steps[stepIndex].blocks[blockIndex],
            'addLoading',
            value
          );
        } else if (type === 'delete' && blockIndex) {
          Vue.set(
            state.steps[stepIndex].blocks[blockIndex].lessons[lessonIndex],
            'deleteLoading',
            value
          );
        }
      },
      changeProp(state, { prop, value }) {
        state[prop] = value;
      },
      setStepActive(state, payload) {
        state.steps.forEach((step, i) => {
          Vue.set(step, 'active', i === payload);
        });
      },
      setStepVisited(state, payload) {
        if (state.steps[payload]) {
          Vue.set(state.steps[payload], 'visited', true);
        }
      },
      changeTextControl(
        state,
        { stepIndex, blockIndex, lessonIndex, controlIndex, prop, value }
      ) {
        const block = state.steps[stepIndex].blocks
          ? state.steps[stepIndex].blocks[blockIndex]
          : state.steps[stepIndex];
        const control = block.lessons
          ? block.lessons[lessonIndex].controls[controlIndex]
          : block.controls[controlIndex];

        Vue.set(control, prop, value);
      },
      changeSelect(
        state,
        { stepIndex, blockIndex, lessonIndex, controlIndex, selected }
      ) {
        const block = state.steps[stepIndex].blocks
          ? state.steps[stepIndex].blocks[blockIndex]
          : state.steps[stepIndex];
        const control = block.lessons
          ? block.lessons[lessonIndex].controls[controlIndex]
          : block.controls[controlIndex];

        control.selected = selected;
      },
      changeDate(
        state,
        { stepIndex, blockIndex, lessonIndex, controlIndex, value }
      ) {
        state.steps[stepIndex].blocks[blockIndex].lessons[lessonIndex].controls[
          controlIndex
        ].value = value;
      },
      addBlock(state, { stepIndex, block }) {
        //add block to the step 2
        let b2 = state.steps[stepIndex].blocks;
        Vue.set(b2, b2.length, block[0]);
        //add block to the step 3
        let b3 = state.steps[2].blocks;
        Vue.set(b3, b3.length, block[1]);
      },
      deleteBlock(state, { stepIndex, blockId }) {
        //delete block to the step 2
        let b2 = state.steps[stepIndex].blocks;
        let i2 = b2.findIndex((block) => block.id === blockId);
        b2.splice(i2, 1);
        //delete block to the step 3
        let b3 = state.steps[2].blocks;
        let i3 = b3.findIndex((block) => block.id === blockId);
        b3.splice(i3, 1);
      },
      addLesson(state, { stepIndex, blockIndex, lesson }) {
        let l = state.steps[stepIndex].blocks[blockIndex].lessons;
        Vue.set(l, l.length, lesson);
      },
      deleteLesson(state, { stepIndex, blockId, lessonId }) {
        try {
          let blocks = state.steps[stepIndex].blocks;
          let blockIndex = blocks.findIndex((b) => b.id === blockId);
          let lessons = blocks[blockIndex].lessons;
          let lessonIndex = lessons.findIndex((l) => l.id === lessonId);
          lessons.splice(lessonIndex, 1);
        } catch (e) {
          throw err;
        }
      },
      updateLessonSubject(state, { data }) {
        //lesson type select
        const typeControl = state.steps[0].controls.find(
          (c) => c.name === 'UMC_TYPE'
        );

        if (typeControl) {
          let typeControlValue =
            state.TYPE_COMPARE[String(typeControl.selected.code)];

          state.steps[2].blocks.forEach((block) => {
            block.lessons.forEach((lesson) => {
              const lessonTypeControl = lesson.controls.find(
                (c) => c.name === 'TASK_TYPE'
              );
              Vue.set(lessonTypeControl, 'value', typeControlValue);
              Vue.set(lessonTypeControl, 'selected', typeControlValue[0]);
            });
          });
        }

        //discipline select
        Object.keys(data.discipline).forEach((id) => {
          const block = state.steps[2].blocks.find(
            (b) => String(b.id) === String(id)
          );
          block.lessons.forEach((lesson) => {
            const control = lesson.controls.find(
              (c) => c.name === 'TASK_DISCIPLINE'
            );
            const newValue = [];
            data.discipline[id].forEach((code) => {
              const valueObject = control.value.find(
                (obj) => String(obj.code) === String(code)
              );
              if (valueObject) {
                newValue.push(valueObject);
              }
            });
            //new value
            control.value = newValue;
            //selected
            control.selected = newValue[0];
          });
        });
      },
    },
    getters: {
      activeStepIndex(state) {
        return state.steps.findIndex((step) => step.active);
      },
      firstInvalidControl(state, getters) {
        let step = state.steps[getters.activeStepIndex];
        let first;

        if (step.blocks) {
          step.blocks.forEach((block, blockIndex) => {
            if (block.lessons) {
              block.lessons.forEach((lesson, lessonIndex) => {
                if (!first) {
                  let a = find(lesson);
                  if (a) {
                    first = { ...a, blockIndex, lessonIndex };
                  }
                }
              });
            } else {
              if (!first) {
                let a = find(block);
                if (a) {
                  first = { ...find(block), blockIndex };
                }
              }
            }
          });
        } else {
          if (!first) {
            first = find(step);
          }
        }

        function find(controlsSet) {
          return controlsSet.controls.find(
            (formControl) => formControl.invalid === true
          );
        }

        return first;
      },
      stepFields(state, getters) {
        return JSON.stringify(state.steps[getters.activeStepIndex]);
      },
      fields(state) {
        return JSON.stringify(state.steps);
      },
    },
    actions: {
      createCourse({ dispatch, commit, getters, state }, { data }) {
        if (data.courseId) {
          commit('changeProp', {
            prop: 'courseId',
            value: data.courseId,
          });
        }
        if (data.block) {
          commit('addBlock', {
            block: data.block,
            stepIndex: 1,
          });
        }
      },
      validateControl(
        { state, commit, getters },
        { formControl, time, blockIndex, lessonIndex, controlIndex }
      ) {
        let stepIndex = getters.activeStepIndex;
        const block = state.steps[stepIndex].blocks
          ? state.steps[stepIndex].blocks[blockIndex]
          : state.steps[stepIndex];
        const control = block.lessons
          ? block.lessons[lessonIndex].controls[controlIndex]
          : block.controls[controlIndex];

        let value = formControl.value;
        if (formControl.selected) {
          value = formControl.selected.code;
        } else if (typeof formControl.value === 'object') {
          value = formControl.value.ID || '';
        }

        switch (control.type) {
          case 'text':
          case 'textarea':
          case 'ornz':
          case 'date':
          case 'time':
          case 'select':
            commit('changeTextControl', {
              stepIndex: getters.activeStepIndex,
              blockIndex: blockIndex,
              lessonIndex: lessonIndex,
              controlIndex: controlIndex,
              time: time,
              prop: 'invalid',
              value: (formControl.required && value === '') || undefined,
            });
            break;
        }
      },
      async fetchAction(context, { url, data, success, error }) {
        let formData = new FormData(),
          controller = new AbortController(),
          response,
          result;

        if (data) {
          data.forEach((prop) => {
            formData.set(prop.name, prop.value);
          });
        }

        setTimeout(() => {
          if (!response) {
            controller.abort();
          }
        }, 20000);

        try {
          response = await fetch(
            url /*, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          }*/
          );
          result = await response.json();
          if (result.status === 'success') {
            success(result);
          } else {
            error(result);
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
      submitStep({ dispatch, commit, getters, state }, { button, stepIndex }) {
        let step = state.steps[getters.activeStepIndex];

        //validate
        if (step.blocks) {
          step.blocks.forEach((block, blockIndex) => {
            if (block.lessons) {
              block.lessons.forEach((lesson, lessonIndex) => {
                validate(lesson, blockIndex, lessonIndex);
              });
            } else {
              validate(block, blockIndex);
            }
          });
        } else {
          validate(step);
        }

        function validate(controlsSet, blockIndex, lessonIndex) {
          controlsSet.controls.forEach((formControl, formControlIndex) => {
            let obj = { formControl, controlIndex: formControlIndex };
            if (blockIndex !== undefined) {
              obj.blockIndex = blockIndex;
            }
            if (lessonIndex !== undefined) {
              obj.lessonIndex = lessonIndex;
            }
            dispatch('validateControl', obj);
          });
        }

        if (!!getters.firstInvalidControl) {
          let name = `${getters.firstInvalidControl.name}${
            getters.firstInvalidControl.blockIndex !== undefined
              ? '[' + getters.firstInvalidControl.blockIndex + ']'
              : ''
          }${
            getters.firstInvalidControl.lessonIndex !== undefined
              ? '[' + getters.firstInvalidControl.lessonIndex + ']'
              : ''
          }`;

          let elem = document.querySelector(`[name="${name}"]`);
          if (elem) {
            elem.focus();
          }

          return;
        }

        //load
        commit('changeProp', { prop: 'loading', value: true });

        dispatch('fetchAction', {
          url: state.submitStepURL,
          data: [
            {
              name: 'stepId',
              value:
                stepIndex !== undefined
                  ? state.steps[stepIndex].id
                  : state.steps[getters.activeStepIndex + 1].id,
            },
            {
              name: 'fields',
              value:
                button && button.type === 'save'
                  ? getters.fields
                  : getters.stepFields,
            },
          ],
          success(result) {
            commit('changeProp', { prop: 'loading', value: false });
            //button or nav clicked
            if (button) {
              switch (button.type) {
                case 'continue':
                  if (getters.activeStepIndex === 0) {
                    if (result.data.courseId) {
                      dispatch('createCourse', {
                        data: result.data,
                      });
                    }

                    //set URL
                    if (result.data.courseId) {
                      let queryObject = parseQuery(window.location.search);
                      queryObject.courseId = result.data.courseId;
                      history.replaceState({}, '', getQuery(queryObject));
                    }
                  } else if (getters.activeStepIndex === 1) {
                    if (result.data.discipline) {
                      commit('updateLessonSubject', {
                        data: result.data,
                      });
                    }
                  }
                  let newActiveStepIndex = getters.activeStepIndex + 1;
                  commit('setStepActive', newActiveStepIndex);
                  commit('setStepVisited', newActiveStepIndex);
                  break;
                case 'save':
                  $('#studyCoursesCreateModal').modal('show');
                  break;
              }
            } else if (stepIndex !== undefined) {
              if (stepIndex === 1) {
                if (result.data.courseId) {
                  dispatch('createCourse', {
                    data: result.data,
                  });
                }

                //set URL
                if (result.data.courseId) {
                  let queryObject = parseQuery(window.location.search);
                  queryObject.courseId = result.data.courseId;
                  history.replaceState({}, '', getQuery(queryObject));
                }
              } else if (stepIndex === 2) {
                if (result.data.discipline) {
                  commit('updateLessonSubject', {
                    data: result.data,
                  });
                }
              }
              commit('setStepActive', stepIndex);
              commit('setStepVisited', stepIndex);
            }
          },
          error(result) {
            if (
              typeof result.data === 'object' &&
              result.errors &&
              result.errors[0]
            ) {
              store.commit('changeProp', {
                prop: 'error',
                value: result.errors[0].message,
              });
              throw new Error(result.errors[0].message);
            }
          },
        });
      },
      addBlock({ dispatch, commit, getters, state }) {
        let stepIndex = getters.activeStepIndex;

        dispatch('fetchAction', {
          url: state.addBlockURL,
          data: [
            {
              name: 'courseId',
              value: state.courseId,
            },
            {
              name: 'stepId',
              value: state.steps[stepIndex].id,
            },
          ],
          success(result) {
            commit('addBlock', {
              block: result.data.block,
              stepIndex,
            });
            commit('changeBlockLoading', {
              stepIndex: stepIndex,
              type: 'add',
              value: false,
            });
          },
          error(result) {
            throw new Error(result.errors[0].message);
          },
        });
      },
      deleteBlock({ dispatch, commit, getters, state }, { blockId }) {
        let stepIndex = getters.activeStepIndex;

        dispatch('fetchAction', {
          url: state.deleteBlockURL,
          data: [
            {
              name: 'courseId',
              value: state.courseId,
            },
            {
              name: 'stepId',
              value: state.steps[stepIndex].id,
            },
            {
              name: 'blockId',
              value: blockId,
            },
          ],
          success() {
            commit('deleteBlock', {
              stepIndex,
              blockId,
            });
          },
          error(result) {
            throw new Error(result.errors[0].message);
          },
        });
      },
      addLesson({ dispatch, commit, getters, state }, { blockIndex }) {
        let stepIndex = getters.activeStepIndex;

        dispatch('fetchAction', {
          url: state.addLessonURL,
          data: [
            {
              name: 'courseId',
              value: state.courseId,
            },
            {
              name: 'stepId',
              value: state.steps[stepIndex].id,
            },
            {
              name: 'blockId',
              value: state.steps[stepIndex].blocks[blockIndex].id,
            },
          ],
          success(result) {
            commit('addLesson', {
              lesson: result.data.lesson,
              stepIndex,
              blockIndex,
            });
            commit('changeLessonLoading', {
              stepIndex,
              blockIndex,
              type: 'add',
              value: false,
            });
          },
          error(result) {
            throw new Error(result.errors[0].message);
          },
        });
      },
      deleteLesson(
        { dispatch, commit, getters, state },
        { blockId, lessonId }
      ) {
        let stepIndex = getters.activeStepIndex;

        dispatch('fetchAction', {
          url: state.deleteLessonURL,
          data: [
            {
              name: 'courseId',
              value: state.courseId,
            },
            {
              name: 'stepId',
              value: state.steps[stepIndex].id,
            },
            {
              name: 'blockId',
              value: blockId,
            },
            {
              name: 'lessonId',
              value: lessonId,
            },
          ],
          success() {
            commit('deleteLesson', {
              stepIndex,
              blockId,
              lessonId,
            });
          },
          error(result) {
            throw new Error(result.errors[0].message);
          },
        });
      },
    },
  });

  Vue.component('v-select', VueSelect.VueSelect);
  Vue.component('date-picker', DatePicker);

  //form control
  Vue.component('formControl', {
    data() {
      return {
        controlValue: this.formControl.value,
        isActive: this.formControl.value === '' ? false : true,
      };
    },
    props: [
      'blockIndex',
      'lessonIndex',
      'formControl',
      'formControlIndex',
      'time',
    ],
    computed: {
      id() {
        return `${this.formControl.name}${
          this.blockIndex !== undefined ? '_' + this.blockIndex : ''
        }${this.lessonIndex !== undefined ? '_' + this.lessonIndex : ''}`;
      },
      name() {
        return `${this.formControl.name}${
          this.blockIndex !== undefined ? '[' + this.blockIndex + ']' : ''
        }${this.lessonIndex !== undefined ? '[' + this.lessonIndex + ']' : ''}`;
      },
    },
    template: `
      <div class="b-float-label" :class="{invalid: formControl.invalid}">
        <input :id="id" type="text" :name="name" autocomplete="off" required="required" @blur="blurControl()" @keyup="inputControl()" v-model="controlValue" ref="input">
        <label :for="id" :class="{active: isActive}">{{formControl.label}}{{ formControl.required ? ' *' : ''}}</label>
      </div>
    `,
    methods: {
      setValue() {
        store.commit('changeTextControl', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          controlIndex: this.formControlIndex,
          prop: 'value',
          value: this.time ? this.controlValue.slice(0, 5) : this.controlValue,
          time: this.time,
        });
      },
      setInvalid(val) {
        store.commit('changeTextControl', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          controlIndex: this.formControlIndex,
          time: this.time,
          prop: 'invalid',
          value: val,
        });
      },
      inputControl() {
        if (!!this.controlValue) {
          this.setInvalid(false);
        }
        this.setValue();
      },
      blurControl() {
        if (this.controlValue !== '') {
          this.isActive = true;
        } else {
          this.isActive = false;
        }

        this.$store.dispatch('validateControl', {
          formControl: this.formControl,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          controlIndex: this.formControlIndex,
          time: this.time,
        });
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

  //form control textarea
  Vue.component('formControlTextarea', {
    data() {
      return {
        controlValue: this.formControl.value,
        isActive: this.formControl.value === '' ? false : true,
      };
    },
    props: ['blockIndex', 'lessonIndex', 'formControl', 'formControlIndex'],
    computed: {
      id() {
        return `${this.formControl.name}${
          this.blockIndex !== undefined ? '_' + this.blockIndex : ''
        }${this.lessonIndex !== undefined ? '_' + this.lessonIndex : ''}`;
      },
      name() {
        return `${this.formControl.name}${
          this.blockIndex !== undefined ? '[' + this.blockIndex + ']' : ''
        }${this.lessonIndex !== undefined ? '[' + this.lessonIndex + ']' : ''}`;
      },
    },
    template: `
      <div class="b-float-label" :class="{invalid: formControl.invalid}">
        <textarea :id="id" :name="name" autocomplete="off" required="required" @blur="blurControl()" @input="inputControl()" v-model="controlValue"></textarea>
        <label :for="id" :class="{active: isActive}">{{formControl.label}}{{ formControl.required ? ' *' : ''}}</label>
      </div>
    `,
    methods: {
      setValue() {
        store.commit('changeTextControl', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          controlIndex: this.formControlIndex,
          prop: 'value',
          value: this.controlValue,
        });
      },
      setInvalid(val) {
        store.commit('changeTextControl', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          controlIndex: this.formControlIndex,
          prop: 'invalid',
          value: val,
        });
      },
      inputControl() {
        if (!!this.controlValue) {
          this.setInvalid(false);
        }
        this.setValue();
      },
      blurControl() {
        if (this.controlValue !== '') {
          this.isActive = true;
        } else {
          this.isActive = false;
        }

        this.$store.dispatch('validateControl', {
          formControl: this.formControl,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          controlIndex: this.formControlIndex,
        });
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
    template: `<div class="b-float-label-select-vc" ref="selectTemplate" :class="{invalid: formControl.invalid}">
      <label class="active">{{formControl.label}}{{ formControl.required ? ' *' : ''}}</label>
      <v-select :searchable="false" :options="options" :value="options[0]" class="form-control-select" @input="onSelect()" v-model="selectedOption"></v-select>
      <input type="hidden" :name="name" :value="selectedOption.code" ref="hiddenInput">
    </div>`,
    props: ['blockIndex', 'lessonIndex', 'formControl', 'formControlIndex'],
    computed: {
      id() {
        return `${this.formControl.name}${
          this.blockIndex !== undefined ? '_' + this.blockIndex : ''
        }${this.lessonIndex !== undefined ? '_' + this.lessonIndex : ''}`;
      },
      name() {
        return `${this.formControl.name}${
          this.blockIndex !== undefined ? '[' + this.blockIndex + ']' : ''
        }${this.lessonIndex !== undefined ? '[' + this.lessonIndex + ']' : ''}`;
      },
    },
    methods: {
      setInvalid(val) {
        store.commit('changeTextControl', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          controlIndex: this.formControlIndex,
          prop: 'invalid',
          value: val,
        });
      },
      onSelect() {
        //set select
        store.commit('changeSelect', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          controlIndex: this.formControlIndex,
          selected: this.selectedOption,
        });
        this.$refs.hiddenInput.value = this.selectedOption.code;

        if (!!this.selectedOption.code) {
          this.setInvalid(false);
        }
      },
    },
  });

  //form control date
  Vue.component('formControlDate', {
    data() {
      return {
        inputAttr: {
          id: `${this.formControl.name}${
            this.blockIndex !== undefined ? '_' + this.blockIndex : ''
          }${this.lessonIndex !== undefined ? '_' + this.lessonIndex : ''}`,
          name: `${this.formControl.name}${
            this.blockIndex !== undefined ? '[' + this.blockIndex + ']' : ''
          }${
            this.lessonIndex !== undefined ? '[' + this.lessonIndex + ']' : ''
          }`,
        },
        isActive: !!this.formControl.value,
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
    props: ['blockIndex', 'lessonIndex', 'formControl', 'formControlIndex'],
    computed: {
      id() {
        return `${this.formControl.name}${
          this.blockIndex !== undefined ? '_' + this.blockIndex : ''
        }${this.lessonIndex !== undefined ? '_' + this.lessonIndex : ''}`;
      },
      name() {
        return `${this.formControl.name}${
          this.blockIndex !== undefined ? '[' + this.blockIndex + ']' : ''
        }${this.lessonIndex !== undefined ? '[' + this.lessonIndex + ']' : ''}`;
      },
    },
    template: `<div class="b-float-label" data-src="${window.moderationSrcPath}calendar.svg" :class="{invalid: formControl.invalid}">
      <date-picker :lang="lang" :input-attr="inputAttr" valueType="format" v-model="date" value-type="X" format="DD.MM.YYYY" @open="openInput" @close="closeInput" @clear="closeInput" @input="inputDate" @blur="blurInput"></date-picker>
      <label :for="id" :class="{ active: isActive }">{{formControl.label}}{{ formControl.required ? ' *' : ''}}</label>
    </div>`,
    methods: {
      setInvalid(val) {
        store.commit('changeTextControl', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          controlIndex: this.formControlIndex,
          prop: 'invalid',
          value: val,
        });
      },
      openInput() {
        this.isActive = true;
      },
      closeInput() {
        if (!this.date) {
          this.isActive = false;
          this.setInvalid(true);
        } else {
          this.setInvalid(false);
          this.isActive = true;
        }
      },
      blurInput() {
        this.closeInput();
      },
      inputDate() {
        if (this.date) {
          this.setInvalid(false);
        }
        store.commit('changeDate', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          controlIndex: this.formControlIndex,
          value: this.date,
        });
      },
    },
  });

  //form control ornz
  Vue.component('formControlOrnz', {
    data() {
      return {
        controlValue: this.formControl.value.TEXT,
        isActive: this.formControl.value,
        //hints
        users: [],
        activeUser: this.formControl.value || {},
        activeHint: [],
        hover: false,
        compare: this.controlValue,
      };
    },

    props: ['blockIndex', 'formControl', 'formControlIndex'],

    computed: {
      id() {
        return `${this.formControl.name}${
          this.blockIndex !== undefined ? '_' + this.blockIndex : ''
        }${this.lessonIndex !== undefined ? '_' + this.lessonIndex : ''}`;
      },
      name() {
        return `${this.formControl.name}${
          this.blockIndex !== undefined ? '[' + this.blockIndex + ']' : ''
        }${this.lessonIndex !== undefined ? '[' + this.lessonIndex + ']' : ''}`;
      },
      isClearable() {
        return this.controlValue !== '' && this.hover ? true : false;
      },
    },

    template: `
      <div>
        <div class="b-float-label b-float-label--ornz" :class="{invalid: formControl.invalid}" @mouseover="hover=true;" @mouseout="hover=false;">

          <input ref="input" :id="id" type="text" :name="name" autocomplete="off" v-model="controlValue" @input="changeInput" @focus="focusInput" @blur="blurInput($event)" @keydown.enter.prevent="enterInput" @keydown.up.prevent="upArrow()" @keydown.down.prevent="downArrow()">

          <label ref="label" :for="id" :class="{active: isActive}">{{formControl.label}}{{ formControl.required ? ' *' : ''}}</label>

          <div class="b-input-clear" @click.prevent="clearInput()" v-show="isClearable"></div>

          <div class="b-input-hint">
            <div v-for="(user, index) in users" :data-id="user.ID" :class="{active: activeHint[index]}" class="b-input-hint__item" @click.prevent="clickHint($event)">{{user.TEXT}}</div>
          </div>
        </div>
      </div>`,

    watch: {
      controlValue(val) {
        store.commit('changeTextControl', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          controlIndex: this.formControlIndex,
          value: val,
        });
      },
    },

    methods: {
      setValue() {
        this.controlValue = this.activeUser.TEXT ? this.activeUser.TEXT : '';

        store.commit('changeTextControl', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          controlIndex: this.formControlIndex,
          prop: 'value',
          value: this.activeUser,
        });
      },
      setInvalid(val) {
        store.commit('changeTextControl', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          controlIndex: this.formControlIndex,
          prop: 'invalid',
          value: val,
        });
      },
      changeInput() {
        this.setInvalid(false);
        this.activeHint = [];
        this.activeUser = {};

        if (this.controlValue.length >= 2) {
          (async () => {
            try {
              let response = await fetch(
                `${this.$store.state.ornzControlURL}?s=${this.controlValue}`,
                {
                  headers: {
                    Authentication: 'secret',
                  },
                }
              );
              let result = await response.json();

              //change active hint array
              this.activeHint = result.map((elem) => null);
              this.users = result;
            } catch (err) {
              throw err;
            }
          })();
        } else {
          this.users = [];
        }
      },
      upArrow() {
        let activeIndex = this.activeHint.indexOf(true);
        let arr = this.activeHint.map((elem) => null);
        if (activeIndex >= 0) {
          this.activeHint[activeIndex] = null;
        }
        if (--activeIndex < 0) {
          activeIndex = this.activeHint.length - 1;
        }
        arr[activeIndex] = true;
        //lightlight hint
        this.activeHint = arr;
        //set active user
        this.activeUser =
          this.users.find((user) => user.TEXT === this.controlValue) || {};
      },
      downArrow() {
        let activeIndex = this.activeHint.indexOf(true);
        let arr = this.activeHint.map((elem) => null);
        if (activeIndex >= 0) {
          this.activeHint[activeIndex] = null;
        }
        if (++activeIndex > this.activeHint.length - 1) {
          activeIndex = 0;
        }
        arr[activeIndex] = true;
        //lightlight hint
        this.activeHint = arr;
        //set active user
        this.activeUser =
          this.users.find((user) => user.TEXT === this.controlValue) || {};
      },
      focusInput() {
        this.compare = this.controlValue;
      },
      blurInput(e) {
        if (e.target.value !== '') {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
        setTimeout(() => {
          this.users = [];
        }, 200);

        setTimeout(() => {
          this.validate();
        }, 100);

        this.$store.dispatch('validateControl', {
          formControl: this.formControl,
          blockIndex: this.blockIndex,
          controlIndex: this.formControlIndex,
        });

        // if (this.controlValue !== this.compare) {
        //   bitrixLogs(6, `${this.formControl.label}: ${this.controlValue}`);
        // }
      },
      clickHint(e) {
        this.setInvalid(false);

        let id = e.target.getAttribute('data-id');
        if (!id) {
          id = e.target.parentNode.getAttribute('data-id');
        }
        this.activeUser = this.users.find((user) => user.ID === id) || {};
        this.setValue();
        this.users = [];
      },
      enterInput() {
        this.setInvalid(false);
        //check if there is an active hint
        let activeIndex = this.activeHint.indexOf(true);
        if (activeIndex >= 0) {
          this.activeUser = this.users[activeIndex] || {};
        } else {
          //if not
          this.activeUser =
            this.users.find(
              (user) => user.TEXT.search(this.controlValue) >= 0
            ) || {};
        }
        this.controlValue = this.activeUser.TEXT ? this.activeUser.TEXT : '';
        this.users = [];
      },
      clearInput() {
        this.controlValue = '';
        this.activeHint = [];
        this.activeUser = {};
        this.isActive = false;

        setTimeout(() => {
          this.validate();
        }, 0);
      },
      validate() {
        if (
          this.formControl.pattern &&
          this.controlValue !== '' &&
          !new RegExp(this.formControl.pattern, 'ig').test(this.controlValue)
        ) {
          this.setInvalid(true);
        } else {
          if (this.formControl.required && !this.activeUser.ID) {
            //else if there is no id, then send request
            (async () => {
              try {
                let response = await fetch(
                  `${this.$store.state.ornzControlURL}?s=${this.controlValue}`,
                  {
                    headers: {
                      Authentication: 'secret',
                    },
                  }
                );
                let result = await response.json();

                if (typeof result === 'object' && result[0]) {
                  this.setInvalid(false);
                  this.activeUser = result[0];
                } else {
                  this.setInvalid(true);
                }
                this.setValue();
              } catch (err) {
                throw err;
              }
            })();
          } else {
            this.setInvalid(false);
          }
        }
      },
    },
  });

  //button
  Vue.component('wizardStepButton', {
    data() {
      return {};
    },
    props: ['step'],
    template: `
      <div class="b-scc-step__button" v-if="step.button">
        <div class="btn btn-primary btn-lg" :class="{'btn--load-circle': $store.state.loading}" @click.prevent="submitStep">{{ step.button.text }}</div>
      </div>
    `,
    methods: {
      submitStep() {
        this.$store.dispatch('submitStep', { button: this.step.button });
      },
    },
  });

  //lesson
  Vue.component('wizardLesson', {
    data() {
      return {};
    },
    props: ['block', 'blockIndex', 'lesson', 'lessonIndex'],
    template: `
      <div>
        <div class="b-scc-step__block">
          <div class="b-scc-step__block-delete">
            <transition name="fade">
              <a class="btn-delete" :class="{'btn--load-circle': lesson.deleteLoading}" href="" v-if="block.lessons.length>0" @click.prevent="deleteLesson()"></a>
            </transition>
          </div>
          <div class="b-scc-step__block-title">Занятие {{ lessonIndex + 1 }}</div>
          <div class="row">
            <div class="col-lg-6">
              <form-control-textarea :blockIndex="blockIndex" :lessonIndex="lessonIndex" :formControl="lesson.controls[0]" formControlIndex="0"></form-control-textarea>
              <form-control-date :blockIndex="blockIndex" :lessonIndex="lessonIndex" :formControl="lesson.controls[1]" formControlIndex="1"></form-control-date>
              <form-control :blockIndex="blockIndex" :lessonIndex="lessonIndex" :formControl="lesson.controls[2]" formControlIndex="2"></form-control>
              <form-control-textarea :blockIndex="blockIndex" :lessonIndex="lessonIndex" :formControl="lesson.controls[3]" formControlIndex="3"></form-control-textarea>
            </div>
            <div class="col-lg-6">
              <form-control-select :blockIndex="blockIndex" :lessonIndex="lessonIndex" :formControl="lesson.controls[4]" formControlIndex="4"></form-control-select>
              <form-control-select :blockIndex="blockIndex" :lessonIndex="lessonIndex" :formControl="lesson.controls[5]" formControlIndex="5"></form-control-select>
              <div class="row">
                <div class="col-lg-4">
                  <form-control :formControl="lesson.controls[6]" :blockIndex="blockIndex" :lessonIndex="lessonIndex" formControlIndex="6" time="true"></form-control>
                </div>
                <div class="col-lg-4">
                  <form-control :formControl="lesson.controls[7]" :blockIndex="blockIndex" :lessonIndex="lessonIndex" formControlIndex="7" time="true"></form-control>
                </div>
                <div class="col-lg-4">
                  <form-control :formControl="lesson.controls[8]" :blockIndex="blockIndex" :lessonIndex="lessonIndex" formControlIndex="8"></form-control>
                </div>
              </div>
              <form-control :blockIndex="blockIndex" :lessonIndex="lessonIndex" :formControl="lesson.controls[9]" formControlIndex="9"></form-control>
            </div>
          </div>
        </div>
        <hr>
      </div>
    `,
    methods: {
      deleteLesson() {
        this.$store.commit('changeLessonLoading', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          lessonIndex: this.lessonIndex,
          type: 'delete',
          value: true,
        });
        this.$store.dispatch('deleteLesson', {
          blockId: this.block.id,
          lessonId: this.lesson.id,
        });
      },
    },
  });

  //collapse block
  Vue.component('wizardCollapseBlock', {
    data() {
      return {
        slide: false,
        open: false,
      };
    },
    props: ['block', 'blockIndex'],
    computed: {
      invalid() {
        let first;

        if (this.block.lessons) {
          this.block.lessons.forEach((lesson, lessonIndex) => {
            if (!first) {
              let a = find(lesson);
              if (a) {
                first = { ...a, blockIndex: this.blockIndex, lessonIndex };
              }
            }
          });
        } else {
          if (!first) {
            let a = find(block);
            if (a) {
              first = { ...find(this.block), blockIndex: this.blockIndex };
            }
          }
        }

        function find(controlsSet) {
          return controlsSet.controls.find(
            (formControl) => formControl.invalid === true
          );
        }

        return !!first;
      },
    },
    template: `
      <div class="b-collapse-vc" :class="{slide: slide, open: open, invalid: invalid}" id="collapse2">
        <div class="b-collapse-vc__head" @click.stop.prevent="toggleBody()">
          <a href="" @click.prevent>{{ $store.state.steps[1].blocks[blockIndex].controls[0].value }}</a>
          <span></span>
        </div>
        <transition @enter="enter" @leave="leave" :css="false">
          <div class="b-collapse-vc__body" v-if="slide">

            <wizard-multylesson :block="block" :blockIndex="blockIndex"></wizard-multylesson>

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
      generateKey(index) {
        return Date.now() * Math.random() + index;
      },
      clickEdit(taskId) {
        //open modal
        $('#editStudyCourseModal').modal('show');
        store.commit('changeProp', { prop: 'loading', value: true });
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

  //multylesson
  Vue.component('wizardMultylesson', {
    data() {
      return {};
    },
    props: ['block', 'blockIndex'],
    template: `
      <div class="b-scc-step__multyblock">

        <div v-if="block.lessons">
          <wizard-lesson v-for="(lesson, lessonIndex) in block.lessons" :block="block" :blockIndex="blockIndex" :lesson="lesson" :lessonIndex="lessonIndex" :key="generateKey(lessonIndex)"></wizard-lesson>
        </div>
        
        <div class="b-scc-step__block-add">
          <button class="btn btn-success btn-md" @click.prevent="addLesson()" :class="{'btn--load-circle': block.addLoading}">Добавить</button>
        </div>
      </div>
    `,
    methods: {
      addLesson() {
        let stepIndex = this.$store.getters.activeStepIndex;
        let blockIndex = this.$store.state.steps[stepIndex].blocks.findIndex(
          (b) => b.id === this.block.id
        );
        this.$store.commit('changeLessonLoading', {
          stepIndex,
          blockIndex,
          type: 'add',
          value: true,
        });
        this.$store.dispatch('addLesson', { blockIndex: this.blockIndex });
      },
      generateKey(index) {
        return Date.now() * Math.random() + index;
      },
    },
  });

  //block
  Vue.component('wizardBlock', {
    data() {
      return {};
    },
    props: ['step', 'block', 'blockIndex'],
    template: `
      <div>
        <div class="b-scc-step__block">
          <div class="b-scc-step__block-delete">
            <transition name="fade">
              <a class="btn-delete" :class="{'btn--load-circle': block.deleteLoading}" href="" v-if="step.blocks.length>0" @click.prevent="deleteBlock(block.id)"></a>
            </transition>
          </div>
          <div class="b-scc-step__block-title">Блок {{ blockIndex + 1 }}</div>
          <div class="b-scc-step__block-controls">
            <div v-for="(formControl, formControlIndex) in block.controls">

              <form-control-textarea v-if="formControl.type==='textarea'" :blockIndex="blockIndex" :formControl="formControl" :formControlIndex="formControlIndex"></form-control-textarea>

              <form-control-ornz v-else-if="formControl.type==='ornz'" :blockIndex="blockIndex" :formControl="formControl" :formControlIndex="formControlIndex"></form-control-ornz>

              <form-control v-else :blockIndex="blockIndex" :formControl="formControl" :formControlIndex="formControlIndex"></form-control>

            </div>
          </div>
        </div>
        <hr>
      </div>
    `,
    methods: {
      deleteBlock(blockId) {
        this.$store.commit('changeBlockLoading', {
          stepIndex: this.$store.getters.activeStepIndex,
          blockIndex: this.blockIndex,
          type: 'delete',
          value: true,
        });
        this.$store.dispatch('deleteBlock', {
          blockId,
        });
      },
    },
  });

  //multyblock
  Vue.component('wizardMultyblock', {
    data() {
      return {};
    },
    props: ['step'],
    template: `
      <div class="b-scc-step__multyblock">

        <div v-if="step.blocks">
          <wizard-block v-for="(block, blockIndex) in step.blocks" :step="step" :block="block" :blockIndex="blockIndex" :key="generateKey(blockIndex)"></wizard-block>
        </div>
        
        <div class="b-scc-step__block-add">
          <button class="btn btn-success btn-md" @click.prevent="addBlock()" :class="{'btn--load-circle': step.addLoading}">Добавить</button>
        </div>
      </div>
    `,
    methods: {
      addBlock() {
        this.$store.commit('changeBlockLoading', {
          stepIndex: this.$store.getters.activeStepIndex,
          type: 'add',
          value: true,
        });
        this.$store.dispatch('addBlock');
      },
      generateKey(index) {
        return Date.now() * Math.random() + index;
      },
    },
  });

  //step 1
  Vue.component('wizardStep1', {
    data() {
      return {};
    },
    props: ['step'],
    template: `
      <div class="b-scc-step">

        <h3>{{ step.title }}</h3>
        <div class="b-scc-step__error" v-if="$store.state.error">{{ $store.state.error }}</div>
        <p v-html="step.description"></p>
        <hr>
        <div class="b-scc-step__controls">
          <div v-for="(formControl, formControlIndex) in step.controls">

            <form-control-textarea v-if="formControl.type==='textarea'" :formControl="formControl" :formControlIndex="formControlIndex"></form-control-textarea>

            <form-control-ornz v-else-if="formControl.type==='ornz'" :formControl="formControl" :formControlIndex="formControlIndex"></form-control-ornz>

            <form-control-select v-else-if="formControl.type==='select'" :formControl="formControl" :formControlIndex="formControlIndex"></form-control-select>

            <form-control v-else :formControl="formControl" :formControlIndex="formControlIndex"></form-control>

          </div>
        </div>

        <wizard-step-button :step="step"></wizard-step-button>
      </div>
    `,
  });

  //step 2
  Vue.component('wizardStep2', {
    data() {
      return {};
    },
    props: ['step'],
    template: `
      <div class="b-scc-step">

        <h3>{{ step.title }}</h3>
        <div class="b-scc-step__error" v-if="$store.state.error">{{ $store.state.error }}</div>
        <p v-html="step.description"></p>

        <wizard-multyblock :step="step"></wizard-multyblock>

        <wizard-step-button :step="step"></wizard-step-button>
      </div>
    `,
  });

  //step 3
  Vue.component('wizardStep3', {
    data() {
      return {};
    },
    props: ['step'],
    template: `
      <div class="b-scc-step">

        <h3>{{ step.title }}</h3>
        <div class="b-scc-step__error" v-if="$store.state.error">{{ $store.state.error }}</div>
        <p v-html="step.description"></p>
        
        <wizard-collapse-block v-for="(block, blockIndex) in step.blocks" :step="step" :block="block" :blockIndex="blockIndex"></wizard-collapse-block>

        <wizard-step-button :step="step"></wizard-step-button>
      </div>
    `,
  });

  //navigation
  Vue.component('wizardNavigation', {
    data() {
      return {};
    },
    template: `
      <div class="b-scc-nav">
        <div class="b-scc-nav__item" v-for="(step, stepIndex) in $store.state.steps" :class="{'b-scc-nav__item--active': step.active, 'b-scc-nav__item--visited': step.visited}">
          <a href="" @click.prevent="changeStep(stepIndex)">{{ step.title }}</a>
        </div>
      </div>
    `,
    methods: {
      changeStep(stepIndex) {
        this.$store.dispatch('submitStep', { stepIndex });
      },
    },
  });

  const App = {
    el: '#studyCoursesCreateWizard',
    store,
    template: `
      <div :class="{'b-study-courses-create--loading': $store.state.loading}">
        <wizard-navigation></wizard-navigation>
        <component :is="'wizard-step' + ($store.getters.activeStepIndex + 1)" :step="$store.state.steps[ $store.getters.activeStepIndex ]"></component>
      </div>
    `,
    methods: {},
    mounted() {},
  };

  const app = new Vue(App);
};
