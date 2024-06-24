window.appealIndexStore = {
  timeout: 2000,
  paths: {
    getTable: '/components/appeal.inbox/table.json',
    getNewNum: '/components/appeal.inbox/newNum.json',
    getSelected: '/components/appeal.inbox/selected.json',
    src: '/template/images/',
  },
  numBlocks: [
    {
      new: true,
      title: 'Новые',
      num: 78,
    },
    {
      title: 'Завершены сегодня',
      num: 15,
    },
    {
      title: 'Завершены за месяц',
      num: 254,
    },
    {
      selected: true,
      title: 'Выбрано',
      num: null,
    },
  ],
  filter: {
    controls: [
      {
        code: 'id',
        count: 1,
        type: 'text',
        label: 'Номер (ID)',
        name: 'ID',
        value: '',
      },
      {
        code: 'object',
        count: 3,
        type: 'text',
        label: 'Объект изменений',
        name: 'OBJECT',
        value: '',
      },
      {
        code: 'author',
        count: 3,
        type: 'text',
        label: 'Автор (ФИО, ОРНЗ)',
        name: 'AUTHOR',
        value: '',
      },
      {
        code: 'status',
        type: 'select',
        label: 'Статус обращения',
        name: 'STATUS',
        newOptionCode: 'prop1',
        options: [
          {
            label: 'Все',
            code: '',
          },
          {
            label: 'Ожидает рассмотрения',
            code: 'prop1',
          },
          {
            label: 'Отклоненные',
            code: 'prop2',
          },
          {
            label: 'В работе',
            code: 'prop3',
          },
          {
            label: 'Выполненые',
            code: 'prop4',
          },
        ],
        selected: {
          label: 'Все',
          code: '',
        },
      },
      {
        code: 'type',
        type: 'select',
        label: 'Тип обращения',
        name: 'TYPE',
        options: [
          {
            label: 'Все',
            code: '',
          },
          {
            label: 'Изменение в реестре',
            code: 'prop5',
          },
          {
            label: 'Жалоба',
            code: 'prop6',
          },
          {
            label: 'Заявка',
            code: 'prop7',
          },
        ],
        selected: {
          label: 'Все',
          code: '',
        },
      },
      {
        code: 'date',
        type: 'date',
        label: 'Дата',
        name: 'DATE',
        value: [null, null],
      },
    ],
  },
  table: {
    html: '',
    PAGEN_1: 1,
    sortField: '',
    sortType: '',
  },
  query: {
    sortField: '',
    sortType: '',
    PAGEN_1: '',
  },
};
