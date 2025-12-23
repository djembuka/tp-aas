window.onload = function () {
  //set checked
  if (
    window.pollStore &&
    window.localStorage.getItem(window.pollStore.pollId)
  ) {
    let storageObj = JSON.parse(
      window.localStorage.getItem(window.pollStore.pollId)
    );
    window.pollStore.groups.forEach(function (group) {
      group.questions.forEach(function (question) {
        if (question.type === 'number') {
          question.answers.forEach(function (answer) {
            if (storageObj[answer.name] !== undefined) {
              answer.value = storageObj[answer.name];
            }
          });
        } else {
          question.answers.forEach(function (answer) {
            if (storageObj[answer.value] !== undefined) {
              answer.checked = storageObj[answer.value];
            }
          });
        }
      });
    });
  }

  //enable submit button
  document
    .querySelector('.b-poll .b-checkbox [type="checkbox"]')
    .addEventListener('change', function (e) {
      if (e.target.checked) {
        document
          .querySelector('.b-poll__submit .btn')
          .removeAttribute('disabled');
      } else {
        document
          .querySelector('.b-poll__submit .btn')
          .setAttribute('disabled', true);
      }
    });

  //poll vue application
  if (!window.Vue && !window.Vuex) return;

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: window.pollStore,
    mutations: {
      changeChecked(state, payload) {
        state.groups[payload.groupIndex].questions[
          payload.questionIndex
        ].answers[payload.answerIndex].checked = payload.checked;
      },
      changeCheckedNum(state, payload) {
        state.groups[payload.groupIndex].questions[
          payload.questionIndex
        ].checkedNum = payload.checkedNum;
      },
      setActiveQuestion(state, payload) {
        this.commit('removeActiveQuestion');
        state.groups[payload.groupIndex].questions[
          payload.questionIndex
        ].isActive = true;
      },
      removeActiveQuestion(state) {
        state.groups.forEach(function (group) {
          group.questions.forEach(function (question) {
            question.isActive = false;
          });
        });
      },
    },
  });

  Vue.component('formControlCheckbox', {
    data() {
      return {
        checked: this.answer.checked,
      };
    },
    props: ['groupIndex', 'questionIndex', 'answerIndex', 'answer'],
    template: `<label class="b-poll__form-control" :class="[{'i-active': checked}, {'i-disabled': getDisabledClass()}]">
      <div class="b-poll__form-control__content">
        <div class="b-poll__form-control__img" :style="getStyle()" v-if="answer.img"></div>
        <div class="b-poll__form-control__text"><b v-html="answer.label"></b><span v-html="answer.note"></span></div>
      </div>
      <div class="b-poll__checkbox"><input type="checkbox" :name="answer.name" v-model="checked" :value="answer.value" class="filled-in" @change="change()"><span></span></div>
    </label>`,
    methods: {
      change() {
        //emit control change
        this.$emit('form-control-change', {
          checked: this.checked,
          answerIndex: this.answerIndex,
        });

        //set question as active
        store.commit('setActiveQuestion', {
          groupIndex: this.groupIndex,
          questionIndex: this.questionIndex,
        });

        //change local storage
        let storageObj = {};
        if (window.localStorage.getItem(store.state.pollId)) {
          storageObj = JSON.parse(
            window.localStorage.getItem(store.state.pollId)
          );
        }

        storageObj[this.answer.value] = this.checked;
        window.localStorage.setItem(
          store.state.pollId,
          JSON.stringify(storageObj)
        );
      },
      getDisabledClass() {
        return (
          this.checked === false &&
          store.state.groups[this.groupIndex].questions[this.questionIndex]
            .allowed ===
            store.state.groups[this.groupIndex].questions[this.questionIndex]
              .checkedNum
        );
      },
      getStyle() {
        return "background-image: url('" + this.answer.img + "')";
      },
    },
  });

  Vue.component('formControlRadio', {
    data() {
      return {
        checked: this.answer.checked,
      };
    },
    props: ['answerIndex', 'answer'],
    template: `<label class="b-poll__form-control" :class="{'i-active': checked}">
      <div class="b-poll__form-control__content">
        <div class="b-poll__form-control__img" :style="getStyle()" v-if="answer.img"></div>
        <div class="b-poll__form-control__text"><b v-html="answer.label"></b><span v-html="answer.note"></span></div>
      </div>
      <div class="b-poll__radio"><input type="radio" :name="answer.name" :checked="checked" :value="answer.value" class="with-gap" @change="change"><span></span></div>
    </label>
    `,
    methods: {
      change(e) {
        if (e.target.checked) {
          e.target
            .closest('.b-poll__questions__set')
            .querySelectorAll('label')
            .forEach(function (label) {
              //set inactive
              label.classList.remove('i-active');
            });
          e.target.closest('label').classList.add('i-active');
        }

        //set question as active
        store.commit('removeActiveQuestion');

        //set checked
        this.checked = true;

        //change local storage
        let storageObj = {};
        if (window.localStorage.getItem(store.state.pollId)) {
          storageObj = JSON.parse(
            window.localStorage.getItem(store.state.pollId)
          );
        }

        if (e.target.checked) {
          //sibling radios
          e.target
            .closest('.b-poll__questions__set')
            .querySelectorAll('input[type=radio]')
            .forEach(function (radio) {
              storageObj[radio.value] = radio.checked;
            });
          //this radio
          storageObj[this.answer.value] = this.checked;
        }

        window.localStorage.removeItem(store.state.pollId);
        window.localStorage.setItem(
          store.state.pollId,
          JSON.stringify(storageObj)
        );
      },
      getStyle() {
        return "background-image: url('" + this.answer.img + "')";
      },
    },
  });

  Vue.component('formControlNumber', {
    data() {
      return {};
    },
    props: ['answerIndex', 'answer'],
    template: `<div class="b-poll__form-control">
      <div class="b-poll__form-control__content">
        <div class="b-poll__form-control__img" :style="getStyle()" v-if="answer.img"></div>
        <div class="b-poll__form-control__text"><b v-html="answer.title"></b><span v-html="answer.note"></span></div>
      </div>
      <div class="b-poll__input b-float-label">
        <label class="b-poll__input-label active">{{answer.label}}</label>
        <input type="number" :name="answer.name" v-model="answer.value" @change="change">
      </div>
    </div>
    `,
    methods: {
      change(e) {
        e.target.parentNode.classList.add('i-active');

        //set question as active
        store.commit('removeActiveQuestion');

        //change local storage
        let storageObj = {};
        if (window.localStorage.getItem(store.state.pollId)) {
          storageObj = JSON.parse(
            window.localStorage.getItem(store.state.pollId)
          );
        }

        storageObj[this.answer.name] = this.answer.value;

        window.localStorage.removeItem(store.state.pollId);
        window.localStorage.setItem(
          store.state.pollId,
          JSON.stringify(storageObj)
        );
      },
      getStyle() {
        return "background-image: url('" + this.answer.img + "')";
      },
    },
  });

  Vue.component('docComponent', {
    data() {
      return {};
    },
    props: {
      doc: {
        type: Object,
        default: () => ({
          id: 123,
          name: 'Протокол заседания дисицплинарной комиссии 234',
          href: '/pages/Протокол заседания дисицплинарной комиссии 234.pdf',
          size: 654000,
          date: '15 января 2020',
          author: 'Азарянц Ашот Александрович',
          icon: '/template/images/pdf.svg',
          remove: false
        }),
      },
    },
    template: `
      <div class="twpx-doc twpx-doc--button">
        <div class="twpx-doc__body">
          <a class="twpx-doc__icon" :href="doc.href" :style="getStyle()" target="_blank"></a>
          <span class="twpx-doc__text">
            <a v-if="doc.name" class="twpx-doc__name" :href="doc.href" target="_blank">{{ doc.name }}</a>
            <span class="twpx-doc__data">
              <span v-if="doc.size && doc.href">{{ formatFileSize(doc.size) }} {{ getFileNameAndExt(doc.href).ext }}</span>
              <span v-if="doc.date">Дата публикации: {{ formatDateToRussian(doc.date) }}</span>
              <span v-if="doc.author">Автор: {{ doc.author }}</span>
            </span>
          </span>
        </div>
      </div>
    `,
    methods: {
      formatDateToRussian(dateString) {
        const months = [
          'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
          'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        const date = new Date(dateString);
        if (isNaN(date)) return dateString; // если невалидная дата, возвращаем как есть
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      },
      getStyle() {
        return `background-image: url(${this.doc.icon})`;
      },
      getFileNameAndExt(path) {
        // Получаем только имя файла с расширением
        const fileNameWithExt = path.split('/').pop();
        // Находим позицию последней точки
        const lastDotIndex = fileNameWithExt.lastIndexOf('.');
        if (lastDotIndex === -1) {
          // Если точки нет, возвращаем всё как имя, расширение — пустая строка
          return { name: fileNameWithExt, ext: '' };
        }
        // Имя файла без расширения
        const name = fileNameWithExt.substring(0, lastDotIndex);
        // Расширение с точкой
        const ext = fileNameWithExt.substring(lastDotIndex);
        return { name, ext };
      },
      formatFileSize(bytes) {
        if (bytes === 0) return '0 б';
        const units = ['Б', 'Кб', 'Мб', 'Гб', 'Тб'];
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const size = bytes / Math.pow(k, i);
        // Для Мб и выше округляем до одного знака после запятой, для Кб и ниже — до целых
        if (i >= 2) {
          return `${size.toFixed(1)} ${units[i]}`;
        } else {
          return `${Math.round(size)} ${units[i]}`;
        }
      }
    },
  });

  Vue.component('question', {
    data() {
      return {
        timeoutId: undefined,
        animatePulse: false,
      };
    },
    props: ['groupIndex', 'questionIndex', 'question'],
    template: `
    <div class="b-poll__questions__item" :id="'item_' + groupIndex + '_' + questionIndex">
      <div class="b-poll__questions__info" :class="getInfoClass()" v-if="question.allowed">{{question.checkedNum}} из {{question.allowed}}</div>

      <h3>{{question.title}}</h3>
      <p v-html="question.description"></p>
      <hr class="hr--lg" />
      <div class="b-poll__questions__note" :class="getNoteClass()" v-if="question.type === 'checkbox' && question.allowed"><div>Выбрано {{question.checkedNum}} из допустимых {{question.allowed}}</div></div>

      <div class="twpx-poll-question-item__files" v-if="question.files">
        <doc-component v-for="doc in question.files" :doc="doc" />
      </div>

      <div class="b-poll__questions__set">
        <div v-for="(answer, answerIndex) in question.answers">
          <form-control-checkbox v-if="question.type === 'checkbox'" :answer="answer" :groupIndex="groupIndex" :questionIndex="questionIndex" :answerIndex="answerIndex" @form-control-change="formControlChange"></form-control-checkbox>
          <form-control-radio v-else-if="question.type === 'radio'" :answer="answer" :answerIndex="answerIndex"></form-control-radio>
          <form-control-number v-else-if="question.type === 'number'" :answer="answer" :answerIndex="answerIndex"></form-control-number>
        </div>
      </div>

    </div>
    `,
    methods: {
      getInfoClass() {
        return {
          'i-show':
            store.state.groups[this.groupIndex].questions[this.questionIndex]
              .checkedNum > 0 &&
            store.state.groups[this.groupIndex].questions[this.questionIndex]
              .isActive,
          'bg-success':
            store.state.groups[this.groupIndex].questions[this.questionIndex]
              .allowed ===
            store.state.groups[this.groupIndex].questions[this.questionIndex]
              .checkedNum,
          animate__animated: true,
          animate__pulse: this.animatePulse,
        };
      },
      getNoteClass() {
        return {
          'text-success':
            store.state.groups[this.groupIndex].questions[this.questionIndex]
              .allowed ===
            store.state.groups[this.groupIndex].questions[this.questionIndex]
              .checkedNum,
          'text-danger':
            store.state.groups[this.groupIndex].questions[this.questionIndex]
              .checkedNum === 0,
        };
      },
      formControlChange(obj) {
        //commit checked
        store.commit('changeChecked', {
          groupIndex: this.groupIndex,
          questionIndex: this.questionIndex,
          answerIndex: obj.answerIndex,
          checked: obj.checked,
        });

        //change checked num
        this.changeCheckedNum();

        //animate the block
        this.animatePulse = false;
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => (this.animatePulse = true), 0);
      },
      changeCheckedNum() {
        let num = 0;
        store.state.groups[this.groupIndex].questions[
          this.questionIndex
        ].answers.forEach(function (answer) {
          if (answer.checked === true) {
            num++;
          }
        });

        store.commit('changeCheckedNum', {
          groupIndex: this.groupIndex,
          questionIndex: this.questionIndex,
          checkedNum: num,
        });
      },
    },
    mounted() {
      this.changeCheckedNum();

      /*let observer = new IntersectionObserver((entries, observer) => {
        //console.log('item_' + this.questionIndex, observer);
        let entry = entries[0];

        if (entry.intersectionRatio > 0) {
          entry.target.classList.add('b-poll__questions__item--fixed');
        } else {
          entry.target.classList.remove('b-poll__questions__item--fixed');
        }
      });

      observer.observe(
        document.querySelector(`#item_${this.groupIndex}_${this.questionIndex}`)
      );*/
    },
  });

  let pollApp = new Vue({
    el: '#pollQuestions',
    store,
    data() {
      return {
        pollData: store.state,
      };
    },
    template: `
      <div class="b-poll__groups" :data-id="$store.state.pollId">
        <div class="b-poll__groups__item" v-for="(group, groupIndex) in pollData.groups">
          <h2>{{group.title}}</h2>
          <p v-html="group.description"></p>
          <hr>
          <div class="b-poll__questions">
            <div v-for="(question, questionIndex) in group.questions">
              <question :groupIndex="groupIndex" :questionIndex="questionIndex" :question="question" ></question>
            </div>
          </div>
        </div>
      </div>
    `,
    methods: {},
  });
};
