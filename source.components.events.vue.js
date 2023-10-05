Vue.component('form-control-date', {
  template: `<div id="events-menu-calendar" class="b-events__menu-calendar" style="background-image: url('/template/images/calendar.svg')"><a href="">За определённый срок</a><date-picker :lang="lang" v-model="dateRange" value-type="X" range format="DD.MM.YYYY" @input="inputDateRange"></date-picker></div>`,
  data() {
    return {
      dateRange: ['1620853200'],
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
  methods: {
    inputDateRange() {
      window.location = `?start=${this.dateRange[0]}&end=${this.dateRange[1]}`;
    },
  },
});

var vm = new Vue({
  el: '#events-menu-calendar',
  template: '<form-control-date ref="calendar"></form-control-date>',
  mounted() {
    const urlData = parseQuery(window.location.search);
    if (urlData.start && urlData.end) {
      this.$refs.calendar.dateRange = [urlData.start, urlData.end];
    }
  },
});

function getQuery(queryObject) {
  var result = [];
  for (var k in queryObject) {
    result.push(k + '=' + queryObject[k]);
  }
  return '?' + result.join('&');
}

function parseQuery(queryString) {
  var query = {};
  var pairs = (queryString[0] === '?'
    ? queryString.substr(1)
    : queryString
  ).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}
