window.studyCoursesForEmployeesStore = {
  timeout: 2000,
  paths: {
    getTable: '/components/study.courses.for-employees/table.json?format=json',
    src: '/template/images/',
  },
  quickFilterBlocks: [
    {
      code: 'all',
      title: 'Все курсы',
      num: 185,
    },
    {
      code: 'current-year',
      title: 'Текущий год',
      num: 12,
    },
    {
      code: 'current-month',
      title: 'Текущий месяц',
      num: 2,
    },
  ],
  filter: {
    controls: [
      {
        code: 'number',
        count: 1,
        type: 'text',
        label: 'Номер курса',
        name: 'NUMBER',
        value: '',
      },
      {
        code: 'umc',
        count: 3,
        type: 'text',
        label: 'УМЦ',
        name: 'UMC',
        value: '',
      },
      {
        code: 'status',
        type: 'select',
        label: 'Статус курса',
        name: 'STATUS',
        newOptionCode: 'prop1',
        options: [
          {
            label: 'Черновик',
            code: 'prop1',
          },
          {
            label: 'На проверке',
            code: 'prop2',
          },
          {
            label: 'Активные',
            code: 'prop3',
          },
          {
            label: 'Отмененные',
            code: 'prop4',
          },
          {
            label: 'Архивные',
            code: 'prop5',
          },
        ],
        selected: {
          label: 'Черновик',
          code: 'prop1',
        },
      },
      {
        code: 'date',
        type: 'date',
        label: 'Выбрать дату',
        name: 'DATE',
        value: [null, null],
      },
    ],
  },
  table: {
    html: '',
    locationSearch: '',
    sortField: '',
    sortType: '',
    PAGEN_1: 1,
  },
  query: {
    sortField: '',
    sortType: '',
    locationSearch: '',
    PAGEN_1: '',
  },
};
