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
        question.answers.forEach(function (answer) {
          if (storageObj[answer.value] !== undefined) {
            answer.checked = storageObj[answer.value];
          }
        });
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
      <div class="b-poll__questions__note" :class="getNoteClass()" v-if="question.type === 'checkbox' && question.allowed"><div>Выбрано {{question.checkedNum}} из допустимых {{question.allowed}}</div></div>

      <div class="b-poll__questions__set">
        <div v-for="(answer, answerIndex) in question.answers">
          <form-control-checkbox v-if="question.type === 'checkbox'" :answer="answer" :groupIndex="groupIndex" :questionIndex="questionIndex" :answerIndex="answerIndex" @form-control-change="formControlChange"></form-control-checkbox>
          <form-control-radio v-else :answer="answer" :answerIndex="answerIndex"></form-control-radio>
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
          <h3>{{group.title}}</h3>
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
